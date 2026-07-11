import {
  ChangeDetectionStrategy, Component, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CuiIconComponent } from '@votha-sok/ui-icons';

import { CuiChipComponent } from '../../atoms/chip/chip.component';

@Component({
  selector: 'p-auto-complete',
  standalone: true,
  imports: [MatAutocompleteModule, CuiChipComponent, CuiIconComponent],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiAutoCompleteComponent),
    multi: true,
  }],
})
export class CuiAutoCompleteComponent<T = unknown> implements ControlValueAccessor {
  readonly suggestions      = input<T[]>([]);
  /** Property name used to read the display label when suggestions are objects. */
  readonly field            = input<string | null>(null);
  /** Shows a trailing button that opens the panel with the current suggestions list. */
  readonly dropdown         = input<boolean>(false);
  readonly multiple         = input<boolean>(false);
  readonly minLength        = input<number>(1);
  /** Debounce (ms) before completeMethod fires after typing stops. */
  readonly delay            = input<number>(300);
  /** Clears the input text on blur if it does not match a current suggestion. */
  readonly forceSelection   = input<boolean>(false);
  readonly disabled         = input<boolean>(false);
  readonly placeholder      = input<string>('');
  readonly completeOnFocus  = input<boolean>(false);

  readonly value = model<T | T[] | null>(null);

  readonly completeMethod  = output<string>();
  readonly onSelect        = output<T>();
  readonly onUnselect      = output<T>();
  readonly onClear         = output<void>();
  readonly onDropdownClick = output<void>();

  private _onChange: (v: T | T[] | null) => void = () => {};
  private _onTouched: () => void = () => {};
  private debounceHandle: ReturnType<typeof setTimeout> | undefined;

  readonly displayLabel = (item: T | null): string => {
    if (item == null) return '';
    const f = this.field();
    return f ? String((item as Record<string, unknown>)[f]) : String(item);
  };

  get selectedList(): T[] {
    const v = this.value();
    return Array.isArray(v) ? v : [];
  }

  onInput(text: string): void {
    if (this.debounceHandle) clearTimeout(this.debounceHandle);
    if (text.length < this.minLength()) return;
    this.debounceHandle = setTimeout(() => this.completeMethod.emit(text), this.delay());
  }

  onFocus(input: HTMLInputElement): void {
    if (this.completeOnFocus()) this.completeMethod.emit(input.value);
  }

  onOptionSelected(e: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    const item = e.option.value as T;
    if (this.multiple()) {
      const next = [...this.selectedList, item];
      this.value.set(next);
      this._onChange(next);
      input.value = '';
    } else {
      this.value.set(item);
      this._onChange(item);
      input.value = this.displayLabel(item);
    }
    this.onSelect.emit(item);
  }

  removeSelected(item: T): void {
    const next = this.selectedList.filter((x) => x !== item);
    this.value.set(next);
    this._onChange(next);
    this.onUnselect.emit(item);
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.value.set(this.multiple() ? [] : null);
    this._onChange(this.multiple() ? [] : null);
    this.onClear.emit();
  }

  onBlur(input: HTMLInputElement): void {
    this._onTouched();
    if (this.forceSelection() && !this.multiple() && input.value) {
      const match = this.suggestions().some((s) => this.displayLabel(s) === input.value);
      if (!match) {
        input.value = '';
        this.value.set(null);
        this._onChange(null);
      }
    }
  }

  writeValue(v: T | T[] | null): void { this.value.set(v); }
  registerOnChange(fn: (v: T | T[] | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
