import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CuiPopoverDirective, CuiButtonComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-popover-doc',
  imports: [CuiPopoverDirective, CuiButtonComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './popover-doc.component.html',
  styleUrl: './popover-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'pPopover', type: 'TemplateRef<unknown>', default: 'required', description: 'The template to render inside the overlay, positioned below (or above, if there\'s no room) the host element.' },
  ];
}
