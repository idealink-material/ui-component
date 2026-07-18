import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CuiIconComponent } from '@idealink-material/ui-icons';
import { ToastService, BreadcrumbService } from '@idealink-material/ui-utils';

import {
  CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
  CuiSkeletonComponent, CuiProgressComponent, CuiChipComponent,
  CuiLoadingOverlayComponent, CuiEmptyStateComponent, PEmptyStateActionComponent,
  CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
  CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
  CuiTabsComponent, CuiDialogContainerComponent, PDialogFooterComponent, CuiDrawerComponent,
  CuiDataTableComponent, CuiInputNumberComponent,
  SelectOption, TabItem, TableColumn, PageEvent, DataTableChangeEvent,
} from '@idealink-material/ui-core';

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
  selector: 'app-showcase',
  imports: [
    ReactiveFormsModule,
    CuiIconComponent,
    CuiButtonComponent, CuiBadgeComponent, CuiAvatarComponent,
    CuiSkeletonComponent, CuiProgressComponent, CuiChipComponent,
    CuiLoadingOverlayComponent, CuiEmptyStateComponent, PEmptyStateActionComponent,
    CuiCardComponent, CuiBreadcrumbComponent, CuiPaginationComponent,
    CuiInputComponent, CuiSelectComponent, CuiDatepickerComponent,
    CuiTabsComponent, CuiDialogContainerComponent, PDialogFooterComponent, CuiDrawerComponent,
    CuiDataTableComponent, CuiInputNumberComponent,
  ],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent implements OnInit {
  readonly toastService       = inject(ToastService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly fb                = inject(FormBuilder);

  // ── Demo state ─────────────────────────────────────────────────────────────
  readonly activeTab    = signal(0);
  readonly drawerOpen   = signal(false);
  readonly dialogOpen   = signal(false);
  readonly cardLoading  = signal(false);
  readonly tablePage    = signal(1);
  readonly tableTotal   = signal(CASES.length);
  readonly progress     = signal(72);
  readonly Math         = Math;

  readonly form = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    risk:  [null as any],
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
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'forms',    label: 'Forms',    icon: 'edit_note' },
    { id: 'data',     label: 'Data',     icon: 'table_chart' },
    { id: 'overlays', label: 'Overlays', icon: 'layers' },
  ];

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
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', routerLink: '/' },
      { label: 'Cases', routerLink: '/cases' },
      { label: 'AML Dashboard', isCurrent: true },
    ]);
    setTimeout(() => {
      this.form.patchValue({risk: 'severe'});
    }, 300)
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
