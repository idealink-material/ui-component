import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiEditorComponent, EditorTextChangeEvent } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-editor-doc',
  imports: [CuiEditorComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './editor-doc.component.html',
  styleUrl: './editor-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'readonly', label: 'Readonly' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'style',       type: 'Record<string, string> | null', default: 'null', description: 'Inline styles applied to the outer wrapper via ngStyle.' },
    { name: 'placeholder', type: 'string',                        default: `''`,   description: 'Placeholder shown in the empty editor surface.' },
    { name: 'readonly',    type: 'boolean',                       default: 'false', description: 'Disables editing and hides the toolbar.' },
    { name: 'modules',     type: 'Record<string, unknown> | null', default: 'null', description: "Quill modules config, e.g. { toolbar: [...] }. Defaults to { toolbar: true }." },
    { name: 'value',       type: 'string',                        default: `''`,   description: 'Two-way bindable HTML content ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'onTextChange',      type: 'EventEmitter<EditorTextChangeEvent>',      description: "Emitted on every content change, with the editor's current HTML, plain text, and change source." },
    { name: 'onSelectionChange', type: 'EventEmitter<EditorSelectionChangeEvent>', description: 'Emitted when the caret or text selection changes, including on blur (range is null).' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'EditorTextChangeEvent',
      fields: [
        { name: 'htmlValue', type: 'string', description: "The editor's current content as HTML." },
        { name: 'text',      type: 'string', description: "The editor's current content as plain text." },
        { name: 'source',    type: 'string', description: 'Quill change source, e.g. "user" or "api".' },
      ],
    },
    {
      name: 'EditorSelectionChangeEvent',
      fields: [
        { name: 'range',  type: '{ index: number; length: number } | null', description: 'The current selection range, or null when focus leaves the editor.' },
        { name: 'source', type: 'string', description: 'Quill change source, e.g. "user" or "api".' },
      ],
    },
  ];

  readonly html = signal('<p>Start typing…</p>');
  readonly lastChange = signal<EditorTextChangeEvent | null>(null);
  readonly readonlyHtml = '<p><strong>This content is read-only.</strong> The toolbar is hidden and editing is disabled.</p>';
}
