import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiAvatarComponent } from '../../atoms/avatar/avatar.component';
import { CuiMenuComponent } from '../menu/menu.component';
import { CuiMenuItem } from '../menu/menu-item.type';
import { CuiTopNavLink } from './top-nav-link.type';

/**
 * White app-shell top bar: a logo slot on the left, a horizontal link row,
 * and an avatar + name trigger on the right that opens a p-menu dropdown.
 */
@Component({
  selector: 'p-top-nav',
  standalone: true,
  imports: [MatMenuModule, CuiIconComponent, CuiAvatarComponent, CuiMenuComponent],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTopNavComponent {
  readonly links = input<CuiTopNavLink[]>([]);
  readonly userName = input<string | null>(null);
  readonly userAvatarSrc = input<string | null>(null);
  readonly menuItems = input<CuiMenuItem[]>([]);

  readonly linkClick = output<CuiTopNavLink>();

  onLinkClick(link: CuiTopNavLink): void {
    if (link.disabled) return;
    this.linkClick.emit(link);
  }
}
