import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CuiIconComponent } from '@votha-sok/ui-icons';

export interface SpeedDialItem {
  id: string;
  icon: string;
  label?: string;
  command?: () => void;
}

export type SpeedDialDirection = 'up' | 'down';

@Component({
  selector: 'p-speed-dial',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"p-speed-dial p-speed-dial--" + direction() + (open() ? " p-speed-dial--open" : "")' },
})
export class CuiSpeedDialComponent {
  readonly items     = input<SpeedDialItem[]>([]);
  readonly icon      = input<string>('add');
  readonly direction = input<SpeedDialDirection>('up');

  readonly open = signal(false);

  toggle(): void {
    this.open.update(v => !v);
  }

  invoke(item: SpeedDialItem): void {
    item.command?.();
    this.open.set(false);
  }
}
