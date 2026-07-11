import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiSpinnerComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-spinner-doc',
  imports: [CuiSpinnerComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './spinner-doc.component.html',
  styleUrl: './spinner-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'sizes', label: 'Sizes' },
    { id: 'color', label: 'Color' },
    { id: 'label', label: 'Accessible label' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'size',  type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`, default: `'md'`, description: 'Spinner diameter.' },
    { name: 'color', type: 'string', default: `'var(--mat-sys-primary)'`, description: 'Any valid CSS color value.' },
    { name: 'label', type: 'string', default: `'Loading…'`, description: 'Accessible label announced via aria-live.' },
  ];
}
