import {
  afterRenderEffect, ChangeDetectionStrategy, Component, computed, contentChild, effect,
  ElementRef, input, model, output, signal, TemplateRef, viewChild,
} from '@angular/core';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { TableColumn, SortDirection, SortState } from './table.types';

@Component({
  selector: 'p-table',
  standalone: true,
  imports: [NgTemplateOutlet, NgStyle, CuiIconComponent, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly columns    = input<TableColumn<T>[]>([]);
  readonly value      = input<T[]>([]);
  readonly loading    = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  /** Checkbox multi-select (default) or click-to-select single row with no checkboxes shown. */
  readonly selectionMode = input<'single' | 'multiple'>('multiple');
  readonly striped    = input<boolean>(false);
  readonly hoverable  = input<boolean>(true);
  readonly stickyHeader = input<boolean>(true);
  /**
   * Constrains the table wrapper to this CSS height (e.g. `'420px'`, `'60vh'`) and enables
   * vertical scrolling within it. Leave unset for the table to grow with its content.
   */
  readonly scrollHeight = input<string | null>(null);
  /** Inline styles applied to the `<table>` element, e.g. `{ 'min-width': '50rem' }`. */
  readonly tableStyle = input<Record<string, string> | null>(null);
  readonly trackBy    = input<(row: T) => unknown>((row) => row);
  /** Renders a chevron toggle column; expanding a row projects `rowDetailTemplate` in a full-width row beneath it. */
  readonly expandable = input<boolean>(false);
  /** `'single'` collapses any previously-expanded row when a new one is expanded. */
  readonly rowExpandMode = input<'single' | 'multiple'>('multiple');
  /** Content projected into the expanded row — e.g. a nested `<p-table>` for a "table in table" detail view. */
  readonly rowDetailTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);
  /** Total column count for the loading/empty-state colspan when using `#header`/`#body` templates instead of `columns`. */
  readonly columnCount = input<number | null>(null);
  /**
   * Rows pinned to the top of the scroll area, staying in view while `value` scrolls beneath
   * them — e.g. "locked" rows a user has pinned. Rendered with the same column/template markup
   * as regular rows, just in a separate, non-scrolling `<tbody>`.
   */
  readonly frozenValue = input<T[]>([]);
  /**
   * Row-windowing for large datasets: only rows in (and just around) the visible scroll range
   * are rendered. Requires `scrollHeight` (to know the viewport height) and the `columns`-array
   * render path — a custom `#body` template has unknown row heights, so virtual scroll silently
   * falls back to full rendering when one is present, with a one-time dev-mode warning.
   */
  readonly virtualScroll = input<boolean>(false);
  /** Fixed row height (px) used for virtual-scroll windowing math. */
  readonly virtualScrollItemSize = input<number>(40);
  /** Shows a drag handle on the trailing edge of each generated `<th>` for interactive width resizing. */
  readonly resizableColumns = input<boolean>(false);
  /**
   * `'fit'` (default) borrows/gives width with the neighboring column so total table width is
   * preserved. `'expand'` only changes the dragged column, growing/shrinking the table instead.
   */
  readonly columnResizeMode = input<'fit' | 'expand'>('fit');
  /** Shows a drag handle for reordering generated columns via `@angular/cdk/drag-drop`. */
  readonly reorderableColumns = input<boolean>(false);

  /** `<ng-template #header>` — replaces the generated `<tr><th>…</th></tr>` header row entirely. */
  readonly headerTemplateRef = contentChild<TemplateRef<void>>('header');
  /** `<ng-template #body let-row>` — replaces the generated `<tr><td>…</td></tr>` row markup entirely; `$implicit` is the row. */
  readonly bodyTemplateRef = contentChild<TemplateRef<{ $implicit: T }>>('body');
  /** `<ng-template #frozenbody let-row>` — row markup for `frozenValue`; falls back to `bodyTemplateRef`, then the generated markup, when absent. */
  readonly frozenBodyTemplateRef = contentChild<TemplateRef<{ $implicit: T }>>('frozenbody');

  // ── Two-way bindable state ────────────────────────────────────────────────
  /** Selected rows. Bindable via `[(selection)]` for externally-controlled selection. */
  readonly selection = model<T[]>([]);
  /** Keys (per `trackBy`) of currently expanded rows. Bindable via `[(expandedRowKeys)]`. */
  readonly expandedRowKeys = model<Set<unknown>>(new Set());
  /** Sorted column key. Bindable via `[(sortField)]`. */
  readonly sortField = model<string | null>(null);
  /** Sort direction. Bindable via `[(sortOrder)]`. */
  readonly sortOrder = model<SortDirection>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  /** Composite sort state, same shape as before — kept alongside `sortField`/`sortOrder` for existing consumers. */
  readonly sortChange      = output<SortState>();
  readonly rowClick        = output<T>();
  /** Composite expand/collapse event — kept alongside `onRowExpand`/`onRowCollapse` for existing consumers. */
  readonly expandChange    = output<{ row: T; expanded: boolean }>();
  readonly onRowSelect     = output<T>();
  readonly onRowUnselect   = output<T>();
  readonly onHeaderCheckboxToggle = output<boolean>();
  readonly onRowExpand     = output<T>();
  readonly onRowCollapse   = output<T>();
  readonly onColResize     = output<{ column: TableColumn<T>; width: number }>();
  readonly onColReorder    = output<{ dragIndex: number; dropIndex: number; columns: TableColumn<T>[] }>();

  // ── Internal state ─────────────────────────────────────────────────────────
  private readonly _colWidths    = signal<Record<string, number>>({});
  private readonly _columnOrder  = signal<string[] | null>(null);
  private readonly _scrollTop    = signal(0);
  private readonly _wrapperHeight = signal(0);
  private readonly OVERSCAN = 3;

  private readonly theadRef       = viewChild<ElementRef<HTMLTableSectionElement>>('theadRef');
  private readonly frozenTbodyRef = viewChild<ElementRef<HTMLTableSectionElement>>('frozenTbodyRef');
  private readonly wrapperRef     = viewChild<ElementRef<HTMLDivElement>>('wrapperRef');

  private warnedVirtualScroll = false;

  constructor() {
    // Measures the actual rendered header/row heights (rather than assuming a fixed row
    // height) so stacked frozen rows land at the right pixel regardless of header content,
    // wrapping, or custom #header/#frozenbody templates. Reruns whenever anything that could
    // change those heights changes.
    afterRenderEffect(() => {
      this.stickyHeader();
      this.frozenValue();
      this.orderedColumns();
      this.headerTemplateRef();
      this.frozenBodyTemplateRef();
      this.bodyTemplateRef();

      const frozenBodyEl = this.frozenTbodyRef()?.nativeElement;
      if (!frozenBodyEl) return;

      let top = this.stickyHeader() ? (this.theadRef()?.nativeElement.offsetHeight ?? 0) : 0;
      for (const row of Array.from(frozenBodyEl.rows)) {
        row.style.setProperty('--p-table-frozen-top', `${top}px`);
        top += row.offsetHeight;
      }
    });

    // Resets any custom drag-reorder order when the `columns` input itself changes to a
    // different set of keys (e.g. the consumer swaps in a new column config).
    effect(() => {
      const keys = this.columns().map(c => c.key);
      const current = this._columnOrder();
      if (current && (current.length !== keys.length || !keys.every(k => current.includes(k)))) {
        this._columnOrder.set(null);
      }
    });

    // Tracks the scroll wrapper's rendered height for virtual-scroll windowing math.
    effect((onCleanup) => {
      const el = this.wrapperRef()?.nativeElement;
      if (!el) return;
      this._wrapperHeight.set(el.clientHeight);
      const ro = new ResizeObserver(() => this._wrapperHeight.set(el.clientHeight));
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    });

    // Dev-mode nudge when virtualScroll is requested but its prerequisites aren't met.
    effect(() => {
      if (this.virtualScroll() && !this.effectiveVirtualScroll() && !this.warnedVirtualScroll) {
        this.warnedVirtualScroll = true;
        console.warn(
          '[p-table] virtualScroll requires `scrollHeight` and the `columns`-array render path ' +
          '(not a custom #body template) — falling back to full rendering.'
        );
      }
    });
  }

  /** Total column count, including the checkbox and expand-toggle columns when present — used for the detail row's colspan. */
  readonly colCount = computed(() =>
    (this.columnCount() ?? this.columns().length)
    + (this.selectable() && this.selectionMode() === 'multiple' ? 1 : 0)
    + (this.expandable() ? 1 : 0)
  );

  private readonly selectedKeys = computed(() => new Set(this.selection().map(r => this.trackBy()(r))));

  readonly allSelected = computed(() => {
    const rows = this.value();
    if (!rows.length) return false;
    const sel = this.selectedKeys();
    return rows.every(r => sel.has(this.trackBy()(r)));
  });

  // ── Column ordering (drag-reorder) ────────────────────────────────────────
  /** `columns()` reordered per any custom drag order — everything renders through this, not raw `columns()`. */
  readonly orderedColumns = computed<TableColumn<T>[]>(() => {
    const cols = this.columns();
    const order = this._columnOrder();
    if (!order) return cols;
    const byKey = new Map(cols.map(c => [c.key, c]));
    const ordered = order.map(k => byKey.get(k)).filter((c): c is TableColumn<T> => !!c);
    for (const c of cols) if (!order.includes(c.key)) ordered.push(c);
    return ordered;
  });

  // ── Virtual scroll ─────────────────────────────────────────────────────────
  readonly effectiveVirtualScroll = computed(() =>
    this.virtualScroll() && !!this.scrollHeight() && !this.bodyTemplateRef()
  );

  private readonly vsStart = computed(() => {
    if (!this.effectiveVirtualScroll()) return 0;
    return Math.max(0, Math.floor(this._scrollTop() / this.virtualScrollItemSize()) - this.OVERSCAN);
  });

  private readonly vsCount = computed(() => {
    if (!this.effectiveVirtualScroll()) return this.value().length;
    return Math.ceil(this._wrapperHeight() / this.virtualScrollItemSize()) + this.OVERSCAN * 2;
  });

  private readonly vsEnd = computed(() =>
    Math.min(this.value().length, this.vsStart() + this.vsCount())
  );

  /** Rows actually rendered in the main tbody — the full `value()` unless virtual scroll is active. */
  readonly visibleRows = computed(() =>
    this.effectiveVirtualScroll() ? this.value().slice(this.vsStart(), this.vsEnd()) : this.value()
  );

  readonly vsTopPx = computed(() => this.vsStart() * this.virtualScrollItemSize());
  readonly vsBottomPx = computed(() => (this.value().length - this.vsEnd()) * this.virtualScrollItemSize());

  onWrapperScroll(event: Event): void {
    if (!this.effectiveVirtualScroll()) return;
    this._scrollTop.set((event.target as HTMLElement).scrollTop);
  }

  // ── Methods ────────────────────────────────────────────────────────────────
  getValue(row: T, col: TableColumn<T>): unknown {
    return col.accessor ? col.accessor(row) : row[col.key];
  }

  // ── Frozen & resizable columns ─────────────────────────────────────────────
  isStickyLeft(col: TableColumn<T>): boolean {
    return col.sticky === true || col.sticky === 'left';
  }

  isStickyRight(col: TableColumn<T>): boolean {
    return col.sticky === 'right';
  }

  /** Effective width (px) for a column, honoring an interactive resize over its configured `width`. */
  effectiveColWidth(col: TableColumn<T>): number {
    return this._colWidths()[col.key] ?? this.parseWidth(col.width);
  }

  /** Cumulative pixel offset from the left edge, stacking past any preceding left-frozen columns. */
  leftOffset(col: TableColumn<T>): number {
    let offset = 0;
    for (const c of this.orderedColumns()) {
      if (c.key === col.key) break;
      if (this.isStickyLeft(c)) offset += this.effectiveColWidth(c);
    }
    return offset;
  }

  /** Cumulative pixel offset from the right edge, stacking past any following right-frozen columns. */
  rightOffset(col: TableColumn<T>): number {
    let offset = 0;
    const cols = this.orderedColumns();
    for (let i = cols.length - 1; i >= 0; i--) {
      const c = cols[i];
      if (c.key === col.key) break;
      if (this.isStickyRight(c)) offset += this.effectiveColWidth(c);
    }
    return offset;
  }

  /** True for the last column in a run of left-frozen columns — gets the divider shadow. */
  isStickyLeftEdge(col: TableColumn<T>): boolean {
    if (!this.isStickyLeft(col)) return false;
    const cols = this.orderedColumns();
    const next = cols[cols.findIndex(c => c.key === col.key) + 1];
    return !next || !this.isStickyLeft(next);
  }

  /** True for the first column in a run of right-frozen columns — gets the divider shadow. */
  isStickyRightEdge(col: TableColumn<T>): boolean {
    if (!this.isStickyRight(col)) return false;
    const cols = this.orderedColumns();
    const prev = cols[cols.findIndex(c => c.key === col.key) - 1];
    return !prev || !this.isStickyRight(prev);
  }

  private parseWidth(width?: string): number {
    const n = width ? parseFloat(width) : NaN;
    return Number.isNaN(n) ? 150 : n;
  }

  /** Sum of every column's effective width (px), used for `columnResizeMode: 'expand'`'s explicit `<table>` width. */
  readonly tableTotalWidthPx = computed(() => {
    let total = this.orderedColumns().reduce((sum, c) => sum + this.effectiveColWidth(c), 0);
    if (this.selectable() && this.selectionMode() === 'multiple') total += 40;
    if (this.expandable()) total += 44;
    return total;
  });

  // ── Column resize ──────────────────────────────────────────────────────────
  onResizeStart(event: PointerEvent, col: TableColumn<T>): void {
    event.preventDefault();
    event.stopPropagation();
    const cols = this.orderedColumns();
    const idx = cols.findIndex(c => c.key === col.key);
    const neighbor = cols[idx + 1];
    const startX = event.clientX;
    const startWidth = this.effectiveColWidth(col);
    const neighborStartWidth = neighbor ? this.effectiveColWidth(neighbor) : 0;
    const minW = col.minWidth ?? 40;
    const neighborMinW = neighbor?.minWidth ?? 40;

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const widths = { ...this._colWidths() };
      widths[col.key] = Math.max(minW, startWidth + delta);
      if (this.columnResizeMode() === 'fit' && neighbor) {
        widths[neighbor.key] = Math.max(neighborMinW, neighborStartWidth - delta);
      }
      this._colWidths.set(widths);
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      this.onColResize.emit({ column: col, width: this._colWidths()[col.key] ?? startWidth });
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  // ── Column reorder ─────────────────────────────────────────────────────────
  onColumnDrop(event: CdkDragDrop<TableColumn<T>[]>): void {
    const cols = [...this.orderedColumns()];
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
    this._columnOrder.set(cols.map(c => c.key));
    this.onColReorder.emit({ dragIndex: event.previousIndex, dropIndex: event.currentIndex, columns: cols });
  }

  onSort(col: TableColumn<T>): void {
    if (!col.sortable) return;
    let next: SortDirection = 'asc';
    if (this.sortField() === col.key) {
      const cur = this.sortOrder();
      next = cur === 'asc' ? 'desc' : cur === 'desc' ? null : 'asc';
    }
    const field = next ? col.key : null;
    this.sortField.set(field);
    this.sortOrder.set(next);
    this.sortChange.emit({ column: field, direction: next });
  }

  getSortIcon(col: TableColumn<T>): string {
    if (this.sortField() !== col.key || !this.sortOrder()) return 'unfold_more';
    return this.sortOrder() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  toggleAll(): void {
    const visible = new Set(this.value().map(r => this.trackBy()(r)));
    if (this.allSelected()) {
      this.selection.set(this.selection().filter(r => !visible.has(this.trackBy()(r))));
    } else {
      const existing = this.selectedKeys();
      this.selection.set([...this.selection(), ...this.value().filter(r => !existing.has(this.trackBy()(r)))]);
    }
    this.onHeaderCheckboxToggle.emit(!this.allSelected());
  }

  toggleRow(row: T): void {
    const key = this.trackBy()(row);
    if (this.selectedKeys().has(key)) {
      this.selection.set(this.selection().filter(r => this.trackBy()(r) !== key));
      this.onRowUnselect.emit(row);
    } else {
      this.selection.set([...this.selection(), row]);
      this.onRowSelect.emit(row);
    }
  }

  isSelected(row: T): boolean {
    return this.selectedKeys().has(this.trackBy()(row));
  }

  /** Row click handler — drives single-selection-mode selecting in addition to always emitting `rowClick`. */
  onRowClick(row: T): void {
    if (this.selectable() && this.selectionMode() === 'single') this.selectSingle(row);
    this.rowClick.emit(row);
  }

  private selectSingle(row: T): void {
    const key = this.trackBy()(row);
    const alreadySelected = this.selection().length === 1 && this.trackBy()(this.selection()[0]) === key;
    this.selection.set(alreadySelected ? [] : [row]);
    alreadySelected ? this.onRowUnselect.emit(row) : this.onRowSelect.emit(row);
  }

  toggleExpand(row: T, event?: Event): void {
    event?.stopPropagation();
    const key = this.trackBy()(row);
    const cur = this.expandedRowKeys();
    const isExpanded = cur.has(key);
    const next = isExpanded
      ? new Set([...cur].filter(k => k !== key))
      : this.rowExpandMode() === 'single' ? new Set([key]) : new Set(cur).add(key);
    this.expandedRowKeys.set(next);
    this.expandChange.emit({ row, expanded: !isExpanded });
    (!isExpanded ? this.onRowExpand : this.onRowCollapse).emit(row);
  }

  isExpanded(row: T): boolean {
    return this.expandedRowKeys().has(this.trackBy()(row));
  }
}
