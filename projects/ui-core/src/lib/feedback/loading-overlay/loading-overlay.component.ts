import {
  ChangeDetectionStrategy, Component, computed, inject, input,
} from '@angular/core';
import { LoadingService } from '@idealink-material/ui-utils';
import { CuiSpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
  selector: 'p-loading-overlay',
  standalone: true,
  imports: [CuiSpinnerComponent],
  template: `
    @if (visible()) {
      <div class="p-loading-overlay"
        role="status"
        [attr.aria-label]="label()"
        aria-live="polite">
        <div class="p-loading-overlay__backdrop"></div>
        <div class="p-loading-overlay__content">
          <p-spinner [size]="size()" />
          @if (label()) {
            <p class="p-loading-overlay__label">{{ label() }}</p>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiLoadingOverlayComponent {
  private readonly loadingService = inject(LoadingService);

  /**
   * Named loading scope to watch.
   * When omitted, watches the global loading scope.
   */
  readonly scope   = input<string | null>(null);
  readonly label   = input<string>('Loading…');
  readonly size    = input<'sm'|'md'|'lg'>('md');

  /** Override: force visible regardless of LoadingService. */
  readonly show    = input<boolean | null>(null);

  readonly visible = computed(() => {
    if (this.show() !== null) return this.show()!;
    const s = this.scope();
    return s
      ? this.loadingService.isScopeLoading(s)
      : this.loadingService.isLoading();
  });
}
