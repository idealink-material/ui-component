
Please review all component implementation and check **all existing example usage code** again.

### Objective

Please update the example/demo section so that every example clearly demonstrates:

1. How to import/use the component
2. Required inputs
3. Optional inputs
4. Available outputs/events
5. Typical usage scenarios
6. Expected TypeScript configuration
7. Expected HTML template usage

### UI Requirement

For each example, provide **two tabs**:

* **HTML**
* **TypeScript**

The user should be able to switch between the two tabs and see the complete corresponding code.

Example structure:

```text
Example Usage
┌────────┬──────────────┐
│ HTML   │ TypeScript   │
└────────┴──────────────┘

[code example]
```

### Example Requirements

For each component example:

#### HTML Tab

Show the complete template usage, including:

* Component selector
* Required inputs
* Optional inputs
* Event bindings
* Form bindings if applicable
* Signals/bindings if applicable
* Realistic sample data

Example:

```html
<app-my-component
  [title]="title()"
  [items]="items()"
  [loading]="isLoading()"
  (save)="onSave($event)"
  (cancel)="onCancel()">
</app-my-component>
```

#### TypeScript Tab

Show the corresponding TypeScript code required for the HTML example.

Include:

* Imports
* Component configuration
* Signals
* Models/interfaces where necessary
* Sample data
* Event handlers
* Methods used by the HTML example

Example:

```typescript
import { Component, signal } from '@angular/core';
import { MyComponent } from './my-component';

@Component({
  selector: 'app-example',
  imports: [MyComponent],
  templateUrl: './example.html'
})
export class ExampleComponent {

  title = signal('Example');

  items = signal([
    // sample data
  ]);

  isLoading = signal(false);

  onSave(event: unknown): void {
    console.log('Save:', event);
  }

  onCancel(): void {
    console.log('Cancel');
  }
}
```

### Important

Please do **not** redesign or rewrite my existing custom component unless there is an actual issue.

Focus on:

* Reviewing the current component API
* Checking all example usage code
* Fixing incorrect examples
* Adding missing examples
* Making every example copy-paste friendly
* Keeping HTML and TypeScript examples synchronized
* Using the actual component inputs/outputs from my implementation
* Following the project's existing Angular coding style
* Using Angular Signals where the project already uses Signals

### Review Checklist

Before finishing, verify:

* [ ] Every component has at least one complete usage example
* [ ] Every example has an **HTML** tab
* [ ] Every example has a **TypeScript** tab
* [ ] HTML bindings match the actual component API
* [ ] TypeScript properties/methods match the HTML
* [ ] Inputs are correctly documented
* [ ] Outputs/events are correctly demonstrated
* [ ] Required inputs are included
* [ ] Optional inputs are demonstrated where useful
* [ ] No obsolete or incorrect API is used
* [ ] Examples are copy-paste friendly
* [ ] Existing component implementation is preserved unless a bug is found

Please first inspect the existing component implementation and all current examples, then update the example usage section accordingly.
