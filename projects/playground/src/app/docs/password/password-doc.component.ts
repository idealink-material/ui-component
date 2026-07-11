import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiPasswordComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-password-doc',
  imports: [CuiPasswordComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './password-doc.component.html',
  styleUrl: './password-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'toggle',   label: 'Reveal toggle' },
    { id: 'feedback', label: 'Strength feedback' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',       type: 'string',  default: `''`,               description: 'Floating label text.' },
    { name: 'placeholder', type: 'string',  default: `''`,               description: 'Placeholder text shown when empty.' },
    { name: 'disabled',    type: 'boolean', default: 'false',            description: 'Disables the field.' },
    { name: 'required',    type: 'boolean', default: 'false',            description: 'Marks the field required.' },
    { name: 'fullWidth',   type: 'boolean', default: 'true',             description: 'Stretches the field to fill its container.' },
    { name: 'toggleMask',  type: 'boolean', default: 'false',            description: 'Shows an eye icon to reveal/hide the typed password.' },
    { name: 'feedback',    type: 'boolean', default: 'true',             description: 'Shows a strength meter panel below the field while focused.' },
    { name: 'promptLabel', type: 'string',  default: `'Enter a password'`, description: 'Feedback text shown before any characters are typed.' },
    { name: 'weakLabel',   type: 'string',  default: `'Weak'`,           description: 'Strength label for weak passwords.' },
    { name: 'mediumLabel', type: 'string',  default: `'Medium'`,         description: 'Strength label for medium-strength passwords.' },
    { name: 'strongLabel', type: 'string',  default: `'Strong'`,         description: 'Strength label for strong passwords.' },
    { name: 'value',       type: 'string',  default: `''`,               description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onInput', type: 'EventEmitter<string>', description: 'Emitted on every input event, alongside the value model update.' },
  ];

  readonly basic  = signal('');
  readonly toggle = signal('');
  readonly strong = signal('');
}
