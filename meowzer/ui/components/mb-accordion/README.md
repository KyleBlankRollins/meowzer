# mb-accordion

A fully accessible accordion component with smooth animations and keyboard navigation.

## Installation

```typescript
import "@meowzer/ui/components/mb-accordion/mb-accordion.js";
import "@meowzer/ui/components/mb-accordion/mb-accordion-item.js";
```

## Usage

### Basic Accordion

```html
<mb-accordion>
  <mb-accordion-item title="Section 1">
    <p>Content for section 1</p>
  </mb-accordion-item>
  <mb-accordion-item title="Section 2">
    <p>Content for section 2</p>
  </mb-accordion-item>
  <mb-accordion-item title="Section 3">
    <p>Content for section 3</p>
  </mb-accordion-item>
</mb-accordion>
```

### Initially Open Section

```html
<mb-accordion>
  <mb-accordion-item title="Open by Default" open>
    <p>This section starts expanded</p>
  </mb-accordion-item>
  <mb-accordion-item title="Closed by Default">
    <p>This section starts collapsed</p>
  </mb-accordion-item>
</mb-accordion>
```

### Disabled Section

```html
<mb-accordion>
  <mb-accordion-item title="Cannot Toggle" disabled>
    <p>This section cannot be expanded or collapsed</p>
  </mb-accordion-item>
</mb-accordion>
```

### Custom Title Slot

```html
<mb-accordion>
  <mb-accordion-item>
    <div slot="title"><strong>Custom</strong> <em>Title</em> 🎨</div>
    <p>Content goes here</p>
  </mb-accordion-item>
</mb-accordion>
```

## API

### `<mb-accordion>`

#### Properties

None - the accordion container is a simple wrapper.

#### Events

| Event       | Description                              | Detail |
| ----------- | ---------------------------------------- | ------ |
| `mb-change` | Fired when any accordion item is toggled | N/A    |

#### CSS Parts

| Part   | Description             |
| ------ | ----------------------- |
| `base` | The accordion container |

---

### `<mb-accordion-item>`

#### Properties

| Property   | Type      | Default | Description                               |
| ---------- | --------- | ------- | ----------------------------------------- |
| `title`    | `string`  | `""`    | The title text displayed in the header    |
| `open`     | `boolean` | `false` | Whether the accordion item is expanded    |
| `disabled` | `boolean` | `false` | Whether the accordion item can be toggled |

#### Events

| Event       | Description                              | Detail              |
| ----------- | ---------------------------------------- | ------------------- |
| `mb-toggle` | Fired when the accordion item is toggled | `{ open: boolean }` |

#### Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| (default) | The content displayed when expanded                        |
| `title`   | Custom content for the header (overrides `title` property) |

#### CSS Parts

| Part      | Description                  |
| --------- | ---------------------------- |
| `base`    | The accordion item container |
| `header`  | The clickable header button  |
| `title`   | The title area in the header |
| `icon`    | The chevron icon             |
| `content` | The collapsible content area |

## Keyboard Navigation

- **Tab** - Move focus between accordion items
- **Enter** or **Space** - Toggle the focused accordion item

## Accessibility

- Each accordion item is a `<button>` with proper ARIA attributes
- `aria-expanded` indicates whether an item is open or closed
- `aria-controls` links the header to its content area
- `aria-hidden` hides collapsed content from screen readers
- Content areas have `role="region"` for landmark navigation
- Keyboard navigation fully supported

## Styling

The accordion uses design tokens for consistent theming:

```css
/* Container */
mb-accordion {
  --mb-accordion-border-color: var(--mb-color-border, #e0e0e0);
  --mb-accordion-border-radius: var(--mb-radius-md, 0.5rem);
}

/* Item header */
mb-accordion-item {
  --mb-accordion-header-bg: transparent;
  --mb-accordion-header-hover-bg: var(--mb-color-hover, #f5f5f5);
  --mb-accordion-header-padding: 1rem;
}

/* Item content */
mb-accordion-item {
  --mb-accordion-content-padding: 1rem;
  --mb-accordion-content-bg: transparent;
}
```

### Custom Styling with Parts

```css
/* Style the container */
mb-accordion::part(base) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style the header */
mb-accordion-item::part(header) {
  font-weight: bold;
  background: linear-gradient(to right, #f0f0f0, #ffffff);
}

/* Style the content */
mb-accordion-item::part(content) {
  background: #fafafa;
}

/* Style the icon */
mb-accordion-item::part(icon) {
  color: var(--mb-color-primary, #0066cc);
}
```

## Examples

### Listen to Toggle Events

```typescript
const item = document.querySelector("mb-accordion-item");

item.addEventListener("mb-toggle", (e) => {
  console.log("Item is now:", e.detail.open ? "open" : "closed");
});
```

### Programmatically Toggle

```typescript
const item = document.querySelector("mb-accordion-item");

// Open
item.open = true;

// Close
item.open = false;

// Toggle
item.open = !item.open;
```

### Multiple Accordions

```html
<!-- Allow multiple open sections (default behavior) -->
<mb-accordion>
  <mb-accordion-item title="Section 1" open>...</mb-accordion-item>
  <mb-accordion-item title="Section 2" open>...</mb-accordion-item>
</mb-accordion>

<!-- For exclusive behavior, handle programmatically -->
<mb-accordion id="exclusive-accordion">
  <mb-accordion-item title="Section 1">...</mb-accordion-item>
  <mb-accordion-item title="Section 2">...</mb-accordion-item>
</mb-accordion>

<script>
  const accordion = document.getElementById("exclusive-accordion");

  accordion.addEventListener("mb-toggle", (e) => {
    if (e.detail.open) {
      // Close all other items
      accordion
        .querySelectorAll("mb-accordion-item")
        .forEach((item) => {
          if (item !== e.target) {
            item.open = false;
          }
        });
    }
  });
</script>
```
