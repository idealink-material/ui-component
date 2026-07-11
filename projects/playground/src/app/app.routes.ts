import { Routes } from '@angular/router';

import { ShowcaseComponent } from './showcase/showcase.component';

// ── Atoms ────────────────────────────────────────────────────────────────────
import { ButtonDocComponent } from './docs/button/button-doc.component';
import { BadgeDocComponent } from './docs/badge/badge-doc.component';
import { AvatarDocComponent } from './docs/avatar/avatar-doc.component';
import { ChipDocComponent } from './docs/chip/chip-doc.component';
import { ProgressDocComponent } from './docs/progress/progress-doc.component';
import { SkeletonDocComponent } from './docs/skeleton/skeleton-doc.component';
import { SpinnerDocComponent } from './docs/spinner/spinner-doc.component';
import { TooltipDocComponent } from './docs/tooltip/tooltip-doc.component';

// ── Layout ───────────────────────────────────────────────────────────────────
import { CardDocComponent } from './docs/card/card-doc.component';
import { AccordionDocComponent } from './docs/accordion/accordion-doc.component';
import { DividerDocComponent } from './docs/divider/divider-doc.component';
import { FieldsetDocComponent } from './docs/fieldset/fieldset-doc.component';
import { PanelDocComponent } from './docs/panel/panel-doc.component';

// ── Forms ────────────────────────────────────────────────────────────────────
import { InputDocComponent } from './docs/input/input-doc.component';
import { SelectDocComponent } from './docs/select/select-doc.component';
import { DatepickerDocComponent } from './docs/datepicker/datepicker-doc.component';
import { CheckboxDocComponent } from './docs/checkbox/checkbox-doc.component';
import { RadioGroupDocComponent } from './docs/radio-group/radio-group-doc.component';
import { SliderDocComponent } from './docs/slider/slider-doc.component';
import { ToggleSwitchDocComponent } from './docs/toggle-switch/toggle-switch-doc.component';
import { InputNumberDocComponent } from './docs/input-number/input-number-doc.component';
import { ListboxDocComponent } from './docs/listbox/listbox-doc.component';
import { MultiSelectDocComponent } from './docs/multi-select/multi-select-doc.component';
import { ChipsDocComponent } from './docs/chips/chips-doc.component';
import { AutocompleteDocComponent } from './docs/autocomplete/autocomplete-doc.component';
import { ColorPickerDocComponent } from './docs/color-picker/color-picker-doc.component';
import { EditorDocComponent } from './docs/editor/editor-doc.component';
import { InputGroupDocComponent } from './docs/input-group/input-group-doc.component';
import { InputMaskDocComponent } from './docs/input-mask/input-mask-doc.component';
import { InputOtpDocComponent } from './docs/input-otp/input-otp-doc.component';
import { KnobDocComponent } from './docs/knob/knob-doc.component';
import { PasswordDocComponent } from './docs/password/password-doc.component';
import { RatingDocComponent } from './docs/rating/rating-doc.component';

// ── Navigation ───────────────────────────────────────────────────────────────
import { BreadcrumbDocComponent } from './docs/breadcrumb/breadcrumb-doc.component';
import { TabsDocComponent } from './docs/tabs/tabs-doc.component';
import { PaginationDocComponent } from './docs/pagination/pagination-doc.component';
import { MenuDocComponent } from './docs/menu/menu-doc.component';
import { MenubarDocComponent } from './docs/menubar/menubar-doc.component';
import { ContextMenuDocComponent } from './docs/context-menu/context-menu-doc.component';
import { StepperDocComponent } from './docs/stepper/stepper-doc.component';
import { PanelMenuDocComponent } from './docs/panel-menu/panel-menu-doc.component';

// ── Overlays ─────────────────────────────────────────────────────────────────
import { DialogDocComponent } from './docs/dialog/dialog-doc.component';
import { DrawerDocComponent } from './docs/drawer/drawer-doc.component';
import { ConfirmDialogDocComponent } from './docs/confirm-dialog/confirm-dialog-doc.component';
import { PopoverDocComponent } from './docs/popover/popover-doc.component';
import { SpeedDialDocComponent } from './docs/speed-dial/speed-dial-doc.component';
import { SplitButtonDocComponent } from './docs/split-button/split-button-doc.component';

// ── Data ─────────────────────────────────────────────────────────────────────
import { DataTableDocComponent } from './docs/data-table/data-table-doc.component';
import { TreeDocComponent } from './docs/tree/tree-doc.component';
import { PickListDocComponent } from './docs/pick-list/pick-list-doc.component';
import { VirtualScrollerDocComponent } from './docs/virtual-scroller/virtual-scroller-doc.component';
import { TreeTableDocComponent } from './docs/tree-table/tree-table-doc.component';

// ── Feedback ─────────────────────────────────────────────────────────────────
import { EmptyStateDocComponent } from './docs/empty-state/empty-state-doc.component';
import { LoadingOverlayDocComponent } from './docs/loading-overlay/loading-overlay-doc.component';

export const routes: Routes = [
  { path: '', component: ShowcaseComponent },

  // Atoms
  { path: 'docs/button',   component: ButtonDocComponent },
  { path: 'docs/badge',    component: BadgeDocComponent },
  { path: 'docs/avatar',   component: AvatarDocComponent },
  { path: 'docs/chip',     component: ChipDocComponent },
  { path: 'docs/progress', component: ProgressDocComponent },
  { path: 'docs/skeleton', component: SkeletonDocComponent },
  { path: 'docs/spinner',  component: SpinnerDocComponent },
  { path: 'docs/tooltip',  component: TooltipDocComponent },

  // Layout
  { path: 'docs/card',      component: CardDocComponent },
  { path: 'docs/accordion', component: AccordionDocComponent },
  { path: 'docs/divider',   component: DividerDocComponent },
  { path: 'docs/fieldset',  component: FieldsetDocComponent },
  { path: 'docs/panel',     component: PanelDocComponent },

  // Forms
  { path: 'docs/input',          component: InputDocComponent },
  { path: 'docs/select',         component: SelectDocComponent },
  { path: 'docs/datepicker',     component: DatepickerDocComponent },
  { path: 'docs/checkbox',       component: CheckboxDocComponent },
  { path: 'docs/radio-group',    component: RadioGroupDocComponent },
  { path: 'docs/slider',         component: SliderDocComponent },
  { path: 'docs/toggle-switch',  component: ToggleSwitchDocComponent },
  { path: 'docs/input-number',   component: InputNumberDocComponent },
  { path: 'docs/listbox',        component: ListboxDocComponent },
  { path: 'docs/multi-select',   component: MultiSelectDocComponent },
  { path: 'docs/chips',          component: ChipsDocComponent },
  { path: 'docs/autocomplete',   component: AutocompleteDocComponent },
  { path: 'docs/color-picker',   component: ColorPickerDocComponent },
  { path: 'docs/editor',         component: EditorDocComponent },
  { path: 'docs/input-group',    component: InputGroupDocComponent },
  { path: 'docs/input-mask',     component: InputMaskDocComponent },
  { path: 'docs/input-otp',      component: InputOtpDocComponent },
  { path: 'docs/knob',           component: KnobDocComponent },
  { path: 'docs/password',       component: PasswordDocComponent },
  { path: 'docs/rating',         component: RatingDocComponent },

  // Navigation
  { path: 'docs/breadcrumb',   component: BreadcrumbDocComponent },
  { path: 'docs/tabs',         component: TabsDocComponent },
  { path: 'docs/pagination',   component: PaginationDocComponent },
  { path: 'docs/menu',         component: MenuDocComponent },
  { path: 'docs/menubar',      component: MenubarDocComponent },
  { path: 'docs/context-menu', component: ContextMenuDocComponent },
  { path: 'docs/stepper',      component: StepperDocComponent },
  { path: 'docs/panel-menu',   component: PanelMenuDocComponent },

  // Overlays
  { path: 'docs/dialog',         component: DialogDocComponent },
  { path: 'docs/drawer',         component: DrawerDocComponent },
  { path: 'docs/confirm-dialog', component: ConfirmDialogDocComponent },
  { path: 'docs/popover',        component: PopoverDocComponent },
  { path: 'docs/speed-dial',     component: SpeedDialDocComponent },
  { path: 'docs/split-button',   component: SplitButtonDocComponent },

  // Data
  { path: 'docs/data-table',       component: DataTableDocComponent },
  { path: 'docs/tree',             component: TreeDocComponent },
  { path: 'docs/pick-list',        component: PickListDocComponent },
  { path: 'docs/virtual-scroller', component: VirtualScrollerDocComponent },
  { path: 'docs/tree-table',       component: TreeTableDocComponent },

  // Feedback
  { path: 'docs/empty-state',     component: EmptyStateDocComponent },
  { path: 'docs/loading-overlay', component: LoadingOverlayDocComponent },

  { path: '**', redirectTo: '' },
];
