import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { CuiIconComponent } from '@votha-sok/ui-icons';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'p-select',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ScrollingModule, CuiIconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiSelectComponent),
    multi: true,
  }],
})
export class CuiSelectComponent<T = string> implements ControlValueAccessor {
  private static nextId = 0;
  readonly fieldId = `p-select-${++CuiSelectComponent.nextId}`;

  readonly label       = input<string>('');
  readonly options     = input<SelectOption<T>[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly multiple    = input<boolean>(false);
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly variant     = input<'outline'|'fill'>('outline');

  /** Shows a search box at the top of the options panel. */
  readonly filter       = input<boolean>(false);
  /** Shows a button to clear the current selection. */
  readonly showClear    = input<boolean>(false);
  /** Renders a free-text input (with a suggestion list) instead of a closed dropdown trigger. */
  readonly editable     = input<boolean>(false);
  /** Wraps the (ungrouped) option list in a CDK virtual-scroll viewport for large lists. */
  readonly virtualScroll = input<boolean>(false);
  readonly virtualItemSize = input<number>(36);

  readonly value = model<T | T[] | null>(null);
  readonly cuiChange = output<T | T[] | null>();
  readonly onFilter  = output<string>();
  readonly onShow    = output<void>();
  readonly onHide    = output<void>();

  private _onChange: (v: T | T[] | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly filterText = signal('');

  /** Group options by their `group` property. */
  readonly groupedOptions = computed(() => {
    const opts = this.options();
    const groups = new Map<string, SelectOption<T>[]>();
    const ungrouped: SelectOption<T>[] = [];
    for (const o of opts) {
      if (o.group) {
        const g = groups.get(o.group) ?? [];
        g.push(o);
        groups.set(o.group, g);
      } else {
        ungrouped.push(o);
      }
    }
    return { ungrouped, groups: Array.from(groups.entries()) };
  });

  readonly filteredUngrouped = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    const list = this.groupedOptions().ungrouped;
    return q ? list.filter((o) => o.label.toLowerCase().includes(q)) : list;
  });

  readonly filteredGroups = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    const groups = this.groupedOptions().groups;
    if (!q) return groups;
    return groups
      .map(([name, opts]) => [name, opts.filter((o) => o.label.toLowerCase().includes(q))] as [string, SelectOption<T>[]])
      .filter(([, opts]) => opts.length > 0);
  });

  readonly hasValue = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v.length > 0 : v != null;
  });

  readonly editableSuggestions = computed(() => this.options());

  onChange(v: T | T[] | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  onEditableInput(text: string): void {
    const match = this.options().find((o) => o.label === text);
    this.onChange((match ? match.value : (text as unknown as T)));
  }

  onFilterInput(text: string): void {
    this.filterText.set(text);
    this.onFilter.emit(text);
  }

  clear(e: Event): void {
    e.stopPropagation();
    this.onChange(this.multiple() ? [] : null);
  }

  opened(): void { this.onShow.emit(); }

  closed(): void {
    this.filterText.set('');
    this.onTouched();
    this.onHide.emit();
  }

  writeValue(v: T | T[] | null): void     { this.value.set(v); }
  registerOnChange(fn: (v: T | T[] | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void  { this._onTouched = fn; }
  setDisabledState(_: boolean): void       { }

  onTouched(): void { this._onTouched(); }
}
