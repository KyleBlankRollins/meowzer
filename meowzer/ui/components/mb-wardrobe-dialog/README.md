# mb-wardrobe-dialog

A modal dialog component for customizing cat hats in the Meowzer playground. Provides hat type selection with live SVG preview and color customization controls.

## Features

- **3 Hat Types**: Beanie, Cowboy, and Baseball cap styles
- **Live Preview**: Real-time SVG rendering of hat with selected colors
- **Color Customization**: Separate base and accent color pickers
- **State Management**: Initializes from cat's current hat if present
- **Smart Updates**: Detects hat type changes and handles appropriately
- **Event Driven**: Emits events for dialog close and hat application

## Usage

### Basic Example

```html
<mb-wardrobe-dialog
  .cat="${myCat}"
  ?open="${isOpen}"
  @dialog-close="${handleClose}"
  @hat-applied="${handleHatApplied}"
></mb-wardrobe-dialog>
```

### With MeowzerCat Integration

```typescript
import { MeowzerCat } from "meowzer";
import type { MbWardrobeDialog } from "@meowzer/ui";

// Create or get a cat
const cat = await MeowzerCat.create({
  name: "Fluffy",
  // ... other properties
});

// Open wardrobe dialog
const dialog = document.querySelector(
  "mb-wardrobe-dialog"
) as MbWardrobeDialog;
dialog.cat = cat;
dialog.open = true;

// Handle events
dialog.addEventListener("hat-applied", (e: CustomEvent) => {
  console.log("Hat applied:", e.detail);
  // { type: "beanie", baseColor: "#FF0000", accentColor: "#FFFF00" }
});

dialog.addEventListener("dialog-close", (e: CustomEvent) => {
  console.log("Dialog closed:", e.detail);
  // { applied: true } or { applied: false }
  dialog.open = false;
});
```

### Programmatic Hat Management

```typescript
// Check if cat has a hat
const hasHat = cat.accessories.hasHat();

// Get current hat
const currentHat = cat.accessories.getHat();
// Returns: { type: "beanie", baseColor: "#FF0000", accentColor: "#FFFF00" } or null

// Add a hat programmatically (without dialog)
cat.accessories.addHat("cowboy", "#8B4513", "#FFD700");

// Update hat colors
cat.accessories.updateHatColors("#FF0000", "#00FF00");

// Remove hat
cat.accessories.removeHat();
```

## API

### Properties

| Property | Type          | Default | Description                |
| -------- | ------------- | ------- | -------------------------- |
| `cat`    | `MeowzerCat?` | `null`  | The cat to customize       |
| `open`   | `boolean`     | `false` | Whether the dialog is open |

### Events

| Event          | Detail                                                      | Description                                   |
| -------------- | ----------------------------------------------------------- | --------------------------------------------- |
| `dialog-close` | `{ applied: boolean }`                                      | Fired when dialog closes (cancel or apply)    |
| `hat-applied`  | `{ type: HatType, baseColor: string, accentColor: string }` | Fired when hat is successfully applied to cat |

### Hat Types

Available hat types (from `meowzer` package):

- `"beanie"` - Casual knit beanie
- `"cowboy"` - Western cowboy hat
- `"baseball"` - Sports baseball cap

### CSS Parts

No exposed CSS parts (uses internal modal and component styling).

## Internal Structure

### Hat Selection

The dialog renders 3 hat type buttons, each showing:

- SVG preview of the hat with current colors
- Hat type label
- Active state indicator (primary variant when selected)

### Color Customization

Two color pickers control:

1. **Base Color** - Primary hat color
2. **Accent Color** - Secondary/detail color

Colors are applied in real-time to hat preview buttons.

### State Initialization

When the dialog opens (`open` property changes to `true`):

1. Checks if cat has existing hat via `cat.accessories.getHat()`
2. If hat exists, initializes with current hat's type and colors
3. If no hat, initializes with defaults:
   - Type: `"beanie"`
   - Base Color: `"#FF0000"` (red)
   - Accent Color: `"#FFFF00"` (yellow)

### Hat Application Logic

When user clicks "Apply Hat":

1. **Existing Hat, Same Type**: Updates colors only via `updateHatColors()`
2. **Existing Hat, Different Type**: Removes old hat, adds new with `addHat()`
3. **No Hat**: Adds new hat with `addHat()`

This ensures smooth transitions and proper state management.

## Dialog Behavior

### Opening

```typescript
dialog.cat = myCat;
dialog.open = true; // Triggers state initialization
```

### Closing

Dialog closes on:

- Cancel button click
- Apply button click (after applying hat)
- Modal's X button
- Outside click (modal default behavior)
- Escape key (modal default behavior)

All closure methods emit `dialog-close` event with `applied` status.

### Event Flow

1. **User selects hat type** → Internal state updates → Preview updates
2. **User changes colors** → Internal state updates → Preview updates
3. **User clicks Apply**:
   - Hat added/updated on cat
   - `hat-applied` event fires
   - `dialog-close` event fires with `{ applied: true }`
4. **User clicks Cancel**:
   - No changes to cat
   - `dialog-close` event fires with `{ applied: false }`

## Integration with mb-cat-playground

The wardrobe dialog is used in the cat playground for the "Change Hat" context menu action:

```typescript
// In mb-cat-playground
private handleChangeHat() {
  this.keepSelectedCat = true; // Maintain cat selection
  this.contextMenuOpen = false; // Close context menu
}

private handleWardrobeDialogClose() {
  this.keepSelectedCat = false;
  if (this.selectedCat && !this.selectedCat.isActive) {
    this.selectedCat.lifecycle.resume();
  }
  this.selectedCat = null;
}

// In render:
<mb-wardrobe-dialog
  .cat=${this.selectedCat}
  ?open=${this.selectedCat && this.keepSelectedCat}
  @dialog-close=${this.handleWardrobeDialogClose}
></mb-wardrobe-dialog>
```

## Dependencies

### Component Dependencies

- `mb-modal` - Dialog container
- `mb-button` - Action buttons and hat selection buttons
- `mb-color-picker` - Color customization controls

### Package Dependencies

- `meowzer` - MeowzerCat class and hat management
- `lit` - Component framework
- `lit/directives/unsafe-svg.js` - For rendering SVG previews

## Design Tokens

Uses standard component tokens through composed components:

- Modal sizing: `sm` modal size
- Button variants: `primary`, `secondary`, `tertiary`
- Color picker styling (inherited from mb-color-picker)

## Examples

### Example 1: Basic Integration

```html
<mb-wardrobe-dialog
  .cat=${cat}
  ?open=${wardrobeOpen}
  @dialog-close=${() => wardrobeOpen = false}
></mb-wardrobe-dialog>
```

### Example 2: With Cat Creation

```typescript
const cat = await MeowzerCat.create({
  name: "Mittens",
  furColor: "#808080",
  eyeColor: "#00FF00",
});

const dialog = document.querySelector("mb-wardrobe-dialog");
dialog.cat = cat;
dialog.open = true;
```

### Example 3: Listening to Hat Changes

```typescript
dialog.addEventListener("hat-applied", (e: CustomEvent) => {
  const { type, baseColor, accentColor } = e.detail;

  // Save to database
  await saveCatHat(cat.id, { type, baseColor, accentColor });

  // Show success message
  showNotification(`${type} hat applied!`);

  // Update UI
  updateCatPreview(cat);
});
```

### Example 4: Conditional Hat Removal

```typescript
// You could extend this to include a "Remove Hat" button
dialog.addEventListener("hat-applied", async (e: CustomEvent) => {
  if (e.detail.type === null) {
    // Custom extension: remove hat
    cat.accessories.removeHat();
  }
});
```

## Accessibility

- **Semantic Labels**: Section headers for hat selection and color customization
- **Button Labels**: Clear text labels for each hat type
- **Color Picker Labels**: Descriptive labels for base and accent colors
- **Modal Accessibility**: Inherits focus trap and keyboard navigation from mb-modal
- **ARIA**: Modal component provides proper ARIA attributes

## Performance

- **Lazy SVG Generation**: Hat previews only rendered when needed
- **Efficient Updates**: Only re-renders when state changes
- **Small Bundle**: Leverages shared modal and component code

## Troubleshooting

### Hat doesn't apply

**Problem**: Clicking "Apply Hat" doesn't update the cat.

**Solutions**:

- Ensure `cat` property is set to a valid MeowzerCat instance
- Check that cat has accessories initialized
- Verify cat is not in an error state

### Colors don't update

**Problem**: Color changes don't reflect in preview.

**Solutions**:

- Ensure mb-color-picker components are working
- Check that color values are valid hex colors
- Verify `@mb-change` events are firing

### Dialog won't open

**Problem**: Setting `open = true` doesn't show dialog.

**Solutions**:

- Check that mb-modal component is registered
- Verify no CSS hiding the modal
- Ensure `open` property is bound correctly

### State doesn't initialize

**Problem**: Dialog always shows default colors instead of cat's current hat.

**Solutions**:

- Check that cat has a hat: `cat.accessories.hasHat()`
- Verify `updated()` lifecycle is firing when `open` changes
- Ensure cat reference is valid when dialog opens

## Testing

The component includes 30 tests covering:

- Component registration and instantiation
- Property defaults and state
- Hat type button rendering (3 types)
- Color picker rendering (2 pickers)
- Dialog structure and footer buttons
- Modal integration and state passing
- Lifecycle and connections
- Accessibility labels and structure

Run tests:

```bash
npm test -- mb-wardrobe-dialog.test.ts
```

## Related Components

- **mb-modal** - Dialog container
- **mb-button** - Action and selection buttons
- **mb-color-picker** - Color customization
- **mb-cat-playground** - Primary usage context
- **mb-cat-context-menu** - Triggers wardrobe dialog
