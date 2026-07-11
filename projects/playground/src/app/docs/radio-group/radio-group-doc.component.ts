import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiRadioGroupComponent, SelectOption } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-radio-group-doc',
  imports: [CuiRadioGroupComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './radio-group-doc.component.html',
  styleUrl: './radio-group-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',       label: 'Basic usage' },
    { id: 'orientation', label: 'Orientation' },
    { id: 'states',      label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'options',     type: 'SelectOption<T>[]',              default: '[]',          description: 'Options to render, one radio per entry.' },
    { name: 'orientation', type: `'horizontal' | 'vertical'`,      default: `'vertical'`,  description: 'Layout direction.' },
    { name: 'disabled',    type: 'boolean',                        default: 'false',       description: 'Disables the whole group.' },
    { name: 'required',    type: 'boolean',                        default: 'false',       description: 'Marks the group required.' },
    { name: 'name',        type: 'string',                         default: `'p-radio-group-{n}'`, description: 'Native radio group name; auto-generated and unique per instance if omitted.' },
    { name: 'value',       type: 'T | null',                       default: 'null',        description: 'Two-way bindable selected value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<T | null>', description: 'Emitted whenever the selection changes, alongside the value model update.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SelectOption<T = string>',
      fields: [
        { name: 'value',    type: 'T',       description: 'The underlying value bound to value / [(value)].' },
        { name: 'label',    type: 'string',  description: 'Text shown for the option.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Disables this individual option.' },
        { name: 'group',    type: 'string | undefined',  description: 'Not used by radio-group; only meaningful for grouped selects.' },
      ],
    },
  ];

  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' },
  ];

  readonly riskValue = signal<string | null>('medium');
  readonly horizontalValue = signal<string | null>('low');
}
