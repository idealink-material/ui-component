import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { DocCodeComponent } from '../doc-code/doc-code.component';

export type DocExampleTab = 'html' | 'ts';

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
  /** Template (HTML tab) usage code. */
  readonly code = input.required<string>();
  /** Corresponding TypeScript (TypeScript tab) code. Omit to show only the HTML tab. */
  readonly tsCode = input<string>('');
  readonly sourceId = input<string>('');

  readonly showCode = signal(false);
  readonly activeTab = signal<DocExampleTab>('html');

  readonly hasTsTab = computed(() => this.tsCode().length > 0);

  toggleCode(): void {
    this.showCode.update((v) => !v);
  }

  setTab(tab: DocExampleTab): void {
    this.activeTab.set(tab);
  }
}
