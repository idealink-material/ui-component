import {
  ChangeDetectionStrategy, Component, computed, signal, ElementRef,
  forwardRef, input, model, output, contentChild, viewChild, AfterViewInit, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { CuiIconComponent } from '@idealink-material/ui-icons';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Anything the select can render as an option: a proper `SelectOption`, or a plain
 * record read via `optionLabel`/`optionValue` (e.g. a domain model like `ChartOfAccountModel`).
 */
export type SelectOptionLike<T = string> = SelectOption<T> | Record<string, unknown>;

/** Template context available to `#item` / `#selectedItem` templates via `let-x`. */
export interface SelectItemContext<T> {
  $implicit: SelectOptionLike<T>;
}

@Component({
  selector: 'p-select',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatSelectModule, ScrollingModule,
    CuiIconComponent, NgTemplateOutlet,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiSelectComponent),
    multi: true,
  }],
})
export class CuiSelectComponent<T = string> implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;
  readonly fieldId = `p-select-${++CuiSelectComponent.nextId}`;

  readonly label       = input<string>('');
  readonly options     = input<SelectOptionLike<T>[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly multiple    = input<boolean>(false);
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly variant     = input<'outline'|'fill'>('outline');

  /** Identifier of the accessible input element. Falls back to an auto-generated id. */
  readonly inputId  = input<string | undefined>(undefined);
  /** When present, the field automatically gets focus on load. */
  readonly autofocus = input<boolean>(false);

  /** Whether the select is in loading state. */
  readonly loading     = input<boolean>(false);
  /** Icon to display in loading state. */
  readonly loadingIcon = input<string>('progress_activity');

  /** Whether the selected option is shown with a check mark in the panel. */
  readonly checkmark   = input<boolean>(false);
  /** Icon to use for the dropdown trigger instead of the default arrow. */
  readonly dropdownIcon = input<string | undefined>(undefined);

  /**
   * Name of the label field of an option, for options that aren't shaped like
   * `SelectOption` (i.e. plain records). Defaults to `label`.
   */
  readonly optionLabel = input<string | undefined>(undefined);
  /**
   * Name of the value field of an option, for options that aren't shaped like
   * `SelectOption` (i.e. plain records). Defaults to `value`.
   */
  readonly optionValue = input<string | undefined>(undefined);
  /** A property to uniquely identify a value in options, used to compare values by key instead of by reference/equality. */
  readonly dataKey = input<string | undefined>(undefined);

  /** Shows a search box at the top of the options panel. */
  readonly filter       = input<boolean>(false);
  /** Placeholder text to show when the filter input is empty. */
  readonly filterPlaceholder = input<string>('Search…');
  /** Locale to use when filtering. Defaults to the host environment's current locale. */
  readonly filterLocale = input<string | undefined>(undefined);
  /** When filtering, decides which field or fields (comma separated) to search against. Defaults to optionLabel. */
  readonly filterBy     = input<string | undefined>(undefined);
  /** Fields used when filtering the options, defaults to optionLabel. Takes precedence over filterBy. */
  readonly filterFields = input<string[] | undefined>(undefined);
  /** Clears the filter value when hiding the select. */
  readonly resetFilterOnHide = input<boolean>(true);

  /** Shows a button to clear the current selection. */
  readonly showClear    = input<boolean>(false);
  /** Renders a free-text input (with a suggestion list) instead of a closed dropdown trigger. */
  readonly editable     = input<boolean>(false);
  /** Wraps the (ungrouped) option list in a CDK virtual-scroll viewport for large lists. */
  readonly virtualScroll = input<boolean>(false);
  readonly virtualItemSize = input<number>(36);

  /** Custom content for each option in the panel. Receives the option via `let-x`. */
  readonly itemTemplate = contentChild<TemplateRef<SelectItemContext<T>>>('item');
  /** Custom content for the selected value(s) shown in the closed trigger. Receives the option via `let-x`. */
  readonly selectedItemTemplate = contentChild<TemplateRef<SelectItemContext<T>>>('selectedItem');

  private readonly matSelectRef = viewChild(MatSelect);
  private readonly editableInputRef = viewChild<ElementRef<HTMLInputElement>>('editableInputRef');

  readonly value = model<T | T[] | null>(null);
  readonly cuiChange = output<T | T[] | null>();
  readonly onFilter  = output<string>();
  readonly onShow    = output<void>();
  readonly onHide    = output<void>();

  private _onChange: (v: T | T[] | null) => void = () => {};
  private _onTouched: () => void = () => {};

  /** True once the field has been blurred/closed at least once. Gates when `error` is actually shown. */
  readonly touched = signal(false);

  readonly hasError = computed(() => this.touched() && !!this.error());

  readonly resolvedInputId = computed(() => this.inputId() ?? this.fieldId);

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly filterText = signal('');

  /** Resolves the display label of an option, honoring `optionLabel` for plain-record options. */
  getOptionLabel(opt: SelectOptionLike<T>): string {
    const key = this.optionLabel() ?? 'label';
    return (opt as unknown as Record<string, string>)[key];
  }

  /**
   * Resolves the underlying value of an option, honoring `optionValue` for plain-record options.
   * PrimeNG-style fallback: when no `optionValue` key is set and the option itself has no
   * `value` property, the whole option object is used as the value (e.g. binding a full
   * domain model like `ProvinceModel` instead of a scalar id).
   */
  getOptionValue(opt: SelectOptionLike<T>): T {
    const key = this.optionValue() ?? 'value';
    const record = opt as unknown as Record<string, T>;
    return key in record ? record[key] : (opt as unknown as T);
  }

  /**
   * Reads `dataKey` off a value when it's an object, otherwise returns the value itself.
   * Lets `compareValues` match a primitive option value (e.g. `'high'`) against an object
   * model value (e.g. `{ value: 'high' }`), not just object-vs-object.
   */
  private keyOf(v: unknown, key: string): unknown {
    return v != null && typeof v === 'object' ? (v as Record<string, unknown>)[key] : v;
  }

  /** Compares two values, keying off `dataKey` when set rather than reference/equality. Bound as mat-select's `compareWith`. */
  readonly compareValues = (a: T, b: T): boolean => {
    const key = this.dataKey();
    if (!key) return a === b;
    return this.keyOf(a, key) === this.keyOf(b, key);
  };

  /** Which fields to search against when filtering — filterFields, then filterBy, then optionLabel. */
  private readonly resolvedFilterFields = computed<string[]>(() => {
    const fields = this.filterFields();
    if (fields?.length) return fields;
    const by = this.filterBy();
    if (by) return by.split(',').map((f) => f.trim()).filter(Boolean);
    return [this.optionLabel() ?? 'label'];
  });

  private normalize(text: string): string {
    const locale = this.filterLocale();
    return locale ? text.toLocaleLowerCase(locale) : text.toLowerCase();
  }

  private matchesFilter(opt: SelectOptionLike<T>, q: string): boolean {
    const needle = this.normalize(q);
    const record = opt as unknown as Record<string, unknown>;
    return this.resolvedFilterFields().some((field) => {
      const v = record[field];
      return v != null && this.normalize(String(v)).includes(needle);
    });
  }

  /** Group options by their `group` property. */
  readonly groupedOptions = computed(() => {
    const opts = this.options();
    const groups = new Map<string, SelectOptionLike<T>[]>();
    const ungrouped: SelectOptionLike<T>[] = [];
    for (const o of opts) {
      const group = (o as SelectOption<T>).group;
      if (group) {
        const g = groups.get(group) ?? [];
        g.push(o);
        groups.set(group, g);
      } else {
        ungrouped.push(o);
      }
    }
    return { ungrouped, groups: Array.from(groups.entries()) };
  });

  readonly filteredUngrouped = computed(() => {
    const q = this.filterText().trim();
    const list = this.groupedOptions().ungrouped;
    return q ? list.filter((o) => this.matchesFilter(o, q)) : list;
  });

  readonly filteredGroups = computed(() => {
    const q = this.filterText().trim();
    const groups = this.groupedOptions().groups;
    if (!q) return groups;
    return groups
      .map(([name, opts]) => [name, opts.filter((o) => this.matchesFilter(o, q))] as [string, SelectOptionLike<T>[]])
      .filter(([, opts]) => opts.length > 0);
  });

  readonly hasValue = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v.length > 0 : v != null;
  });

  /** Currently selected option(s), resolved against `options()`. Used to render `selectedItemTemplate`. */
  readonly selectedOptions = computed<SelectOptionLike<T>[]>(() => {
    const v = this.value();
    if (v == null) return [];
    const opts = this.options();
    const values = Array.isArray(v) ? v : [v];
    return values
      .map((val) => opts.find((o) => this.compareValues(this.getOptionValue(o), val)))
      .filter((o): o is SelectOptionLike<T> => !!o);
  });

  /** Whether the given option is part of the current selection. Used to render the `checkmark`. */
  isOptionSelected(opt: SelectOptionLike<T>): boolean {
    const v = this.value();
    if (v == null) return false;
    const val = this.getOptionValue(opt);
    return Array.isArray(v) ? v.some((x) => this.compareValues(x, val)) : this.compareValues(v, val);
  }

  /** Whether the given option is disabled, for options that aren't shaped like `SelectOption`. */
  isOptionDisabled(opt: SelectOptionLike<T>): boolean {
    return (opt as SelectOption<T>).disabled ?? false;
  }

  readonly editableSuggestions = computed(() => this.options());

  onChange(v: T | T[] | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  onEditableInput(text: string): void {
    const match = this.options().find((o) => this.getOptionLabel(o) === text);
    this.onChange((match ? this.getOptionValue(match) : (text as unknown as T)));
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
    if (this.resetFilterOnHide()) {
      this.filterText.set('');
    }
    this.onTouched();
    this.onHide.emit();
  }

  ngAfterViewInit(): void {
    if (!this.autofocus()) return;
    if (this.editable()) {
      this.editableInputRef()?.nativeElement.focus();
    } else {
      this.matSelectRef()?.focus();
    }
  }

  writeValue(v: T | T[] | null): void     { this.value.set(v); }
  registerOnChange(fn: (v: T | T[] | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void  { this._onTouched = fn; }
  setDisabledState(_: boolean): void       { }

  onTouched(): void { this.touched.set(true); this._onTouched(); }
}
