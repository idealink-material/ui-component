import {
  ChangeDetectionStrategy, Component, computed, input,
} from '@angular/core';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

@Component({
  selector: 'p-card',
  standalone: true,
  template: `
    <ng-content select="p-card-header" />
    <ng-content />
    <ng-content select="p-card-footer" />
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class CuiCardComponent {
  readonly variant   = input<CardVariant>('elevated');
  readonly padding   = input<boolean>(true);
  readonly hoverable = input<boolean>(false);
  readonly selected  = input<boolean>(false);
  readonly clickable = input<boolean>(false);

  readonly hostClass = computed(() => [
    'p-card',
    `p-card--${this.variant()}`,
    this.hoverable() ? 'p-card--hoverable' : '',
    this.selected()  ? 'p-card--selected'  : '',
    this.clickable() ? 'p-card--clickable' : '',
    this.padding()   ? 'p-card--padded'    : '',
  ].filter(Boolean).join(' '));
}
