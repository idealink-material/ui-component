import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiSelectComponent, SelectOption } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-select-doc',
  imports: [CuiSelectComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './select-doc.component.html',
  styleUrl: './select-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'grouped',  label: 'Grouped options' },
    { id: 'multiple', label: 'Multiple selection' },
    { id: 'filter',   label: 'Filterable & clearable' },
    { id: 'states',   label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',          type: 'string',             default: `''`,         description: 'Floating label text.' },
    { name: 'options',        type: 'SelectOption<T>[]',  default: '[]',         description: 'Options to render.' },
    { name: 'placeholder',    type: 'string',             default: `'Select…'`,  description: 'Placeholder shown when no value is selected.' },
    { name: 'hint',           type: 'string | null',      default: 'null',       description: 'Helper text shown when there is no error.' },
    { name: 'error',          type: 'string | null',      default: 'null',       description: 'Error message; replaces the hint and marks the field invalid.' },
    { name: 'multiple',       type: 'boolean',            default: 'false',      description: 'Allows selecting more than one option.' },
    { name: 'disabled',       type: 'boolean',            default: 'false',      description: 'Disables the field.' },
    { name: 'required',       type: 'boolean',            default: 'false',      description: 'Marks the field required.' },
    { name: 'fullWidth',      type: 'boolean',            default: 'true',       description: 'Stretches the field to fill its container.' },
    { name: 'variant',        type: `'outline' | 'fill'`, default: `'outline'`,  description: 'Field appearance.' },
    { name: 'filter',         type: 'boolean',            default: 'false',      description: 'Shows a search box at the top of the options panel.' },
    { name: 'showClear',      type: 'boolean',            default: 'false',      description: 'Shows a button to clear the current selection.' },
    { name: 'editable',       type: 'boolean',            default: 'false',      description: 'Renders a free-text input (with a suggestion list) instead of a closed dropdown trigger.' },
    { name: 'virtualScroll',  type: 'boolean',            default: 'false',      description: 'Wraps the (ungrouped) option list in a CDK virtual-scroll viewport for large lists.' },
    { name: 'virtualItemSize',type: 'number',             default: '36',         description: 'Row height in pixels, used by the virtual-scroll viewport.' },
    { name: 'value',          type: 'T | T[] | null',     default: 'null',       description: 'Two-way bindable selected value(s) via [(value)] or formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<T | T[] | null>', description: 'Emitted whenever the selection changes, alongside the value model update.' },
    { name: 'onFilter',  type: 'EventEmitter<string>',         description: 'Emitted as the user types in the filter box (filter must be enabled).' },
    { name: 'onShow',    type: 'EventEmitter<void>',           description: 'Emitted when the options panel opens.' },
    { name: 'onHide',    type: 'EventEmitter<void>',           description: 'Emitted when the options panel closes.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'SelectOption<T = string>',
      fields: [
        { name: 'value',    type: 'T',       description: 'The underlying value bound to value / [(value)].' },
        { name: 'label',    type: 'string',  description: 'Text shown for the option.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Disables this option.' },
        { name: 'group',    type: 'string | undefined',  description: 'Groups options sharing the same label under a mat-optgroup.' },
      ],
    },
  ];

  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high',   label: 'High Risk',   group: 'Critical' },
    { value: 'severe', label: 'Severe Risk',  group: 'Critical' },
  ];

  readonly single = signal<string | null>(null);
  readonly multi  = signal<string[] | null>([]);
}
