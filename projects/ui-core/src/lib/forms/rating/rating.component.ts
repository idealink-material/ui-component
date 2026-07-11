import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CuiIconComponent } from '@idealink-material/ui-icons';

@Component({
  selector: 'p-rating',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiRatingComponent),
    multi: true,
  }],
})
export class CuiRatingComponent implements ControlValueAccessor {
  readonly stars    = input<number>(5);
  /** Shows a leading icon to clear the rating back to 0. */
  readonly cancel   = input<boolean>(true);
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly value = model<number>(0);

  readonly onRate   = output<number>();
  readonly onCancel = output<void>();

  private _onChange: (v: number) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly hoverValue = signal<number | null>(null);

  readonly starIndexes = computed(() => Array.from({ length: this.stars() }, (_, i) => i + 1));
  readonly displayValue = computed(() => this.hoverValue() ?? this.value());

  private get interactive(): boolean {
    return !this.readonly() && !this.disabled();
  }

  hover(i: number): void {
    if (this.interactive) this.hoverValue.set(i);
  }

  leave(): void {
    this.hoverValue.set(null);
  }

  rate(i: number): void {
    if (!this.interactive) return;
    this.value.set(i);
    this._onChange(i);
    this._onTouched();
    this.onRate.emit(i);
  }

  clear(): void {
    if (!this.interactive) return;
    this.value.set(0);
    this._onChange(0);
    this._onTouched();
    this.onCancel.emit();
  }

  writeValue(v: number): void { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
