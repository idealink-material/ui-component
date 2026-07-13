import {
  ChangeDetectionStrategy, Component, ElementRef, input, model, signal, viewChild,
} from '@angular/core';
import { CuiIconComponent } from '@idealink-material/ui-icons';

@Component({
  selector: 'p-file-dropzone',
  standalone: true,
  imports: [CuiIconComponent],
  templateUrl: './file-dropzone.component.html',
  styleUrl: './file-dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-file-dropzone' },
})
export class CuiFileDropzoneComponent {
  readonly accept = input<string>('');
  readonly multiple = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly hint = input<string>('Drag & drop files here, or click to browse');

  readonly files = model<File[]>([]);

  protected readonly dragging = signal(false);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  browse(): void {
    if (this.disabled()) return;
    this.fileInput().nativeElement.click();
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled()) this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    if (this.disabled() || !e.dataTransfer) return;
    this.addFiles(Array.from(e.dataTransfer.files));
  }

  onInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  remove(index: number): void {
    this.files.set(this.files().filter((_, i) => i !== index));
  }

  private addFiles(list: File[]): void {
    this.files.set(this.multiple() ? [...this.files(), ...list] : list.slice(0, 1));
  }
}
