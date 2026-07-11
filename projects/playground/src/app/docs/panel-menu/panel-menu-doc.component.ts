import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiPanelMenuComponent, CuiMenuItem } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-panel-menu-doc',
  imports: [CuiPanelMenuComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './panel-menu-doc.component.html',
  styleUrl: './panel-menu-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelMenuDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items', type: 'CuiMenuItem[]', default: '[]', description: 'Menu items — entries with children render as expandable groups instead of popup submenus. See the Menu doc page for the CuiMenuItem shape.' },
  ];

  readonly lastAction = signal('');

  readonly panelMenuItems: CuiMenuItem[] = [
    { id: 'monitoring', label: 'Monitoring', icon: 'radar', children: [
      { id: 'alerts',       label: 'Alerts',       icon: 'aml_flag',   command: () => this.lastAction.set('alerts') },
      { id: 'transactions', label: 'Transactions', icon: 'swap_horiz', command: () => this.lastAction.set('transactions') },
    ]},
    { id: 'reports', label: 'Reports', icon: 'summarize', children: [
      { id: 'daily',   label: 'Daily Summary',   command: () => this.lastAction.set('daily') },
      { id: 'monthly', label: 'Monthly Summary', command: () => this.lastAction.set('monthly') },
    ]},
    { id: 'settings', label: 'Settings', icon: 'settings', command: () => this.lastAction.set('settings') },
  ];
}
