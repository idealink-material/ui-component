import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
  CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent,
} from '@idealink-material/ui-core';
import { DialogService } from '@idealink-material/ui-utils';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';
import { MaximizableDialogDemoComponent } from './maximizable-dialog-demo.component';

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
  private readonly dialogService = inject(DialogService);
  readonly featureSections: DocSection[] = [
    { id: 'basic',     label: 'Basic usage' },
    { id: 'no-divider', label: 'Without dividers' },
    { id: 'maximizable', label: 'Maximize / restore' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'title',       type: 'string',  default: `''`,      description: 'Dialog title shown in the header.' },
    { name: 'showClose',   type: 'boolean', default: 'true',    description: 'Shows the close (×) button in the header.' },
    { name: 'dividers',    type: 'boolean', default: 'true',    description: 'Adds a divider line under the header.' },
    { name: 'maximizable', type: 'boolean', default: 'false',   description: 'Shows a maximize/restore toggle next to the close button. Only takes effect when opened via the CDK Dialog service (DialogService.open), since it resizes the underlying overlay pane.' },
    { name: 'dialogId',    type: 'string | undefined', default: 'undefined', description: 'Stable id (unique per dialog *type*, not per instance) used to remember the maximized state in localStorage across opens and page reloads. Without it, maximize still works but always starts restored.' },
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

  openMaximizableDemo(): void {
    this.dialogService.open(MaximizableDialogDemoComponent, {
      width: '480px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
}
