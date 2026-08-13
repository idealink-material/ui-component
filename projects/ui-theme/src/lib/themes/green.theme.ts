import { ThemeDefinition } from '../types/theme.types';

export const greenTheme: ThemeDefinition = {
  name: 'green',
  label: 'Green',
  isDark: false,
  palette: {
    'cui-is-dark': '0',

    'cui-font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    'cui-font-family-heading': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    // Primary — Emerald
    'mat-sys-primary': '#059669',
    'mat-sys-on-primary': '#ffffff',
    'mat-sys-primary-container': '#d1fae5',
    'mat-sys-on-primary-container': '#064e3b',

    // Secondary — Teal
    'mat-sys-secondary': '#0f766e',
    'mat-sys-on-secondary': '#ffffff',
    'mat-sys-secondary-container': '#ccfbf1',
    'mat-sys-on-secondary-container': '#134e4a',

    // Tertiary — Lime
    'mat-sys-tertiary': '#65a30d',
    'mat-sys-on-tertiary': '#ffffff',
    'mat-sys-tertiary-container': '#ecfccb',
    'mat-sys-on-tertiary-container': '#365314',

    // Error
    'mat-sys-error': '#dc2626',
    'mat-sys-on-error': '#ffffff',
    'mat-sys-error-container': '#fee2e2',
    'mat-sys-on-error-container': '#7f1d1d',

    // Status — Success / Warning / Info
    'mat-sys-success': '#22c55e',
    'mat-sys-on-success': '#ffffff',
    'mat-sys-success-container': '#dcfce7',
    'mat-sys-on-success-container': '#166534',

    'mat-sys-warning': '#d97706',
    'mat-sys-on-warning': '#ffffff',
    'mat-sys-warning-container': '#fef3c7',
    'mat-sys-on-warning-container': '#92400e',

    'mat-sys-info': '#3b82f6',
    'mat-sys-on-info': '#ffffff',
    'mat-sys-info-container': '#dbeafe',
    'mat-sys-on-info-container': '#1e40af',

    // Scheduler / calendar event block colors
    'cui-event-blue': '#2563eb',
    'cui-event-blue-bg': '#dbeafe',
    'cui-event-red': '#dc2626',
    'cui-event-red-bg': '#fee2e2',
    'cui-event-green': '#059669',
    'cui-event-green-bg': '#d1fae5',
    'cui-event-purple': '#7c3aed',
    'cui-event-purple-bg': '#ede9fe',
    'cui-event-orange': '#ea580c',
    'cui-event-orange-bg': '#ffedd5',
    'cui-event-neutral': '#166534',
    'cui-event-neutral-bg': '#dcfce7',

    // Background / Surface
    'mat-sys-background': '#f0fdf4',
    'mat-sys-on-background': '#052e16',

    'mat-sys-surface': '#ffffff',
    'mat-sys-on-surface': '#052e16',
    'mat-sys-surface-variant': '#dcfce7',
    'mat-sys-on-surface-variant': '#166534',
    'mat-sys-surface-container-lowest': '#ffffff',
    'mat-sys-surface-container-low': '#f0fdf4',
    'mat-sys-surface-container': '#dcfce7',
    'mat-sys-surface-container-high': '#bbf7d0',
    'mat-sys-surface-container-highest': '#86efac',

    'mat-sys-outline': '#4ade80',
    'mat-sys-outline-variant': '#bbf7d0',

    // Sidebar — deep green
    'cui-sidebar-bg': '#052e16',
    'cui-sidebar-text': '#86efac',
    'cui-sidebar-active-bg': '#059669',
    'cui-sidebar-active-text': '#ffffff',
    'cui-sidebar-hover-bg': '#064e3b',
    'cui-sidebar-border': '#064e3b',

    // Topbar
    'cui-topbar-bg': '#059669',
    'cui-topbar-text': '#ffffff',
    'cui-topbar-border': '#047857',

    // Card
    'cui-card-bg': '#ffffff',
    'cui-card-border': '#bbf7d0',

    // Radius
    'cui-radius-sm': '4px',
    'cui-radius-md': '8px',
    'cui-radius-lg': '12px',
    'cui-radius-xl': '16px',
    'cui-radius-pill': '9999px',

    // Shadows (green-tinted)
    'cui-shadow-sm': '0 1px 3px 0 rgb(5 150 105 / 0.12)',
    'cui-shadow-md': '0 4px 6px -1px rgb(5 150 105 / 0.12)',
    'cui-shadow-lg': '0 10px 15px -3px rgb(5 150 105 / 0.12)',
    'cui-shadow-card': '0 4px 20px rgb(5 150 105 / 0.1)',
    'cui-shadow-color': 'rgb(0 0 0 / 0.25)',

    // Scrim
    'cui-scrim': 'rgb(0 0 0 / 0.45)',

    // Auth flow — fixed indigo brand, independent of the active dashboard theme
    'cui-auth-primary': '#4f46e5',
    'cui-auth-primary-hover': '#4338ca',
    'cui-auth-on-primary': '#ffffff',
    'cui-auth-illustration-bg': 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  },
};
