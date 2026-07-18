import {
  ChangeDetectionStrategy, Component, effect, inject, input, output, signal,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiButtonComponent } from '../../atoms/button/button.component';

const MAXIMIZED_STORAGE_PREFIX = 'cui-dialog-maximized:';

/**
 * Shell component that wraps a dialog's content with a consistent
 * header (title + optional maximize/restore + close button), scrollable
 * body, and footer (action buttons).
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
 *
 * ## Maximize / restore
 * Set `[maximizable]="true"` to show a maximize/restore toggle next to the
 * close button. Pass a stable `[dialogId]` (unique per dialog *type*, not
 * per instance) to have the maximized state remembered in `localStorage` and
 * restored the next time that dialog is opened — even after a page reload.
 * Without `dialogId`, maximize still works but resets every time the dialog
 * is reopened.
 * ```html
 * <p-dialog-container title="Importer History" [maximizable]="true" dialogId="importer-history">
 *   ...
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
  readonly maximizable = input<boolean>(false);
  /** Stable id used to remember the maximized state in localStorage across dialog opens/reloads. */
  readonly dialogId    = input<string | undefined>(undefined);

  readonly closed = output<void>();

  readonly maximized = signal(false);

  private restoreSize: { width?: string | number; maxWidth?: string | number; maxHeight?: string | number } = {};
  private hasAppliedStoredState = false;

  constructor() {
    effect(() => {
      const id = this.dialogId();
      if (this.hasAppliedStoredState || !id || !this.maximizable()) return;
      this.hasAppliedStoredState = true;

      this.restoreSize = {
        width: this.dialogRef?.config.width,
        maxWidth: this.dialogRef?.config.maxWidth,
        maxHeight: this.dialogRef?.config.maxHeight,
      };

      if (this.readStoredMaximized(id)) {
        this.maximized.set(true);
        this.applySize(true);
      }
    });
  }

  toggleMaximize(): void {
    if (!this.restoreSize.width && !this.maximized()) {
      this.restoreSize = {
        width: this.dialogRef?.config.width,
        maxWidth: this.dialogRef?.config.maxWidth,
        maxHeight: this.dialogRef?.config.maxHeight,
      };
    }

    const next = !this.maximized();
    this.maximized.set(next);
    this.applySize(next);

    const id = this.dialogId();
    if (id) this.writeStoredMaximized(id, next);
  }

  close(): void {
    this.closed.emit();
    this.dialogRef?.close();
  }

  private applySize(maximize: boolean): void {
    const overlayRef = this.dialogRef?.overlayRef;
    if (!overlayRef) return;
    overlayRef.updateSize(
      maximize
        ? { width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }
        : { width: this.restoreSize.width, height: 'auto', maxWidth: this.restoreSize.maxWidth, maxHeight: this.restoreSize.maxHeight },
    );

  }

  private readStoredMaximized(id: string): boolean {
    try {
      return localStorage.getItem(MAXIMIZED_STORAGE_PREFIX + id) === '1';
    } catch {
      return false;
    }
  }

  private writeStoredMaximized(id: string, maximized: boolean): void {
    try {
      localStorage.setItem(MAXIMIZED_STORAGE_PREFIX + id, maximized ? '1' : '0');
    } catch {
      // Storage unavailable (SSR, private browsing quota, etc.) — maximize still works, just isn't remembered.
    }
  }
}
