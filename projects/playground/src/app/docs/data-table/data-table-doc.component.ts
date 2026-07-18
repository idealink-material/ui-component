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

interface AccountRow {
  id: string; accountNo: string; holder: string; branch: string; country: string;
  openDate: string; status: string; riskScore: string; manager: string; balance: number;
  [key: string]: unknown;
}

const ACCOUNTS: AccountRow[] = [
  { id: '1',  accountNo: 'ACC-10231', holder: 'Sokha Ly',      branch: 'Phnom Penh',    country: 'KH', openDate: '2021-03-14', status: 'Active',  riskScore: 'Low',    manager: 'Dara Chan',    balance: 128500 },
  { id: '2',  accountNo: 'ACC-10245', holder: 'Vibol Heng',    branch: 'Siem Reap',     country: 'KH', openDate: '2020-11-02', status: 'Active',  riskScore: 'Medium', manager: 'Sreymom Kim',  balance: 84200 },
  { id: '3',  accountNo: 'ACC-10289', holder: 'Channary Sok',  branch: 'Battambang',    country: 'KH', openDate: '2022-06-19', status: 'Dormant', riskScore: 'Low',    manager: 'Dara Chan',    balance: 15900 },
  { id: '4',  accountNo: 'ACC-10312', holder: 'Rithy Pen',     branch: 'Phnom Penh',    country: 'KH', openDate: '2019-01-08', status: 'Active',  riskScore: 'High',   manager: 'Sreymom Kim',  balance: 452000 },
  { id: '5',  accountNo: 'ACC-10345', holder: 'Malis Ouk',     branch: 'Kampong Cham',  country: 'KH', openDate: '2023-02-27', status: 'Active',  riskScore: 'Low',    manager: 'Vantha Roeun', balance: 63500 },
  { id: '6',  accountNo: 'ACC-10367', holder: 'Sopheak Nhem',  branch: 'Phnom Penh',    country: 'KH', openDate: '2018-09-30', status: 'Closed',  riskScore: 'Low',    manager: 'Dara Chan',    balance: 0 },
  { id: '7',  accountNo: 'ACC-10390', holder: 'Bopha Chea',    branch: 'Siem Reap',     country: 'KH', openDate: '2021-12-05', status: 'Active',  riskScore: 'Medium', manager: 'Vantha Roeun', balance: 198750 },
  { id: '8',  accountNo: 'ACC-10412', holder: 'Piseth Long',   branch: 'Sihanoukville', country: 'KH', openDate: '2022-08-14', status: 'Active',  riskScore: 'High',   manager: 'Sreymom Kim',  balance: 310400 },
  { id: '9',  accountNo: 'ACC-10438', holder: 'Kunthea Sam',   branch: 'Phnom Penh',    country: 'KH', openDate: '2020-04-22', status: 'Active',  riskScore: 'Low',    manager: 'Dara Chan',    balance: 27300 },
  { id: '10', accountNo: 'ACC-10465', holder: 'Sovann Ath',    branch: 'Battambang',    country: 'KH', openDate: '2023-10-01', status: 'Active',  riskScore: 'Medium', manager: 'Vantha Roeun', balance: 145600 },
];

const LARGE_ACCOUNTS: AccountRow[] = Array.from({ length: 2000 }, (_, i) => ({
  id: String(i + 1),
  accountNo: `ACC-${20000 + i}`,
  holder: `Account Holder ${i + 1}`,
  branch: ACCOUNTS[i % ACCOUNTS.length].branch,
  country: 'KH',
  openDate: '2023-01-01',
  status: i % 5 === 0 ? 'Dormant' : 'Active',
  riskScore: ['Low', 'Medium', 'High'][i % 3],
  manager: ACCOUNTS[i % ACCOUNTS.length].manager,
  balance: (i * 137) % 500000,
}));

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
    { id: 'vertical-scroll', label: 'Vertical scroll' },
    { id: 'horizontal-scroll', label: 'Horizontal scroll' },
    { id: 'frozen-columns', label: 'Frozen columns' },
    { id: 'frozen-columns-multiple', label: 'Frozen columns (multiple)' },
    { id: 'frozen-rows', label: 'Frozen rows' },
    { id: 'controlled-selection', label: 'Controlled selection' },
    { id: 'selection-mode-single', label: 'Selection mode (single)' },
    { id: 'controlled-expansion', label: 'Controlled row expansion' },
    { id: 'controlled-sort', label: 'Controlled sort' },
    { id: 'paginator-position', label: 'Paginator position & toggle' },
    { id: 'state-persistence', label: 'State persistence' },
    { id: 'virtual-scroll', label: 'Virtual scroll' },
    { id: 'resizable-columns', label: 'Resizable columns' },
    { id: 'reorderable-columns', label: 'Reorderable columns' },
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
    { name: 'scrollHeight',        type: 'string | null',           default: 'null',      description: 'Constrains the table wrapper to this CSS height and enables vertical scrolling (e.g. \'420px\', \'60vh\'). Horizontal scrolling activates automatically whenever column widths overflow the wrapper.' },
    { name: 'frozenValue (p-table)', type: 'T[]',                   default: '[]',        description: 'Rows pinned to the top of the scroll area, staying in view while value scrolls beneath them. Combine with a sticky column for a "frozen corner".' },
    { name: 'selection',            type: 'T[]',                    default: '[]',        description: 'Selected rows — bindable via [(selection)] for externally-controlled selection. Add/remove is tracked against the full array, so selection survives pagination.' },
    { name: 'selectionMode',        type: `'single' | 'multiple'`,  default: `'multiple'`, description: 'multiple shows checkboxes; single hides them and makes row click select (clicking the selected row again deselects it).' },
    { name: 'expandedRowKeys',      type: 'Set<unknown>',           default: 'new Set()', description: 'Keys (per trackBy) of expanded rows — bindable via [(expandedRowKeys)].' },
    { name: 'rowExpandMode',        type: `'single' | 'multiple'`,  default: `'multiple'`, description: 'single collapses any previously-expanded row when a new one is expanded.' },
    { name: 'sortField',            type: 'string | null',          default: 'null',      description: 'Sorted column key — bindable via [(sortField)] for externally-controlled sort.' },
    { name: 'sortOrder',            type: `'asc' | 'desc' | null`,  default: 'null',      description: 'Sort direction — bindable via [(sortOrder)].' },
    { name: 'paginator',            type: 'boolean',                default: 'true',      description: 'Shows/hides the pagination footer entirely.' },
    { name: 'paginatorPosition',    type: `'top' | 'bottom' | 'both'`, default: `'bottom'`, description: 'Where the pagination control renders relative to the table.' },
    { name: 'stateKey',             type: 'string | null',          default: 'null',      description: 'When set, persists {sort, page, pageSize, search} to stateStorage under this key and restores it on init.' },
    { name: 'stateStorage',         type: `'session' | 'local'`,    default: `'session'`, description: `'session' uses sessionStorage, 'local' uses localStorage. Only used when stateKey is set.` },
    { name: 'virtualScroll (p-table)', type: 'boolean',             default: 'false',     description: 'Row-windowing for large datasets. Requires scrollHeight and the columns-array render path (not a custom #body template).' },
    { name: 'virtualScrollItemSize (p-table)', type: 'number',      default: '40',        description: 'Fixed row height (px) used for virtual-scroll windowing math.' },
    { name: 'resizableColumns (p-table)', type: 'boolean',          default: 'false',     description: 'Shows a drag handle on the trailing edge of each generated column header for interactive width resizing.' },
    { name: 'columnResizeMode (p-table)', type: `'fit' | 'expand'`, default: `'fit'`,     description: `'fit' borrows/gives width with the neighboring column, preserving total table width. 'expand' only changes the dragged column.` },
    { name: 'reorderableColumns (p-table)', type: 'boolean',        default: 'false',     description: 'Shows a drag handle for reordering columns.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'stateChange',     type: 'EventEmitter<DataTableChangeEvent>', description: 'Emitted whenever sort, page, page size, or the search term changes — the single source of truth for re-fetching data.' },
    { name: 'selectionChange', type: 'EventEmitter<T[]>',                  description: 'Emitted with the currently selected rows (selectable must be true). Also fires as part of the [(selection)] two-way binding.' },
    { name: 'rowClick',        type: 'EventEmitter<T>',                    description: 'Emitted when a row is clicked.' },
    { name: 'expandChange',    type: 'EventEmitter<{ row: T; expanded: boolean }>', description: 'Emitted when a row is expanded or collapsed.' },
    { name: 'sortChange',      type: 'EventEmitter<SortState>',            description: 'Composite sort-state event, alongside the [(sortField)]/[(sortOrder)] two-way bindings.' },
    { name: 'onRowSelect / onRowUnselect', type: 'EventEmitter<T>',        description: 'Granular per-row selection events, fired alongside selectionChange.' },
    { name: 'onHeaderCheckboxToggle', type: 'EventEmitter<boolean>',       description: 'Fired when the header "select all" checkbox is toggled, with the new checked state.' },
    { name: 'onRowExpand / onRowCollapse', type: 'EventEmitter<T>',        description: 'Granular per-row expansion events, fired alongside expandChange.' },
    { name: 'onColResize',     type: 'EventEmitter<{ column: TableColumn<T>; width: number }>', description: 'Fired once per resize gesture (on release) with the final width.' },
    { name: 'onColReorder',    type: 'EventEmitter<{ dragIndex: number; dropIndex: number; columns: TableColumn<T>[] }>', description: 'Fired when a column is dropped in a new position.' },
    { name: 'onStateSave / onStateRestore', type: 'EventEmitter<DataTableChangeEvent>', description: 'Fired when stateKey persistence writes to, or restores from, storage.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: 'p-data-table-actions', description: 'Toolbar slot next to the search box, typically holding buttons like Export or Add.' },
    { name: '#header (p-table)', description: 'Replaces the generated <thead> row entirely — project a full <tr><th>…</th></tr>. Only on the p-table primitive, not p-data-table.' },
    { name: '#body (p-table)', description: 'Replaces the generated <tr><td>…</td></tr> row markup entirely; let-row exposes the row via $implicit. Only on the p-table primitive, not p-data-table.' },
    { name: '#frozenbody (p-table)', description: 'Row markup for frozenValue rows; falls back to #body, then the generated columns markup, when omitted. Only on the p-table primitive, not p-data-table.' },
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
        { name: 'sticky',       type: `boolean | 'left' | 'right' | undefined`,             description: "Freezes the column on horizontal scroll. true is shorthand for 'left'. Multiple columns may freeze on the same edge — offsets stack in column order. Give frozen columns an explicit pixel width for a correct offset." },
        { name: 'minWidth',     type: 'number | undefined',                                 description: 'Floor (px) for interactive resizing via resizableColumns. Default: 40.' },
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
        <td >{{ item.grossWeight }}</td>
      </tr>
    </ng-template>
  </p-table>
</ng-template>`;

  // ── Vertical / horizontal scroll & frozen columns/rows ───────────────────────
  readonly accounts = signal<AccountRow[]>(ACCOUNTS);
  readonly pinnedAccounts = signal<AccountRow[]>(ACCOUNTS.slice(0, 2));
  readonly scrollAccounts = signal<AccountRow[]>(ACCOUNTS.slice(2));

  readonly accountColumnsCompact: TableColumn<AccountRow>[] = [
    { key: 'accountNo', header: 'Account No.', width: '140px' },
    { key: 'holder',    header: 'Holder',      width: '180px' },
    { key: 'branch',    header: 'Branch',      width: '170px' },
    { key: 'status',    header: 'Status',      width: '110px', align: 'center' },
    { key: 'balance',   header: 'Balance',     width: '130px', align: 'right', accessor: (row) => '$' + row.balance.toLocaleString() },
  ];

  readonly accountColumns: TableColumn<AccountRow>[] = [
    { key: 'accountNo', header: 'Account No.', width: '140px' },
    { key: 'holder',    header: 'Holder',      width: '160px' },
    { key: 'branch',    header: 'Branch',      width: '170px' },
    { key: 'country',   header: 'Country',     width: '90px' },
    { key: 'openDate',  header: 'Opened',      width: '110px' },
    { key: 'status',    header: 'Status',      width: '100px', align: 'center' },
    { key: 'riskScore', header: 'Risk',        width: '90px',  align: 'center' },
    { key: 'manager',   header: 'Manager',     width: '150px' },
    { key: 'balance',   header: 'Balance',     width: '130px', align: 'right', accessor: (row) => '$' + row.balance.toLocaleString() },
  ];

  readonly accountColumnsFrozenLeft: TableColumn<AccountRow>[] = this.accountColumns.map((col) =>
    col.key === 'accountNo' ? { ...col, sticky: true as const } : col
  );

  readonly accountColumnsFrozenMultiple: TableColumn<AccountRow>[] = this.accountColumns.map((col) => {
    if (col.key === 'accountNo' || col.key === 'holder') return { ...col, sticky: true as const };
    if (col.key === 'balance') return { ...col, sticky: 'right' as const };
    return col;
  });

  readonly verticalScrollCode = `<p-table [columns]="accountColumnsCompact" [value]="accounts()" scrollHeight="320px" />`;

  readonly horizontalScrollCode = `<p-table
  [columns]="accountColumns"
  [value]="accounts()"
  [tableStyle]="{ 'min-width': '1100px' }">
</p-table>`;

  readonly frozenColumnsCode = `<p-table
  [columns]="accountColumnsFrozenLeft"
  [value]="accounts()"
  scrollHeight="320px"
  [tableStyle]="{ 'min-width': '1100px' }">
</p-table>

columns: TableColumn<AccountRow>[] = [
  { key: "accountNo", header: "Account No.", width: "140px", sticky: true },
  // ...other columns
];`;

  readonly frozenColumnsMultipleCode = `<p-table
  [columns]="accountColumnsFrozenMultiple"
  [value]="accounts()"
  scrollHeight="320px"
  [tableStyle]="{ 'min-width': '1100px' }">
</p-table>

columns: TableColumn<AccountRow>[] = [
  { key: "accountNo", header: "Account No.", width: "140px", sticky: true },
  { key: "holder",    header: "Holder",      width: "160px", sticky: true },
  // ...other columns
  { key: "balance",   header: "Balance",     width: "130px", sticky: "right" },
];`;

  readonly frozenRowsCode = `<p-table
  [columns]="accountColumnsCompact"
  [value]="scrollAccounts()"
  [frozenValue]="pinnedAccounts()"
  scrollHeight="280px">
</p-table>`;

  // ── Controlled selection / expansion / sort, pagination polish, virtual scroll,
  //    resize/reorder ────────────────────────────────────────────────────────
  readonly selectedAccounts = signal<AccountRow[]>([]);
  readonly singleSelected   = signal<AccountRow[]>([]);
  readonly expandedKeys     = signal<Set<unknown>>(new Set());
  readonly sortFieldCtrl    = signal<string | null>(null);
  readonly sortOrderCtrl    = signal<'asc' | 'desc' | null>(null);
  readonly showPaginator    = signal(true);
  readonly largeAccounts    = signal<AccountRow[]>(LARGE_ACCOUNTS);
  readonly resizeMode       = signal<'fit' | 'expand'>('fit');
  readonly lastReorder      = signal<{ dragIndex: number; dropIndex: number } | null>(null);

  clearSavedState(): void {
    sessionStorage.removeItem('data-table-doc-demo');
  }

  readonly controlledSelectionCode = `<p-data-table
  [columns]="accountColumnsCompact"
  [value]="accounts()"
  [total]="accounts().length"
  [searchable]="false"
  [selectable]="true"
  [(selection)]="selectedAccounts">
</p-data-table>`;

  readonly selectionModeSingleCode = `<p-table
  [columns]="accountColumnsCompact"
  [value]="accounts()"
  [selectable]="true"
  selectionMode="single"
  [(selection)]="singleSelected">
</p-table>`;

  readonly controlledExpansionCode = `<p-data-table
  [columns]="declarationColumns"
  [value]="declarations()"
  [total]="declarations().length"
  [searchable]="false"
  [expandable]="true"
  rowExpandMode="single"
  [(expandedRowKeys)]="expandedKeys"
  [rowDetailTemplate]="lineItemsExpandMode">
</p-data-table>

<ng-template #lineItemsExpandMode let-row>
  <p-table [columns]="lineItemColumns" [value]="row.lineItems" />
</ng-template>`;

  readonly controlledSortCode = `<p-table [columns]="columns" [value]="value()"
  [(sortField)]="sortFieldCtrl" [(sortOrder)]="sortOrderCtrl" />

<p-button (click)="sortFieldCtrl.set('status'); sortOrderCtrl.set('asc')">Sort by Status</p-button>`;

  readonly paginatorPositionCode = `<p-data-table
  [columns]="accountColumnsCompact"
  [value]="accounts()"
  [total]="accounts().length"
  [searchable]="false"
  [paginator]="showPaginator()"
  paginatorPosition="both">
</p-data-table>`;

  readonly statePersistenceCode = `<p-data-table
  [columns]="columns"
  [value]="value()"
  [total]="value().length"
  stateKey="data-table-doc-demo"
  (stateChange)="onTableChange($event)">
</p-data-table>`;

  readonly virtualScrollCode = `<p-table
  [columns]="accountColumnsCompact"
  [value]="largeAccounts()"
  scrollHeight="320px"
  [virtualScroll]="true"
  [virtualScrollItemSize]="40">
</p-table>`;

  readonly resizableColumnsCode = `<p-table
  [columns]="accountColumnsCompact"
  [value]="accounts()"
  [resizableColumns]="true"
  [columnResizeMode]="resizeMode()">
</p-table>`;

  readonly reorderableColumnsCode = `<p-table
  [columns]="accountColumnsCompact"
  [value]="accounts()"
  [reorderableColumns]="true"
  (onColReorder)="lastReorder.set($event)">
</p-table>`;
}
