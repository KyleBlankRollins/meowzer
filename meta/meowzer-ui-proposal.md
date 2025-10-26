# Meowzer UI Library Proposal: Web Components + Context Pattern

**Date**: October 26, 2025  
**Status**: Proposal  
**Pattern Inspiration**: Realm React (Provider + Hooks pattern)

## Executive Summary

This proposal outlines the creation of `@meowzer/ui` - a Lit Element + Quiet UI library that provides a complete, drop-in solution for adding Meowzer cats to any website. Inspired by Realm React's provider pattern, it will offer:

- **Zero-config setup**: Install, add one tag, cats work
- **Context-based state management**: Lit Context API for sharing Meowzer instance
- **Reactive components**: Auto-updating UI components that respond to SDK changes
- **Customizable UI**: Built on Quiet UI for consistent, themeable components
- **Framework agnostic**: Web Components work with any framework or vanilla HTML

---

## The Realm React Pattern (Analysis)

### Key Architectural Principles

Realm React demonstrates several powerful patterns we can adapt:

#### 1. **Provider Pattern**

```jsx
// Realm React
<RealmProvider schema={[Task]}>
  <App />
</RealmProvider>

// Meowzer UI equivalent
<meowzer-provider config={config}>
  <my-app></my-app>
</meowzer-provider>
```

**Benefits**:

- Single entry point for configuration
- Automatic initialization and lifecycle management
- Child components get access without prop drilling
- Fallback UI during initialization

#### 2. **Context-Based Hooks**

```jsx
// Realm React
const realm = useRealm();
const tasks = useQuery(Task);
const task = useObject(Task, id);

// Meowzer UI equivalent (Lit Context)
@consume({ context: meowzerContext })
meowzer?: Meowzer;

const cats = this.meowzer.cats.getAll();
```

**Benefits**:

- No prop drilling
- Reactive updates
- Type-safe access
- Consistent API across components

#### 3. **Multiple Context Support**

```jsx
// Realm React - Multiple Realms
const PublicContext = createRealmContext(publicConfig);
const PrivateContext = createRealmContext(privateConfig);

// Meowzer UI equivalent
const playgroundContext = createMeowzerContext(playgroundConfig);
const overlayContext = createMeowzerContext(overlayConfig);
```

**Benefits**:

- Multiple independent Meowzer instances
- Isolated state management
- Different configurations per context

---

## Proposed Architecture

### Package Structure

```
@meowzer/ui/
├── providers/
│   ├── meowzer-provider.ts       # Main Meowzer context provider
│   ├── storage-provider.ts       # Storage/persistence wrapper
│   └── create-context.ts         # Context factory (multi-instance support)
├── components/
│   ├── boundary/
│   │   └── cat-boundary.ts       # Defines space where cats move
│   ├── cat-creator/
│   │   ├── cat-creator.ts        # UI for creating cats
│   │   ├── appearance-form.ts
│   │   ├── personality-picker.ts
│   │   └── preview-canvas.ts
│   ├── cat-manager/
│   │   ├── cat-list.ts           # Display active cats
│   │   ├── cat-card.ts
│   │   └── cat-controls.ts       # Pause/resume/destroy
│   ├── cat-gallery/
│   │   ├── gallery-view.ts       # Saved cats grid
│   │   ├── collection-picker.ts
│   │   └── cat-thumbnail.ts
│   └── overlay/
│       ├── cat-overlay.ts        # Complete UI with built-in boundary
│       └── overlay-controls.ts   # Minimize/maximize/settings
├── contexts/
│   ├── meowzer-context.ts        # Main SDK context
│   ├── storage-context.ts        # Storage manager context
│   └── types.ts
├── hooks/ (Lit reactive controllers)
│   ├── useCat.ts                 # Single cat reactive controller
│   ├── useCats.ts                # All cats reactive controller
│   ├── useCollection.ts          # Collection reactive controller
│   └── useStorage.ts             # Storage reactive controller
├── utils/
│   ├── reactive-controllers.ts   # Lit reactive controllers for SDK
│   └── cat-helpers.ts
└── index.ts
```

---

## Detailed API Design

### 1. Core Provider Pattern

#### MeowzerProvider (Primary Provider)

```typescript
/**
 * <meowzer-provider> - Main context provider for Meowzer SDK
 *
 * Initializes Meowzer SDK and provides instance to all children via Lit Context
 * Handles lifecycle, error states, and provides fallback during initialization
 */
@customElement("meowzer-provider")
export class MeowzerProvider extends LitElement {
  // Configuration (props)
  @property({ type: Object }) config?: MeowzerConfig;
  @property({ type: Object }) storage?: StorageConfig;
  @property({ type: Object }) boundaries?: Boundaries;
  @property({ type: String }) container?: string; // CSS selector
  @property({ type: Boolean }) autoInit = true;

  // Fallback content during initialization
  @property({ type: String }) fallback?: TemplateResult;

  // Provider state
  @provide({ context: meowzerContext })
  @state()
  private meowzer?: Meowzer;

  @state() private initialized = false;
  @state() private error?: Error;

  async connectedCallback() {
    super.connectedCallback();
    if (this.autoInit) {
      await this.initialize();
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup: destroy all cats
    await this.meowzer?.cats.destroyAll();
  }

  private async initialize() {
    try {
      this.meowzer = new Meowzer({
        container: this.container
          ? document.querySelector(this.container)
          : document.body,
        boundaries: this.boundaries,
        storage: this.storage,
        ...this.config,
      });

      await this.meowzer.ready();
      this.initialized = true;

      // Dispatch ready event
      this.dispatchEvent(
        new CustomEvent("meowzer-ready", {
          detail: { meowzer: this.meowzer },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err as Error;
      this.dispatchEvent(
        new CustomEvent("meowzer-error", {
          detail: { error: err },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    // Show fallback during initialization
    if (!this.initialized && this.fallback) {
      return this.fallback;
    }

    // Show error state
    if (this.error) {
      return html`
        <q-callout variant="error">
          <strong>Meowzer Error:</strong> ${this.error.message}
        </q-callout>
      `;
    }

    // Render children when ready
    return html`<slot></slot>`;
  }
}
```

#### Usage Example

```html
<!-- Simple: Zero config -->
<meowzer-provider>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</meowzer-provider>

<!-- Advanced: Custom configuration -->
<meowzer-provider
  .config=${{ debug: true }}
  .storage=${{ enabled: true, defaultCollection: 'my-cats' }}
  .boundaries=${{ minX: 0, maxX: 1920, minY: 0, maxY: 1080 }}
  container="#cat-playground"
  .fallback=${html`<q-spinner>Loading Meowzer...</q-spinner>`}
  @meowzer-ready=${this.handleReady}
  @meowzer-error=${this.handleError}
>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</meowzer-provider>
```

---

### 2. Cat Boundary Component

The boundary component defines the physical space where cats can be created and move around. This is a critical component that gives users full control over cat behavior space.

#### CatBoundary (Boundary Container)

```typescript
/**
 * <cat-boundary> - Defines the space where cats can exist and move
 *
 * This component serves as both a visual boundary and the container that
 * calculates boundaries for the SDK. Cats created within this boundary
 * will be constrained to its dimensions.
 */
@customElement("cat-boundary")
export class CatBoundary extends LitElement {
  static styles = [boundaryStyles];

  // Layout mode
  @property({ type: String }) mode: "fullscreen" | "fixed" | "block" =
    "block";

  // Fixed mode positioning (when mode='fixed')
  @property({ type: String }) position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
  @property({ type: Number }) width?: number;
  @property({ type: Number }) height?: number;
  @property({ type: Number }) top?: number;
  @property({ type: Number }) left?: number;
  @property({ type: Number }) right?: number;
  @property({ type: Number }) bottom?: number;

  // Block mode dimensions (when mode='block')
  @property({ type: String }) blockWidth?: string; // CSS value like '100%', '500px'
  @property({ type: String }) blockHeight?: string; // CSS value like '400px', '50vh'

  // Visual styling
  @property({ type: Boolean }) showBorder = false;
  @property({ type: String }) borderColor = "#ccc";
  @property({ type: String }) backgroundColor = "transparent";

  // Padding inside boundary (keeps cats away from edges)
  @property({ type: Number }) padding = 0;

  @state() private boundaries?: Boundaries;

  private resizeObserver?: ResizeObserver;

  connectedCallback() {
    super.connectedCallback();
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateBoundaries();
    });
    this.resizeObserver.observe(this);
  }

  private updateBoundaries() {
    const rect = this.getBoundingClientRect();
    this.boundaries = {
      minX: this.padding,
      maxX: rect.width - this.padding,
      minY: this.padding,
      maxY: rect.height - this.padding,
    };

    // Dispatch event so provider can update SDK
    this.dispatchEvent(
      new CustomEvent("boundaries-changed", {
        detail: { boundaries: this.boundaries },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const styles = {
      border: this.showBorder
        ? `1px solid ${this.borderColor}`
        : "none",
      backgroundColor: this.backgroundColor,
      ...this.getModeStyles(),
    };

    return html`
      <div class="cat-boundary" style=${styleMap(styles)}>
        <slot></slot>
      </div>
    `;
  }

  private getModeStyles() {
    switch (this.mode) {
      case "fullscreen":
        return {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: "1000",
        };

      case "fixed":
        return {
          position: "fixed",
          ...(this.position ? this.getPositionStyles() : {}),
          width: this.width ? `${this.width}px` : "auto",
          height: this.height ? `${this.height}px` : "auto",
          top: this.top !== undefined ? `${this.top}px` : undefined,
          left:
            this.left !== undefined ? `${this.left}px` : undefined,
          right:
            this.right !== undefined ? `${this.right}px` : undefined,
          bottom:
            this.bottom !== undefined
              ? `${this.bottom}px`
              : undefined,
          zIndex: "1000",
        };

      case "block":
      default:
        return {
          position: "relative",
          width: this.blockWidth || "100%",
          height: this.blockHeight || "400px",
          display: "block",
        };
    }
  }

  private getPositionStyles() {
    switch (this.position) {
      case "top-right":
        return { top: "20px", right: "20px" };
      case "top-left":
        return { top: "20px", left: "20px" };
      case "bottom-right":
        return { bottom: "20px", right: "20px" };
      case "bottom-left":
        return { bottom: "20px", left: "20px" };
      default:
        return {};
    }
  }
}
```

#### Usage Examples

```html
<!-- Block mode: Acts as normal document flow element -->
<cat-boundary
  mode="block"
  block-width="100%"
  block-height="500px"
  show-border
  border-color="#e0e0e0"
>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</cat-boundary>

<!-- Fullscreen mode: Covers entire viewport -->
<cat-boundary mode="fullscreen">
  <cat-overlay></cat-overlay>
</cat-boundary>

<!-- Fixed mode: Floating positioned container -->
<cat-boundary
  mode="fixed"
  position="bottom-right"
  width="400"
  height="600"
  show-border
>
  <cat-creator></cat-creator>
</cat-boundary>

<!-- Fixed with precise positioning -->
<cat-boundary
  mode="fixed"
  top="100"
  left="100"
  width="800"
  height="600"
  padding="20"
  background-color="rgba(255, 255, 255, 0.95)"
>
  <cat-playground></cat-playground>
</cat-boundary>

<!-- Block with responsive height -->
<cat-boundary mode="block" block-width="100%" block-height="80vh">
  <div class="custom-layout">
    <cat-creator></cat-creator>
    <cat-manager></cat-manager>
  </div>
</cat-boundary>
```

#### Integration with Provider

The `cat-boundary` automatically communicates with the nearest `meowzer-provider`:

```html
<meowzer-provider>
  <cat-boundary mode="block" block-width="100%" block-height="600px">
    <!-- Cats created here will be constrained to this boundary -->
    <cat-creator></cat-creator>
  </cat-boundary>
</meowzer-provider>
```

The provider listens for `boundaries-changed` events and updates the SDK configuration automatically.

---

### 3. Reactive Components with Context

#### Cat Creator Component

```typescript
/**
 * <cat-creator> - UI for creating and customizing cats
 *
 * Consumes Meowzer context and provides form-based cat creation
 */
@customElement("cat-creator")
export class CatCreator extends LitElement {
  static styles = [typographyStyles, catCreatorStyles];

  // Consume Meowzer context
  @consume({ context: meowzerContext, subscribe: true })
  @state()
  private meowzer?: Meowzer;

  @state() private settings: Partial<CatSettings> = {};
  @state() private preview?: ProtoCat;
  @state() private creating = false;

  // Update preview when settings change
  updated(changed: PropertyValues) {
    if (changed.has("settings")) {
      this.updatePreview();
    }
  }

  private async updatePreview() {
    // Generate preview (using Meowkit directly or SDK helper)
    this.preview = await this.meowzer?.utils.generatePreview(
      this.settings
    );
  }

  private async handleCreate() {
    if (!this.meowzer) return;

    this.creating = true;
    try {
      const cat = await this.meowzer.cats.create({
        appearance: this.settings,
        autoStart: true,
      });

      // Dispatch event for parent components
      this.dispatchEvent(
        new CustomEvent("cat-created", {
          detail: { cat },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.settings = {};
    } catch (err) {
      console.error("Failed to create cat:", err);
    } finally {
      this.creating = false;
    }
  }

  render() {
    if (!this.meowzer) {
      return html`<q-callout>Meowzer not initialized</q-callout>`;
    }

    return html`
      <q-card>
        <h2>Create a Cat</h2>

        <!-- Appearance controls -->
        <appearance-form
          .settings=${this.settings}
          @settings-change=${(e: CustomEvent) =>
            (this.settings = e.detail)}
        ></appearance-form>

        <!-- Preview -->
        <cat-preview .protocat=${this.preview}></cat-preview>

        <!-- Actions -->
        <q-button-group>
          <q-button
            @click=${this.handleCreate}
            ?disabled=${this.creating}
          >
            ${this.creating ? "Creating..." : "Create Cat"}
          </q-button>
          <q-button variant="secondary" @click=${this.randomize}>
            Randomize
          </q-button>
        </q-button-group>
      </q-card>
    `;
  }
}
```

#### Cat Manager Component

```typescript
/**
 * <cat-manager> - Displays and manages active cats
 *
 * Automatically updates when cats are created/destroyed
 */
@customElement("cat-manager")
export class CatManager extends LitElement {
  static styles = [typographyStyles, catManagerStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  private meowzer?: Meowzer;

  // Reactive controller for cats
  private catsController = new CatsController(this);

  get cats() {
    return this.catsController.cats;
  }

  private async handlePause(cat: MeowzerCat) {
    cat.pause();
    this.requestUpdate();
  }

  private async handleResume(cat: MeowzerCat) {
    cat.resume();
    this.requestUpdate();
  }

  private async handleDestroy(cat: MeowzerCat) {
    await cat.destroy();
    this.requestUpdate();
  }

  private async handleSave(cat: MeowzerCat) {
    try {
      await cat.save();
      this.dispatchEvent(
        new CustomEvent("cat-saved", {
          detail: { cat },
          bubbles: true,
        })
      );
    } catch (err) {
      console.error("Failed to save cat:", err);
    }
  }

  render() {
    if (!this.meowzer) {
      return html`<q-empty-state
        >Meowzer not initialized</q-empty-state
      >`;
    }

    if (this.cats.length === 0) {
      return html`
        <q-empty-state>
          <q-icon slot="icon" name="cat"></q-icon>
          <span slot="title">No cats yet</span>
          <span slot="description"
            >Create your first cat to get started</span
          >
        </q-empty-state>
      `;
    }

    return html`
      <q-card>
        <h2>Active Cats (${this.cats.length})</h2>

        <div class="cat-list">
          ${this.cats.map(
            (cat) => html`
              <cat-card
                .cat=${cat}
                @pause=${() => this.handlePause(cat)}
                @resume=${() => this.handleResume(cat)}
                @destroy=${() => this.handleDestroy(cat)}
                @save=${() => this.handleSave(cat)}
              ></cat-card>
            `
          )}
        </div>
      </q-card>
    `;
  }
}
```

---

### 3. Reactive Controllers (Lit's Hook Equivalent)

Lit doesn't have hooks like React, but it has **Reactive Controllers** which serve the same purpose:

```typescript
/**
 * CatsController - Reactive controller that subscribes to cat changes
 *
 * Equivalent to useQuery() in Realm React
 */
export class CatsController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;
  cats: MeowzerCat[] = [];

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    // Get Meowzer from context
    this.meowzer = (this.host as any).meowzer;

    if (this.meowzer) {
      // Subscribe to cat events
      this.meowzer.cats.on("created", this.handleCatCreated);
      this.meowzer.cats.on("destroyed", this.handleCatDestroyed);

      // Initial load
      this.cats = this.meowzer.cats.getAll();
    }
  }

  hostDisconnected() {
    // Cleanup listeners
    this.meowzer?.cats.off("created", this.handleCatCreated);
    this.meowzer?.cats.off("destroyed", this.handleCatDestroyed);
  }

  private handleCatCreated = (cat: MeowzerCat) => {
    this.cats = [...this.cats, cat];
    this.host.requestUpdate();
  };

  private handleCatDestroyed = (catId: string) => {
    this.cats = this.cats.filter((c) => c.id !== catId);
    this.host.requestUpdate();
  };
}

/**
 * CatController - Single cat reactive controller
 *
 * Equivalent to useObject() in Realm React
 */
export class CatController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;
  cat?: MeowzerCat;

  constructor(host: ReactiveControllerHost, private catId: string) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.meowzer = (this.host as any).meowzer;

    if (this.meowzer) {
      this.cat = this.meowzer.cats.getById(this.catId);

      // Subscribe to cat updates
      this.cat?.on("stateChange", this.handleUpdate);
      this.cat?.on("behaviorChange", this.handleUpdate);
    }
  }

  hostDisconnected() {
    this.cat?.off("stateChange", this.handleUpdate);
    this.cat?.off("behaviorChange", this.handleUpdate);
  }

  private handleUpdate = () => {
    this.host.requestUpdate();
  };
}

/**
 * StorageController - Storage operations reactive controller
 */
export class StorageController implements ReactiveController {
  private host: ReactiveControllerHost;
  private meowzer?: Meowzer;
  collections: CollectionInfo[] = [];

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  async hostConnected() {
    this.meowzer = (this.host as any).meowzer;
    await this.loadCollections();
  }

  async loadCollections() {
    if (this.meowzer?.storage) {
      this.collections =
        await this.meowzer.storage.collections.list();
      this.host.requestUpdate();
    }
  }

  async createCollection(name: string) {
    await this.meowzer?.storage.collections.create(name);
    await this.loadCollections();
  }

  async deleteCollection(name: string) {
    await this.meowzer?.storage.collections.delete(name);
    await this.loadCollections();
  }
}
```

---

### 4. Multi-Instance Support (Like Realm's createRealmContext)

```typescript
/**
 * createMeowzerContext - Factory for creating isolated Meowzer contexts
 *
 * Allows multiple independent Meowzer instances in the same app
 */
export function createMeowzerContext(config?: MeowzerConfig) {
  const context = createContext<Meowzer | undefined>(
    Symbol("meowzer")
  );

  @customElement(
    `meowzer-provider-${Math.random().toString(36).slice(2)}`
  )
  class MeowzerProviderInstance extends MeowzerProvider {
    constructor() {
      super();
      if (config) {
        this.config = config;
      }
    }

    @provide({ context })
    @state()
    protected override meowzer?: Meowzer;
  }

  return {
    Provider: MeowzerProviderInstance,
    context,

    // Helper to create consuming components
    createConsumer<T extends LitElement>(Base: Constructor<T>) {
      class Consumer extends Base {
        @consume({ context, subscribe: true })
        @state()
        meowzer?: Meowzer;
      }
      return Consumer;
    },
  };
}

// Usage:
const playgroundContext = createMeowzerContext({
  storage: { enabled: false },
});

const overlayContext = createMeowzerContext({
  storage: { enabled: true, defaultCollection: "overlay-cats" },
});

// In HTML:
html`
  <playground-provider>
    <cat-creator></cat-creator>
  </playground-provider>

  <overlay-provider>
    <cat-overlay></cat-overlay>
  </overlay-provider>
`;
```

---

### 5. Complete Drop-in Overlay Component

The killer feature - a single component that "just works" with a built-in boundary:

```typescript
/**
 * <cat-overlay> - Complete drop-in solution for adding cats to any site
 *
 * Self-contained: Includes provider, boundary, creator, manager, and controls
 * Zero configuration needed - just add the tag
 * The overlay includes its own cat-boundary in fixed mode
 */
@customElement("cat-overlay")
export class CatOverlay extends LitElement {
  static styles = [overlayStyles];

  @property({ type: Boolean }) minimized = false;
  @property({ type: String }) position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left" = "bottom-right";

  // Boundary mode for cats within overlay
  @property({ type: String }) boundaryMode: "fullscreen" | "panel" =
    "fullscreen";

  @state() private showCreator = false;
  @state() private showManager = false;

  render() {
    return html`
      <meowzer-provider
        .config=${{ debug: false }}
        .storage=${{
          enabled: true,
          defaultCollection: "overlay-cats",
        }}
      >
        <!-- Built-in boundary - fullscreen for cats, with UI panel overlay -->
        <cat-boundary
          mode=${this.boundaryMode === "fullscreen"
            ? "fullscreen"
            : "fixed"}
        >
          <!-- UI Panel (doesn't affect cat boundary) -->
          <div
            class="overlay-panel ${this.position} ${this.minimized
              ? "minimized"
              : ""}"
          >
            ${this.minimized
              ? this.renderMinimized()
              : this.renderExpanded()}
          </div>
        </cat-boundary>
      </meowzer-provider>
    `;
  }

  private renderMinimized() {
    return html`
      <q-button @click=${() => (this.minimized = false)}>
        🐱 Show Cats
      </q-button>
    `;
  }

  private renderExpanded() {
    return html`
      <div class="overlay-container">
        <div class="overlay-header">
          <h2>Meowzer Cats</h2>
          <q-button-group>
            <q-button @click=${() => (this.minimized = true)}
              >−</q-button
            >
            <q-button @click=${this.handleClose}>×</q-button>
          </q-button-group>
        </div>

        <q-tabs>
          <q-tab-panel label="Create">
            <cat-creator></cat-creator>
          </q-tab-panel>

          <q-tab-panel label="Manage">
            <cat-manager></cat-manager>
          </q-tab-panel>

          <q-tab-panel label="Gallery">
            <cat-gallery></cat-gallery>
          </q-tab-panel>
        </q-tabs>
      </div>
    `;
  }
}
```

#### Usage - Literally One Line

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
    <!-- That's it. Cats now work. -->
    <cat-overlay></cat-overlay>
  </body>
</html>
```

---

## Component Library Structure

### Core Components (Must-Have)

1. **Providers**

   - `<meowzer-provider>` - Main context provider
   - `<storage-provider>` - Optional storage wrapper

2. **Boundary**
   - `<cat-boundary>` - Defines space where cats can move
     - Modes: fullscreen, fixed, block
     - Responsive sizing and positioning
     - Auto-calculates boundaries for SDK
3. **Creation**

   - `<cat-creator>` - Full creation UI
   - `<appearance-form>` - Appearance controls
   - `<personality-picker>` - Personality selection
   - `<cat-preview>` - Live preview

4. **Management**

   - `<cat-manager>` - Active cats list
   - `<cat-card>` - Individual cat display
   - `<cat-controls>` - Pause/resume/destroy controls

5. **Gallery**

   - `<cat-gallery>` - Saved cats grid
   - `<collection-picker>` - Collection selector
   - `<cat-thumbnail>` - Gallery thumbnail

6. **Drop-in Solutions**
   - `<cat-overlay>` - Complete overlay UI (includes built-in boundary)
   - `<cat-playground>` - Sandbox/demo component

### Advanced Components (Nice-to-Have)

7. **Collection Management**

   - `<collection-manager>` - CRUD for collections
   - `<collection-list>` - Collection browser

8. **Import/Export**

   - `<cat-exporter>` - Export UI
   - `<cat-importer>` - Import UI

9. **Analytics/Debug**
   - `<cat-inspector>` - Cat state inspector
   - `<performance-monitor>` - FPS/performance metrics

---

## Technical Implementation Details

### Context Definition

```typescript
// contexts/meowzer-context.ts
import { createContext } from "@lit/context";
import type { Meowzer } from "meowzer";

export const meowzerContext = createContext<Meowzer | undefined>(
  Symbol("meowzer")
);

export const storageContext = createContext<
  StorageManager | undefined
>(Symbol("storage"));
```

### Build Configuration

```json
{
  "name": "@meowzer/ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components/*": {
      "import": "./dist/components/*.js",
      "types": "./dist/components/*.d.ts"
    }
  },
  "dependencies": {
    "lit": "^3.0.0",
    "@lit/context": "^1.1.0",
    "@quietui/quiet": "^1.3.0",
    "meowzer": "^1.0.0"
  }
}
```

### Bundle Strategy

- **Core bundle**: Providers + contexts (~10KB)
- **Component bundles**: Individual components (tree-shakeable)
- **All-in-one bundle**: Everything including overlay (~50KB)
- **CDN builds**: UMD builds for script tag usage

---

## Usage Scenarios

### Scenario 1: Simple Website Addition

```html
<script
  type="module"
  src="https://cdn.meowzer.dev/ui@1/overlay.js"
></script>
<cat-overlay></cat-overlay>
```

### Scenario 2: Custom Integration with Boundary

```html
<script type="module">
  import {
    MeowzerProvider,
    CatBoundary,
    CatCreator,
    CatManager,
  } from "@meowzer/ui";
</script>

<meowzer-provider>
  <cat-boundary
    mode="block"
    block-width="100%"
    block-height="600px"
    show-border
  >
    <div class="my-app">
      <cat-creator></cat-creator>
      <cat-manager></cat-manager>
    </div>
  </cat-boundary>
</meowzer-provider>
```

### Scenario 3: Fullscreen Playground

```html
<meowzer-provider>
  <cat-boundary mode="fullscreen" background-color="rgba(0,0,0,0.05)">
    <cat-playground></cat-playground>
  </cat-boundary>
</meowzer-provider>
```

### Scenario 4: Multiple Instances with Different Boundaries

```typescript
import { createMeowzerContext } from "@meowzer/ui";

const leftContext = createMeowzerContext();
const rightContext = createMeowzerContext();
```

```html
<!-- Left side with fixed boundary -->
<left-provider>
  <cat-boundary
    mode="fixed"
    position="top-left"
    width="400"
    height="600"
  >
    <cat-creator></cat-creator>
  </cat-boundary>
</left-provider>

<!-- Right side with different boundary -->
<right-provider>
  <cat-boundary
    mode="fixed"
    position="top-right"
    width="400"
    height="600"
  >
    <cat-creator></cat-creator>
  </cat-boundary>
</right-provider>
```

### Scenario 5: React Integration

```jsx
import { CatOverlay } from "@meowzer/ui";

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <cat-overlay />
    </div>
  );
}
```

### Scenario 6: Vue Integration

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <cat-overlay />
  </div>
</template>

<script>
import "@meowzer/ui";
</script>
```

---

## Advantages Over Current Approach

### Current (Docs Site)

```typescript
// Lots of boilerplate
import { initializeDatabase, createCat, buildCat } from "meowzer";

// Manual initialization
await initializeDatabase();
const db = getDatabase();

// Manual state management
@state() cats: Cat[] = [];

// Manual event handling
cat.on('stateChange', () => this.requestUpdate());

// 50+ lines for basic functionality
```

### With @meowzer/ui

```html
<!-- 1 line for same functionality -->
<cat-overlay></cat-overlay>
```

Or with custom components:

```html
<!-- 10 lines for custom UI -->
<meowzer-provider>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</meowzer-provider>
```

**80-90% reduction in boilerplate**

---

## Development Roadmap

### Phase 1: Core Infrastructure (2 weeks)

- [ ] Set up package structure and build system
- [ ] Create context system (meowzerContext, storageContext)
- [ ] Implement MeowzerProvider with lifecycle management
- [ ] Build reactive controllers (CatsController, CatController, StorageController)
- [ ] Write comprehensive tests for providers and controllers

### Phase 2: Creation Components (2 weeks)

- [ ] Build `<cat-creator>` component
- [ ] Build `<appearance-form>` with Quiet UI controls
- [ ] Build `<personality-picker>`
- [ ] Build `<cat-preview>` component
- [ ] Add form validation and error handling

### Phase 3: Management Components (2 weeks)

- [ ] Build `<cat-manager>` component
- [ ] Build `<cat-card>` component
- [ ] Build `<cat-controls>` component
- [ ] Add cat state indicators and animations
- [ ] Implement bulk operations UI

### Phase 4: Gallery & Storage (2 weeks)

- [ ] Build `<cat-gallery>` component
- [ ] Build `<collection-picker>` component
- [ ] Build `<cat-thumbnail>` component
- [ ] Implement import/export UI
- [ ] Add collection management UI

### Phase 5: Drop-in Solutions (1 week)

- [ ] Build `<cat-overlay>` complete component
- [ ] Add positioning and theming options
- [ ] Build `<cat-playground>` component
- [ ] Create customization options

### Phase 6: Documentation & Examples (1 week)

- [ ] Component API documentation
- [ ] Interactive Storybook
- [ ] Usage examples for all frameworks
- [ ] CDN setup and deployment
- [ ] Video tutorials

### Phase 7: Polish & Release (1 week)

- [ ] Performance optimization
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Cross-browser testing
- [ ] Bundle size optimization
- [ ] v1.0.0 release

**Total: 11 weeks**

---

## Success Metrics

### Developer Experience

- **Time to first cat**: < 30 seconds (with CDN)
- **Lines of code**: 1 line for overlay, ~10 lines for custom
- **Framework compatibility**: Works with React, Vue, Angular, Svelte, vanilla
- **Bundle size**: < 50KB for full overlay
- **Learning curve**: < 5 minutes to understand

### Technical Metrics

- **Component render time**: < 16ms (60fps)
- **Context update time**: < 5ms
- **Accessibility score**: WCAG AA compliant
- **Test coverage**: > 90%
- **Documentation coverage**: 100% of public APIs

---

## Comparison: Realm React vs Meowzer UI

| Feature               | Realm React                               | Meowzer UI                 |
| --------------------- | ----------------------------------------- | -------------------------- |
| **Provider Pattern**  | `<RealmProvider>`                         | `<meowzer-provider>`       |
| **Context API**       | React Context                             | Lit Context                |
| **Hooks/Controllers** | `useRealm()`, `useQuery()`, `useObject()` | Reactive Controllers       |
| **Multi-Instance**    | `createRealmContext()`                    | `createMeowzerContext()`   |
| **Boundary Control**  | N/A                                       | `<cat-boundary>` component |
| **Fallback UI**       | `fallback` prop                           | `fallback` prop            |
| **Event Handling**    | Collection listeners                      | SDK event system           |
| **Framework**         | React Native/React                        | Framework agnostic         |
| **Bundle Strategy**   | React dependency                          | Standalone web components  |

---

## Risks & Mitigation

### Risk 1: Lit Context Learning Curve

**Mitigation**:

- Provide extensive examples
- Abstract complexity behind simple components
- Most users only need drop-in components

### Risk 2: Bundle Size

**Mitigation**:

- Tree-shakeable exports
- Separate bundles for components
- CDN with module federation
- Lazy loading for advanced features

### Risk 3: Framework Integration Issues

**Mitigation**:

- Test with major frameworks (React, Vue, Angular, Svelte)
- Provide framework-specific guides
- Web Components have excellent framework support

### Risk 4: State Synchronization Complexity

**Mitigation**:

- Leverage SDK's event system
- Use Lit's reactive system
- Comprehensive testing of state updates
- Follow Realm React's proven patterns

---

## Alternative Approaches Considered

### Alternative 1: Framework-Specific Libraries

Build separate packages for React, Vue, etc.

**Pros**: Native framework experience  
**Cons**: Maintenance burden, fragmented ecosystem

**Decision**: Rejected - Web Components work everywhere

### Alternative 2: Simple Wrapper Functions

Just export helper functions, no components

**Pros**: Minimal complexity  
**Cons**: No UI, still requires user to build everything

**Decision**: Rejected - Doesn't provide complete solution

### Alternative 3: Vanilla JS Plugin

Traditional jQuery-style plugin

**Pros**: No framework dependencies  
**Cons**: Not modern, poor DX, no type safety

**Decision**: Rejected - Not aligned with modern web development

---

## Conclusion

The Realm React pattern provides an excellent blueprint for creating `@meowzer/ui`. By adapting their provider-based architecture to Lit Element and Quiet UI, we can create a library that:

1. **Dramatically simplifies integration** - From 50+ lines to 1 line for basic usage
2. **Works everywhere** - Web Components are framework agnostic
3. **Provides excellent DX** - Context-based state, reactive updates, type safety
4. **Scales gracefully** - From simple drop-in to advanced customization
5. **Maintains consistency** - Built on Quiet UI for cohesive design

The 11-week roadmap provides a realistic path to delivering a production-ready UI library that makes adding Meowzer cats to any website as simple as adding a single HTML tag.

**Recommendation**: Proceed with implementation starting with Phase 1 (Core Infrastructure).
