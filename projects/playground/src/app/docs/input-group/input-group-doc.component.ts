import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CuiInputGroupComponent, CuiInputGroupAddonComponent, CuiInputComponent, CuiSelectComponent, SelectOption,
} from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiTemplate, DocSection } from '../shared/doc-types';

@Component({
  selector: 'app-input-group-doc',
  imports: [
    CuiInputGroupComponent, CuiInputGroupAddonComponent, CuiInputComponent, CuiSelectComponent,
    DocExampleComponent, DocShellComponent,
  ],
  templateUrl: './input-group-doc.component.html',
  styleUrl: './input-group-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroupDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',   label: 'Basic usage' },
    { id: 'both',    label: 'Prefix & suffix' },
    { id: 'multi',   label: 'Multiple fields' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly templates: DocApiTemplate[] = [
    { name: '(default)', description: 'p-input-group: lays out any children flush together, sharing one continuous border/radius.' },
    { name: '(default)', description: 'p-input-group-addon: a fixed-width prefix/suffix slot, e.g. for a currency symbol or unit.' },
  ];

  readonly currencyOptions: SelectOption[] = [
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' },
  ];
}
