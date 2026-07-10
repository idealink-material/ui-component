export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: TreeNode<T>[];
  data?: T;
}
