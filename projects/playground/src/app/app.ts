import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { FRAMEWORK_VERSION } from '@idealink-material/ui-utils';
import { ThemeService } from '@idealink-material/ui-theme';
import { CuiIconComponent, IconRegistryService } from '@idealink-material/ui-icons';
import { MenuService, MenuItem, PermissionService } from '@idealink-material/ui-utils';

import {
  CuiBadgeComponent, CuiAvatarComponent, CuiTooltipDirective,
  CuiToastOutletComponent,
} from '@idealink-material/ui-core';

const CUSTOM_ICONS = [
  { name: 'shield',       svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.87-2.64 7.5-6 8.93C8.64 18.5 6 14.87 6 11V7.67L12 5z"/></svg>` },
  { name: 'aml-flag',    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>` },
  { name: 'company-logo',svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="currentColor"><rect x="4" y="4" width="14" height="14" rx="2"/><rect x="22" y="4" width="14" height="14" rx="2" opacity="0.6"/><rect x="4" y="22" width="14" height="14" rx="2" opacity="0.6"/><rect x="22" y="22" width="14" height="14" rx="2" opacity="0.3"/></svg>` },
];

const APP_MENU: MenuItem[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: 'dashboard',  routerLink: '/' },
  { id: 'monitoring',  label: 'Monitoring',  icon: 'radar',      expanded: true,  children: [
    { id: 'alerts',       label: 'Alerts',       icon: 'aml-flag',    routerLink: '/alerts',       badge: '12', badgeColor: 'error' },
    { id: 'transactions', label: 'Transactions', icon: 'swap_horiz',  routerLink: '/transactions' },
  ]},
  { id: 'reports',  label: 'Reports',  icon: 'bar_chart',  routerLink: '/reports',  dividerBefore: true },
  { id: 'users',    label: 'Users',    icon: 'people',     routerLink: '/users',    permission: 'users:read' },
  { id: 'settings', label: 'Settings', icon: 'settings',   routerLink: '/settings', dividerBefore: true },

  { id: 'docs-atoms', label: 'Docs: Atoms', icon: 'category', dividerBefore: true, children: [
    { id: 'docs-button',   label: 'Button',   icon: 'smart_button', routerLink: '/docs/button' },
    { id: 'docs-badge',    label: 'Badge',    icon: 'badge',        routerLink: '/docs/badge' },
    { id: 'docs-avatar',   label: 'Avatar',   icon: 'person',       routerLink: '/docs/avatar' },
    { id: 'docs-chip',     label: 'Chip',     icon: 'sell',         routerLink: '/docs/chip' },
    { id: 'docs-progress', label: 'Progress', icon: 'linear_scale', routerLink: '/docs/progress' },
    { id: 'docs-skeleton', label: 'Skeleton', icon: 'view_agenda',  routerLink: '/docs/skeleton' },
    { id: 'docs-spinner',  label: 'Spinner',  icon: 'autorenew',    routerLink: '/docs/spinner' },
    { id: 'docs-tooltip',  label: 'Tooltip',  icon: 'chat_bubble',  routerLink: '/docs/tooltip' },
  ]},
  { id: 'docs-layout', label: 'Docs: Layout', icon: 'dashboard_customize', children: [
    { id: 'docs-card',      label: 'Card',      icon: 'view_carousel', routerLink: '/docs/card' },
    { id: 'docs-accordion', label: 'Accordion', icon: 'unfold_more',   routerLink: '/docs/accordion' },
    { id: 'docs-divider',   label: 'Divider',   icon: 'horizontal_rule', routerLink: '/docs/divider' },
    { id: 'docs-fieldset',  label: 'Fieldset',  icon: 'crop_square',   routerLink: '/docs/fieldset' },
    { id: 'docs-panel',     label: 'Panel',     icon: 'view_agenda',   routerLink: '/docs/panel' },
  ]},
  { id: 'docs-forms', label: 'Docs: Forms', icon: 'edit_note', children: [
    { id: 'docs-input',          label: 'Input',          icon: 'text_fields',              routerLink: '/docs/input' },
    { id: 'docs-select',         label: 'Select',         icon: 'arrow_drop_down_circle',   routerLink: '/docs/select' },
    { id: 'docs-datepicker',     label: 'Datepicker',     icon: 'calendar_month',           routerLink: '/docs/datepicker' },
    { id: 'docs-checkbox',       label: 'Checkbox',       icon: 'check_box',                routerLink: '/docs/checkbox' },
    { id: 'docs-radio-group',    label: 'Radio Group',    icon: 'radio_button_checked',     routerLink: '/docs/radio-group' },
    { id: 'docs-slider',         label: 'Slider',         icon: 'tune',                     routerLink: '/docs/slider' },
    { id: 'docs-toggle-switch',  label: 'Toggle Switch',  icon: 'toggle_on',                routerLink: '/docs/toggle-switch' },
    { id: 'docs-input-number',   label: 'Input Number',   icon: 'pin',                      routerLink: '/docs/input-number' },
    { id: 'docs-listbox',        label: 'Listbox',        icon: 'list',                     routerLink: '/docs/listbox' },
    { id: 'docs-multi-select',   label: 'Multi Select',   icon: 'checklist',                routerLink: '/docs/multi-select' },
    { id: 'docs-chips',          label: 'Chips',          icon: 'label',                    routerLink: '/docs/chips' },
    { id: 'docs-autocomplete',   label: 'Autocomplete',   icon: 'search',                   routerLink: '/docs/autocomplete' },
    { id: 'docs-color-picker',   label: 'Color Picker',   icon: 'palette',                  routerLink: '/docs/color-picker' },
    { id: 'docs-editor',         label: 'Editor',         icon: 'edit_note',                routerLink: '/docs/editor' },
    { id: 'docs-input-group',    label: 'Input Group',    icon: 'view_column',              routerLink: '/docs/input-group' },
    { id: 'docs-input-mask',     label: 'Input Mask',     icon: 'password',                 routerLink: '/docs/input-mask' },
    { id: 'docs-input-otp',      label: 'Input OTP',      icon: 'pin',                      routerLink: '/docs/input-otp' },
    { id: 'docs-knob',           label: 'Knob',           icon: 'radio_button_unchecked',   routerLink: '/docs/knob' },
    { id: 'docs-password',       label: 'Password',       icon: 'lock',                     routerLink: '/docs/password' },
    { id: 'docs-rating',         label: 'Rating',         icon: 'star',                     routerLink: '/docs/rating' },
  ]},
  { id: 'docs-navigation', label: 'Docs: Navigation', icon: 'signpost', children: [
    { id: 'docs-breadcrumb',   label: 'Breadcrumb',   icon: 'more_horiz',         routerLink: '/docs/breadcrumb' },
    { id: 'docs-tabs',         label: 'Tabs',         icon: 'tab',                routerLink: '/docs/tabs' },
    { id: 'docs-pagination',   label: 'Pagination',   icon: 'pages',              routerLink: '/docs/pagination' },
    { id: 'docs-menu',         label: 'Menu',         icon: 'menu',               routerLink: '/docs/menu' },
    { id: 'docs-menubar',      label: 'Menubar',      icon: 'view_headline',      routerLink: '/docs/menubar' },
    { id: 'docs-context-menu', label: 'Context Menu', icon: 'touch_app',          routerLink: '/docs/context-menu' },
    { id: 'docs-stepper',      label: 'Stepper',      icon: 'format_list_numbered', routerLink: '/docs/stepper' },
    { id: 'docs-panel-menu',   label: 'Panel Menu',   icon: 'list_alt',           routerLink: '/docs/panel-menu' },
  ]},
  { id: 'docs-overlays', label: 'Docs: Overlays', icon: 'layers', children: [
    { id: 'docs-dialog',         label: 'Dialog',         icon: 'open_in_new',    routerLink: '/docs/dialog' },
    { id: 'docs-drawer',         label: 'Drawer',         icon: 'side_navigation', routerLink: '/docs/drawer' },
    { id: 'docs-confirm-dialog', label: 'Confirm Dialog', icon: 'fact_check',     routerLink: '/docs/confirm-dialog' },
    { id: 'docs-popover',        label: 'Popover',        icon: 'speaker_notes',  routerLink: '/docs/popover' },
    { id: 'docs-speed-dial',     label: 'Speed Dial',     icon: 'add_circle',     routerLink: '/docs/speed-dial' },
    { id: 'docs-split-button',   label: 'Split Button',   icon: 'call_split',     routerLink: '/docs/split-button' },
  ]},
  { id: 'docs-data', label: 'Docs: Data', icon: 'table_chart', children: [
    { id: 'docs-data-table',       label: 'Data Table',       icon: 'table_chart',    routerLink: '/docs/data-table' },
    { id: 'docs-tree',             label: 'Tree',             icon: 'account_tree',   routerLink: '/docs/tree' },
    { id: 'docs-pick-list',        label: 'Pick List',        icon: 'compare_arrows', routerLink: '/docs/pick-list' },
    { id: 'docs-virtual-scroller', label: 'Virtual Scroller', icon: 'view_stream',    routerLink: '/docs/virtual-scroller' },
    { id: 'docs-tree-table',       label: 'Tree Table',       icon: 'table_view',     routerLink: '/docs/tree-table' },
    { id: 'docs-scheduler',        label: 'Scheduler',        icon: 'calendar_view_day', routerLink: '/docs/scheduler' },
  ]},
  { id: 'docs-feedback', label: 'Docs: Feedback', icon: 'notifications', children: [
    { id: 'docs-empty-state',     label: 'Empty State',     icon: 'inbox',            routerLink: '/docs/empty-state' },
    { id: 'docs-loading-overlay', label: 'Loading Overlay', icon: 'hourglass_empty',  routerLink: '/docs/loading-overlay' },
  ]},
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, RouterLink,
    CuiIconComponent, CuiTooltipDirective,
    CuiBadgeComponent, CuiAvatarComponent,
    CuiToastOutletComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly frameworkVersion   = inject(FRAMEWORK_VERSION);
  readonly themeService       = inject(ThemeService);
  readonly menuService        = inject(MenuService);
  private readonly permissionService = inject(PermissionService);
  private readonly iconRegistry      = inject(IconRegistryService);

  ngOnInit(): void {
    this.iconRegistry.registerAll(CUSTOM_ICONS);
    this.menuService.setItems(APP_MENU);
    this.menuService.activateByUrl('/alerts');
    this.permissionService.setPermissions(['users:read']);
  }
}
