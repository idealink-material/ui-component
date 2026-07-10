import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'p-slider',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiSliderComponent),
    multi: true,
  }],
})
export class CuiSliderComponent implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly min      = input<number>(0);
  readonly max      = input<number>(100);
  readonly step     = input<number>(1);
  readonly discrete = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<number>(0);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<number>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: number) => void = () => {};
  private _onTouched: () => void = () => {};

  onValueChange(v: number): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
    this._onTouched();
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: number): void                { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
