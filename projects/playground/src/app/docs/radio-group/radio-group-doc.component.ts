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
    { id: 'dynamic',     label: 'Dynamic options' },
    { id: 'data-key',    label: 'Get full object' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'options',     type: 'SelectOptionLike<T>[]',          default: '[]',          description: 'Options to render, one radio per entry. Either SelectOption<T> or a plain record read via optionLabel/optionValue.' },
    { name: 'optionLabel', type: 'string | undefined',             default: 'undefined',   description: "Name of the label field of an option, for options shaped as plain records. Defaults to 'label'." },
    { name: 'optionValue', type: 'string | undefined',             default: 'undefined',   description: "Name of the value field of an option, for options shaped as plain records. Defaults to 'value'." },
    { name: 'dataKey',     type: 'string | undefined',             default: 'undefined',   description: 'A property to uniquely identify a value in options, used to compare values by key instead of by reference/equality — set this when binding the whole option object as value (omit optionValue) so a freshly-fetched copy still re-selects correctly.' },
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
    {
      name: 'SelectOptionLike<T = string>',
      fields: [
        { name: '(union)', type: 'SelectOption<T> | Record<string, unknown>', description: 'A proper SelectOption, or any plain record read via optionLabel/optionValue (e.g. a domain/lookup model).' },
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

  /** Plain-record options (e.g. a lookup fetched from an API) with no value/label fields. */
  readonly productTypeOptions: LookupOption[] = [
    { id: 1, dataName: 'Loan',    dataNameKh: 'ប្រាក់កម្ចី' },
    { id: 2, dataName: 'Deposit', dataNameKh: 'ប្រាក់បញ្ញើ' },
    { id: 3, dataName: 'Savings', dataNameKh: 'សន្សំ' },
  ];

  readonly productTypeValue = signal<number | null>(1);

  /** No optionValue set, so the whole option object is bound as value; dataKey re-selects it by id. */
  readonly productTypeObjectValue = signal<LookupOption | null>(this.productTypeOptions[1]);
}

interface LookupOption {
  [key: string]: unknown;
  id: number;
  dataName: string;
  dataNameKh: string;
}
