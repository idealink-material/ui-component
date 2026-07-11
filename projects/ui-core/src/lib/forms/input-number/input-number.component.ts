import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CuiButtonComponent } from '../../atoms/button/button.component';

export type InputNumberMode = 'decimal' | 'currency';

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

  readonly mode        = input<InputNumberMode>('decimal');
  readonly currency    = input<string>('USD');
  readonly useGrouping = input<boolean>(true);
  readonly prefix      = input<string>('');
  readonly suffix      = input<string>('');

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<number | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<number | null>();
  readonly onInput   = output<number | null>();
  readonly onFocus   = output<FocusEvent>();
  readonly onBlur    = output<FocusEvent>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly focused = signal(false);

  readonly atMin = computed(() => {
    const min = this.min();
    return min !== null && (this.value() ?? 0) <= min;
  });

  readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && (this.value() ?? 0) >= max;
  });

  private readonly formatter = computed(() => {
    if (this.mode() === 'currency') {
      return new Intl.NumberFormat(undefined, {
        style: 'currency', currency: this.currency(), useGrouping: this.useGrouping(),
      });
    }
    return new Intl.NumberFormat(undefined, { useGrouping: this.useGrouping() });
  });

  /** Formatted display value, shown only while the field is not focused. */
  readonly displayValue = computed(() => {
    const v = this.value();
    if (v == null) return '';
    if (this.focused()) return String(v);
    return `${this.prefix()}${this.formatter().format(v)}${this.suffix()}`;
  });

  handleInput(e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    const parsed = raw === '' ? null : Number(raw);
    this.emit(parsed);
    this.onInput.emit(parsed);
  }

  handleFocus(e: FocusEvent): void {
    this.focused.set(true);
    this.onFocus.emit(e);
  }

  handleBlur(e: FocusEvent): void {
    this.focused.set(false);
    this._onTouched();
    this.onBlur.emit(e);
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
