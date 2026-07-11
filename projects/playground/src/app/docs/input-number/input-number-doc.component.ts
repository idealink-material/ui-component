import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiInputNumberComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-number-doc',
  imports: [CuiInputNumberComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './input-number-doc.component.html',
  styleUrl: './input-number-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'currency', label: 'Currency' },
    { id: 'range',    label: 'Min/max & no buttons' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'min',         type: 'number | null',            default: 'null',    description: 'Minimum value; the decrement button disables at this floor.' },
    { name: 'max',         type: 'number | null',            default: 'null',    description: 'Maximum value; the increment button disables at this ceiling.' },
    { name: 'step',        type: 'number',                   default: '1',       description: 'Amount added/subtracted per button press.' },
    { name: 'showButtons', type: 'boolean',                  default: 'true',    description: 'Shows the increment/decrement buttons.' },
    { name: 'disabled',    type: 'boolean',                  default: 'false',   description: 'Disables the field.' },
    { name: 'placeholder', type: 'string',                   default: `''`,      description: 'Placeholder text shown when empty.' },
    { name: 'fullWidth',   type: 'boolean',                  default: 'false',   description: 'Stretches the field to fill its container.' },
    { name: 'mode',        type: `'decimal' | 'currency'`,   default: `'decimal'`, description: 'Formatting mode for the display value.' },
    { name: 'currency',    type: 'string',                   default: `'USD'`,   description: 'ISO currency code used when mode is currency.' },
    { name: 'useGrouping', type: 'boolean',                  default: 'true',    description: 'Shows thousands separators in the formatted display value.' },
    { name: 'prefix',      type: 'string',                   default: `''`,      description: 'Static text prepended to the formatted display value.' },
    { name: 'suffix',      type: 'string',                   default: `''`,      description: 'Static text appended to the formatted display value.' },
    { name: 'value',       type: 'number | null',            default: 'null',    description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<number | null>', description: 'Emitted whenever the value changes, alongside the value model update.' },
    { name: 'onInput',   type: 'EventEmitter<number | null>', description: 'Emitted on every raw input event, before clamping.' },
    { name: 'onFocus',   type: 'EventEmitter<FocusEvent>',    description: 'Emitted when the field gains focus (switches to the raw editable value).' },
    { name: 'onBlur',    type: 'EventEmitter<FocusEvent>',    description: 'Emitted when the field loses focus (switches back to the formatted display value).' },
  ];

  readonly basic    = signal<number | null>(3);
  readonly price    = signal<number | null>(1250);
  readonly bounded  = signal<number | null>(50);
}
