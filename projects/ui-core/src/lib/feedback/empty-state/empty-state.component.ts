import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

@Component({
  selector: 'p-empty-state',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiEmptyStateComponent {
  /**
   * Icon name for the built-in cui-icon. Set to null and project custom
   * content into the [icon] slot instead for a fully custom icon (e.g. a
   * hand-written <svg>).
   */
  readonly icon        = input<string | null>('inbox');
  readonly title       = input<string>('No data');
  readonly description = input<string | null>(null);
}
