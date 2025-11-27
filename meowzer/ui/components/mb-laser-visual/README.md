# mb-laser-visual

A visual representation of a laser pointer dot in the Cat Playground. Renders a red dot with radial gradient glow effect that follows the LaserPointer position and automatically shows/hides based on active state.

## Features

- **Realistic Laser Dot**: Red dot with multi-layer radial gradient glow
- **Automatic Show/Hide**: Displays only when laser is active
- **Position Tracking**: Follows LaserPointer instance position updates
- **Event-Driven**: Responds to laser activated, moved, and deactivated events
- **Smooth Animations**: Pulsing center dot and outer glow effects
- **Fixed Positioning**: Always rendered at viewport level with high z-index
- **No Pointer Events**: Doesn't interfere with mouse interactions

## Usage

### Basic Usage

```html
<mb-laser-visual></mb-laser-visual>
```

### With LaserPointer Instance

```typescript
import { LaserPointer } from "meowzer";

const laser = new LaserPointer("my-laser");

render() {
  return html`
    <mb-laser-visual .laser=${laser}></mb-laser-visual>
  `;
}
```

### Manual Activation

```html
<mb-laser-visual
  active
  style="transform: translate(300px, 200px);"
></mb-laser-visual>
```

### In Playground Toolbar

```typescript
class PlaygroundToolbar extends LitElement {
  private laserPointer?: LaserPointer;

  startLaser() {
    this.laserPointer = new LaserPointer("playground-laser");
    // LaserPointer automatically creates mb-laser-visual
  }

  render() {
    return html`
      ${this.laserPointer
        ? html`
            <mb-laser-visual
              .laser=${this.laserPointer}
            ></mb-laser-visual>
          `
        : ""}
    `;
  }
}
```

## API

### Properties

| Property | Type                        | Default     | Description                    |
| -------- | --------------------------- | ----------- | ------------------------------ |
| `laser`  | `LaserPointer \| undefined` | `undefined` | LaserPointer instance to track |

### Attributes

| Attribute | Description                                          |
| --------- | ---------------------------------------------------- |
| `active`  | Present when laser is active (managed automatically) |

### Events

This component does not emit custom events. It listens to events from the LaserPointer instance:

- `activated` - When laser turns on
- `moved` - When laser position changes
- `deactivated` - When laser turns off

### CSS Parts

This component does not expose CSS parts.

## LaserPointer Integration

The component automatically sets up event listeners when a `laser` property is provided:

### Event Handlers

```typescript
private _setupListeners() {
  if (!this.laser) return;

  this.laser.on("activated", this._handleActivated);
  this.laser.on("moved", this._handleMoved);
  this.laser.on("deactivated", this._handleDeactivated);

  // Initialize if already active
  if (this.laser.isActive) {
    this.position = this.laser.position;
    this.setAttribute("active", "");
  }
}
```

### Position Updates

The component centers the 64x64 SVG on the laser position:

```typescript
this.style.transform = `translate(${this.position.x - 32}px, ${
  this.position.y - 32
}px)`;
```

This ensures the laser dot appears exactly at the cursor position.

## Styling

The component uses Shadow DOM with fixed positioning:

```css
:host {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  display: none;
}

:host([active]) {
  display: block;
}
```

### Animations

Two independent animations create a dynamic effect:

#### Pulse Animation (0.8s)

- Scales center dot between 1.0 and 1.2
- Opacity alternates between 1.0 and 0.8
- Creates pulsing heartbeat effect

#### Glow Animation (1.5s)

- Scales outer glow between 1.0 and 1.3
- Opacity alternates between 0.6 and 0.3
- Creates breathing glow effect

### Visual Layers

The laser dot is composed of 5 circles:

1. **Outer Glow** (r=12): Radial gradient from red to transparent
2. **Middle Glow** (r=6): Semi-transparent red (#FF0000 @ 60% opacity)
3. **Bright Center** (r=3): Solid red core (#FF0000)
4. **Inner Center** (r=2): Lighter red (#FF4444)
5. **Highlight** (r=1): White shine (#FFFFFF @ 80% opacity)

## SVG Structure

```svg
<svg width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="laserGlow-{x}-{y}">
      <stop offset="0%" stop-color="#FF0000" stop-opacity="1"/>
      <stop offset="30%" stop-color="#FF0000" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#FF4444" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#FF0000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Circles centered at (32, 32) -->
  <circle cx="32" cy="32" r="12" fill="url(#laserGlow)"/>
  <circle cx="32" cy="32" r="6" fill="#FF0000" opacity="0.6"/>
  <circle cx="32" cy="32" r="3" fill="#FF0000"/>
  <circle cx="32" cy="32" r="2" fill="#FF4444"/>
  <circle cx="31" cy="31" r="1" fill="#FFFFFF" opacity="0.8"/>
</svg>
```

The gradient ID includes position to ensure uniqueness when multiple instances exist.

## Examples

### Standalone Laser

```html
<mb-laser-visual
  active
  style="transform: translate(250px, 150px);"
></mb-laser-visual>
```

### With LaserPointer Controller

```typescript
import { LaserPointer } from "meowzer";

class LaserController extends LitElement {
  private laser?: LaserPointer;

  activateLaser() {
    this.laser = new LaserPointer("controller-laser");

    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
      this.laser?.moveTo({ x: e.clientX, y: e.clientY });
    });
  }

  deactivateLaser() {
    this.laser?.turnOff();
    this.laser = undefined;
  }

  render() {
    return html`
      <mb-laser-visual .laser=${this.laser}></mb-laser-visual>

      <button @click=${this.activateLaser}>Activate Laser</button>
      <button @click=${this.deactivateLaser}>Deactivate Laser</button>
    `;
  }
}
```

### Multiple Positions (Demo Only)

```html
<!-- Note: In practice, only one laser is active at a time -->
<mb-laser-visual
  active
  style="transform: translate(100px, 100px);"
></mb-laser-visual>
<mb-laser-visual
  active
  style="transform: translate(300px, 200px);"
></mb-laser-visual>
<mb-laser-visual
  active
  style="transform: translate(500px, 150px);"
></mb-laser-visual>
```

## Behavior

### Show/Hide Logic

The laser visual is hidden by default (`display: none`) and only shows when the `active` attribute is present:

- **Hidden**: No `active` attribute
- **Visible**: `active` attribute present

This is managed automatically through LaserPointer events:

- `activated` event → adds `active` attribute
- `deactivated` event → removes `active` attribute

### Position Updates

When the laser moves:

1. `moved` event fires from LaserPointer
2. Component updates internal `position` state
3. Transform style is updated to center dot on new position
4. Browser smoothly animates to new position (via CSS transitions if added)

### Lifecycle

1. **Component Created**: No laser, not visible
2. **Laser Provided**: Event listeners attached, checks `isActive`
3. **Laser Activated**: `active` attribute added, position initialized
4. **Laser Moved**: Position updated via transform
5. **Laser Deactivated**: `active` attribute removed (hidden)
6. **Component Destroyed**: Event listeners cleaned up

## Accessibility

- **Visual Only**: This component is purely decorative for interactive gameplay
- **No Pointer Events**: Set to `pointer-events: none` to not interfere with clicks
- **High Z-Index**: Renders at `z-index: 9999` to appear above all playground elements
- **Fixed Positioning**: Uses `position: fixed` for viewport-level rendering

## Troubleshooting

### Laser Not Appearing

**Problem**: Component renders but laser dot is not visible.

**Possible Causes**:

- Missing `active` attribute
- LaserPointer not provided or not active
- Position is off-screen

**Solutions**:

1. Verify `active` attribute is present: check with DevTools
2. Check LaserPointer instance: `laser.isActive` should be `true`
3. Verify position is within viewport bounds

### Laser Not Following Mouse

**Problem**: Laser dot doesn't move with cursor.

**Possible Causes**:

- LaserPointer not emitting `moved` events
- No mouse tracking set up
- Event listeners not attached

**Solutions**:

1. Check that LaserPointer has mouse move handler
2. Verify `moved` event is firing: add console.log in handler
3. Ensure `laser` property is set on component

### Multiple Lasers Appearing

**Problem**: Multiple laser dots visible at once.

**Possible Causes**:

- Multiple components with same LaserPointer
- Old components not cleaned up
- Multiple `active` attributes

**Solutions**:

1. Ensure only one mb-laser-visual per LaserPointer instance
2. Clean up old laser instances when creating new ones
3. Remove `active` attribute when deactivating

### Animations Not Playing

**Problem**: Laser dot appears but doesn't pulse or glow.

**Possible Causes**:

- CSS animations disabled
- Browser performance mode
- Animation styles not loaded

**Solutions**:

1. Check browser DevTools for animation inspector
2. Verify CSS animations are enabled in browser
3. Inspect element to confirm animation styles are applied

## Related Components

- `mb-cat-playground` - Primary consumer of laser visual
- `mb-playground-toolbar` - Provides laser activation control
- `mb-yarn-visual` - Similar visual component for yarn toys
- `mb-need-visual` - Similar visual component for food/water

## Technical Details

- **Component**: Custom element using Lit 3.x
- **Shadow DOM**: Enabled
- **Tag Name**: `mb-laser-visual`
- **Dependencies**:
  - LaserPointer class from meowzer (optional)
- **File Size**: 143 lines
- **Complexity**: Low (simple visual with event handling)
- **Positioning**: Fixed at viewport level
- **Z-Index**: 9999 (top layer)
- **Pointer Events**: None (doesn't block interactions)
