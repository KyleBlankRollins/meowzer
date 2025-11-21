````markdown
# @meowzer/ui

Web Components library for adding Meowzer cats to any website. Built with Lit Element and Carbon Web Components.

## Installation

```bash
npm install meowzer @meowzer/ui @carbon/web-components lit
```

**Peer Dependencies:**

- `meowzer` ^1.0.0 - Core Meowzer SDK
- `@carbon/web-components` ^2.0.0 - IBM Carbon Design System web components
- `lit` ^3.0.0 - Web components framework

## Quick Start

### Option 1: CDN (Fastest)

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Carbon styles -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@carbon/styles@1.0.0/css/styles.css"
    />
  </head>
  <body class="cds-theme-g10">
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
npm install meowzer @meowzer/ui @carbon/web-components lit
```

```typescript
// Import Carbon styles
import "@carbon/styles/css/styles.css";

// Import all components
import "@meowzer/ui";

// Or import specific components
import {
  MeowzerProvider,
  MbCatPlayground,
  CatCreator,
  CatStatistics,
} from "@meowzer/ui";
```

```html
<meowzer-provider auto-init>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

## Features

- **Drop-in playground**: Complete cat creation and interaction interface with `mb-cat-playground`
- **Provider pattern**: Lit Context API for reactive state management
- **Reactive controllers**: Auto-subscribe to SDK hooks and events
- **Framework agnostic**: Works with React, Vue, Angular, Svelte, vanilla
- **Customizable UI**: Built on Carbon Design System for consistent design
- **Boundary control**: Flexible cat movement areas (fullscreen, fixed, block)
- **Modular components**: Use creation components independently or as part of playground

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

## Creation Components

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

## Management Components

### Using Management Components

The `<cat-statistics>` component displays real-time information about a cat's state, needs, and personality. It's integrated into `mb-cat-playground` but can also be used independently:

```html
<meowzer-provider>
  <cat-statistics .cat="${myCat}"></cat-statistics>
</meowzer-provider>
```

**Properties:**

- `cat` - MeowzerCat instance to display stats for

**Displays:**

- Cat name and state (idle, walking, playing, etc.)
- Needs levels (hunger, thirst, playfulness, affection)
- Personality traits
- Current activity information

## Drop-in Solutions

### Using the Playground

```html
<meowzer-provider>
  <mb-cat-playground></mb-cat-playground>
</meowzer-provider>
```

The `<mb-cat-playground>` component is the complete drop-in solution that includes:

- **Cat creation interface** - Integrated `cat-creator` with live preview
- **Cat management** - Context menu for pause/resume, rename, destroy, wardrobe
- **Interactive playground** - Cats roam and interact with the environment
- **Statistics panel** - Real-time cat stats with `cat-statistics`
- **Interaction tools** - Yarn ball, laser pointer via toolbar
- **Persistent storage** - Cats saved to IndexedDB automatically
- **Wardrobe system** - Customize cat accessories and outfits

**Properties:**

- `showPreview` - Show/hide cat preview during creation (default: true)
- `showStats` - Show/hide statistics panel (default: true)
- `autoInit` - Auto-initialize Meowzer SDK (default: true)

**Events:**

- `cat-created` - When a new cat is created
- `cat-destroyed` - When a cat is removed
- `interaction-start` - When user starts interacting (yarn, laser)
- `interaction-end` - When interaction completes

## Available Components

### Core Components

- **MeowzerProvider** - Context provider for SDK instance
- **MbCatPlayground** - Complete drop-in playground solution
- **CatCreator** - Cat creation interface with form and preview
- **CatStatistics** - Real-time cat stats and needs display

### Supporting Components

- **CatPreview** - Live cat visual preview during creation
- **CatPersonalityPicker** - Personality trait selection UI
- **CatColorPicker** - Color selection for cat appearance
- **MbWardrobeDialog** - Accessory and outfit customization

### Reactive Controllers

- **CatsController** - Manages list of all cats
- **CatController** - Manages single cat instance
- **StorageController** - IndexedDB persistence
- **CursorController** - Custom cursor management for interactions

## Architecture

Inspired by Realm React's provider pattern, adapted for Web Components:

```
<meowzer-provider>              ← Provides SDK instance via Lit Context
  <mb-cat-playground>           ← Drop-in solution with everything
    <cat-creator>               ← Cat creation (internal)
    <cat-statistics>            ← Cat stats display (internal)
    <mb-wardrobe-dialog>        ← Accessory selection (internal)
    <mb-playground-toolbar>     ← Interaction tools (internal)
  </mb-cat-playground>
</meowzer-provider>
```

Or use components independently:

```
<meowzer-provider>
  <cat-creator></cat-creator>
  <cat-statistics .cat="${myCat}"></cat-statistics>
</meowzer-provider>
```

## License

MIT
````
