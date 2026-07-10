import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CuiIconComponent } from '@votha-sok/ui-icons';
import { CuiMenuItem } from '../menu/menu-item.type';

@Component({
  selector: 'p-panel-menu',
  standalone: true,
  imports: [NgTemplateOutlet, CuiIconComponent],
  templateUrl: './panel-menu.component.html',
  styleUrl: './panel-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiPanelMenuComponent {
  readonly items = input<CuiMenuItem[]>([]);

  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggle(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  invoke(item: CuiMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
