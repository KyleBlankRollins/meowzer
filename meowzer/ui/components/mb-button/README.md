# mb-button

A versatile button component built with the Meowzer design system.

## Features

- **Three Variants**: Primary (brand), Secondary (subtle), Tertiary (minimal)
- **Three Sizes**: Small, Medium, Large
- **States**: Hover, active, disabled, loading
- **Icon Support**: Optional icon slot for leading icons
- **Accessibility**: Proper ARIA attributes and keyboard support
- **Custom Events**: Emits `mb-click` event with original event details

## Usage

### Basic Usage

```html
<mb-button variant="primary" size="md"> Click me </mb-button>
```

### With Loading State

```html
<mb-button variant="primary" loading> Saving... </mb-button>
```

### With Icon

```html
<mb-button variant="secondary">
  <span slot="icon">🐱</span>
  Adopt Cat
</mb-button>
```

### Disabled

```html
<mb-button variant="tertiary" disabled> Unavailable </mb-button>
```

## API

### Properties

| Property   | Type                                     | Default     | Description                            |
| ---------- | ---------------------------------------- | ----------- | -------------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual style variant                   |
| `size`     | `'sm' \| 'md' \| 'lg'`                   | `'md'`      | Size of the button                     |
| `disabled` | `boolean`                                | `false`     | Whether the button is disabled         |
| `loading`  | `boolean`                                | `false`     | Whether the button is in loading state |
| `type`     | `'button' \| 'submit' \| 'reset'`        | `'button'`  | HTML button type                       |

### Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| (default) | Button text content                |
| `icon`    | Leading icon (appears before text) |

### Events

| Event      | Detail                          | Description                                                 |
| ---------- | ------------------------------- | ----------------------------------------------------------- |
| `mb-click` | `{ originalEvent: MouseEvent }` | Fired when button is clicked (not when disabled or loading) |

### CSS Parts

| Part     | Description                                      |
| -------- | ------------------------------------------------ |
| `button` | The native button element (for external styling) |

## Examples

### All Variants

```html
<mb-button variant="primary">Primary</mb-button>
<mb-button variant="secondary">Secondary</mb-button>
<mb-button variant="tertiary">Tertiary</mb-button>
```

### All Sizes

```html
<mb-button size="sm">Small</mb-button>
<mb-button size="md">Medium</mb-button>
<mb-button size="lg">Large</mb-button>
```

### Event Handling

```javascript
const button = document.querySelector("mb-button");
button.addEventListener("mb-click", (event) => {
  console.log("Button clicked!", event.detail.originalEvent);
});
```

### Custom Styling via Parts

```css
mb-button::part(button) {
  /* Custom styles for the button element */
  border-width: 2px;
}
```

## Design Tokens

This component uses the following design tokens:

### Colors

- `--mb-color-brand-primary`
- `--mb-color-text-on-brand`
- `--mb-color-surface-subtle`
- `--mb-color-interactive-default`
- `--mb-color-interactive-hover`
- `--mb-color-text-primary`
- `--mb-color-text-secondary`
- `--mb-color-border-default`

### Spacing

- `--mb-space-xs` through `--mb-space-lg`

### Typography

- `--mb-font-size-small` through `--mb-font-size-large`
- `--mb-font-weight-medium`

### Borders

- `--mb-radius-medium`

### Shadows

- `--mb-shadow-small`

## Accessibility

- Proper ARIA attributes (`aria-busy` when loading)
- Disabled state prevents interaction
- Keyboard accessible (native button behavior)
- Focus visible indicator for keyboard navigation
- Sufficient color contrast for all variants

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).
