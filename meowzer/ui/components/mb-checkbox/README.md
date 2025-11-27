# mb-checkbox

Custom checkbox component with support for checked, indeterminate, and error states.

## Installation

```typescript
import { MbCheckbox } from "@meowzer/ui";
import "@meowzer/ui/components/mb-checkbox/mb-checkbox.js";
```

## Usage

### Basic

```html
<mb-checkbox>Subscribe to newsletter</mb-checkbox>
```

### Checked

```html
<mb-checkbox checked>I agree to the terms</mb-checkbox>
```

### Indeterminate

```html
<mb-checkbox indeterminate>Select all</mb-checkbox>
```

### With Helper Text

```html
<mb-checkbox helper="You'll receive weekly updates">
  Subscribe to updates
</mb-checkbox>
```

### With Error

```html
<mb-checkbox error error-message="This field is required">
  Required option
</mb-checkbox>
```

### Disabled

```html
<mb-checkbox disabled>Disabled option</mb-checkbox>
```

### In a Form

```html
<form>
  <mb-checkbox name="newsletter" value="yes">
    Subscribe to newsletter
  </mb-checkbox>

  <mb-checkbox name="terms" value="accepted" required>
    I agree to the terms
  </mb-checkbox>
</form>
```

## API

### Properties

| Property        | Type      | Default | Description                                    |
| --------------- | --------- | ------- | ---------------------------------------------- |
| `checked`       | `boolean` | `false` | Whether the checkbox is checked                |
| `indeterminate` | `boolean` | `false` | Whether the checkbox is in indeterminate state |
| `disabled`      | `boolean` | `false` | Whether the checkbox is disabled               |
| `helper`        | `string`  | `""`    | Helper text displayed below checkbox           |
| `error-message` | `string`  | `""`    | Error message displayed when error is true     |
| `error`         | `boolean` | `false` | Whether the checkbox is in error state         |
| `name`          | `string`  | `""`    | Name attribute for form submission             |
| `value`         | `string`  | `""`    | Value attribute for form submission            |
| `required`      | `boolean` | `false` | Whether the checkbox is required               |

### Events

| Event       | Detail                                | Description                       |
| ----------- | ------------------------------------- | --------------------------------- |
| `mb-change` | `{ checked: boolean, value: string }` | Fired when checkbox state changes |

### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| (default) | Checkbox label content |

### CSS Custom Properties

| Property                         | Default | Description              |
| -------------------------------- | ------- | ------------------------ |
| `--mb-color-interactive-primary` | -       | Checked state background |
| `--mb-color-border-subtle`       | -       | Default border color     |
| `--mb-color-text-primary`        | -       | Label text color         |
| `--mb-color-feedback-error`      | -       | Error state color        |

### CSS Parts

| Part        | Description               |
| ----------- | ------------------------- |
| `checkbox`  | The checkbox container    |
| `input`     | The input element         |
| `box`       | The visual checkbox box   |
| `label`     | The label element         |
| `helper`    | The helper text element   |
| `error`     | The error message element |
| `checkmark` | The checkmark SVG         |
| `dash`      | The indeterminate dash    |

## Migration from Carbon

### Before (Carbon Web Components)

```html
<cds-checkbox
  ?checked=${this.makeRoaming}
  @change=${(e: Event) => {
    this.makeRoaming = (e.target as HTMLInputElement).checked;
  }}
>
  Make cat roam the viewport
</cds-checkbox>
```

### After (mb-checkbox)

```html
<mb-checkbox
  ?checked=${this.makeRoaming}
  @mb-change=${(e: CustomEvent) => {
    this.makeRoaming = e.detail.checked;
  }}
>
  Make cat roam the viewport
</mb-checkbox>
```

### Key Differences

1. **Event name**: `change` → `mb-change`
2. **Event detail**: Access via `e.detail.checked` instead of `(e.target as HTMLInputElement).checked`
3. **Helper text**: Use `helper` property instead of `helper-text`
4. **Error message**: Use `error-message` property

## Accessibility

- Uses semantic `<input type="checkbox">` element
- Proper `aria-checked` attribute (true/false/mixed for indeterminate)
- Supports keyboard navigation
- `aria-invalid` attribute for error states
- CSS parts for custom styling

## Examples

### Select All Pattern

```typescript
let allChecked = false;

const handleSelectAll = (e: CustomEvent) => {
  allChecked = e.detail.checked;
  // Update all child checkboxes
};

const handleChildChange = () => {
  // Update parent checkbox to indeterminate if some selected
};
```

```html
<mb-checkbox
  ?checked="${allChecked}"
  ?indeterminate="${someChecked"
  &&
  !allChecked}
  @mb-change="${handleSelectAll}"
>
  Select all
</mb-checkbox>
```
