import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CuiInputComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-doc',
  imports: [CuiInputComponent, MatFormFieldModule, DocExampleComponent, DocShellComponent],
  templateUrl: './input-doc.component.html',
  styleUrl: './input-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',        label: 'Basic usage' },
    { id: 'variants',     label: 'Variants & sizes' },
    { id: 'icons',        label: 'Icons' },
    { id: 'custom-icons', label: 'Custom icon content' },
    { id: 'hint',         label: 'Hint & error' },
    { id: 'states',       label: 'States' },
    { id: 'multiline',    label: 'Multiline' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',        type: 'string',              default: `''`,        description: 'Floating label text.' },
    { name: 'placeholder',  type: 'string',              default: `''`,        description: 'Placeholder text shown when empty.' },
    { name: 'hint',         type: 'string | null',       default: 'null',      description: 'Helper text shown below the field when there is no error.' },
    { name: 'error',        type: 'string | null',       default: 'null',      description: 'Error message; replaces the hint and marks the field invalid.' },
    { name: 'type',         type: 'string',              default: `'text'`,    description: 'Native input type, e.g. text, email, password.' },
    { name: 'variant',      type: `'outline' | 'fill'`,  default: `'outline'`, description: 'Field appearance.' },
    { name: 'size',         type: `'sm' | 'md' | 'lg'`,  default: `'md'`,      description: 'Field height.' },
    { name: 'prefixIcon',   type: 'string | null',       default: 'null',      description: 'Icon rendered before the input.' },
    { name: 'suffixIcon',   type: 'string | null',       default: 'null',      description: 'Icon rendered after the input.' },
    { name: 'disabled',     type: 'boolean',             default: 'false',     description: 'Disables the field.' },
    { name: 'readonly',     type: 'boolean',             default: 'false',     description: 'Makes the field read-only.' },
    { name: 'required',     type: 'boolean',             default: 'false',     description: 'Marks the field required and shows a * next to the label.' },
    { name: 'fullWidth',    type: 'boolean',             default: 'true',      description: 'Stretches the field to fill its container.' },
    { name: 'autocomplete', type: 'string',              default: `'off'`,     description: 'Native autocomplete attribute.' },
    { name: 'multiline',    type: 'boolean',             default: 'false',     description: 'Renders a <textarea> instead of a single-line <input>.' },
    { name: 'rows',         type: 'number',              default: '3',         description: 'Textarea row count (multiline only).' },
    { name: 'cols',         type: 'number | null',       default: 'null',      description: 'Textarea column count (multiline only).' },
    { name: 'autoResize',   type: 'boolean',             default: 'false',     description: 'Grows the textarea height to fit its content (multiline only).' },
    { name: 'value',        type: 'string',              default: `''`,        description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor with formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<string>',     description: 'Emitted on every input event, alongside the value model update.' },
    { name: 'cuiFocus',  type: 'EventEmitter<FocusEvent>', description: 'Emitted when the field gains focus.' },
    { name: 'cuiBlur',   type: 'EventEmitter<FocusEvent>', description: 'Emitted when the field loses focus.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '[prefixIcon]', description: 'Escape hatch for custom prefix content (e.g. a hand-written <svg>) when the prefixIcon string input isn\'t enough. Mark your projected element with matPrefix so Material positions it correctly.' },
    { name: '[suffixIcon]', description: 'Same as [prefixIcon], for the trailing side — mark your element with matSuffix.' },
  ];

  readonly demoValue = signal('');
}
