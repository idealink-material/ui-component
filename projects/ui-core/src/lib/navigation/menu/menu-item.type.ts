/**
 * A single item in a command-style menu (Menu, Menubar, ContextMenu, PanelMenu).
 * Distinct from ui-utils's router-oriented MenuItem — ui-core does not depend on ui-utils.
 */
export interface CuiMenuItem {
  id: string;
  label: string;
  icon?: string;
  command?: () => void;
  disabled?: boolean;
  /** Renders a divider in place of this item (label/command ignored). */
  separator?: boolean;
  /** Child items — renders this item as a submenu trigger. */
  children?: CuiMenuItem[];
}
