# mb-yarn-visual

A visual representation of a yarn ball toy in the Cat Playground. Renders an SVG yarn ball that responds to yarn state changes and supports interactive dragging mode.

## Features

- **SVG Rendering**: Crisp, scalable yarn ball graphic with texture details
- **Interactive Mode**: Optional drag-and-drop support with cursor feedback
- **State Animations**: Visual feedback for idle, dragging, and rolling states
- **Customizable Appearance**: Configurable size and color
- **Meowzer Integration**: Automatic synchronization with yarn instance state
- **Physics Feedback**: Animates based on yarn velocity and movement

## Usage

### Basic Usage

```html
<mb-yarn-visual yarnId="yarn-123"></mb-yarn-visual>
```

### With Custom Size and Color

```html
<mb-yarn-visual
  yarnId="yarn-123"
  size="60"
  color="#4A90E2"
></mb-yarn-visual>
```

### Non-Interactive (Display Only)

```html
<mb-yarn-visual
  yarnId="yarn-123"
  interactive="false"
></mb-yarn-visual>
```

### In Playground Context

```typescript
import { provide } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";

@provide({ context: meowzerContext })
meowzer = new Meowzer(/* ... */);

render() {
  return html`
    <div class="playground">
      ${this.yarns.map(yarn => html`
        <mb-yarn-visual
          yarnId=${yarn.id}
          color=${yarn.color}
          size="40"
        ></mb-yarn-visual>
      `)}
    </div>
  `;
}
```

## API

### Properties

| Property      | Type      | Default     | Description                                       |
| ------------- | --------- | ----------- | ------------------------------------------------- |
| `yarnId`      | `string`  | `undefined` | **Required.** ID of the yarn instance to render   |
| `interactive` | `boolean` | `true`      | Whether the yarn can be interacted with (dragged) |
| `size`        | `number`  | `40`        | Size of the yarn ball in pixels                   |
| `color`       | `string`  | `"#FF6B6B"` | Color of the yarn ball (any valid CSS color)      |

### Attributes

| Attribute     | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `data-state`  | Current yarn state: `"idle"`, `"dragging"`, or `"rolling"` (set automatically) |
| `interactive` | Present when yarn is interactive (reflects `interactive` property)             |

### Events

This component does not emit custom events. It responds to events from the yarn instance via meowzer context.

### CSS Parts

This component does not expose CSS parts.

## Yarn States

The component automatically updates its visual state based on yarn behavior:

### Idle State

- Default state when yarn is not moving
- Standard drop shadow
- No animations

### Dragging State

- Active when user is dragging the yarn
- Enhanced drop shadow for elevation
- Cursor changes to `grabbing`
- Triggered when velocity < 50 units/second

### Rolling State

- Active when yarn is moving quickly
- Moderate drop shadow
- Rotating animation (360° spin)
- Triggered when velocity ≥ 50 units/second

## Styling

The component uses Shadow DOM with the following default styles:

```css
:host {
  position: absolute;
  pointer-events: none; /* Unless interactive */
}

:host([interactive]) {
  pointer-events: auto;
  cursor: grab;
}

:host([interactive][data-state="dragging"]) {
  cursor: grabbing;
}

:host([data-state="rolling"]) svg {
  animation: rolling 0.5s linear infinite;
}
```

### Drop Shadows

- **Idle**: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`
- **Dragging**: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))`
- **Rolling**: `drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))`

## SVG Structure

The yarn ball SVG includes:

1. **Base Circle**: Main yarn ball shape (r=45, centered at 50,50)
2. **Texture Strands**: 4 curved paths creating yarn strand pattern
3. **Highlight Ellipse**: White semi-transparent overlay for 3D effect
4. **Shadow Ellipse**: Black semi-transparent underlay for depth

All elements scale proportionally with the `size` property.

## Integration

### With Meowzer Context

The component consumes the meowzer context to access yarn instances:

```typescript
@consume({ context: meowzerContext, subscribe: true })
@state()
meowzer?: Meowzer;
```

The component automatically:

1. Retrieves the yarn instance by `yarnId`
2. Listens to `moved` and `stopped` events
3. Updates position and state based on yarn behavior
4. Cleans up listeners on disconnect

### Yarn Instance Methods Used

- `meowzer.interactions.getYarn(yarnId)` - Retrieve yarn instance
- `yarn.on("moved", handler)` - Listen for position changes
- `yarn.on("stopped", handler)` - Listen for stop events
- `yarn.startDragging(position)` - Begin dragging
- `yarn.updateDragPosition(position)` - Update drag position
- `yarn.stopDragging()` - End dragging

### Position Updates

The component updates its position via inline styles:

```typescript
this.style.transform = `translate(${x}px, ${y}px)`;
this.style.left = `-${this.size / 2}px`;
this.style.top = `-${this.size / 2}px`;
```

This ensures the yarn visual stays synchronized with its physics position.

## Examples

### Multiple Yarn Balls

```html
<div style="position: relative; width: 600px; height: 400px;">
  <mb-yarn-visual
    yarnId="yarn-1"
    color="#FF6B6B"
    size="40"
  ></mb-yarn-visual>

  <mb-yarn-visual
    yarnId="yarn-2"
    color="#4A90E2"
    size="50"
  ></mb-yarn-visual>

  <mb-yarn-visual
    yarnId="yarn-3"
    color="#4CAF50"
    size="35"
  ></mb-yarn-visual>
</div>
```

### Custom Colors

```html
<!-- Red yarn -->
<mb-yarn-visual yarnId="yarn-red" color="#FF6B6B"></mb-yarn-visual>

<!-- Blue yarn -->
<mb-yarn-visual yarnId="yarn-blue" color="#4A90E2"></mb-yarn-visual>

<!-- Green yarn -->
<mb-yarn-visual yarnId="yarn-green" color="#4CAF50"></mb-yarn-visual>

<!-- Purple yarn -->
<mb-yarn-visual yarnId="yarn-purple" color="#9C27B0"></mb-yarn-visual>
```

### Different Sizes

```html
<!-- Small -->
<mb-yarn-visual yarnId="yarn-s" size="30"></mb-yarn-visual>

<!-- Medium (default) -->
<mb-yarn-visual yarnId="yarn-m" size="40"></mb-yarn-visual>

<!-- Large -->
<mb-yarn-visual yarnId="yarn-l" size="60"></mb-yarn-visual>

<!-- Extra Large -->
<mb-yarn-visual yarnId="yarn-xl" size="80"></mb-yarn-visual>
```

## Accessibility

- **Visual Only**: This component is purely decorative and does not require ARIA attributes
- **Pointer Events**: Interactive yarn has `pointer-events: auto` and cursor feedback
- **State Indication**: Visual states (dragging, rolling) are conveyed through animations and shadows

## Troubleshooting

### Yarn Not Appearing

**Problem**: Component renders but yarn ball is not visible.

**Possible Causes**:

- Missing `yarnId` property
- Yarn instance not found in meowzer
- Parent container has no position context

**Solutions**:

1. Verify `yarnId` is set and matches a valid yarn instance
2. Check that meowzer context is provided
3. Ensure parent has `position: relative` or `position: absolute`

### Yarn Not Draggable

**Problem**: Interactive mode enabled but yarn doesn't respond to dragging.

**Possible Causes**:

- `interactive` set to `false`
- Yarn instance not supporting drag operations
- Parent element intercepting mouse events

**Solutions**:

1. Verify `interactive` property is `true`
2. Check that yarn instance has drag methods available
3. Ensure no parent has `pointer-events: none` or event handlers blocking propagation

### Position Not Updating

**Problem**: Yarn visual doesn't move when yarn instance position changes.

**Possible Causes**:

- Event listeners not attached
- Meowzer context not available
- Yarn instance not emitting events

**Solutions**:

1. Check browser console for warnings about missing yarn
2. Verify meowzer context is provided in parent component
3. Ensure yarn instance is properly initialized

### Animation Not Playing

**Problem**: Rolling animation doesn't play when yarn is moving fast.

**Possible Causes**:

- State not updating to "rolling"
- CSS animation not applying
- Velocity calculation issue

**Solutions**:

1. Check that `data-state="rolling"` attribute is present
2. Inspect element to verify CSS animation is applied
3. Verify yarn velocity is ≥ 50 units/second

## Related Components

- `mb-cat-playground` - Primary consumer of yarn visual
- `mb-playground-toolbar` - Provides yarn placement control
- `mb-need-visual` - Similar visual component for food/water
- `mb-laser-visual` - Similar visual component for laser pointer

## Technical Details

- **Component**: Custom element using Lit 3.x
- **Shadow DOM**: Enabled
- **Tag Name**: `mb-yarn-visual`
- **Dependencies**:
  - `meowzerContext` - Provides meowzer instance
  - Yarn instance from meowzer.interactions
- **File Size**: 206 lines
- **Complexity**: Medium (state management, event handling, drag interactions)
