import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CuiCardComponent, PCardHeaderComponent, PCardFooterComponent,
  CuiButtonComponent, CuiBadgeComponent,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-card-doc',
  imports: [
    CuiCardComponent, PCardHeaderComponent, PCardFooterComponent,
    CuiButtonComponent, CuiBadgeComponent, DocExampleComponent, DocShellComponent,
  ],
  templateUrl: './card-doc.component.html',
  styleUrl: './card-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'variants',  label: 'Variants' },
    { id: 'hoverable', label: 'Hoverable & selected' },
    { id: 'sections',  label: 'Header & footer' },
    { id: 'padding',   label: 'Padding' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'variant',   type: `'elevated' | 'outlined' | 'filled'`, default: `'elevated'`, description: 'Visual style of the card.' },
    { name: 'padding',   type: 'boolean', default: 'true',  description: 'Applies the default internal padding.' },
    { name: 'hoverable', type: 'boolean', default: 'false', description: 'Adds a hover elevation/border transition.' },
    { name: 'selected',  type: 'boolean', default: 'false', description: 'Applies a selected visual state.' },
    { name: 'clickable', type: 'boolean', default: 'false', description: 'Shows a pointer cursor and click affordance.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)',   description: 'Main body content, rendered between the header and footer slots.' },
    { name: 'p-card-header', description: 'Projected when a <p-card-header> child is present; renders above the body.' },
    { name: 'p-card-footer', description: 'Projected when a <p-card-footer> child is present; renders below the body.' },
  ];
}
