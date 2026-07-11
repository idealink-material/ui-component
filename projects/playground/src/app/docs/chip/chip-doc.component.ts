import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiChipComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-chip-doc',
  imports: [CuiChipComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './chip-doc.component.html',
  styleUrl: './chip-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'variants',     label: 'Variants' },
    { id: 'colors',       label: 'Colors' },
    { id: 'selectable',   label: 'Selectable' },
    { id: 'dismissible',  label: 'Dismissible' },
    { id: 'icons',        label: 'Icons' },
    { id: 'custom-icons', label: 'Custom icon content' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'variant',     type: `'filled' | 'outlined' | 'soft'`, default: `'soft'`, description: 'Visual style of the chip.' },
    { name: 'color',       type: `'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'neutral'`, default: `'neutral'`, description: 'Color scheme.' },
    { name: 'selected',    type: 'boolean', default: 'false', description: 'Selected state, used together with selectable.' },
    { name: 'selectable',  type: 'boolean', default: 'false', description: 'Makes the chip toggleable; clicking emits selectedChange.' },
    { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a close button that emits dismissed on click.' },
    { name: 'disabled',    type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'icon',        type: 'string | null', default: 'null', description: 'Icon name rendered before the label.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'dismissed',      type: 'EventEmitter<void>',    description: 'Emitted when the dismiss (close) button is clicked, when dismissible is true.' },
    { name: 'selectedChange', type: 'EventEmitter<boolean>', description: 'Emitted with the new selected value when a selectable chip is clicked.' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '[icon]',    description: "Escape hatch for custom leading content (e.g. a hand-written <svg>) when the icon string input isn't enough." },
    { name: '(default)', description: 'The chip label.' },
  ];

  readonly selected1 = signal(true);
  readonly selected2 = signal(false);
  readonly dismissibleChips = signal(['AML', 'KYC', 'High Risk']);

  removeChip(chip: string): void {
    this.dismissibleChips.update((chips) => chips.filter((c) => c !== chip));
  }
}
