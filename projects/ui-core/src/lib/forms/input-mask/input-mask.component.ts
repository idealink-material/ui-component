import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

function tokenPattern(token: string): RegExp | null {
  switch (token) {
    case '9': return /\d/;
    case 'a': return /[a-zA-Z]/;
    case '*': return /[a-zA-Z0-9]/;
    default:  return null;
  }
}

/** Walks `mask` inserting literals and consuming matching characters from `raw`. */
function applyMask(mask: string, raw: string, slotChar: string): { masked: string; complete: boolean } {
  let out = '';
  let ip = 0;
  const chars = raw.split('');
  for (const token of mask) {
    const pattern = tokenPattern(token);
    if (pattern) {
      while (ip < chars.length && !pattern.test(chars[ip])) ip++;
      out += ip < chars.length ? chars[ip++] : slotChar;
    } else {
      out += token;
      if (chars[ip] === token) ip++;
    }
  }
  return { masked: out, complete: !out.includes(slotChar) };
}

@Component({
  selector: 'p-input-mask',
  standalone: true,
  imports: [],
  templateUrl: './input-mask.component.html',
  styleUrl: './input-mask.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiInputMaskComponent),
    multi: true,
  }],
})
export class CuiInputMaskComponent implements ControlValueAccessor {
  /** Mask pattern: '9' = digit, 'a' = letter, '*' = alphanumeric, any other char is a literal. */
  readonly mask        = input<string>('');
  readonly slotChar    = input<string>('_');
  readonly autoClear   = input<boolean>(true);
  /** When true, `value` holds only the typed characters, without mask literals. */
  readonly unmask      = input<boolean>(false);
  readonly disabled    = input<boolean>(false);
  readonly placeholder = input<string>('');

  readonly value = model<string>('');

  readonly onComplete = output<string>();
  readonly onFocus    = output<FocusEvent>();
  readonly onBlur     = output<FocusEvent>();

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private rawChars = '';

  displayValue(): string {
    return applyMask(this.mask(), this.rawChars, this.slotChar()).masked;
  }

  handleInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.rawChars = el.value.replace(new RegExp(`[${this.slotChar()}]`, 'g'), '');
    const { masked, complete } = applyMask(this.mask(), this.rawChars, this.slotChar());
    el.value = masked;
    const out = this.unmask() ? this.rawChars : masked;
    this.value.set(out);
    this._onChange(out);
    if (complete) this.onComplete.emit(out);
  }

  handleFocus(e: FocusEvent): void { this.onFocus.emit(e); }

  handleBlur(e: FocusEvent): void {
    this._onTouched();
    const { complete } = applyMask(this.mask(), this.rawChars, this.slotChar());
    if (!complete && this.autoClear()) {
      this.rawChars = '';
      this.value.set('');
      this._onChange('');
    }
    this.onBlur.emit(e);
  }

  writeValue(v: string): void {
    this.rawChars = v ?? '';
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
