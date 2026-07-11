import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { CuiMenuComponent, CuiButtonComponent, CuiMenuItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-menu-doc',
  imports: [CuiMenuComponent, CuiButtonComponent, MatMenuModule, DocExampleComponent, DocShellComponent],
  templateUrl: './menu-doc.component.html',
  styleUrl: './menu-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',      label: 'Basic usage' },
    { id: 'submenus',   label: 'Submenus & separators' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items', type: 'CuiMenuItem[]', default: '[]', description: 'Menu items to render.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'CuiMenuItem',
      fields: [
        { name: 'id',        type: 'string',                description: 'Unique identifier.' },
        { name: 'label',     type: 'string',                description: 'Item text.' },
        { name: 'icon',      type: 'string | undefined',    description: 'Optional icon name shown before the label.' },
        { name: 'command',   type: '(() => void) | undefined', description: 'Handler invoked when the item is activated.' },
        { name: 'disabled',  type: 'boolean | undefined',   description: 'Disables the item.' },
        { name: 'separator', type: 'boolean | undefined',   description: 'Renders a divider in place of this item (label/command ignored).' },
        { name: 'children',  type: 'CuiMenuItem[] | undefined', description: 'Child items — renders this item as a submenu trigger.' },
      ],
    },
  ];

  readonly lastAction = signal('');

  readonly caseMenuItems: CuiMenuItem[] = [
    { id: 'view',     label: 'View Details', icon: 'visibility', command: () => this.lastAction.set('view') },
    { id: 'assign',   label: 'Reassign',     icon: 'person_add', command: () => this.lastAction.set('assign') },
    { id: 'sep1',     label: '', separator: true },
    { id: 'escalate', label: 'Escalate',     icon: 'warning',    command: () => this.lastAction.set('escalate') },
    { id: 'close',    label: 'Close Case',   icon: 'check',      command: () => this.lastAction.set('close') },
  ];

  readonly fileMenuItems: CuiMenuItem[] = [
    { id: 'file', label: 'File', children: [
      { id: 'new',    label: 'New Case', icon: 'add',      command: () => this.lastAction.set('new') },
      { id: 'export', label: 'Export',   icon: 'download', command: () => this.lastAction.set('export') },
    ]},
    { id: 'sep', label: '', separator: true },
    { id: 'help', label: 'Help', icon: 'help', command: () => this.lastAction.set('help') },
  ];
}
