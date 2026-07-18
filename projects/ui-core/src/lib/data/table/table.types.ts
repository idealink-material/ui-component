import { TemplateRef } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = Record<string, unknown>> {
  /** Unique key — also used as the data accessor when `accessor` is absent. */
  key: string;
  /** Column header label. */
  header: string;
  /** Data accessor. Defaults to `row[key]`. */
  accessor?: (row: T) => unknown;
  /** Optional cell template (passed as TemplateRef). */
  cellTemplate?: TemplateRef<{ $implicit: T; value: unknown }>;
  /** Enable sorting for this column. Default: false. */
  sortable?: boolean;
  /** Column width CSS value (e.g. '120px', '1fr'). */
  width?: string;
  /** Text alignment. Default: 'left'. */
  align?: 'left' | 'center' | 'right';
  /**
   * Freezes ("pins") the column at the given edge while the table scrolls horizontally.
   * `true` is shorthand for `'left'`. Multiple columns may be frozen on the same edge —
   * their offsets stack in column order automatically.
   *
   * For a correct offset, give every frozen column an explicit pixel `width` (e.g. `'140px'`);
   * columns without one fall back to a 150px assumption which may misalign.
   */
  sticky?: boolean | 'left' | 'right';
  /** Floor (px) for interactive resizing via `resizableColumns` on `p-table`. Default: 40. */
  minWidth?: number;
}

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface TableState {
  sort: SortState;
  page: number;
  pageSize: number;
  total: number;
}
