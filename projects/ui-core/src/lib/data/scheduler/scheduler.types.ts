export type SchedulerEventColor = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'neutral';

/** Active layout mode. 'day' renders the hourly time grid; 'week'/'month'/'schedule' are summary views. */
export type SchedulerView = 'day' | 'week' | 'month' | 'schedule';

/**
 * Preferred side for the quick-create/event-detail popovers, tooltip-style. 'auto' (default) picks
 * the side with more room and flips to the opposite side when the preferred side doesn't fit.
 */
export type SchedulerPanelPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right';

export interface SchedulerEvent {
  /** Unique id. */
  id: string;
  title: string;
  /** Optional secondary line, e.g. a time range or location — rendered under the title. */
  subtitle?: string;
  /** Optional free-text notes, shown in the event detail popover and editable there. */
  description?: string;
  start: Date;
  end: Date;
  /** Block color. Default: 'blue'. */
  color?: SchedulerEventColor;
  /** Passthrough for the consumer's own event payload. */
  data?: unknown;
}

/** Draft payload for creating an event via the built-in quick-create popover. */
export interface SchedulerEventDraft {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: SchedulerEventColor;
}

/** Internal — a SchedulerEvent with computed pixel/percentage layout. */
export interface PositionedSchedulerEvent extends SchedulerEvent {
  top: number;
  height: number;
  leftPct: number;
  widthPct: number;
}
