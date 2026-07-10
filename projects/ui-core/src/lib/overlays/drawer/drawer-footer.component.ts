import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-drawer-footer',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './drawer-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDrawerFooterComponent {}
