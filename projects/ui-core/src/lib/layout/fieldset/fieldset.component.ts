import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CuiIconComponent } from '@votha-sok/ui-icons';

@Component({
  selector: 'p-fieldset',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.p-fieldset--collapsed]': 'toggleable() && collapsed()',
  },
})
export class CuiFieldsetComponent {
  readonly legend     = input<string>('');
  /** Shows a chevron in the legend that collapses/expands the content. */
  readonly toggleable = input<boolean>(false);
  readonly collapsed  = model<boolean>(false);

  toggle(): void {
    if (this.toggleable()) this.collapsed.update((v) => !v);
  }
}
