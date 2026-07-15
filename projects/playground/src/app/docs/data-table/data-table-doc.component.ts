import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import {
  CuiDataTableComponent, CuiTableComponent, PDataTableActionsComponent, CuiButtonComponent,
  DataTableChangeEvent, TableColumn,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

interface CaseRow {
  id: string; caseNo: string; subject: string; status: string; risk: string;
  [key: string]: unknown;
}

const CASES: CaseRow[] = [
  { id: '1', caseNo: 'AML-2401', subject: 'Suspicious wire transfer',   status: 'Open',   risk: 'High' },
  { id: '2', caseNo: 'AML-2402', subject: 'Unusual cash deposits',      status: 'Review', risk: 'Medium' },
  { id: '3', caseNo: 'AML-2403', subject: 'Shell company transactions', status: 'Closed', risk: 'Low' },
];

interface LineItem {
  id: string; hsCode: string; origin: string; description: string;
  qty: string; unitPrice: number; netWeight: number; grossWeight: number;
  [key: string]: unknown;
}

interface DeclarationRow {
  id: string; declNo: string; date: string; company: string; co: string;
  containers: number; amountUsd: number; status: string; officer: string;
  lineItems: LineItem[];
  [key: string]: unknown;
}

interface Product {
  code: string; name: string; category: string; quantity: number;
  [key: string]: unknown;
}

const PRODUCTS: Product[] = [
  { code: 'f230fh0g3', name: 'Bamboo Watch',  category: 'Accessories', quantity: 24 },
  { code: 'nvklal433', name: 'Black Watch',    category: 'Accessories', quantity: 61 },
  { code: 'zz21cz3c1', name: 'Blue Band',      category: 'Fitness',     quantity: 2 },
];

const DECLARATIONS: DeclarationRow[] = [
  {
    id: '1', declNo: 'I 37004', date: '04 Jun', company: 'S.C. Artistry Co...', co: 'E',
    containers: 3, amountUsd: 1560, status: 'Released', officer: 'Chhuing',
    lineItems: [
      { id: '1-1', hsCode: '3305.90.00', origin: 'CN', description: 'New tricycle Changli CL1200ZH — model year 2026', qty: '15+0+10+0 PCS', unitPrice: 2280, netWeight: 3990, grossWeight: 4180 },
      { id: '1-2', hsCode: '8714.99.00', origin: 'CN', description: 'Bicycle spare parts, mixed assortment',            qty: '20+0+0+0 PCS',  unitPrice: 640,  netWeight: 810,  grossWeight: 900 },
    ],
  },
  {
    id: '2', declNo: 'I 37005', date: '05 Jun', company: 'Meridian Trading Ltd', co: 'S',
    containers: 1, amountUsd: 940, status: 'Pending', officer: 'Sopheak',
    lineItems: [
      { id: '2-1', hsCode: '9503.00.00', origin: 'VN', description: 'Assorted plastic toys, retail packed', qty: '8+0+0+0 PCS', unitPrice: 940, netWeight: 1120, grossWeight: 1240 },
    ],
  },
];

@Component({
  selector: 'app-data-table-doc',
  imports: [
    CuiDataTableComponent, CuiTableComponent, PDataTableActionsComponent, CuiButtonComponent,
    DocExampleComponent, DocShellComponent, JsonPipe,
  ],
  templateUrl: './data-table-doc.component.html',
  styleUrl: './data-table-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'expandable', label: 'Expandable rows' },
    { id: 'custom-templates', label: 'Custom templates' },
    { id: 'expandable-custom-templates', label: 'Child table (custom templates)' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'columns',           type: 'TableColumn<T>[]',         default: '[]',        description: 'Column definitions.' },
    { name: 'value',               type: 'T[]',                      default: '[]',        description: 'Row data for the current page.' },
    { name: 'total',               type: 'number',                  default: '0',         description: 'Total row count across all pages (drives the pagination footer).' },
    { name: 'loading',             type: 'boolean',                 default: 'false',     description: 'Shows a loading state over the table.' },
    { name: 'selectable',          type: 'boolean',                 default: 'false',     description: 'Adds a checkbox column for row selection.' },
    { name: 'striped',             type: 'boolean',                 default: 'false',     description: 'Alternates row background colors.' },
    { name: 'searchable',          type: 'boolean',                 default: 'true',      description: 'Shows the search input in the toolbar.' },
    { name: 'searchPlaceholder',   type: 'string',                  default: `'Search…'`, description: 'Placeholder for the search input.' },
    { name: 'pageSizes',           type: 'number[]',                default: '[10, 25, 50]', description: 'Options offered by the pagination footer\'s page-size selector.' },
    { name: 'trackBy',             type: '(row: T) => unknown',     default: '(row) => row', description: 'Row identity function, used for selection tracking.' },
    { name: 'expandable',          type: 'boolean',                 default: 'false',     description: 'Renders a chevron toggle column; expanding a row projects rowDetailTemplate beneath it.' },
    { name: 'rowDetailTemplate',   type: 'TemplateRef<{ $implicit: T }> | null', default: 'null', description: 'Content projected into the expanded row — e.g. a nested p-table for a "table in table" detail view.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'stateChange',     type: 'EventEmitter<DataTableChangeEvent>', description: 'Emitted whenever sort, page, page size, or the search term changes — the single source of truth for re-fetching data.' },
    { name: 'selectionChange', type: 'EventEmitter<T[]>',                  description: 'Emitted with the currently selected rows (selectable must be true).' },
    { name: 'rowClick',        type: 'EventEmitter<T>',                    description: 'Emitted when a row is clicked.' },
    { name: 'expandChange',    type: 'EventEmitter<{ row: T; expanded: boolean }>', description: 'Emitted when a row is expanded or collapsed.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: 'p-data-table-actions', description: 'Toolbar slot next to the search box, typically holding buttons like Export or Add.' },
    { name: '#header (p-table)', description: 'Replaces the generated <thead> row entirely — project a full <tr><th>…</th></tr>. Only on the p-table primitive, not p-data-table.' },
    { name: '#body (p-table)', description: 'Replaces the generated <tr><td>…</td></tr> row markup entirely; let-row exposes the row via $implicit. Only on the p-table primitive, not p-data-table.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'TableColumn<T>',
      fields: [
        { name: 'key',          type: 'string',                                            description: 'Unique key; also the default data accessor (row[key]).' },
        { name: 'header',       type: 'string',                                             description: 'Column header label.' },
        { name: 'accessor',     type: '(row: T) => unknown | undefined',                    description: 'Custom data accessor, overriding row[key].' },
        { name: 'cellTemplate', type: 'TemplateRef<{ $implicit: T; value: unknown }> | undefined', description: 'Optional custom cell template.' },
        { name: 'sortable',     type: 'boolean | undefined',                                description: 'Enables sorting for this column. Default false.' },
        { name: 'width',        type: 'string | undefined',                                 description: "Column width CSS value, e.g. '120px' or '1fr'." },
        { name: 'align',        type: `'left' | 'center' | 'right' | undefined`,             description: "Cell text alignment. Default 'left'." },
        { name: 'sticky',       type: 'boolean | undefined',                                description: 'Sticks the cell to the left edge on horizontal scroll.' },
      ],
    },
    {
      name: 'DataTableChangeEvent',
      fields: [
        { name: 'sort',     type: '{ column: string | null; direction: "asc" | "desc" | null }', description: 'Current sort state.' },
        { name: 'page',     type: 'number', description: 'Current 1-based page number.' },
        { name: 'pageSize', type: 'number', description: 'Current page size.' },
        { name: 'search',   type: 'string', description: 'Current (debounced) search term.' },
      ],
    },
  ];

  readonly columns: TableColumn<CaseRow>[] = [
    { key: 'caseNo',  header: 'Case No.', sortable: true, width: '110px' },
    { key: 'subject', header: 'Subject',  sortable: true },
    { key: 'status',  header: 'Status',   sortable: true, width: '100px', align: 'center' },
    { key: 'risk',    header: 'Risk',     sortable: true, width: '100px', align: 'center' },
  ];

  readonly value = signal<CaseRow[]>(CASES);
  readonly lastEvent = signal<DataTableChangeEvent | null>(null);

  onTableChange(e: DataTableChangeEvent): void {
    this.lastEvent.set(e);
  }

  readonly declarationColumns: TableColumn<DeclarationRow>[] = [
    { key: 'declNo',     header: 'Declaration No.' },
    { key: 'date',       header: 'Date',       width: '90px' },
    { key: 'company',    header: 'Company' },
    { key: 'co',         header: 'C/O',        width: '60px',  align: 'center' },
    { key: 'containers', header: 'Containers', width: '100px', align: 'center' },
    { key: 'amountUsd',  header: 'Amount (USD)', width: '120px', align: 'right' },
    { key: 'status',     header: 'Status' },
    { key: 'officer',    header: 'Officer' },
  ];

  readonly lineItemColumns: TableColumn<LineItem>[] = [
    { key: 'hsCode',      header: 'HS Code',    width: '110px' },
    { key: 'origin',      header: 'Origin',     width: '80px' },
    { key: 'description', header: 'Description' },
    { key: 'qty',         header: 'Qty',        width: '120px' },
    { key: 'unitPrice',   header: 'Unit Price', width: '110px', align: 'right' },
    { key: 'netWeight',   header: 'NW (kg)',    width: '100px', align: 'right' },
    { key: 'grossWeight', header: 'GW (kg)',    width: '100px', align: 'right' },
  ];

  readonly declarations = signal<DeclarationRow[]>(DECLARATIONS);

  readonly products = signal<Product[]>(PRODUCTS);

  readonly customTemplatesCode = `<p-table [value]="products()" [columnCount]="4">
  <ng-template #header>
    <tr>
      <th>Code</th>
      <th>Name</th>
      <th>Category</th>
      <th>Quantity</th>
    </tr>
  </ng-template>
  <ng-template #body let-product>
    <tr>
      <td>{{ product.code }}</td>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.quantity }}</td>
    </tr>
  </ng-template>
</p-table>`;

  readonly expandableCustomTemplatesCode = `<p-data-table
  [columns]="declarationColumns"
  [value]="declarations()"
  [total]="declarations().length"
  [searchable]="false"
  [expandable]="true"
  [rowDetailTemplate]="lineItemsCustom">
</p-data-table>

<ng-template #lineItemsCustom let-row>
  <p-table [value]="row.lineItems" [columnCount]="7">
    <ng-template #header>
      <tr>
        <th>HS Code</th>
        <th>Origin</th>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>NW (kg)</th>
        <th>GW (kg)</th>
      </tr>
    </ng-template>
    <ng-template #body let-item>
      <tr>
        <td>{{ item.hsCode }}</td>
        <td>{{ item.origin }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.unitPrice }}</td>
        <td>{{ item.netWeight }}</td>
        <td>{{ item.grossWeight }}</td>
      </tr>
    </ng-template>
  </p-table>
</ng-template>`;
}
