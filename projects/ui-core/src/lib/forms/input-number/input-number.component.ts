import {
  ChangeDetectionStrategy, Component, computed, signal, ElementRef,
  forwardRef, input, model, output, viewChild, AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiButtonComponent } from '../../atoms/button/button.component';
import type { InputVariant, InputSize } from '../input/input.component';

export type InputNumberMode = 'decimal' | 'currency';
export type InputNumberButtonLayout = 'horizontal' | 'vertical' | 'stacked';

@Component({
  selector: 'p-input-number',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CuiButtonComponent, CuiIconComponent],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiInputNumberComponent),
    multi: true,
  }],
})
export class CuiInputNumberComponent implements ControlValueAccessor, AfterViewInit {
  private static nextId = 0;
  readonly fieldId = `p-input-number-${++CuiInputNumberComponent.nextId}`;

  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly label       = input<string>('');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly variant     = input<InputVariant>('outline');
  readonly size        = input<InputSize>('md');

  readonly min         = input<number | undefined>(undefined);
  readonly max         = input<number | undefined>(undefined);
  readonly step        = input<number>(1);
  readonly showButtons = input<boolean>(true);
  readonly disabled    = input<boolean>(false);
  readonly readonly    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly fullWidth   = input<boolean>(false);

  readonly mode        = input<InputNumberMode>('decimal');
  readonly currency    = input<string>('USD');
  /** `symbol | code | name` — how the currency is rendered when mode is currency. */
  readonly currencyDisplay = input<'symbol' | 'code' | 'name'>('symbol');
  readonly useGrouping = input<boolean>(true);
  readonly prefix      = input<string>('');
  readonly suffix      = input<string>('');
  /** Locale passed to Intl.NumberFormat. Defaults to the host environment's current locale. */
  readonly locale      = input<string | undefined>(undefined);
  readonly localeMatcher = input<'lookup' | 'best fit'>('best fit');
  readonly minFractionDigits = input<number | null>(null);
  readonly maxFractionDigits = input<number | null>(null);
  /** When false, the display value is always the raw unformatted number (no grouping/currency symbol/fraction rounding). */
  readonly format      = input<boolean>(true);
  /** When false, an empty field is coerced to 0 (clamped to min/max) on blur instead of staying null. */
  readonly allowEmpty  = input<boolean>(true);

  /** Arrangement of the increment/decrement buttons relative to the field. */
  readonly buttonLayout = input<InputNumberButtonLayout>('stacked');
  readonly incrementButtonIcon = input<string>('keyboard_arrow_up');
  readonly decrementButtonIcon = input<string>('keyboard_arrow_down');
  readonly incrementButtonClass = input<string>('');
  readonly decrementButtonClass = input<string>('');

  readonly showClear   = input<boolean>(false);
  readonly autofocus   = input<boolean>(false);
  readonly autocomplete = input<string>('off');

  readonly styleClass  = input<string>('');
  readonly style       = input<Record<string, string> | null>(null);
  readonly inputStyleClass = input<string>('');
  readonly inputStyle  = input<Record<string, string> | null>(null);

  /** Identifier of the accessible input element. Falls back to an auto-generated id. */
  readonly inputId     = input<string | undefined>(undefined);
  readonly name        = input<string>('');
  readonly tabindex    = input<number | null>(null);
  readonly title       = input<string>('');
  readonly ariaLabel   = input<string | undefined>(undefined);
  readonly ariaLabelledBy = input<string | undefined>(undefined);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<number | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<number | null>();
  readonly onInput   = output<number | null>();
  readonly onFocus   = output<FocusEvent>();
  readonly onBlur    = output<FocusEvent>();
  readonly onKeyDown = output<KeyboardEvent>();
  readonly onClear   = output<void>();

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly focused = signal(false);
  /** True once the field has been blurred at least once. Gates when `error` is actually shown. */
  readonly touched = signal(false);

  readonly resolvedInputId = computed(() => this.inputId() ?? this.fieldId);

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly hasError = computed(() => this.touched() && !!this.error());

  readonly atMin = computed(() => {
    const min = this.min();
    return min !== undefined && (this.value() ?? 0) <= min;
  });

  readonly atMax = computed(() => {
    const max = this.max();
    return max !== undefined && (this.value() ?? 0) >= max;
  });

  private readonly formatter = computed(() => {
    const options: Intl.NumberFormatOptions = {
      useGrouping: this.useGrouping(),
      localeMatcher: this.localeMatcher(),
    };
    if (this.minFractionDigits() !== null) options.minimumFractionDigits = this.minFractionDigits()!;
    if (this.maxFractionDigits() !== null) options.maximumFractionDigits = this.maxFractionDigits()!;
    if (this.mode() === 'currency') {
      options.style = 'currency';
      options.currency = this.currency();
      options.currencyDisplay = this.currencyDisplay();
    }
    return new Intl.NumberFormat(this.locale(), options);
  });

  /** Formatted display value, shown only while the field is not focused. */
  readonly displayValue = computed(() => {
    const v = this.value();
    if (v == null) return '';
    if (this.focused()) return String(v);
    const formatted = this.format() ? this.formatter().format(v) : String(v);
    return `${this.prefix()}${formatted}${this.suffix()}`;
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
    this.touched.set(true);
    if (!this.allowEmpty() && this.value() == null) {
      this.emit(this.clamp(0));
    }
    this._onTouched();
    this.onBlur.emit(e);
  }

  handleKeyDown(e: KeyboardEvent): void {
    this.onKeyDown.emit(e);
  }

  clear(e: Event): void {
    e.stopPropagation();
    if (this.disabled() || this.readonly()) return;
    this.emit(null);
    this.onClear.emit();
  }

  increment(): void { this.emit(this.clamp((this.value() ?? 0) + this.step())); }
  decrement(): void { this.emit(this.clamp((this.value() ?? 0) - this.step())); }

  onTouched(): void { this._onTouched(); }

  ngAfterViewInit(): void {
    if (this.autofocus()) this.inputRef()?.nativeElement.focus();
  }

  private clamp(v: number): number {
    const min = this.min();
    const max = this.max();
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
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
