import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

import { CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent } from '@idealink-material/ui-core';

/**
 * Demo content opened via DialogService.open() for the "Maximize / restore"
 * doc example — maximize only resizes a real CDK overlay pane, so it can't
 * be shown with the inline `@if` + backdrop pattern used elsewhere on this page.
 */
@Component({
  selector: 'app-maximizable-dialog-demo',
  standalone: true,
  imports: [CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent],
  template: `
    <p-dialog-container title="Maximizable Dialog" [maximizable]="true" dialogId="doc-maximizable-demo">
      <p>Click the expand icon in the header to fill the viewport, or the same icon again to restore.</p>
      <p style="margin-top: 8px; color: var(--mat-sys-on-surface-variant); font-size: 13px;">
        Close and reopen this dialog (or reload the page) — it remembers whichever state you left it in.
      </p>
      <p-dialog-footer>
        <p-button variant="filled" (onClick)="dialogRef.close()">Done</p-button>
      </p-dialog-footer>
    </p-dialog-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaximizableDialogDemoComponent {
  readonly dialogRef = inject(DialogRef);
}
