# MB Cat Playground

Complete interactive playground component for creating, managing, and interacting with Meowzer cats.

## Features

- **Cat Management** - Create, rename, and remove cats
- **Interactive Toolbar** - Quick actions for common operations
- **Visual Interactions** - Laser pointer, yarn balls, feeding/watering
- **Live Statistics** - Real-time cat count and performance metrics
- **Context Menu** - Right-click on cats for actions
- **Hat Customization** - Change cat accessories via wardrobe dialog
- **Persistent Storage** - Automatically saves cats to IndexedDB
- **Auto-load** - Loads existing cats on mount
- **Responsive Layout** - Adapts to viewport size

## Usage

### Basic Usage

```html
<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

### Required Context

This component **must** be wrapped in `<meowzer-provider>`:

```html
<!-- ✅ Correct -->
<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>

<!-- ❌ Will not work -->
<mb-cat-playground></mb-cat-playground>
```

### Custom Configuration

```html
<meowzer-provider
  storage-enabled
  default-collection="my-cats"
  auto-init
>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

## API

### Properties

This component has no public properties. All data is consumed from the Meowzer context.

### Events

This component does not emit custom events. It listens to events from child components.

### CSS Parts

This component does not expose CSS parts.

## Component Structure

The playground consists of several integrated components:

```
mb-cat-playground
├── .playground-container
│   ├── .preview-area (cat display area)
│   ├── mb-playground-toolbar (action buttons)
│   ├── .active-yarns (yarn ball visuals)
│   ├── .active-laser (laser pointer visual)
│   ├── .active-needs (food/water visuals)
│   ├── mb-cat-context-menu (cat right-click menu)
│   ├── #creator-dialog (cat creation modal)
│   ├── #stats-dialog (statistics modal)
│   ├── #rename-dialog (rename modal)
│   └── mb-wardrobe-dialog (hat selection modal)
```

## Integrated Components

### Core Components

| Component               | Purpose                           | Location           |
| ----------------------- | --------------------------------- | ------------------ |
| `mb-playground-toolbar` | Action buttons (add, remove, etc) | Fixed sidebar      |
| `cat-creator`           | Cat creation wizard               | Modal dialog       |
| `cat-statistics`        | Live stats display                | Modal dialog       |
| `mb-cat-context-menu`   | Cat right-click menu              | Contextual overlay |
| `mb-wardrobe-dialog`    | Hat customization                 | Modal dialog       |

### Visual Components

| Component         | Purpose               | Trigger                         |
| ----------------- | --------------------- | ------------------------------- |
| `mb-yarn-visual`  | Animated yarn ball    | Toolbar "Play with Yarn" button |
| `mb-laser-visual` | Red laser pointer dot | Toolbar "Laser Pointer" button  |
| `mb-need-visual`  | Food/water bowl       | Toolbar "Feed" or "Give Water"  |

## Features in Detail

### Cat Creation

Click the "Add Cat" button in the toolbar to open the cat creator:

1. **Basic Info** - Name and description
2. **Appearance** - Colors, pattern, size, fur length
3. **Personality** - Trait sliders or presets
4. **Behavior** - Roaming enabled, initial position

Cats are automatically:

- Added to the DOM
- Saved to IndexedDB
- Given random starting positions
- Set up with event listeners

### Cat Management

**Remove Cat:**

1. Click on a cat to open context menu
2. Select "Remove"
3. Cat is destroyed and removed from storage

**Rename Cat:**

1. Click on a cat to open context menu
2. Select "Rename"
3. Enter new name in dialog
4. Cat is updated in storage

**Change Hat:**

1. Click on a cat to open context menu
2. Select "Change Hat"
3. Choose hat style and colors in wardrobe
4. Hat is updated and saved

### Interactive Elements

**Laser Pointer:**

- Click "Laser Pointer" in toolbar
- Move mouse to control laser position
- Cats chase the laser dot
- Click again to deactivate

**Yarn Balls:**

- Click "Play with Yarn" in toolbar
- Yarn ball appears
- Cats play with yarn
- Yarn auto-removes after interaction

**Feeding:**

- Click "Feed Cat" in toolbar
- Food bowl appears
- Cats can eat to satisfy hunger
- Bowl remains until consumed

**Water:**

- Click "Give Water" in toolbar
- Water bowl appears
- Cats can drink to satisfy thirst
- Bowl remains until consumed

### Statistics

Click "Show Statistics" to view:

- Total cat count
- Active cats count
- Paused cats count
- Current FPS

### Context Menu

Right-click (or click) on any cat to open menu with options:

- **Remove** - Delete the cat
- **Rename** - Change cat's name
- **Change Hat** - Open wardrobe dialog

Auto-pauses the cat when menu opens.

## Lifecycle

### Initialization

1. Component mounts
2. Waits for Meowzer context from provider
3. Sets up event listeners (yarn, needs, etc.)
4. Loads existing cats from IndexedDB
5. Spawns loaded cats with random positions

### Cleanup

When component unmounts:

1. All cats are destroyed
2. Event listeners are removed
3. Visual elements (yarn, laser, needs) are cleaned up
4. Storage connection is closed (by provider)

## Storage Integration

Cats are automatically persisted to IndexedDB:

**Saved:**

- When cat is created
- When cat is renamed
- When hat is changed

**Loaded:**

- On component mount
- From default collection configured in provider

**Deleted:**

- When cat is removed via context menu

The playground uses the Meowzer storage API:

```typescript
await this.meowzer.storage.loadCollection(defaultCollection);
```

## Event System

The playground listens to several Meowzer events:

### Yarn Events

- `yarnAdded` - Renders new yarn visual
- `yarnRemoved` - Removes yarn visual

### Need Events

- `needAdded` - Renders food/water visual
- `needRemoved` - Removes food/water visual

### Cat Events

- Cat click - Opens context menu
- Auto-pause on menu open

## Dependencies

### Required Components

- `mb-playground-toolbar` - Action buttons
- `cat-creator` - Cat creation
- `cat-statistics` - Statistics display
- `mb-cat-context-menu` - Context menu
- `mb-wardrobe-dialog` - Hat customization
- `mb-yarn-visual` - Yarn animation
- `mb-laser-visual` - Laser pointer
- `mb-need-visual` - Food/water visuals
- `mb-modal` - Dialog wrapper
- `mb-text-input` - Rename input

### Required Contexts

- `meowzer-provider` - Must wrap this component

### Required Controllers

- `CatsController` - Reactive cat list subscription

### Required Packages

- `meowzer` - Core cat engine
- `lit` - Component framework
- `@lit/context` - Context consumption

## Design Tokens Used

### Layout

- `--cds-spacing-05` - Component spacing
- `--cds-spacing-07` - Dialog padding

### Typography

- `--cds-body-01` - Body text
- `--cds-heading-03` - Dialog headings

### Colors

- `--cds-background` - Playground background
- `--cds-layer-01` - Dialog backgrounds
- `--cds-text-primary` - Primary text
- `--cds-text-secondary` - Secondary text

## Examples

### Basic Playground

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="/dist/ui.js"></script>
  </head>
  <body>
    <meowzer-provider auto-init>
      <mb-cat-playground></mb-cat-playground>
    </meowzer-provider>
  </body>
</html>
```

### With Custom Storage

```html
<meowzer-provider
  storage-enabled
  default-collection="playground-cats"
  auto-init
>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

### Listening to Meowzer Events

```typescript
import { html, LitElement } from "lit";

class MyApp extends LitElement {
  meowzer: Meowzer;

  connectedCallback() {
    super.connectedCallback();

    // Access meowzer from provider context
    this.meowzer.cats.on("catAdded", (cat) => {
      console.log("New cat added:", cat.name);
    });

    this.meowzer.cats.on("catRemoved", (id) => {
      console.log("Cat removed:", id);
    });
  }

  render() {
    return html`
      <meowzer-provider auto-init>
        <mb-cat-playground></mb-cat-playground>
      </meowzer-provider>
    `;
  }
}
```

### Programmatic Cat Creation

```typescript
// In a component that has access to Meowzer context
async createRandomCat() {
  const cat = await this.meowzer.cats.create({
    name: "Random Cat",
    appearance: {
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      pattern: "solid"
    },
    personality: { preset: "playful" }
  });

  // Cat is automatically added to playground and saved
}
```

## Accessibility

- **Keyboard Navigation** - All interactive elements are keyboard accessible
- **Focus Management** - Proper focus handling in dialogs
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Dialog Modality** - Proper modal behavior with focus trapping
- **Context Menu** - Accessible via click (not just right-click)
- **Button Labels** - Clear, descriptive button text in toolbar

## Performance

### Optimizations

- **Reactive Controllers** - Efficient cat list subscription
- **Event Debouncing** - FPS monitoring throttled
- **Lazy Rendering** - Visuals only render when active
- **Efficient Updates** - Only re-renders on state changes
- **Auto Cleanup** - Removes listeners and cats on unmount

### Best Practices

- Keep cat count reasonable (recommended max: 20-30)
- Monitor FPS in statistics dialog
- Clear inactive yarns/needs periodically
- Use auto-save sparingly for large collections

## Troubleshooting

### Cats not appearing

**Cause**: Meowzer context not provided

**Solution**:

```html
<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

### Cats not saving

**Cause**: Storage not enabled in provider

**Solution**:

```html
<meowzer-provider storage-enabled auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

### Cats loaded but not visible

**Cause**: CSS positioning issue or viewport overflow

**Solution**: Check that cats have proper `position: fixed` styling

### Context menu not opening

**Cause**: Cat element not receiving click events

**Solution**: Verify cat elements are in DOM and have proper z-index

## Testing

The component includes comprehensive tests covering:

- Custom element registration (2 tests)
- Rendering (6 tests - container, preview, toolbar, dialogs)
- Properties (1 test)
- Dialogs (2 tests - initial states)
- Context integration (1 test)
- Visual elements (3 tests - yarn, laser, needs)
- Toolbar integration (2 tests)
- Layout structure (2 tests)
- Cat count display (1 test)
- Lifecycle (2 tests)
- Interaction visuals (3 tests)
- Context menu (1 test)
- Modals (2 tests - rename, wardrobe)
- Accessibility (2 tests)
- Component integration (5 tests)

Run tests:

```bash
npm test -- mb-cat-playground.test.ts
```

## Related Components

- `cat-creator` - Cat creation wizard
- `cat-statistics` - Statistics display
- `cat-preview` - Cat visual preview
- `cat-personality-picker` - Personality selection
- `mb-playground-toolbar` - Action toolbar
- `mb-cat-context-menu` - Context menu
- `mb-wardrobe-dialog` - Hat customization
- `mb-yarn-visual` - Yarn animation
- `mb-laser-visual` - Laser pointer
- `mb-need-visual` - Food/water visuals
