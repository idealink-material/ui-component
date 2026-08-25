import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type InputGroupSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'p-input-group',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class CuiInputGroupComponent {
  /** Matches p-input/p-select's `size`, so the group's own height (used by addons) stays in sync with its field. */
  readonly size = input<InputGroupSize>('md');

  readonly hostClass = computed(() => `p-input-group p-input-group--${this.size()}`);
}
