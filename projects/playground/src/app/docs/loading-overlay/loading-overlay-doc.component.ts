import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CuiButtonComponent, CuiLoadingOverlayComponent } from '@votha-sok/ui-core';
import { LoadingService } from '@votha-sok/ui-utils';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-loading-overlay-doc',
  imports: [CuiButtonComponent, CuiLoadingOverlayComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './loading-overlay-doc.component.html',
  styleUrl: './loading-overlay-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayDocComponent {
  private readonly loadingService = inject(LoadingService);

  readonly featureSections: DocSection[] = [
    { id: 'manual',  label: 'Manual override' },
    { id: 'scoped',  label: 'Named scope' },
    { id: 'sizes',   label: 'Sizes' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'scope', type: 'string | null', default: 'null', description: "Named loading scope to watch from LoadingService. Omit to watch the global scope." },
    { name: 'label', type: 'string', default: `'Loading…'`, description: 'Text shown under the spinner. Also used as the aria-label.' },
    { name: 'size',  type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Spinner size.' },
    { name: 'show',  type: 'boolean | null', default: 'null', description: 'Override: force visible/hidden regardless of LoadingService.' },
  ];

  readonly cardLoading = signal(false);

  triggerManual(): void {
    this.cardLoading.set(true);
    setTimeout(() => this.cardLoading.set(false), 2000);
  }

  triggerScope(): void {
    this.loadingService.start('doc-example-table');
    setTimeout(() => this.loadingService.stop('doc-example-table'), 2000);
  }
}
