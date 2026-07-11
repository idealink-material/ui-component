import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiColorPickerComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-color-picker-doc',
  imports: [CuiColorPickerComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './color-picker-doc.component.html',
  styleUrl: './color-picker-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'formats', label: 'Output formats' },
    { id: 'inline',  label: 'Inline label' },
    { id: 'states',  label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'format',   type: `'hex' | 'rgb' | 'hsb'`, default: `'hex'`, description: 'Output format used by formatted() and emitted by onChange.' },
    { name: 'inline',   type: 'boolean',               default: 'false', description: 'Renders the swatch in a bordered panel with a formatted color label alongside it.' },
    { name: 'disabled', type: 'boolean',               default: 'false', description: 'Disables the field and blocks interaction.' },
    { name: 'appendTo', type: 'string | null',         default: 'null',  description: 'Accepted for API parity; the native color picker is always OS-rendered.' },
    { name: 'value',    type: 'string',                default: `'#000000'`, description: 'Two-way bindable color, always stored internally as hex, via [(value)] or formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onChange', type: 'EventEmitter<string>', description: 'Emitted with the color formatted per format() whenever the swatch changes.' },
  ];

  readonly brandColor = signal('#3f51b5');
  readonly rgbColor   = signal('#e91e63');
  readonly hsbColor   = signal('#00bcd4');
  readonly inlineColor = signal('#4caf50');
  readonly disabledColor = signal('#9e9e9e');
}
