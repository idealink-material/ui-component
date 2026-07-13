import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

@Component({
  selector: 'p-stat-card',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-stat-card' },
})
export class CuiStatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  /** Small icon button rendered top-right, e.g. 'bar_chart' or 'open_in_full'. Omit to hide the button. */
  readonly icon = input<string | null>(null);
  readonly iconLabel = input<string>('View details');

  readonly iconClick = output<void>();
}
