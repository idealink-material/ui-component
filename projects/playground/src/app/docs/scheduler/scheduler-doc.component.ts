import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import {
  CuiButtonComponent, CuiSchedulerComponent, CuiSelectComponent, SchedulerEvent,
  SchedulerEventDraft, SchedulerView, SelectOptionLike,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

function at(hour: number, minute = 0): Date {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

function onDay(dayOffset: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

@Component({
  selector: 'app-scheduler-doc',
  imports: [
    CuiSchedulerComponent,
    CuiButtonComponent,
    CuiSelectComponent,
    DocExampleComponent,
    DocShellComponent,
    JsonPipe,
  ],
  templateUrl: './scheduler-doc.component.html',
  styleUrl: './scheduler-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic day view' },
    { id: 'views', label: 'Day / week / month / schedule' },
    { id: 'quick-create', label: 'Add event (quick create)' },
    { id: 'event-detail', label: 'View, edit & delete an event' },
    { id: 'overlap', label: 'Overlapping events' },
    { id: 'toolbar', label: 'Toolbar actions slot' },
  ];

  readonly themingSections: DocSection[] = [{ id: 'theming-tokens', label: 'Design tokens' }];

  readonly properties: DocApiProperty[] = [
    { name: 'events', type: 'SchedulerEvent[]', default: '[]', description: 'Events to render; only those on the active date are shown.' },
    { name: 'date', type: 'Date', default: 'new Date()', description: 'Active day. Bindable via [(date)].' },
    { name: 'view', type: `'day' | 'week' | 'month' | 'schedule'`, default: `'day'`, description: 'Active layout mode. Bindable via [(view)]. Prev/Today/Next step by day, week, or month to match.' },
    { name: 'views', type: `SchedulerView[]`, default: `['day', 'week', 'month', 'schedule']`, description: 'Which view-mode buttons to show in the header switcher. Pass a subset to restrict.' },
    { name: 'startHour', type: 'number', default: '8', description: 'First visible hour (0-23).' },
    { name: 'endHour', type: 'number', default: '18', description: 'Last visible hour, exclusive.' },
    { name: 'slotMinutes', type: 'number', default: '60', description: 'Row granularity in minutes.' },
    { name: 'showNowIndicator', type: 'boolean', default: 'true', description: 'Show the live current-time line when viewing today.' },
    { name: 'enableQuickCreate', type: 'boolean', default: 'true', description: 'Open a built-in title + description + time "quick create" popover (anchored to the clicked slot, à la Google Calendar) when an empty slot is clicked.' },
    { name: 'enableEventDetail', type: 'boolean', default: 'true', description: 'Open a built-in event detail popover (view, edit, delete — anchored to the clicked event, à la Google Calendar) when an event is clicked.' },
    { name: 'dateFormat', type: 'string', default: `'DD-dd-MM-yy'`, description: 'Token format (PrimeNG/jQuery UI-style) for the date field in the quick-create/event-detail popovers, e.g. "Monday-13-May-2026". The field is manually editable as text, or via the calendar icon\'s picker.' },
    { name: '#eventTemplate', type: 'TemplateRef<{ $implicit: SchedulerEvent }>', default: '—', description: 'Custom content for each event block, replacing the default title/subtitle markup.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'eventClick', type: 'EventEmitter<SchedulerEvent>', description: 'Emitted when an event block is clicked, before the detail popover opens.' },
    { name: 'slotClick', type: 'EventEmitter<{ start: Date; end: Date }>', description: 'Emitted when an empty grid slot is clicked, before the quick-create popover opens.' },
    { name: 'eventCreate', type: 'EventEmitter<SchedulerEventDraft>', description: 'Emitted when the built-in quick-create popover is saved.' },
    { name: 'eventUpdate', type: 'EventEmitter<SchedulerEvent>', description: 'Emitted with the full updated event when the detail popover\'s edit form is saved.' },
    { name: 'eventDelete', type: 'EventEmitter<SchedulerEvent>', description: 'Emitted when the detail popover\'s delete action is used. The consumer owns removing it from events.' },
    { name: 'dateChange', type: 'EventEmitter<Date>', description: 'Emitted when the active date changes (via [(date)]).' },
    { name: 'viewChange', type: 'EventEmitter<SchedulerView>', description: 'Emitted when the active view changes (via [(view)]), including when a week/month cell is clicked to drill into that day.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SchedulerEvent',
      fields: [
        { name: 'id', type: 'string', description: 'Unique identifier.' },
        { name: 'title', type: 'string', description: 'Primary label.' },
        { name: 'subtitle', type: 'string | undefined', description: 'Secondary line; defaults to the formatted time range when omitted.' },
        { name: 'description', type: 'string | undefined', description: 'Free-text notes, shown and editable in the event detail popover.' },
        { name: 'start', type: 'Date', description: 'Event start time.' },
        { name: 'end', type: 'Date', description: 'Event end time.' },
        { name: 'color', type: `'blue' | 'red' | 'green' | 'purple' | 'orange' | 'neutral' | undefined`, description: "Block color. Default 'blue'." },
        { name: 'data', type: 'unknown', description: "Passthrough for the consumer's own event payload." },
      ],
    },
    {
      name: 'SchedulerEventDraft',
      fields: [
        { name: 'title', type: 'string', description: 'Entered title.' },
        { name: 'description', type: 'string | undefined', description: 'Entered description, if any.' },
        { name: 'start', type: 'Date', description: 'Slot start time.' },
        { name: 'end', type: 'Date', description: 'Slot end time.' },
      ],
    },
  ];

  readonly basicEvents = signal<SchedulerEvent[]>([
    { id: '1', title: 'Chin Panhanirarith', start: at(9, 30), end: at(10, 0), color: 'blue' },
    { id: '2', title: 'Chin Panhanirarith', start: at(14, 0), end: at(14, 30), color: 'blue' },
    { id: '3', title: '2 Requests', start: at(14, 30), end: at(15, 0), color: 'red' },
  ]);

  readonly editableEvents = signal<SchedulerEvent[]>([
    {
      id: 'e1', title: 'Meeting', start: at(11, 0), end: at(12, 0), color: 'blue',
      description: 'Hi team, let have a meeting tomorrow time 13:30',
    },
  ]);

  readonly viewsDate = signal(new Date());
  readonly viewsMode = signal<SchedulerView>('week');
  readonly viewsEvents: SchedulerEvent[] = [
    { id: 'v1', title: 'Standup', start: onDay(-1, 9, 0), end: onDay(-1, 9, 15), color: 'blue' },
    { id: 'v2', title: 'Client Call', start: onDay(0, 11, 0), end: onDay(0, 11, 30), color: 'purple' },
    { id: 'v3', title: 'Chin Panhanirarith', start: onDay(0, 14, 0), end: onDay(0, 14, 30), color: 'blue' },
    { id: 'v4', title: '2 Requests', start: onDay(0, 14, 30), end: onDay(0, 15, 0), color: 'red' },
    { id: 'v5', title: 'Design Review', start: onDay(2, 10, 0), end: onDay(2, 11, 0), color: 'green' },
    { id: 'v6', title: 'Follow-up', start: onDay(3, 13, 0), end: onDay(3, 13, 30), color: 'orange' },
    { id: 'v7', title: 'Team Sync', start: onDay(5, 9, 30), end: onDay(5, 10, 0), color: 'neutral' },
  ];

  readonly overlapEvents: SchedulerEvent[] = [
    { id: 'a', title: 'Consultation', start: at(10, 0), end: at(11, 0), color: 'blue' },
    { id: 'b', title: 'Follow-up', start: at(10, 30), end: at(11, 30), color: 'purple' },
    { id: 'c', title: 'Lab Review', start: at(10, 45), end: at(11, 15), color: 'orange' },
  ];

  readonly statusOptions: SelectOptionLike<string>[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
  ];

  readonly lastClickedEvent = signal<SchedulerEvent | null>(null);
  readonly lastSlot = signal<{ start: Date; end: Date } | null>(null);

  onEventClick(ev: SchedulerEvent): void {
    this.lastClickedEvent.set(ev);
  }

  onSlotClick(slot: { start: Date; end: Date }): void {
    this.lastSlot.set(slot);
  }

  onEventCreate(draft: SchedulerEventDraft): void {
    this.basicEvents.update((events) => [
      ...events,
      {
        id: crypto.randomUUID(), title: draft.title, description: draft.description,
        start: draft.start, end: draft.end, color: 'blue',
      },
    ]);
  }

  onEventUpdate(updated: SchedulerEvent): void {
    this.editableEvents.update((events) => events.map((e) => (e.id === updated.id ? updated : e)));
  }

  onEventDelete(deleted: SchedulerEvent): void {
    this.editableEvents.update((events) => events.filter((e) => e.id !== deleted.id));
  }
}
