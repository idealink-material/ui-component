import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiInputOtpComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-otp-doc',
  imports: [CuiInputOtpComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './input-otp-doc.component.html',
  styleUrl: './input-otp-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'default',     label: 'Default' },
    { id: 'length',      label: 'Custom length' },
    { id: 'masked',      label: 'Masked' },
    { id: 'alphanumeric', label: 'Alphanumeric' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'length',      type: 'number',  default: '4',     description: 'Number of input segments rendered.' },
    { name: 'mask',        type: 'boolean', default: 'false', description: 'Renders filled slots as dots instead of the typed character.' },
    { name: 'integerOnly', type: 'boolean', default: 'true',  description: 'Restricts each segment to numeric digits only.' },
    { name: 'disabled',    type: 'boolean', default: 'false', description: 'Disables every segment.' },
    { name: 'value',       type: 'string',  default: `''`,    description: 'Two-way bindable code, one character per segment ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onChange', type: 'EventEmitter<string>', description: 'Emitted whenever the assembled code changes.' },
  ];

  readonly code4 = signal('');
  readonly code6 = signal('');
  readonly codeMasked = signal('');
  readonly codeAlpha = signal('');
}
