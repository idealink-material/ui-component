import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'p-listbox',
  standalone: true,
  imports: [CdkListboxModule, CuiIconComponent],
  templateUrl: './listbox.component.html',
  styleUrl: './listbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiListboxComponent),
    multi: true,
  }],
})
export class CuiListboxComponent<T = string> implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly options  = input<SelectOption<T>[]>([]);
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  /** Shows a search box above the options. */
  readonly filter   = input<boolean>(false);
  /** Shows a checkbox next to each option (multiple mode). */
  readonly checkbox = input<boolean>(false);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<readonly T[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<readonly T[]>();
  readonly onFilter  = output<string>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: readonly T[]) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly filterText = signal('');

  readonly filteredOptions = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  isSelected(v: T): boolean {
    return this.value().includes(v);
  }

  onFilterInput(text: string): void {
    this.filterText.set(text);
    this.onFilter.emit(text);
  }

  onValueChange(v: readonly T[]): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
    this._onTouched();
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: readonly T[]): void          { this.value.set(v ?? []); }
  registerOnChange(fn: (v: readonly T[]) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
