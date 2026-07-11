import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiAccordionComponent, CuiAccordionPanelComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-accordion-doc',
  imports: [CuiAccordionComponent, CuiAccordionPanelComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './accordion-doc.component.html',
  styleUrl: './accordion-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'multi', label: 'Multiple open panels' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'multi (p-accordion)',        type: 'boolean', default: 'false', description: 'Allows more than one panel to be expanded at once.' },
    { name: 'title (p-accordion-panel)',       type: 'string',           default: `''`,    description: 'Panel header title.' },
    { name: 'description (p-accordion-panel)', type: 'string | null',    default: 'null',  description: 'Optional supporting text shown in the header.' },
    { name: 'disabled (p-accordion-panel)',    type: 'boolean',          default: 'false', description: 'Disables the panel.' },
    { name: 'expanded (p-accordion-panel)',    type: 'boolean',          default: 'false', description: 'Two-way bindable expanded state ([(expanded)]).' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default, p-accordion)',       description: 'Accepts one or more p-accordion-panel children.' },
    { name: '(default, p-accordion-panel)', description: "The panel's body content, shown when expanded." },
  ];
}
