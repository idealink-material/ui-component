import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiToggleSwitchComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-toggle-switch-doc',
  imports: [CuiToggleSwitchComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './toggle-switch-doc.component.html',
  styleUrl: './toggle-switch-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',       label: 'Basic usage' },
    { id: 'custom-value', label: 'Custom on/off values' },
    { id: 'states',       label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',      type: 'string',  default: `''`,    description: 'Label text rendered next to the switch.' },
    { name: 'disabled',   type: 'boolean', default: 'false', description: 'Disables the switch.' },
    { name: 'required',   type: 'boolean', default: 'false', description: 'Marks the switch required.' },
    { name: 'trueValue',  type: 'T',       default: 'true',  description: 'Value stored in value when the switch is on.' },
    { name: 'falseValue', type: 'T',       default: 'false', description: 'Value stored in value when the switch is off.' },
    { name: 'value',      type: 'T',       default: 'false', description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<T>', description: 'Emitted whenever the switch is toggled, alongside the value model update.' },
  ];

  readonly basic = signal(true);
  readonly status = signal<'active' | 'inactive'>('inactive');
}
