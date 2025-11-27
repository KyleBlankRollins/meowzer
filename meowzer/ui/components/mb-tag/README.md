# mb-tag

A tag component for labels, categories, and badges.

## Features

- **Six Color Variants**: Gray, Blue, Green, Red, Yellow, Purple
- **Three Sizes**: Small, Medium, Large
- **Removable**: Optional remove button with event handler
- **Slot Support**: Use default slot for tag content
- **Accessible**: ARIA labels, keyboard support
- **Customizable**: CSS parts for external styling

## Usage

### Basic Usage

```html
<mb-tag variant="blue">New Feature</mb-tag>
```

### Removable Tag

```html
<mb-tag variant="red" removable @mb-remove="${handleRemove}">
  Error
</mb-tag>
```

### Different Sizes

```html
<mb-tag size="sm">Small</mb-tag>
<mb-tag size="md">Medium</mb-tag>
<mb-tag size="lg">Large</mb-tag>
```

### Color Variants

```html
<mb-tag variant="gray">Default</mb-tag>
<mb-tag variant="blue">Info</mb-tag>
<mb-tag variant="green">Success</mb-tag>
<mb-tag variant="red">Error</mb-tag>
<mb-tag variant="yellow">Warning</mb-tag>
<mb-tag variant="purple">Special</mb-tag>
```

## API

### Properties

| Property    | Type                                                           | Default  | Description                    |
| ----------- | -------------------------------------------------------------- | -------- | ------------------------------ |
| `variant`   | `'gray' \| 'blue' \| 'green' \| 'red' \| 'yellow' \| 'purple'` | `'gray'` | Color variant of the tag       |
| `size`      | `'sm' \| 'md' \| 'lg'`                                         | `'md'`   | Size of the tag                |
| `removable` | `boolean`                                                      | `false`  | Whether the tag can be removed |

### Slots

| Slot      | Description      |
| --------- | ---------------- |
| (default) | Tag text content |

### Events

| Event       | Detail                          | Description                         |
| ----------- | ------------------------------- | ----------------------------------- |
| `mb-remove` | `{ originalEvent: MouseEvent }` | Fired when remove button is clicked |

### CSS Parts

| Part     | Description               |
| -------- | ------------------------- |
| `tag`    | The tag container element |
| `remove` | The remove button element |

## Examples

### Status Indicators

```html
<mb-tag variant="green" size="sm">Active</mb-tag>
<mb-tag variant="red" size="sm">Error</mb-tag>
<mb-tag variant="yellow" size="sm">Warning</mb-tag>
```

### Category Tags

```html
<mb-tag variant="blue">TypeScript</mb-tag>
<mb-tag variant="purple">Web Components</mb-tag>
<mb-tag variant="green">Lit</mb-tag>
```

### Filter Tags (Removable)

```html
<mb-tag variant="blue" removable @mb-remove="${handleRemove}">
  Color: Orange
</mb-tag>
<mb-tag variant="blue" removable @mb-remove="${handleRemove}">
  Pattern: Tabby
</mb-tag>
```

### Event Handling

```javascript
const tag = document.querySelector("mb-tag");
tag.addEventListener("mb-remove", (event) => {
  console.log("Tag removed:", event.detail.originalEvent);
  // Remove the tag from DOM or update state
  tag.remove();
});
```

### Custom Styling via Parts

```css
mb-tag::part(tag) {
  border-radius: 4px; /* Square corners instead of pill shape */
  font-weight: 700;
}

mb-tag::part(remove) {
  opacity: 0.8;
}

mb-tag::part(remove):hover {
  background: rgba(255, 0, 0, 0.1);
}
```

## Design Tokens

This component uses the following design tokens:

### Colors (Gray variant)

- `--mb-color-surface-subtle` - Background
- `--mb-color-text-primary` - Text color
- `--mb-color-border-subtle` - Border color

### Spacing

- `--mb-space-xs` - Internal padding and gaps
- `--mb-space-sm` - Padding (medium)
- `--mb-space-md` - Padding (large)

### Typography

- `--mb-font-size-small` - Text size
- `--mb-font-weight-medium` - Font weight

### Borders

- `--mb-radius-full` - Pill-shaped border radius
- `--mb-radius-small` - Remove button border radius

## Accessibility

- Remove button has `aria-label="Remove tag"`
- Keyboard accessible (Tab, Enter, Space)
- Focus indicators for remove button
- Semantic HTML structure
- Color-coded with sufficient contrast

## Use Cases

### Status Badges

Display system status, API states, or health indicators.

### Category Labels

Tag content with categories, types, or classifications.

### Filter Chips

Show active filters that users can remove.

### Skill Tags

Display technologies, skills, or capabilities.

### Metadata

Show additional information like dates, counts, or flags.

## Browser Support

This component uses:

- Lit Element 3.x
- Shadow DOM
- CSS Custom Properties
- ES2020+ JavaScript

Supports all modern browsers (Chrome, Firefox, Safari, Edge).

## Related Components

- `mb-button` - For actionable elements
- Future: `mb-badge` - For notification counts
