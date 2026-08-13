import {
  ChangeDetectionStrategy, Component, computed, contentChild, effect, ElementRef, inject, input,
  model, OnDestroy, output, signal, TemplateRef, viewChild, ViewContainerRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiButtonComponent } from '../../atoms/button/button.component';
import { CuiInputComponent } from '../../forms/input/input.component';
import { CuiDatepickerComponent } from '../../forms/datepicker/datepicker.component';
import {
  PositionedSchedulerEvent, SchedulerEvent, SchedulerEventDraft, SchedulerView,
} from './scheduler.types';

/** One day cell in the month grid. */
interface MonthCell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  events: SchedulerEvent[];
}

/** One day group in the schedule (agenda) list. */
interface ScheduleDayGroup {
  date: Date;
  isToday: boolean;
  events: SchedulerEvent[];
}

const ROW_HEIGHT_PX = 64;

@Component({
  selector: 'p-scheduler',
  standalone: true,
  exportAs: 'pScheduler',
  imports: [
    CuiIconComponent, NgTemplateOutlet, FormsModule, CuiButtonComponent, CuiInputComponent,
    CuiDatepickerComponent,
  ],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-scheduler' },
})
export class CuiSchedulerComponent implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly events = input<SchedulerEvent[]>([]);
  readonly date = model<Date>(new Date());
  /** Active layout mode. Default: 'day'. */
  readonly view = model<SchedulerView>('day');
  /** Which view-mode switcher buttons to show in the header. */
  readonly views = input<SchedulerView[]>(['day', 'week', 'month', 'schedule']);
  readonly startHour = input<number>(8);
  readonly endHour = input<number>(18);
  readonly slotMinutes = input<number>(60);
  readonly showNowIndicator = input<boolean>(true);
  /** Show the built-in "quick create" popover (title + description + time) when an empty slot is clicked. */
  readonly enableQuickCreate = input<boolean>(true);
  /** Show the built-in event detail popover (view/edit/delete) when an event is clicked. */
  readonly enableEventDetail = input<boolean>(true);
  /**
   * Token format for the date field shown in the quick-create/event-detail popovers, PrimeNG/jQuery
   * UI-style (see `date-format.util.ts`). Defaults to `'DD-dd-MM-yy'`, e.g. "Monday-13-May-2026".
   */
  readonly dateFormat = input<string>('DD-dd-MM-yy');

  readonly eventClick = output<SchedulerEvent>();
  readonly slotClick = output<{ start: Date; end: Date }>();
  /** Emitted when the quick-create popover is saved. */
  readonly eventCreate = output<SchedulerEventDraft>();
  /** Emitted when an edited event is saved from the detail popover. */
  readonly eventUpdate = output<SchedulerEvent>();
  /** Emitted when an event is deleted from the detail popover. */
  readonly eventDelete = output<SchedulerEvent>();

  readonly eventTemplate =
    contentChild<TemplateRef<{ $implicit: SchedulerEvent }>>('eventTemplate');

  private readonly quickCreatePanel =
    viewChild.required<TemplateRef<unknown>>('quickCreatePanel');

  private readonly eventDetailPanel =
    viewChild.required<TemplateRef<unknown>>('eventDetailPanel');

  readonly rowHeightPx = ROW_HEIGHT_PX;

  readonly hours = computed<number[]>(() => {
    const list: number[] = [];
    for (let h = this.startHour(); h < this.endHour(); h++) list.push(h);
    return list;
  });

  readonly gridHeight = computed(() =>
    ((this.endHour() - this.startHour()) * 60 / this.slotMinutes()) * this.rowHeightPx
  );

  readonly weekStart = computed(() => this.startOfWeek(this.date()));

  readonly weekDays = computed<Date[]>(() => {
    const start = this.weekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  });

  readonly dateLabel = computed(() => {
    const view = this.view();
    if (view === 'week') {
      const days = this.weekDays();
      const first = days[0];
      const last = days[6];
      const sameMonth = first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear();
      const firstLabel = first.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      const lastLabel = last.toLocaleDateString(
        undefined,
        sameMonth ? { day: 'numeric', year: 'numeric' } : { day: 'numeric', month: 'short', year: 'numeric' }
      );
      return `${firstLabel} - ${lastLabel}`;
    }
    if (view === 'month') {
      return this.date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
    return this.date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  });

  readonly isToday = computed(() => this.isSameDay(this.date(), new Date()));

  /** Events for the active week, one bucket per weekday, each sorted and count-capped for the summary strip. */
  readonly weekColumns = computed<{ date: Date; isToday: boolean; events: SchedulerEvent[] }[]>(() => {
    const all = this.events();
    return this.weekDays().map((date) => ({
      date,
      isToday: this.isSameDay(date, new Date()),
      events: all
        .filter((e) => this.isSameDay(e.start, date))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    }));
  });

  /** 6-week (42-cell) month grid, each cell carrying that day's events. */
  readonly monthCells = computed<MonthCell[]>(() => {
    const active = this.date();
    const firstOfMonth = new Date(active.getFullYear(), active.getMonth(), 1);
    const gridStart = this.startOfWeek(firstOfMonth);
    const all = this.events();
    const today = new Date();

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(date.getDate() + i);
      return {
        date,
        inMonth: date.getMonth() === active.getMonth(),
        isToday: this.isSameDay(date, today),
        events: all
          .filter((e) => this.isSameDay(e.start, date))
          .sort((a, b) => a.start.getTime() - b.start.getTime()),
      };
    });
  });

  /** Upcoming events (from the active date onward) grouped by day, agenda-style. */
  readonly scheduleGroups = computed<ScheduleDayGroup[]>(() => {
    const from = new Date(this.date());
    from.setHours(0, 0, 0, 0);
    const today = new Date();

    const byDay = new Map<string, SchedulerEvent[]>();
    for (const ev of this.events()) {
      if (ev.start < from) continue;
      const key = ev.start.toDateString();
      const bucket = byDay.get(key);
      if (bucket) bucket.push(ev);
      else byDay.set(key, [ev]);
    }

    return Array.from(byDay.entries())
      .map(([key, evs]) => ({
        date: new Date(key),
        isToday: this.isSameDay(new Date(key), today),
        events: evs.sort((a, b) => a.start.getTime() - b.start.getTime()),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  /** Events for the active day, laid out into non-overlapping side-by-side columns. */
  readonly positionedEvents = computed<PositionedSchedulerEvent[]>(() => {
    const day = this.date();
    const dayEvents = this.events()
      .filter((e) => this.isSameDay(e.start, day))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const groupOf = new Map<SchedulerEvent, number>();
    let groupEnd = -Infinity;
    let groupStartIdx = 0;

    const positioned: PositionedSchedulerEvent[] = [];

    const flushGroup = (endIdx: number) => {
      const groupEvents = dayEvents.slice(groupStartIdx, endIdx);
      const cols: SchedulerEvent[][] = [];
      for (const ev of groupEvents) {
        let col = cols.find((c) => c[c.length - 1].end.getTime() <= ev.start.getTime());
        if (!col) { col = []; cols.push(col); }
        col.push(ev);
        groupOf.set(ev, cols.indexOf(col));
      }
      const colCount = cols.length;
      for (const ev of groupEvents) {
        positioned.push({
          ...ev,
          top: this.minutesToPx(ev.start),
          height: Math.max(this.minutesToPx(ev.end) - this.minutesToPx(ev.start), 18),
          leftPct: (groupOf.get(ev)! / colCount) * 100,
          widthPct: (1 / colCount) * 100,
        });
      }
    };

    dayEvents.forEach((ev, i) => {
      if (ev.start.getTime() >= groupEnd) {
        if (i > groupStartIdx) flushGroup(i);
        groupStartIdx = i;
        groupEnd = ev.end.getTime();
      } else {
        groupEnd = Math.max(groupEnd, ev.end.getTime());
      }
    });
    if (dayEvents.length) flushGroup(dayEvents.length);

    return positioned;
  });

  // ── Quick-create popover ──────────────────────────────────────────────────
  private overlayRef: OverlayRef | null = null;
  readonly quickCreateOpen = signal(false);
  readonly quickCreateTitle = signal('');
  readonly quickCreateDescription = signal('');
  readonly quickCreateSlot = signal<{ start: Date; end: Date } | null>(null);
  /** Date portion, editable via the calendar field (manual typing or the picker). */
  readonly quickCreateDate = signal<Date | null>(null);
  /** Time-of-day inputs, "HH:mm" (native <input type="time"> value format). */
  readonly quickCreateStartTime = signal('');
  readonly quickCreateEndTime = signal('');

  readonly quickCreateTimeInvalid = computed(() =>
    !this.isEndAfterStart(this.quickCreateStartTime(), this.quickCreateEndTime())
  );

  private readonly nowTick = signal(Date.now());

  readonly nowOffsetPx = computed<number | null>(() => {
    if (!this.showNowIndicator() || !this.isToday()) return null;
    this.nowTick();
    return this.minutesToPx(new Date());
  });

  constructor() {
    effect((onCleanup) => {
      const id = setInterval(() => this.nowTick.set(Date.now()), 60_000);
      onCleanup(() => clearInterval(id));
    });
  }

  setView(view: SchedulerView): void {
    this.view.set(view);
  }

  goToToday(): void {
    this.date.set(new Date());
  }

  goToPrevious(): void {
    this.date.set(this.shiftDate(-1));
  }

  goToNext(): void {
    this.date.set(this.shiftDate(1));
  }

  private shiftDate(direction: 1 | -1): Date {
    const d = new Date(this.date());
    switch (this.view()) {
      case 'week':
        d.setDate(d.getDate() + direction * 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() + direction);
        break;
      default:
        d.setDate(d.getDate() + direction);
    }
    return d;
  }

  onEventClick(ev: SchedulerEvent, target: EventTarget | null): void {
    this.eventClick.emit(ev);
    if (this.enableEventDetail() && target instanceof HTMLElement) {
      this.openEventDetail(target, ev);
    }
  }

  onSlotClick(hour: number, target: EventTarget | null): void {
    const start = new Date(this.date());
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + this.slotMinutes());
    this.slotClick.emit({ start, end });

    if (this.enableQuickCreate() && target instanceof HTMLElement) {
      this.openQuickCreate(target, start, end);
    }
  }

  private openQuickCreate(target: HTMLElement, start: Date, end: Date): void {
    this.closePopovers();

    this.quickCreateTitle.set('');
    this.quickCreateDescription.set('');
    this.quickCreateSlot.set({ start, end });
    this.quickCreateDate.set(start);
    this.quickCreateStartTime.set(this.toTimeValue(start));
    this.quickCreateEndTime.set(this.toTimeValue(end));

    this.overlayRef = this.createOverlay(target);
    this.overlayRef.backdropClick().subscribe(() => this.closePopovers());
    this.overlayRef.attach(new TemplatePortal(this.quickCreatePanel(), this.viewContainerRef));
    this.quickCreateOpen.set(true);
  }

  closeQuickCreate(): void {
    this.closePopovers();
  }

  saveQuickCreate(): void {
    const slot = this.quickCreateSlot();
    const date = this.quickCreateDate();
    const title = this.quickCreateTitle().trim();
    if (!slot || !date || !title || this.quickCreateTimeInvalid()) return;

    const start = this.applyTimeValue(date, this.quickCreateStartTime());
    const end = this.applyTimeValue(date, this.quickCreateEndTime());

    this.eventCreate.emit({
      title,
      description: this.quickCreateDescription().trim() || undefined,
      start,
      end,
    });
    this.closePopovers();
  }

  // ── Event detail popover ──────────────────────────────────────────────────
  readonly eventDetailOpen = signal(false);
  readonly eventDetailEditing = signal(false);
  readonly eventDetailEvent = signal<SchedulerEvent | null>(null);
  readonly eventDetailTitle = signal('');
  readonly eventDetailDescription = signal('');
  /** Date portion, editable via the calendar field (manual typing or the picker). */
  readonly eventDetailDate = signal<Date | null>(null);
  /** Time-of-day inputs, "HH:mm" (native <input type="time"> value format). */
  readonly eventDetailStartTime = signal('');
  readonly eventDetailEndTime = signal('');

  readonly eventDetailDateTimeLabel = computed(() => {
    const ev = this.eventDetailEvent();
    if (!ev) return '';
    const dateLabel = ev.start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    return `${dateLabel} · ${this.formatTimeRange(ev.start, ev.end)}`;
  });

  readonly eventDetailTimeInvalid = computed(() =>
    !this.isEndAfterStart(this.eventDetailStartTime(), this.eventDetailEndTime())
  );

  private openEventDetail(target: HTMLElement, ev: SchedulerEvent): void {
    this.closePopovers();

    this.eventDetailEvent.set(ev);
    this.eventDetailEditing.set(false);
    this.eventDetailTitle.set(ev.title);
    this.eventDetailDescription.set(ev.description ?? '');
    this.eventDetailDate.set(ev.start);
    this.eventDetailStartTime.set(this.toTimeValue(ev.start));
    this.eventDetailEndTime.set(this.toTimeValue(ev.end));

    this.overlayRef = this.createOverlay(target);
    this.overlayRef.backdropClick().subscribe(() => this.closePopovers());
    this.overlayRef.attach(new TemplatePortal(this.eventDetailPanel(), this.viewContainerRef));
    this.eventDetailOpen.set(true);
  }

  startEditEvent(): void {
    this.eventDetailEditing.set(true);
  }

  cancelEditEvent(): void {
    const ev = this.eventDetailEvent();
    if (!ev) return;
    this.eventDetailTitle.set(ev.title);
    this.eventDetailDescription.set(ev.description ?? '');
    this.eventDetailDate.set(ev.start);
    this.eventDetailStartTime.set(this.toTimeValue(ev.start));
    this.eventDetailEndTime.set(this.toTimeValue(ev.end));
    this.eventDetailEditing.set(false);
  }

  saveEditEvent(): void {
    const ev = this.eventDetailEvent();
    const date = this.eventDetailDate();
    const title = this.eventDetailTitle().trim();
    if (!ev || !date || !title || this.eventDetailTimeInvalid()) return;

    const start = this.applyTimeValue(date, this.eventDetailStartTime());
    const end = this.applyTimeValue(date, this.eventDetailEndTime());

    const updated: SchedulerEvent = {
      ...ev,
      title,
      description: this.eventDetailDescription().trim() || undefined,
      start,
      end,
    };
    this.eventUpdate.emit(updated);
    this.eventDetailEvent.set(updated);
    this.eventDetailEditing.set(false);
  }

  deleteEvent(): void {
    const ev = this.eventDetailEvent();
    if (!ev) return;
    this.eventDelete.emit(ev);
    this.closePopovers();
  }

  closeEventDetail(): void {
    this.closePopovers();
  }

  private createOverlay(target: HTMLElement): OverlayRef {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(new ElementRef(target))
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 8 },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
      ]);

    return this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  private closePopovers(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.quickCreateOpen.set(false);
    this.eventDetailOpen.set(false);
    this.eventDetailEditing.set(false);
    this.eventDetailEvent.set(null);
  }

  formatHour(hour: number): string {
    const d = new Date();
    d.setHours(hour, 0, 0, 0);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  formatEventTime(ev: SchedulerEvent): string {
    return this.formatTimeRange(ev.start, ev.end);
  }

  formatWeekdayShort(d: Date): string {
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }

  formatDayNumber(d: Date): string {
    return String(d.getDate());
  }

  formatScheduleGroupLabel(d: Date, isToday: boolean): string {
    if (isToday) return 'Today';
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  }

  viewLabel(view: SchedulerView): string {
    switch (view) {
      case 'day': return 'Day';
      case 'week': return 'Week';
      case 'month': return 'Month';
      case 'schedule': return 'Schedule';
    }
  }

  selectDay(date: Date): void {
    this.date.set(date);
    this.view.set('day');
  }

  private formatTimeRange(start: Date, end: Date): string {
    const fmt = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${fmt(start)} - ${fmt(end)}`;
  }

  /** Converts a Date's time-of-day to an <input type="time"> value, e.g. "09:30". */
  private toTimeValue(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /** Returns a copy of `base`'s date with the time-of-day from an <input type="time"> value applied. */
  private applyTimeValue(base: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(base);
    result.setHours(hours || 0, minutes || 0, 0, 0);
    return result;
  }

  private isEndAfterStart(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) return false;
    return endTime > startTime;
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  private minutesToPx(d: Date): number {
    const minutesSinceStart = (d.getHours() - this.startHour()) * 60 + d.getMinutes();
    return (minutesSinceStart / this.slotMinutes()) * this.rowHeightPx;
  }

  private startOfWeek(d: Date): Date {
    const result = new Date(d);
    result.setDate(result.getDate() - result.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }
}
