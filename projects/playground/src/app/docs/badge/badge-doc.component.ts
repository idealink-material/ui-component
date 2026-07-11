import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiBadgeComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-badge-doc',
  imports: [CuiBadgeComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './badge-doc.component.html',
  styleUrl: './badge-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'variants', label: 'Variants' },
    { id: 'colors',   label: 'Colors' },
    { id: 'sizes',    label: 'Sizes' },
    { id: 'dot',      label: 'Dot indicator' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'variant',   type: `'filled' | 'outlined' | 'soft'`, default: `'soft'`,     description: 'Visual style of the badge.' },
    { name: 'color',     type: `'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'neutral'`, default: `'primary'`, description: 'Color scheme.' },
    { name: 'size',      type: `'sm' | 'md' | 'lg'`, default: `'md'`,   description: 'Badge size.' },
    { name: 'dot',       type: 'boolean',             default: 'false', description: 'Renders a small dot with no text content, ignoring projected content.' },
    { name: 'ariaLabel', type: 'string | null',       default: 'null',  description: 'Accessible label for the badge.' },
  ];
}
