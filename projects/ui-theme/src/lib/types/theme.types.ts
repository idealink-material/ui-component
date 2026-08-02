/**
 * The theme names that ship with the framework.
 */
export type BuiltInThemeName =
  | 'light'
  | 'dark'
  | 'banking'
  | 'corporate'
  | 'blue'
  | 'green'
  | 'purple';

/**
 * Any theme name accepted by ThemeService. Consuming apps register their own
 * brand palettes via `ThemeService.registerTheme(...)`, so this allows any
 * string while `& {}` preserves editor autocomplete for the built-in names.
 */
export type ThemeName = BuiltInThemeName | (string & {});

/**
 * A palette maps every CSS custom property we override onto a concrete value.
 * Properties are keyed without the leading `--` so they can be used in both
 * typed TS objects and CSS-variable generation code without string munging.
 *
 * We override Material's --mat-sys-* tokens directly so that Material
 * components (mat-button, mat-card, etc.) are themed automatically — no
 * secondary mapping layer required.
 *
 * Property naming convention: mat-sys-* mirrors Material's M3 system tokens.
 * cui-* are framework-specific additions that have no Material equivalent
 * (sidebar background, topbar background, etc.).
 */
export interface ThemePalette {
  // ── M3 System Colour Roles ────────────────────────────────────────────────
  'mat-sys-primary': string;
  'mat-sys-on-primary': string;
  'mat-sys-primary-container': string;
  'mat-sys-on-primary-container': string;

  'mat-sys-secondary': string;
  'mat-sys-on-secondary': string;
  'mat-sys-secondary-container': string;
  'mat-sys-on-secondary-container': string;

  'mat-sys-tertiary': string;
  'mat-sys-on-tertiary': string;
  'mat-sys-tertiary-container': string;
  'mat-sys-on-tertiary-container': string;

  'mat-sys-error': string;
  'mat-sys-on-error': string;
  'mat-sys-error-container': string;
  'mat-sys-on-error-container': string;

  // ── Status roles (success / warning / info) ─────────────────────────────
  // No M3 equivalent, but named mat-sys-* to stay consistent with the other
  // semantic color roles above — components read them the same way.
  'mat-sys-success': string;
  'mat-sys-on-success': string;
  'mat-sys-success-container': string;
  'mat-sys-on-success-container': string;

  'mat-sys-warning': string;
  'mat-sys-on-warning': string;
  'mat-sys-warning-container': string;
  'mat-sys-on-warning-container': string;

  'mat-sys-info': string;
  'mat-sys-on-info': string;
  'mat-sys-info-container': string;
  'mat-sys-on-info-container': string;

  'mat-sys-background': string;
  'mat-sys-on-background': string;

  'mat-sys-surface': string;
  'mat-sys-on-surface': string;
  'mat-sys-surface-variant': string;
  'mat-sys-on-surface-variant': string;
  'mat-sys-surface-container-lowest': string;
  'mat-sys-surface-container-low': string;
  'mat-sys-surface-container': string;
  'mat-sys-surface-container-high': string;
  'mat-sys-surface-container-highest': string;

  'mat-sys-outline': string;
  'mat-sys-outline-variant': string;

  // ── Framework-specific tokens (no Material equivalent) ───────────────────
  /** Whether this palette is a dark-mode palette. Used by ThemeService. */
  'cui-is-dark': '0' | '1';

  /**
   * Font stacks. Body applies to all UI text; heading is used where a
   * distinct display face is wanted (defaults to the same value). The token
   * only selects WHICH family — the app is still responsible for loading the
   * actual font file (Google Fonts link, @font-face, etc.).
   */
  'cui-font-family': string;
  'cui-font-family-heading': string;

  /** Sidebar background — distinct from surface to allow richer branding */
  'cui-sidebar-bg': string;
  'cui-sidebar-text': string;
  'cui-sidebar-active-bg': string;
  'cui-sidebar-active-text': string;
  'cui-sidebar-hover-bg': string;
  'cui-sidebar-border': string;

  /** Topbar */
  'cui-topbar-bg': string;
  'cui-topbar-text': string;
  'cui-topbar-border': string;

  /** Card / content surface */
  'cui-card-bg': string;
  'cui-card-border': string;

  /** Global border radius scale */
  'cui-radius-sm': string;
  'cui-radius-md': string;
  'cui-radius-lg': string;
  'cui-radius-xl': string;
  /** Fully-rounded pill shape, e.g. status badges and carousel indicators */
  'cui-radius-pill': string;

  /** Shadow scale */
  'cui-shadow-sm': string;
  'cui-shadow-md': string;
  'cui-shadow-lg': string;
  /** Soft, wide shadow used by standalone cards (auth card, stat card) */
  'cui-shadow-card': string;
  /** Shadow tint composed into custom directional box-shadows (drag preview, sticky-edge) */
  'cui-shadow-color': string;

  /** Full-screen dimming overlay behind modals/drawers */
  'cui-scrim': string;

  /**
   * Fixed auth-flow brand accent (login / forgot-password / verify / set-password).
   * Intentionally independent of mat-sys-primary: the auth flow keeps its own
   * indigo identity regardless of which dashboard theme is active.
   */
  'cui-auth-primary': string;
  'cui-auth-primary-hover': string;
  'cui-auth-on-primary': string;
  /** Background (gradient) for the auth split-panel illustration side */
  'cui-auth-illustration-bg': string;
}

/**
 * A complete theme — its name + the full palette.
 */
export interface ThemeDefinition {
  name: ThemeName;
  label: string;          // human-readable label for UI switchers
  isDark: boolean;        // convenience flag — mirrors cui-is-dark
  palette: ThemePalette;
}
