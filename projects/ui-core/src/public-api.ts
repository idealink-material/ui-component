/*
 * Public API Surface of ui-core
 * This is the ONLY file other projects may import from.
 */

// ── Wave 1: Atoms ─────────────────────────────────────────────────────────────
export * from './lib/atoms/button/button.component';
export * from './lib/atoms/badge/badge.component';
export * from './lib/atoms/avatar/avatar.component';
export * from './lib/atoms/spinner/spinner.component';
export * from './lib/atoms/skeleton/skeleton.component';
export * from './lib/atoms/progress/progress.component';
export * from './lib/atoms/chip/chip.component';
export * from './lib/atoms/tooltip/tooltip.directive';
export * from './lib/atoms/carousel-dots/carousel-dots.component';

// ── Wave 2: Feedback ──────────────────────────────────────────────────────────
export * from './lib/feedback/toast/toast-outlet.component';
export * from './lib/feedback/loading-overlay/loading-overlay.component';
export * from './lib/feedback/empty-state/empty-state.component';
export * from './lib/feedback/empty-state/empty-state-action.component';

// ── Wave 3: Forms ─────────────────────────────────────────────────────────────
export * from './lib/forms/input/input.component';
export * from './lib/forms/select/select.component';
export * from './lib/forms/datepicker/datepicker.component';

// ── Wave 4: Forms completeness ────────────────────────────────────────────────
export * from './lib/forms/checkbox/checkbox.component';
export * from './lib/forms/radio-group/radio-group.component';
export * from './lib/forms/slider/slider.component';
export * from './lib/forms/toggle-switch/toggle-switch.component';
export * from './lib/forms/input-number/input-number.component';
export * from './lib/forms/listbox/listbox.component';
export * from './lib/forms/multi-select/multi-select.component';
export * from './lib/forms/file-dropzone/file-dropzone.component';

// ── Wave 3: Layout ────────────────────────────────────────────────────────────
export * from './lib/layout/card/card.component';
export * from './lib/layout/card/card-header.component';
export * from './lib/layout/card/card-footer.component';

// ── Wave 4: Layout (panels) ───────────────────────────────────────────────────
export * from './lib/layout/accordion/accordion.component';
export * from './lib/layout/accordion/accordion-panel.component';
export * from './lib/layout/stat-card/stat-card.component';
export * from './lib/layout/auth-layout/auth-layout.component';

// ── Wave 3: Navigation ────────────────────────────────────────────────────────
export * from './lib/navigation/breadcrumb/breadcrumb.component';
export * from './lib/navigation/tabs/tabs.component';
export * from './lib/navigation/pagination/pagination.component';
export * from './lib/navigation/top-nav/top-nav-link.type';
export * from './lib/navigation/top-nav/top-nav.component';

// ── Wave 4: Navigation & menus ────────────────────────────────────────────────
export * from './lib/navigation/menu/menu-item.type';
export * from './lib/navigation/menu/menu.component';
export * from './lib/navigation/menubar/menubar.component';
export * from './lib/navigation/context-menu/context-menu.directive';
export * from './lib/navigation/stepper/stepper.component';
export * from './lib/navigation/panel-menu/panel-menu.component';

// ── Wave 3: Overlays ──────────────────────────────────────────────────────────
export * from './lib/overlays/dialog/dialog-container.component';
export * from './lib/overlays/dialog/dialog-footer.component';
export * from './lib/overlays/drawer/drawer.component';
export * from './lib/overlays/drawer/drawer-footer.component';

// ── Wave 4: Overlays & feedback ───────────────────────────────────────────────
export * from './lib/overlays/confirm-dialog/confirm-dialog.component';
export * from './lib/overlays/confirm-dialog/confirm.service';
export * from './lib/overlays/popover/popover.directive';
export * from './lib/overlays/speed-dial/speed-dial.component';
export * from './lib/overlays/split-button/split-button.component';

// ── Wave 3: Data ──────────────────────────────────────────────────────────────
export * from './lib/data/table/table.types';
export * from './lib/data/table/table.component';
export * from './lib/data/table/data-table.component';
export * from './lib/data/table/data-table-actions.component';

// ── Wave 4: Data-heavy ─────────────────────────────────────────────────────────
export * from './lib/data/tree/tree-node.type';
export * from './lib/data/tree/tree.component';
export * from './lib/data/pick-list/pick-list.component';
export * from './lib/data/virtual-scroller/virtual-scroller.component';
export * from './lib/data/tree-table/tree-table.component';

// ── Wave 5: PrimeNG-parity form components ────────────────────────────────────
export * from './lib/forms/chips/chips.component';
export * from './lib/forms/autocomplete/autocomplete.component';
export * from './lib/forms/color-picker/color-picker.component';
export * from './lib/forms/editor/editor.component';
export * from './lib/forms/input-group/input-group.component';
export * from './lib/forms/input-group-addon/input-group-addon.component';
export * from './lib/forms/input-mask/input-mask.component';
export * from './lib/forms/input-otp/input-otp.component';
export * from './lib/forms/knob/knob.component';
export * from './lib/forms/password/password.component';
export * from './lib/forms/rating/rating.component';

// ── Wave 6: Layout completeness ─────────────────────────────────────────────────
export * from './lib/layout/divider/divider.component';
export * from './lib/layout/fieldset/fieldset.component';
export * from './lib/layout/panel/panel.component';
export * from './lib/layout/panel/panel-footer.component';
