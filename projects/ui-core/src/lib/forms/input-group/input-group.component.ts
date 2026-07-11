import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-input-group',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiInputGroupComponent {}
