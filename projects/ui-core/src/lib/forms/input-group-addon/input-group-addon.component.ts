import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-input-group-addon',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group-addon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiInputGroupAddonComponent {}
