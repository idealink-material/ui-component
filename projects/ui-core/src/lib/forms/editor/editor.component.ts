import {
  ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, afterNextRender,
  forwardRef, input, model, output, viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgStyle } from '@angular/common';
import Quill from 'quill';

export interface EditorTextChangeEvent {
  htmlValue: string;
  text: string;
  source: string;
}

export interface EditorSelectionChangeEvent {
  range: { index: number; length: number } | null;
  source: string;
}

@Component({
  selector: 'p-editor',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="p-editor" [class.p-editor--readonly]="readonly()" [ngStyle]="style()">
      <div #editorEl class="p-editor__surface"></div>
    </div>
  `,
  styleUrl: './editor.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CuiEditorComponent),
    multi: true,
  }],
})
export class CuiEditorComponent implements ControlValueAccessor {
  readonly style       = input<Record<string, string> | null>(null);
  readonly placeholder = input<string>('');
  readonly readonly    = input<boolean>(false);
  readonly modules     = input<Record<string, unknown> | null>(null);

  /** HTML content of the editor. */
  readonly value = model<string>('');

  readonly onTextChange      = output<EditorTextChangeEvent>();
  readonly onSelectionChange = output<EditorSelectionChangeEvent>();

  private readonly editorEl = viewChild.required<ElementRef<HTMLDivElement>>('editorEl');
  private quill: Quill | null = null;
  private suppressChange = false;

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => this.initQuill());
  }

  private initQuill(): void {
    const quill = new Quill(this.editorEl().nativeElement, {
      theme: 'snow',
      placeholder: this.placeholder(),
      readOnly: this.readonly(),
      modules: this.modules() ?? { toolbar: true },
    });
    this.quill = quill;

    if (this.value()) quill.root.innerHTML = this.value();

    quill.on('text-change', (_delta, _oldDelta, source) => {
      if (this.suppressChange) return;
      const html = quill.root.innerHTML;
      this.value.set(html);
      this._onChange(html);
      this.onTextChange.emit({ htmlValue: html, text: quill.getText(), source });
    });

    quill.on('selection-change', (range, _oldRange, source) => {
      if (!range) this._onTouched();
      this.onSelectionChange.emit({ range, source });
    });
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
    if (this.quill) {
      this.suppressChange = true;
      this.quill.root.innerHTML = v ?? '';
      this.suppressChange = false;
    }
  }

  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.quill?.enable(!isDisabled); }
}
