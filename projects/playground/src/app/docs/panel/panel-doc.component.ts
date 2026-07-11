import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiPanelComponent, PPanelFooterComponent, CuiButtonComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-panel-doc',
  imports: [CuiPanelComponent, PPanelFooterComponent, CuiButtonComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './panel-doc.component.html',
  styleUrl: './panel-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',      label: 'Basic usage' },
    { id: 'toggleable', label: 'Toggleable' },
    { id: 'footer',     label: 'With footer' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'header',     type: 'string',  default: `''`,    description: 'Title shown in the header row. The header row only renders when header or toggleable is set.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Shows a chevron in the header that collapses/expands the content.' },
    { name: 'collapsed',  type: 'boolean', default: 'false', description: 'Two-way bindable collapsed state ([(collapsed)]). Only takes effect when toggleable is true.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onToggle', type: 'EventEmitter<boolean>', description: 'Emitted with the new collapsed state whenever the toggle is clicked.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)',    description: 'The panel body content.' },
    { name: '[panelIcons]', description: 'Extra header icons/actions projected before the toggle chevron.' },
    { name: 'p-panel-footer', description: 'Optional footer slot rendered below the body, typically holding action buttons.' },
  ];

  readonly collapsed = signal(false);
}
