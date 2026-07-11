import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiSpeedDialComponent, SpeedDialItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiInterface, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-speed-dial-doc',
  imports: [CuiSpeedDialComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './speed-dial-doc.component.html',
  styleUrl: './speed-dial-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedDialDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',        label: 'Basic usage' },
    { id: 'direction',    label: 'Direction' },
    { id: 'custom-icon',  label: 'Custom toggle icon' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items',     type: 'SpeedDialItem[]',      default: '[]',   description: 'Actions revealed when the dial is opened.' },
    { name: 'icon',      type: 'string',                default: `'add'`, description: 'Icon shown on the closed trigger button.' },
    { name: 'direction', type: `'up' | 'down'`,         default: `'up'`, description: 'Direction the action items fan out toward.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SpeedDialItem',
      fields: [
        { name: 'id',      type: 'string',                   description: 'Unique identifier.' },
        { name: 'icon',    type: 'string',                   description: 'Icon shown on the action button.' },
        { name: 'label',   type: 'string | undefined',       description: 'Optional tooltip/label for the action.' },
        { name: 'command', type: '(() => void) | undefined', description: 'Handler invoked when the action is clicked; closes the dial afterward.' },
      ],
    },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '[toggleIcon]', description: "Escape hatch for custom closed-state toggle content (e.g. a hand-written <svg>) — set icon to '' to suppress the default cui-icon. Only rendered while the dial is closed; the open state always shows a close icon." },
  ];

  readonly lastAction = signal('');

  readonly caseActions: SpeedDialItem[] = [
    { id: 'flag',   icon: 'aml_flag',   label: 'Flag Case',  command: () => this.lastAction.set('flag') },
    { id: 'assign', icon: 'person_add', label: 'Assign',     command: () => this.lastAction.set('assign') },
    { id: 'close',  icon: 'check',      label: 'Close Case', command: () => this.lastAction.set('close') },
  ];
}
