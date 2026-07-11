import {
  ChangeDetectionStrategy, Component, input, viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { CuiMenuItem } from './menu-item.type';

@Component({
  selector: 'p-menu',
  standalone: true,
  imports: [NgTemplateOutlet, MatMenuModule, MatDividerModule, CuiIconComponent],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiMenuComponent {
  readonly items = input<CuiMenuItem[]>([]);

  /** The underlying MatMenu — bind a trigger to it via [matMenuTriggerFor]="menu.menu()". */
  readonly menu = viewChild.required<MatMenu>('rootMenu');

  invoke(item: CuiMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
