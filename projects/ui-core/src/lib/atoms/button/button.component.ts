import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral';
export type IconPosition = 'left' | 'right';
@Component({
  selector: 'p-button',
  standalone: true,
  imports: [MatRippleModule, CuiIconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-disabled]': 'disabled() || loading() ? "true" : null',
    '[attr.role]': '"button"',
    '[attr.tabindex]': 'disabled() || loading() ? "-1" : "0"',
    '(keydown.enter)': 'handleKeydown($event)',
    '(keydown.space)': 'handleKeydown($event)',
  },
})
export class CuiButtonComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // ── Inputs ─────────────────────────────────────────────────────────────────
  readonly variant = input<ButtonVariant>('filled');
  readonly size = input<ButtonSize>('md');
  readonly color = input<ButtonColor>('primary');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly icon = input<string>('');
  readonly iconPos = input<IconPosition>('left');
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  // ── Outputs ────────────────────────────────────────────────────────────────
  readonly onClick = output<MouseEvent>();

  // ── Derived ────────────────────────────────────────────────────────────────
  readonly hostClass = computed(() => {
    const parts = [
      'p-btn',
      `p-btn--${this.variant()}`,
      `p-btn--${this.size()}`,
      `p-btn--${this.color()}`,
    ];
    if (this.disabled() || this.loading()) parts.push('p-btn--disabled');
    if (this.loading()) parts.push('p-btn--loading');
    if (this.fullWidth()) parts.push('p-btn--full');
    return parts.join(' ');
  });

  readonly iconSize = computed(() =>
    this.size() === 'sm'
      ? ('xs' as const)
      : this.size() === 'lg'
        ? ('md' as const)
        : ('sm' as const),
  );

  handleClick(e: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      e.stopPropagation();
      return;
    }
    this.onClick.emit(e);

    // The host renders as a custom `<p-button>` element, not a native <button>,
    // so `type="submit"/"reset"` has no built-in browser behavior — trigger it manually.
    const form = this.elementRef.nativeElement.closest('form');
    if (this.type() === 'submit') {
      form?.requestSubmit();
    } else if (this.type() === 'reset') {
      form?.reset();
    }
  }

  handleKeydown(e: Event): void {
    if (this.disabled() || this.loading()) return;
    e.preventDefault();
    (e.target as HTMLElement).click();
  }
}
