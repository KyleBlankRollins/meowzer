# mb-text-input

A text input component for single-line text entry with label, helper text, and error states.

## Features

- **Multiple Input Types**: text, email, password, tel, url, search
- **Label Support**: Optional label with required indicator (\*)
- **Helper Text**: Additional guidance below the input
- **Error States**: Visual feedback and error messages
- **Validation**: Built-in required and maxlength attributes
- **Disabled State**: Visual and functional disabled state
- **Focus Management**: Programmatic focus/blur methods
- **Events**: Input, change, focus, blur events
- **Accessible**: ARIA attributes, semantic HTML
- **Customizable**: CSS parts for external styling

## Usage

### Basic Usage

```html
<mb-text-input
  label="Username"
  placeholder="Enter username"
></mb-text-input>
```

### With Helper Text

```html
<mb-text-input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helper="We'll never share your email with anyone else"
></mb-text-input>
```

### Required Field

```html
<mb-text-input
  label="Full Name"
  placeholder="John Doe"
  required
></mb-text-input>
```

### Error State

```html
<mb-text-input
  label="Password"
  type="password"
  error
  error-message="Password must be at least 8 characters"
></mb-text-input>
```

### Event Handling

```html
<mb-text-input
  label="Search"
  @mb-input="${handleInput}"
  @mb-change="${handleChange}"
></mb-text-input>
```

## API

### Properties

| Property        | Type      | Default  | Description                                          |
| --------------- | --------- | -------- | ---------------------------------------------------- |
| `label`         | `string`  | `''`     | Label text for the input                             |
| `value`         | `string`  | `''`     | Current value of the input                           |
| `placeholder`   | `string`  | `''`     | Placeholder text                                     |
| `helper`        | `string`  | `''`     | Helper text displayed below input                    |
| `error-message` | `string`  | `''`     | Error message displayed when error is true           |
| `error`         | `boolean` | `false`  | Whether the input is in error state                  |
| `required`      | `boolean` | `false`  | Whether the input is required                        |
| `disabled`      | `boolean` | `false`  | Whether the input is disabled                        |
| `type`          | `string`  | `'text'` | Input type (text, email, password, tel, url, search) |
| `maxlength`     | `number`  | -        | Maximum length of input value                        |
| `name`          | `string`  | `''`     | Name attribute for form submission                   |
| `autocomplete`  | `string`  | `''`     | Autocomplete attribute                               |

### Methods

| Method    | Description             |
| --------- | ----------------------- |
| `focus()` | Focus the input element |
| `blur()`  | Blur the input element  |

### Events

| Event       | Detail                          | Description                                         |
| ----------- | ------------------------------- | --------------------------------------------------- |
| `mb-input`  | `{ value: string }`             | Fired when the input value changes                  |
| `mb-change` | `{ value: string }`             | Fired when the input loses focus after value change |
| `mb-focus`  | `{ originalEvent: FocusEvent }` | Fired when the input gains focus                    |
| `mb-blur`   | `{ originalEvent: FocusEvent }` | Fired when the input loses focus                    |

### CSS Parts

| Part              | Description                 |
| ----------------- | --------------------------- |
| `input-container` | The input container element |
| `label`           | The label element           |
| `input`           | The input element           |
| `helper`          | The helper text element     |
| `error`           | The error message element   |

## Examples

### Form with Validation

```html
<form>
  <mb-text-input
    label="Full Name"
    placeholder="John Doe"
    required
  ></mb-text-input>

  <mb-text-input
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
    helper="We'll send a confirmation email"
  ></mb-text-input>

  <mb-text-input
    label="Password"
    type="password"
    placeholder="At least 8 characters"
    required
  ></mb-text-input>
</form>
```

### Real-time Validation

```javascript
const emailInput = document.querySelector("mb-text-input");

emailInput.addEventListener("mb-input", (e) => {
  const value = e.detail.value;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (value && !isValid) {
    emailInput.error = true;
    emailInput.errorMessage = "Please enter a valid email address";
  } else {
    emailInput.error = false;
    emailInput.errorMessage = "";
  }
});
```

### Character Counter

```javascript
const input = document.querySelector("mb-text-input");
const maxLength = 50;

input.maxlength = maxLength;

input.addEventListener("mb-input", (e) => {
  const remaining = maxLength - e.detail.value.length;
  console.log(`${remaining} characters remaining`);
});
```

### Different Input Types

```html
<!-- Email -->
<mb-text-input
  label="Email"
  type="email"
  placeholder="you@example.com"
></mb-text-input>

<!-- Password -->
<mb-text-input
  label="Password"
  type="password"
  placeholder="Enter password"
></mb-text-input>

<!-- Phone -->
<mb-text-input
  label="Phone"
  type="tel"
  placeholder="(123) 456-7890"
></mb-text-input>

<!-- URL -->
<mb-text-input
  label="Website"
  type="url"
  placeholder="https://example.com"
></mb-text-input>

<!-- Search -->
<mb-text-input
  label="Search"
  type="search"
  placeholder="Search..."
></mb-text-input>
```

### Programmatic Focus

```javascript
const input = document.querySelector("mb-text-input");

// Focus the input
input.focus();

// Blur the input
input.blur();
```

### Custom Styling via Parts

```css
mb-text-input::part(input-container) {
  margin-bottom: 1.5rem;
}

mb-text-input::part(label) {
  font-size: 1rem;
  font-weight: 700;
}

mb-text-input::part(input) {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
}

mb-text-input::part(helper) {
  font-style: italic;
}

mb-text-input::part(error) {
  font-weight: 600;
}
```

## Design Tokens

This component uses the following design tokens:

### Colors

- `--mb-color-interactive-primary` - Focus border color
- `--mb-color-border-subtle` - Default border color
- `--mb-color-text-primary` - Input text and label color
- `--mb-color-text-secondary` - Helper text color
- `--mb-color-text-placeholder` - Placeholder text color
- `--mb-color-text-disabled` - Disabled text color
- `--mb-color-surface-default` - Input background
- `--mb-color-surface-disabled` - Disabled background
- `--mb-color-feedback-error` - Error state color

### Spacing

- `--mb-space-xs` - Internal spacing
- `--mb-space-sm` - Input padding

### Typography

- `--mb-font-size-base` - Input text size
- `--mb-font-size-small` - Label, helper, error text size
- `--mb-font-weight-medium` - Label font weight

### Borders

- `--mb-radius-small` - Input border radius

## Accessibility

- Proper ARIA attributes (`aria-label`, `aria-invalid`, `aria-describedby`)
- Keyboard accessible (Tab, Enter for forms)
- Focus indicators
- Semantic HTML (`<label>`, `<input>`)
- Required indicator (\*)
- Error announcements linked to input

## Use Cases

### Cat Creator Forms

Name input in cat creation wizard.

### User Registration

Email, password, name fields in signup forms.

### Search Functionality

Search inputs with real-time filtering.

### Settings/Preferences

Text configuration fields.

### Contact Forms

Name, email, phone, message fields.

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- Native `<input>` element
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- `mb-textarea` - For multi-line text entry
- `mb-select` - For selection from options
- `mb-checkbox` - For boolean input
- Future: `mb-number-input` - For numeric values
