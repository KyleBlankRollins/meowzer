# mb-slider

A slider component for numeric value selection with smooth interaction and visual feedback.

## Features

- **Range Control**: Customizable min, max, and step values
- **Visual Progress**: Colored track shows current position
- **Value Display**: Optional formatted value display with decimal places
- **Helper Text**: Additional guidance below the slider
- **Disabled State**: Visual and functional disabled state
- **Accessible**: ARIA attributes, keyboard support
- **Customizable**: CSS parts for external styling

## Usage

### Basic Usage

```html
<mb-slider label="Volume" min="0" max="100" value="50"></mb-slider>
```

### Decimal Values

```html
<mb-slider
  label="Opacity"
  min="0"
  max="1"
  step="0.01"
  value="0.75"
  decimal-places="2"
></mb-slider>
```

### With Helper Text

```html
<mb-slider
  label="Brightness"
  min="0"
  max="100"
  value="75"
  helper="Adjust screen brightness level"
></mb-slider>
```

### Event Handling

```html
<mb-slider
  label="Volume"
  min="0"
  max="100"
  value="50"
  @mb-input="${handleInput}"
  @mb-change="${handleChange}"
></mb-slider>
```

## API

### Properties

| Property         | Type      | Default | Description                         |
| ---------------- | --------- | ------- | ----------------------------------- |
| `label`          | `string`  | `''`    | Label text for the slider           |
| `min`            | `number`  | `0`     | Minimum value                       |
| `max`            | `number`  | `100`   | Maximum value                       |
| `step`           | `number`  | `1`     | Step increment                      |
| `value`          | `number`  | `0`     | Current value                       |
| `show-value`     | `boolean` | `true`  | Whether to show the current value   |
| `decimal-places` | `number`  | `0`     | Number of decimal places to display |
| `helper`         | `string`  | `''`    | Helper text below the slider        |
| `disabled`       | `boolean` | `false` | Whether the slider is disabled      |

### Events

| Event       | Detail              | Description                                           |
| ----------- | ------------------- | ----------------------------------------------------- |
| `mb-input`  | `{ value: number }` | Fired when the slider value changes during drag       |
| `mb-change` | `{ value: number }` | Fired when the slider value changes and user releases |

### CSS Parts

| Part     | Description                  |
| -------- | ---------------------------- |
| `slider` | The slider container element |
| `label`  | The label element            |
| `value`  | The value display element    |
| `input`  | The range input element      |
| `helper` | The helper text element      |

## Examples

### Personality Traits (0-1 scale)

```html
<mb-slider
  label="Curiosity"
  min="0"
  max="1"
  step="0.1"
  value="0.7"
  decimal-places="1"
></mb-slider>
```

### Temperature Range

```html
<mb-slider
  label="Temperature"
  min="-10"
  max="40"
  value="22"
  helper="Celsius"
></mb-slider>
```

### Volume Control

```html
<mb-slider
  label="Volume"
  min="0"
  max="100"
  value="75"
  helper="Master volume level"
></mb-slider>
```

### Without Value Display

```html
<mb-slider
  label="Setting"
  min="0"
  max="100"
  value="50"
  show-value="false"
></mb-slider>
```

### Disabled State

```html
<mb-slider
  label="Locked Setting"
  min="0"
  max="100"
  value="50"
  disabled
></mb-slider>
```

### Event Handling

```javascript
const slider = document.querySelector("mb-slider");

// Fires during drag
slider.addEventListener("mb-input", (event) => {
  console.log("Current value:", event.detail.value);
  // Update UI in real-time
});

// Fires on release
slider.addEventListener("mb-change", (event) => {
  console.log("Final value:", event.detail.value);
  // Save to state/database
});
```

### Custom Styling via Parts

```css
mb-slider::part(slider) {
  padding: 1rem;
}

mb-slider::part(label) {
  font-size: 1.125rem;
  font-weight: 700;
}

mb-slider::part(value) {
  font-size: 1rem;
  color: var(--mb-color-interactive-primary);
}

mb-slider::part(input) {
  /* Style the range input */
}

mb-slider::part(helper) {
  font-style: italic;
}
```

## Design Tokens

This component uses the following design tokens:

### Colors

- `--mb-color-interactive-primary` - Slider track and thumb color
- `--mb-color-border-subtle` - Track background color
- `--mb-color-text-primary` - Label color
- `--mb-color-text-secondary` - Value and helper text color
- `--mb-color-text-disabled` - Disabled state color
- `--mb-color-surface-default` - Thumb border color

### Spacing

- `--mb-space-xs` - Internal spacing
- `--mb-space-sm` - Gap between elements

### Typography

- `--mb-font-size-base` - Label text size
- `--mb-font-size-small` - Value and helper text size
- `--mb-font-weight-medium` - Label font weight

### Borders

- `--mb-radius-full` - Track border radius

## Accessibility

- Proper ARIA attributes (`aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`)
- Keyboard accessible (Arrow keys to adjust value)
- Focus indicators on thumb
- Visual disabled state
- Semantic HTML structure

## Use Cases

### Cat Personality Picker

Adjust personality traits on a 0-1 scale.

### Volume/Settings Controls

Any numeric setting that benefits from visual feedback.

### Range Selection

Temperature, brightness, opacity, etc.

### Rating Systems

Star ratings or satisfaction scores.

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- Native `<input type="range">`
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- `mb-text-input` - For precise numeric input
- Future: `mb-range-slider` - For min/max range selection
