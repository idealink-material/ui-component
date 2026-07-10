import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-data-table-actions',
  standalone: true,
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: flex; align-items: center; gap: 8px;' },
})
export class PDataTableActionsComponent {}
