import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiTabsComponent, TabItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-tabs-doc',
  imports: [CuiTabsComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './tabs-doc.component.html',
  styleUrl: './tabs-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'badges',  label: 'Icons & badges' },
    { id: 'stretch', label: 'Stretch & secondary' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'tabs',               type: 'TabItem[]',              default: '[]',      description: 'The tabs to render.' },
    { name: 'activeIndex',        type: 'number',                 default: '0',       description: 'Index of the selected tab.' },
    { name: 'variant',            type: `'primary' | 'secondary'`, default: `'primary'`, description: 'Visual style of the tab bar.' },
    { name: 'stretchTabs',        type: 'boolean',                default: 'false',   description: 'Stretches tabs to fill the available width.' },
    { name: 'animationDuration',  type: 'string',                 default: `'200ms'`, description: 'Ink-bar/content transition duration.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'tabChange', type: 'EventEmitter<number>', description: 'Emitted with the newly selected tab index.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)', description: "Content projected below the tab bar. Either project it unconditionally and switch on activeIndex yourself, or set a tab's content to a TemplateRef for per-tab content." },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'TabItem',
      fields: [
        { name: 'id',       type: 'string',                       description: 'Unique identifier for the tab.' },
        { name: 'label',    type: 'string',                       description: 'Tab label text.' },
        { name: 'icon',     type: 'string | undefined',           description: 'Optional icon name shown before the label.' },
        { name: 'badge',    type: 'string | number | undefined',  description: 'Optional badge rendered after the label.' },
        { name: 'disabled', type: 'boolean | undefined',          description: 'Disables the tab.' },
        { name: 'content',  type: 'TemplateRef<unknown> | undefined', description: 'Template ref rendered inside this tab.' },
      ],
    },
  ];

  readonly basicTabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'forms',    label: 'Forms' },
    { id: 'data',     label: 'Data' },
  ];

  readonly iconTabs: TabItem[] = [
    { id: 'alerts',       label: 'Alerts',       icon: 'aml_flag', badge: 12 },
    { id: 'transactions', label: 'Transactions', icon: 'swap_horiz' },
    { id: 'settings',     label: 'Settings',     icon: 'settings', disabled: true },
  ];

  readonly activeTab = signal(0);
}
