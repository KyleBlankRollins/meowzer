````markdown
# @meowzer/ui

Web Components library for adding Meowzer cats to any website. Built with Lit Element and Quiet UI.

## Installation

```bash
npm install meowzer @meowzer/ui @quietui/quiet lit
```

**Peer Dependencies:**

- `meowzer` ^1.0.0 - Core Meowzer SDK
- `@quietui/quiet` ^1.3.0 - UI component library
- `lit` ^3.0.0 - Web components framework

## Status

✅ **Phase 1 Complete** - Core Infrastructure  
✅ **Phase 2 Complete** - Creation Components  
✅ **Phase 3 Complete** - Management Components  
✅ **Phase 4 Complete** - Gallery & Storage Components  
✅ **Phase 5 Complete** - Drop-in Solutions  
✅ **Phase 6 Complete** - Storybook Documentation

## Quick Start

### Option 1: CDN (Fastest)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Quiet UI styles -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/quiet.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist/themes/restyle.css"
    />
  </head>
  <body>
    <!-- Drop-in playground - that's it! -->
    <meowzer-provider auto-init>
      <mb-cat-playground></mb-cat-playground>
    </meowzer-provider>

    <script type="module">
      import "@meowzer/ui";
    </script>
  </body>
</html>
```

### Option 2: NPM (Recommended)

```bash
npm install meowzer @meowzer/ui @quietui/quiet lit
```

```typescript
// Import Quiet UI styles
import "@quietui/quiet/themes/quiet.css";
import "@quietui/quiet/themes/restyle.css";

// Import components
import "@meowzer/ui";

// Or import specific components
import { MeowzerProvider, CatCreator, CatManager } from "@meowzer/ui";
```

```html
<meowzer-provider auto-init>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</meowzer-provider>
```

## Features

- **Provider pattern**: Lit Context API for reactive state management
- **Reactive controllers**: Auto-subscribe to SDK hooks and events
- **Framework agnostic**: Works with React, Vue, Angular, Svelte, vanilla
- **Customizable UI**: Built on Quiet UI for consistent design
- **Boundary control**: Flexible cat movement areas (fullscreen, fixed, block)

## Phase 1: Core Infrastructure ✅

- [x] Package setup
- [x] Context system (meowzerContext)
- [x] MeowzerProvider component
- [x] Reactive controllers (CatsController, CatController)
- [x] TypeScript compilation working

## Using Contexts and Controllers

### Provider Component

```html
<meowzer-provider
  .config=${{ debug: true }}
  .boundaries=${{ top: 0, left: 0, bottom: 600, right: 800 }}
  @meowzer-ready=${this.handleReady}
>
  <cat-creator></cat-creator>
</meowzer-provider>
```

### Consuming Context in Components

```typescript
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext, CatsController } from "@meowzer/ui";
import type { Meowzer } from "meowzer";

@customElement("my-cat-counter")
export class MyCatCounter extends LitElement {
  @consume({ context: meowzerContext })
  meowzer?: Meowzer;

  private catsController = new CatsController(this);

  render() {
    return html`
      <div>Active Cats: ${this.catsController.cats.length}</div>
    `;
  }
}
```

### Reactive Controllers

**CatsController** - Manages list of all cats:

```typescript
private catsController = new CatsController(this);

render() {
  const { cats } = this.catsController;
  return html`
    <ul>
      ${cats.map(cat => html`<li>${cat.name}</li>`)}
    </ul>
  `;
}
```

**CatController** - Manages single cat:

```typescript
private catController = new CatController(this, this.catId);

render() {
  const { cat } = this.catController;
  return html`<div>${cat?.name}</div>`;
}
```

## Phase 2: Creation Components ✅

- [x] CatCreator - Main creation interface
- [x] CatAppearanceForm - Color, pattern, size customization
- [x] CatPersonalityPicker - Personality trait selection
- [x] CatPreview - Live preview with updates
- [x] Tests and TypeScript compilation

### Using Creation Components

```html
<meowzer-provider>
  <cat-creator></cat-creator>
</meowzer-provider>
```

The `<cat-creator>` component provides a complete interface for creating cats with:

- **Name & description** fields
- **Appearance customization**: Color picker with presets, pattern, size, fur length
- **Personality selection**: Choose from presets (playful, lazy, curious, etc.) or customize individual traits
- **Live preview**: See your cat update in real-time as you change settings
- **Form actions**: Create or reset

**Events:**

- `cat-created` - Emitted when a cat is successfully created (detail contains the MeowzerCat instance)
- `cat-creation-error` - Emitted if cat creation fails (detail contains the error)

**Example with event handling:**

```typescript
const creator = document.querySelector("cat-creator");
creator.addEventListener("cat-created", (e) => {
  console.log("New cat created:", e.detail.cat);
});
```

## Architecture

Inspired by Realm React's provider pattern, adapted for Web Components:

```
<meowzer-provider>         ← Provides SDK instance via Lit Context
  <cat-boundary>           ← Defines where cats can move
    <cat-creator>          ← Creates new cats
    <cat-manager>          ← Displays active cats
  </cat-boundary>
</meowzer-provider>
```

## Next Phase

**Phase 3: Management Components** ✅

- [x] cat-manager - Display and manage all active cats
- [x] cat-card - Individual cat card with controls
- [x] cat-controls - Pause/resume/destroy controls
- [x] cat-list-item - Compact list view item

### Using Management Components

```html
<meowzer-provider>
  <!-- Full management interface -->
  <cat-manager></cat-manager>
</meowzer-provider>
```

The `<cat-manager>` component provides a complete interface for managing cats with:

- **View modes**: Toggle between grid and list views
- **Search**: Filter cats by name, description, or ID
- **Sort**: By name, created date, or state
- **Bulk actions**: Select multiple cats to pause, resume, or destroy
- **Individual controls**: Each cat has pause/resume and destroy buttons
- **Empty state**: Helpful message when no cats exist

**Properties:**

- `viewMode` - 'grid' or 'list' (default: 'grid')
- `sortBy` - 'name', 'created', or 'state' (default: 'name')

**Individual Components:**

```html
<!-- Card for grid view -->
<cat-card
  .cat="${cat}"
  ?selected="${isSelected}"
  ?selectable="${true}"
  @cat-select="${handleSelect}"
></cat-card>

<!-- Reusable controls -->
<cat-controls
  .cat="${cat}"
  size="small"
  @pause="${handlePause}"
  @resume="${handleResume}"
  @destroy="${handleDestroy}"
></cat-controls>

<!-- List item for list view -->
<cat-list-item
  .cat="${cat}"
  ?selected="${isSelected}"
  ?selectable="${true}"
  @cat-select="${handleSelect}"
></cat-list-item>
```

## Future Enhancements

Potential next phases:

- **Phase 4: Advanced Features** - Drag & drop, keyboard nav, pagination
- **Phase 5: Integration** - Connect meowtion, meowkit, meowbrain visualization
- **Phase 6: Polish** - Animations, loading states, accessibility

## Documentation

Full documentation coming soon. See [proposal](../../meta/meowzer-ui-proposal.md) for detailed design.

## License

MIT
````
