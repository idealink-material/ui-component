import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiDrawerComponent, PDrawerFooterComponent, CuiButtonComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-drawer-doc',
  imports: [
    CuiDrawerComponent, PDrawerFooterComponent, CuiButtonComponent,
    DocExampleComponent, DocShellComponent,
  ],
  templateUrl: './drawer-doc.component.html',
  styleUrl: './drawer-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'position', label: 'Position & size' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'open',            type: 'boolean',                                default: 'false',  description: 'Whether the drawer is visible. Fully declarative — no service required.' },
    { name: 'title',           type: 'string',                                 default: `''`,     description: 'Drawer title shown in the header.' },
    { name: 'position',        type: `'left' | 'right' | 'top' | 'bottom'`,    default: `'right'`,description: 'Edge the drawer slides in from.' },
    { name: 'size',            type: `'sm' | 'md' | 'lg' | 'full'`,            default: `'md'`,   description: 'Panel width (left/right) or height (top/bottom).' },
    { name: 'showClose',       type: 'boolean',                                default: 'true',   description: 'Shows the close (×) button in the header.' },
    { name: 'closeOnBackdrop', type: 'boolean',                                default: 'true',   description: 'Closes the drawer when the backdrop is clicked.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'closed', type: 'EventEmitter<void>', description: 'Emitted when the drawer is dismissed via the close button or backdrop click. You own the open state — set it back to false.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)',      description: 'The scrollable drawer body.' },
    { name: 'p-drawer-footer', description: 'Optional footer slot rendered below the body, typically holding action buttons.' },
  ];

  readonly rightOpen  = signal(false);
  readonly bottomOpen = signal(false);
}
