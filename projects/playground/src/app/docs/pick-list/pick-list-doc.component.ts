import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiPickListComponent, SelectOption } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-pick-list-doc',
  imports: [CuiPickListComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './pick-list-doc.component.html',
  styleUrl: './pick-list-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickListDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'sourceLabel', type: 'string',            default: `'Available'`, description: 'Header label for the left (available) list.' },
    { name: 'targetLabel', type: 'string',            default: `'Selected'`,  description: 'Header label for the right (chosen) list.' },
    { name: 'options',     type: 'SelectOption<T>[]', default: '[]',          description: 'All options; each is in exactly one of the two lists based on whether its value is in value.' },
    { name: 'value',       type: 'T[]',               default: '[]',          description: 'Values currently in the target (right) list — two-way bindable via [(value)].' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<T[]>', description: 'Emitted whenever an item is moved between lists, alongside the value model update.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SelectOption<T = string>',
      fields: [
        { name: 'value',    type: 'T',       description: 'The underlying value bound to value / [(value)].' },
        { name: 'label',    type: 'string',  description: 'Text shown for the option.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Not currently honored by pick-list.' },
        { name: 'group',    type: 'string | undefined',  description: 'Not used by pick-list; only meaningful for grouped selects.' },
      ],
    },
  ];

  readonly people: SelectOption[] = [
    { value: 'alice', label: 'Alice B.' },
    { value: 'bob',   label: 'Bob C.' },
    { value: 'carol', label: 'Carol D.' },
    { value: 'dave',  label: 'Dave E.' },
    { value: 'erin',  label: 'Erin F.' },
  ];

  readonly assigned = signal<string[]>(['alice', 'carol']);
}
