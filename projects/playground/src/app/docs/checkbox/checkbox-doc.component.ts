import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiCheckboxComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-checkbox-doc',
  imports: [CuiCheckboxComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './checkbox-doc.component.html',
  styleUrl: './checkbox-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',         label: 'Basic usage' },
    { id: 'indeterminate', label: 'Indeterminate' },
    { id: 'states',        label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',         type: 'string',  default: `''`,    description: 'Label text rendered next to the checkbox.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows the indeterminate (dash) visual state.' },
    { name: 'disabled',      type: 'boolean', default: 'false', description: 'Disables the checkbox.' },
    { name: 'required',      type: 'boolean', default: 'false', description: 'Marks the checkbox required.' },
    { name: 'binary',        type: 'boolean', default: 'true',  description: 'Always true — this checkbox binds a single boolean value, not a value from a group array.' },
    { name: 'readonly',      type: 'boolean', default: 'false', description: 'Keeps the checkbox focusable but prevents toggling its value.' },
    { name: 'tabindex',      type: 'number',  default: '0',     description: 'Native tabindex attribute.' },
    { name: 'value',         type: 'boolean', default: 'false', description: 'Two-way bindable checked state ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onChange', type: 'EventEmitter<boolean>', description: 'Emitted when the checked state changes (not emitted for readonly toggles).' },
  ];

  readonly basic = signal(false);
  readonly readonlyVal = signal(true);
}
