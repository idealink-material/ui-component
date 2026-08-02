import { ThemeDefinition } from '../types/theme.types';

export const bankingTheme: ThemeDefinition = {
  name: 'banking',
  label: 'Banking',
  isDark: false,
  palette: {
    'cui-is-dark': '0',

    'cui-font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    'cui-font-family-heading': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    // Primary — Deep Navy
    'mat-sys-primary': '#1e3a5f',
    'mat-sys-on-primary': '#ffffff',
    'mat-sys-primary-container': '#dbeafe',
    'mat-sys-on-primary-container': '#1e3a5f',

    // Secondary — Gold
    'mat-sys-secondary': '#b45309',
    'mat-sys-on-secondary': '#ffffff',
    'mat-sys-secondary-container': '#fef3c7',
    'mat-sys-on-secondary-container': '#78350f',

    // Tertiary — Steel Blue
    'mat-sys-tertiary': '#1d4ed8',
    'mat-sys-on-tertiary': '#ffffff',
    'mat-sys-tertiary-container': '#dbeafe',
    'mat-sys-on-tertiary-container': '#1e3a8a',

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

    // Background / Surface
    'mat-sys-background': '#f0f4f8',
    'mat-sys-on-background': '#0d1b2a',

    'mat-sys-surface': '#ffffff',
    'mat-sys-on-surface': '#0d1b2a',
    'mat-sys-surface-variant': '#e8edf2',
    'mat-sys-on-surface-variant': '#3d5166',
    'mat-sys-surface-container-lowest': '#ffffff',
    'mat-sys-surface-container-low': '#f0f4f8',
    'mat-sys-surface-container': '#e8edf2',
    'mat-sys-surface-container-high': '#dce3eb',
    'mat-sys-surface-container-highest': '#cdd7e0',

    'mat-sys-outline': '#7a96ad',
    'mat-sys-outline-variant': '#cdd7e0',

    // Sidebar — dark navy with gold active state
    'cui-sidebar-bg': '#0d1b2a',
    'cui-sidebar-text': '#a3bdd1',
    'cui-sidebar-active-bg': '#b45309',
    'cui-sidebar-active-text': '#ffffff',
    'cui-sidebar-hover-bg': '#1e3a5f',
    'cui-sidebar-border': '#1e3a5f',

    // Topbar
    'cui-topbar-bg': '#1e3a5f',
    'cui-topbar-text': '#ffffff',
    'cui-topbar-border': '#2d5282',

    // Card
    'cui-card-bg': '#ffffff',
    'cui-card-border': '#dce3eb',

    // Radius — tighter radius, more formal look
    'cui-radius-sm': '2px',
    'cui-radius-md': '4px',
    'cui-radius-lg': '6px',
    'cui-radius-xl': '8px',
    'cui-radius-pill': '9999px',

    // Shadows
    'cui-shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.08)',
    'cui-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.08)',
    'cui-shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.08)',
    'cui-shadow-card': '0 4px 20px rgb(0 0 0 / 0.08)',
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
