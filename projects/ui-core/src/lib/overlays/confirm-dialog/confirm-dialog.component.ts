import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CuiDialogContainerComponent } from '../dialog/dialog-container.component';
import { PDialogFooterComponent } from '../dialog/dialog-footer.component';
import { CuiButtonComponent } from '../../atoms/button/button.component';

export interface ConfirmOptions {
  title?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  severity?: 'info' | 'warning' | 'error';
}

@Component({
  selector: 'p-confirm-dialog',
  standalone: true,
  imports: [CuiDialogContainerComponent, PDialogFooterComponent, CuiButtonComponent],
  template: `
    <p-dialog-container [title]="data.title ?? 'Confirm'">
      <p>{{ data.message }}</p>
      <p-dialog-footer>
        <p-button variant="text" (onClick)="reject()">{{ data.rejectLabel ?? 'Cancel' }}</p-button>
        <p-button variant="filled" [color]="data.severity === 'error' ? 'error' : 'primary'" (onClick)="accept()">
          {{ data.acceptLabel ?? 'Confirm' }}
        </p-button>
      </p-dialog-footer>
    </p-dialog-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiConfirmDialogComponent {
  protected readonly data = inject<ConfirmOptions>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef<boolean>);

  accept(): void { this.dialogRef.close(true); }
  reject(): void { this.dialogRef.close(false); }
}
