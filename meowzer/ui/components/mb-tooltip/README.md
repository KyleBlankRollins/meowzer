# mb-tooltip

A lightweight tooltip component that displays helpful hints on hover or focus.

## Features

- **Hover & Focus Triggers**: Shows on mouse hover or keyboard focus
- **4 Positions**: Top, bottom, left, right
- **Auto-positioning**: Stays within viewport boundaries
- **Customizable Delay**: Control when tooltip appears
- **Smooth Animations**: Fade-in effect with position-aware motion
- **Keyboard Accessible**: Full support for keyboard navigation
- **Screen Reader Friendly**: Proper ARIA attributes
- **Customizable**: CSS parts and custom properties for styling

## Installation

```typescript
import "@meowzer/ui/components/mb-tooltip/mb-tooltip.js";
```

## Usage

### Basic

```html
<mb-tooltip text="Helpful hint" position="top">
  <mb-button>Hover me</mb-button>
</mb-tooltip>
```

### All Positions

```html
<!-- Top (default) -->
<mb-tooltip text="Top position" position="top">
  <mb-button>Top</mb-button>
</mb-tooltip>

<!-- Bottom -->
<mb-tooltip text="Bottom position" position="bottom">
  <mb-button>Bottom</mb-button>
</mb-tooltip>

<!-- Left -->
<mb-tooltip text="Left position" position="left">
  <mb-button>Left</mb-button>
</mb-tooltip>

<!-- Right -->
<mb-tooltip text="Right position" position="right">
  <mb-button>Right</mb-button>
</mb-tooltip>
```

### Custom Delay

```html
<!-- Instant (no delay) -->
<mb-tooltip text="Instant tooltip" delay="0">
  <mb-button>No delay</mb-button>
</mb-tooltip>

<!-- Slow (1 second) -->
<mb-tooltip text="Slow tooltip" delay="1000">
  <mb-button>1s delay</mb-button>
</mb-tooltip>
```

### Disabled

```html
<mb-tooltip text="This won't show" disabled>
  <mb-button>Disabled tooltip</mb-button>
</mb-tooltip>
```

### With Icon

```html
<div style="display: flex; align-items: center; gap: 0.5rem;">
  <span>Label</span>
  <mb-tooltip text="Additional information">
    <button style="cursor: help;">?</button>
  </mb-tooltip>
</div>
```

## API

### Properties

| Property   | Type                                     | Default | Description                                  |
| ---------- | ---------------------------------------- | ------- | -------------------------------------------- |
| `text`     | `string`                                 | `""`    | The tooltip text content                     |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Position of the tooltip relative to trigger  |
| `delay`    | `number`                                 | `200`   | Delay in milliseconds before showing tooltip |
| `disabled` | `boolean`                                | `false` | Disable the tooltip                          |

### Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| (default) | The element that triggers the tooltip (button, icon, etc.) |

### CSS Parts

| Part      | Description                 |
| --------- | --------------------------- |
| `trigger` | The trigger wrapper element |
| `content` | The tooltip content element |
| `arrow`   | The tooltip arrow/pointer   |

### CSS Custom Properties

| Property                        | Description        | Default        |
| ------------------------------- | ------------------ | -------------- |
| `--mb-color-background-inverse` | Tooltip background | `#161616`      |
| `--mb-color-text-inverse`       | Tooltip text color | `#ffffff`      |
| `--mb-radius-sm`                | Border radius      | `4px`          |
| `--mb-font-size-sm`             | Font size          | `0.875rem`     |
| `--mb-shadow-md`                | Box shadow         | Default shadow |

## Examples

### Styled with CSS Parts

```css
mb-tooltip::part(content) {
  background: #3498db;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}

mb-tooltip::part(arrow) {
  /* Arrow color matches content background */
  border-top-color: #3498db;
}
```

### Custom Colors

```css
mb-tooltip {
  --mb-color-background-inverse: #2c3e50;
  --mb-color-text-inverse: #ecf0f1;
}
```

### Multiple Tooltips

```html
<div style="display: flex; gap: 1rem;">
  <mb-tooltip text="Save changes" position="top">
    <mb-button variant="primary">Save</mb-button>
  </mb-tooltip>

  <mb-tooltip text="Discard changes" position="top">
    <mb-button variant="secondary">Cancel</mb-button>
  </mb-tooltip>

  <mb-tooltip text="Delete item" position="top">
    <mb-button variant="danger">Delete</mb-button>
  </mb-tooltip>
</div>
```

### Programmatic Usage

```typescript
const tooltip = document.querySelector("mb-tooltip");

// Get/set properties
console.log(tooltip.text); // "Helpful hint"
tooltip.text = "New hint";
tooltip.position = "bottom";
tooltip.delay = 500;
tooltip.disabled = false;
```

## Behavior

### Show Triggers

- **Mouse hover**: Tooltip appears after delay when hovering over trigger element
- **Keyboard focus**: Tooltip appears after delay when trigger receives focus

### Hide Triggers

- **Mouse leave**: Tooltip disappears when mouse leaves trigger
- **Blur**: Tooltip disappears when trigger loses focus
- **Scroll**: Tooltip repositions to stay aligned with trigger

### Auto-positioning

The tooltip automatically adjusts its position to stay within the viewport:

- Horizontal centering for top/bottom positions
- Vertical centering for left/right positions
- Maintains 8px padding from viewport edges

### Animation

Each position has a tailored fade-in animation:

- **Top**: Fades in from slightly above
- **Bottom**: Fades in from slightly below
- **Left**: Fades in from slightly left
- **Right**: Fades in from slightly right

## Accessibility

- **ARIA Role**: `role="tooltip"` for proper semantics
- **ARIA Hidden**: `aria-hidden` toggles based on visibility
- **Keyboard Support**: Shows on focus, hides on blur
- **Screen Readers**: Content is announced when visible
- **Focus Management**: Works with keyboard navigation

### Keyboard Navigation

1. **Tab**: Focus on trigger element
2. Tooltip appears after delay
3. **Tab**: Move to next element (tooltip hides)

## Browser Support

- Modern browsers with Web Components support
- Shadow DOM v1
- CSS Custom Properties
- Fixed positioning
- CSS animations

## Related Components

- `mb-button` - Common trigger element for tooltips
- `mb-icon` - Can be used as tooltip trigger
- `mb-modal` - Similar overlay pattern but for dialogs
