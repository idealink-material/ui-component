import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiInputNumberComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-number-doc',
  imports: [CuiInputNumberComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './input-number-doc.component.html',
  styleUrl: './input-number-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',          label: 'Basic usage' },
    { id: 'variants',       label: 'Variants & sizes' },
    { id: 'hint',           label: 'Label, hint & error' },
    { id: 'button-layouts', label: 'Button layouts' },
    { id: 'currency',       label: 'Currency across locales' },
    { id: 'locales',        label: 'Number formatting across locales' },
    { id: 'format-options', label: 'Formatting options' },
    { id: 'range',          label: 'Min/max & no buttons' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',       type: 'string',                   default: `''`,      description: 'Label rendered above the field.' },
    { name: 'hint',        type: 'string | null',             default: 'null',    description: 'Helper text shown below the field when there is no error.' },
    { name: 'error',       type: 'string | null',             default: 'null',    description: 'Error text shown below the field once touched; takes priority over hint.' },
    { name: 'variant',     type: `'outline' | 'fill'`,        default: `'outline'`, description: 'Material form-field appearance.' },
    { name: 'size',        type: `'sm' | 'md' | 'lg'`,        default: `'md'`,    description: 'Field height/text size, same scale as p-input.' },
    { name: 'min',         type: 'number | null',            default: 'null',    description: 'Minimum value; the decrement button disables at this floor.' },
    { name: 'max',         type: 'number | null',            default: 'null',    description: 'Maximum value; the increment button disables at this ceiling.' },
    { name: 'step',        type: 'number',                   default: '1',       description: 'Amount added/subtracted per button press.' },
    { name: 'showButtons', type: 'boolean',                  default: 'true',    description: 'Shows the increment/decrement buttons.' },
    { name: 'buttonLayout', type: `'horizontal' | 'vertical' | 'stacked'`, default: `'stacked'`, description: `'stacked' embeds a chevron up/down pair inside the field's right edge; 'horizontal' flanks the field with a p-button each side; 'vertical' stacks two p-buttons beside the field.` },
    { name: 'incrementButtonIcon', type: 'string',           default: `'keyboard_arrow_up'`,   description: 'Icon name for the increment button.' },
    { name: 'decrementButtonIcon', type: 'string',           default: `'keyboard_arrow_down'`, description: 'Icon name for the decrement button.' },
    { name: 'incrementButtonClass', type: 'string',          default: `''`,      description: 'Extra CSS class applied to the increment button.' },
    { name: 'decrementButtonClass', type: 'string',          default: `''`,      description: 'Extra CSS class applied to the decrement button.' },
    { name: 'disabled',    type: 'boolean',                  default: 'false',   description: 'Disables the field.' },
    { name: 'readonly',    type: 'boolean',                  default: 'false',   description: 'Makes the field read-only; stepper buttons are also disabled.' },
    { name: 'required',    type: 'boolean',                  default: 'false',   description: 'Marks the native input as required.' },
    { name: 'placeholder', type: 'string',                   default: `''`,      description: 'Placeholder text shown when empty.' },
    { name: 'fullWidth',   type: 'boolean',                  default: 'false',   description: 'Stretches the field to fill its container.' },
    { name: 'mode',        type: `'decimal' | 'currency'`,   default: `'decimal'`, description: 'Formatting mode for the display value.' },
    { name: 'currency',    type: 'string',                   default: `'USD'`,   description: 'ISO currency code used when mode is currency.' },
    { name: 'currencyDisplay', type: `'symbol' | 'code' | 'name'`, default: `'symbol'`, description: 'How the currency is rendered when mode is currency.' },
    { name: 'useGrouping', type: 'boolean',                  default: 'true',    description: 'Shows thousands separators in the formatted display value.' },
    { name: 'prefix',      type: 'string',                   default: `''`,      description: 'Static text prepended to the formatted display value.' },
    { name: 'suffix',      type: 'string',                   default: `''`,      description: 'Static text appended to the formatted display value.' },
    { name: 'locale',      type: 'string | undefined',       default: 'undefined', description: 'Locale passed to Intl.NumberFormat. Defaults to the host environment\'s current locale.' },
    { name: 'localeMatcher', type: `'lookup' | 'best fit'`,  default: `'best fit'`, description: 'Locale matching algorithm passed to Intl.NumberFormat.' },
    { name: 'minFractionDigits', type: 'number | null',      default: 'null',    description: 'Minimum decimal digits shown in the formatted display value.' },
    { name: 'maxFractionDigits', type: 'number | null',      default: 'null',    description: 'Maximum decimal digits shown in the formatted display value.' },
    { name: 'format',      type: 'boolean',                  default: 'true',    description: 'When false, the display value is always the raw unformatted number.' },
    { name: 'allowEmpty',  type: 'boolean',                  default: 'true',    description: 'When false, an empty field is coerced to 0 (clamped to min/max) on blur.' },
    { name: 'showClear',   type: 'boolean',                  default: 'false',   description: 'Shows a clear (x) button when the field has a value.' },
    { name: 'autofocus',   type: 'boolean',                  default: 'false',   description: 'Focuses the field automatically after it renders.' },
    { name: 'autocomplete', type: 'string',                  default: `'off'`,   description: 'Native autocomplete attribute on the input.' },
    { name: 'styleClass',  type: 'string',                   default: `''`,      description: 'Extra CSS class applied to the host element.' },
    { name: 'style',       type: 'Record<string, string> | null', default: 'null', description: 'Inline style applied to the host element.' },
    { name: 'inputStyleClass', type: 'string',                default: `''`,      description: 'Extra CSS class applied to the native input.' },
    { name: 'inputStyle',  type: 'Record<string, string> | null', default: 'null', description: 'Inline style applied to the native input.' },
    { name: 'inputId',     type: 'string | undefined',       default: 'undefined', description: 'Identifier of the accessible input element. Falls back to an auto-generated id.' },
    { name: 'name',        type: 'string',                   default: `''`,      description: 'Native name attribute on the input.' },
    { name: 'tabindex',    type: 'number | null',             default: 'null',    description: 'Tab order of the input.' },
    { name: 'title',       type: 'string',                   default: `''`,      description: 'Native title/tooltip attribute on the input.' },
    { name: 'ariaLabel',   type: 'string | undefined',        default: 'undefined', description: 'Accessibility label on the input.' },
    { name: 'ariaLabelledBy', type: 'string | undefined',     default: 'undefined', description: 'Accessibility labelledby reference on the input.' },
    { name: 'value',       type: 'number | null',            default: 'null',    description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange', type: 'EventEmitter<number | null>', description: 'Emitted whenever the value changes, alongside the value model update.' },
    { name: 'onInput',   type: 'EventEmitter<number | null>', description: 'Emitted on every raw input event, before clamping.' },
    { name: 'onFocus',   type: 'EventEmitter<FocusEvent>',    description: 'Emitted when the field gains focus (switches to the raw editable value).' },
    { name: 'onBlur',    type: 'EventEmitter<FocusEvent>',    description: 'Emitted when the field loses focus (switches back to the formatted display value).' },
    { name: 'onKeyDown', type: 'EventEmitter<KeyboardEvent>', description: 'Emitted on every keydown inside the input.' },
    { name: 'onClear',   type: 'EventEmitter<void>',          description: 'Emitted when the clear button is clicked.' },
  ];

  readonly basic    = signal<number | null>(3);
  readonly bounded  = signal<number | null>(50);

  readonly usdValue = signal<number | null>(1500);
  readonly eurValue = signal<number | null>(2500);
  readonly inrValue = signal<number | null>(4250);
  readonly jpyValue = signal<number | null>(5002);

  readonly userLocaleValue = signal<number | null>(151351);
  readonly usLocaleValue   = signal<number | null>(115744);
  readonly deLocaleValue   = signal<number | null>(635524);
  readonly inLocaleValue   = signal<number | null>(732762);

  readonly integerValue    = signal<number | null>(42723);
  readonly noGroupingValue = signal<number | null>(58151);
  readonly fractionValue   = signal<number | null>(2351.35);
  readonly boundaryValue   = signal<number | null>(50);
}
