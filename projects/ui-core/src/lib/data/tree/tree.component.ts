import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CuiIconComponent } from '@votha-sok/ui-icons';
import { CuiCheckboxComponent } from '../../forms/checkbox/checkbox.component';
import { TreeNode } from './tree-node.type';

@Component({
  selector: 'p-tree',
  standalone: true,
  imports: [NgTemplateOutlet, CuiIconComponent, CuiCheckboxComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuiTreeComponent<T = unknown> {
  readonly nodes      = input<TreeNode<T>[]>([]);
  readonly selectable = input<boolean>(false);

  readonly selectedIds = model<readonly string[]>([]);
  readonly selectionChange = output<readonly string[]>();
  readonly nodeClick = output<TreeNode<T>>();

  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggleExpand(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSelect(id: string): void {
    const current = this.selectedIds();
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    this.selectedIds.set(next);
    this.selectionChange.emit(next);
  }

  onNodeClick(node: TreeNode<T>): void {
    if (node.disabled) return;
    this.nodeClick.emit(node);
  }
}
