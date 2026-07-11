import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiProgressComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-progress-doc',
  imports: [CuiProgressComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './progress-doc.component.html',
  styleUrl: './progress-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'colors',        label: 'Colors' },
    { id: 'label',         label: 'Label' },
    { id: 'indeterminate', label: 'Indeterminate' },
    { id: 'striped',       label: 'Striped' },
    { id: 'height',        label: 'Height' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'value',         type: 'number',  default: '0',          description: 'Current progress value.' },
    { name: 'max',           type: 'number',  default: '100',        description: 'Value representing 100%.' },
    { name: 'indeterminate', type: 'boolean', default: 'false',      description: 'Shows a continuously animating bar with no known value.' },
    { name: 'color',         type: `'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning'`, default: `'primary'`, description: 'Color of the fill.' },
    { name: 'label',         type: 'string',  default: `'Progress'`, description: 'Accessible label for the progressbar role.' },
    { name: 'showLabel',     type: 'boolean', default: 'false',      description: 'Shows the percentage (or "Loading…") next to the bar.' },
    { name: 'striped',       type: 'boolean', default: 'false',      description: 'Renders a diagonal striped fill.' },
    { name: 'height',        type: 'string',  default: `'6px'`,      description: 'Track height, any valid CSS length.' },
  ];

  readonly value = signal(64);
}
