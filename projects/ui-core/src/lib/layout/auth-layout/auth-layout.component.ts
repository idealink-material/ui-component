import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Split two-panel card for the auth flow (login / forgot-password / verify /
 * set-password): form content on the left, an illustration slot on the right
 * over the fixed indigo brand gradient (--cui-auth-illustration-bg).
 */
@Component({
  selector: 'p-auth-layout',
  standalone: true,
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-auth-layout' },
})
export class CuiAuthLayoutComponent {}
