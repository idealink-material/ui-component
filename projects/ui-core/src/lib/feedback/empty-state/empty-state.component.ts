import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CuiIconComponent } from '@votha-sok/ui-icons';

@Component({
  selector: 'p-empty-state',
  standalone: true,
  imports: [CuiIconComponent],
  template: `
    <div class="p-empty flex flex-col items-center gap-3 py-12 px-6 text-center">
      @if (icon()) {
        <div class="p-empty__icon-wrap">
          <cui-icon [name]="icon()!" size="xl"
            color="var(--mat-sys-on-surface-variant)" style="opacity:0.4;" />
        </div>
      }
      <div class="flex flex-col gap-1">
        <p class="p-empty__title font-semibold text-base"
          style="color:var(--mat-sys-on-surface)">{{ title() }}</p>
        @if (description()) {
          <p class="p-empty__description text-sm"
            style="color:var(--mat-sys-on-surface-variant)">{{ description() }}</p>
        }
      </div>
      <!-- Action slot — consumer wraps a <p-button> in <p-empty-state-action> -->
      <ng-content select="p-empty-state-action" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiEmptyStateComponent {
  readonly icon        = input<string | null>('inbox');
  readonly title       = input<string>('No data');
  readonly description = input<string | null>(null);
}
