import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiSplitButtonComponent, CuiMenuItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-split-button-doc',
  imports: [CuiSplitButtonComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './split-button-doc.component.html',
  styleUrl: './split-button-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'color', label: 'Variant & color' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',    type: 'string',        default: `''`,        description: 'Label on the main (left) action button.' },
    { name: 'items',    type: 'CuiMenuItem[]', default: '[]',        description: 'Menu items shown when the caret (right) side is opened. See the Menu doc page for the CuiMenuItem shape.' },
    { name: 'variant',  type: 'ButtonVariant', default: `'filled'`,  description: "The p-button variant used for both halves — see Button's variant type." },
    { name: 'color',    type: 'ButtonColor',   default: `'primary'`, description: "The p-button color used for both halves — see Button's color type." },
    { name: 'disabled', type: 'boolean',       default: 'false',     description: 'Disables both halves.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'action', type: 'EventEmitter<void>', description: 'Emitted when the main (left) button is clicked.' },
  ];

  readonly lastAction = signal('');

  readonly saveOptions: CuiMenuItem[] = [
    { id: 'save-draft', label: 'Save as Draft', icon: 'save',  command: () => this.lastAction.set('save-draft') },
    { id: 'save-close', label: 'Save & Close',  icon: 'check', command: () => this.lastAction.set('save-close') },
  ];
}
