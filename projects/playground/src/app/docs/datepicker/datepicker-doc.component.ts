import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiDatepickerComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-datepicker-doc',
  imports: [CuiDatepickerComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './datepicker-doc.component.html',
  styleUrl: './datepicker-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',      label: 'Basic usage' },
    { id: 'range',      label: 'Range & multiple' },
    { id: 'inline',     label: 'Inline' },
    { id: 'views',      label: 'Month/year picker' },
    { id: 'format',     label: 'Format' },
    { id: 'view-range', label: 'Month/year range' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'label',          type: 'string',                                  default: `''`,           description: 'Floating label text.' },
    { name: 'placeholder',    type: 'string',                                  default: `'MM/DD/YYYY'`, description: 'Placeholder text shown when empty.' },
    { name: 'hint',           type: 'string | null',                           default: 'null',         description: 'Helper text shown when there is no error.' },
    { name: 'error',          type: 'string | null',                           default: 'null',         description: 'Error message; replaces the hint and marks the field invalid.' },
    { name: 'variant',        type: `'outline' | 'fill'`,                      default: `'outline'`,    description: 'Field appearance.' },
    { name: 'disabled',       type: 'boolean',                                 default: 'false',        description: 'Disables the field.' },
    { name: 'required',       type: 'boolean',                                 default: 'false',        description: 'Marks the field required.' },
    { name: 'fullWidth',      type: 'boolean',                                 default: 'true',         description: 'Stretches the field to fill its container.' },
    { name: 'min',            type: 'Date | null',                             default: 'null',         description: 'Earliest selectable date.' },
    { name: 'max',            type: 'Date | null',                             default: 'null',         description: 'Latest selectable date.' },
    { name: 'dateFormat',     type: 'string | null',                           default: `'mm/dd/yy'`,   description: 'Token format for the input\'s display text and typed-input parsing — see the Format section below.' },
    { name: 'selectionMode',  type: `'single' | 'multiple' | 'range'`,         default: `'single'`,     description: 'Selection behavior.' },
    { name: 'view',           type: `'date' | 'month' | 'year'`,               default: `'date'`,       description: 'Granularity the picker stops at. Combined with selectionMode="range", month/year open a dedicated range grid panel instead.' },
    { name: 'showTime',       type: 'boolean',                                 default: 'false',        description: 'Shows a time-of-day input alongside the date (single selection mode only).' },
    { name: 'showIcon',       type: 'boolean',                                 default: 'true',         description: 'Shows the calendar trigger icon.' },
    { name: 'disabledDates',  type: 'Date[] | null',                           default: 'null',         description: 'Specific dates to disable.' },
    { name: 'inline',         type: 'boolean',                                 default: 'false',        description: 'Renders the calendar directly in the page instead of a popup. Range mode always uses the popup.' },
    { name: 'numberOfMonths', type: 'number',                                  default: '1',            description: 'Number of calendars shown side by side. Only honored in inline mode.' },
    { name: 'value',          type: 'Date | Date[] | null',                    default: 'null',         description: 'Two-way bindable value ([(value)]) — also works as a ControlValueAccessor.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'cuiChange',    type: 'EventEmitter<Date | Date[] | null>', description: 'Emitted whenever the value changes, alongside the value model update.' },
    { name: 'onSelect',     type: 'EventEmitter<Date | Date[] | null>', description: 'Emitted alongside cuiChange when a date is selected.' },
    { name: 'onClose',      type: 'EventEmitter<void>',                 description: 'Emitted when the popup calendar or the month/year range panel closes.' },
    { name: 'onTodayClick', type: 'EventEmitter<void>',                 description: "Emitted when a Today action is used." },
    { name: 'onClearClick', type: 'EventEmitter<void>',                 description: "Emitted when a Clear action is used." },
  ];

  readonly single = signal<Date | null>(null);
  readonly range  = signal<Date[] | null>(null);
  readonly multi  = signal<Date[] | null>([]);
  readonly inlineDate = signal<Date | null>(null);
  readonly monthValue = signal<Date | null>(null);
  readonly monthRange = signal<Date[] | null>(null);
  readonly yearRange  = signal<Date[] | null>(null);
  readonly isoValue   = signal<Date | null>(null);
  readonly longValue  = signal<Date | null>(null);
}
