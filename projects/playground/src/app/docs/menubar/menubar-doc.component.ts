import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiMenubarComponent, CuiMenuItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-menubar-doc',
  imports: [CuiMenubarComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './menubar-doc.component.html',
  styleUrl: './menubar-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items', type: 'CuiMenuItem[]', default: '[]', description: 'Top-level menu items, self-contained (each renders its own trigger button, no external matMenuTriggerFor needed). See the Menu doc page for the CuiMenuItem shape.' },
  ];

  readonly lastAction = signal('');

  readonly menubarItems: CuiMenuItem[] = [
    { id: 'file', label: 'File', children: [
      { id: 'new',    label: 'New Case', icon: 'add',      command: () => this.lastAction.set('new') },
      { id: 'export', label: 'Export',   icon: 'download', command: () => this.lastAction.set('export') },
    ]},
    { id: 'view', label: 'View', children: [
      { id: 'refresh', label: 'Refresh', icon: 'refresh', command: () => this.lastAction.set('refresh') },
    ]},
    { id: 'help', label: 'Help', command: () => this.lastAction.set('help') },
  ];
}
