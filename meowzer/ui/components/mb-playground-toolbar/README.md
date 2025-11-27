# mb-playground-toolbar

A vertical toolbar component providing quick access to all playground interactions and controls. The toolbar serves as the primary control panel for the Cat Playground, featuring 7 interaction buttons organized into logical groups.

## Features

- **7 Interaction Buttons**: Create cats, view stats, and control 5 different playground interactions
- **Visual Grouping**: Buttons organized with dividers for better UX
- **Cursor Controller Integration**: Seamless placement mode with custom cursors for food, water, and yarn
- **Laser Pointer Control**: Toggle laser pointer with mouse tracking
- **Active State Indicators**: Visual feedback for active placement and laser modes
- **Accessible Design**: Proper ARIA roles, labels, and tooltips for all controls
- **Custom SVG Icons**: Unique icons for each interaction type

## Button Layout

The toolbar is organized into three logical groups:

### Group 1: Management (Top)

1. **Create Cat** (Primary) - Opens cat creator dialog
2. **View Statistics** (Tertiary) - Opens statistics dashboard

### Group 2: Placement (Middle)

3. **Basic Food** (Tertiary) - Place basic food bowl
4. **Fancy Food** (Tertiary) - Place fancy food bowl with fish
5. **Water** (Tertiary) - Place water bowl

### Group 3: Interactive Play (Bottom)

6. **Laser Pointer** (Tertiary) - Toggle laser pointer mode
7. **Yarn Ball** (Tertiary) - Place yarn ball for play

## Usage

### Basic Usage

```html
<mb-playground-toolbar></mb-playground-toolbar>
```

### With Event Handlers

```typescript
<mb-playground-toolbar
  @create-cat=${this.handleCreateCat}
  @view-stats=${this.handleViewStats}
  @laser-activated=${this.handleLaserActivated}
></mb-playground-toolbar>
```

### In Playground Layout

```html
<div class="playground-container">
  <mb-playground-toolbar
    @create-cat="${this.openCreatorDialog}"
    @view-stats="${this.openStatsDialog}"
    @laser-activated="${this.handleLaserActivated}"
  ></mb-playground-toolbar>

  <div class="playground-main">
    <!-- Cat playground content -->
  </div>
</div>
```

```css
.playground-container {
  display: flex;
  height: 100vh;
}

mb-playground-toolbar {
  flex-shrink: 0;
}

.playground-main {
  flex: 1;
  position: relative;
}
```

## API

### Properties

| Property       | Type                        | Default     | Description                                            |
| -------------- | --------------------------- | ----------- | ------------------------------------------------------ |
| `meowzer`      | `Meowzer \| undefined`      | `undefined` | Meowzer instance from context (consumed automatically) |
| `laserPointer` | `LaserPointer \| undefined` | `undefined` | Active laser pointer instance (managed internally)     |

### Events

| Event             | Detail                | Description                                    |
| ----------------- | --------------------- | ---------------------------------------------- |
| `create-cat`      | `{}`                  | Emitted when create cat button is clicked      |
| `view-stats`      | `{}`                  | Emitted when view statistics button is clicked |
| `laser-activated` | `{ position: Point }` | Emitted when laser pointer is activated        |

All events bubble and are composed (cross shadow DOM boundaries).

### CSS Custom Properties

The toolbar uses standard Carbon Design System spacing and colors. No custom CSS properties are exposed.

## Interaction Modes

### Placement Mode

When a placement button (food, water, yarn) is clicked:

1. Cursor controller activates with appropriate cursor icon
2. Button shows active state (`data-active` attribute)
3. User clicks playground to place item
4. Mode automatically deactivates after placement
5. `meowzer.interactions.placeNeed()` or `placeYarn()` is called

**Cursor Types:**

- `food:basic` - Basic food bowl cursor
- `food:fancy` - Fancy food (fish) cursor
- `water` - Water bowl cursor
- `yarn` - Yarn ball cursor

**Placement Exclusions:**
The toolbar itself is excluded from placement targets via `excludeSelector: "mb-playground-toolbar"`.

### Laser Mode

When laser button is clicked:

1. LaserPointer instance is created
2. Mouse cursor is hidden (`document.body.style.cursor = "none"`)
3. Mouse tracking begins - laser follows cursor
4. Global laser events are emitted for cats to detect
5. `laser-activated` event fires with initial position
6. Click laser button again to deactivate

**Laser Events (Global):**

- `laser:activated` - When laser turns on
- `laser:moved` - Continuous movement updates
- `laser:deactivated` - When laser turns off

These events are emitted to the global interactions emitter for cat behavior detection.

### Direct Action Modes

Create Cat and View Stats buttons emit events immediately without entering special modes. Parent components handle these by opening dialogs.

## Integration

### With Meowzer Context

The toolbar consumes the meowzer context to access interactions:

```typescript
import { provide } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";

@provide({ context: meowzerContext })
meowzer = new Meowzer(/* ... */);
```

The toolbar automatically consumes this context and uses it for placement and interaction operations.

### With Cursor Controller

The toolbar uses a `CursorController` to manage placement cursors:

- Preloads cursor assets on component connect
- Activates cursors on demand
- Handles cursor cleanup on component disconnect

### With Laser Pointer

The toolbar manages a `LaserPointer` instance:

- Creates on laser activation
- Tracks mouse movement
- Emits global events for cat detection
- Cleans up on deactivation or component disconnect

## Examples

### Handling Toolbar Events

```typescript
class PlaygroundContainer extends LitElement {
  private handleCreateCat() {
    this.creatorDialogOpen = true;
  }

  private handleViewStats() {
    this.statsDialogOpen = true;
  }

  private handleLaserActivated(e: CustomEvent) {
    console.log("Laser activated at:", e.detail.position);
    // Update UI or trigger animations
  }

  render() {
    return html`
      <mb-playground-toolbar
        @create-cat=${this.handleCreateCat}
        @view-stats=${this.handleViewStats}
        @laser-activated=${this.handleLaserActivated}
      ></mb-playground-toolbar>

      <mb-cat-creator-dialog
        ?open=${this.creatorDialogOpen}
        @close=${() => (this.creatorDialogOpen = false)}
      ></mb-cat-creator-dialog>

      <mb-stats-dialog
        ?open=${this.statsDialogOpen}
        @close=${() => (this.statsDialogOpen = false)}
      ></mb-stats-dialog>
    `;
  }
}
```

### Custom Styling

```css
/* Position toolbar as fixed sidebar */
mb-playground-toolbar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 10;
}

/* Or flex layout */
.container {
  display: flex;
}

mb-playground-toolbar {
  flex-shrink: 0;
}
```

## SVG Icons

The toolbar includes custom SVG icons for each interaction:

- **Create Cat**: Plus icon (16x16)
- **Statistics**: Bar chart icon (16x16)
- **Basic Food**: Food bowl icon (100x100 viewBox)
- **Fancy Food**: Food bowl with fish icon (100x100 viewBox)
- **Water**: Water bowl icon (100x100 viewBox)
- **Laser Pointer**: Red dot with glow effect (64x64 viewBox)
- **Yarn Ball**: Yarn ball icon (100x100 viewBox)

All icons are embedded SVG and scale appropriately with button size.

## Accessibility

- **Toolbar Role**: `role="toolbar"` for proper keyboard navigation
- **ARIA Label**: `aria-label="Playground Controls"` for screen readers
- **Button Tooltips**: All buttons have descriptive `title` attributes
- **Keyboard Support**: Full keyboard navigation inherited from `mb-button`
- **Visual States**: Active states clearly indicated for placement and laser modes

## Troubleshooting

### Placement Not Working

**Problem**: Clicking placement buttons doesn't activate cursor mode.

**Possible Causes**:

- Meowzer context not provided
- Cursor assets not loaded
- Browser blocking cursor changes

**Solutions**:

1. Ensure meowzer context is provided in parent component
2. Check browser console for asset loading errors
3. Verify cursor controller initialization

### Laser Pointer Not Appearing

**Problem**: Laser button activates but no laser visible.

**Possible Causes**:

- LaserPointer not rendering
- Z-index issues
- Global interactions not initialized

**Solutions**:

1. Check that LaserPointer DOM element is created
2. Verify z-index on playground container
3. Ensure global interactions are set up

### Events Not Firing

**Problem**: Toolbar events not received by parent.

**Possible Causes**:

- Event listeners not attached
- Shadow DOM event boundaries
- Event names misspelled

**Solutions**:

1. Verify event listener syntax: `@create-cat` not `@createCat`
2. Ensure parent component is listening
3. Check browser console for errors

### Active States Not Showing

**Problem**: Buttons don't show active state when placement/laser active.

**Possible Causes**:

- CSS for `data-active` not defined
- State not updating
- Button variant overriding styles

**Solutions**:

1. Check that `data-active` attribute is present in DOM
2. Verify button component supports active state styling
3. Inspect computed styles in DevTools

## Related Components

- `mb-button` - Button component used for all toolbar buttons
- `mb-cat-playground` - Primary consumer of toolbar
- `mb-cat-creator-dialog` - Opened by create cat button
- `mb-stats-dialog` - Opened by view stats button
- `mb-need-visual` - Food/water visuals placed by toolbar
- `mb-yarn-visual` - Yarn visual placed by toolbar
- `mb-laser-visual` - Laser visual controlled by toolbar

## Technical Details

- **Component**: Custom element using Lit 3.x
- **Shadow DOM**: Enabled
- **Tag Name**: `mb-playground-toolbar`
- **Dependencies**:
  - `CursorController` - Manages placement cursors
  - `LaserPointer` - Manages laser pointer
  - `meowzerContext` - Provides meowzer instance
  - `mb-button` - Button components
- **File Size**: 452 lines
- **Complexity**: High (multiple interaction modes, global events, lifecycle management)
