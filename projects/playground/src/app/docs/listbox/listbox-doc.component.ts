import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiListboxComponent, SelectOption } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-listbox-doc',
  imports: [CuiListboxComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './listbox-doc.component.html',
  styleUrl: './listbox-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'multiple', label: 'Multiple selection' },
    { id: 'filter',   label: 'Filterable' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'options',  type: 'SelectOption<T>[]',    default: '[]',    description: 'Options to render.' },
    { name: 'multiple', type: 'boolean',               default: 'false', description: 'Allows selecting more than one option.' },
    { name: 'disabled', type: 'boolean',               default: 'false', description: 'Disables the whole list.' },
    { name: 'filter',   type: 'boolean',               default: 'false', description: 'Shows a search box above the options.' },
    { name: 'checkbox', type: 'boolean',                default: 'false', description: 'Shows a checkbox next to each option (multiple mode).' },
    { name: 'value',    type: 'readonly T[]',          default: '[]',    description: 'Two-way bindable selected value(s) ([(value)]) — also works as a ControlValueAccessor. Always an array, even for single selection.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<readonly T[]>', description: 'Emitted whenever the selection changes, alongside the value model update.' },
    { name: 'onFilter',  type: 'EventEmitter<string>',       description: 'Emitted as the user types in the filter box (filter must be enabled).' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SelectOption<T = string>',
      fields: [
        { name: 'value',    type: 'T',       description: 'The underlying value bound to value / [(value)].' },
        { name: 'label',    type: 'string',  description: 'Text shown for the option.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Disables this option.' },
        { name: 'group',    type: 'string | undefined',  description: 'Not used by listbox; only meaningful for grouped selects.' },
      ],
    },
  ];

  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high',   label: 'High Risk' },
    { value: 'severe', label: 'Severe Risk' },
  ];

  readonly single = signal<readonly string[]>(['medium']);
  readonly multi  = signal<readonly string[]>(['high']);
  readonly filterable = signal<readonly string[]>([]);
}
