import { Directive } from '@angular/core';
import { MatContextMenuTrigger } from '@angular/material/menu';

/**
 * Wires an element to open a <p-menu> as a right-click context menu.
 *
 * Usage:
 * ```html
 * <div [pContextMenu]="menu.menu()">Right-click me</div>
 * <p-menu #menu [items]="items" />
 * ```
 */
@Directive({
  selector: '[pContextMenu]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatContextMenuTrigger,
      inputs: ['matContextMenuTriggerFor: pContextMenu', 'matContextMenuTriggerDisabled: pContextMenuDisabled'],
    },
  ],
})
export class CuiContextMenuDirective {}
