import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { SelectOption, SelectOptionLike } from '../select/select.component';

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
  readonly options     = input<SelectOptionLike<T>[]>([]);
  readonly optionLabel = input<string | undefined>(undefined);
  readonly optionValue = input<string | undefined>(undefined);
  /** A property to uniquely identify a value in options, used to compare values by key instead of by reference/equality. */
  readonly dataKey     = input<string | undefined>(undefined);
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

  /**
   * Reads `dataKey` off a value when it's an object, otherwise returns the value itself.
   * Lets `isChecked` match a full option object (e.g. binding a domain model instead of a
   * scalar id) against the current value by key rather than by reference.
   */
  private keyOf(v: unknown, key: string): unknown {
    return v != null && typeof v === 'object' ? (v as Record<string, unknown>)[key] : v;
  }

  /** Whether `opt` is the current selection — keyed off `dataKey` when set, else by equality. */
  isChecked(opt: SelectOptionLike<T>): boolean {
    const optValue = this.getOptionValue(opt);
    const current = this.value();
    const key = this.dataKey();
    if (!key) return current === optValue;
    return this.keyOf(current, key) === this.keyOf(optValue, key);
  }

  /** Resolves the display label of an option, honoring `optionLabel` for plain-record options. */
  getOptionLabel(opt: SelectOptionLike<T>): string {
    const key = this.optionLabel() ?? 'label';
    return (opt as unknown as Record<string, string>)[key];
  }

  /**
   * Resolves the underlying value of an option, honoring `optionValue` for plain-record options.
   * PrimeNG-style fallback: when no `optionValue` key is set and the option itself has no
   * `value` property, the whole option object is used as the value.
   */
  getOptionValue(opt: SelectOptionLike<T>): T {
    const key = this.optionValue() ?? 'value';
    const record = opt as unknown as Record<string, T>;
    return key in record ? record[key] : (opt as unknown as T);
  }

  /** Resolves an option's disabled state for plain-record options that carry no `disabled` key. */
  getOptionDisabled(opt: SelectOptionLike<T>): boolean {
    return (opt as SelectOption<T>).disabled ?? false;
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: T | null): void              { this.value.set(v); }
  registerOnChange(fn: (v: T | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
