import {
  ChangeDetectionStrategy, Component, computed, contentChild, forwardRef, input, model, output, signal, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CuiIconComponent } from '@idealink-material/ui-icons';

import { CuiChipComponent } from '../../atoms/chip/chip.component';

/**
 * Anything the autocomplete can render as a suggestion: the value type itself, or a plain
 * record read via `optionLabel`/`optionValue` (e.g. a domain model like `ChartOfAccountModel`).
 */
export type AutoCompleteSuggestionLike<T = unknown> = T | Record<string, unknown>;

/** Template context available to `#item` / `#selectedItem` templates via `let-x`. */
export interface AutoCompleteItemContext<T> {
  $implicit: AutoCompleteSuggestionLike<T>;
}

/**
 * `value`'s shape: a single value, multiple values (multi mode), or empty. `undefined` is
 * accepted alongside `null` so binding optional source fields (e.g. `model.customer?: number`)
 * type-checks without a cast.
 */
export type AutoCompleteValue<T> = T | T[] | null | undefined;

@Component({
  selector: 'p-auto-complete',
  standalone: true,
  imports: [MatAutocompleteModule, CuiChipComponent, CuiIconComponent, NgTemplateOutlet],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiAutoCompleteComponent),
    multi: true,
  }],
})
export class CuiAutoCompleteComponent<T = unknown, V = T> implements ControlValueAccessor {
  private static nextId = 0;
  readonly fieldId = `p-auto-complete-${++CuiAutoCompleteComponent.nextId}`;

  /** Floating label text, shown above the field. */
  readonly label            = input<string>('');
  /** Marks the field required, showing a `*` next to the label. */
  readonly required         = input<boolean>(false);
  /** Identifier of the accessible input element. Falls back to an auto-generated id. */
  readonly inputId          = input<string | undefined>(undefined);

  readonly suggestions      = input<AutoCompleteSuggestionLike<T>[]>([]);
  /**
   * Name of the label field of a suggestion, for suggestions that are plain records
   * (e.g. a domain model like `ChartOfAccountModel`). Defaults to `label`.
   */
  readonly optionLabel      = input<string | undefined>(undefined);
  /**
   * Name of the value field of a suggestion, for suggestions that are plain records.
   * When unset, the whole suggestion object is used as the value (matching the historical
   * `p-auto-complete` behavior of binding the full object).
   */
  readonly optionValue      = input<string | undefined>(undefined);
  /** A property to uniquely identify a value in suggestions, used to compare values by key instead of by reference/equality. */
  readonly dataKey          = input<string | undefined>(undefined);
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

  /** Custom content for each suggestion in the panel. Receives the item via `let-x`. */
  readonly itemTemplate = contentChild<TemplateRef<AutoCompleteItemContext<T>>>('item');
  /** Custom content for selected chips in multiple mode. Receives the item via `let-x`. */
  readonly selectedItemTemplate = contentChild<TemplateRef<AutoCompleteItemContext<T>>>('selectedItem');

  readonly value = model<AutoCompleteValue<V>>(null);

  readonly completeMethod  = output<string>();
  readonly onSelect        = output<AutoCompleteSuggestionLike<T>>();
  readonly onUnselect      = output<AutoCompleteSuggestionLike<T>>();
  readonly onClear         = output<void>();
  readonly onDropdownClick = output<void>();

  private _onChange: (v: AutoCompleteValue<V>) => void = () => {};
  private _onTouched: () => void = () => {};
  private debounceHandle: ReturnType<typeof setTimeout> | undefined;

  readonly resolvedInputId = computed(() => this.inputId() ?? this.fieldId);

  readonly displayLabel = (item: AutoCompleteSuggestionLike<T> | null): string => {
    if (item == null) return '';
    const key = this.optionLabel();
    if (!key) return String(item);
    const record = item as unknown as Record<string, unknown>;
    return key in record ? String(record[key]) : String(item);
  };

  /**
   * Resolves the underlying value of a suggestion, honoring `optionValue` for plain-record
   * suggestions. When unset, the whole suggestion object is used as the value.
   */
  private getOptionValue(item: AutoCompleteSuggestionLike<T>): V {
    const key = this.optionValue();
    const record = item as unknown as Record<string, V>;
    return key && key in record ? record[key] : (item as unknown as V);
  }

  /**
   * Reads `dataKey` off a value when it's an object, otherwise returns the value itself.
   * Lets `compareValues` match a primitive suggestion value against an object value.
   */
  private keyOf(v: unknown, key: string): unknown {
    return v != null && typeof v === 'object' ? (v as Record<string, unknown>)[key] : v;
  }

  /** Compares two values, keying off `dataKey` when set rather than reference/equality. */
  private compareValues(a: V, b: V): boolean {
    const key = this.dataKey();
    if (!key) return a === b;
    return this.keyOf(a, key) === this.keyOf(b, key);
  }

  get selectedList(): V[] {
    const v = this.value();
    return Array.isArray(v) ? v : [];
  }

  /**
   * Currently selected suggestion(s), resolved against `suggestions()`. Needed when
   * `optionValue` is set, since `value()` then holds bare values (e.g. ids) rather than
   * the full suggestion object that `displayLabel`/templates expect. Falls back to the
   * raw stored value(s) when no match is found in the current suggestion list.
   */
  readonly selectedOptions = computed<AutoCompleteSuggestionLike<T>[]>(() => {
    const values = this.selectedList;
    if (!this.optionValue()) return values as unknown as AutoCompleteSuggestionLike<T>[];
    const opts = this.suggestions();
    return values.map((v) => opts.find((o) => this.compareValues(this.getOptionValue(o), v)) ?? (v as unknown as AutoCompleteSuggestionLike<T>));
  });

  /**
   * Resolved suggestion object for the current single-select `value()`, used to render
   * `selectedItemTemplate` over the input. Mirrors `selectedOptions` but for the
   * non-`multiple` case, where `value()` is a bare value rather than an array.
   */
  readonly selectedOption = computed<AutoCompleteSuggestionLike<T> | null>(() => {
    const v = this.value();
    if (v == null || Array.isArray(v)) return null;
    if (!this.optionValue()) return v as unknown as AutoCompleteSuggestionLike<T>;
    const opts = this.suggestions();
    return opts.find((o) => this.compareValues(this.getOptionValue(o), v)) ?? (v as unknown as AutoCompleteSuggestionLike<T>);
  });

  /** Tracks input focus so the selected-item template overlay hides while typing. */
  readonly inputFocused = signal(false);

  onInput(text: string): void {
    if (this.debounceHandle) clearTimeout(this.debounceHandle);
    if (text.length < this.minLength()) return;
    this.debounceHandle = setTimeout(() => this.completeMethod.emit(text), this.delay());
  }

  onFocus(input: HTMLInputElement): void {
    if (this.completeOnFocus()) this.completeMethod.emit(input.value);
  }

  onOptionSelected(e: MatAutocompleteSelectedEvent, input: HTMLInputElement): void {
    const item = e.option.value as AutoCompleteSuggestionLike<T>;
    const value = this.getOptionValue(item);
    if (this.multiple()) {
      const next = [...this.selectedList, value];
      this.value.set(next);
      this._onChange(next);
      input.value = '';
    } else {
      this.value.set(value);
      this._onChange(value);
      input.value = this.displayLabel(item);
      if (this.selectedItemTemplate()) {
        // MatAutocomplete re-focuses the input right after emitting `optionSelected`,
        // so blurring synchronously here gets immediately undone. Defer past that.
        setTimeout(() => { this.inputFocused.set(false); input.blur(); });
      }
    }
    this.onSelect.emit(item);
  }

  removeSelected(item: AutoCompleteSuggestionLike<T>): void {
    const target = this.getOptionValue(item);
    const next = this.selectedList.filter((x) => !this.compareValues(x, target));
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

  writeValue(v: AutoCompleteValue<V>): void { this.value.set(v); }
  registerOnChange(fn: (v: AutoCompleteValue<V>) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
