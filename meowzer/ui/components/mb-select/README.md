# mb-select

Custom select dropdown component with support for placeholder, helper text, and error states.

## Installation

```typescript
import { MbSelect } from "@meowzer/ui";
import "@meowzer/ui/components/mb-select/mb-select.js";
```

## Usage

### Basic

```html
<mb-select label="Choose an option">
  <option value="a">Option A</option>
  <option value="b">Option B</option>
  <option value="c">Option C</option>
</mb-select>
```

### With Placeholder

```html
<mb-select label="Pattern" placeholder="Select a pattern">
  <option value="solid">Solid</option>
  <option value="tabby">Tabby</option>
  <option value="spotted">Spotted</option>
</mb-select>
```

### With Value

```html
<mb-select label="Color" value="orange">
  <option value="black">Black</option>
  <option value="white">White</option>
  <option value="orange">Orange</option>
</mb-select>
```

### With Helper Text

```html
<mb-select
  label="Category"
  helper="Choose the most appropriate category"
  placeholder="Select a category"
>
  <option value="cats">Cats</option>
  <option value="dogs">Dogs</option>
</mb-select>
```

### With Error

```html
<mb-select
  label="Required field"
  error
  error-message="This field is required"
  placeholder="Select an option"
>
  <option value="yes">Yes</option>
  <option value="no">No</option>
</mb-select>
```

### Size Variants

```html
<mb-select label="Small" size="sm">
  <option value="a">Option A</option>
</mb-select>

<mb-select label="Medium (Default)" size="md">
  <option value="a">Option A</option>
</mb-select>

<mb-select label="Large" size="lg">
  <option value="a">Option A</option>
</mb-select>
```

### In a Form

```html
<form>
  <mb-select name="pattern" label="Pattern" placeholder="Select">
    <option value="solid">Solid</option>
    <option value="tabby">Tabby</option>
  </mb-select>

  <mb-select name="personality" label="Personality" required>
    <option value="">Select a preset</option>
    <option value="playful">Playful</option>
    <option value="lazy">Lazy</option>
  </mb-select>
</form>
```

## API

### Properties

| Property        | Type                   | Default | Description                                 |
| --------------- | ---------------------- | ------- | ------------------------------------------- |
| `label`         | `string`               | `""`    | Label text for the select                   |
| `value`         | `string`               | `""`    | Selected value                              |
| `helper`        | `string`               | `""`    | Helper text displayed below select          |
| `error-message` | `string`               | `""`    | Error message displayed when error is true  |
| `error`         | `boolean`              | `false` | Whether the select is in error state        |
| `disabled`      | `boolean`              | `false` | Whether the select is disabled              |
| `required`      | `boolean`              | `false` | Whether the select is required              |
| `name`          | `string`               | `""`    | Name attribute for form submission          |
| `size`          | `"sm" \| "md" \| "lg"` | `"md"`  | Size variant                                |
| `placeholder`   | `string`               | `""`    | Placeholder text when no option is selected |

### Methods

| Method    | Description              |
| --------- | ------------------------ |
| `focus()` | Focus the select element |
| `blur()`  | Blur the select element  |

### Events

| Event       | Detail              | Description                       |
| ----------- | ------------------- | --------------------------------- |
| `mb-change` | `{ value: string }` | Fired when selected value changes |

### Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| (default) | Select options (use native `<option>` elements) |

### CSS Custom Properties

| Property                         | Default | Description                   |
| -------------------------------- | ------- | ----------------------------- |
| `--mb-color-interactive-primary` | -       | Focus and hover color         |
| `--mb-color-border-subtle`       | -       | Default border color          |
| `--mb-color-text-primary`        | -       | Label and selected text color |
| `--mb-color-feedback-error`      | -       | Error state color             |

### CSS Parts

| Part      | Description               |
| --------- | ------------------------- |
| `select`  | The select container      |
| `label`   | The label element         |
| `native`  | The native select element |
| `chevron` | The chevron icon          |
| `helper`  | The helper text element   |
| `error`   | The error message element |

## Accessibility

- Uses semantic native `<select>` element
- Proper label association
- Supports keyboard navigation (arrow keys, Enter, Space)
- `aria-invalid` attribute for error states
- `aria-describedby` for helper text and error messages
- CSS parts for custom styling

## Examples

### Form Validation

```typescript
const handleSubmit = (e: Event) => {
  e.preventDefault();
  const select = document.querySelector("mb-select");

  if (!select.value) {
    select.error = true;
    select.errorMessage = "Please select an option";
  } else {
    // Submit form
  }
};
```

### Dynamic Options

```html
<mb-select
  label="Category"
  .value="${selectedCategory}"
  @mb-change="${handleChange}"
>
  ${categories.map(cat => html`
  <option value="${cat.id}">${cat.name}</option>
  `)}
</mb-select>
```
