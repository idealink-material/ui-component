import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'p-carousel-dots',
  standalone: true,
  templateUrl: './carousel-dots.component.html',
  styleUrl: './carousel-dots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-carousel-dots',
    role: 'tablist',
  },
})
export class CuiCarouselDotsComponent {
  readonly count = input.required<number>();
  readonly activeIndex = model<number>(0);

  readonly indices = computed(() => Array.from({ length: this.count() }, (_, i) => i));

  select(i: number): void {
    this.activeIndex.set(i);
  }
}
