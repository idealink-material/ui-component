import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiTreeComponent, TreeNode } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-tree-doc',
  imports: [CuiTreeComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './tree-doc.component.html',
  styleUrl: './tree-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',      label: 'Basic usage' },
    { id: 'selectable', label: 'Selectable' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'nodes',       type: 'TreeNode<T>[]',    default: '[]',    description: 'Root nodes to render.' },
    { name: 'selectable',  type: 'boolean',           default: 'false', description: 'Shows a checkbox next to each node for multi-selection.' },
    { name: 'selectedIds', type: 'readonly string[]', default: '[]',   description: 'Two-way bindable selected node ids ([(selectedIds)]).' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'selectionChange', type: 'EventEmitter<readonly string[]>', description: 'Emitted whenever the selected id list changes (selectable must be true).' },
    { name: 'nodeClick',       type: 'EventEmitter<TreeNode<T>>',       description: 'Emitted when a (non-disabled) node label is clicked.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'TreeNode<T = unknown>',
      fields: [
        { name: 'id',       type: 'string',              description: 'Unique identifier.' },
        { name: 'label',    type: 'string',              description: 'Node text.' },
        { name: 'icon',     type: 'string | undefined',  description: 'Optional icon name.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Prevents nodeClick from firing for this node.' },
        { name: 'children', type: 'TreeNode<T>[] | undefined', description: 'Child nodes — presence renders an expand/collapse toggle.' },
        { name: 'data',     type: 'T | undefined',       description: 'Arbitrary payload attached to the node.' },
      ],
    },
  ];

  readonly treeNodes: TreeNode[] = [
    { id: 'monitoring', label: 'Monitoring', icon: 'radar', children: [
      { id: 'alerts',       label: 'Alerts',       icon: 'aml_flag' },
      { id: 'transactions', label: 'Transactions', icon: 'swap_horiz', children: [
        { id: 'wire', label: 'Wire Transfers' },
        { id: 'cash', label: 'Cash Deposits' },
      ]},
    ]},
    { id: 'reports', label: 'Reports', icon: 'summarize', children: [
      { id: 'daily',   label: 'Daily Summary' },
      { id: 'monthly', label: 'Monthly Summary' },
    ]},
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  readonly selectedIds = signal<readonly string[]>(['alerts']);

  onNodeClick(node: TreeNode): void {
    console.log('Node clicked:', node.id);
  }
}
