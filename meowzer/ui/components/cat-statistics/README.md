# Cat Statistics

Real-time statistics display component showing cat counts and performance metrics for Meowzer playground.

## Features

- **Total Cats Count** - Displays the total number of cats in the playground
- **Active Count** - Shows how many cats are currently active/running
- **Paused Count** - Shows how many cats are paused
- **Live FPS Monitoring** - Real-time frame rate display
- **Automatic Updates** - Reactively updates as cats are added, removed, or state changes
- **Performance Optimized** - Efficient rendering with minimal overhead
- **Context Integration** - Uses Meowzer context for cat data

## Usage

### Basic Usage

```html
<meowzer-provider>
  <cat-statistics></cat-statistics>
</meowzer-provider>
```

### In Modal Dialog

```html
<meowzer-provider>
  <mb-modal open heading="Statistics">
    <cat-statistics></cat-statistics>
  </mb-modal>
</meowzer-provider>
```

### With Custom Styling

```html
<div class="stats-container">
  <cat-statistics></cat-statistics>
</div>
```

```css
.stats-container {
  padding: 1rem;
  background: var(--cds-layer-01);
  border-radius: 8px;
}
```

## API

### Properties

This component has no public properties. All data is consumed from the Meowzer context.

### Events

This component does not emit any custom events.

### CSS Parts

This component does not expose CSS parts.

## Statistics Displayed

The component shows 4 key metrics in a grid layout:

| Statistic      | Description                             | Source                      |
| -------------- | --------------------------------------- | --------------------------- |
| **Total Cats** | Total number of cats in the playground  | `cats.length`               |
| **Active**     | Number of cats currently running/active | Filtered by `cat.isActive`  |
| **Paused**     | Number of cats currently paused         | Filtered by `!cat.isActive` |
| **Frame Rate** | Current FPS (frames per second)         | Performance API measurement |

## How It Works

### Cat Counting

The component uses `CatsController` to reactively subscribe to the list of cats:

```typescript
private catsController = new CatsController(this);

get cats() {
  return this.catsController.cats;
}
```

The controller automatically triggers re-renders when the cat list changes.

### Active/Paused Counts

Counts are computed in real-time using getters:

```typescript
get activeCount(): number {
  return this.cats.filter((cat) => cat.isActive).length;
}

get pausedCount(): number {
  return this.cats.filter((cat) => !cat.isActive).length;
}
```

### FPS Monitoring

FPS is measured using `requestAnimationFrame` and the Performance API:

1. Counts frames rendered per second
2. Updates measurement every 1000ms
3. Triggers display updates every 100ms for smooth updates
4. Automatically starts on `connectedCallback`
5. Automatically stops on `disconnectedCallback`

The FPS measurement is independent of the cat rendering and measures the component's own update rate.

## Context Requirements

This component **requires** the Meowzer context to be provided by `meowzer-provider`:

```html
<!-- ✅ Correct -->
<meowzer-provider>
  <cat-statistics></cat-statistics>
</meowzer-provider>

<!-- ❌ Will not work -->
<cat-statistics></cat-statistics>
```

The component consumes:

- `meowzer` - The Meowzer instance from context
- Uses `CatsController` to access the reactive cat list

## Integration with Cat Playground

Typically used within `mb-cat-playground` in a statistics modal:

```typescript
// In mb-cat-playground
showStatistics() {
  this.showStatsDialog = true;
}

render() {
  return html`
    <mb-modal
      ?open=${this.showStatsDialog}
      heading="Statistics"
      @close=${() => this.showStatsDialog = false}
    >
      <cat-statistics></cat-statistics>
    </mb-modal>
  `;
}
```

## Dependencies

### Required Components

None - this is a standalone display component

### Required Contexts

- `meowzer-provider` - Must wrap this component to provide Meowzer context

### Required Controllers

- `CatsController` - Reactive controller for cat list subscription

### Required Packages

- `lit` - Component framework
- `@lit/context` - Context consumption
- `meowzer` - Type definitions

## Design Tokens Used

### Layout

- `--cds-spacing-05` - Grid gap between stat items
- `--cds-spacing-06` - Internal padding

### Typography

- `--cds-label-01` - Stat labels
- `--cds-heading-03` - Stat values
- `--cds-caption-01` - Unit labels (fps)

### Colors

- `--cds-text-secondary` - Stat labels
- `--cds-text-primary` - Stat values
- `--cds-border-subtle` - Dividers (if used in styling)

## Examples

### In Cat Playground Toolbar

```typescript
import { html, LitElement } from "lit";
import "@meowzer/ui/components/cat-statistics/cat-statistics.js";
import "@meowzer/ui/components/mb-modal/mb-modal.js";

class MbCatPlayground extends LitElement {
  showStatsDialog = false;

  handleShowStats() {
    this.showStatsDialog = true;
  }

  render() {
    return html`
      <button @click=${this.handleShowStats}>Show Statistics</button>

      <mb-modal
        ?open=${this.showStatsDialog}
        heading="Playground Statistics"
        @close=${() => (this.showStatsDialog = false)}
      >
        <cat-statistics></cat-statistics>
      </mb-modal>
    `;
  }
}
```

### Standalone Dashboard

```html
<meowzer-provider>
  <div class="dashboard">
    <h2>Meowzer Dashboard</h2>

    <section class="stats-section">
      <h3>Statistics</h3>
      <cat-statistics></cat-statistics>
    </section>

    <!-- Other dashboard content -->
  </div>
</meowzer-provider>
```

### With Custom Layout

```html
<meowzer-provider>
  <div class="custom-stats">
    <cat-statistics></cat-statistics>
  </div>
</meowzer-provider>

<style>
  .custom-stats {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
</style>
```

## Performance Considerations

### FPS Monitoring Overhead

The FPS monitoring uses:

- `requestAnimationFrame` for frame counting (minimal overhead)
- `setInterval` every 100ms for display updates
- Performance API for accurate timing

Total overhead is negligible (<0.1% CPU on modern hardware).

### Reactive Updates

The component only re-renders when:

1. Cat list changes (add/remove)
2. Cat active state changes
3. FPS display interval triggers (every 100ms)

This is efficient and doesn't cause unnecessary renders.

### Memory

The component:

- ✅ Cleans up intervals on disconnect
- ✅ Uses reactive controllers for automatic subscription cleanup
- ✅ No memory leaks

## Troubleshooting

### Statistics show 0 cats

**Cause**: Meowzer context not provided or no cats added yet

**Solution**:

```html
<!-- Ensure meowzer-provider wraps the component -->
<meowzer-provider>
  <cat-statistics></cat-statistics>
</meowzer-provider>
```

### FPS shows 0

**Cause**: Component just mounted, FPS not measured yet

**Solution**: Wait 1 second for first FPS measurement

### Statistics not updating

**Cause**: Component disconnected or context lost

**Solution**: Verify component is in DOM and context provider is still mounted

## Accessibility

- **Semantic HTML** - Uses divs with clear class names
- **Text Labels** - All statistics have descriptive labels
- **Screen Reader Friendly** - Labels are before values in DOM order
- **No Interactive Elements** - Display-only component (no focus management needed)
- **High Contrast** - Uses design tokens that meet WCAG AA standards
- **Clear Typography** - Large, readable stat values

## Testing

The component includes comprehensive tests covering:

- Custom element registration (2 tests)
- Rendering (7 tests)
- Cat counts (6 tests)
- FPS monitoring (4 tests)
- Context integration (2 tests)
- Layout (2 tests)
- Reactivity (1 test)
- Accessibility (3 tests)

Run tests:

```bash
npm test -- cat-statistics.test.ts
```
