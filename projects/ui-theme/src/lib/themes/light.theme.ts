import { ThemeDefinition } from '../types/theme.types';

export const lightTheme: ThemeDefinition = {
  name: 'light',
  label: 'Light',
  isDark: false,
  palette: {
    'cui-is-dark': '0',

    'cui-font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    'cui-font-family-heading': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    // Primary — Teal
    'mat-sys-primary': '#0d9488',
    'mat-sys-on-primary': '#ffffff',
    'mat-sys-primary-container': '#ccfbf1',
    'mat-sys-on-primary-container': '#134e4a',

    // Secondary — Violet
    'mat-sys-secondary': '#7c3aed',
    'mat-sys-on-secondary': '#ffffff',
    'mat-sys-secondary-container': '#ede9fe',
    'mat-sys-on-secondary-container': '#2e1065',

    // Tertiary — Cyan
    'mat-sys-tertiary': '#0891b2',
    'mat-sys-on-tertiary': '#ffffff',
    'mat-sys-tertiary-container': '#cffafe',
    'mat-sys-on-tertiary-container': '#164e63',

    // Error / Danger
    'mat-sys-error': '#ef4444',
    'mat-sys-on-error': '#ffffff',
    'mat-sys-error-container': '#fee2e2',
    'mat-sys-on-error-container': '#dc2626',

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
    'mat-sys-background': '#f3f4f6',
    'mat-sys-on-background': '#111827',

    'mat-sys-surface': '#ffffff',
    'mat-sys-on-surface': '#111827',
    'mat-sys-surface-variant': '#f1f5f9',
    'mat-sys-on-surface-variant': '#6b7280',
    'mat-sys-surface-container-lowest': '#ffffff',
    'mat-sys-surface-container-low': '#f8fafc',
    'mat-sys-surface-container': '#f1f5f9',
    'mat-sys-surface-container-high': '#e2e8f0',
    'mat-sys-surface-container-highest': '#cbd5e1',

    'mat-sys-outline': '#d1d5db',
    'mat-sys-outline-variant': '#e5e7eb',

    // Sidebar
    'cui-sidebar-bg': '#1e293b',
    'cui-sidebar-text': '#cbd5e1',
    'cui-sidebar-active-bg': '#0d9488',
    'cui-sidebar-active-text': '#ffffff',
    'cui-sidebar-hover-bg': '#334155',
    'cui-sidebar-border': '#334155',

    // Topbar
    'cui-topbar-bg': '#ffffff',
    'cui-topbar-text': '#0f172a',
    'cui-topbar-border': '#e2e8f0',

    // Card
    'cui-card-bg': '#ffffff',
    'cui-card-border': '#e2e8f0',

    // Radius
    'cui-radius-sm': '6px',
    'cui-radius-md': '8px',
    'cui-radius-lg': '12px',
    'cui-radius-xl': '16px',
    'cui-radius-pill': '9999px',

    // Shadows
    'cui-shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    'cui-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    'cui-shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    'cui-shadow-card': '0 4px 20px rgb(0 0 0 / 0.06)',
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
