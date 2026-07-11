import {
  Injectable,
  DOCUMENT,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { ThemeDefinition, ThemeName } from '../types/theme.types';

import { lightTheme } from '../themes/light.theme';
import { darkTheme } from '../themes/dark.theme';
import { bankingTheme } from '../themes/banking.theme';
import { corporateTheme } from '../themes/corporate.theme';
import { blueTheme } from '../themes/blue.theme';
import { greenTheme } from '../themes/green.theme';
import { purpleTheme } from '../themes/purple.theme';

/** localStorage key used to persist the selected theme across sessions. */
const STORAGE_KEY = 'cui-theme';

/** Default theme applied when no persisted preference exists. */
const DEFAULT_THEME: ThemeName = 'light';

/** The themes that ship with the framework. */
const BUILT_IN_THEMES: Record<string, ThemeDefinition> = {
  light: lightTheme,
  dark: darkTheme,
  banking: bankingTheme,
  corporate: corporateTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  // ── Theme registry ─────────────────────────────────────────────────────────
  // A signal (not a const) so consuming apps can register their own brand
  // palettes at runtime via registerTheme(), and availableThemes reacts.
  private readonly _themes = signal<Record<string, ThemeDefinition>>({
    ...BUILT_IN_THEMES,
  });

  // ── Private writable signal ────────────────────────────────────────────────
  private readonly _currentThemeName = signal<ThemeName>(
    this.resolveInitialTheme()
  );

  // ── Public read-only API ───────────────────────────────────────────────────

  /** The currently active theme name. */
  readonly currentThemeName = this._currentThemeName.asReadonly();

  /**
   * The full ThemeDefinition for the active theme, or undefined if the active
   * name refers to a custom theme that hasn't been registered yet (e.g. a
   * persisted name restored before the app calls registerTheme()).
   */
  readonly currentTheme = computed<ThemeDefinition | undefined>(
    () => this._themes()[this._currentThemeName()]
  );

  /** True when the active theme's palette is dark. */
  readonly isDarkMode = computed<boolean>(
    () => this.currentTheme()?.isDark ?? false
  );

  /** All registered theme definitions, for display in a switcher. */
  readonly availableThemes = computed<ThemeDefinition[]>(
    () => Object.values(this._themes())
  );

  // ── Constructor ────────────────────────────────────────────────────────────

  constructor() {
    // Apply the resolved initial theme immediately, synchronously.
    this.applyTheme(this._currentThemeName());

    // Whenever the current theme signal changes, re-apply CSS variables and
    // persist to localStorage. `effect()` runs after every signal write,
    // including the initial value, so we don't need a separate init call.
    effect(() => {
      const name = this._currentThemeName();
      this.applyTheme(name);
      this.persist(name);
    });
  }

  // ── Public methods ─────────────────────────────────────────────────────────

  /**
   * Register (or replace) a theme by name. Lets a consuming app supply its
   * own brand palette without forking this library:
   *
   * ```ts
   * themeService.registerTheme(myBrandTheme);
   * themeService.setTheme(myBrandTheme.name);
   * ```
   *
   * If the registered theme is already the active one (e.g. a persisted
   * custom theme being defined at startup), its CSS variables are applied
   * immediately.
   */
  registerTheme(theme: ThemeDefinition): void {
    this._themes.update((themes) => ({ ...themes, [theme.name]: theme }));
    if (theme.name === this._currentThemeName()) {
      this.applyTheme(theme.name);
    }
  }

  /**
   * Switch to any registered theme (built-in or app-registered).
   * No-ops if the theme is already active or hasn't been registered.
   */
  setTheme(name: ThemeName): void {
    if (name === this._currentThemeName()) return;
    if (!(name in this._themes())) return;
    this._currentThemeName.set(name);
  }

  /**
   * Toggle between the canonical light and dark themes.
   * If the current theme is already `dark`, switch to `light`.
   * If it's any light-based theme (light, blue, green, etc.), switch to `dark`.
   */
  toggleDarkMode(): void {
    const next: ThemeName = this.isDarkMode() ? 'light' : 'dark';
    this._currentThemeName.set(next);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Read localStorage for a previously persisted theme name.
   * Returns the stored value as-is (it may name an app-registered theme not
   * yet in the registry — applyTheme no-ops until it's registered, and
   * registerTheme() re-applies it). Falls back to DEFAULT_THEME if nothing
   * is stored.
   */
  private resolveInitialTheme(): ThemeName {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(
        STORAGE_KEY
      );
      if (stored) {
        return stored as ThemeName;
      }
    } catch {
      // localStorage is unavailable (SSR, private browsing restrictions, etc.)
    }
    return DEFAULT_THEME;
  }

  /**
   * Write all palette values as CSS custom properties on the document root
   * (`<html>`). Using the root element (not `<body>`) means the variables are
   * in scope for every overlay, portal, and CDK-rendered element — even those
   * rendered outside the Angular component tree.
   *
   * Also sets a `data-cui-theme` attribute so CSS can target theme-specific
   * styles via `[data-cui-theme="dark"] { ... }` selectors when needed.
   *
   * No-ops if the name refers to a theme that isn't registered yet.
   */
  private applyTheme(name: ThemeName): void {
    const theme = this._themes()[name];
    if (!theme) return;

    const root = this.document.documentElement;

    // Write every palette key as a CSS variable on :root
    for (const [key, value] of Object.entries(theme.palette)) {
      root.style.setProperty(`--${key}`, value);
    }

    // Set the data attribute for attribute-selector-based overrides
    root.setAttribute('data-cui-theme', name);

    // Also toggle a class for consumers who prefer class-based selectors
    root.classList.toggle('cui-dark', theme.isDark);
  }

  /**
   * Persist the selected theme to localStorage so it survives page refresh.
   * Silently no-ops if localStorage is unavailable.
   */
  private persist(name: ThemeName): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // no-op — SSR or storage restricted
    }
  }
}
