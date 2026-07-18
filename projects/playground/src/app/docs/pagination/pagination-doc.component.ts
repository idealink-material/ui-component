import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiPaginationComponent, PageEvent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-pagination-doc',
  imports: [CuiPaginationComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './pagination-doc.component.html',
  styleUrl: './pagination-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'compact', label: 'Compact' },
    { id: 'options', label: 'Page size selector' },
    { id: 'report-template', label: 'Current page report' },
    { id: 'jump-to-page', label: 'Jump to page' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'page',                  type: 'number',   default: '1',   description: 'Current 1-based page number.' },
    { name: 'pageSize',               type: 'number',   default: '10',  description: 'Rows per page.' },
    { name: 'total',                  type: 'number',   default: '0',   description: 'Total row count across all pages.' },
    { name: 'pageSizes',              type: 'number[]', default: '[10, 25, 50, 100]', description: 'Options offered by the page-size selector.' },
    { name: 'showPageSizeSelector',   type: 'boolean',  default: 'true', description: 'Shows the page-size dropdown.' },
    { name: 'showFirstLast',          type: 'boolean',  default: 'true', description: 'Shows first/last page jump buttons.' },
    { name: 'compact',                type: 'boolean',  default: 'false', description: 'Renders a condensed layout (hides the item-range summary).' },
    { name: 'alwaysShowPaginator',    type: 'boolean',  default: 'true', description: 'Hides the whole component when there\'s only one page (or none).' },
    { name: 'showCurrentPageReport',  type: 'boolean',  default: 'true', description: 'Toggles the "X–Y of Z" info text independently of compact.' },
    { name: 'currentPageReportTemplate', type: 'string | null', default: 'null', description: 'Overrides the default report text; {first}, {last}, {totalRecords} tokens are replaced.' },
    { name: 'showPageLinks',          type: 'boolean',  default: 'true', description: 'Shows individual page-number buttons. When false, falls back to a compact "page/totalPages" text.' },
    { name: 'showJumpToPageDropdown', type: 'boolean',  default: 'false', description: 'Shows a page-select dropdown for jumping directly to a page.' },
    { name: 'showJumpToPageInput',    type: 'boolean',  default: 'false', description: 'Shows a number input + "Go" button for jumping directly to a page.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'pageChange', type: 'EventEmitter<PageEvent>', description: 'Emitted when the page or page size changes.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'PageEvent',
      fields: [
        { name: 'page',     type: 'number', description: 'The newly selected 1-based page number.' },
        { name: 'pageSize', type: 'number', description: 'The active page size.' },
        { name: 'total',    type: 'number', description: 'Total row count, echoed back unchanged.' },
      ],
    },
  ];

  readonly page = signal(1);
  readonly compactPage = signal(3);
  readonly reportPage = signal(2);
  readonly jumpPage = signal(1);

  onPageChange(e: PageEvent): void {
    this.page.set(e.page);
  }
}
