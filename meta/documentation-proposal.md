# Meowzer Documentation Proposal

**Date:** November 24, 2025  
**Version:** 1.1  
**Status:** In Progress - Migrated to Astro Starlight

---

## Recent Updates (November 24, 2025)

**Major Changes:**

- ✅ Migrated documentation site from custom Eleventy to Astro Starlight
- ✅ Completed Milestone 1 (Getting Started Foundation)
- ✅ Updated all status indicators to reflect current progress
- ✅ Added comprehensive comparison of Astro Starlight vs. previous setup
- ✅ Documented Starlight's built-in components and features
- ✅ Revised site architecture to show current vs. planned structure

**Key Achievements:**

- Professional docs site with modern design
- All Getting Started content complete (Introduction, Installation, Quick Start, First Cat)
- Built-in search, dark mode, and mobile navigation
- Faster builds (~2-3s vs 4-5s)
- Cleaner codebase with less maintenance burden

**Next Focus:** Milestone 2 - Core Developer Tutorials

---

## Executive Summary

This proposal outlines a comprehensive documentation strategy for Meowzer, providing two distinct documentation tracks:

1. **End User Documentation** - For people who want to play with and interact with Meowzer cats on websites
2. **Developer Documentation** - For developers who want to integrate Meowzer into their projects

The documentation will combine three documentation types:

- **Concept** - Understanding how Meowzer works
- **Tutorial** - Step-by-step learning experiences
- **Reference** - Complete API documentation

---

## Current State Analysis

### What Exists

**✅ Strengths:**

- Comprehensive SDK README with good examples (`meowzer/README.md`)
- Individual library READMEs (MeowKit, Meowtion, MeowBrain, MeowBase)
- **NEW: Astro Starlight docs site** (`docs/`) - Modern, fast, accessible
- Demo playground implementation (`demo/`)
- TypeDoc-generated API reference (`sdk/docs/`)
- **NEW: Getting Started section** with Introduction, Installation, Quick Start, and First Cat tutorials
- **NEW: Professional homepage** with hero, feature cards, and clear CTAs

**⚠️ Gaps:**

- No end-user documentation (non-developers)
- Minimal API reference content (only index pages)
- No concept documentation explaining architecture
- No interactive examples embedded in docs
- Missing framework-specific integration guides
- No video tutorials or visual learning materials

### What People Need

**End Users (Non-Developers):**

- What is Meowzer and what can it do?
- How to interact with cats on a website
- How to customize cats in playgrounds
- Understanding cat personalities and behaviors
- Troubleshooting common issues

**Developers:**

- Quick start guide (0 to cat in 5 minutes)
- Integration patterns for different frameworks
- Deep dive into architecture
- Complete API reference
- Advanced customization techniques
- Performance optimization
- Plugin development

---

## Tech Stack & Platform Decision

### Current Implementation (November 2025)

**Documentation Site:**

- **[Astro](https://astro.build/)** (v5.6.1) - Modern static site framework
- **[Starlight](https://starlight.astro.build/)** (v0.36.3) - Documentation theme built for Astro
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Pagefind](https://pagefind.app/)** - Built-in search (via Starlight)
- **[Shiki](https://shiki.style/)** - Syntax highlighting (via Starlight)

**Meowzer SDK:**

- **[TypeScript](https://www.typescriptlang.org/)** - Core language
- **[GSAP](https://gsap.com/)** - Animation engine
- **[Vite](https://vite.dev/)** - Build tool
- **[Vitest](https://vitest.dev/)** - Testing framework

### Why Astro Starlight?

After experimenting with a custom Eleventy + Lit + Carbon setup, we migrated to Astro Starlight for several key reasons:

**Out-of-the-Box Features:**

- Built-in search (Pagefind) - fast, offline-capable, zero config
- Dark mode - automatic with smooth transitions
- Mobile navigation - responsive sidebar and mobile menu
- Accessibility - WCAG 2.0 Level AA compliant
- SEO - optimized meta tags and social cards
- Table of contents - auto-generated from headings
- Code copy buttons - built into all code blocks

**Developer Experience:**

- MDX support - write docs with React-like components
- Type-safe frontmatter - validated at build time
- Hot module replacement - instant preview during development
- Component system - easy to add custom interactive elements
- Excellent TypeScript integration

**Performance:**

- Partial hydration - only interactive parts load JavaScript
- Optimized builds - automatic image optimization, CSS/JS minification
- Fast page loads - minimal JavaScript bundle
- Static site generation - pre-rendered HTML

**Maintenance:**

- Less custom code - relies on battle-tested Starlight framework
- Active ecosystem - regular updates and improvements
- Strong community - extensive documentation and examples
- Future-proof - backed by Astro's growing ecosystem

**Comparison to Previous Setup:**

| Feature          | Custom Eleventy        | Astro Starlight            |
| ---------------- | ---------------------- | -------------------------- |
| Build time       | ~4-5s                  | ~2-3s                      |
| Search           | Would need custom impl | Built-in (Pagefind)        |
| Dark mode        | Would need custom impl | Built-in                   |
| Mobile nav       | Would need custom impl | Built-in                   |
| Code copy        | Would need custom impl | Built-in                   |
| Maintenance      | High (custom SSG)      | Low (framework handles it) |
| TypeScript DX    | Good                   | Excellent                  |
| Component system | Lit (custom)           | Astro + built-ins          |

**Decision:** The built-in features, better DX, and reduced maintenance burden made Starlight the clear choice.

---

## Proposed Documentation Structure

### Site Architecture

**Current Structure (Implemented):**

```
docs/src/content/docs/
│
├── index.mdx                   # Homepage with hero and feature cards
│
├── /getting-started/           # ✅ COMPLETE
│   ├── introduction.md         # What is Meowzer, features, architecture
│   ├── installation.md         # Install via npm/yarn/pnpm, CDN, setup
│   ├── quick-start.md          # 5-minute guide with working examples
│   └── first-cat.md            # Comprehensive tutorial with full code
│
├── /api/                       # 🟡 PARTIAL - Index page only
│   └── index.md                # API overview and structure
│
└── credits.md                  # Tech stack and acknowledgments
```

**Planned Expansion:**

```
docs/src/content/docs/
│
├── /getting-started/           # ✅ Complete
│
├── /tutorials/                 # 📝 Next priority (Milestone 2)
│   ├── basic-integration.md
│   ├── persistence-setup.md
│   ├── customization.md
│   └── framework-integration/
│       ├── react.md
│       ├── vue.md
│       ├── svelte.md
│       └── astro.md
│
├── /concepts/                  # 📝 Milestone 6
│   ├── architecture.md
│   ├── cat-lifecycle.md
│   ├── ai-behaviors.md
│   └── storage-persistence.md
│
├── /guides/                    # 📝 Milestone 7
│   ├── customization.md
│   ├── interactions.md
│   ├── performance.md
│   └── best-practices.md
│
├── /api/                       # 📝 Milestone 3
│   ├── meowzer-sdk.md
│   ├── meowzer-cat.md
│   └── managers/
│       ├── cat-manager.md
│       ├── storage-manager.md
│       ├── interaction-manager.md
│       ├── hook-manager.md
│       └── plugin-manager.md
│
├── /examples/                  # 📝 Milestone 4
│   ├── code-snippets.md
│   └── live-demos.md
│
└── /advanced/                  # 📝 Milestone 8 (Future)
    ├── plugin-development.md
    ├── custom-behaviors.md
    └── performance-tuning.md
```

**End User Section (Future):**

The `/play/` section for non-developers is deferred until developer documentation is more complete. When implemented, it will be a separate section with simplified, visual content.

---

## Content Specifications

### 1. End User Documentation (`/play/`)

#### Purpose

Help non-technical users understand and enjoy Meowzer cats on websites.

#### Target Audience

- Website visitors
- Content creators
- Non-technical site administrators
- Curious cat enthusiasts

#### Content Types

**Getting Started**

```markdown
# What is Meowzer?

Meowzer brings adorable, interactive cats to websites! These aren't
just images - they're animated companions that:

- 🐾 Walk around on their own
- 😺 Have unique personalities
- 🎾 Play with toys
- 🍖 Eat food you give them
- 😴 Take naps when tired
- 🔴 Chase laser pointers

[Try it yourself →]
```

**Interactive Guides**

- Visual tutorials with embedded playground
- Step-by-step GIFs showing interactions
- "Click here to feed a cat" live examples
- Personality quiz: "What kind of cat are you?"

**Content Style**

- Friendly, conversational tone
- Heavy use of emojis and visuals
- No code examples
- Interactive elements throughout
- Short, scannable sections

#### Example Pages

**Understanding Cat Behaviors**

```markdown
# How Cats Behave

## Wandering 🚶

Cats love to explore! They'll walk around randomly, checking
out different spots.

## Resting 😴

When cats get tired, they'll sit down or take a nap. Even
digital cats need their beauty sleep!

## Playing 🎮

Playful cats get bursts of energy and zoom around! Watch for
sudden sprints and playful pounces.

[See cats in action →] (embedded live demo)
```

---

### 2. Developer Documentation (`/docs/`)

#### Purpose

Enable developers to integrate Meowzer into projects quickly and effectively.

#### Target Audience

- Frontend developers
- Full-stack developers
- Library maintainers
- Technical integrators

#### Content Organization

**Progressive Disclosure:**

1. Quick Start (get running in 5 minutes)
2. Guided Tutorials (build understanding)
3. Concept Deep Dives (master the system)
4. Reference Documentation (look up specifics)

#### Starlight Components Available

Starlight provides built-in components for rich documentation:

**Callouts/Asides:**

```mdx
:::note
This is important information
:::

:::tip
Pro tip for better performance
:::

:::caution
Be careful with this approach
:::

:::danger
This will break your app!
:::
```

**Cards:**

```mdx
import {
  Card,
  CardGrid,
  LinkCard,
} from "@astrojs/starlight/components";

<CardGrid>
  <Card title="Feature Name" icon="star">
    Description of the feature
  </Card>
  <LinkCard title="Related Guide" href="/guides/example/" />
</CardGrid>
```

**Code with Highlighting:**

````mdx
```ts {2,5-7}
const meowzer = new Meowzer();
await meowzer.init(); // This line is highlighted

const cat = await meowzer.cats.create({
  name: "Whiskers", // These lines
  personality: "playful", // are also
  settings: { color: "#FF9500" } // highlighted
});
\`\`\`
```
````

**Steps:**

```mdx
import { Steps } from "@astrojs/starlight/components";

<Steps>
  1. Install Meowzer 2. Initialize the SDK 3. Create your first cat
</Steps>
```

**Tabs:**

````mdx
import { Tabs, TabItem } from "@astrojs/starlight/components";

<Tabs>
  <TabItem label="npm">```bash npm install meowzer ```</TabItem>
  <TabItem label="yarn">```bash yarn add meowzer ```</TabItem>
</Tabs>
````

These components are used throughout the docs for better readability and user experience.

---

### 2.1 Getting Started

**Introduction**

```markdown
# What is Meowzer?

Meowzer is a TypeScript SDK for creating autonomous, animated cat
sprites with AI-driven behaviors. Perfect for:

- Adding life to websites
- Interactive games and experiences
- Educational projects
- Creative experiments

## Key Features

- 🎨 Procedurally generated cat appearances
- 🧠 Autonomous AI behaviors (MeowBrain)
- 💾 IndexedDB persistence
- 🎮 Interactive toys and items
- 🔌 Plugin system for extensions
- 📦 TypeScript-first with full type safety

## Quick Preview

[Live demo with code side-by-side]
```

**Installation**

````markdown
# Installation

## Prerequisites

- Node.js 18+
- Modern browser with ES6+ support
- Package manager (npm, yarn, pnpm)

## Install via npm

```bash
npm install meowzer
```
````

## Install via CDN

```html
<script type="module">
  import { Meowzer } from "https://esm.sh/meowzer";
</script>
```

## Verify Installation

```typescript
import { Meowzer } from "meowzer";
console.log(Meowzer); // Should log the class
```

## Next Steps

→ [Quick Start: Your First Cat](/docs/getting-started/quick-start)

````

**Quick Start**
```markdown
# Quick Start: Your First Cat

Create an animated cat in under 5 minutes!

## Step 1: Initialize Meowzer

```typescript
import { Meowzer } from 'meowzer';

const meowzer = new Meowzer();
await meowzer.init(); // Required before use
````

## Step 2: Create a Cat

```typescript
const cat = await meowzer.cats.create({
  name: "Whiskers",
});
```

## Step 3: Place it on the Page

```typescript
cat.place(document.body);
```

That's it! You now have an autonomous cat wandering your page. 🎉

[See it live →]

## What Just Happened?

1. Meowzer generated a unique cat appearance
2. MeowBrain gave it autonomous behaviors
3. Meowtion animated it with smooth movements
4. The cat started wandering on its own!

## Next Steps

- [Customize cat appearance →](/docs/tutorials/customization)
- [Add interactions →](/docs/tutorials/interactions)
- [Save and load cats →](/docs/tutorials/persistence)

````

---

### 2.2 Concepts

**Architecture Overview**
```markdown
# Meowzer Architecture

## The Four Libraries

Meowzer SDK combines four specialized libraries:

### MeowKit - Cat Generation
Generates cat appearance from settings or seeds.

**Responsibilities:**
- Procedural cat generation
- SVG sprite creation
- Seed-based reproducibility
- Appearance validation

### Meowtion - Animation Engine
Handles all movement and visual animation.

**Responsibilities:**
- GSAP-based smooth movement
- State management (idle, walking, sitting, etc.)
- Physics and boundaries
- DOM rendering

### MeowBrain - AI Behaviors
Provides autonomous decision-making.

**Responsibilities:**
- Personality-driven behaviors
- Environmental awareness
- Interaction responses
- Decision engine

### MeowBase - Storage Layer
Manages persistence with IndexedDB.

**Responsibilities:**
- Cat serialization
- Collection management
- Async storage operations
- Migration handling

## How They Work Together

````

User Code
↓
Meowzer SDK (Managers)
↓
MeowzerCat (Wrapper)
├→ Cat (Meowtion) - Animation
└→ Brain (MeowBrain) - AI
↓
ProtoCat (MeowKit) - Appearance
↓
MeowBase - Storage

```

[Interactive architecture diagram]

## The Managers

The SDK provides manager classes for different concerns:

- **CatManager** - Create, find, destroy cats
- **StorageManager** - Save/load operations
- **InteractionManager** - Food, toys, laser pointer
- **HookManager** - Lifecycle events
- **PluginManager** - Extensions

## Design Philosophy

### Instance-Based API
No global functions - everything goes through instances.

### Event-Driven
Components communicate via events, not direct calls.

### Immutable Data
Settings and state are immutable for predictability.

### Progressive Enhancement
Features work independently; storage is optional.
```

**Cat Lifecycle**

````markdown
# Understanding Cat Lifecycle

A cat goes through several phases from creation to destruction.

## Lifecycle Phases

### 1. Creation

```typescript
const cat = await meowzer.cats.create(options);
```
````

**What Happens:**

1. Generate ProtoCat from settings (MeowKit)
2. Create animated Cat instance (Meowtion)
3. Initialize Brain (MeowBrain)
4. Wrap in MeowzerCat
5. Emit `afterCreate` hook

### 2. Placement

```typescript
cat.place(container);
```

**What Happens:**

1. Append DOM element to container
2. Start AI behaviors
3. Begin autonomous decision-making

### 3. Active State

The cat is now alive and autonomous!

**Running:**

- Brain makes decisions every 5-30 seconds
- Executes behaviors (wandering, playing, etc.)
- Responds to interactions
- Emits state change events

### 4. Paused State

```typescript
cat.pause();
```

**What Changes:**

- AI decision-making stops
- Current animation completes
- Cat remains visible
- Can still be moved manually

### 5. Destruction

```typescript
cat.destroy();
```

**What Happens:**

1. Stop all behaviors
2. Remove from DOM
3. Clear event listeners
4. Emit `beforeDestroy` hook
5. Free memory

## Lifecycle Hooks

Listen to lifecycle events:

```typescript
meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("New cat:", ctx.catId);
});

meowzer.hooks.on("beforeDestroy", (ctx) => {
  console.log("Goodbye cat:", ctx.catId);
});
```

[Lifecycle diagram with state machine]

````

---

### 2.3 Tutorials

**Tutorial 1: Basic Integration**
```markdown
# Tutorial: Basic Integration

Build a simple cat-enabled webpage from scratch.

## What You'll Build

A webpage where cats wander around and you can:
- Create new cats with a button
- Remove cats
- See how many cats are active

[Screenshot of final result]

## Prerequisites

- Basic HTML/CSS/JavaScript knowledge
- Node.js installed
- Text editor

## Step 1: Set Up Project

Create a new directory and initialize:

```bash
mkdir my-cat-page
cd my-cat-page
npm init -y
npm install meowzer vite
````

## Step 2: Create HTML

Create `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Cat Page</title>
    <style>
      body {
        margin: 0;
        padding: 20px;
        min-height: 100vh;
        background: #f0f0f0;
      }
      #controls {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div id="controls">
      <button id="add-cat">Add Cat</button>
      <button id="remove-cat">Remove Cat</button>
      <p>Active cats: <span id="count">0</span></p>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

## Step 3: Initialize Meowzer

Create `main.js`:

```typescript
import { Meowzer } from "meowzer";

// Initialize
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});

await meowzer.init();

// Track cats
const activeCats = new Set();

function updateCount() {
  document.getElementById("count").textContent = activeCats.size;
}

// Add cat button
document
  .getElementById("add-cat")
  .addEventListener("click", async () => {
    const cat = await meowzer.cats.create();
    cat.place(document.body);
    activeCats.add(cat);
    updateCount();
  });

// Remove cat button
document
  .getElementById("remove-cat")
  .addEventListener("click", () => {
    const cat = Array.from(activeCats)[0];
    if (cat) {
      cat.destroy();
      activeCats.delete(cat);
      updateCount();
    }
  });
```

## Step 4: Run It!

```bash
npx vite
```

Open http://localhost:5173 and click "Add Cat"!

## What's Next?

- [Add persistence →](/docs/tutorials/persistence-setup)
- [Customize cats →](/docs/tutorials/customization)
- [Add interactions →](/docs/tutorials/interactions)

## Full Code

[Link to CodeSandbox with complete example]

````

**Tutorial 2: Interactive Playground**
```markdown
# Tutorial: Interactive Playground

Build a full-featured cat playground with toys and interactions.

## What You'll Build

An interactive environment where users can:
- Create custom cats
- Feed them different foods
- Throw yarn for them to chase
- Use a laser pointer
- Watch AI behaviors in action

[GIF/video of the playground]

## Estimated Time: 30 minutes

## Part 1: Setup...
[Detailed steps]

## Part 2: Cat Creation UI...
[Detailed steps]

## Part 3: Adding Interactions...
[Detailed steps]

## Part 4: Polish & Features...
[Detailed steps]
````

---

### 2.4 Guides

**Customization Guide**

````markdown
# Cat Customization Guide

Complete reference for customizing cat appearance and behavior.

## Appearance Customization

### Colors

```typescript
const cat = await meowzer.cats.create({
  settings: {
    color: "#FF9500", // Fur color (hex)
    eyeColor: "#00FF00", // Eye color (hex)
  },
});
```
````

**Supported formats:**

- Hex: `#FF9500`
- RGB: Not supported (convert to hex first)

### Patterns

Available patterns:

- `solid` - No pattern
- `tabby` - Classic tabby stripes
- `spotted` - Leopard-like spots
- `tuxedo` - Black and white formal
- `calico` - Three-color patches

```typescript
settings: {
  pattern: "tabby",
  color: "#FF9500",
  patternColor: "#8B4513" // Optional accent color
}
```

### Size

Three size options:

```typescript
settings: {
  size: "small"; // 80% scale
  size: "medium"; // 100% scale (default)
  size: "large"; // 120% scale
}
```

### Fur Length

```typescript
settings: {
  furLength: "short"; // Sleek appearance
  furLength: "medium"; // Standard
  furLength: "long"; // Fluffy appearance
}
```

## Personality Customization

### Preset Personalities

```typescript
const cat = await meowzer.cats.create({
  personality: "playful",
  // Options: playful, lazy, curious, energetic, calm
});
```

### Custom Personality Traits

```typescript
const cat = await meowzer.cats.create({
  personality: {
    energy: 0.8, // 0-1 (low to high)
    curiosity: 0.6, // 0-1
    playfulness: 0.9, // 0-1
    independence: 0.4, // 0-1
    sociability: 0.7, // 0-1
  },
});
```

**Trait Effects:**

- **Energy**: How active the cat is

  - High: Moves frequently, rarely rests
  - Low: Sits often, moves slowly

- **Curiosity**: Exploration tendency

  - High: Investigates new areas, approaches objects
  - Low: Stays in familiar spots

- **Playfulness**: Interaction with toys

  - High: Plays longer, more excited
  - Low: Ignores toys, prefers napping

- **Independence**: Self-sufficiency

  - High: Wanders alone, less reactive
  - Low: Seeks interaction, responds more

- **Sociability**: Response to interactions
  - High: Approaches placed items quickly
  - Low: Takes time to notice items

## Behavior Customization

### Boundaries

```typescript
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 100,
      maxX: 800,
      minY: 50,
      maxY: 600,
    },
  },
});
```

### Decision Frequency

```typescript
const meowzer = new Meowzer({
  behavior: {
    decisionInterval: {
      min: 3000, // Min 3 seconds between decisions
      max: 15000, // Max 15 seconds
    },
  },
});
```

## Visual Examples

[Interactive customizer where you adjust values and see results]

````

---

### 2.5 API Reference

**Meowzer SDK**
```markdown
# Meowzer Class

Main entry point for the Meowzer SDK.

## Constructor

```typescript
new Meowzer(config?: PartialMeowzerConfig)
````

### Parameters

| Name   | Type                 | Optional | Description       |
| ------ | -------------------- | -------- | ----------------- |
| config | PartialMeowzerConfig | Yes      | SDK configuration |

### Returns

`Meowzer` instance

## Properties

### cats

```typescript
readonly cats: CatManager
```

Manager for cat lifecycle operations. See [CatManager](/docs/api/managers/cat-manager).

### storage

```typescript
readonly storage: StorageManager
```

Manager for persistence operations. See [StorageManager](/docs/api/managers/storage-manager).

### interactions

```typescript
readonly interactions: InteractionManager
```

Manager for interactive elements. See [InteractionManager](/docs/api/managers/interaction-manager).

### hooks

```typescript
readonly hooks: HookManager
```

Manager for lifecycle hooks. See [HookManager](/docs/api/managers/hook-manager).

### plugins

```typescript
readonly plugins: PluginManager
```

Manager for plugin system. See [PluginManager](/docs/api/managers/plugin-manager).

### utils

```typescript
readonly utils: MeowzerUtils
```

Utility functions. See [Utilities](/docs/api/utilities).

## Methods

### init()

```typescript
async init(): Promise<void>
```

Initialize the SDK. **Must be called before using any features.**

**Example:**

```typescript
const meowzer = new Meowzer();
await meowzer.init();
```

**Throws:**

- `InitializationError` - If initialization fails

---

### createLaserPointer()

```typescript
createLaserPointer(): LaserPointer
```

Create a laser pointer for cats to chase.

**Returns:** `LaserPointer` instance

**Example:**

```typescript
const laser = meowzer.createLaserPointer();
laser.turnOn({ x: 100, y: 100 });
laser.moveTo({ x: 200, y: 200 });
```

See [LaserPointer](/docs/api/interactions/laser-pointer).

---

### getConfig()

```typescript
getConfig(): MeowzerConfig
```

Get the current configuration (read-only).

**Returns:** Complete configuration object

**Example:**

```typescript
const config = meowzer.getConfig();
console.log(config.storage.adapter); // 'indexeddb'
```

---

## Configuration

### MeowzerConfig

Complete configuration interface:

```typescript
interface MeowzerConfig {
  storage: StorageConfig;
  behavior: BehaviorConfig;
}
```

### StorageConfig

```typescript
interface StorageConfig {
  adapter: "indexeddb" | "memory";
  enabled: boolean;
  defaultCollection: string;
  dbName: string;
  version: number;
}
```

### BehaviorConfig

```typescript
interface BehaviorConfig {
  boundaries: Boundaries;
  decisionInterval: {
    min: number;
    max: number;
  };
}
```

## Events

The Meowzer instance doesn't emit events directly. Use:

- `meowzer.hooks` for lifecycle events
- `meowzer.interactions` for interaction events
- Individual cat instances for cat-specific events

## Examples

### Basic Setup

```typescript
const meowzer = new Meowzer();
await meowzer.init();
```

### With Configuration

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb",
    enabled: true,
    defaultCollection: "my-cats",
  },
  behavior: {
    boundaries: {
      minX: 0,
      maxX: 1920,
      minY: 0,
      maxY: 1080,
    },
  },
});

await meowzer.init();
```

## See Also

- [Configuration Guide](/docs/guides/configuration)
- [CatManager API](/docs/api/managers/cat-manager)
- [Quick Start](/docs/getting-started/quick-start)

````

---

### 2.6 Examples

**Code Snippets Collection**
```markdown
# Code Snippets

Copy-paste examples for common tasks.

## Creating Cats

### Random Cat
```typescript
const cat = await meowzer.cats.create();
cat.place(document.body);
````

### Named Cat

```typescript
const cat = await meowzer.cats.create({
  name: "Whiskers",
});
```

### Custom Appearance

```typescript
const cat = await meowzer.cats.create({
  name: "Tiger",
  settings: {
    color: "#FF6600",
    pattern: "tabby",
    eyeColor: "#FFD700",
  },
});
```

### With Personality

```typescript
const cat = await meowzer.cats.create({
  name: "Lazy Larry",
  personality: {
    energy: 0.2,
    playfulness: 0.1,
    curiosity: 0.3,
  },
});
```

## Interactions

### Feed a Cat

```typescript
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});
```

### Throw Yarn

```typescript
const yarn = await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});
```

### Laser Pointer

```typescript
const laser = meowzer.createLaserPointer();

document.addEventListener("mousemove", (e) => {
  if (laser.isActive) {
    laser.moveTo({ x: e.clientX, y: e.clientY });
  }
});

document.addEventListener("click", (e) => {
  if (!laser.isActive) {
    laser.turnOn({ x: e.clientX, y: e.clientY });
  } else {
    laser.turnOff();
  }
});
```

## Persistence

### Save a Cat

```typescript
await meowzer.storage.save(cat.id);
```

### Load a Cat

```typescript
const cat = await meowzer.storage.load("cat-123");
cat.place(document.body);
```

### List Saved Cats

```typescript
const cats = await meowzer.storage.listCats();
console.log(cats); // Array of metadata
```

## Events

### Listen to State Changes

```typescript
cat.on("stateChanged", (event) => {
  console.log(`Cat is now ${event.newState}`);
});
```

### Listen to Lifecycle

```typescript
meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("New cat created:", ctx.catId);
});
```

## Advanced

### Multiple Cats

```typescript
const cats = await Promise.all([
  meowzer.cats.create({ name: "Cat 1" }),
  meowzer.cats.create({ name: "Cat 2" }),
  meowzer.cats.create({ name: "Cat 3" }),
]);

cats.forEach((cat) => cat.place(document.body));
```

### Responsive Boundaries

```typescript
function updateBoundaries() {
  meowzer.cats.getAll().forEach((cat) => {
    cat.setBoundaries({
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    });
  });
}

window.addEventListener("resize", updateBoundaries);
```

---

## Implementation Plan

**Updated:** November 24, 2025

### Status Overview

**Phase 1:** 🟢 **Complete** (100%)

- ✅ Migrated to Astro Starlight
- ✅ Site structure created with proper sidebar navigation
- ✅ Professional homepage with hero and feature cards
- ✅ Getting Started section complete (Introduction, Installation, Quick Start, First Cat)
- ✅ API Reference index page
- ✅ Credits page
- ✅ Build and deployment verified

**Phase 2:** 🟢 **Complete** (100%)

- ✅ Core Developer Tutorials (Milestone 2)
- ✅ Basic Integration tutorial
- ✅ Persistence Setup tutorial
- ✅ Cat Customization tutorial
- ✅ Sidebar navigation updated

### Revised Milestone-Based Approach

Rather than a fixed timeline, we're switching to milestone-based completion. Focus on shipping complete, useful content incrementally rather than documenting everything at once.

---

### Milestone 1: Complete Getting Started Foundation ✅ COMPLETE

**Goal:** Anyone can go from zero to working cat in 5 minutes

**Tasks:**

- [x] Create `/docs/getting-started/quick-start.md`
  - 5-minute version with minimal setup
  - Copy-paste ready code
  - Single complete example
- [x] Create `/docs/getting-started/first-cat.md`
  - Detailed walkthrough
  - Explains each step
  - Shows customization options
- [x] Verify all links in Getting Started section work
- [x] Migrate to Astro Starlight for better DX

**Status:** ✅ Complete - All Getting Started pages created and verified

**Actual Effort:** 6 hours (including Astro migration)

---

### Milestone 2: Core Developer Tutorials ✅ COMPLETE

**Goal:** Cover the 3 most common integration scenarios

**Tasks:**

- [x] `/docs/tutorials/basic-integration.md`
  - Simple webpage with cats
  - Add/remove cat buttons
  - Complete working example
- [x] `/docs/tutorials/persistence-setup.md`
  - Save and load cats
  - Collection management
  - Error handling
- [x] `/docs/tutorials/customization.md`
  - Appearance customization
  - Personality traits
  - Visual examples

**Status:** ✅ Complete - All three core tutorials created with comprehensive examples

**Actual Effort:** ~6 hours

---

### Milestone 3: Essential API Reference

**Goal:** Document the APIs developers use most

**Progressive approach - add APIs as needed:**

**Priority 1 (Must Have):**

- [ ] `/docs/api/meowzer-sdk.md` - Main entry point
- [ ] `/docs/api/managers/cat-manager.md` - Create/manage cats
- [ ] `/docs/api/meowzer-cat.md` - Cat instance API

**Priority 2 (Should Have):**

- [ ] `/docs/api/managers/storage-manager.md` - Save/load
- [ ] `/docs/api/managers/interaction-manager.md` - Food/toys

**Priority 3 (Nice to Have):**

- [ ] `/docs/api/managers/hook-manager.md`
- [ ] `/docs/api/managers/plugin-manager.md`
- [ ] `/docs/api/interactions/` - Individual interaction APIs

**Why This Order:** Focus on APIs used in 80% of implementations first.

**Estimated Effort:** 12-16 hours for Priority 1+2

---

### Milestone 4: Code Examples Library

**Goal:** Searchable collection of copy-paste snippets

**Tasks:**

- [ ] Expand `/docs/examples/code-snippets.md`
  - Create cats (10+ variations)
  - Interactions (food, toys, laser)
  - Persistence patterns
  - Event handling
- [ ] Create 2-3 live demos in `/docs/examples/live-demos/`
- [ ] Add CodeSandbox template links

**Why:** Developers love copy-paste. High value, medium effort.

**Estimated Effort:** 6-8 hours

---

### Milestone 5: End User Content (Simplified)

**Goal:** Help non-developers understand cats

**Revised scope - start simple:**

**Core Pages:**

- [ ] `/play/getting-started/understanding-cats.md`
  - How cats behave
  - What makes them unique
  - Simple, friendly language
- [ ] `/play/interacting/feeding-cats.md`
  - How to feed cats
  - What happens when you do
  - Visual examples
- [ ] `/play/interacting/playing-with-toys.md`
  - Yarn balls, laser pointers
  - How cats react

**Skip for now:**

- ❌ Interactive embedded playground (too complex)
- ❌ Personality quiz (nice-to-have)
- ❌ Animated behavior guides (wait for v2)

**Why Simplified:** End-user docs are lower priority than developer docs. Ship basics first.

**Estimated Effort:** 4-6 hours

---

### Milestone 6: Architecture Deep Dive

**Goal:** Explain how Meowzer works under the hood

**Tasks:**

- [ ] `/docs/concepts/architecture.md`
  - Four-library system
  - Data flow diagrams
  - Manager layer explanation
- [ ] `/docs/concepts/cat-lifecycle.md`
  - Creation → Placement → Active → Destroyed
  - State machine diagram
  - Lifecycle hooks
- [ ] `/docs/concepts/ai-behaviors.md`
  - How MeowBrain works
  - Decision engine
  - Personality influence

**Why Later:** Important but not urgent. Developers can use SDK without understanding internals.

**Estimated Effort:** 8-10 hours

---

### Milestone 7: Guides & Best Practices

**Goal:** Help developers build production-ready implementations

**Tasks:**

- [ ] `/docs/guides/customization.md`
  - Complete customization reference
  - All appearance options
  - Personality system
- [ ] `/docs/guides/performance.md`
  - Optimization tips
  - Handling many cats
  - Memory management
- [ ] `/docs/guides/best-practices.md`
  - Recommended patterns
  - Common pitfalls
  - Accessibility considerations

**Estimated Effort:** 6-8 hours

---

### Milestone 8: Advanced Topics (Future)

**Deferred until there's demand:**

- Plugin development guide
- Custom AI behaviors
- Framework-specific integration guides
- Advanced examples
- Video tutorials

**Why Deferred:** Build these when people ask for them, not speculatively.

---

## Revised Principles

### 1. Ship Incrementally

Don't wait for "complete" documentation. Ship useful pages as they're ready.

### 2. Progressive Documentation

Document what people use, not everything that exists. Let usage patterns guide priorities.

### 3. Complete Over Comprehensive

A few complete, excellent pages beat many incomplete ones.

### 4. Iterate Based on Feedback

Watch what people search for, ask about, struggle with. Document that.

### 5. Leverage TypeScript

Types are documentation. Link to type definitions instead of duplicating info.

---

## Current Blockers (Resolved) ✅

1. ~~**Quick Start page missing**~~ - ✅ Created with complete working examples
2. ~~**First Cat tutorial missing**~~ - ✅ Comprehensive tutorial with full code
3. ~~**No working code examples**~~ - ✅ All Getting Started pages have runnable code

**Previous blockers are now resolved.** Focus shifts to Milestone 2 (Core Tutorials).

---

## Technical Requirements

### Documentation Site Features

**Provided by Starlight (Out of the Box):**

- ✅ Markdown/MDX-based content
- ✅ Syntax highlighting with Shiki
- ✅ Built-in search via Pagefind
- ✅ Mobile responsive navigation
- ✅ Dark mode support
- ✅ Automatic table of contents
- ✅ Sidebar navigation
- ✅ Copy code button
- ✅ Accessibility (WCAG 2.0 Level AA)
- ✅ SEO optimized
- ✅ Social card generation

**To Implement:**

- [ ] Live code examples (CodeSandbox embeds)
- [ ] Interactive playground embeds
- [ ] Custom components for special formatting

### Content Management

**Authoring:**

- Markdown/MDX files with frontmatter
- Astro components for interactive elements
- Starlight built-in components (Card, LinkCard, Aside, Code, etc.)
- Consistent formatting standards per Starlight conventions
- Type-safe frontmatter validation

---

## Appendix

### Style Guide Snippets

**Voice & Tone:**

- Professional but friendly
- Active voice preferred
- Short paragraphs (3-4 sentences max)
- Progressive disclosure (simple → complex)

**Code Examples:**

- Complete, runnable examples
- Realistic use cases
- Comments for clarity
- TypeScript preferred
- Show both success and error handling

**Structure:**

- Clear h2/h3 hierarchy
- Bulleted lists for options
- Tables for comparisons
- Callouts for important info
- Next steps at end of each page

---

## Questions & Decisions Needed

### Answered ✅

1. **Hosting:** Where will docs be hosted?

   - ✅ **Netlify** (or Vercel - both work well with Astro)

2. **SSG Choice:** Continue custom SSG or switch to VitePress/Docusaurus?

   - ✅ **Switched to Astro Starlight** - Best-in-class docs experience

3. **Video Content:** Budget for tutorial videos?

   - ✅ **No videos initially** - text and code examples only

4. **Interactive Demos:** Embed live playgrounds or link to external?

   - ✅ **Embed if it makes sense** - keep it simple

5. **Versioning:** How to handle docs for multiple SDK versions?

   - ✅ **Don't worry about versions for now** - single version

6. **Community:** Allow user contributions? Wiki section?

   - ✅ **No** - maintain centralized control

7. **Site Structure:** Single site or separate for end users?
   - ✅ **Single site with clear navigation** - Use sidebar to separate concerns

### Open Questions ❓

1. **Domain Strategy:**

   - Option A: `meowzer.dev` (main site with docs at `/docs/`)
   - Option B: `docs.meowzer.dev` (separate subdomain)
   - **Recommendation:** Option A for simplicity

2. **Search Functionality:**

   - ✅ **Resolved:** Starlight includes Pagefind search out of the box
   - Works offline, fast, no external service needed

3. **Feedback Mechanism:**

   - "Was this helpful?" buttons on pages?
   - GitHub issues only?
   - **Recommendation:** GitHub issues only initially

4. **Analytics:**
   - Track page views and search queries?
   - Which pages are most visited?
   - **Recommendation:** Simple analytics (Plausible/Fathom) for insights

---

## Next Steps

### Immediate (This Week)

1. ✅ **Review and approve** this updated proposal
2. ✅ **Complete Milestone 1** - Quick Start and First Cat tutorials DONE
3. ✅ **Migrate to Astro Starlight** - DONE
4. ✅ **Create working code examples** for Getting Started - DONE

### Short Term (Next 2 Weeks)

5. ✅ **Build 3 core tutorials** (Milestone 2) - COMPLETE
6. 📚 **Document top 3 APIs** (Milestone 3, Priority 1) - NEXT FOCUS
7. 🧪 **Start examples collection** (Milestone 4)

### Medium Term (Following Month)

7. 🎨 **Add end-user content basics** (Milestone 5)
8. 🏗️ **Architecture documentation** (Milestone 6)
9. 📖 **Guides and best practices** (Milestone 7)

### Ongoing

- Monitor user questions and feedback
- Update docs based on common issues
- Add examples as patterns emerge
- Iterate on what's working

---

## Success Metrics

**How we'll know docs are working:**

### Qualitative

- Developers can go from zero to working cat in <10 minutes
- Support questions decrease over time
- People share links to specific docs pages
- Contributors reference docs in PRs

### Quantitative (if analytics added)

- Time on Getting Started pages
- Most viewed pages
- Search queries (what are people looking for?)
- 404s (what are they expecting to find?)

### Review Cadence

- Quick review after each milestone
- Full documentation audit quarterly
- Update examples when SDK changes

---

**Proposal Updated:** November 24, 2025  
**Status:** Milestone 1 Complete - Astro Starlight Migration Successful

### Migration Summary

Successfully migrated from custom Eleventy setup to Astro Starlight, delivering:

- ✅ Professional documentation site with modern design
- ✅ All Getting Started content (Introduction, Installation, Quick Start, First Cat)
- ✅ Built-in search, dark mode, mobile navigation
- ✅ Faster builds and better performance
- ✅ Cleaner codebase with less custom code to maintain

**Next Focus:** Milestone 2 - Core Developer Tutorials
