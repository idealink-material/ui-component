import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-dialog-doc',
  imports: [
    CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent,
    DocExampleComponent, DocShellComponent,
  ],
  templateUrl: './dialog-doc.component.html',
  styleUrl: './dialog-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',     label: 'Basic usage' },
    { id: 'no-divider', label: 'Without dividers' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'title',     type: 'string',  default: `''`,   description: 'Dialog title shown in the header.' },
    { name: 'showClose', type: 'boolean', default: 'true', description: 'Shows the close (×) button in the header.' },
    { name: 'dividers',  type: 'boolean', default: 'true', description: 'Adds a divider line under the header.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the close button is clicked. Also closes the underlying CDK DialogRef, when opened via the CDK Dialog service.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)',      description: 'The scrollable dialog body.' },
    { name: 'p-dialog-footer', description: 'Optional footer slot rendered below the body, typically holding action buttons.' },
  ];

  readonly dialogOpen = signal(false);
  readonly plainOpen  = signal(false);
}
