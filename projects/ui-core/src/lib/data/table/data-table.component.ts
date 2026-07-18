import {
  ChangeDetectionStrategy, Component, effect,
  input, model, output, signal, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CuiTableComponent } from './table.component';
import { CuiPaginationComponent, PageEvent } from '../../navigation/pagination/pagination.component';
import { CuiInputComponent } from '../../forms/input/input.component';
import { TableColumn, SortDirection, SortState } from './table.types';

export interface DataTableChangeEvent {
  sort: SortState;
  page: number;
  pageSize: number;
  search: string;
}

@Component({
  selector: 'p-data-table',
  standalone: true,
  imports: [CuiTableComponent, CuiPaginationComponent, CuiInputComponent, NgTemplateOutlet],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiDataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly columns    = input<TableColumn<T>[]>([]);
  readonly value      = input<T[]>([]);
  readonly total      = input<number>(0);
  readonly loading    = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  /** Checkbox multi-select (default) or click-to-select single row with no checkboxes shown. */
  readonly selectionMode = input<'single' | 'multiple'>('multiple');
  readonly striped    = input<boolean>(false);
  /** Constrains the inner `p-table` to this CSS height and enables vertical scrolling (e.g. '420px', '60vh'). */
  readonly scrollHeight = input<string | null>(null);
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search…');
  readonly pageSizes  = input<number[]>([10, 25, 50]);
  readonly trackBy    = input<(row: T) => unknown>((row) => row);
  /** Renders a chevron toggle column; expanding a row projects `rowDetailTemplate` in a full-width row beneath it. */
  readonly expandable = input<boolean>(false);
  /** `'single'` collapses any previously-expanded row when a new one is expanded. */
  readonly rowExpandMode = input<'single' | 'multiple'>('multiple');
  /** Content projected into the expanded row — e.g. a nested `<p-table>` for a "table in table" detail view. */
  readonly rowDetailTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);
  /** Rows pinned to the top of the scroll area, staying in view while `value` scrolls beneath them. */
  readonly frozenValue = input<T[]>([]);
  /** Row-windowing for large datasets — see `p-table`'s `virtualScroll` for prerequisites. */
  readonly virtualScroll = input<boolean>(false);
  readonly virtualScrollItemSize = input<number>(40);
  /** Shows a drag handle on the trailing edge of each generated column header for interactive width resizing. */
  readonly resizableColumns = input<boolean>(false);
  readonly columnResizeMode = input<'fit' | 'expand'>('fit');
  /** Shows a drag handle for reordering columns. */
  readonly reorderableColumns = input<boolean>(false);
  /** Shows/hides the pagination footer entirely. */
  readonly paginator = input<boolean>(true);
  /** Where the pagination control renders relative to the table. */
  readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
  /** When set, persists `{sort, page, pageSize, search}` to `stateStorage` under this key and restores it on init. */
  readonly stateKey = input<string | null>(null);
  /** `'session'` (default, `sessionStorage`) or `'local'` (`localStorage`). Only used when `stateKey` is set. */
  readonly stateStorage = input<'session' | 'local'>('session');

  // ── Two-way bindable state ────────────────────────────────────────────────
  readonly page      = model<number>(1);
  readonly pageSize  = model<number>(10);
  readonly selection = model<T[]>([]);
  readonly expandedRowKeys = model<Set<unknown>>(new Set());
  readonly sortField = model<string | null>(null);
  readonly sortOrder = model<SortDirection>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly stateChange     = output<DataTableChangeEvent>();
  readonly rowClick        = output<T>();
  readonly expandChange    = output<{ row: T; expanded: boolean }>();
  readonly sortChange      = output<SortState>();
  readonly onRowSelect     = output<T>();
  readonly onRowUnselect   = output<T>();
  readonly onHeaderCheckboxToggle = output<boolean>();
  readonly onRowExpand     = output<T>();
  readonly onRowCollapse   = output<T>();
  readonly onColResize     = output<{ column: TableColumn<T>; width: number }>();
  readonly onColReorder    = output<{ dragIndex: number; dropIndex: number; columns: TableColumn<T>[] }>();
  readonly onStateSave     = output<DataTableChangeEvent>();
  readonly onStateRestore  = output<DataTableChangeEvent>();

  // ── Internal ───────────────────────────────────────────────────────────────
  readonly _search = signal('');

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;
  private restored = false;

  constructor() {
    // Restores persisted state (if any) once, before the first meaningful render — guarded so it
    // only ever fires a single time even though `stateKey()`/`stateStorage()` are reactive deps.
    effect(() => {
      if (this.restored) return;
      const key = this.stateKey();
      if (!key) return;
      this.restored = true;
      try {
        const store = this.stateStorage() === 'local' ? localStorage : sessionStorage;
        const raw = store.getItem(key);
        if (!raw) return;
        const state = JSON.parse(raw) as DataTableChangeEvent;
        this.page.set(state.page);
        this.pageSize.set(state.pageSize);
        this.sortField.set(state.sort.column);
        this.sortOrder.set(state.sort.direction);
        this._search.set(state.search);
        this.onStateRestore.emit(state);
      } catch {
        // Corrupt/foreign storage value under this key — ignore and start fresh.
      }
    });
  }

  onSortChange(sort: SortState): void {
    this.page.set(1);
    this.sortChange.emit(sort);
    this.emit();
  }

  onPageChange(e: PageEvent): void {
    this.page.set(e.page);
    this.pageSize.set(e.pageSize);
    this.emit();
  }

  onSearch(value: string): void {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this._search.set(value);
      this.page.set(1);
      this.emit();
    }, 300);
  }

  private emit(): void {
    const state: DataTableChangeEvent = {
      sort: { column: this.sortField(), direction: this.sortOrder() },
      page: this.page(),
      pageSize: this.pageSize(),
      search: this._search(),
    };
    this.stateChange.emit(state);

    const key = this.stateKey();
    if (!key) return;
    try {
      const store = this.stateStorage() === 'local' ? localStorage : sessionStorage;
      store.setItem(key, JSON.stringify(state));
      this.onStateSave.emit(state);
    } catch {
      // Private-browsing/quota errors — persistence is best-effort.
    }
  }
}
