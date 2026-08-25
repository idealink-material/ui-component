import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type InputGroupAddonVariant = 'default' | 'plain';

@Component({
  selector: 'p-input-group-addon',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group-addon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class CuiInputGroupAddonComponent {
  /** 'plain' drops the background/border, e.g. for an icon-only addon that should blend into the field. */
  readonly variant = input<InputGroupAddonVariant>('default');

  readonly hostClass = computed(() =>
    `p-input-group-addon p-input-group-addon--${this.variant()}`
  );
}
