import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CuiIconComponent } from '@votha-sok/ui-icons';
import { CuiMenuItem } from '../menu/menu-item.type';

@Component({
  selector: 'p-menubar',
  standalone: true,
  imports: [NgTemplateOutlet, MatMenuModule, MatDividerModule, CuiIconComponent],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiMenubarComponent {
  readonly items = input<CuiMenuItem[]>([]);

  invoke(item: CuiMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
