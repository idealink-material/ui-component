import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

@Component({
  selector: 'p-panel',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiPanelComponent {
  readonly header     = input<string>('');
  /** Shows a chevron in the header that collapses/expands the content. */
  readonly toggleable = input<boolean>(false);
  readonly collapsed  = model<boolean>(false);

  readonly onToggle = output<boolean>();

  toggle(): void {
    if (!this.toggleable()) return;
    this.collapsed.update((v) => !v);
    this.onToggle.emit(this.collapsed());
  }
}
