import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CuiChipComponent } from '../../atoms/chip/chip.component';

@Component({
  selector: 'p-chips',
  standalone: true,
  imports: [CuiChipComponent],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiChipsComponent),
    multi: true,
  }],
})
export class CuiChipsComponent implements ControlValueAccessor {
  readonly placeholder    = input<string>('');
  readonly max            = input<number | null>(null);
  readonly allowDuplicate = input<boolean>(true);
  /** Character that, when typed, commits the current text as a chip (in addition to Enter). */
  readonly separator      = input<string | null>(null);
  readonly addOnBlur      = input<boolean>(false);
  readonly disabled       = input<boolean>(false);

  readonly value = model<string[]>([]);

  readonly onAdd      = output<string>();
  readonly onRemove   = output<string>();
  readonly onChipClick = output<string>();

  private _onChange: (v: string[]) => void = () => {};
  private _onTouched: () => void = () => {};

  private atMax(): boolean {
    const m = this.max();
    return m != null && this.value().length >= m;
  }

  private commit(raw: string): void {
    const text = raw.trim();
    if (!text || this.atMax()) return;
    if (!this.allowDuplicate() && this.value().includes(text)) return;
    const next = [...this.value(), text];
    this.value.set(next);
    this._onChange(next);
    this.onAdd.emit(text);
  }

  onKeydown(e: KeyboardEvent): void {
    if (this.disabled()) return;
    const input = e.target as HTMLInputElement;
    const sep = this.separator();

    if (e.key === 'Enter' || (sep && e.key === sep)) {
      e.preventDefault();
      this.commit(input.value);
      input.value = '';
      return;
    }
    if (e.key === 'Backspace' && !input.value && this.value().length) {
      const next = this.value().slice(0, -1);
      const removed = this.value()[this.value().length - 1];
      this.value.set(next);
      this._onChange(next);
      this.onRemove.emit(removed);
    }
  }

  onBlur(input: HTMLInputElement): void {
    this._onTouched();
    if (this.addOnBlur() && input.value.trim()) {
      this.commit(input.value);
      input.value = '';
    }
  }

  remove(token: string): void {
    const next = this.value().filter((t) => t !== token);
    this.value.set(next);
    this._onChange(next);
    this.onRemove.emit(token);
  }

  chipClick(token: string): void {
    this.onChipClick.emit(token);
  }

  writeValue(v: string[]): void { this.value.set(v ?? []); }
  registerOnChange(fn: (v: string[]) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
