import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiButtonComponent } from '@votha-sok/ui-core';
import { CuiIconComponent } from '@votha-sok/ui-icons';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-button-doc',
  imports: [CuiButtonComponent, CuiIconComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './button-doc.component.html',
  styleUrl: './button-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'variants',       label: 'Variants' },
    { id: 'sizes',          label: 'Sizes' },
    { id: 'colors',         label: 'Colors' },
    { id: 'states',         label: 'States' },
    { id: 'icons',          label: 'Icons' },
    { id: 'custom-content', label: 'Custom icon content' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'variant',   type: `'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'`,    default: `'filled'`,   description: 'Visual style of the button.' },
    { name: 'size',      type: `'sm' | 'md' | 'lg'`,                                       default: `'md'`,       description: 'Button size.' },
    { name: 'color',     type: `'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'`, default: `'primary'`, description: 'Color scheme.' },
    { name: 'disabled',  type: 'boolean', default: 'false', description: 'Disables the button and blocks interaction.' },
    { name: 'loading',   type: 'boolean', default: 'false', description: 'Shows a loading spinner and blocks interaction.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the button to fill its container.' },
    { name: 'icon',      type: 'string',  default: `''`,    description: 'Icon name rendered alongside the label.' },
    { name: 'iconPos',   type: `'left' | 'right'`, default: `'right'`, description: 'Position of the icon relative to the label.' },
    { name: 'type',      type: `'button' | 'submit' | 'reset'`, default: `'button'`, description: 'Native button type attribute.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onClick', type: 'EventEmitter<MouseEvent>', description: 'Emitted on click, or on Enter/Space when focused. Suppressed while disabled or loading.' },
  ];

  readonly loadingDemo = signal(false);

  triggerLoadingDemo(): void {
    this.loadingDemo.set(true);
    setTimeout(() => this.loadingDemo.set(false), 2000);
  }

  readonly customLoading = signal(false);

  triggerCustomLoading(): void {
    this.customLoading.set(true);
    setTimeout(() => this.customLoading.set(false), 2000);
  }

  readonly expanded = signal(false);
}
