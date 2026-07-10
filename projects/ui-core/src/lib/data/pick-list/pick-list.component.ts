import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { CuiButtonComponent } from '../../atoms/button/button.component';
import { CuiListboxComponent } from '../../forms/listbox/listbox.component';
import { SelectOption } from '../../forms/select/select.component';

@Component({
  selector: 'p-pick-list',
  standalone: true,
  imports: [CuiButtonComponent, CuiListboxComponent],
  templateUrl: './pick-list.component.html',
  styleUrl: './pick-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiPickListComponent<T = string> {
  readonly sourceLabel = input<string>('Available');
  readonly targetLabel = input<string>('Selected');
  readonly options     = input<SelectOption<T>[]>([]);

  /** Values currently in the target (right) list. */
  readonly value = model<T[]>([]);
  readonly cuiChange = output<T[]>();

  private readonly sourceHighlight = signal<readonly T[]>([]);
  private readonly targetHighlight = signal<readonly T[]>([]);

  readonly sourceOptions = computed(() => {
    const selected = new Set(this.value());
    return this.options().filter(o => !selected.has(o.value));
  });

  readonly targetOptions = computed(() => {
    const selected = new Set(this.value());
    return this.options().filter(o => selected.has(o.value));
  });

  onSourceHighlight(v: readonly T[]): void { this.sourceHighlight.set(v); }
  onTargetHighlight(v: readonly T[]): void { this.targetHighlight.set(v); }

  moveToTarget(): void {
    const moving = new Set(this.sourceHighlight());
    if (moving.size === 0) return;
    this.emit([...this.value(), ...this.sourceOptions().filter(o => moving.has(o.value)).map(o => o.value)]);
    this.sourceHighlight.set([]);
  }

  moveAllToTarget(): void {
    this.emit(this.options().map(o => o.value));
    this.sourceHighlight.set([]);
  }

  moveToSource(): void {
    const moving = new Set(this.targetHighlight());
    if (moving.size === 0) return;
    this.emit(this.value().filter(v => !moving.has(v)));
    this.targetHighlight.set([]);
  }

  moveAllToSource(): void {
    this.emit([]);
    this.targetHighlight.set([]);
  }

  private emit(v: T[]): void {
    this.value.set(v);
    this.cuiChange.emit(v);
  }
}
