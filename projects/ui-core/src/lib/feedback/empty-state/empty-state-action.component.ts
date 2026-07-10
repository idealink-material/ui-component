import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-empty-state-action',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents;' },
})
export class PEmptyStateActionComponent {}
