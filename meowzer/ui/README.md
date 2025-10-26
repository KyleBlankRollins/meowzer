````markdown
# @meowzer/ui

Web Components library for adding Meowzer cats to any website. Built with Lit Element and Quiet UI.

## Status

✅ **Phase 1 Complete** - Core Infrastructure  
✅ **Phase 2 Complete** - Creation Components

## Quick Start

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@meowzer/ui"
    ></script>
  </head>
  <body>
    <!-- Drop-in overlay - that's it! -->
    <meowzer-provider>
      <cat-overlay></cat-overlay>
    </meowzer-provider>
  </body>
</html>
```

## Custom Integration

```html
<meowzer-provider>
  <cat-boundary mode="block" block-width="100%" block-height="600px">
    <cat-creator></cat-creator>
    <cat-manager></cat-manager>
  </cat-boundary>
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

**Phase 3: Management Components** (Coming Soon)

- cat-manager - Display and manage all active cats
- cat-card - Individual cat card with controls
- cat-controls - Pause/resume/delete controls

## Documentation

Full documentation coming soon. See [proposal](../../meta/meowzer-ui-proposal.md) for detailed design.

## License

MIT
````
