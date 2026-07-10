import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CuiButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'p-input-number',
  standalone: true,
  imports: [CuiButtonComponent],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiInputNumberComponent),
    multi: true,
  }],
})
export class CuiInputNumberComponent implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly min         = input<number | null>(null);
  readonly max         = input<number | null>(null);
  readonly step        = input<number>(1);
  readonly showButtons = input<boolean>(true);
  readonly disabled    = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly fullWidth   = input<boolean>(false);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<number | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<number | null>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly atMin = computed(() => {
    const min = this.min();
    return min !== null && (this.value() ?? 0) <= min;
  });

  readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && (this.value() ?? 0) >= max;
  });

  onInput(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    this.emit(raw === '' ? null : Number(raw));
  }

  increment(): void { this.emit(this.clamp((this.value() ?? 0) + this.step())); }
  decrement(): void { this.emit(this.clamp((this.value() ?? 0) - this.step())); }

  onTouched(): void { this._onTouched(); }

  private clamp(v: number): number {
    const min = this.min();
    const max = this.max();
    if (min !== null && v < min) v = min;
    if (max !== null && v > max) v = max;
    return v;
  }

  private emit(v: number | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: number | null): void         { this.value.set(v); }
  registerOnChange(fn: (v: number | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
