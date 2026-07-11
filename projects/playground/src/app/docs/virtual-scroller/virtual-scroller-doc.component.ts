import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiVirtualScrollerComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-virtual-scroller-doc',
  imports: [CuiVirtualScrollerComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './virtual-scroller-doc.component.html',
  styleUrl: './virtual-scroller-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',  label: 'Basic usage' },
    { id: 'custom', label: 'Custom row template' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'items',        type: 'T[]',                                       default: '[]',      description: 'The full item list — only the rows currently in view are rendered to the DOM.' },
    { name: 'itemSize',     type: 'number',                                    default: '40',       description: 'Fixed row height in pixels, used by the CDK virtual-scroll viewport to compute scroll position.' },
    { name: 'height',       type: 'string',                                    default: `'400px'`,  description: 'CSS height of the scrollable viewport.' },
    { name: 'itemTemplate', type: 'TemplateRef<VirtualScrollerItemContext<T>> | null', default: 'null', description: 'Template rendered per row.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'VirtualScrollerItemContext<T>',
      fields: [
        { name: '$implicit', type: 'T',      description: "The row's item — bind with let-item on the ng-template." },
        { name: 'index',     type: 'number', description: "The row's index — bind with let-i=\"index\"." },
      ],
    },
  ];

  readonly transactions = Array.from({ length: 200 }, (_, i) => `Transaction row #${i + 1}`);
}
