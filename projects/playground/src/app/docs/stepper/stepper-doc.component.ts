import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiStepperComponent, StepItem } from '@votha-sok/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiInterface, DocApiProperty, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-stepper-doc',
  imports: [CuiStepperComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './stepper-doc.component.html',
  styleUrl: './stepper-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'linear',   label: 'Linear' },
    { id: 'vertical', label: 'Vertical' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'steps',       type: 'StepItem[]',                     default: '[]',           description: 'Steps to render.' },
    { name: 'activeIndex', type: 'number',                         default: '0',            description: 'Index of the current step.' },
    { name: 'orientation', type: `'horizontal' | 'vertical'`,      default: `'horizontal'`, description: 'Layout direction.' },
    { name: 'linear',      type: 'boolean',                        default: 'false',        description: 'When true, a step is only clickable once every prior step is completed.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'stepChange', type: 'EventEmitter<number>', description: 'Emitted with the newly selected step index (only for clickable steps).' },
  ];

  readonly interfaces: DocApiInterface[] = [
    {
      name: 'StepItem',
      fields: [
        { name: 'id',          type: 'string',              description: 'Unique identifier.' },
        { name: 'label',       type: 'string',              description: 'Step label.' },
        { name: 'description', type: 'string | undefined',  description: 'Optional supporting text shown under the label.' },
        { name: 'completed',   type: 'boolean | undefined', description: 'Marks the step as completed (shows a check mark).' },
        { name: 'optional',    type: 'boolean | undefined', description: 'Marks the step as optional in its label.' },
        { name: 'disabled',    type: 'boolean | undefined', description: 'Prevents the step from being selected.' },
      ],
    },
  ];

  readonly wizardSteps: StepItem[] = [
    { id: 'details',  label: 'Case Details',  completed: true },
    { id: 'evidence', label: 'Evidence',       completed: true },
    { id: 'review',   label: 'Review',         optional: true },
    { id: 'submit',   label: 'Submit' },
  ];

  readonly activeStep = signal(2);
  readonly linearStep = signal(0);
}
