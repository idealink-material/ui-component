import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CuiEmptyStateComponent, PEmptyStateActionComponent, CuiButtonComponent,
} from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-empty-state-doc',
  imports: [
    CuiEmptyStateComponent, PEmptyStateActionComponent, CuiButtonComponent,
    DocExampleComponent, DocShellComponent,
  ],
  templateUrl: './empty-state-doc.component.html',
  styleUrl: './empty-state-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',        label: 'Basic usage' },
    { id: 'action',       label: 'With action' },
    { id: 'no-icon',      label: 'Without an icon' },
    { id: 'custom-icon',  label: 'Custom icon content' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'icon',        type: 'string | null', default: `'inbox'`,   description: 'Icon name shown above the title; pass null to hide it.' },
    { name: 'title',       type: 'string',        default: `'No data'`, description: 'Primary message.' },
    { name: 'description', type: 'string | null', default: 'null',     description: 'Secondary supporting text.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '[icon]',              description: "Escape hatch for custom icon content (e.g. a hand-written <svg>) when the icon string input isn't enough — set icon to null to suppress the default cui-icon." },
    { name: 'p-empty-state-action', description: 'Optional call-to-action slot, projected below the description — typically wraps a p-button.' },
  ];
}
