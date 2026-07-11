import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'p-checkbox',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiCheckboxComponent),
    multi: true,
  }],
})
export class CuiCheckboxComponent implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly label         = input<string>('');
  readonly indeterminate = input<boolean>(false);
  readonly disabled      = input<boolean>(false);
  readonly required      = input<boolean>(false);
  /** Always true — this checkbox binds a single boolean value, not a value from a group array. */
  readonly binary        = input<boolean>(true);
  /** When true, the checkbox stays focusable but its value cannot be toggled. */
  readonly readonly      = input<boolean>(false);
  readonly tabindex      = input<number>(0);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<boolean>(false);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly onChange = output<boolean>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  change(e: MatCheckboxChange): void {
    if (this.readonly()) {
      e.source.checked = this.value();
      return;
    }
    this.value.set(e.checked);
    this._onChange(e.checked);
    this.onChange.emit(e.checked);
  }

  onTouched(): void { this._onTouched(); }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: boolean): void               { this.value.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
