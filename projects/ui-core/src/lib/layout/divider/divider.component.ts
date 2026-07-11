import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerType = 'solid' | 'dashed' | 'dotted';
export type DividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'p-divider',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': 'orientation()',
  },
})
export class CuiDividerComponent {
  readonly orientation = input<DividerOrientation>('horizontal');
  readonly type        = input<DividerType>('solid');
  /** Where the (optional) projected content sits along the line. Defaults to 'center' for horizontal, 'top' for vertical. */
  readonly align       = input<DividerAlign | null>(null);

  readonly resolvedAlign = computed<DividerAlign>(() =>
    this.align() ?? (this.orientation() === 'vertical' ? 'top' : 'center')
  );

  readonly hostClass = computed(() => [
    'p-divider',
    `p-divider--${this.orientation()}`,
    `p-divider--${this.type()}`,
    `p-divider--align-${this.resolvedAlign()}`,
  ].join(' '));
}
