import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { DocCodeComponent, DocCodeLanguage } from '../doc-code/doc-code.component';

@Component({
  selector: 'app-doc-example',
  imports: [DocCodeComponent],
  templateUrl: './doc-example.component.html',
  styleUrl: './doc-example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocExampleComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly code = input.required<string>();
  readonly language = input<DocCodeLanguage>('html');
  readonly sourceId = input<string>('');

  readonly showCode = signal(false);

  toggleCode(): void {
    this.showCode.update((v) => !v);
  }
}
