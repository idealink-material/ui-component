import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'p-listbox',
  standalone: true,
  imports: [CdkListboxModule],
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

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<readonly T[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<readonly T[]>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: readonly T[]) => void = () => {};
  private _onTouched: () => void = () => {};

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
