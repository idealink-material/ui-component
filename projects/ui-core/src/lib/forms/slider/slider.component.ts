import {
  ChangeDetectionStrategy, Component, computed, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderModule, MatSliderDragEvent } from '@angular/material/slider';

export type SliderOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'p-slider',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiSliderComponent),
    multi: true,
  }],
})
export class CuiSliderComponent implements ControlValueAccessor {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly min         = input<number>(0);
  readonly max         = input<number>(100);
  readonly step        = input<number>(1);
  readonly discrete    = input<boolean>(true);
  readonly disabled    = input<boolean>(false);
  /** Renders a two-thumb range slider; value becomes a [start, end] tuple. */
  readonly range       = input<boolean>(false);
  /** 'vertical' rotates the track; Material has no native vertical slider so this is a CSS-driven approximation. */
  readonly orientation = input<SliderOrientation>('horizontal');

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<number | [number, number]>(0);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange  = output<number | [number, number]>();
  readonly onSlideEnd = output<number | [number, number]>();

  // ── CVA state ─────────────────────────────────────────────────────────────
  private _onChange: (v: number | [number, number]) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly singleValue = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v[0] : v;
  });

  readonly rangeStart = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v[0] : this.min();
  });

  readonly rangeEnd = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v[1] : this.max();
  });

  onValueChange(v: number): void {
    this.emit(v);
  }

  onRangeStartChange(v: number): void {
    this.emit([v, this.rangeEnd()]);
  }

  onRangeEndChange(v: number): void {
    this.emit([this.rangeStart(), v]);
  }

  slideEnd(e: MatSliderDragEvent): void {
    this.onSlideEnd.emit(this.value());
    void e;
  }

  private emit(v: number | [number, number]): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
    this._onTouched();
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────────
  writeValue(v: number | [number, number]): void { this.value.set(v ?? (this.range() ? [this.min(), this.max()] : 0)); }
  registerOnChange(fn: (v: number | [number, number]) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void    { this._onTouched = fn; }
  setDisabledState(_: boolean): void         { /* handled via input() */ }
}
