import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiDividerComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-divider-doc',
  imports: [CuiDividerComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './divider-doc.component.html',
  styleUrl: './divider-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'label',   label: 'With a label' },
    { id: 'type',    label: 'Line style' },
    { id: 'vertical', label: 'Vertical' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'orientation', type: `'horizontal' | 'vertical'`,                default: `'horizontal'`, description: 'Direction of the divider line.' },
    { name: 'type',        type: `'solid' | 'dashed' | 'dotted'`,           default: `'solid'`,      description: 'Line style.' },
    { name: 'align',       type: `'left' | 'center' | 'right' | 'top' | 'bottom' | null`, default: 'null', description: "Where projected content sits along the line. Defaults to 'center' (horizontal) or 'top' (vertical)." },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)', description: 'Optional label rendered along the line, e.g. "OR". Omit it for a plain continuous line.' },
  ];
}
