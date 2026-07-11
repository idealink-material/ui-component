import {
  ChangeDetectionStrategy, Component, inject,
} from '@angular/core';
import { ToastService, ToastItem, ToastPosition } from '@idealink-material/ui-utils';
import { CuiIconComponent } from '@idealink-material/ui-icons';

const TOAST_ICONS: Record<string, string> = {
  success: 'check_circle',
  error:   'error',
  warning: 'warning',
  info:    'info',
};

@Component({
  selector: 'p-toast-outlet',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './toast-outlet.component.html',
  styleUrl: './toast-outlet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiToastOutletComponent {
  readonly toastService = inject(ToastService);

  /** Group toasts by position so we can render separate stacks. */
  readonly positions: ToastPosition[] = [
    'top-right', 'top-left', 'top-center',
    'bottom-right', 'bottom-left', 'bottom-center',
  ];

  toastsForPosition(pos: ToastPosition): ToastItem[] {
    return this.toastService.toasts().filter(t => t.position === pos);
  }

  iconFor(level: string): string {
    return TOAST_ICONS[level] ?? 'info';
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
