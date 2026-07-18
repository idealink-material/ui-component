import {
  ChangeDetectionStrategy, Component, computed, input, output,
} from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

export interface PageEvent {
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'p-pagination',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Pagination',
  },
})
export class CuiPaginationComponent {
  readonly page      = input<number>(1);
  readonly pageSize  = input<number>(10);
  readonly total     = input<number>(0);
  readonly pageSizes = input<number[]>([10, 25, 50, 100]);
  readonly showPageSizeSelector = input<boolean>(true);
  /** Shows first/last-page jump buttons alongside prev/next. */
  readonly showFirstLast        = input<boolean>(true);
  readonly compact              = input<boolean>(false);
  /** Hides the whole component when there's only one page (or none). Default: always shown. */
  readonly alwaysShowPaginator  = input<boolean>(true);
  /** Toggles the "X–Y of Z" info text independently of `compact`. */
  readonly showCurrentPageReport = input<boolean>(true);
  /** Overrides the default "X–Y of Z" text; `{first}`, `{last}`, `{totalRecords}` tokens are replaced. */
  readonly currentPageReportTemplate = input<string | null>(null);
  /** Shows individual page-number buttons. When `false`, falls back to the compact "page/totalPages" text. */
  readonly showPageLinks = input<boolean>(true);
  /** Shows a page-select dropdown for jumping directly to a page. */
  readonly showJumpToPageDropdown = input<boolean>(false);
  /** Shows a number input + "Go" button for jumping directly to a page. */
  readonly showJumpToPageInput = input<boolean>(false);

  readonly pageChange = output<PageEvent>();

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize()))
  );

  readonly totalPagesArray = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly startItem = computed(() =>
    this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1
  );

  readonly endItem = computed(() =>
    Math.min(this.page() * this.pageSize(), this.total())
  );

  readonly reportText = computed(() => {
    const tpl = this.currentPageReportTemplate();
    if (tpl) {
      return tpl
        .replace('{first}', String(this.startItem()))
        .replace('{last}', String(this.endItem()))
        .replace('{totalRecords}', String(this.total()));
    }
    return this.total() > 0 ? `${this.startItem()}–${this.endItem()} of ${this.total()}` : 'No results';
  });

  readonly pageNumbers = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  goTo(page: number | '...'): void {
    if (page === '...' || page === this.page()) return;
    this.emit(page);
  }

  prev(): void { if (this.page() > 1) this.emit(this.page() - 1); }
  next(): void { if (this.page() < this.totalPages()) this.emit(this.page() + 1); }
  first(): void { if (this.page() !== 1) this.emit(1); }
  last(): void { if (this.page() !== this.totalPages()) this.emit(this.totalPages()); }

  onPageSizeChange(e: Event): void {
    const size = Number((e.target as HTMLSelectElement).value);
    this.pageChange.emit({ page: 1, pageSize: size, total: this.total() });
  }

  onJumpSelect(e: Event): void {
    this.goTo(Number((e.target as HTMLSelectElement).value));
  }

  onJumpGo(value: string): void {
    const page = Math.min(this.totalPages(), Math.max(1, Number(value) || 1));
    this.goTo(page);
  }

  private emit(page: number): void {
    this.pageChange.emit({ page, pageSize: this.pageSize(), total: this.total() });
  }
}
