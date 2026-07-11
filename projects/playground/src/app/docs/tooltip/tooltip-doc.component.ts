import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiButtonComponent, CuiTooltipDirective } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-tooltip-doc',
  imports: [CuiButtonComponent, CuiTooltipDirective, DocExampleComponent, DocShellComponent],
  templateUrl: './tooltip-doc.component.html',
  styleUrl: './tooltip-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'position', label: 'Position' },
    { id: 'disabled', label: 'Disabled' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'cuiTooltip',         type: 'string',           default: '(required)', description: 'The tooltip message text.' },
    { name: 'cuiTooltipPosition', type: `'above' | 'below' | 'left' | 'right'`, default: `'below'`, description: 'Where the tooltip is anchored relative to the host element.' },
    { name: 'cuiTooltipDisabled', type: 'boolean',          default: 'false',       description: 'Suppresses the tooltip without removing the directive.' },
  ];
}
