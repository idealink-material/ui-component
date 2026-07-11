import {
  ChangeDetectionStrategy, Component, ElementRef, computed,
  forwardRef, input, model, output, viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'p-input-otp',
  standalone: true,
  imports: [],
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiInputOtpComponent),
    multi: true,
  }],
})
export class CuiInputOtpComponent implements ControlValueAccessor {
  readonly length      = input<number>(4);
  /** Renders filled slots as dots instead of the typed character. */
  readonly mask        = input<boolean>(false);
  readonly integerOnly = input<boolean>(true);
  readonly disabled    = input<boolean>(false);

  readonly value = model<string>('');

  readonly onChange = output<string>();

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly slots = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  private readonly slotRefs = viewChildren<ElementRef<HTMLInputElement>>('slot');
  private get slotInputs(): HTMLInputElement[] {
    return this.slotRefs().map((r) => r.nativeElement);
  }

  charAt(i: number): string {
    return this.value()[i] ?? '';
  }

  private setValue(v: string): void {
    this.value.set(v);
    this._onChange(v);
    this.onChange.emit(v);
  }

  handleInput(i: number, e: Event): void {
    const el = e.target as HTMLInputElement;
    const char = el.value.slice(-1);
    if (this.integerOnly() && char && !/\d/.test(char)) {
      el.value = this.charAt(i);
      return;
    }
    const chars = this.value().padEnd(this.length(), ' ').split('');
    chars[i] = char || ' ';
    this.setValue(chars.join('').replace(/\s+$/, ''));

    if (char && i < this.length() - 1) this.slotInputs[i + 1]?.focus();
  }

  handleKeydown(i: number, e: KeyboardEvent): void {
    if (e.key === 'Backspace' && !this.charAt(i) && i > 0) {
      this.slotInputs[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) this.slotInputs[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < this.length() - 1) this.slotInputs[i + 1]?.focus();
  }

  handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') ?? '';
    const chars = (this.integerOnly() ? text.replace(/\D/g, '') : text).slice(0, this.length());
    this.setValue(chars);
    const last = Math.min(chars.length, this.length() - 1);
    this.slotInputs[last]?.focus();
  }

  handleBlur(): void { this._onTouched(); }

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
