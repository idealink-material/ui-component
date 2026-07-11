import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'p-toggle-switch',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiToggleSwitchComponent),
    multi: true,
  }],
})
export class CuiToggleSwitchComponent<T = boolean> implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly label     = input<string>('');
  readonly disabled  = input<boolean>(false);
  readonly required  = input<boolean>(false);
  /** Value stored in `value` when the switch is on. Defaults to boolean true. */
  readonly trueValue  = input<T>(true as unknown as T);
  /** Value stored in `value` when the switch is off. Defaults to boolean false. */
  readonly falseValue = input<T>(false as unknown as T);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<T>(false as unknown as T);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<T>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: T) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly isChecked = () => this.value() === this.trueValue();

  onChange(e: MatSlideToggleChange): void {
    const v = e.checked ? this.trueValue() : this.falseValue();
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  onTouched(): void { this._onTouched(); }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: T): void                     { this.value.set(v ?? this.falseValue()); }
  registerOnChange(fn: (v: T) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
