import {
  Directive, ElementRef, OnDestroy, TemplateRef, ViewContainerRef,
  inject, input,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

/**
 * Click-triggered overlay showing arbitrary template content, anchored to the host element.
 *
 * Usage:
 * ```html
 * <button [pPopover]="panel">Details</button>
 * <ng-template #panel>
 *   <div class="p-popover">Custom content here</div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[pPopover]',
  standalone: true,
  host: {
    '(click)': 'toggle()',
  },
})
export class CuiPopoverDirective implements OnDestroy {
  readonly pPopover = input.required<TemplateRef<unknown>>();

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  toggle(): void {
    if (this.overlayRef) this.close(); else this.open();
  }

  open(): void {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.attach(new TemplatePortal(this.pPopover(), this.viewContainerRef));
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  ngOnDestroy(): void {
    this.close();
  }
}
