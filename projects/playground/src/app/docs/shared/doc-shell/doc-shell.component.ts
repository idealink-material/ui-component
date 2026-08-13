import { ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';

import {
  DocApiEmitter, DocApiInterface, DocApiProperty, DocApiTemplate, DocSection,
} from '../doc-types';

export type DocResource = 'features' | 'theming' | 'api' | 'passthrough';

/**
 * Shared per-component documentation shell: RESOURCES tab bar (Features /
 * Theming / API / Passthrough) plus a contextual "ON THIS PAGE" nav, mirroring
 * the PrimeNG docs layout. Feature/theming/passthrough content is projected in
 * by the page; the API tab is rendered entirely from structured inputs.
 */
@Component({
  selector: 'app-doc-shell',
  imports: [],
  templateUrl: './doc-shell.component.html',
  styleUrl: './doc-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocShellComponent {
  private readonly content = viewChild<ElementRef<HTMLElement>>('content');

  readonly name = input.required<string>();
  readonly lead = input<string>('');

  readonly featureSections     = input<DocSection[]>([]);
  readonly themingSections     = input<DocSection[]>([{ id: 'theming-overview', label: 'Overview' }]);
  readonly passthroughSections = input<DocSection[]>([{ id: 'passthrough-attributes', label: 'Attributes' }]);

  readonly properties = input<DocApiProperty[]>([]);
  readonly emitters   = input<DocApiEmitter[]>([]);
  readonly templates  = input<DocApiTemplate[]>([]);
  readonly interfaces = input<DocApiInterface[]>([]);

  readonly activeResource = signal<DocResource>('features');

  readonly apiSections = computed<DocSection[]>(() => {
    const sections: DocSection[] = [];
    if (this.properties().length) sections.push({ id: 'api-properties', label: 'Properties' });
    if (this.emitters().length)   sections.push({ id: 'api-emitters',   label: 'Emitters' });
    if (this.templates().length)  sections.push({ id: 'api-templates',  label: 'Templates' });
    if (this.interfaces().length) sections.push({ id: 'api-interfaces', label: 'Interfaces' });
    return sections;
  });

  readonly onThisPage = computed<DocSection[]>(() => {
    switch (this.activeResource()) {
      case 'features':     return this.featureSections();
      case 'theming':      return this.themingSections();
      case 'api':          return this.apiSections();
      case 'passthrough':  return this.passthroughSections();
    }
  });

  setResource(resource: DocResource): void {
    this.activeResource.set(resource);
  }

  scrollToSection(event: MouseEvent, id: string): void {
    const container = this.content()?.nativeElement;
    const target = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!container || !target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  }
}
