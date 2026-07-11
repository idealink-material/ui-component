import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  optional?: boolean;
  disabled?: boolean;
}

export type StepperOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'p-stepper',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"p-stepper p-stepper--" + orientation()' },
})
export class CuiStepperComponent {
  readonly steps       = input<StepItem[]>([]);
  readonly activeIndex = input<number>(0);
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly linear      = input<boolean>(false);

  readonly stepChange = output<number>();

  isClickable(index: number): boolean {
    if (this.steps()[index]?.disabled) return false;
    if (!this.linear()) return true;
    return index <= this.activeIndex() || this.steps().slice(0, index).every(s => s.completed);
  }

  select(index: number): void {
    if (!this.isClickable(index)) return;
    this.stepChange.emit(index);
  }
}
