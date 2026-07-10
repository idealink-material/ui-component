import {
  ChangeDetectionStrategy, Component, computed,
  input, output, TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  /** Template ref for the tab body — consumers use *pTabContent directive. */
  content?: TemplateRef<unknown>;
}

export type TabsVariant = 'primary' | 'secondary';

@Component({
  selector: 'p-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, MatTabsModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"p-tabs p-tabs--" + variant()' },
})
export class CuiTabsComponent {
  readonly tabs        = input<TabItem[]>([]);
  readonly activeIndex = input<number>(0);
  readonly variant     = input<TabsVariant>('primary');
  readonly stretchTabs = input<boolean>(false);
  readonly animationDuration = input<string>('200ms');

  readonly tabChange = output<number>();

  onTabChange(index: number): void {
    this.tabChange.emit(index);
  }
}
