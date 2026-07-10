import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { SelectOption } from '../select/select.component';

export type RadioOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'p-radio-group',
  standalone: true,
  imports: [MatRadioModule],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiRadioGroupComponent),
    multi: true,
  }],
})
export class CuiRadioGroupComponent<T = string> implements ControlValueAccessor {
  private static nextId = 0;

  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly options     = input<SelectOption<T>[]>([]);
  readonly orientation = input<RadioOrientation>('vertical');
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly name        = input<string>(`p-radio-group-${++CuiRadioGroupComponent.nextId}`);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<T | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<T | null>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: T | null) => void = () => {};
  private _onTouched: () => void = () => {};

  onChange(e: MatRadioChange): void {
    this.value.set(e.value);
    this._onChange(e.value);
    this.cuiChange.emit(e.value);
    this._onTouched();
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: T | null): void              { this.value.set(v); }
  registerOnChange(fn: (v: T | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
