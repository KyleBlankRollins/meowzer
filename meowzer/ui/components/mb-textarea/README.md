# mb-textarea

A textarea component for multi-line text entry with label, helper text, error states, and character counting.

## Features

- **Multi-line Input**: Configurable number of rows
- **Resizable**: Optional vertical resize (default: enabled)
- **Character Counter**: Track character usage with visual feedback
- **Label Support**: Optional label with required indicator (\*)
- **Helper Text**: Additional guidance below the textarea
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
<mb-textarea
  label="Description"
  placeholder="Enter description"
  rows="4"
></mb-textarea>
```

### With Character Counter

```html
<mb-textarea
  label="Bio"
  placeholder="Tell us about yourself"
  maxlength="500"
  show-counter
  helper="Keep it brief and interesting"
></mb-textarea>
```

### Required Field

```html
<mb-textarea
  label="Message"
  placeholder="Your message"
  rows="5"
  required
></mb-textarea>
```

### Non-resizable

```html
<mb-textarea
  label="Fixed Size"
  rows="4"
  resizable="false"
></mb-textarea>
```

### Error State

```html
<mb-textarea
  label="Comments"
  error
  error-message="Comments must be at least 50 characters"
></mb-textarea>
```

### Event Handling

```html
<mb-textarea
  label="Feedback"
  @mb-input="${handleInput}"
  @mb-change="${handleChange}"
></mb-textarea>
```

## API

### Properties

| Property        | Type                | Default  | Description                                |
| --------------- | ------------------- | -------- | ------------------------------------------ |
| `label`         | `string`            | `''`     | Label text for the textarea                |
| `value`         | `string`            | `''`     | Current value of the textarea              |
| `placeholder`   | `string`            | `''`     | Placeholder text                           |
| `helper`        | `string`            | `''`     | Helper text displayed below textarea       |
| `error-message` | `string`            | `''`     | Error message displayed when error is true |
| `error`         | `boolean`           | `false`  | Whether the textarea is in error state     |
| `required`      | `boolean`           | `false`  | Whether the textarea is required           |
| `disabled`      | `boolean`           | `false`  | Whether the textarea is disabled           |
| `rows`          | `number`            | `3`      | Number of visible text rows                |
| `maxlength`     | `number`            | -        | Maximum length of textarea value           |
| `show-counter`  | `boolean`           | `false`  | Whether to show character counter          |
| `resizable`     | `'true' \| 'false'` | `'true'` | Whether the textarea is resizable          |
| `name`          | `string`            | `''`     | Name attribute for form submission         |
| `autocomplete`  | `string`            | `''`     | Autocomplete attribute                     |

### Methods

| Method    | Description                |
| --------- | -------------------------- |
| `focus()` | Focus the textarea element |
| `blur()`  | Blur the textarea element  |

### Events

| Event       | Detail                          | Description                                            |
| ----------- | ------------------------------- | ------------------------------------------------------ |
| `mb-input`  | `{ value: string }`             | Fired when the textarea value changes                  |
| `mb-change` | `{ value: string }`             | Fired when the textarea loses focus after value change |
| `mb-focus`  | `{ originalEvent: FocusEvent }` | Fired when the textarea gains focus                    |
| `mb-blur`   | `{ originalEvent: FocusEvent }` | Fired when the textarea loses focus                    |

### CSS Parts

| Part                 | Description                    |
| -------------------- | ------------------------------ |
| `textarea-container` | The textarea container element |
| `label`              | The label element              |
| `textarea`           | The textarea element           |
| `helper`             | The helper text element        |
| `error`              | The error message element      |
| `counter`            | The character counter element  |

## Examples

### Contact Form

```html
<mb-textarea
  label="Message"
  placeholder="How can we help?"
  rows="6"
  required
  maxlength="1000"
  show-counter
  helper="Please provide as much detail as possible"
></mb-textarea>
```

### Cat Description (like in cat-creator)

```html
<mb-textarea
  label="Description"
  placeholder="Describe your cat's personality, habits, and quirks..."
  rows="5"
  maxlength="500"
  show-counter
  helper="Share what makes your cat unique"
></mb-textarea>
```

### Real-time Validation

```javascript
const textarea = document.querySelector("mb-textarea");
const minLength = 50;

textarea.addEventListener("mb-input", (e) => {
  const value = e.detail.value;

  if (value.length > 0 && value.length < minLength) {
    textarea.error = true;
    textarea.errorMessage = `Please enter at least ${minLength} characters`;
  } else {
    textarea.error = false;
    textarea.errorMessage = "";
  }
});
```

### Character Counter with Visual Feedback

The character counter automatically shows visual feedback:

- **Normal**: Gray text (plenty of characters remaining)
- **Warning**: Yellow/orange text (approaching limit, <10% remaining)
- **Error**: Red text (at or over limit)

```html
<mb-textarea
  label="Tweet"
  maxlength="280"
  show-counter
  placeholder="What's happening?"
></mb-textarea>
```

### Different Sizes

```html
<!-- Small -->
<mb-textarea label="Small" rows="3"></mb-textarea>

<!-- Medium -->
<mb-textarea label="Medium" rows="5"></mb-textarea>

<!-- Large -->
<mb-textarea label="Large" rows="8"></mb-textarea>
```

### Programmatic Focus

```javascript
const textarea = document.querySelector("mb-textarea");

// Focus the textarea
textarea.focus();

// Blur the textarea
textarea.blur();
```

### Custom Styling via Parts

```css
mb-textarea::part(textarea-container) {
  margin-bottom: 1.5rem;
}

mb-textarea::part(label) {
  font-size: 1rem;
  font-weight: 700;
}

mb-textarea::part(textarea) {
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  min-height: 100px;
}

mb-textarea::part(counter) {
  font-weight: 600;
}

mb-textarea::part(helper) {
  font-style: italic;
}

mb-textarea::part(error) {
  font-weight: 600;
}
```

## Design Tokens

This component uses the following design tokens:

### Colors

- `--mb-color-interactive-primary` - Focus border color
- `--mb-color-border-subtle` - Default border color
- `--mb-color-text-primary` - Textarea text and label color
- `--mb-color-text-secondary` - Helper text color
- `--mb-color-text-placeholder` - Placeholder text color
- `--mb-color-text-disabled` - Disabled text color
- `--mb-color-surface-default` - Textarea background
- `--mb-color-surface-disabled` - Disabled background
- `--mb-color-feedback-error` - Error state color
- `--mb-color-feedback-warning` - Counter warning color

### Spacing

- `--mb-space-xs` - Internal spacing
- `--mb-space-sm` - Textarea padding

### Typography

- `--mb-font-size-base` - Textarea text size
- `--mb-font-size-small` - Label, helper, error, counter text size
- `--mb-font-weight-medium` - Label font weight

### Borders

- `--mb-radius-small` - Textarea border radius

## Accessibility

- Proper ARIA attributes (`aria-label`, `aria-invalid`, `aria-describedby`)
- Keyboard accessible (Tab, Shift+Tab, Enter for line breaks)
- Focus indicators
- Semantic HTML (`<label>`, `<textarea>`)
- Required indicator (\*)
- Error announcements linked to textarea
- Character counter for screen readers

## Use Cases

### Cat Creator

Multi-line description input for cat profiles.

### Contact Forms

Message and feedback fields in support forms.

### Comments/Reviews

User-generated content with character limits.

### Notes/Descriptions

Any multi-line text entry with validation.

### Bio/Profile Fields

Personal descriptions with character constraints.

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- Native `<textarea>` element
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- `mb-text-input` - For single-line text entry
- `mb-select` - For selection from options
- `mb-checkbox` - For boolean input
- Future: `mb-rich-text-editor` - For formatted text
