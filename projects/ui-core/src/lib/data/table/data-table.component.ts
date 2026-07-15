import {
  ChangeDetectionStrategy, Component, computed,
  input, output, signal, TemplateRef,
} from '@angular/core';
import { CuiTableComponent } from './table.component';
import { CuiPaginationComponent, PageEvent } from '../../navigation/pagination/pagination.component';
import { CuiInputComponent } from '../../forms/input/input.component';
import { TableColumn, SortState, TableState } from './table.types';

export interface DataTableChangeEvent {
  sort: SortState;
  page: number;
  pageSize: number;
  search: string;
}

@Component({
  selector: 'p-data-table',
  standalone: true,
  imports: [CuiTableComponent, CuiPaginationComponent, CuiInputComponent],
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
  readonly striped    = input<boolean>(false);
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search…');
  readonly pageSizes  = input<number[]>([10, 25, 50]);
  readonly trackBy    = input<(row: T) => unknown>((row) => row);
  /** Renders a chevron toggle column; expanding a row projects `rowDetailTemplate` in a full-width row beneath it. */
  readonly expandable = input<boolean>(false);
  /** Content projected into the expanded row — e.g. a nested `<p-table>` for a "table in table" detail view. */
  readonly rowDetailTemplate = input<TemplateRef<{ $implicit: T }> | null>(null);

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly stateChange     = output<DataTableChangeEvent>();
  readonly selectionChange = output<T[]>();
  readonly rowClick        = output<T>();
  readonly expandChange    = output<{ row: T; expanded: boolean }>();

  // ── Internal ───────────────────────────────────────────────────────────────
  readonly _page     = signal(1);
  readonly _pageSize = signal(10);
  readonly _sort     = signal<SortState>({ column: null, direction: null });
  readonly _search   = signal('');

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  onSortChange(sort: SortState): void {
    this._sort.set(sort);
    this._page.set(1);
    this.emit();
  }

  onPageChange(e: PageEvent): void {
    this._page.set(e.page);
    this._pageSize.set(e.pageSize);
    this.emit();
  }

  onSearch(value: string): void {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this._search.set(value);
      this._page.set(1);
      this.emit();
    }, 300);
  }

  private emit(): void {
    this.stateChange.emit({
      sort: this._sort(),
      page: this._page(),
      pageSize: this._pageSize(),
      search: this._search(),
    });
  }
}
