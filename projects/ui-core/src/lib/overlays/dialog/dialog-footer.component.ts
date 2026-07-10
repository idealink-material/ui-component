import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-dialog-footer',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './dialog-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDialogFooterComponent {}
