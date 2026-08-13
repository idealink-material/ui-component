import { ChangeDetectionStrategy, Component, computed, contentChild, input, model, output, TemplateRef } from '@angular/core';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { TableColumn } from '../table/table.types';

export interface TreeTableNode<T = Record<string, unknown>> {
  id: string;
  data: T;
  children?: TreeTableNode<T>[];
}

export interface FlatTreeTableRow<T> {
  node: TreeTableNode<T>;
  depth: number;
  hasChildren: boolean;
}

export interface TreeTableCellClickEvent<T = Record<string, unknown>> {
  column: TableColumn<T>;
  value: unknown;
  rowData: T;
  node: TreeTableNode<T>;
}

export interface TreeTableAction<T = Record<string, unknown>> {
  /** Identifies which action was clicked — reported back on `actionClick`. */
  id: string;
  /** Icon name, passed to `<cui-icon>`. Required unless `display` is `'text'`. */
  icon?: string;
  /** Button label — always used for the accessible name/tooltip; also the visible content when `display` is `'text'`. */
  label: string;
  /** `'icon'` (default) renders an icon-only button; `'text'` renders the label as visible text instead. */
  display?: 'icon' | 'text';
  /** Hide this action for a given row, e.g. to only show "delete" when the row has no children. */
  hidden?: (rowData: T, node: TreeTableNode<T>) => boolean;
  /** Disable (but still show) this action for a given row. */
  disabled?: (rowData: T, node: TreeTableNode<T>) => boolean;
}

export interface TreeTableActionClickEvent<T = Record<string, unknown>> {
  actionId: string;
  rowData: T;
  node: TreeTableNode<T>;
}

@Component({
  selector: 'p-tree-table',
  standalone: true,
  exportAs: 'pTreeTable',
  imports: [CuiIconComponent, NgStyle, NgTemplateOutlet],
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTreeTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns = input<TableColumn<T>[]>([]);
  readonly nodes   = input<TreeTableNode<T>[]>([]);
  /** Inline styles applied to the `<table>` element, e.g. `{ 'min-width': '50rem' }`. */
  readonly tableStyle = input<Record<string, string> | null>(null);
  readonly striped = input<boolean>(false);
  /** Row-action buttons rendered in a trailing, non-data column. Omit to skip the column entirely. */
  readonly actions = input<TreeTableAction<T>[]>([]);
  /** Header label for the actions column. */
  readonly actionsHeader = input<string>('');
  /** Alignment of the actions column's header and buttons. Default: `'left'`. */
  readonly actionsAlign = input<'left' | 'center' | 'right'>('left');

  /** Ids of currently expanded nodes. Bindable via `[(expandedIds)]` for externally-controlled expansion. */
  readonly expandedIds = model<ReadonlySet<string>>(new Set());

  /** Emitted when a cell is clicked (only for the generated row markup, not a custom `body` template). */
  readonly cellClick = output<TreeTableCellClickEvent<T>>();
  /** Emitted when an `actions` button is clicked. */
  readonly actionClick = output<TreeTableActionClickEvent<T>>();

  /** Maps `actionsAlign` to the flexbox equivalent for the (`display: flex`) actions `<td>`. */
  readonly actionsJustify = computed(() =>
    this.actionsAlign() === 'center' ? 'center' : this.actionsAlign() === 'right' ? 'flex-end' : 'flex-start'
  );

  /** `<ng-template #header>` — replaces the generated `<tr><th>…</th></tr>` header row entirely. */
  readonly headerTemplateRef = contentChild<TemplateRef<void>>('header');
  /** `<ng-template #body let-rowNode let-rowData="rowData">` — replaces the generated row markup; `$implicit` is the `FlatTreeTableRow`, `rowData` is `rowNode.node.data`. */
  readonly bodyTemplateRef = contentChild<TemplateRef<{ $implicit: FlatTreeTableRow<T>; rowData: T }>>('body');

  readonly flatRows = computed<FlatTreeTableRow<T>[]>(() => {
    const expanded = this.expandedIds();
    const out: FlatTreeTableRow<T>[] = [];
    const walk = (nodes: TreeTableNode<T>[], depth: number) => {
      for (const node of nodes) {
        const hasChildren = !!node.children?.length;
        out.push({ node, depth, hasChildren });
        if (hasChildren && expanded.has(node.id)) walk(node.children!, depth + 1);
      }
    };
    walk(this.nodes(), 0);
    return out;
  });

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggle(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  cellValue(col: TableColumn<T>, row: T): unknown {
    return col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key];
  }

  onCellClick(col: TableColumn<T>, row: FlatTreeTableRow<T>): void {
    this.cellClick.emit({ column: col, value: this.cellValue(col, row.node.data), rowData: row.node.data, node: row.node });
  }

  visibleActions(row: FlatTreeTableRow<T>): TreeTableAction<T>[] {
    return this.actions().filter(a => !a.hidden?.(row.node.data, row.node));
  }

  isActionDisabled(action: TreeTableAction<T>, row: FlatTreeTableRow<T>): boolean {
    return !!action.disabled?.(row.node.data, row.node);
  }

  onActionClick(action: TreeTableAction<T>, row: FlatTreeTableRow<T>, event: Event): void {
    event.stopPropagation();
    if (this.isActionDisabled(action, row)) return;
    this.actionClick.emit({ actionId: action.id, rowData: row.node.data, node: row.node });
  }
}
