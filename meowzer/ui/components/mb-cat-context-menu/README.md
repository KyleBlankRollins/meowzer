# mb-cat-context-menu

A context menu component that appears when right-clicking on a cat in the playground. Provides quick access to cat management actions.

## Features

- **3 Actions**: Rename, Change Hat, and Remove
- **Smart Positioning**: Auto-adjusts to stay within viewport bounds
- **Click Outside to Close**: Automatically closes when clicking outside the menu
- **Visual Hierarchy**: Destructive actions (Remove) styled differently
- **Event Driven**: Emits events for all actions
- **Positioned Overlay**: Uses absolute positioning with `left` and `top` properties

## Usage

### Basic Example

```html
<mb-cat-context-menu
  .cat="${myCat}"
  ?open="${isOpen}"
  .left="${100}"
  .top="${200}"
  @cat-rename="${handleRename}"
  @cat-change-hat="${handleChangeHat}"
  @cat-remove="${handleRemove}"
  @menu-close="${handleClose}"
></mb-cat-context-menu>
```

### With MeowzerCat Integration

```typescript
import { MeowzerCat } from "meowzer";
import type { MbCatContextMenu } from "@meowzer/ui";

const cat = await MeowzerCat.create({
  name: "Whiskers",
  // ... other properties
});

// Position menu near cat element
const catElement = document.querySelector("#cat-whiskers");
const rect = catElement.getBoundingClientRect();

const menu = document.querySelector(
  "mb-cat-context-menu"
) as MbCatContextMenu;
menu.cat = cat;
menu.left = rect.left;
menu.top = rect.bottom + 4; // 4px spacing
menu.open = true;
```

### Event Handling

```typescript
menu.addEventListener("cat-rename", (e: CustomEvent) => {
  console.log("Rename cat:", e.detail.cat);
  // Open rename dialog
  openRenameDialog(e.detail.cat);
});

menu.addEventListener("cat-change-hat", (e: CustomEvent) => {
  console.log("Change hat:", e.detail.cat);
  // Open wardrobe dialog
  openWardrobeDialog(e.detail.cat);
});

menu.addEventListener("cat-remove", (e: CustomEvent) => {
  console.log("Remove cat:", e.detail.cat);
  // Confirm and remove
  if (confirm(`Remove ${e.detail.cat.name}?`)) {
    e.detail.cat.delete();
  }
});

menu.addEventListener("menu-close", (e: CustomEvent) => {
  console.log("Menu closed");
  menu.open = false;
});
```

## API

### Properties

| Property | Type          | Default | Description              |
| -------- | ------------- | ------- | ------------------------ |
| `cat`    | `MeowzerCat?` | `null`  | The cat this menu is for |
| `open`   | `boolean`     | `false` | Whether the menu is open |
| `left`   | `number`      | `0`     | Left position in pixels  |
| `top`    | `number`      | `0`     | Top position in pixels   |

**Note**: The `open` property is reflected to an attribute for CSS styling.

### Events

| Event            | Detail                | Description                         |
| ---------------- | --------------------- | ----------------------------------- |
| `cat-rename`     | `{ cat: MeowzerCat }` | Fired when user clicks "Rename"     |
| `cat-change-hat` | `{ cat: MeowzerCat }` | Fired when user clicks "Change Hat" |
| `cat-remove`     | `{ cat: MeowzerCat }` | Fired when user clicks "Remove"     |
| `menu-close`     | `{ cat: MeowzerCat }` | Fired when menu should close        |

### CSS Parts

No exposed CSS parts (uses internal styling).

## Menu Items

The context menu displays 3 actions in this order:

1. **Rename** (normal action)

   - Opens a rename dialog for the cat
   - Non-destructive action

2. **Change Hat** (normal action)

   - Opens the wardrobe dialog
   - Non-destructive action

3. **Remove** (destructive action)
   - Removes the cat from the playground
   - Styled in red to indicate destructive action
   - Separated from other actions with a horizontal rule

## Behavior

### Opening the Menu

When `open` is set to `true`:

1. Menu renders with 3 action buttons
2. Position is set from `left` and `top` properties
3. Auto-adjustment kicks in to stay within viewport
4. Click-outside listener is attached

### Positioning Logic

The menu automatically adjusts its position to stay within viewport:

```typescript
// Adjust to prevent overflow on right edge
if (this.left + menuWidth > viewportWidth) {
  adjustedLeft = viewportWidth - menuWidth - 8;
}

// Adjust to prevent overflow on bottom edge
if (this.top + menuHeight > viewportHeight) {
  adjustedTop = viewportHeight - menuHeight - 8;
}

// Keep minimum 8px padding from edges
```

### Closing the Menu

The menu closes when:

- User clicks a menu item → Action event fires, then typically `open = false`
- User clicks outside → `menu-close` event fires
- Parent component sets `open = false`

### Click Outside Detection

Uses `composedPath()` to detect clicks outside:

```typescript
private setupClickOutside() {
  this.clickOutsideListener = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.handleClose(); // Fires menu-close event
    }
  };

  document.addEventListener("click", this.clickOutsideListener);
}
```

Cleanup happens automatically on:

- Menu close
- Component disconnect

## Integration with mb-cat-playground

The context menu is used in the cat playground when right-clicking on a cat:

```typescript
// In mb-cat-playground
private handleCatClick(cat: MeowzerCat, event: MouseEvent) {
  event.preventDefault();

  // Auto-pause cat
  if (cat.isActive) {
    cat.lifecycle.pause();
  }

  // Open context menu
  this.selectedCat = cat;
  this.contextMenuOpen = true;

  // Add visual indicator
  cat.element.classList.add("menu-open");
}

// In render:
${this.selectedCat
  ? (() => {
      const rect = this.selectedCat.element.getBoundingClientRect();
      return html`
        <mb-cat-context-menu
          .cat=${this.selectedCat}
          ?open=${this.contextMenuOpen}
          .left=${rect.left}
          .top=${rect.bottom}
          @cat-remove=${() => this.handleMenuAction("remove")}
          @cat-rename=${() => this.handleMenuAction("rename")}
          @cat-change-hat=${() => this.handleMenuAction("change-hat")}
          @menu-close=${this.closeContextMenu}
        ></mb-cat-context-menu>
      `;
    })()
  : ""}
```

## Styling

### Menu Structure

```css
:host {
  position: fixed; /* Positioned overlay */
  z-index: 1000;
  display: block;
}

.context-menu-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.menu-item.normal {
  color: var(--text-primary);
}

.menu-item.destructive {
  color: var(--color-red-500); /* Red for destructive action */
}
```

### States

- **Hover**: Background color change
- **Active**: Slightly darker background
- **Destructive**: Red text color

## Examples

### Example 1: Basic Context Menu

```html
<mb-cat-context-menu
  .cat=${cat}
  ?open=${true}
  .left=${200}
  .top=${150}
  @cat-rename=${() => console.log("Rename")}
  @cat-change-hat=${() => console.log("Change hat")}
  @cat-remove=${() => console.log("Remove")}
  @menu-close=${() => console.log("Close")}
></mb-cat-context-menu>
```

### Example 2: Positioned Below Cat Element

```typescript
const catElement = document.querySelector("#my-cat");
const rect = catElement.getBoundingClientRect();

const menu = document.querySelector("mb-cat-context-menu");
menu.cat = myCat;
menu.left = rect.left;
menu.top = rect.bottom + 4; // 4px spacing
menu.open = true;
```

### Example 3: With Confirmation Dialog

```typescript
menu.addEventListener("cat-remove", async (e: CustomEvent) => {
  const cat = e.detail.cat;

  const confirmed = confirm(
    `Are you sure you want to remove ${cat.name}?`
  );

  if (confirmed) {
    await cat.delete();
    menu.open = false;
  }
});
```

### Example 4: Chaining to Other Dialogs

```typescript
menu.addEventListener("cat-rename", (e: CustomEvent) => {
  // Close context menu
  menu.open = false;

  // Open rename dialog
  const renameDialog = document.querySelector("mb-modal");
  renameDialog.open = true;

  // Set up rename input
  const input = renameDialog.querySelector("mb-text-input");
  input.value = e.detail.cat.name;
});

menu.addEventListener("cat-change-hat", (e: CustomEvent) => {
  // Close context menu
  menu.open = false;

  // Open wardrobe dialog
  const wardrobeDialog = document.querySelector("mb-wardrobe-dialog");
  wardrobeDialog.cat = e.detail.cat;
  wardrobeDialog.open = true;
});
```

## Accessibility

- **Semantic Buttons**: All actions use `<button>` elements
- **Text Labels**: Clear, descriptive labels for each action
- **Visual Hierarchy**: Destructive action visually separated
- **Keyboard Support**: Standard button keyboard navigation
- **Focus Management**: Focus stays within menu when open

## Performance

- **Lazy Rendering**: Only renders when `open && cat` are truthy
- **Event Cleanup**: Removes click-outside listener on close
- **Position Caching**: Uses `requestAnimationFrame` for smooth positioning
- **Small Bundle**: Minimal dependencies, simple structure

## Troubleshooting

### Menu doesn't appear

**Problem**: Setting `open = true` doesn't show the menu.

**Solutions**:

- Ensure `cat` property is set to a valid MeowzerCat instance
- Check that component is in the DOM
- Verify `left` and `top` values are within viewport

### Menu appears in wrong position

**Problem**: Menu is offset or outside viewport.

**Solutions**:

- Check that `left` and `top` are calculated correctly
- Verify parent positioning context
- Ensure menu has `position: fixed` in CSS
- Check that `adjustPosition()` is running (should auto-adjust)

### Click outside doesn't close menu

**Problem**: Clicking outside the menu doesn't close it.

**Solutions**:

- Ensure `menu-close` event listener is set up
- Check that event handler sets `open = false`
- Verify click-outside listener is attached (check `updated()` lifecycle)

### Menu closes immediately on open

**Problem**: Menu closes right after opening.

**Solutions**:

- Click-outside listener has `setTimeout` to prevent immediate closure
- Check that parent click event isn't propagating
- Use `event.stopPropagation()` on trigger element

## Testing

The component includes 25 tests covering:

- Component registration and instantiation
- Property defaults and state
- Conditional rendering (open/closed, with/without cat)
- Menu item rendering (3 items with correct styles)
- Position updates and styling
- Open attribute reflection
- Lifecycle and connections
- Accessibility (semantic buttons, text content)

Run tests:

```bash
npm test -- mb-cat-context-menu.test.ts
```

## Related Components

- **mb-cat-playground** - Primary usage context
- **mb-wardrobe-dialog** - Opened via "Change Hat" action
- **mb-modal** - Used for rename dialog
- **MeowzerCat** - Cat instance required for menu
