import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CuiIconComponent } from '@idealink-material/ui-icons';
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

  isIndeterminate(id: string): boolean {
    const node = this.findNode(id);
    if (!node?.children?.length || this.isSelected(id)) return false;
    return this.hasSelectedDescendant(node);
  }

  toggleSelect(node: TreeNode<T>): void {
    if (node.disabled) return;
    const shouldSelect = !this.isSelected(node.id);
    const next = new Set(this.selectedIds());
    this.setDescendantSelection(node, shouldSelect, next);
    this.updateAncestors(node.id, next);
    const result = [...next];
    this.selectedIds.set(result);
    this.selectionChange.emit(result);
  }

  private setDescendantSelection(node: TreeNode<T>, selected: boolean, set: Set<string>): void {
    if (node.disabled) return;
    if (selected) set.add(node.id); else set.delete(node.id);
    for (const child of node.children ?? []) {
      this.setDescendantSelection(child, selected, set);
    }
  }

  private updateAncestors(id: string, set: Set<string>): void {
    const path = this.findPath(id);
    if (!path) return;
    for (let i = path.length - 2; i >= 0; i--) {
      const ancestor = path[i];
      const selectableChildren = (ancestor.children ?? []).filter(c => !c.disabled);
      const allSelected = selectableChildren.length > 0 && selectableChildren.every(c => set.has(c.id));
      if (allSelected) set.add(ancestor.id); else set.delete(ancestor.id);
    }
  }

  private hasSelectedDescendant(node: TreeNode<T>): boolean {
    for (const child of node.children ?? []) {
      if (this.isSelected(child.id) || this.hasSelectedDescendant(child)) return true;
    }
    return false;
  }

  private findNode(id: string, list: TreeNode<T>[] = this.nodes()): TreeNode<T> | null {
    for (const n of list) {
      if (n.id === id) return n;
      if (n.children?.length) {
        const found = this.findNode(id, n.children);
        if (found) return found;
      }
    }
    return null;
  }

  private findPath(
    id: string,
    list: TreeNode<T>[] = this.nodes(),
    path: TreeNode<T>[] = [],
  ): TreeNode<T>[] | null {
    for (const n of list) {
      if (n.id === id) return [...path, n];
      if (n.children?.length) {
        const found = this.findPath(id, n.children, [...path, n]);
        if (found) return found;
      }
    }
    return null;
  }

  onNodeClick(node: TreeNode<T>): void {
    if (node.disabled) return;
    this.nodeClick.emit(node);
  }
}
