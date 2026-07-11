import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiSliderComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-slider-doc',
  imports: [CuiSliderComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './slider-doc.component.html',
  styleUrl: './slider-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'range', label: 'Range' },
    { id: 'step',  label: 'Custom range & step' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'min',         type: 'number',                     default: '0',           description: 'Minimum value.' },
    { name: 'max',         type: 'number',                     default: '100',         description: 'Maximum value.' },
    { name: 'step',        type: 'number',                     default: '1',           description: 'Amount the value snaps to while dragging.' },
    { name: 'discrete',    type: 'boolean',                    default: 'true',        description: 'Shows a value bubble while dragging.' },
    { name: 'disabled',    type: 'boolean',                    default: 'false',       description: 'Disables the slider.' },
    { name: 'range',       type: 'boolean',                    default: 'false',       description: 'Renders a two-thumb range slider; value becomes a [start, end] tuple.' },
    { name: 'orientation', type: `'horizontal' | 'vertical'`,  default: `'horizontal'`, description: 'Track direction. Vertical is a CSS-driven approximation — Material has no native vertical slider.' },
    { name: 'value',       type: 'number | [number, number]',  default: '0',           description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange',  type: 'EventEmitter<number | [number, number]>', description: 'Emitted whenever the value changes while dragging, alongside the value model update.' },
    { name: 'onSlideEnd', type: 'EventEmitter<number | [number, number]>', description: 'Emitted once when a drag gesture ends.' },
  ];

  readonly basic = signal(40);
  readonly rangeVal = signal<[number, number]>([20, 70]);
  readonly stepped = signal(0);
}
