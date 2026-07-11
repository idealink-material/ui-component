import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiTreeTableComponent, TableColumn, TreeTableNode } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

interface AccountRow {
  name: string; amount: string; status: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-tree-table-doc',
  imports: [CuiTreeTableComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './tree-table-doc.component.html',
  styleUrl: './tree-table-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeTableDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'columns', type: 'TableColumn<T>[]',    default: '[]', description: 'Column definitions — same shape as Data Table\'s columns.' },
    { name: 'nodes',   type: 'TreeTableNode<T>[]',  default: '[]', description: 'Root nodes; each row can expand into nested child rows.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'TreeTableNode<T>',
      fields: [
        { name: 'id',       type: 'string',                       description: 'Unique identifier.' },
        { name: 'data',     type: 'T',                             description: "The row's data, read by each column's key/accessor." },
        { name: 'children', type: 'TreeTableNode<T>[] | undefined', description: 'Nested rows — presence renders an expand/collapse toggle.' },
      ],
    },
    {
      name: 'TableColumn<T>',
      fields: [
        { name: 'key',      type: 'string',                          description: 'Unique key; also the default data accessor (row[key]).' },
        { name: 'header',   type: 'string',                          description: 'Column header label.' },
        { name: 'accessor', type: '(row: T) => unknown | undefined', description: 'Custom data accessor, overriding row[key].' },
        { name: 'width',    type: 'string | undefined',              description: "Column width CSS value, e.g. '120px' or '1fr'." },
        { name: 'align',    type: `'left' | 'center' | 'right' | undefined`, description: "Cell text alignment. Default 'left'." },
      ],
    },
  ];

  readonly columns: TableColumn<AccountRow>[] = [
    { key: 'name',   header: 'Account' },
    { key: 'amount', header: 'Amount', align: 'right' },
    { key: 'status', header: 'Status' },
  ];

  readonly nodes: TreeTableNode<AccountRow>[] = [
    { id: 'g1', data: { name: 'Corporate Accounts', amount: '$1.2M', status: 'Active' }, children: [
      { id: 'g1-1', data: { name: 'Acme Holdings',   amount: '$820K', status: 'Active' } },
      { id: 'g1-2', data: { name: 'Bright Capital',  amount: '$380K', status: 'Review' } },
    ]},
    { id: 'g2', data: { name: 'Retail Accounts', amount: '$430K', status: 'Active' }, children: [
      { id: 'g2-1', data: { name: 'Individual Clients', amount: '$430K', status: 'Active' } },
    ]},
  ];
}
