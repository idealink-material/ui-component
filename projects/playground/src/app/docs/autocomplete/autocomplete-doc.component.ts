import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CuiAutoCompleteComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-autocomplete-doc',
  imports: [CuiAutoCompleteComponent, DocExampleComponent, DocShellComponent],
  templateUrl: './autocomplete-doc.component.html',
  styleUrl: './autocomplete-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic',    label: 'Basic usage' },
    { id: 'objects',  label: 'Object suggestions' },
    { id: 'multiple', label: 'Multiple selection' },
    { id: 'dropdown', label: 'Dropdown & states' },
  ];

  readonly themingSections: DocSection[] = [
    { id: 'theming-tokens', label: 'Design tokens' },
  ];

  readonly properties: DocApiProperty[] = [
    { name: 'suggestions',     type: 'T[]',                 default: '[]',    description: 'Suggestion list currently shown in the panel.' },
    { name: 'field',           type: 'string | null',       default: 'null',  description: 'Property name used to read the display label when suggestions are objects.' },
    { name: 'dropdown',        type: 'boolean',              default: 'false', description: 'Shows a trailing button that opens the panel with the current suggestions list.' },
    { name: 'multiple',        type: 'boolean',              default: 'false', description: 'Allows selecting more than one suggestion.' },
    { name: 'minLength',       type: 'number',               default: '1',     description: 'Minimum input length before completeMethod is triggered.' },
    { name: 'delay',           type: 'number',               default: '300',   description: 'Debounce, in ms, before completeMethod fires after typing stops.' },
    { name: 'forceSelection',  type: 'boolean',              default: 'false', description: 'Clears the input text on blur if it does not match a current suggestion.' },
    { name: 'disabled',        type: 'boolean',              default: 'false', description: 'Disables the field and blocks interaction.' },
    { name: 'placeholder',     type: 'string',               default: `''`,    description: 'Placeholder shown in the input.' },
    { name: 'completeOnFocus', type: 'boolean',              default: 'false', description: 'Fires completeMethod immediately when the input receives focus.' },
    { name: 'value',           type: 'T | T[] | null',       default: 'null',  description: 'Two-way bindable selected value(s) via [(value)] or formControlName.' },
  ];

  readonly emitters: DocApiEmitter[] = [
    { name: 'completeMethod',  type: 'EventEmitter<string>', description: 'Emitted with the current query text; populate suggestions() from a handler on this event.' },
    { name: 'onSelect',        type: 'EventEmitter<T>',      description: 'Emitted with the selected item when a suggestion is chosen.' },
    { name: 'onUnselect',      type: 'EventEmitter<T>',      description: 'Emitted with the removed item (multiple mode) when a selected chip is dismissed.' },
    { name: 'onClear',         type: 'EventEmitter<void>',   description: 'Emitted when the clear button is used.' },
    { name: 'onDropdownClick', type: 'EventEmitter<void>',   description: 'Emitted when the dropdown trigger button is clicked.' },
  ];

  private readonly allCountries: string[] = [
    'Argentina', 'Australia', 'Belgium', 'Brazil', 'Canada', 'Denmark',
    'Egypt', 'France', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico',
    'Norway', 'Portugal', 'Vietnam',
  ];

  private readonly allCountryObjects: Country[] = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Australia', code: 'AU' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Canada', code: 'CA' },
    { name: 'Denmark', code: 'DK' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Vietnam', code: 'VN' },
  ];

  readonly country            = signal<string | null>(null);
  readonly filteredCountries  = signal<string[]>([]);

  readonly countryObj             = signal<Country | null>(null);
  readonly filteredCountryObjects = signal<Country[]>([]);

  readonly countries    = signal<string[]>([]);
  readonly filteredMulti = signal<string[]>([]);

  search(query: string): void {
    const q = query.toLowerCase();
    this.filteredCountries.set(this.allCountries.filter((c) => c.toLowerCase().includes(q)));
  }

  searchObjects(query: string): void {
    const q = query.toLowerCase();
    this.filteredCountryObjects.set(
      this.allCountryObjects.filter((c) => c.name.toLowerCase().includes(q))
    );
  }

  searchMulti(query: string): void {
    const q = query.toLowerCase();
    this.filteredMulti.set(this.allCountries.filter((c) => c.toLowerCase().includes(q)));
  }
}
