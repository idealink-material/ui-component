import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbItem, CuiBreadcrumbComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import {
  DocApiInterface, DocApiProperty, DocSection,
} from '../shared/doc-types';

@Component({
  selector: 'app-breadcrumb-doc',
  imports: [CuiBreadcrumbComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './breadcrumb-doc.component.html',
  styleUrl: './breadcrumb-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'manual-items', label: 'Manual items' },
    { id: 'service',      label: 'Service-driven' },
    { id: 'separator',    label: 'Custom separator' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items',     type: 'BreadcrumbItem[] | null', default: 'null', description: 'Manual items. When provided, overrides the BreadcrumbService signal.' },
    { name: 'separator', type: 'string',                  default: `'chevron_right'`, description: 'Icon name rendered between items.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'BreadcrumbItem',
      fields: [
        { name: 'label',       type: 'string',  description: 'Text shown for the crumb.' },
        { name: 'routerLink',  type: 'string | undefined', description: 'Optional route to link to. Ignored for the last item.' },
        { name: 'isCurrent',   type: 'boolean | undefined', description: 'Marks the item as the current page (sets aria-current).' },
      ],
    },
  ];

  readonly caseItems: BreadcrumbItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Cases', routerLink: '/cases' },
    { label: 'AML Dashboard', isCurrent: true },
  ];
}
