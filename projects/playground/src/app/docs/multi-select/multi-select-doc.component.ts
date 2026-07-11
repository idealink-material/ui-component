import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiMultiSelectComponent, SelectOption } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-multi-select-doc',
  imports: [CuiMultiSelectComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './multi-select-doc.component.html',
  styleUrl: './multi-select-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'display', label: 'Display mode' },
    { id: 'limit',   label: 'Selection limit & select all' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'options',          type: 'SelectOption<T>[]',     default: '[]',        description: 'Options to render.' },
    { name: 'placeholder',      type: 'string',                default: `'Select…'`, description: 'Placeholder shown when no options are selected.' },
    { name: 'filterable',       type: 'boolean',               default: 'true',      description: 'Shows a search box in the panel. filter is an alias for this.' },
    { name: 'filter',           type: 'boolean | null',        default: 'null',      description: 'Alias for filterable; takes precedence when set.' },
    { name: 'disabled',         type: 'boolean',                default: 'false',     description: 'Disables the field.' },
    { name: 'fullWidth',        type: 'boolean',                default: 'true',      description: 'Stretches the field to fill its container.' },
    { name: 'display',          type: `'comma' | 'chip'`,      default: `'chip'`,    description: 'How selected items are rendered on the closed control.' },
    { name: 'selectionLimit',   type: 'number | null',         default: 'null',      description: 'Maximum number of options that can be selected at once.' },
    { name: 'showToggleAll',    type: 'boolean',                default: 'false',     description: 'Shows a "select all" toggle at the top of the panel.' },
    { name: 'virtualScroll',    type: 'boolean',                default: 'false',     description: 'Wraps the option list in a CDK virtual-scroll viewport for large lists.' },
    { name: 'virtualItemSize',  type: 'number',                 default: '36',        description: 'Row height in pixels, used by the virtual-scroll viewport.' },
    { name: 'value',            type: 'T[]',                    default: '[]',        description: 'Two-way bindable selected values ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange',         type: 'EventEmitter<T[]>',     description: 'Emitted whenever the selection changes, alongside the value model update.' },
    { name: 'onFilter',          type: 'EventEmitter<string>',  description: 'Emitted as the user types in the filter box.' },
    { name: 'onSelectAllChange', type: 'EventEmitter<boolean>', description: 'Emitted when the select-all toggle is used, with the resulting all-selected state.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SelectOption<T = string>',
      fields: [
        { name: 'value',    type: 'T',       description: 'The underlying value bound to value / [(value)].' },
        { name: 'label',    type: 'string',  description: 'Text shown for the option.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Disables this option.' },
        { name: 'group',    type: 'string | undefined',  description: 'Not used by multi-select; only meaningful for grouped selects.' },
      ],
    },
  ];

  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high',   label: 'High Risk' },
    { value: 'severe', label: 'Severe Risk' },
  ];

  readonly chipVal   = signal<string[]>(['low', 'high']);
  readonly commaVal  = signal<string[]>(['medium']);
  readonly limitedVal = signal<string[]>([]);
}
