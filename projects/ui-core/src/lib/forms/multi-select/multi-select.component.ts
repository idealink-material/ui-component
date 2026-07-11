import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, input, model, output, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiChipComponent } from '../../atoms/chip/chip.component';
import { CuiCheckboxComponent } from '../checkbox/checkbox.component';
import { SelectOption } from '../select/select.component';

export type MultiSelectDisplay = 'comma' | 'chip';

@Component({
  selector: 'p-multi-select',
  standalone: true,
  imports: [OverlayModule, ScrollingModule, CuiIconComponent, CuiChipComponent, CuiCheckboxComponent],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiMultiSelectComponent),
    multi: true,
  }],
})
export class CuiMultiSelectComponent<T = string> implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly options     = input<SelectOption<T>[]>([]);
  readonly placeholder = input<string>('Select…');
  /** Shows a search box in the panel. `filter` is an alias for `filterable`. */
  readonly filterable  = input<boolean>(true);
  readonly filter      = input<boolean | null>(null);
  readonly disabled    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);

  /** How selected items are rendered on the closed control. */
  readonly display        = input<MultiSelectDisplay>('chip');
  readonly selectionLimit = input<number | null>(null);
  readonly showToggleAll  = input<boolean>(false);
  readonly virtualScroll  = input<boolean>(false);
  readonly virtualItemSize = input<number>(36);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<T[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange        = output<T[]>();
  readonly onFilter         = output<string>();
  readonly onSelectAllChange = output<boolean>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly open   = signal(false);
  readonly filterText = signal('');

  readonly showFilter = computed(() => this.filter() ?? this.filterable());

  readonly selectedOptions = computed(() => {
    const selected = new Set(this.value());
    return this.options().filter(o => selected.has(o.value));
  });

  readonly filteredOptions = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(q));
  });

  readonly allSelected = computed(() =>
    this.options().length > 0 && this.value().length === this.options().length
  );

  readonly displayText = computed(() =>
    this.selectedOptions().map((o) => o.label).join(', ')
  );

  readonly atLimit = computed(() => {
    const limit = this.selectionLimit();
    return limit != null && this.value().length >= limit;
  });

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: T[]) => void = () => {};
  private _onTouched: () => void = () => {};

  toggleOpen(): void {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }

  close(): void {
    this.open.set(false);
    this._onTouched();
  }

  onFilterInput(e: Event): void {
    const text = (e.target as HTMLInputElement).value;
    this.filterText.set(text);
    this.onFilter.emit(text);
  }

  isSelected(v: T): boolean {
    return this.value().includes(v);
  }

  toggleValue(v: T): void {
    const current = this.value();
    const isCurrentlySelected = current.includes(v);
    if (!isCurrentlySelected && this.atLimit()) return;
    const next = isCurrentlySelected ? current.filter(x => x !== v) : [...current, v];
    this.emit(next);
  }

  toggleSelectAll(): void {
    const next = this.allSelected() ? [] : this.options().map((o) => o.value);
    this.emit(next);
    this.onSelectAllChange.emit(!this.allSelected());
  }

  removeValue(v: T): void {
    this.emit(this.value().filter(x => x !== v));
  }

  private emit(v: T[]): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: T[]): void                   { this.value.set(v ?? []); }
  registerOnChange(fn: (v: T[]) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
