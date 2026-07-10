import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-card-footer',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './card-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PCardFooterComponent {}
