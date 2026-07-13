import { ThemeDefinition } from '../types/theme.types';

export const darkTheme: ThemeDefinition = {
  name: 'dark',
  label: 'Dark',
  isDark: true,
  palette: {
    'cui-is-dark': '1',

    'cui-font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    'cui-font-family-heading': "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    // Primary — Teal (lighter for dark surfaces)
    'mat-sys-primary': '#2dd4bf',
    'mat-sys-on-primary': '#134e4a',
    'mat-sys-primary-container': '#0f766e',
    'mat-sys-on-primary-container': '#ccfbf1',

    // Secondary — Violet
    'mat-sys-secondary': '#a78bfa',
    'mat-sys-on-secondary': '#2e1065',
    'mat-sys-secondary-container': '#5b21b6',
    'mat-sys-on-secondary-container': '#ede9fe',

    // Tertiary — Cyan
    'mat-sys-tertiary': '#22d3ee',
    'mat-sys-on-tertiary': '#164e63',
    'mat-sys-tertiary-container': '#0e7490',
    'mat-sys-on-tertiary-container': '#cffafe',

    // Error
    'mat-sys-error': '#f87171',
    'mat-sys-on-error': '#7f1d1d',
    'mat-sys-error-container': '#991b1b',
    'mat-sys-on-error-container': '#fee2e2',

    // Status — Success / Warning / Info
    'mat-sys-success': '#4ade80',
    'mat-sys-on-success': '#052e16',
    'mat-sys-success-container': '#166534',
    'mat-sys-on-success-container': '#dcfce7',

    'mat-sys-warning': '#fbbf24',
    'mat-sys-on-warning': '#451a03',
    'mat-sys-warning-container': '#92400e',
    'mat-sys-on-warning-container': '#fef3c7',

    'mat-sys-info': '#60a5fa',
    'mat-sys-on-info': '#1e3a8a',
    'mat-sys-info-container': '#1e40af',
    'mat-sys-on-info-container': '#dbeafe',

    // Background / Surface
    'mat-sys-background': '#0f172a',
    'mat-sys-on-background': '#f1f5f9',

    'mat-sys-surface': '#1e293b',
    'mat-sys-on-surface': '#f1f5f9',
    'mat-sys-surface-variant': '#1e293b',
    'mat-sys-on-surface-variant': '#94a3b8',
    'mat-sys-surface-container-lowest': '#0f172a',
    'mat-sys-surface-container-low': '#1e293b',
    'mat-sys-surface-container': '#263348',
    'mat-sys-surface-container-high': '#2d3d56',
    'mat-sys-surface-container-highest': '#334155',

    'mat-sys-outline': '#475569',
    'mat-sys-outline-variant': '#334155',

    // Sidebar
    'cui-sidebar-bg': '#0f172a',
    'cui-sidebar-text': '#94a3b8',
    'cui-sidebar-active-bg': '#2dd4bf',
    'cui-sidebar-active-text': '#1e1b4b',
    'cui-sidebar-hover-bg': '#1e293b',
    'cui-sidebar-border': '#1e293b',

    // Topbar
    'cui-topbar-bg': '#1e293b',
    'cui-topbar-text': '#f1f5f9',
    'cui-topbar-border': '#334155',

    // Card
    'cui-card-bg': '#1e293b',
    'cui-card-border': '#334155',

    // Radius
    'cui-radius-sm': '6px',
    'cui-radius-md': '8px',
    'cui-radius-lg': '12px',
    'cui-radius-xl': '16px',
    'cui-radius-pill': '9999px',

    // Shadows
    'cui-shadow-sm': '0 1px 3px 0 rgb(0 0 0 / 0.4)',
    'cui-shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    'cui-shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4)',
    'cui-shadow-card': '0 4px 20px rgb(0 0 0 / 0.3)',

    // Auth flow — fixed indigo brand, independent of the active dashboard theme
    'cui-auth-primary': '#4f46e5',
    'cui-auth-primary-hover': '#4338ca',
    'cui-auth-on-primary': '#ffffff',
    'cui-auth-illustration-bg': 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  },
};
