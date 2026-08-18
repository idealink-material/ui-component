import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { CuiAutoCompleteComponent } from '@idealink-material/ui-core';

import { DocExampleComponent } from '../shared/doc-example/doc-example.component';
import { DocShellComponent } from '../shared/doc-shell/doc-shell.component';
import { DocApiEmitter, DocApiProperty, DocSection } from '../shared/doc-types';

interface Country {
  name: string;
  code: string;
  [key: string]: unknown;
}
export interface LookupOption {
  [key: string]: unknown;
  id: number;
  dataName: string;
  dataNameKh: string;
}
export interface Customer {
  [key: string]: unknown;
  id: number;
  customerNo: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  email: string;
}
export interface Product {
  [key: string]: unknown;
  id: number;
  productCode: string;
  productName: string;
  productCodeKh: string;
  qty: number;
  price: string;
}
@Component({
  selector: 'app-autocomplete-doc',
  imports: [
    CuiAutoCompleteComponent,
    DocExampleComponent,
    DocShellComponent,
    JsonPipe,
  ],
  templateUrl: './autocomplete-doc.component.html',
  styleUrl: './autocomplete-doc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteDocComponent {
  readonly featureSections: DocSection[] = [
    { id: 'basic', label: 'Basic usage' },
    { id: 'objects', label: 'Object suggestions' },
    { id: 'option-value', label: 'Dynamic object binding' },
    { id: 'custom-item', label: 'Custom item content' },
    { id: 'label', label: 'Label' },
    { id: 'multiple', label: 'Multiple selection' },
    { id: 'dropdown', label: 'Dropdown & states' },
    { id: 'customer-model', label: 'Customer model' },
    { id: 'product-model', label: 'Product model' },
  ];

  readonly themingSections: DocSection[] = [{ id: 'theming-tokens', label: 'Design tokens' }];

  readonly properties: DocApiProperty[] = [
    {
      name: 'label',
      type: 'string',
      default: `''`,
      description: 'Floating label text, shown above the field.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Marks the field required, showing a * next to the label.',
    },
    {
      name: 'inputId',
      type: 'string | undefined',
      default: 'undefined',
      description:
        'Identifier of the accessible input element. Falls back to an auto-generated id.',
    },
    {
      name: 'suggestions',
      type: 'T[]',
      default: '[]',
      description: 'Suggestion list currently shown in the panel.',
    },
    {
      name: 'optionLabel',
      type: 'string | undefined',
      default: 'undefined',
      description: 'Name of the label field of a suggestion, for plain-record suggestions.',
    },
    {
      name: 'optionValue',
      type: 'string | undefined',
      default: 'undefined',
      description:
        'Name of the value field of a suggestion. When unset, the whole suggestion object is used as the value.',
    },
    {
      name: 'dataKey',
      type: 'string | undefined',
      default: 'undefined',
      description:
        'Property to uniquely identify a value in suggestions, used to compare values by key instead of by reference.',
    },
    {
      name: 'dropdown',
      type: 'boolean',
      default: 'false',
      description:
        'Shows a trailing button that opens the panel with the current suggestions list.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Allows selecting more than one suggestion.',
    },
    {
      name: 'minLength',
      type: 'number',
      default: '1',
      description: 'Minimum input length before completeMethod is triggered.',
    },
    {
      name: 'delay',
      type: 'number',
      default: '300',
      description: 'Debounce, in ms, before completeMethod fires after typing stops.',
    },
    {
      name: 'forceSelection',
      type: 'boolean',
      default: 'false',
      description: 'Clears the input text on blur if it does not match a current suggestion.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the field and blocks interaction.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `''`,
      description: 'Placeholder shown in the input.',
    },
    {
      name: 'completeOnFocus',
      type: 'boolean',
      default: 'false',
      description: 'Fires completeMethod immediately when the input receives focus.',
    },
    {
      name: 'value',
      type: 'T | T[] | null | undefined',
      default: 'null',
      description:
        'Two-way bindable selected value(s) via [(value)] or formControlName. Accepts undefined so binding optional source fields type-checks without a cast.',
    },
  ];

  readonly emitters: DocApiEmitter[] = [
    {
      name: 'completeMethod',
      type: 'EventEmitter<string>',
      description:
        'Emitted with the current query text; populate suggestions() from a handler on this event.',
    },
    {
      name: 'onSelect',
      type: 'EventEmitter<T>',
      description: 'Emitted with the selected item when a suggestion is chosen.',
    },
    {
      name: 'onUnselect',
      type: 'EventEmitter<T>',
      description:
        'Emitted with the removed item (multiple mode) when a selected chip is dismissed.',
    },
    {
      name: 'onClear',
      type: 'EventEmitter<void>',
      description: 'Emitted when the clear button is used.',
    },
    {
      name: 'onDropdownClick',
      type: 'EventEmitter<void>',
      description: 'Emitted when the dropdown trigger button is clicked.',
    },
  ];

  private readonly allCountries: string[] = [
    'Argentina',
    'Australia',
    'Belgium',
    'Brazil',
    'Canada',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'India',
    'Indonesia',
    'Italy',
    'Japan',
    'Kenya',
    'Mexico',
    'Netherlands',
    'Norway',
    'Poland',
    'Portugal',
    'Singapore',
    'South Korea',
    'Spain',
    'Sweden',
    'Switzerland',
    'Thailand',
    'Turkey',
    'Vietnam',
  ];

  private readonly allLookupOptions: LookupOption[] = this.allCountries.map((name, id) => ({
    id,
    dataName: name,
    dataNameKh: name,
  }));

  private readonly allCountryObjects: Country[] = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Australia', code: 'AU' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Canada', code: 'CA' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Greece', code: 'GR' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Italy', code: 'IT' },
    { name: 'Japan', code: 'JP' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Norway', code: 'NO' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Singapore', code: 'SG' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Vietnam', code: 'VN' },
  ];
  private customerData = signal<Customer[]>([
    {
      id: 0,
      customerNo: '099383',
      customerName: 'Dara',
      phoneNumber: '0870377373',
      gender: 'M',
      email: 'dara@gmail.com',
    },
    {
      id: 0,
      customerNo: '009776',
      customerName: 'Chantanha',
      phoneNumber: '0870377373',
      gender: 'M',
      email: 'dara@gmail.com',
    },
    {
      id: 0,
      customerNo: '95048548',
      customerName: 'KTAFA',
      phoneNumber: '0870377373',
      gender: 'M',
      email: 'dara@gmail.com',
    },
  ]);
  readonly customer = signal<Customer | null>(null);
  readonly customerOptions = signal<Customer[]>([]);

  private readonly productData: Product[] = [
    { id: 0, productCode: 'PRD-001', productName: 'Wireless Mouse', productCodeKh: 'ម៉ោស៍', qty: 120, price: '9.99' },
    { id: 1, productCode: 'PRD-002', productName: 'Mechanical Keyboard', productCodeKh: 'ក្តារចុច', qty: 45, price: '59.00' },
    { id: 2, productCode: 'PRD-003', productName: 'USB-C Hub', productCodeKh: 'ហាប់', qty: 200, price: '24.50' },
  ];
  readonly productOptions = signal<Product[]>([]);
  readonly productCode = signal<string | null>(null);

  readonly country = signal<string | null>(null);
  readonly filteredCountries = signal<string[]>([]);

  readonly countryObj = signal<Country | null>(null);
  readonly filteredCountryObjects = signal<Country[]>([]);

  readonly countryCodes = signal<string[]>([]);

  readonly countries = signal<LookupOption[]>([]);
  readonly filteredMulti = signal<LookupOption[]>([]);

  readonly customItemCountries = signal<Country[]>([
    this.allCountryObjects[0],
    this.allCountryObjects[1],
    this.allCountryObjects[2],
  ]);

  // Kept as a TS string (rather than an inline template attribute) because it
  // contains literal `{{ }}` — Angular's HTML parser decodes entities before
  // scanning for interpolation, so escaping them in the template doesn't work.
  readonly customItemCode = `<p-auto-complete placeholder="Add countries…" [multiple]="true" optionLabel="name"
  [suggestions]="filteredCountryObjects()"
  (completeMethod)="searchObjects($event)"
  [(value)]="customItemCountries">
  <ng-template #selectedItem let-c>
    <span class="continent-dot" [style.background]="continentColor(c.code)"></span>{{ c.name }}
  </ng-template>
  <ng-template #item let-c>
    <span class="continent-dot" [style.background]="continentColor(c.code)"></span>{{ c.name }}
  </ng-template>
</p-auto-complete>`;

  readonly customerModelCode = `interface Customer {
  id: number;
  customerNo: string;
  customerName: string;
  phoneNumber: string;
  gender: string;
  email: string;
}

readonly customer = signal<Customer | null>(null);
readonly customerOptions = signal<Customer[]>([]);

searchCustomer(query: string): void {
  const q = query.toLowerCase();
  this.customerOptions.set(
    this.allCustomers.filter((c) => c.customerName.toLowerCase().includes(q)),
  );
}`
    + `

<p-auto-complete placeholder="Search a customer…" optionLabel="customerName" [dropdown]="true"
  [suggestions]="customerOptions()"
  (completeMethod)="searchCustomer($event)"
  [(value)]="customer">
  <ng-template #selectedItem let-c>
    <span>{{ c.customerNo }} - {{ c.customerName }}</span>
  </ng-template>
  <ng-template #item let-c>
    <span>{{ c.customerNo }} - {{ c.customerName }}</span>
  </ng-template>
</p-auto-complete>`;

  readonly productModelCode = `interface Product {
  id: number;
  productCode: string;
  productName: string;
  qty: number;
  price: string;
}

readonly productOptions = signal<Product[]>([]);
readonly productCode = signal<string | null>(null); // bound value is the scalar productCode

searchProduct(query: string): void {
  const q = query.toLowerCase();
  this.productOptions.set(
    this.allProducts.filter((p) => p.productName.toLowerCase().includes(q)),
  );
}`
    + `

<p-auto-complete placeholder="Search a product…" optionLabel="productName" optionValue="productCode" [dropdown]="true"
  [suggestions]="productOptions()"
  (completeMethod)="searchProduct($event)"
  [(value)]="productCode">
  <ng-template #selectedItem let-p>
    <span>{{ p.productCode }} - {{ p.productName }}</span>
  </ng-template>
  <ng-template #item let-p>
    <span>{{ p.productCode }} - {{ p.productName }}</span>
  </ng-template>
</p-auto-complete>`;

  private readonly continentColors: Record<string, string> = {
    AR: '#f97316',
    BR: '#f97316',
    CA: '#f97316',
    MX: '#f97316',
    BE: '#3b82f6',
    DK: '#3b82f6',
    FI: '#3b82f6',
    FR: '#3b82f6',
    DE: '#3b82f6',
    GR: '#3b82f6',
    IT: '#3b82f6',
    NL: '#3b82f6',
    NO: '#3b82f6',
    PL: '#3b82f6',
    PT: '#3b82f6',
    ES: '#3b82f6',
    SE: '#3b82f6',
    CH: '#3b82f6',
    IN: '#22c55e',
    ID: '#22c55e',
    JP: '#22c55e',
    SG: '#22c55e',
    KR: '#22c55e',
    TH: '#22c55e',
    TR: '#22c55e',
    VN: '#22c55e',
    EG: '#eab308',
    KE: '#eab308',
    AU: '#a855f7',
  };
  constructor() {
    this.customerOptions.set(this.customerData());
    this.productOptions.set(this.productData);
  }
  continentColor(code: string): string {
    return this.continentColors[code] ?? '#9ca3af';
  }

  search(query: any): void {
    const q = query.toLowerCase();
    this.filteredCountries.set(this.allCountries.filter((c) => c.toLowerCase().includes(q)));
  }

  searchObjects(query: any): void {
    const q = query.toLowerCase();
    this.filteredCountryObjects.set(
      this.allCountryObjects.filter((c) => c.name.toLowerCase().includes(q)),
    );
  }

  searchMulti(query: string): void {
    const q = query.toLowerCase();
    this.filteredMulti.set(
      this.allLookupOptions.filter((o) => o.dataName.toLowerCase().includes(q)),
    );
  }
  searchCustomer(query: string): void {
    const q = query.toLowerCase();
    this.customerOptions.set(
      this.customerData().filter((c) => c.customerName.toLowerCase().includes(q)),
    );
  }
  searchProduct(query: string): void {
    const q = query.toLowerCase();
    this.productOptions.set(
      this.productData.filter((p) => p.productName.toLowerCase().includes(q)),
    );
  }
}
