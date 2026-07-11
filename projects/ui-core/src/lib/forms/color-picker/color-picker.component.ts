import {
  ChangeDetectionStrategy, Component, computed, forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rf) h = ((gf - bf) / delta) % 6;
    else if (max === gf) h = (bf - rf) / delta + 2;
    else h = (rf - gf) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const bright = Math.round(max * 100);
  return { h, s, b: bright };
}

/** Formats a hex color string per the requested output format. */
function formatColor(hex: string, format: ColorPickerFormat): string {
  if (format === 'hex') return hex;
  const { r, g, b } = hexToRgb(hex);
  if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`;
  const hsb = rgbToHsb(r, g, b);
  return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
}

@Component({
  selector: 'p-color-picker',
  standalone: true,
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiColorPickerComponent),
    multi: true,
  }],
})
export class CuiColorPickerComponent implements ControlValueAccessor {
  readonly format   = input<ColorPickerFormat>('hex');
  /** Renders the swatch in a bordered panel instead of a bare button. */
  readonly inline   = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  /** Accepted for API parity; the native color picker is always OS-rendered. */
  readonly appendTo = input<string | null>(null);

  /** Always stored internally as hex; read formatted() for the display/output format. */
  readonly value = model<string>('#000000');

  readonly onChange = output<string>();

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly formatted = computed(() => formatColor(this.value(), this.format()));

  handleInput(hex: string): void {
    this.value.set(hex);
    const out = formatColor(hex, this.format());
    this._onChange(out);
    this.onChange.emit(out);
  }

  handleBlur(): void { this._onTouched(); }

  writeValue(v: string): void { this.value.set(v ?? '#000000'); }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
