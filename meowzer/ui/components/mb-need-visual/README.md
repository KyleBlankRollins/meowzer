# mb-need-visual

A visual representation of a need (food or water) in the Cat Playground. Renders SVG icons that respond to need state changes, showing different visuals based on type and active state with engaging animations.

## Features

- **3 Need Types**: Basic food, fancy food, and water with distinct SVG graphics
- **Active State Animations**: Pulsing effect when cats are consuming, shimmer effect for water
- **Consuming Indicator**: Shows count of cats currently consuming the need
- **Customizable Size**: Adjustable icon size for different layouts
- **Meowzer Integration**: Automatic synchronization with need instance state
- **Steam Effect**: Fancy food shows steam when being consumed
- **Ripple Effect**: Water shows ripples when active

## Usage

### Basic Food

```html
<mb-need-visual needId="need-123" type="food:basic"></mb-need-visual>
```

### Fancy Food

```html
<mb-need-visual needId="need-456" type="food:fancy"></mb-need-visual>
```

### Water

```html
<mb-need-visual needId="need-789" type="water"></mb-need-visual>
```

### With Custom Size

```html
<mb-need-visual
  needId="need-123"
  type="water"
  size="80"
></mb-need-visual>
```

### Interactive Mode

```html
<mb-need-visual
  needId="need-123"
  type="food:basic"
  interactive
></mb-need-visual>
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
      ${this.needs.map(need => html`
        <mb-need-visual
          needId=${need.id}
          type=${need.type}
          size="60"
        ></mb-need-visual>
      `)}
    </div>
  `;
}
```

## API

### Properties

| Property      | Type                                      | Default     | Description                                                      |
| ------------- | ----------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `needId`      | `string`                                  | `undefined` | **Required.** ID of the need instance to render                  |
| `type`        | `"food:basic" \| "food:fancy" \| "water"` | `undefined` | **Required.** Type of need to display                            |
| `interactive` | `boolean`                                 | `false`     | Whether the need can be interacted with (enables pointer events) |
| `size`        | `number`                                  | `60`        | Size of the icon in pixels                                       |

### Attributes

| Attribute     | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `data-active` | Set to `"true"` when cats are consuming (managed automatically) |
| `data-type`   | Reflects the need type (set automatically from `type` property) |

### Events

This component does not emit custom events. It responds to events from the need instance via meowzer context:

- `consumed` - When a cat consumes from the need
- `removed` - When the need is removed (component auto-removes itself)

### CSS Parts

This component does not expose CSS parts.

## Need Types

### Food: Basic

A simple food can with label:

- Brown/tan color scheme
- "FOOD" text label
- Can/bowl shape
- Turns red when active

### Food: Fancy

Premium food with presentation:

- Plate with meat/steak
- Decorative bone
- Pink/brown color scheme
- Steam effect when being consumed
- Enhanced colors when active

### Water

Water bowl with surface effects:

- Blue bowl with water
- Wave patterns on surface
- Highlight reflections
- Ripple effects when active
- Shimmer animation when cats drinking

## Active State Behavior

The component automatically updates its visual state based on whether cats are consuming:

### Inactive (No Cats Consuming)

- Standard colors
- Basic drop shadow
- No animations
- No consuming indicator

### Active (Cats Consuming)

- Enhanced colors (brighter, more vibrant)
- Stronger drop shadow
- Pulsing animation (scale 1.0 → 1.05)
- Consuming indicator showing cat count
- Special effects:
  - **Basic Food**: Pulsing only
  - **Fancy Food**: Pulsing + steam lines
  - **Water**: Pulsing + shimmer + ripples

## Styling

The component uses Shadow DOM with the following default styles:

```css
:host {
  position: absolute;
  pointer-events: none;
}

:host([interactive]) {
  pointer-events: auto;
  cursor: pointer;
}

:host([data-active="true"]) svg {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Animations

- **Pulse**: 1.5s ease-in-out infinite (scale 1.0 → 1.05 → 1.0)
- **Shimmer** (water only): 2s ease-in-out infinite (brightness + shadow color)
- **Fade In** (consuming indicator): 0.2s ease on appearance

### Drop Shadows

- **Inactive**: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))`
- **Active**: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))`
- **Hover** (interactive): `drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))`

## Consuming Indicator

When cats are consuming the need, a small badge appears showing the count:

```
┌─────────┐
│  2 cats │
└─────────┘
```

Features:

- Shows singular "cat" or plural "cats"
- Brand primary color background
- Animates in with fade + slide
- Auto-updates when cats start/stop consuming

## SVG Structure

### Basic Food Icon

- Shadow ellipse
- Can body (rectangle with rounded corners)
- Top rim (ellipse)
- Label area with "FOOD" text
- Shine highlight

### Fancy Food Icon

- Shadow ellipse
- Plate (ellipse)
- Meat/steak (ellipse with highlight)
- Bone decoration (rotated group with circles)
- Steam lines (when active)

### Water Icon

- Shadow ellipse
- Bowl base (path)
- Bowl rim (ellipse)
- Water surface (ellipse)
- Wave pattern (path)
- Highlights (ellipses)
- Ripples (when active)

All SVG elements scale proportionally with the `size` property.

## Integration

### With Meowzer Context

The component consumes the meowzer context to access need instances:

```typescript
@consume({ context: meowzerContext, subscribe: true })
@state()
meowzer?: Meowzer;
```

The component automatically:

1. Retrieves the need instance by `needId`
2. Listens to `consumed` and `removed` events
3. Updates position and active state
4. Shows consuming indicator with cat count
5. Cleans up listeners on disconnect
6. Auto-removes when need is removed

### Need Instance Methods Used

- `meowzer.interactions.getNeed(needId)` - Retrieve need instance
- `need.on("consumed", handler)` - Listen for consumption events
- `need.on("removed", handler)` - Listen for removal
- `need.getConsumingCats()` - Get array of cat IDs currently consuming
- `need.position` - Get need position for placement

### Position Updates

The component updates its position via inline styles:

```typescript
this.style.transform = `translate(${x}px, ${y}px)`;
this.style.left = `-${this.size / 2}px`;
this.style.top = `-${this.size / 2}px`;
```

This centers the need visual on its position coordinates.

## Examples

### All Three Types

```html
<div style="position: relative; width: 600px; height: 200px;">
  <mb-need-visual
    needId="need-1"
    type="food:basic"
    size="60"
    style="left: 100px; top: 100px;"
  ></mb-need-visual>

  <mb-need-visual
    needId="need-2"
    type="food:fancy"
    size="60"
    style="left: 300px; top: 100px;"
  ></mb-need-visual>

  <mb-need-visual
    needId="need-3"
    type="water"
    size="60"
    style="left: 500px; top: 100px;"
  ></mb-need-visual>
</div>
```

### Active vs Inactive

```html
<!-- Inactive -->
<mb-need-visual
  needId="need-inactive"
  type="water"
  data-active="false"
></mb-need-visual>

<!-- Active (being consumed) -->
<mb-need-visual
  needId="need-active"
  type="water"
  data-active="true"
></mb-need-visual>
```

### Different Sizes

```html
<!-- Small -->
<mb-need-visual
  needId="need-s"
  type="food:basic"
  size="40"
></mb-need-visual>

<!-- Medium (default) -->
<mb-need-visual
  needId="need-m"
  type="food:basic"
  size="60"
></mb-need-visual>

<!-- Large -->
<mb-need-visual
  needId="need-l"
  type="food:basic"
  size="80"
></mb-need-visual>

<!-- Extra Large -->
<mb-need-visual
  needId="need-xl"
  type="food:basic"
  size="100"
></mb-need-visual>
```

## Accessibility

- **Visual Only**: This component is purely decorative and does not require ARIA attributes
- **Pointer Events**: Interactive needs have `pointer-events: auto` and cursor feedback
- **State Indication**: Active state is conveyed through visual animations and consuming indicator
- **Text Labels**: Consuming indicator provides text count of cats

## Troubleshooting

### Need Not Appearing

**Problem**: Component renders but need icon is not visible.

**Possible Causes**:

- Missing `needId` or `type` property
- Need instance not found in meowzer
- Parent container has no position context

**Solutions**:

1. Verify both `needId` and `type` are set
2. Check that meowzer context is provided
3. Ensure parent has `position: relative` or `position: absolute`

### Active State Not Updating

**Problem**: Need doesn't pulse/animate when cats are consuming.

**Possible Causes**:

- Event listeners not attached
- Need instance not emitting events
- `data-active` attribute not updating

**Solutions**:

1. Check browser console for warnings about missing need
2. Verify need instance has consuming cats via `getConsumingCats()`
3. Ensure meowzer context is available

### Steam/Ripples Not Showing

**Problem**: Special effects (steam on fancy food, ripples on water) don't appear when active.

**Possible Causes**:

- Need is not in active state
- Wrong need type
- CSS animations disabled

**Solutions**:

1. Verify `data-active="true"` attribute is present
2. Check that type matches: steam for `food:fancy`, ripples for `water`
3. Test animations with DevTools animation inspector

### Consuming Indicator Not Appearing

**Problem**: Badge showing cat count doesn't display.

**Possible Causes**:

- No cats currently consuming
- Need instance not tracking consumers
- Component not receiving updates

**Solutions**:

1. Verify cats are actually consuming via `need.getConsumingCats()`
2. Check that need events are firing
3. Inspect DOM to see if indicator element exists

## Related Components

- `mb-cat-playground` - Primary consumer of need visuals
- `mb-playground-toolbar` - Provides need placement controls
- `mb-yarn-visual` - Similar visual component for yarn toys
- `mb-laser-visual` - Similar visual component for laser pointer

## Technical Details

- **Component**: Custom element using Lit 3.x
- **Shadow DOM**: Enabled
- **Tag Name**: `mb-need-visual`
- **Dependencies**:
  - `meowzerContext` - Provides meowzer instance
  - Need instance from meowzer.interactions
- **File Size**: 265 lines
- **Complexity**: Medium (state management, event handling, conditional rendering)
