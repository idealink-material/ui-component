import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiFieldsetComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-fieldset-doc',
  imports: [CuiFieldsetComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './fieldset-doc.component.html',
  styleUrl: './fieldset-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsetDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',      label: 'Basic usage' },
    { id: 'toggleable', label: 'Toggleable' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'legend',     type: 'string',  default: `''`,    description: 'Title shown overlapping the top border, like a native <fieldset>/<legend>.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Shows a chevron in the legend that collapses/expands the content.' },
    { name: 'collapsed',  type: 'boolean', default: 'false', description: 'Two-way bindable collapsed state ([(collapsed)]). Only takes effect when toggleable is true.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)', description: 'The fieldset body content.' },
  ];

  readonly collapsed = signal(false);
}
