import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';

export type DocCodeLanguage = 'html' | 'ts' | 'bash';

const PRISM_LANGUAGE: Record<DocCodeLanguage, string> = {
  html: 'markup',
  ts: 'typescript',
  bash: 'bash',
};

@Component({
  selector: 'app-doc-code',
  imports: [],
  template: `
    <div class="doc-code">
      <div class="doc-code__toolbar">
        <span class="doc-code__lang">{{ language() }}</span>
        <button type="button" class="doc-code__copy" (click)="copy()">
          {{ copied() ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre class="doc-code__pre" [class]="'language-' + prismLanguage()"><code [innerHTML]="highlighted()"></code></pre>
    </div>
  `,
  styleUrl: './doc-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocCodeComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly code = input.required<string>();
  readonly language = input<DocCodeLanguage>('html');

  readonly copied = signal(false);

  readonly prismLanguage = computed(() => PRISM_LANGUAGE[this.language()]);

  readonly highlighted = computed(() => {
    const grammar = Prism.languages[this.prismLanguage()];
    const html = grammar
      ? Prism.highlight(this.code(), grammar, this.prismLanguage())
      : this.code();
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  copy(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
