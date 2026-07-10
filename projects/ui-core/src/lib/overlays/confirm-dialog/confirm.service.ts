import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';
import { CuiConfirmDialogComponent, ConfirmOptions } from './confirm-dialog.component';

export type { ConfirmOptions };

/**
 * Self-contained confirm() helper built directly on CDK Dialog — does not
 * depend on ui-utils's DialogService, since ui-core must not depend on ui-utils.
 */
@Injectable({ providedIn: 'root' })
export class CuiConfirmService {
  private readonly dialog = inject(Dialog);

  confirm(options: ConfirmOptions): Promise<boolean> {
    const ref = this.dialog.open<boolean, ConfirmOptions>(CuiConfirmDialogComponent, {
      data: options,
      width: '420px',
      maxWidth: '90vw',
      panelClass: 'p-confirm-dialog-panel',
    });
    return firstValueFrom(ref.closed).then(result => !!result);
  }
}
