import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiInputMaskComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-mask-doc',
  imports: [CuiInputMaskComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './input-mask-doc.component.html',
  styleUrl: './input-mask-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputMaskDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'phone',   label: 'Phone number' },
    { id: 'date',    label: 'Date' },
    { id: 'unmask',  label: 'Unmasked value' },
    { id: 'states',  label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'mask',        type: 'string',  default: `''`,    description: "Mask pattern: '9' = digit, 'a' = letter, '*' = alphanumeric; any other character is a literal." },
    { name: 'slotChar',    type: 'string',  default: `'_'`,   description: 'Placeholder character shown in unfilled mask slots.' },
    { name: 'autoClear',   type: 'boolean', default: 'true',  description: "Clears the field on blur if the mask wasn't fully completed." },
    { name: 'unmask',      type: 'boolean', default: 'false', description: 'When true, value holds only the typed characters, without mask literals.' },
    { name: 'disabled',    type: 'boolean', default: 'false', description: 'Disables the field.' },
    { name: 'placeholder', type: 'string',  default: `''`,    description: 'Native placeholder text.' },
    { name: 'value',       type: 'string',  default: `''`,    description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor with formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onComplete', type: 'EventEmitter<string>',      description: 'Emitted when every mask slot has been filled.' },
    { name: 'onFocus',    type: 'EventEmitter<FocusEvent>',  description: 'Emitted when the field receives focus.' },
    { name: 'onBlur',     type: 'EventEmitter<FocusEvent>',  description: 'Emitted when the field loses focus.' },
  ];

  readonly phone = signal('');
  readonly date  = signal('');
  readonly ssn   = signal('');
}
