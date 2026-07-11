import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CuiButtonComponent, CuiConfirmService } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-confirm-dialog-doc',
  imports: [CuiButtonComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './confirm-dialog-doc.component.html',
  styleUrl: './confirm-dialog-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogDocComponent {
  private readonly confirmService = inject(CuiConfirmService);

  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'confirm(options: ConfirmOptions)', type: 'Promise<boolean>', default: '—', description: 'Opens the confirm dialog via CDK Dialog and resolves true/false with the user\'s choice. Injected as CuiConfirmService.' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'ConfirmOptions',
      fields: [
        { name: 'title',       type: 'string | undefined', description: "Dialog title. Defaults to 'Confirm'." },
        { name: 'message',     type: 'string',             description: 'Body text.' },
        { name: 'acceptLabel', type: 'string | undefined', description: "Confirm button label. Defaults to 'Confirm'." },
        { name: 'rejectLabel', type: 'string | undefined', description: "Cancel button label. Defaults to 'Cancel'." },
        { name: 'severity',    type: `'info' | 'warning' | 'error' | undefined`, description: "'error' colors the confirm button as a destructive action." },
      ],
    },
  ];

  readonly lastResult = signal<string>('');

  async confirmClose(): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Close Case',
      message: 'Are you sure you want to close this case? This action cannot be undone.',
      acceptLabel: 'Close Case',
      rejectLabel: 'Cancel',
      severity: 'error',
    });
    this.lastResult.set(confirmed ? 'confirmed' : 'cancelled');
  }
}
