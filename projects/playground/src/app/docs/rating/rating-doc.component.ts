import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiRatingComponent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-rating-doc',
  imports: [CuiRatingComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './rating-doc.component.html',
  styleUrl: './rating-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'default',  label: 'Default' },
    { id: 'stars',    label: 'Star count' },
    { id: 'states',   label: 'States' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'stars',    type: 'number',  default: '5',    description: 'Number of stars rendered.' },
    { name: 'cancel',   type: 'boolean', default: 'true', description: 'Shows a leading icon to clear the rating back to 0.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Displays the current rating without allowing interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control and blocks interaction.' },
    { name: 'value',    type: 'number',  default: '0',    description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onRate',   type: 'EventEmitter<number>', description: 'Emitted with the new value when a star is clicked.' },
    { name: 'onCancel', type: 'EventEmitter<void>',   description: 'Emitted when the rating is cleared via the cancel icon.' },
  ];

  readonly basic    = signal(0);
  readonly tenStars = signal(4);
  readonly readonlyVal = signal(3);
}
