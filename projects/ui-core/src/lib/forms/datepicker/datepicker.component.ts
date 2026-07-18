import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  forwardRef,
  inject,
  input,
  model,
  output,
  Injectable,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
  MatCalendarCellClassFunction,
  MatCalendarBody,
  MatCalendarCell,
} from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';

import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiButtonComponent } from '../../atoms/button/button.component';
import { DateFormatNames, formatDate, parseDate } from './date-format.util';

export type DatepickerVariant = 'outline' | 'fill';
export type DatepickerSelectionMode = 'single' | 'multiple' | 'range';
export type DatepickerView = 'date' | 'month' | 'year';

/** Years shown per page in the year-range grid panel, matching Material's own multi-year view. */
const YEARS_PER_PAGE = 24;

/** Matches PrimeNG's documented default (see `dateFormat` doc). */
export const DEFAULT_DATE_FORMAT = 'mm/dd/yy';

function buildDateFormats(fmt: string | null) {
  const format = fmt || DEFAULT_DATE_FORMAT;
  return {
    parse: { dateInput: format },
    display: {
      dateInput: format,
      monthYearLabel: 'M yy',
      dateA11yLabel: 'MM d, yy',
      monthYearA11yLabel: 'MM yy',
    },
  };
}

/**
 * Extends the native adapter so `format`/`parse` understand the token-string formats above
 * (PrimeNG/jQuery UI-style `dateFormat`, see `date-format.util.ts`) instead of only Intl options.
 */
@Injectable()
class CuiDatepickerDateAdapter extends NativeDateAdapter {
  private names(): DateFormatNames {
    return {
      dayNamesShort: this.getDayOfWeekNames('short'),
      dayNames: this.getDayOfWeekNames('long'),
      monthNamesShort: this.getMonthNames('short'),
      monthNames: this.getMonthNames('long'),
    };
  }

  override format(date: Date, displayFormat: Object): string {
    if (typeof displayFormat !== 'string') return super.format(date, displayFormat);
    if (!this.isValid(date)) throw Error('NativeDateAdapter: Cannot format invalid date.');
    return formatDate(date, displayFormat, this.names());
  }

  override parse(value: unknown, parseFormat: unknown): Date | null {
    if (typeof value === 'string' && value.trim() && typeof parseFormat === 'string') {
      return parseDate(value, parseFormat, this.names());
    }
    return super.parse(value, parseFormat);
  }
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
    MatCalendarBody,
    OverlayModule,
    CuiIconComponent,
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
    { provide: DateAdapter, useClass: CuiDatepickerDateAdapter },
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

  readonly label = input<string>('');
  readonly placeholder = input<string>('MM/DD/YYYY');
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly variant = input<DatepickerVariant>('outline');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly fullWidth = input<boolean>(true);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  /**
   * Token format for the input's display text and typed-input parsing, PrimeNG/jQuery UI-style.
   * Defaults to `'mm/dd/yy'`. Tokens: d/dd (day), o/oo (day of year), D/DD (day name),
   * m/mm (month), M/MM (month name), y/yy (2-/4-digit year), @ (Unix ms timestamp),
   * ! (Windows ticks), '...' literal text, '' literal single quote, anything else literal.
   */
  readonly dateFormat = input<string | null>(null);
  readonly selectionMode = input<DatepickerSelectionMode>('single');
  /** Which granularity the picker stops at. 'month'/'year' close the popup as soon as that unit is picked. */
  readonly view = input<DatepickerView>('date');
  /** Shows a time-of-day input alongside the date (single selection mode only). */
  readonly showTime = input<boolean>(false);
  readonly showIcon = input<boolean>(true);
  readonly disabledDates = input<Date[] | null>(null);
  /** Renders the calendar directly in the page instead of a popup. Range mode always uses the popup. */
  readonly inline = input<boolean>(false);
  /** Number of calendars shown side by side. Only honored in inline mode. */
  readonly numberOfMonths = input<number>(1);

  // ── Model ──────────────────────────────────────────────────────────────────
  readonly value = model<Date | Date[] | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly cuiChange = output<Date | Date[] | null>();
  readonly onSelect = output<Date | Date[] | null>();
  readonly onClose = output<void>();
  readonly onTodayClick = output<void>();
  readonly onClearClick = output<void>();

  private _onChange: (v: Date | Date[] | null) => void = () => {};
  private _onTouched: () => void = () => {};

  /**
   * `value()` snapshotted when the popup opens. Material's actions-portal mode routes calendar
   * picks into a private clone of the selection model that only reaches `value` when
   * `_applyPendingSelection()` runs (normally only from the Done button); `closed()` below calls
   * it on every close so outside-click commits too. But Today/Clear/typed input write `value`
   * directly, bypassing that clone entirely — if one of those ran, the clone is stale and
   * applying it would revert their change. Comparing against this snapshot tells us whether such
   * a direct write happened since open, so we only apply the clone when it didn't.
   */
  private openValue: Date | Date[] | null = null;

  readonly matAppearance = computed(() =>
    this.variant() === 'fill' ? ('fill' as const) : ('outline' as const),
  );

  /** True once the field has been blurred/closed at least once. Gates when `error` is actually shown. */
  readonly touched = signal(false);

  readonly hasError = computed(() => this.touched() && !!this.error());

  readonly startView = computed<'month' | 'year' | 'multi-year'>(() => {
    switch (this.view()) {
      case 'year':
        return 'multi-year';
      case 'month':
        return 'year';
      default:
        return 'month';
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
    Array.from({ length: Math.max(1, this.numberOfMonths()) }, (_, i) => i),
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

  // ── Month/year range grid panel (view='month'|'year' + selectionMode='range') ──────────────
  // mat-year-view/mat-multi-year-view only ever highlight a single cell (see MatYearView
  // `_setSelectedMonth`), so a real range with distinct start/end highlighting needs its own
  // grid built directly on `mat-calendar-body`, which is fully generic over cell values.
  readonly isMonthRangeView = computed(
    () => this.selectionMode() === 'range' && this.view() === 'month',
  );
  readonly isYearRangeView = computed(
    () => this.selectionMode() === 'range' && this.view() === 'year',
  );

  readonly gridOpen = signal(false);
  readonly gridPendingRange = signal<[Date | null, Date | null]>([null, null]);
  readonly monthGridYear = signal(new Date().getFullYear());
  readonly yearGridPageStart = signal(
    Math.floor(new Date().getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE,
  );

  readonly gridRangeLabel = computed(() => {
    const [start, end] = this.gridCommittedRange();
    if (!start && !end) return '';
    const fmt = this.isMonthRangeView()
      ? (d: Date) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : (d: Date) => String(d.getFullYear());
    return start && end ? `${fmt(start)} - ${fmt(end)}` : fmt((start ?? end) as Date);
  });

  private gridCommittedRange(): [Date | null, Date | null] {
    const v = this.value();
    const arr = Array.isArray(v) ? v : [];
    return [arr[0] ?? null, arr[1] ?? null];
  }

  readonly monthGridYearLabel = computed(() => String(this.monthGridYear()));
  readonly yearGridPageLabel = computed(
    () => `${this.yearGridPageStart()} - ${this.yearGridPageStart() + YEARS_PER_PAGE - 1}`,
  );

  readonly monthGridTodayValue = computed(() => {
    const today = new Date();
    return today.getFullYear() * 12 + today.getMonth();
  });
  readonly yearGridTodayValue = computed(() => new Date().getFullYear());

  readonly monthRangeStartValue = computed(() =>
    this.monthCompareValue(this.gridPendingRange()[0]),
  );
  readonly monthRangeEndValue = computed(() => this.monthCompareValue(this.gridPendingRange()[1]));
  readonly yearRangeStartValue = computed(() => this.gridPendingRange()[0]?.getFullYear() ?? NaN);
  readonly yearRangeEndValue = computed(() => this.gridPendingRange()[1]?.getFullYear() ?? NaN);

  private monthCompareValue(d: Date | null): number {
    return d ? d.getFullYear() * 12 + d.getMonth() : NaN;
  }

  readonly monthGridActiveCell = computed(() => {
    const start = this.gridPendingRange()[0];
    const year = this.monthGridYear();
    return start && start.getFullYear() === year ? start.getMonth() : 0;
  });

  readonly yearGridActiveCell = computed(() => {
    const start = this.gridPendingRange()[0];
    const pageStart = this.yearGridPageStart();
    const y = start?.getFullYear();
    return y != null && y >= pageStart && y < pageStart + YEARS_PER_PAGE ? y - pageStart : 0;
  });

  readonly monthGridRows = computed<MatCalendarCell[][]>(() => {
    const year = this.monthGridYear();
    const min = this.min();
    const max = this.max();
    const names = this.dateAdapter.getMonthNames('short');
    const cellFor = (month: number) => {
      const enabled =
        !(
          min &&
          (year < min.getFullYear() || (year === min.getFullYear() && month < min.getMonth()))
        ) &&
        !(
          max &&
          (year > max.getFullYear() || (year === max.getFullYear() && month > max.getMonth()))
        );
      const value = year * 12 + month;
      return new MatCalendarCell(
        value,
        names[month],
        `${names[month]} ${year}`,
        enabled,
        undefined,
        value,
      );
    };
    return [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
    ].map((row) => row.map(cellFor));
  });

  readonly yearGridRows = computed<MatCalendarCell[][]>(() => {
    const start = this.yearGridPageStart();
    const min = this.min();
    const max = this.max();
    const cellFor = (offset: number) => {
      const year = start + offset;
      const enabled = !(min && year < min.getFullYear()) && !(max && year > max.getFullYear());
      return new MatCalendarCell(year, String(year), String(year), enabled, undefined, year);
    };
    return Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => cellFor(r * 4 + c)),
    );
  });

  openGrid(): void {
    if (this.disabled()) return;
    const [start, end] = this.gridCommittedRange();
    this.gridPendingRange.set([start, end]);
    const anchor = start ?? new Date();
    this.monthGridYear.set(anchor.getFullYear());
    this.yearGridPageStart.set(Math.floor(anchor.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE);
    this.gridOpen.set(true);
  }

  closeGrid(): void {
    this.gridOpen.set(false);
    this.touched.set(true);
    this._onTouched();
    this.onClose.emit();
  }

  shiftMonthGridYear(delta: number): void {
    this.monthGridYear.update((y) => y + delta);
  }
  shiftYearGridPage(delta: number): void {
    this.yearGridPageStart.update((s) => s + delta * YEARS_PER_PAGE);
  }

  onGridCellSelect(value: number): void {
    const rawDate = this.isMonthRangeView()
      ? new Date(Math.floor(value / 12), value % 12, 1)
      : new Date(value, 0, 1);
    const [start, end] = this.gridPendingRange();
    if (!start || end) {
      this.gridPendingRange.set([rawDate, null]);
    } else if (rawDate.getTime() < start.getTime()) {
      this.gridPendingRange.set([rawDate, start]);
    } else {
      this.gridPendingRange.set([start, rawDate]);
    }
  }

  clearGridRange(): void {
    this.gridPendingRange.set([null, null]);
    this.emit(null);
    this.onClearClick.emit();
  }

  commitGridRange(): void {
    const [start, end] = this.gridPendingRange();
    this.emit(start || end ? [start, end].filter((x): x is Date => !!x) : null);
    this.closeGrid();
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

  // `picker.close()` is required here (rather than leaving the actions bar's Done button to
  // close it): mat-year-view/mat-multi-year-view emit `selectedChange` alongside
  // `monthSelected`/`yearSelected`, which MatCalendar wires to drop straight into the day view —
  // without closing here, the actions panel would stay open one level past the intended granularity.
  onMonthSelected(d: Date, picker: { close(): void }): void {
    if (this.view() === 'month') {
      this.emit(d);
      picker.close();
    }
  }

  onYearSelected(d: Date, picker: { close(): void }): void {
    if (this.view() === 'year') {
      this.emit(d);
      picker.close();
    }
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

  onOpened(): void {
    this.openValue = this.value();
  }

  // Material only commits a calendar pick into the input's value when the actions bar's
  // Done button runs `_applyPendingSelection()` — clicking outside the panel just closes it
  // and drops the pick. Applying it here too, on every close, makes outside-click behave like
  // Done. Two guards keep this from clobbering a value set some other way: `view() === 'date'`
  // skips it for month/year granularity, where `onMonthSelected`/`onYearSelected` already commit
  // outside Material's own selection model; and the `openValue` check skips it whenever
  // Today/Clear/typed input already wrote `value` directly since the panel opened, since in that
  // case the pending clone is stale and applying it would revert that write.
  closed(picker?: { _applyPendingSelection(): void }): void {
    if (this.view() === 'date' && this.value() === this.openValue) {
      picker?._applyPendingSelection();
    }
    this.onClose.emit();
  }

  onBlur(): void {
    this.touched.set(true);
    this._onTouched();
  }

  writeValue(v: Date | Date[] | null): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: Date | Date[] | null) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(_: boolean): void {}
}
