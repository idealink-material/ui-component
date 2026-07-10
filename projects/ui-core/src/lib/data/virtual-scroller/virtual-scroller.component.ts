import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

export interface VirtualScrollerItemContext<T> {
  $implicit: T;
  index: number;
}

@Component({
  selector: 'p-virtual-scroller',
  standalone: true,
  imports: [ScrollingModule, NgTemplateOutlet],
  templateUrl: './virtual-scroller.component.html',
  styleUrl: './virtual-scroller.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiVirtualScrollerComponent<T> {
  readonly items       = input<T[]>([]);
  readonly itemSize    = input<number>(40);
  readonly height      = input<string>('400px');
  /** Template rendered per row. Context: { $implicit: item, index }. */
  readonly itemTemplate = input<TemplateRef<VirtualScrollerItemContext<T>> | null>(null);
}
