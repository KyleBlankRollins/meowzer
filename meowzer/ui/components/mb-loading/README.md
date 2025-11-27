# mb-loading

A loading spinner component for indicating loading states.

## Features

- **Three Sizes**: Small, Medium, Large
- **Overlay Mode**: Fullscreen loading with backdrop
- **Optional Text**: Display loading message next to spinner
- **Slot Support**: Use default slot for custom text content
- **Accessible**: Proper semantic structure
- **Customizable**: CSS parts for external styling

## Usage

### Basic Usage

```html
<mb-loading size="md"></mb-loading>
```

### With Text

```html
<mb-loading text="Loading cats..."></mb-loading>
```

### Overlay Mode

```html
<mb-loading overlay text="Processing your request..."></mb-loading>
```

### With Slotted Content

```html
<mb-loading size="lg">
  <strong>Loading...</strong>
</mb-loading>
```

## API

### Properties

| Property  | Type                   | Default | Description                              |
| --------- | ---------------------- | ------- | ---------------------------------------- |
| `size`    | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the loading spinner              |
| `overlay` | `boolean`              | `false` | Whether to display as fullscreen overlay |
| `text`    | `string`               | `''`    | Optional loading text                    |

### Slots

| Slot      | Description                                            |
| --------- | ------------------------------------------------------ |
| (default) | Optional text content (alternative to `text` property) |

### CSS Parts

| Part      | Description         |
| --------- | ------------------- |
| `spinner` | The spinner element |
| `text`    | The text element    |

## Examples

### All Sizes

```html
<mb-loading size="sm"></mb-loading>
<mb-loading size="md"></mb-loading>
<mb-loading size="lg"></mb-loading>
```

### Inline Loading Indicator

```html
<div class="card">
  <mb-loading size="sm" text="Loading..."></mb-loading>
</div>
```

### Fullscreen Loading Overlay

```html
<mb-loading overlay text="Processing your request..."></mb-loading>
```

### Custom Styling via Parts

```css
mb-loading::part(spinner) {
  border-color: #ff6b6b;
  border-right-color: transparent;
}

mb-loading::part(text) {
  color: #ff6b6b;
  font-weight: 600;
}
```

## Design Tokens

This component uses the following design tokens:

### Colors

- `--mb-color-interactive-default` - Spinner color
- `--mb-color-text-secondary` - Text color (inline mode)
- `--mb-color-text-primary` - Text color (overlay mode)
- `--mb-color-surface-default` - Overlay background

### Spacing

- `--mb-space-sm` - Gap between spinner and text
- `--mb-space-md` - Text margin in overlay
- `--mb-space-xl` - Overlay container padding

### Typography

- `--mb-font-size-small` - Small text size
- `--mb-font-size-base` - Medium text size
- `--mb-font-size-large` - Large text size

### Borders

- `--mb-radius-small` - Small border radius
- `--mb-radius-large` - Overlay border radius

### Shadows

- `--mb-shadow-large` - Overlay shadow

## Accessibility

- Semantic HTML structure
- CSS parts for custom styling
- Supports custom text content via slot or property
- Overlay mode includes backdrop for visual separation

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- CSS Animations
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- `mb-button` - Can show loading state with spinner
