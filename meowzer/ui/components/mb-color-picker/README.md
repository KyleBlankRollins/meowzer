# mb-color-picker

A custom color picker component with HSV color selection.

## Features

- **HSV Color Selection**: Intuitive saturation/value grid and hue slider
- **Hex Format**: Input and output colors in hex format (#RRGGBB)
- **Text Input**: Manual hex value entry with validation
- **Native Fallback**: Built-in `<input type="color">` as fallback
- **Inline Mode**: Borderless display for embedded use cases
- **Interactive**: Pointer and touch support for dragging
- **Accessible**: ARIA labels, roles, and keyboard navigation
- **Events**: `mb-change` and `mb-input` for color updates
- **Customizable**: CSS parts for styling

## Installation

```typescript
import "@meowzer/ui/components/mb-color-picker/mb-color-picker.js";
```

## Usage

### Basic

```html
<mb-color-picker value="#3498db"></mb-color-picker>
```

### Inline Mode

```html
<mb-color-picker value="#3498db" inline></mb-color-picker>
```

### With Event Listener

```html
<mb-color-picker
  value="#3498db"
  @mb-change="${(e) => console.log('Color changed:', e.detail.value)}"
></mb-color-picker>
```

### Programmatic Usage

```typescript
const picker = document.querySelector("mb-color-picker");

// Get current value
console.log(picker.value); // "#3498db"

// Set new value
picker.value = "#e74c3c";

// Listen for changes
picker.addEventListener("mb-change", (e) => {
  console.log("Color changed:", e.detail.value);
});

// Listen for input (during dragging)
picker.addEventListener("mb-input", (e) => {
  console.log("Color preview:", e.detail.value);
});
```

## API

### Properties

| Property   | Type      | Default     | Description                          |
| ---------- | --------- | ----------- | ------------------------------------ |
| `value`    | `string`  | `"#000000"` | Color value in hex format            |
| `format`   | `"hex"`   | `"hex"`     | Color format (only hex supported)    |
| `inline`   | `boolean` | `false`     | Display inline without border/shadow |
| `disabled` | `boolean` | `false`     | Disable the color picker             |

### Events

| Event       | Detail              | Description                                  |
| ----------- | ------------------- | -------------------------------------------- |
| `mb-change` | `{ value: string }` | Fired when color value changes (final value) |
| `mb-input`  | `{ value: string }` | Fired during color changes (while dragging)  |

Both events bubble and are composed (cross shadow DOM boundaries).

### CSS Parts

| Part          | Description                  |
| ------------- | ---------------------------- |
| `base`        | The component's base wrapper |
| `preview`     | Preview and input section    |
| `swatch`      | Color swatch/preview button  |
| `label`       | Input label (e.g., "HEX")    |
| `input`       | Text input for hex values    |
| `grid`        | Saturation/value grid        |
| `grid-handle` | Grid cursor handle           |
| `hue-slider`  | Hue slider track             |
| `hue-handle`  | Hue slider handle            |

### CSS Custom Properties

| Property                | Description         | Default                      |
| ----------------------- | ------------------- | ---------------------------- |
| `--mb-color-background` | Background color    | `var(--mb-color-background)` |
| `--mb-color-border`     | Border color        | `var(--mb-color-border)`     |
| `--mb-color-focus`      | Focus outline color | `var(--mb-color-primary)`    |

## Examples

### Portal Rendering (Modal Context)

When using in a modal or transformed container, render the picker to `document.body` to avoid positioning issues:

```typescript
import { MbColorPicker } from "@meowzer/ui";

class MyComponent extends LitElement {
  private picker?: MbColorPicker;
  private portalContainer?: HTMLDivElement;

  showPicker() {
    // Create portal container
    this.portalContainer = document.createElement("div");
    this.portalContainer.style.position = "fixed";
    this.portalContainer.style.zIndex = "9999";
    document.body.appendChild(this.portalContainer);

    // Create picker
    this.picker = document.createElement("mb-color-picker");
    this.picker.inline = true;
    this.picker.value = this.value;

    // Position picker
    const rect = this.button.getBoundingClientRect();
    this.portalContainer.style.top = `${rect.bottom + 4}px`;
    this.portalContainer.style.left = `${rect.left}px`;

    // Add event listener
    this.picker.addEventListener("mb-change", (e) => {
      this.value = e.detail.value;
      this.hidePicker();
    });

    this.portalContainer.appendChild(this.picker);
  }

  hidePicker() {
    this.portalContainer?.remove();
    this.portalContainer = undefined;
    this.picker = undefined;
  }
}
```

### Styling with CSS Parts

```css
mb-color-picker::part(base) {
  border-radius: 8px;
}

mb-color-picker::part(swatch) {
  width: 60px;
  height: 60px;
}

mb-color-picker::part(grid) {
  height: 200px;
}

mb-color-picker::part(grid-handle) {
  width: 20px;
  height: 20px;
  border-width: 3px;
}
```

### Multiple Pickers

```html
<div style="display: flex; gap: 1rem;">
  <mb-color-picker value="#e74c3c"></mb-color-picker>
  <mb-color-picker value="#3498db"></mb-color-picker>
  <mb-color-picker value="#2ecc71"></mb-color-picker>
</div>
```

## Color Conversions

The component internally uses HSV color space for the grid and slider, converting to/from hex format:

- **Hex → RGB → HSV**: When setting value property
- **HSV → RGB → Hex**: When updating color from grid/slider
- **Hex validation**: Text input validates hex format (#RRGGBB)

### HSV Color Model

- **Hue**: 0-360° (color wheel position)
- **Saturation**: 0-100% (color intensity, horizontal axis in grid)
- **Value/Brightness**: 0-100% (lightness, vertical axis in grid)

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible (Tab, Enter)
- **ARIA Roles**: Grid and sliders have appropriate `role="slider"` attributes
- **ARIA Labels**: Descriptive labels for screen readers
  - Grid: "Color saturation and brightness"
  - Hue slider: "Color hue"
  - Swatch: "Color swatch"
- **Focus Management**: Visual focus indicators on all interactive elements
- **Native Input**: Hidden native color picker provides additional accessibility

## Browser Support

- Modern browsers with Web Components support
- Shadow DOM v1
- CSS Custom Properties
- Pointer Events API
- Native `<input type="color">` fallback

## Related Components

- `mb-button` - Used for color swatch interactions
- `mb-icon` - Can be used for additional UI elements
- `mb-modal` - Works well with portal rendering pattern
