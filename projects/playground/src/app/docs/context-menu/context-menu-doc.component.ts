import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiContextMenuDirective, CuiMenuComponent, CuiMenuItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-context-menu-doc',
  imports: [CuiContextMenuDirective, CuiMenuComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './context-menu-doc.component.html',
  styleUrl: './context-menu-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'pContextMenu',         type: 'MatMenu',  default: 'required', description: 'The menu to open — pass a <p-menu>\'s exposed menu() view child, e.g. [pContextMenu]="menu.menu()".' },
    { name: 'pContextMenuDisabled', type: 'boolean',  default: 'false',    description: 'Disables the right-click trigger on this element.' },
  ];

  readonly lastAction = signal('');

  readonly rowMenuItems: CuiMenuItem[] = [
    { id: 'view',    label: 'View Details', icon: 'visibility', command: () => this.lastAction.set('view') },
    { id: 'assign',  label: 'Reassign',     icon: 'person_add', command: () => this.lastAction.set('assign') },
    { id: 'sep',     label: '', separator: true },
    { id: 'delete',  label: 'Delete',       icon: 'delete',     command: () => this.lastAction.set('delete') },
  ];
}
