# mb-icon

A simple, flexible icon component for displaying SVG icons.

## Installation

```typescript
import "@meowzer/ui/components/mb-icon/mb-icon.js";
```

## Usage

### With SVG String

```html
<mb-icon
  size="24"
  .svg=${`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  `}
></mb-icon>
```

### With Slotted SVG

```html
<mb-icon size="32">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
</mb-icon>
```

### Size Variants

```html
<!-- Predefined sizes -->
<mb-icon size="16" .svg="${iconSvg}"></mb-icon>
<mb-icon size="20" .svg="${iconSvg}"></mb-icon>
<mb-icon size="24" .svg="${iconSvg}"></mb-icon>
<mb-icon size="32" .svg="${iconSvg}"></mb-icon>
<mb-icon size="48" .svg="${iconSvg}"></mb-icon>

<!-- Custom size via CSS variable -->
<mb-icon .svg="${iconSvg}" style="--mb-icon-size: 64px;"></mb-icon>
```

### With Color

```html
<mb-icon
  size="24"
  .svg="${iconSvg}"
  style="color: #0f62fe;"
></mb-icon>
```

### With Accessibility

```html
<!-- Decorative icon (no label needed) -->
<mb-icon size="20" .svg="${iconSvg}"></mb-icon>

<!-- Semantic icon (needs label) -->
<button>
  <mb-icon size="20" .svg="${iconSvg}" label="Settings"></mb-icon>
</button>
```

## API

### Properties

| Property | Type                                   | Default | Description                                     |
| -------- | -------------------------------------- | ------- | ----------------------------------------------- |
| `size`   | `"16" \| "20" \| "24" \| "32" \| "48"` | `"24"`  | Predefined size variant                         |
| `svg`    | `string`                               | `""`    | SVG content as string (inline usage)            |
| `name`   | `string`                               | `""`    | Icon name (for future icon library integration) |
| `label`  | `string`                               | `""`    | Accessible label for the icon                   |

### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| (default) | SVG content to display |

### CSS Parts

| Part   | Description        |
| ------ | ------------------ |
| `icon` | The icon container |

### CSS Custom Properties

| Property         | Description                                 |
| ---------------- | ------------------------------------------- |
| `--mb-icon-size` | Custom icon size (overrides size attribute) |

## Features

### Size Management

The component supports both predefined sizes and custom sizes:

**Predefined sizes:**

- `16` - 16x16px
- `20` - 20x20px
- `24` - 24x24px (default)
- `32` - 32x32px
- `48` - 48x48px

**Custom size:**

```html
<mb-icon style="--mb-icon-size: 40px;"></mb-icon>
```

### Color Inheritance

Icons inherit the current text color via `currentColor`:

```html
<div style="color: red;">
  <mb-icon .svg="${iconSvg}"></mb-icon>
  <!-- Will be red -->
</div>
```

### Rendering Modes

The component supports two rendering modes:

1. **SVG Property** - Pass SVG as a string (good for dynamic icons)
2. **Slotted Content** - Insert SVG as child element (good for static icons)

The `svg` property takes precedence over slotted content if both are provided.

### Accessibility

The component automatically handles accessibility:

- Without `label`: `role="presentation"` (decorative icon)
- With `label`: `role="img"` and `aria-label` (semantic icon)

**When to use labels:**

- Icon-only buttons
- Standalone icons that convey meaning
- Icons without accompanying text

**When NOT to use labels:**

- Icons next to text labels
- Purely decorative icons

## Examples

### In Buttons

```html
<mb-button>
  <mb-icon size="20" .svg="${addIcon}"></mb-icon>
  Add Item
</mb-button>
```

### Icon-Only Button

```html
<button aria-label="Close">
  <mb-icon size="20" .svg="${closeIcon}" label="Close"></mb-icon>
</button>
```

### Inline with Text

```html
<p>
  Success
  <mb-icon
    size="20"
    .svg="${checkIcon}"
    style="color: green;"
  ></mb-icon>
</p>
```

### Icon Grid

```html
<div
  style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;"
>
  <mb-icon size="32" .svg="${icon1}"></mb-icon>
  <mb-icon size="32" .svg="${icon2}"></mb-icon>
  <mb-icon size="32" .svg="${icon3}"></mb-icon>
  <mb-icon size="32" .svg="${icon4}"></mb-icon>
</div>
```

### With Hover Effects

```html
<style>
  mb-icon {
    transition: transform 0.2s, color 0.2s;
  }
  mb-icon:hover {
    transform: scale(1.1);
    color: #0f62fe;
  }
</style>

<mb-icon size="32" .svg="${iconSvg}"></mb-icon>
```

## Migration from Carbon

If you're migrating from `cds-icon`:

### Before (Carbon)

```html
<cds-icon>
  <svg>...</svg>
</cds-icon>
```

### After (mb-icon)

```html
<mb-icon size="24">
  <svg>...</svg>
</mb-icon>
```

Key differences:

- Size is now a property instead of being inferred from SVG
- More flexible sizing options (predefined + CSS variable)
- Simpler API with fewer features (intentionally lightweight)

## Integration with Icon Libraries

### Using with @carbon/icons

```typescript
import Add from "@carbon/icons/es/add/16";

const iconSvg = Add.content; // Get raw SVG string

html`<mb-icon size="16" .svg=${iconSvg}></mb-icon>`;
```

### Using with Custom SVG Files

```typescript
import iconSvg from "./assets/my-icon.svg?raw"; // Vite raw import

html`<mb-icon size="24" .svg=${iconSvg}></mb-icon>`;
```

### Creating an Icon Library

```typescript
// icons.ts
export const icons = {
  add: `<svg>...</svg>`,
  close: `<svg>...</svg>`,
  check: `<svg>...</svg>`,
};

// Usage
html`<mb-icon size="20" .svg=${icons.add}></mb-icon>`;
```

## Notes

- This is a **minimal** icon component focused on simplicity
- For complex icon systems, consider dedicated icon libraries
- SVG content is rendered using `unsafeHTML` - only use trusted SVG sources
- The `name` property is reserved for future icon library integration
