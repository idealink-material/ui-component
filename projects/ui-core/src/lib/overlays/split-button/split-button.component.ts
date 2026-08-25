import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CuiButtonComponent, ButtonVariant, ButtonColor } from '../../atoms/button/button.component';
import { CuiMenuComponent } from '../../navigation/menu/menu.component';
import { CuiMenuItem } from '../../navigation/menu/menu-item.type';

@Component({
  selector: 'p-split-button',
  standalone: true,
  imports: [MatMenuModule, CuiButtonComponent, CuiMenuComponent],
  templateUrl: './split-button.component.html',
  styleUrl: './split-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiSplitButtonComponent {
  readonly label    = input<string>('');
  readonly icon     = input<string>('');
  readonly items    = input<CuiMenuItem[]>([]);
  readonly variant  = input<ButtonVariant>('filled');
  readonly color    = input<ButtonColor>('primary');
  readonly disabled = input<boolean>(false);

  readonly action = output<void>();
}
