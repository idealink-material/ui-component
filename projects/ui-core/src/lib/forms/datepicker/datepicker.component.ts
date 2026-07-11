import {
  ChangeDetectionStrategy, Component, computed,
  forwardRef, inject, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule,
} from '@angular/material/core';
import {
  MatDatepickerModule, MatDatepickerInputEvent, MatCalendarCellClassFunction,
} from '@angular/material/datepicker';

import { CuiButtonComponent } from '../../atoms/button/button.component';

export type DatepickerVariant = 'outline' | 'fill';
export type DatepickerSelectionMode = 'single' | 'multiple' | 'range';
export type DatepickerView = 'date' | 'month' | 'year';

/** Best-effort translation of common PrimeNG-style tokens (yy, yyyy, mm, dd, M, D) into Intl options. */
function parseDateFormat(fmt: string): Intl.DateTimeFormatOptions {
  const opts: Intl.DateTimeFormatOptions = {};
  if (/yyyy/i.test(fmt)) opts.year = 'numeric';
  else if (/yy/i.test(fmt)) opts.year = '2-digit';
  if (/mm/.test(fmt)) opts.month = '2-digit';
  else if (/\bm\b/i.test(fmt) || /M/.test(fmt)) opts.month = 'numeric';
  if (/dd/.test(fmt)) opts.day = '2-digit';
  else if (/\bd\b/i.test(fmt)) opts.day = 'numeric';
  return Object.keys(opts).length ? opts : { year: 'numeric', month: 'numeric', day: 'numeric' };
}

function buildDateFormats(fmt: string | null) {
  const display = fmt ? parseDateFormat(fmt) : { year: 'numeric', month: 'numeric', day: 'numeric' };
  return {
    parse: { dateInput: null },
    display: {
      dateInput: display,
      monthYearLabel: { year: 'numeric', month: 'short' },
      dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
      monthYearA11yLabel: { year: 'numeric', month: 'long' },
    },
  };
}

@Component({
  selector: 'p-datepicker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CuiButtonComponent,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CuiDatepickerComponent),
      multi: true,
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: (host: CuiDatepickerComponent) => buildDateFormats(host.dateFormat()),
      deps: [forwardRef(() => CuiDatepickerComponent)],
    },
  ],
})
export class CuiDatepickerComponent implements ControlValueAccessor {
  private static nextId = 0;
  readonly fieldId = `p-datepicker-${++CuiDatepickerComponent.nextId}`;

  private readonly dateAdapter = inject(DateAdapter);

  readonly label       = input<string>('');
  readonly placeholder = input<string>('MM/DD/YYYY');
  readonly hint        = input<string | null>(null);
  readonly error       = input<string | null>(null);
  readonly variant     = input<DatepickerVariant>('outline');
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);
  readonly min         = input<Date | null>(null);
  readonly max         = input<Date | null>(null);

  /** Best-effort token format (e.g. "mm/dd/yy", "yyyy-mm-dd") used for the input's display text. */
  readonly dateFormat     = input<string | null>(null);
  readonly selectionMode  = input<DatepickerSelectionMode>('single');
  /** Which granularity the picker stops at. 'month'/'year' close the popup as soon as that unit is picked. */
  readonly view           = input<DatepickerView>('date');
  /** Shows a time-of-day input alongside the date (single selection mode only). */
  readonly showTime       = input<boolean>(false);
  readonly showIcon       = input<boolean>(true);
  readonly disabledDates  = input<Date[] | null>(null);
  /** Renders the calendar directly in the page instead of a popup. Range mode always uses the popup. */
  readonly inline         = input<boolean>(false);
  /** Number of calendars shown side by side. Only honored in inline mode. */
  readonly numberOfMonths = input<number>(1);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<Date | Date[] | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange    = output<Date | Date[] | null>();
  readonly onSelect     = output<Date | Date[] | null>();
  readonly onClose      = output<void>();
  readonly onTodayClick = output<void>();
  readonly onClearClick = output<void>();

  private _onChange: (v: Date | Date[] | null) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? 'fill' as const : 'outline' as const
  );

  readonly hasError = computed(() => !!this.error());

  readonly startView = computed<'month' | 'year' | 'multi-year'>(() => {
    switch (this.view()) {
      case 'year':  return 'multi-year';
      case 'month': return 'year';
      default:      return 'month';
    }
  });

  readonly singleValue = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? (v[0] ?? null) : v;
  });

  readonly rangeStart = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? (v[0] ?? null) : null;
  });

  readonly rangeEnd = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? (v[1] ?? null) : null;
  });

  readonly selectedDates = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v : [];
  });

  readonly inlineMonths = computed(() =>
    Array.from({ length: Math.max(1, this.numberOfMonths()) }, (_, i) => i)
  );

  readonly dateFilter = (d: Date | null): boolean => {
    if (!d) return true;
    const disabled = this.disabledDates();
    if (!disabled?.length) return true;
    return !disabled.some((x) => x.toDateString() === d.toDateString());
  };

  readonly cellClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view !== 'month' || this.selectionMode() !== 'multiple') return '';
    const hit = this.selectedDates().some((d) => d.toDateString() === cellDate.toDateString());
    return hit ? 'p-datepicker-cell--selected' : '';
  };

  startAtForMonth(offset: number): Date {
    const base = this.singleValue() ?? new Date();
    return new Date(base.getFullYear(), base.getMonth() + offset, 1);
  }

  private emit(v: Date | Date[] | null): void {
    this.value.set(v);
    this._onChange(v);
    this.cuiChange.emit(v);
    this.onSelect.emit(v);
  }

  onDateChange(e: MatDatepickerInputEvent<Date>): void {
    const raw = e.value ?? null;
    if (this.showTime() && raw) {
      const prev = this.singleValue();
      if (prev) raw.setHours(prev.getHours(), prev.getMinutes());
    }
    this.emit(raw);
  }

  onRangeStartChange(d: Date | null): void {
    this.emit([d as Date, this.rangeEnd() as Date].filter((x): x is Date => !!x) as Date[]);
  }

  onRangeEndChange(d: Date | null): void {
    const start = this.rangeStart();
    this.emit([start, d].filter((x): x is Date => !!x) as Date[]);
  }

  onCalendarSelected(d: Date | null): void {
    if (!d) return;
    if (this.selectionMode() === 'multiple') {
      const current = this.selectedDates();
      const exists = current.some((x) => x.toDateString() === d.toDateString());
      const next = exists
        ? current.filter((x) => x.toDateString() !== d.toDateString())
        : [...current, d];
      this.emit(next);
    } else {
      this.emit(d);
    }
  }

  onMonthSelected(d: Date, picker: { close(): void }): void {
    if (this.view() === 'month') { this.emit(d); picker.close(); }
  }

  onYearSelected(d: Date, picker: { close(): void }): void {
    if (this.view() === 'year') { this.emit(d); picker.close(); }
  }

  onTimeChange(time: string): void {
    const [h, m] = time.split(':').map(Number);
    const base = this.singleValue() ?? new Date();
    const next = new Date(base);
    next.setHours(h || 0, m || 0);
    this.emit(next);
  }

  timeValue(): string {
    const d = this.singleValue();
    if (!d) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  today(): void {
    this.emit(new Date());
    this.onTodayClick.emit();
  }

  clear(): void {
    this.emit(this.selectionMode() === 'multiple' ? [] : null);
    this.onClearClick.emit();
  }

  closed(): void { this.onClose.emit(); }

  onBlur(): void { this._onTouched(); }

  writeValue(v: Date | Date[] | null): void { this.value.set(v); }
  registerOnChange(fn: (v: Date | Date[] | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
