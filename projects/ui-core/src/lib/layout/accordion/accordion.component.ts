import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'p-accordion',
  standalone: true,
  imports: [MatExpansionModule],
  template: `
    <mat-accordion [multi]="multi()" class="p-accordion">
      <ng-content />
    </mat-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiAccordionComponent {
  /** Allow more than one panel to be expanded at once. */
  readonly multi = input<boolean>(false);
}
