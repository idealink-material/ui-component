import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import {
  CuiTreeTableComponent, TableColumn, TreeTableAction, TreeTableActionClickEvent, TreeTableNode,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';
import { CuiIconComponent } from '@idealink-material/ui-icons';

interface AccountRow {
  name: string; amount: string; status: string;
  [key: string]: unknown;
}

interface FileRow {
  name: string; size: string; type: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-tree-table-doc',
  imports: [
    CuiTreeTableComponent,
    DocExampleComponent,
    DocShellComponent,
    JsonPipe,
    CuiIconComponent,
  ],
  templateUrl: './tree-table-doc.component.html',
  styleUrl: './tree-table-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'striped', label: 'Striped rows' },
    { id: 'row-actions', label: 'Row actions' },
    { id: 'custom-template', label: 'Custom row template' },
  ];

  readonly themingSections: DocSection[] = [{ id: 'theming-tokens', label: 'Design tokens' }];

  readonly properties: DocApiProperty[] = [
    {
      name: 'columns',
      type: 'TableColumn<T>[]',
      default: '[]',
      description: "Column definitions — same shape as Data Table's columns.",
    },
    {
      name: 'nodes',
      type: 'TreeTableNode<T>[]',
      default: '[]',
      description: 'Root nodes; each row can expand into nested child rows.',
    },
    {
      name: 'tableStyle',
      type: 'Record<string, string> | null',
      default: 'null',
      description: "Inline styles applied to the <table> element, e.g. { 'min-width': '50rem' }.",
    },
    {
      name: 'striped',
      type: 'boolean',
      default: 'false',
      description: "Alternates row background color, same as p-table's striped input.",
    },
    {
      name: 'expandedIds',
      type: 'ReadonlySet<string>',
      default: 'new Set()',
      description:
        'Ids of currently expanded nodes. Bindable via [(expandedIds)] for externally-controlled expansion.',
    },
    {
      name: 'actions',
      type: 'TreeTableAction<T>[]',
      default: '[]',
      description:
        'Row-action buttons rendered in a trailing, non-data column. Omit/leave empty to skip the column entirely.',
    },
    {
      name: 'actionsHeader',
      type: 'string',
      default: "''",
      description: 'Header label for the actions column.',
    },
    {
      name: 'actionsAlign',
      type: `'left' | 'center' | 'right'`,
      default: "'left'",
      description: "Alignment of the actions column's header and buttons.",
    },
    {
      name: '#header',
      type: 'TemplateRef<void>',
      default: '—',
      description: 'Content template replacing the generated header row entirely.',
    },
    {
      name: '#body',
      type: 'TemplateRef<{ $implicit, rowData }>',
      default: '—',
      description:
        'Content template replacing the generated row markup. $implicit (let-rowNode) is the flat row { node, depth, hasChildren }; a rowData context var (rowNode.node.data) is also supplied for parity with PrimeNG\'s API. Use #tt="pTreeTable" to reach tt.toggle()/tt.isExpanded().',
    },
  ];

  readonly emitters: DocApiEmitter[] = [
    {
      name: 'cellClick',
      type: 'EventEmitter<TreeTableCellClickEvent<T>>',
      description:
        'Emitted when a data cell is clicked. Only fires for the generated row markup, not a custom #body template.',
    },
    {
      name: 'actionClick',
      type: 'EventEmitter<TreeTableActionClickEvent<T>>',
      description:
        'Emitted when an actions button is clicked, with the action id, row data, and node.',
    },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'TreeTableNode<T>',
      fields: [
        { name: 'id', type: 'string', description: 'Unique identifier.' },
        {
          name: 'data',
          type: 'T',
          description: "The row's data, read by each column's key/accessor.",
        },
        {
          name: 'children',
          type: 'TreeTableNode<T>[] | undefined',
          description: 'Nested rows — presence renders an expand/collapse toggle.',
        },
      ],
    },
    {
      name: 'TableColumn<T>',
      fields: [
        {
          name: 'key',
          type: 'string',
          description: 'Unique key; also the default data accessor (row[key]).',
        },
        { name: 'header', type: 'string', description: 'Column header label.' },
        {
          name: 'accessor',
          type: '(row: T) => unknown | undefined',
          description: 'Custom data accessor, overriding row[key].',
        },
        {
          name: 'width',
          type: 'string | undefined',
          description: "Column width CSS value, e.g. '120px' or '1fr'.",
        },
        {
          name: 'align',
          type: `'left' | 'center' | 'right' | undefined`,
          description: "Cell text alignment. Default 'left'.",
        },
      ],
    },
    {
      name: 'TreeTableAction<T>',
      fields: [
        {
          name: 'id',
          type: 'string',
          description: 'Identifies which action was clicked — reported back on actionClick.',
        },
        {
          name: 'icon',
          type: 'string | undefined',
          description: "Icon name, passed to <cui-icon>. Required unless display is 'text'.",
        },
        {
          name: 'label',
          type: 'string',
          description:
            "Always the accessible name/tooltip; also the visible button content when display is 'text'.",
        },
        {
          name: 'display',
          type: `'icon' | 'text' | undefined`,
          description: "'icon' (default) renders an icon-only button; 'text' renders label as visible text.",
        },
        {
          name: 'hidden',
          type: '(rowData: T, node: TreeTableNode<T>) => boolean | undefined',
          description: 'Hide this action for a given row.',
        },
        {
          name: 'disabled',
          type: '(rowData: T, node: TreeTableNode<T>) => boolean | undefined',
          description: 'Disable (but still show) this action for a given row.',
        },
      ],
    },
  ];

  readonly columns: TableColumn<AccountRow>[] = [
    { key: 'name', header: 'Account' },
    { key: 'amount', header: 'Amount', align: 'right' },
    { key: 'status', header: 'Status' },
  ];

  readonly nodes: TreeTableNode<AccountRow>[] = [
    {
      id: 'g1',
      data: { name: 'Corporate Accounts', amount: '$1.2M', status: 'Active' },
      children: [
        { id: 'g1-1', data: { name: 'Acme Holdings', amount: '$820K', status: 'Active' } },
        { id: 'g1-2', data: { name: 'Bright Capital', amount: '$380K', status: 'Review' } },
      ],
    },
    {
      id: 'g2',
      data: { name: 'Retail Accounts', amount: '$430K', status: 'Active' },
      children: [
        { id: 'g2-1', data: { name: 'Individual Clients', amount: '$430K', status: 'Active' } },
      ],
    },
  ];

  readonly accountActions: TreeTableAction<AccountRow>[] = [
    { id: 'edit', icon: 'edit', label: 'Edit' },
    {
      id: 'delete',
      icon: 'delete',
      label: 'Delete',
      disabled: (row) => row.status === 'Active',
    },
    { id: 'view', label: 'View', display: 'text' },
  ];

  readonly lastActionEvent = signal<TreeTableActionClickEvent<AccountRow> | null>(null);

  onActionClick(event: TreeTableActionClickEvent<AccountRow>): void {
    this.lastActionEvent.set(event);
  }

  readonly customTemplateCode = [
    '<p-tree-table #tt="pTreeTable" [nodes]="fileNodes" [tableStyle]="{ \'min-width\': \'50rem\' }">',
    '  <ng-template #header>',
    '    <tr>',
    '      <th style="width: 34%">Name</th>',
    '      <th style="width: 33%">Size</th>',
    '      <th style="width: 33%">Type</th>',
    '    </tr>',
    '  </ng-template>',
    '  <ng-template #body let-rowNode>',
    '    <tr>',
    '      <td>',
    '        <span class="file-cell" [style.padding-left.px]="rowNode.depth * 20">',
    '          <button *ngIf="rowNode.hasChildren" type="button" (click)="tt.toggle(rowNode.node.id)">',
    "            {{ tt.isExpanded(rowNode.node.id) ? '▾' : '▸' }}",
    '          </button>',
    '          {{ rowNode.node.data.name }}',
    '        </span>',
    '      </td>',
    '      <td>{{ rowNode.node.data.size }}</td>',
    '      <td>{{ rowNode.node.data.type }}</td>',
    '    </tr>',
    '  </ng-template>',
    '</p-tree-table>',
  ].join('\n');

  readonly customTemplateTsCode = [
    "import { Component } from '@angular/core';",
    "import { CuiTreeTableComponent, TableColumn, TreeTableNode } from '@idealink-material/ui-core';",
    "import { CuiIconComponent } from '@idealink-material/ui-icons';",
    '',
    'interface FileRow {',
    '  name: string; size: string; type: string;',
    '  [key: string]: unknown;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-example',",
    '  imports: [CuiTreeTableComponent, CuiIconComponent],',
    "  templateUrl: './example.component.html',",
    '})',
    'export class ExampleComponent {',
    '  fileColumns: TableColumn<FileRow>[] = [',
    "    { key: 'name', header: 'Name', width: '34%' },",
    "    { key: 'size', header: 'Size', width: '33%' },",
    "    { key: 'type', header: 'Type', width: '33%' },",
    '  ];',
    '',
    '  fileNodes: TreeTableNode<FileRow>[] = [',
    '    {',
    "      id: '0',",
    "      data: { name: 'Documents', size: '75kb', type: 'Folder' },",
    '      children: [',
    '        {',
    "          id: '0-0',",
    "          data: { name: 'Work', size: '55kb', type: 'Folder' },",
    '          children: [',
    "            { id: '0-0-0', data: { name: 'Expenses.doc', size: '30kb', type: 'Document' } },",
    "            { id: '0-0-1', data: { name: 'Resume.doc', size: '25kb', type: 'Document' } },",
    '          ],',
    '        },',
    '      ],',
    '    },',
    '    {',
    "      id: '1',",
    "      data: { name: 'Pictures', size: '150kb', type: 'Folder' },",
    '      children: [',
    "        { id: '1-0', data: { name: 'barcelona.jpg', size: '90kb', type: 'Picture' } },",
    '      ],',
    '    },',
    '  ];',
    '}',
  ].join('\n');

  readonly fileColumns: TableColumn<FileRow>[] = [
    { key: 'name', header: 'Name', width: '34%' },
    { key: 'size', header: 'Size', width: '33%' },
    { key: 'type', header: 'Type', width: '33%' },
  ];

  readonly fileNodes: TreeTableNode<FileRow>[] = [
    {
      id: '0',
      data: { name: 'Documents', size: '75kb', type: 'Folder' },
      children: [
        {
          id: '0-0',
          data: { name: 'Work', size: '55kb', type: 'Folder' },
          children: [
            { id: '0-0-0', data: { name: 'Expenses.doc', size: '30kb', type: 'Document' } },
            { id: '0-0-1', data: { name: 'Resume.doc', size: '25kb', type: 'Document' } },
          ],
        },
        {
          id: '0-1',
          data: { name: 'Home', size: '20kb', type: 'Folder' },
          children: [{ id: '0-1-0', data: { name: 'Invoices.txt', size: '20kb', type: 'Text' } }],
        },
      ],
    },
    {
      id: '1',
      data: { name: 'Pictures', size: '150kb', type: 'Folder' },
      children: [
        { id: '1-0', data: { name: 'barcelona.jpg', size: '90kb', type: 'Picture' } },
        { id: '1-1', data: { name: 'primeui.png', size: '30kb', type: 'Picture' } },
        { id: '1-2', data: { name: 'optimus.jpg', size: '30kb', type: 'Picture' } },
      ],
    },
    {
      id: '2',
      data: { name: 'Movies', size: '1500kb', type: 'Folder' },
      children: [
        {
          id: '2-0',
          data: { name: 'Al Pacino', size: '1000kb', type: 'Folder' },
          children: [
            { id: '2-0-0', data: { name: 'Scarface', size: '500kb', type: 'Video' } },
            { id: '2-0-1', data: { name: 'Serpico', size: '500kb', type: 'Video' } },
          ],
        },
        {
          id: '2-1',
          data: { name: 'Robert De Niro', size: '500kb', type: 'Folder' },
          children: [
            { id: '2-1-0', data: { name: 'Goodfellas', size: '250kb', type: 'Video' } },
            { id: '2-1-1', data: { name: 'Untouchables', size: '250kb', type: 'Video' } },
          ],
        },
      ],
    },
  ];
}
