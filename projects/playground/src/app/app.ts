import { Component, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

import { FRAMEWORK_VERSION } from '@votha-sok/ui-utils';
import { ThemeService } from '@votha-sok/ui-theme';
import { CuiIconComponent, IconRegistryService } from '@votha-sok/ui-icons';
import { MenuService, MenuItem, ToastService, LoadingService, BreadcrumbService, PermissionService } from '@votha-sok/ui-utils';

import {
  // Wave 1
  CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
  CuiSkeletonComponent, CuiProgressComponent,
  CuiChipComponent, CuiTooltipDirective,
  // Wave 2
  CuiToastOutletComponent, CuiLoadingOverlayComponent, CuiEmptyStateComponent,
  PEmptyStateActionComponent,
  // Wave 3
  CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
  CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
  CuiTabsComponent, CuiDialogContainerComponent, PDialogFooterComponent, CuiDrawerComponent,
  CuiDataTableComponent,
  // Wave 4: Forms completeness
  CuiCheckboxComponent, CuiRadioGroupComponent, CuiSliderComponent, CuiToggleSwitchComponent,
  CuiInputNumberComponent, CuiListboxComponent, CuiMultiSelectComponent,
  // Wave 4: Navigation & menus
  CuiMenuComponent, CuiMenubarComponent, CuiContextMenuDirective, CuiStepperComponent,
  CuiAccordionComponent, CuiAccordionPanelComponent, CuiPanelMenuComponent,
  // Wave 4: Overlays & feedback
  CuiConfirmService, CuiPopoverDirective, CuiSpeedDialComponent, CuiSplitButtonComponent,
  // Wave 4: Data-heavy
  CuiTreeComponent, CuiPickListComponent, CuiVirtualScrollerComponent, CuiTreeTableComponent,
  SelectOption, TabItem, TableColumn, PageEvent, DataTableChangeEvent, SortState,
  CuiMenuItem, StepItem, SpeedDialItem, TreeNode, TreeTableNode,
} from '@votha-sok/ui-core';

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
];

export interface CaseRow {
  id: string; caseNo: string; subject: string; status: string;
  risk: string; assignee: string; created: string; [key: string]: unknown;
}

const CASES: CaseRow[] = [
  { id:'1', caseNo:'AML-2401', subject:'Suspicious wire transfer',    status:'Open',   risk:'High',   assignee:'Alice B',  created:'2024-01-15' },
  { id:'2', caseNo:'AML-2402', subject:'Unusual cash deposits',       status:'Review', risk:'Medium', assignee:'Bob C',    created:'2024-01-16' },
  { id:'3', caseNo:'AML-2403', subject:'Shell company transactions',  status:'Closed', risk:'Low',    assignee:'Carol D',  created:'2024-01-17' },
  { id:'4', caseNo:'AML-2404', subject:'Cross-border payment flag',   status:'Open',   risk:'High',   assignee:'David E',  created:'2024-01-18' },
  { id:'5', caseNo:'AML-2405', subject:'Crypto exchange activity',    status:'Review', risk:'Medium', assignee:'Eva F',    created:'2024-01-19' },
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, ReactiveFormsModule, MatMenuModule,
    CuiIconComponent, CuiTooltipDirective,
    // Wave 1
    CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
    CuiSkeletonComponent, CuiProgressComponent, CuiChipComponent,
    // Wave 2
    CuiToastOutletComponent, CuiLoadingOverlayComponent, CuiEmptyStateComponent,
    PEmptyStateActionComponent,
    // Wave 3
    CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
    CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
    CuiTabsComponent, CuiDialogContainerComponent, PDialogFooterComponent, CuiDrawerComponent,
    CuiDataTableComponent,
    // Wave 4: Forms completeness
    CuiCheckboxComponent, CuiRadioGroupComponent, CuiSliderComponent, CuiToggleSwitchComponent,
    CuiInputNumberComponent, CuiListboxComponent, CuiMultiSelectComponent,
    // Wave 4: Navigation & menus
    CuiMenuComponent, CuiMenubarComponent, CuiContextMenuDirective, CuiStepperComponent,
    CuiAccordionComponent, CuiAccordionPanelComponent, CuiPanelMenuComponent,
    // Wave 4: Overlays & feedback
    CuiPopoverDirective, CuiSpeedDialComponent, CuiSplitButtonComponent,
    // Wave 4: Data-heavy
    CuiTreeComponent, CuiPickListComponent, CuiVirtualScrollerComponent, CuiTreeTableComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly frameworkVersion   = inject(FRAMEWORK_VERSION);
  readonly themeService       = inject(ThemeService);
  readonly menuService        = inject(MenuService);
  readonly toastService       = inject(ToastService);
  readonly loadingService     = inject(LoadingService);
  readonly breadcrumbService  = inject(BreadcrumbService);
  readonly permissionService  = inject(PermissionService);
  readonly confirmService     = inject(CuiConfirmService);
  private readonly iconRegistry = inject(IconRegistryService);
  private readonly fb           = inject(FormBuilder);

  // ── Demo state ─────────────────────────────────────────────────────────────
  readonly activeTab    = signal(0);
  readonly drawerOpen   = signal(false);
  readonly dialogOpen   = signal(false);
  readonly cardLoading  = signal(false);
  readonly tablePage    = signal(1);
  readonly tableTotal   = signal(CASES.length);
  readonly progress     = signal(72);
  readonly Math         = Math;

  // ── Wave 4 form control demo state ────────────────────────────────────────
  readonly checkboxValue    = signal(false);
  readonly toggleValue      = signal(true);
  readonly sliderValue      = signal(40);
  readonly radioValue       = signal<string | null>('medium');
  readonly inputNumberValue = signal<number | null>(3);
  readonly listboxValue     = signal<readonly string[]>(['high']);
  readonly multiSelectValue = signal<string[]>(['low', 'high']);

  readonly form = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    risk:  [null as string | null],
    date:  [null as Date | null],
  });

  // ── Select options ─────────────────────────────────────────────────────────
  readonly riskOptions: SelectOption[] = [
    { value: 'low',    label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high',   label: 'High Risk',   group: 'Critical' },
    { value: 'severe', label: 'Severe Risk',  group: 'Critical' },
  ];

  // ── Tabs ───────────────────────────────────────────────────────────────────
  readonly tabs: TabItem[] = [
    { id: 'overview',  label: 'Overview',  icon: 'dashboard' },
    { id: 'forms',     label: 'Forms',     icon: 'edit_note' },
    { id: 'data',      label: 'Data',      icon: 'table_chart' },
    { id: 'overlays',  label: 'Overlays',  icon: 'layers' },
    { id: 'wave4',     label: 'New Controls', icon: 'widgets' },
    { id: 'wave4b',    label: 'Menus & Panels', icon: 'menu' },
    { id: 'wave4c',    label: 'Overlays II',    icon: 'flare' },
    { id: 'wave4d',    label: 'Data II',        icon: 'account_tree', badge: 'NEW' },
  ];

  // ── Wave 4: data-heavy demo data ──────────────────────────────────────────
  readonly treeNodes: TreeNode[] = [
    { id: 'monitoring', label: 'Monitoring', icon: 'radar', children: [
      { id: 'alerts',       label: 'Alerts',       icon: 'aml-flag' },
      { id: 'transactions', label: 'Transactions', icon: 'swap_horiz', children: [
        { id: 'wire',  label: 'Wire Transfers' },
        { id: 'cash',  label: 'Cash Deposits' },
      ]},
    ]},
    { id: 'reports', label: 'Reports', icon: 'summarize', children: [
      { id: 'daily',   label: 'Daily Summary' },
      { id: 'monthly', label: 'Monthly Summary' },
    ]},
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  readonly pickListOptions: SelectOption[] = [
    { value: 'alice',   label: 'Alice B.' },
    { value: 'bob',     label: 'Bob C.' },
    { value: 'carol',   label: 'Carol D.' },
    { value: 'dave',    label: 'Dave E.' },
    { value: 'erin',    label: 'Erin F.' },
  ];

  readonly pickListValue = signal<string[]>(['alice', 'carol']);

  readonly virtualScrollItems = Array.from({ length: 5000 }, (_, i) => `Transaction row #${i + 1}`);

  readonly treeTableColumns: TableColumn<{ name: string; amount: string; status: string }>[] = [
    { key: 'name',   header: 'Account' },
    { key: 'amount', header: 'Amount', align: 'right' },
    { key: 'status', header: 'Status' },
  ];

  readonly treeTableNodes: TreeTableNode<{ name: string; amount: string; status: string }>[] = [
    { id: 'g1', data: { name: 'Corporate Accounts', amount: '$1.2M', status: 'Active' }, children: [
      { id: 'g1-1', data: { name: 'Acme Holdings',  amount: '$820K', status: 'Active' } },
      { id: 'g1-2', data: { name: 'Bright Capital',  amount: '$380K', status: 'Review' } },
    ]},
    { id: 'g2', data: { name: 'Retail Accounts', amount: '$430K', status: 'Active' }, children: [
      { id: 'g2-1', data: { name: 'Individual Clients', amount: '$430K', status: 'Active' } },
    ]},
  ];

  readonly speedDialItems: SpeedDialItem[] = [
    { id: 'flag',    icon: 'aml-flag',  label: 'Flag Case',   command: () => this.toast('warning') },
    { id: 'assign',  icon: 'person_add', label: 'Assign',     command: () => this.toast('info') },
    { id: 'close',   icon: 'check',     label: 'Close Case',  command: () => this.toast('success') },
  ];

  readonly splitButtonItems: CuiMenuItem[] = [
    { id: 'save-draft', label: 'Save as Draft', icon: 'save',   command: () => this.toast('info') },
    { id: 'save-close', label: 'Save & Close',  icon: 'check',  command: () => this.toast('success') },
  ];

  async confirmCloseCase(): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Close Case',
      message: 'Are you sure you want to close this case? This action cannot be undone.',
      acceptLabel: 'Close Case',
      rejectLabel: 'Cancel',
      severity: 'error',
    });
    if (confirmed) this.toast('success');
  }

  // ── Wave 4: menu/panel demo data ──────────────────────────────────────────
  readonly caseMenuItems: CuiMenuItem[] = [
    { id: 'view',     label: 'View Details', icon: 'visibility', command: () => this.toast('info') },
    { id: 'assign',   label: 'Reassign',     icon: 'person_add', command: () => this.toast('info') },
    { id: 'sep1',     label: '', separator: true },
    { id: 'escalate', label: 'Escalate',     icon: 'warning',    command: () => this.toast('warning') },
    { id: 'close',    label: 'Close Case',   icon: 'check',      command: () => this.toast('success') },
  ];

  readonly menubarItems: CuiMenuItem[] = [
    { id: 'file', label: 'File', children: [
      { id: 'new',    label: 'New Case',  icon: 'add',    command: () => this.toast('success') },
      { id: 'export', label: 'Export',    icon: 'download', command: () => this.toast('info') },
    ]},
    { id: 'view', label: 'View', children: [
      { id: 'refresh', label: 'Refresh', icon: 'refresh', command: () => this.toast('info') },
    ]},
    { id: 'help', label: 'Help', command: () => this.toast('info') },
  ];

  readonly panelMenuItems: CuiMenuItem[] = [
    { id: 'monitoring', label: 'Monitoring', icon: 'radar', children: [
      { id: 'alerts',       label: 'Alerts',       icon: 'aml-flag' },
      { id: 'transactions', label: 'Transactions', icon: 'swap_horiz' },
    ]},
    { id: 'reports', label: 'Reports', icon: 'summarize', children: [
      { id: 'daily',   label: 'Daily Summary' },
      { id: 'monthly', label: 'Monthly Summary' },
    ]},
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  readonly wizardSteps: StepItem[] = [
    { id: 'details',  label: 'Case Details',  completed: true },
    { id: 'evidence', label: 'Evidence',       completed: true },
    { id: 'review',   label: 'Review',         optional: true },
    { id: 'submit',   label: 'Submit' },
  ];

  readonly wizardStep = signal(2);

  // ── Table columns ──────────────────────────────────────────────────────────
  readonly columns: TableColumn<CaseRow>[] = [
    { key: 'caseNo',   header: 'Case No.',   sortable: true,  width: '110px' },
    { key: 'subject',  header: 'Subject',    sortable: true  },
    { key: 'status',   header: 'Status',     sortable: true,  width: '100px', align: 'center' },
    { key: 'risk',     header: 'Risk',       sortable: true,  width: '100px', align: 'center' },
    { key: 'assignee', header: 'Assignee',   sortable: false, width: '120px' },
    { key: 'created',  header: 'Created',    sortable: true,  width: '110px' },
  ];

  readonly tableRows = signal<CaseRow[]>(CASES);

  ngOnInit(): void {
    this.iconRegistry.registerAll(CUSTOM_ICONS);
    this.menuService.setItems(APP_MENU);
    this.menuService.activateByUrl('/alerts');
    this.permissionService.setPermissions(['users:read']);
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', routerLink: '/' },
      { label: 'Cases', routerLink: '/cases' },
      { label: 'AML Dashboard', isCurrent: true },
    ]);
  }

  toast(level: 'success'|'error'|'warning'|'info'): void {
    const msgs = {
      success: 'Case closed successfully.',
      error:   'Transaction verification failed.',
      warning: 'Suspicious activity detected.',
      info:    'Report generation scheduled.',
    };
    this.toastService[level](msgs[level], { title: level.charAt(0).toUpperCase() + level.slice(1) });
  }

  onTableChange(e: DataTableChangeEvent): void {
    console.log('DataTable state:', e);
  }

  onPageChange(e: PageEvent): void {
    this.tablePage.set(e.page);
  }

  simulateLoad(): void {
    this.cardLoading.set(true);
    setTimeout(() => this.cardLoading.set(false), 2000);
  }

  submitForm(): void {
    if (this.form.valid) {
      this.toast('success');
    } else {
      this.form.markAllAsTouched();
    }
  }
}
