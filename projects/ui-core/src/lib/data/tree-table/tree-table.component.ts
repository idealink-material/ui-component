import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';
import { TableColumn } from '../table/table.types';

export interface TreeTableNode<T = Record<string, unknown>> {
  id: string;
  data: T;
  children?: TreeTableNode<T>[];
}

interface FlatTreeTableRow<T> {
  node: TreeTableNode<T>;
  depth: number;
  hasChildren: boolean;
}

@Component({
  selector: 'p-tree-table',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTreeTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns = input<TableColumn<T>[]>([]);
  readonly nodes   = input<TreeTableNode<T>[]>([]);

  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());

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
}
