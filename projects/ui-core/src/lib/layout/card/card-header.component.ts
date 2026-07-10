import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-card-header',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './card-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PCardHeaderComponent {}
