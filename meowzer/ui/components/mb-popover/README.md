# mb-popover

A lightweight popover component that displays floating content triggered by click or hover.

## Installation

```typescript
import "@meowzer/ui/components/mb-popover/mb-popover.js";
```

## Usage

### Basic Popover (Click)

```html
<mb-popover>
  <button>Click me</button>
  <div slot="content">
    <p>Popover content goes here</p>
  </div>
</mb-popover>
```

### Hover Trigger

```html
<mb-popover trigger="hover">
  <button>Hover me</button>
  <div slot="content">
    <p>Opens on hover</p>
  </div>
</mb-popover>
```

### Position Variants

```html
<!-- Top -->
<mb-popover position="top">
  <button>Top</button>
  <div slot="content">Content appears above</div>
</mb-popover>

<!-- Bottom (default) -->
<mb-popover position="bottom">
  <button>Bottom</button>
  <div slot="content">Content appears below</div>
</mb-popover>

<!-- Left -->
<mb-popover position="left">
  <button>Left</button>
  <div slot="content">Content appears to the left</div>
</mb-popover>

<!-- Right -->
<mb-popover position="right">
  <button>Right</button>
  <div slot="content">Content appears to the right</div>
</mb-popover>
```

### Custom Delay (Hover)

```html
<mb-popover trigger="hover" delay="500">
  <button>Hover me</button>
  <div slot="content">
    <p>Opens after 500ms delay</p>
  </div>
</mb-popover>
```

### Without Arrow

```html
<mb-popover .showArrow="${false}">
  <button>No arrow</button>
  <div slot="content">
    <p>Popover without arrow pointer</p>
  </div>
</mb-popover>
```

### Disabled

```html
<mb-popover disabled>
  <button>Disabled</button>
  <div slot="content">
    <p>This won't open</p>
  </div>
</mb-popover>
```

## API

### Properties

| Property    | Type                                     | Default    | Description                             |
| ----------- | ---------------------------------------- | ---------- | --------------------------------------- |
| `position`  | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Position of popover relative to trigger |
| `trigger`   | `"click" \| "hover"`                     | `"click"`  | Event that triggers the popover         |
| `disabled`  | `boolean`                                | `false`    | Whether the popover is disabled         |
| `showArrow` | `boolean`                                | `true`     | Whether to show the arrow pointer       |
| `delay`     | `number`                                 | `200`      | Delay in ms before showing on hover     |
| `open`      | `boolean`                                | `false`    | Whether the popover is currently open   |

### Events

| Event     | Description                  | Detail |
| --------- | ---------------------------- | ------ |
| `mb-show` | Fired when popover is shown  | None   |
| `mb-hide` | Fired when popover is hidden | None   |

### Slots

| Slot      | Description                                |
| --------- | ------------------------------------------ |
| (default) | The trigger element that opens the popover |
| `content` | The content to display in the popover      |

### CSS Parts

| Part      | Description                   |
| --------- | ----------------------------- |
| `trigger` | The trigger element wrapper   |
| `content` | The popover content container |
| `arrow`   | The popover arrow pointer     |

## Examples

### User Menu

```html
<mb-popover>
  <button>User Menu</button>
  <div slot="content">
    <div style="min-width: 200px;">
      <div
        style="padding: 0.5rem 1rem; border-bottom: 1px solid #e0e0e0;"
      >
        <strong>John Doe</strong>
        <div>john@example.com</div>
      </div>
      <a href="/profile">Profile</a>
      <a href="/settings">Settings</a>
      <a href="/logout">Sign out</a>
    </div>
  </div>
</mb-popover>
```

### Info Tooltip

```html
<mb-popover trigger="hover" position="top" delay="100">
  <button aria-label="Help">ⓘ</button>
  <div slot="content">
    <p style="max-width: 200px; margin: 0;">
      This is helpful information that appears when you hover.
    </p>
  </div>
</mb-popover>
```

### Quick Form

```html
<mb-popover>
  <button>Quick Add</button>
  <div slot="content">
    <form style="min-width: 250px; padding: 1rem;">
      <label>
        Name:
        <input type="text" />
      </label>
      <label>
        Email:
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  </div>
</mb-popover>
```

## Behavior

### Click Trigger

- Click trigger to open
- Click trigger again to close
- Click outside to close
- Disabled state prevents opening

### Hover Trigger

- Hover over trigger to open (with delay)
- Move mouse away to close immediately
- Customizable delay before showing
- Disabled state prevents opening

### Positioning

- Automatically positions relative to trigger
- Stays within viewport bounds
- Arrow points to trigger element
- Fixed positioning (portal-style)

## Styling

The popover uses design tokens for consistent theming:

```css
mb-popover::part(content) {
  --mb-color-layer-01: #ffffff;
  --mb-color-border: #e0e0e0;
  --mb-radius-md: 0.5rem;
  --mb-shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.2);
  --mb-space-3: 0.75rem;
}
```

### Custom Styling with Parts

```css
/* Style the content */
mb-popover::part(content) {
  background: linear-gradient(to bottom, #ffffff, #f5f5f5);
  border: 2px solid #0066cc;
}

/* Style the arrow */
mb-popover::part(arrow) {
  /* Arrow is CSS triangle - use border-color */
}

/* Style the trigger wrapper */
mb-popover::part(trigger) {
  display: inline-flex;
  align-items: center;
}
```

## Accessibility

- Uses `role="dialog"` on popover content
- `aria-hidden` attribute toggles with open state
- Keyboard accessible (trigger element can receive focus)
- Supports standard keyboard navigation
- Disabled state prevents interaction

## Migration from Carbon

Migrating from `cds-popover` to `mb-popover`:

### Before (Carbon)

```html
<cds-popover align="bottom">
  <button>Trigger</button>
  <cds-popover-content>Content</cds-popover-content>
</cds-popover>
```

### After (Meowbase)

```html
<mb-popover position="bottom">
  <button>Trigger</button>
  <div slot="content">Content</div>
</mb-popover>
```

### Key Differences

| Carbon                  | Meowbase             | Notes                  |
| ----------------------- | -------------------- | ---------------------- |
| `align`                 | `position`           | Property renamed       |
| `<cds-popover-content>` | `slot="content"`     | Simpler slot-based API |
| Carbon events           | `mb-show`, `mb-hide` | Standard custom events |
| Limited customization   | CSS parts            | Full styling control   |

## Notes

- Uses fixed positioning for proper layering
- Automatically adjusts position to stay in viewport
- Lightweight implementation with no external dependencies
- Works in modal/dialog contexts (portal rendering)
- Click outside to close (for click trigger)
- Hover trigger respects delay setting
