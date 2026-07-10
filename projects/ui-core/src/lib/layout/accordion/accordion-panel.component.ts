import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'p-accordion-panel',
  standalone: true,
  imports: [MatExpansionModule],
  template: `
    <mat-expansion-panel
      [expanded]="expanded()"
      [disabled]="disabled()"
      (opened)="expanded.set(true)"
      (closed)="expanded.set(false)">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ title() }}</mat-panel-title>
        @if (description()) {
          <mat-panel-description>{{ description() }}</mat-panel-description>
        }
      </mat-expansion-panel-header>
      <ng-content />
    </mat-expansion-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiAccordionPanelComponent {
  readonly title       = input<string>('');
  readonly description = input<string | null>(null);
  readonly disabled    = input<boolean>(false);
  readonly expanded    = model<boolean>(false);
}
