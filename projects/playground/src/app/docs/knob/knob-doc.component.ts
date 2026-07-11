import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiKnobComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-knob-doc',
  imports: [CuiKnobComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './knob-doc.component.html',
  styleUrl: './knob-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnobDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'default',  label: 'Default' },
    { id: 'range',    label: 'Custom range & step' },
    { id: 'colors',   label: 'Colors' },
    { id: 'states',   label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'min',        type: 'number',  default: '0',                              description: 'Minimum value.' },
    { name: 'max',        type: 'number',  default: '100',                            description: 'Maximum value.' },
    { name: 'step',       type: 'number',  default: '1',                              description: 'Amount the value snaps to while dragging.' },
    { name: 'valueColor', type: 'string',  default: `'var(--mat-sys-primary)'`,       description: 'Stroke color of the filled arc.' },
    { name: 'rangeColor', type: 'string',  default: `'var(--mat-sys-outline-variant)'`, description: 'Stroke color of the background track.' },
    { name: 'showValue',  type: 'boolean', default: 'true',                           description: 'Shows the numeric value centered in the knob.' },
    { name: 'readonly',   type: 'boolean', default: 'false',                          description: 'Displays the current value without allowing drag interaction.' },
    { name: 'disabled',   type: 'boolean', default: 'false',                          description: 'Disables the control and blocks interaction.' },
    { name: 'value',      type: 'number',  default: '0',                              description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onChange', type: 'EventEmitter<number>', description: 'Emitted with the new value while dragging.' },
  ];

  readonly volume    = signal(40);
  readonly temp      = signal(20);
  readonly accent    = signal(65);
  readonly readonlyVal = signal(75);
}
