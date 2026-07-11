import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiSkeletonComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-skeleton-doc',
  imports: [CuiSkeletonComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './skeleton-doc.component.html',
  styleUrl: './skeleton-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'variants', label: 'Variants' },
    { id: 'sizes',    label: 'Custom sizes' },
    { id: 'card',     label: 'Composed example' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'variant', type: `'text' | 'rect' | 'circle'`, default: `'text'`,  description: 'Shape of the skeleton placeholder.' },
    { name: 'width',   type: 'string', default: `'100%'`, description: 'Placeholder width, any valid CSS length.' },
    { name: 'height',  type: 'string', default: `'1em'`,  description: 'Placeholder height, any valid CSS length.' },
  ];
}
