import {
  ChangeDetectionStrategy, Component, inject, input, output,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiButtonComponent } from '../../atoms/button/button.component';

/**
 * Shell component that wraps a dialog's content with a consistent
 * header (title + close button), scrollable body, and footer (action buttons).
 *
 * Used by DialogService internally, and also usable standalone when
 * composing custom dialog components.
 *
 * ## Usage inside a dialog component
 * ```html
 * <p-dialog-container title="Confirm Delete">
 *   <p>Are you sure you want to delete this record?</p>
 *   <p-dialog-footer>
 *     <p-button variant="text" (cuiClick)="close()">Cancel</p-button>
 *     <p-button color="error"  (cuiClick)="confirm()">Delete</p-button>
 *   </p-dialog-footer>
 * </p-dialog-container>
 * ```
 */
@Component({
  selector: 'p-dialog-container',
  standalone: true,
  imports: [CuiIconComponent, CuiButtonComponent],
  templateUrl: './dialog-container.component.html',
  styleUrl: './dialog-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiDialogContainerComponent {
  private readonly dialogRef = inject(DialogRef, { optional: true });

  readonly title       = input<string>('');
  readonly showClose   = input<boolean>(true);
  readonly dividers    = input<boolean>(true);

  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
    this.dialogRef?.close();
  }
}
