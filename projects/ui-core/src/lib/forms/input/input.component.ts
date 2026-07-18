import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CuiIconComponent } from '@idealink-material/ui-icons';

export type InputVariant = 'outline' | 'fill';
export type InputSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'p-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CuiIconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiInputComponent),
    multi: true,
  }],
})
export class CuiInputComponent implements ControlValueAccessor {
  private static nextId = 0;
  readonly fieldId = `p-input-${++CuiInputComponent.nextId}`;

  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly label       = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly type        = input<string>('text');
  readonly variant     = input<InputVariant>('outline');
  readonly size        = input<InputSize>('md');
  readonly prefixIcon  = input<string | null>(null);
  readonly suffixIcon  = input<string | null>(null);
  readonly disabled    = input<boolean>(false);
  readonly readonly    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly autocomplete = input<string>('off');

  /** Renders a <textarea> instead of a single-line <input>. */
  readonly multiline  = input<boolean>(false);
  readonly rows       = input<number>(3);
  readonly cols       = input<number | null>(null);
  /** Grows the textarea height to fit its content (multiline only). */
  readonly autoResize = input<boolean>(false);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<string>('');

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiBlur   = output<FocusEvent>();
  readonly cuiFocus  = output<FocusEvent>();
  readonly cuiChange = output<string>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  /** True once the field has been blurred at least once. Gates when `error` is actually shown. */
  readonly touched = signal(false);

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly hasError = computed(() => this.touched() && !!this.error());

  onInput(e: Event): void {
    const el = e.target as HTMLInputElement | HTMLTextAreaElement;
    const v = el.value;
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
    if (this.multiline() && this.autoResize()) this.resize(el as HTMLTextAreaElement);
  }

  private resize(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  onBlur(e: FocusEvent): void { this.touched.set(true); this._onTouched(); this.cuiBlur.emit(e); }
  onFocus(e: FocusEvent): void { this.cuiFocus.emit(e); }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: string): void  { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void   { this._onChange = fn; }
  registerOnTouched(fn: () => void): void            { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void        { /* handled via input() */ }
}
