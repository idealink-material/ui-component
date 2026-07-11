import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-panel-footer',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './panel-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PPanelFooterComponent {}
