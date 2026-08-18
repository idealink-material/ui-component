1. check p-multi-select style , make it same as p-select 
2. autocomplete 
   1. template working on object that has fields code & name only 
      <p-auto-complete placeholder="Add countries…" [multiple]="true" optionLabel="name"
      [suggestions]="filteredCountryObjects()"
      (completeMethod)="searchObjects($event)"
      [(value)]="customItemCountries">
      <ng-template #selectedItem let-c>
      <span class="continent-dot" [style.background]="continentColor(c.code)"></span>{{ c.code }} - {{ c.name }}
      </ng-template>
      <ng-template #item let-c>
      <span class="continent-dot" [style.background]="continentColor(c.code)"></span>{{ c.code }} -{{ c.name }}
      </ng-template>
      </p-auto-complete>
   2. i try another object like above it's not working (my purpose want to show customerNo - customerName ) in selected input also
      <p-auto-complete placeholder="Add countries…"  optionLabel="customerName" [dropdown]="true"
      [suggestions]="customerOptions()"
      [(value)]="customer">
      <ng-template #selectedItem let-c>
      <span class="continent-dot" >{{ c.customerCode }} - {{ c.customerName }}</span>
      </ng-template>
      <ng-template #item let-c>
      <span class="continent-dot" >{{ c.customerCode }} - {{ c.customerName }}</span>
      </ng-template>
      </p-auto-complete>
3. example usage not enough, let add sample in typescript also
