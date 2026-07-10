import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, input, model, output, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { CuiIconComponent } from '@votha-sok/ui-icons';
import { CuiChipComponent } from '../../atoms/chip/chip.component';
import { CuiCheckboxComponent } from '../checkbox/checkbox.component';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'p-multi-select',
  standalone: true,
  imports: [OverlayModule, CuiIconComponent, CuiChipComponent, CuiCheckboxComponent],
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
  readonly filterable  = input<boolean>(true);
  readonly disabled    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<T[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<T[]>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly open   = signal(false);
  readonly filter = signal('');

  readonly selectedOptions = computed(() => {
    const selected = new Set(this.value());
    return this.options().filter(o => selected.has(o.value));
  });

  readonly filteredOptions = computed(() => {
    const q = this.filter().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(q));
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

  onFilter(e: Event): void {
    this.filter.set((e.target as HTMLInputElement).value);
  }

  isSelected(v: T): boolean {
    return this.value().includes(v);
  }

  toggleValue(v: T): void {
    const current = this.value();
    const next = current.includes(v) ? current.filter(x => x !== v) : [...current, v];
    this.emit(next);
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
