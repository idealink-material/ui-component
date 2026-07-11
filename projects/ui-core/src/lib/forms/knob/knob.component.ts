import {
  ChangeDetectionStrategy, Component, ElementRef, computed,
  forwardRef, input, model, output, viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const SIZE = 100;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'p-knob',
  standalone: true,
  imports: [],
  templateUrl: './knob.component.html',
  styleUrl: './knob.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiKnobComponent),
    multi: true,
  }],
})
export class CuiKnobComponent implements ControlValueAccessor {
  readonly min        = input<number>(0);
  readonly max        = input<number>(100);
  readonly step       = input<number>(1);
  readonly valueColor = input<string>('var(--mat-sys-primary)');
  readonly rangeColor = input<string>('var(--mat-sys-outline-variant)');
  readonly showValue  = input<boolean>(true);
  readonly readonly   = input<boolean>(false);
  readonly disabled   = input<boolean>(false);

  readonly value = model<number>(0);
  readonly onChange = output<number>();

  private _onChange: (v: number) => void = () => {};
  private _onTouched: () => void = () => {};

  private readonly svgEl = viewChild<ElementRef<SVGSVGElement>>('svg');

  readonly size = SIZE;
  readonly radius = RADIUS;
  readonly circumference = CIRCUMFERENCE;

  readonly pct = computed(() => {
    const range = this.max() - this.min();
    return range === 0 ? 0 : (this.value() - this.min()) / range;
  });

  readonly dashOffset = computed(() => this.circumference * (1 - this.pct()));

  private dragging = false;

  private clamp(v: number): number {
    const stepped = Math.round(v / this.step()) * this.step();
    return Math.min(this.max(), Math.max(this.min(), stepped));
  }

  private valueFromPointer(e: PointerEvent): number {
    const svg = this.svgEl()?.nativeElement;
    if (!svg) return this.value();
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
    const normalized = ((angle % 360) + 360) % 360;
    const pct = normalized / 360;
    return this.clamp(this.min() + pct * (this.max() - this.min()));
  }

  private emit(v: number): void {
    this.value.set(v);
    this._onChange(v);
    this.onChange.emit(v);
  }

  onPointerDown(e: PointerEvent): void {
    if (this.disabled() || this.readonly()) return;
    this.dragging = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    this.emit(this.valueFromPointer(e));
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.emit(this.valueFromPointer(e));
  }

  onPointerUp(): void {
    this.dragging = false;
    this._onTouched();
  }

  writeValue(v: number): void { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
