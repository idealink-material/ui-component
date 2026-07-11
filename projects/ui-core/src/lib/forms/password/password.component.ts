import {
  ChangeDetectionStrategy, Component, computed, signal,
  forwardRef, input, model, output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CuiIconComponent } from '@idealink-material/ui-icons';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

function scorePassword(pw: string): PasswordStrength {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score >= 3) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}

@Component({
  selector: 'p-password',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CuiIconComponent],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiPasswordComponent),
    multi: true,
  }],
})
export class CuiPasswordComponent implements ControlValueAccessor {
  private static nextId = 0;
  readonly fieldId = `p-password-${++CuiPasswordComponent.nextId}`;

  readonly label       = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled    = input<boolean>(false);
  readonly required    = input<boolean>(false);
  readonly fullWidth   = input<boolean>(true);

  /** Shows an eye icon to reveal/hide the typed password. */
  readonly toggleMask  = input<boolean>(false);
  /** Shows a strength meter panel below the field. */
  readonly feedback    = input<boolean>(true);
  readonly promptLabel = input<string>('Enter a password');
  readonly weakLabel   = input<string>('Weak');
  readonly mediumLabel = input<string>('Medium');
  readonly strongLabel = input<string>('Strong');

  readonly value = model<string>('');
  readonly onInput = output<string>();

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  readonly revealed = signal(false);
  readonly focused  = signal(false);

  readonly inputType = computed(() => (this.toggleMask() && this.revealed()) ? 'text' : 'password');

  readonly strength = computed<PasswordStrength>(() => scorePassword(this.value()));

  readonly strengthLabel = computed(() => {
    switch (this.strength()) {
      case 'strong': return this.strongLabel();
      case 'medium': return this.mediumLabel();
      default:       return this.weakLabel();
    }
  });

  handleInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this._onChange(v);
    this.onInput.emit(v);
  }

  toggleReveal(): void { this.revealed.update((v) => !v); }

  handleFocus(): void { this.focused.set(true); }
  handleBlur(): void { this.focused.set(false); this._onTouched(); }

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(_: boolean): void { }
}
