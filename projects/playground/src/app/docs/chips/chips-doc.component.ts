import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiChipsComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-chips-doc',
  imports: [CuiChipsComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './chips-doc.component.html',
  styleUrl: './chips-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',     label: 'Basic usage' },
    { id: 'limits',    label: 'Limits & duplicates' },
    { id: 'separator', label: 'Custom separator' },
    { id: 'states',    label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'placeholder',    type: 'string',           default: `''`,   description: 'Placeholder shown in the empty token input.' },
    { name: 'max',            type: 'number | null',    default: 'null', description: 'Maximum number of chips allowed; further entries are ignored.' },
    { name: 'allowDuplicate', type: 'boolean',          default: 'true', description: 'When false, entries matching an existing chip are ignored.' },
    { name: 'separator',      type: 'string | null',    default: 'null', description: 'Character that, when typed, commits the current text as a chip (in addition to Enter).' },
    { name: 'addOnBlur',      type: 'boolean',          default: 'false', description: 'Commits the current input text as a chip when the field loses focus.' },
    { name: 'disabled',       type: 'boolean',          default: 'false', description: 'Disables the field and blocks interaction.' },
    { name: 'value',          type: 'string[]',         default: '[]',   description: 'Two-way bindable list of chip tokens via [(value)] or formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onAdd',      type: 'EventEmitter<string>', description: 'Emitted with the token text whenever a chip is added.' },
    { name: 'onRemove',   type: 'EventEmitter<string>', description: 'Emitted with the token text whenever a chip is removed (dismiss or backspace).' },
    { name: 'onChipClick', type: 'EventEmitter<string>', description: 'Emitted with the token text when an existing chip is clicked.' },
  ];

  readonly tags        = signal<string[]>(['angular', 'typescript']);
  readonly limited     = signal<string[]>(['alpha']);
  readonly separated   = signal<string[]>([]);
  readonly disabledTags = signal<string[]>(['read-only']);
}
