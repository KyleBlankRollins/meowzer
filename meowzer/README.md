# Meowzer SDK

> A TypeScript SDK for creating autonomous, animated cat sprites that wander around web pages with personality-driven AI behaviors.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## What is Meowzer?

Meowzer lets you programmatically create animated cat sprites that move autonomously around a web page using AI-driven behaviors. Each cat has:

- **Unique appearance** - Generated from customizable settings or random
- **Autonomous behavior** - Powered by decision-making AI (MeowBrain)
- **Personality traits** - Curious, playful, lazy, energetic, etc.
- **Interactions** - Responds to food, water, toys, and laser pointers
- **Persistence** - Save and load cats from IndexedDB storage

Perfect for adding delightful, autonomous companions to websites, games, or interactive experiences.

---

## 🚀 Quick Start

```typescript
import { Meowzer } from "meowzer";

// 1. Create SDK instance
const meowzer = new Meowzer();

// 2. Initialize (required before use)
await meowzer.init();

// 3. Create a cat
const cat = await meowzer.cats.create({
  name: "Whiskers",
  settings: {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
});

// Cat automatically appears on the page and starts wandering! 🐈
```

---

## 📦 Installation

```bash
npm install meowzer
```

**Requirements:**

- Modern browser with ES6+ support
- IndexedDB (for persistence features)
- RequestAnimationFrame support

**Dependencies:**

- `gsap` - For smooth animations (only dependency)

---

## 🏗️ Architecture

Meowzer combines four specialized libraries into a unified SDK:

```
┌─────────────────────────────────────────────┐
│              MEOWZER SDK                    │
│         (Main API Entry Point)              │
└─────────────────────────────────────────────┘
     │
     ├──► Managers (API Layer)
     │    ├── CatManager      - Create, find, destroy cats
     │    ├── StorageManager  - Save/load from IndexedDB
     │    ├── InteractionManager - Food, toys, laser pointer
     │    ├── HookManager     - Lifecycle event hooks
     │    └── PluginManager   - Extend functionality
     │
     └──► Libraries (Core Engine)
          ├── MeowKit   - Cat generation (appearance, SVG)
          ├── Meowtion  - Animation engine (movement, states)
          ├── MeowBrain - AI behaviors (autonomous decisions)
          └── MeowBase  - Storage layer (IndexedDB)
```

### The Flow

1. **MeowKit** generates cat appearance from settings → ProtoCat data
2. **Meowtion** renders ProtoCat as animated SVG → Cat instance
3. **MeowBrain** adds autonomous AI → Brain controls Cat
4. **MeowzerCat** wraps everything → Public API you use
5. **MeowBase** persists cats → Survive page reloads

---

## 🎯 Core Concepts

### 1. Meowzer Instance

The SDK is **instance-based**, not global functions. Always start by creating an instance:

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb", // Use IndexedDB for persistence
    enabled: true, // Enable storage features
  },
  behavior: {
    boundaries: {
      // Default boundaries for cats
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});

await meowzer.init(); // MUST call before using SDK
```

### 2. Managers

All SDK operations go through **managers** (not global functions):

| Manager        | Purpose                    | Access                             |
| -------------- | -------------------------- | ---------------------------------- |
| `cats`         | Create, find, destroy cats | `meowzer.cats.create()`            |
| `storage`      | Save/load from IndexedDB   | `meowzer.storage.save()`           |
| `interactions` | Food, toys, laser pointer  | `meowzer.interactions.placeNeed()` |
| `hooks`        | Lifecycle event listeners  | `meowzer.hooks.on()`               |
| `plugins`      | Extend SDK functionality   | `meowzer.plugins.install()`        |

### 3. MeowzerCat

The object returned when you create a cat. It combines:

- **Cat** (Meowtion) - Animation and rendering
- **Brain** (MeowBrain) - AI decision-making
- **Metadata** - Name, description, creation date

```typescript
const cat = await meowzer.cats.create({ name: "Fluffy" });

// Cat properties
cat.id; // Unique ID
cat.name; // "Fluffy"
cat.seed; // Reproducible seed string
cat.position; // { x: number, y: number }
cat.state; // "idle" | "walking" | "sitting" | "sleeping"
cat.personality; // { energy, curiosity, playfulness, independence, sociability }
cat.element; // HTMLElement for the cat

// Cat methods
cat.pause(); // Stop AI behaviors
cat.resume(); // Resume AI behaviors
cat.destroy(); // Remove and cleanup
cat.respondToNeed(id); // Interact with food/water
cat.playWithYarn(id); // Play with yarn
cat.chaseLaser(position); // Chase laser pointer
```

---

## 📖 Usage Guide

### Creating Cats

#### Random Cat (Easiest)

```typescript
// No options = random appearance and personality
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!
```

#### Custom Appearance

```typescript
const cat = await meowzer.cats.create({
  name: "Mittens",
  description: "An orange tabby with attitude",
  settings: {
    color: "#FF9500", // Primary fur color
    eyeColor: "#00FF00", // Eye color
    pattern: "tabby", // solid | tabby | calico | tuxedo | spotted
    size: "medium", // small | medium | large
    furLength: "short", // short | medium | long
  },
});
```

#### From Seed (Reproducible)

Seeds let you recreate the exact same cat appearance:

```typescript
// Get seed from existing cat
const seed = cat.seed; // "tabby-FF9500-00FF00-m-short-v1"

// Later, recreate same appearance
const clone = await meowzer.cats.create({
  seed: "tabby-FF9500-00FF00-m-short-v1",
  name: "Mittens Jr.",
});
```

#### Batch Creation

```typescript
const cats = await meowzer.cats.createMany([
  { name: "Cat 1" },
  { name: "Cat 2", settings: { color: "#000000" } },
  { seed: "tabby-FF9500-00FF00-m-short-v1" },
]);
```

### Managing Cats

```typescript
// Get all active cats
const allCats = meowzer.cats.getAll();
console.log(`${allCats.length} cats on screen`);

// Get specific cat by ID
const cat = meowzer.cats.get("cat-abc123");

// Check if cat exists
if (meowzer.cats.has("cat-abc123")) {
  // ...
}

// Find cats matching criteria
const playfulCats = meowzer.cats.find({
  tags: ["playful"],
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 10,
});

// Destroy single cat
await meowzer.cats.destroy("cat-abc123");

// Destroy multiple
await meowzer.cats.destroyMany(["cat-1", "cat-2"]);

// Destroy all
await meowzer.cats.destroyAll();
```

### Cat Control

```typescript
const cat = await meowzer.cats.create();
// Cat automatically appears on document.body

// Pause AI (cat stops moving)
cat.pause();

// Resume AI
cat.resume();

// Update properties
cat.setName("New Name");
cat.setDescription("New description");
cat.updateMetadata({ favoriteFood: "tuna" });

// Set boundaries (where cat can wander)
cat.setEnvironment({
  boundaries: {
    minX: 0,
    maxX: 800,
    minY: 0,
    maxY: 600,
  },
});
```

### Personality Traits

Every cat has personality traits (0-1 scale) that influence behavior:

```typescript
const cat = await meowzer.cats.create();

console.log(cat.personality);
// {
//   energy: 0.7,        // High energy = moves more
//   curiosity: 0.8,     // Curious = investigates things
//   playfulness: 0.9,   // Playful = likes toys
//   independence: 0.3,  // Independent = ignores you
//   sociability: 0.6    // Social = approaches people
// }

// You can't set personality directly on MeowzerCat
// (Brain manages it internally based on AI decisions)
```

---

## 💾 Storage & Persistence

Save cats to IndexedDB to persist across sessions:

### Basic Save/Load

```typescript
// Create SDK with storage enabled
const meowzer = new Meowzer({
  storage: { adapter: "indexeddb", enabled: true },
});
await meowzer.init();

// Create and save a cat
const cat = await meowzer.cats.create({ name: "Whiskers" });
await meowzer.storage.save(cat.id);

// Later, load the cat
const loadedCat = await meowzer.storage.load("cat-abc123");
// Cat automatically appears on the page!

// Load all saved cats
const allSavedCats = await meowzer.storage.loadAll();

// Delete from storage (doesn't destroy active instance)
await meowzer.storage.delete("cat-abc123");
```

### Collections

Organize cats into collections (like folders):

```typescript
// Create collection
const collectionId = await meowzer.storage.createCollection(
  "My Favorites",
  {
    description: "My favorite cats",
  }
);

// Add cats to collection
await meowzer.storage.addToCollection(collectionId, cat.id);

// Get collection info
const info = await meowzer.storage.getCollection(collectionId);
console.log(info.name, info.catIds);

// Load all cats from collection
const cats = await meowzer.storage.loadCollection(collectionId);

// Remove cat from collection
await meowzer.storage.removeFromCollection(collectionId, cat.id);

// Delete collection (keeps cats, just removes collection)
await meowzer.storage.deleteCollection(collectionId);

// List all collections
const collections = await meowzer.storage.listCollections();
```

---

## 🎮 Interactions

Cats can interact with food, water, toys, and laser pointers!

### Food & Water

```typescript
// Place basic food (kibble)
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Place fancy food (wet food)
const fancyFood = await meowzer.interactions.placeNeed("food:fancy", {
  x: 500,
  y: 300,
});

// Place water
const water = await meowzer.interactions.placeNeed("water", {
  x: 450,
  y: 350,
});

// Cats automatically detect nearby needs and may approach!
// Depends on personality and current state

// Manually trigger cat response
await cat.respondToNeed(food.id);

// Remove need
await meowzer.interactions.removeNeed(food.id);

// Get all active needs
const needs = meowzer.interactions.getAllNeeds();

// Get needs near position
const nearbyNeeds = meowzer.interactions.getNeedsNearPosition(
  { x: 400, y: 300 },
  150 // radius
);
```

### Yarn

```typescript
// Place yarn at position
const yarn = await meowzer.interactions.placeYarn({ x: 300, y: 200 });

// Or random position
const randomYarn = await meowzer.interactions.placeYarn();

// Cats detect yarn and may play with it
// Manually trigger
await cat.playWithYarn(yarn.id);

// Move yarn (cat will chase)
yarn.move({ x: 400, y: 250 });

// Listen to yarn events
yarn.on("moved", (event) => {
  console.log("Yarn moved to:", event.position);
});

yarn.on("removed", () => {
  console.log("Yarn was removed");
});

// Remove yarn
yarn.remove();
```

### Laser Pointer

```typescript
// Create laser pointer
const laser = meowzer.createLaserPointer();

// Turn on at position
laser.turnOn({ x: 500, y: 300 });

// Move laser (cats chase it!)
laser.moveTo({ x: 600, y: 400 });

// Listen to events
laser.on("moved", (event) => {
  console.log("Laser at:", event.position);
});

laser.on("turnedOn", (event) => {
  console.log("Laser activated");
});

// Turn off
laser.turnOff();

// Manually make cat chase laser
await cat.chaseLaser(laser.position);
```

### Interaction Events

Listen to interaction events across all cats:

```typescript
// Need placed
meowzer.interactions.on("needPlaced", (event) => {
  console.log(`Need ${event.type} placed at`, event.position);
});

// Cat responds to need
meowzer.interactions.on("needResponse", (event) => {
  console.log(`Cat ${event.catId} is ${event.responseType}`);
  // responseType: "interested" | "approaching" | "consuming" | "satisfied" | "ignoring"
});

// Yarn placed
meowzer.interactions.on("yarnPlaced", (event) => {
  console.log("Yarn placed at", event.position);
});

// Yarn moved
meowzer.interactions.on("yarnMoved", (event) => {
  console.log("Yarn moved to", event.position);
});
```

---

## 🪝 Lifecycle Hooks

React to cat lifecycle events:

```typescript
// Before/after cat creation
meowzer.hooks.on("beforeCreate", (context) => {
  console.log("About to create cat with options:", context.options);
});

meowzer.hooks.on("afterCreate", (context) => {
  console.log("Created cat:", context.catId);
});

// Before/after save
meowzer.hooks.on("beforeSave", (context) => {
  console.log("Saving cat:", context.catId);
});

meowzer.hooks.on("afterSave", (context) => {
  console.log("Saved successfully!");
});

// Before/after load
meowzer.hooks.on("beforeLoad", (context) => {
  console.log("Loading cat:", context.catId);
});

meowzer.hooks.on("afterLoad", (context) => {
  console.log("Loaded cat:", context.catId);
});

// Before/after destroy
meowzer.hooks.on("beforeDestroy", (context) => {
  console.log("Destroying cat:", context.catId);
});

meowzer.hooks.on("afterDestroy", (context) => {
  console.log("Cat destroyed");
});

// Interaction hooks
meowzer.hooks.on("beforeNeedPlace", (context) => {
  console.log("Placing need:", context.type);
});

meowzer.hooks.on("afterNeedPlace", (context) => {
  console.log("Need placed:", context.needId);
});

// One-time hooks
meowzer.hooks.once("afterCreate", (context) => {
  console.log("First cat created!");
});

// Remove hook
const handler = (context) => console.log("Cat created");
meowzer.hooks.on("afterCreate", handler);
meowzer.hooks.off("afterCreate", handler);
```

### Available Hooks

**Cat Lifecycle:**

- `beforeCreate` / `afterCreate`
- `beforeSave` / `afterSave`
- `beforeLoad` / `afterLoad`
- `beforeDestroy` / `afterDestroy`
- `beforeDelete` / `afterDelete`

**Interactions:**

- `beforeNeedPlace` / `afterNeedPlace`
- `beforeNeedRemove` / `afterNeedRemove`
- `beforeYarnPlace` / `afterYarnPlace`
- `beforeInteractionStart` / `afterInteractionEnd`

---

## 🔌 Plugin System

Extend Meowzer with plugins:

```typescript
// Define a plugin
const analyticsPlugin = {
  id: "analytics",
  name: "Analytics Plugin",
  version: "1.0.0",

  install(context) {
    // Access SDK components
    const { hooks, cats } = context;

    // Track cat creation
    hooks.on("afterCreate", (ctx) => {
      console.log("Analytics: Cat created", ctx.catId);
      // Send to analytics service...
    });

    return {
      // Cleanup function (optional)
      uninstall() {
        console.log("Analytics plugin uninstalled");
      },
    };
  },
};

// Install plugin
await meowzer.plugins.install(analyticsPlugin, {
  config: { apiKey: "xxx" },
});

// Or use convenience method
await meowzer.use(analyticsPlugin);

// Check installed plugins
const plugins = meowzer.plugins.getInstalled();

// Uninstall
await meowzer.plugins.uninstall("analytics");
```

### Plugin Interface

```typescript
interface MeowzerPlugin {
  id: string;
  name: string;
  version: string;
  install(
    context: PluginContext
  ): PluginInstallResult | Promise<PluginInstallResult>;
}

interface PluginContext {
  meowzer: Meowzer;
  hooks: HookManager;
  cats: CatManager;
  storage: StorageManager;
  interactions: InteractionManager;
  config: ConfigManager;
}
```

---

## 🎨 Complete Examples

### Simple Wandering Cat

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();

const cat = await meowzer.cats.create();
// Cat automatically appears on the page!
```

### Custom Cat with Persistence

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer({
  storage: { adapter: "indexeddb", enabled: true },
});
await meowzer.init();

// Create custom cat
const cat = await meowzer.cats.create({
  name: "Whiskers",
  description: "A curious orange tabby",
  settings: {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
});

// Cat automatically appears on the page!

// Save for later
await meowzer.storage.save(cat.id);

// Later session...
const loadedCat = await meowzer.storage.load(cat.id);
// Cat automatically appears on the page!
```

### Interactive Playground

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();

// Create a few cats
const cat1 = await meowzer.cats.create({ name: "Fluffy" });
const cat2 = await meowzer.cats.create({ name: "Shadow" });
// Cats automatically appear on the page!

// Add food
const food = await meowzer.interactions.placeNeed("food:fancy", {
  x: 400,
  y: 300,
});

// Add yarn
const yarn = await meowzer.interactions.placeYarn({ x: 500, y: 200 });

// Create laser pointer
const laser = meowzer.createLaserPointer();

// Control laser with mouse
document.addEventListener("click", (e) => {
  if (!laser.isActive) {
    laser.turnOn({ x: e.clientX, y: e.clientY });
  } else {
    laser.moveTo({ x: e.clientX, y: e.clientY });
  }
});

// Listen to interactions
meowzer.interactions.on("needResponse", (event) => {
  console.log(`Cat ${event.catId}: ${event.responseType}`);
});
```

### Responsive Boundaries

```typescript
import { Meowzer } from "meowzer";

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

const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// Update boundaries on resize
window.addEventListener("resize", () => {
  const newBoundaries = {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  };

  // Update config (affects new cats)
  meowzer.configure({
    behavior: { boundaries: newBoundaries },
  });

  // Update existing cat
  cat.setEnvironment({ boundaries: newBoundaries });
});
```

### Cat Collection Manager

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer({
  storage: { adapter: "indexeddb", enabled: true },
});
await meowzer.init();

// Create collection
const collectionId = await meowzer.storage.createCollection(
  "My Cats"
);

// Create and save cats
const cat1 = await meowzer.cats.create({ name: "Whiskers" });
const cat2 = await meowzer.cats.create({ name: "Mittens" });

await meowzer.storage.save(cat1.id);
await meowzer.storage.save(cat2.id);

await meowzer.storage.addToCollection(collectionId, cat1.id);
await meowzer.storage.addToCollection(collectionId, cat2.id);

// Later, load entire collection
const cats = await meowzer.storage.loadCollection(collectionId);
// All cats automatically appear on the page!
```

---

## 🔧 API Reference

### Meowzer Class

```typescript
class Meowzer {
  // Managers
  readonly cats: CatManager;
  readonly storage: StorageManager;
  readonly hooks: HookManager;
  readonly interactions: InteractionManager;
  readonly plugins: PluginManager;
  readonly utils: typeof MeowzerUtils;

  // Methods
  constructor(config?: PartialMeowzerConfig);
  init(): Promise<void>;
  isInitialized(): boolean;
  destroy(): Promise<void>;
  configure(config: PartialMeowzerConfig): void;
  getConfig(): MeowzerConfig;
  use(
    plugin: MeowzerPlugin,
    options?: PluginInstallOptions
  ): Promise<void>;
  createLaserPointer(): LaserPointer;
}
```

### CatManager

```typescript
class CatManager {
  create(options?: CreateCatOptions): Promise<MeowzerCat>;
  createMany(optionsArray: CreateCatOptions[]): Promise<MeowzerCat[]>;
  get(id: string): MeowzerCat | undefined;
  has(id: string): boolean;
  getAll(): MeowzerCat[];
  find(options?: FindCatsOptions): MeowzerCat[];
  destroy(id: string): Promise<void>;
  destroyMany(ids: string[]): Promise<void>;
  destroyAll(): Promise<void>;
}
```

### StorageManager

```typescript
class StorageManager {
  save(catId: string, options?: SaveCatOptions): Promise<void>;
  load(catId: string): Promise<MeowzerCat>;
  loadAll(): Promise<MeowzerCat[]>;
  delete(catId: string): Promise<void>;
  exists(catId: string): Promise<boolean>;
  count(): Promise<number>;
  list(): Promise<string[]>;

  // Collections
  createCollection(
    name: string,
    metadata?: Record<string, unknown>
  ): Promise<string>;
  getCollection(collectionId: string): Promise<CollectionInfo>;
  listCollections(): Promise<CollectionInfo[]>;
  loadCollection(collectionId: string): Promise<MeowzerCat[]>;
  addToCollection(collectionId: string, catId: string): Promise<void>;
  removeFromCollection(
    collectionId: string,
    catId: string
  ): Promise<void>;
  deleteCollection(collectionId: string): Promise<void>;
}
```

### InteractionManager

```typescript
class InteractionManager {
  // Needs (food/water)
  placeNeed(
    type: NeedTypeIdentifier,
    position: Position,
    options?: PlaceNeedOptions
  ): Promise<Need>;
  removeNeed(needId: string): Promise<boolean>;
  getNeed(needId: string): Need | undefined;
  getAllNeeds(): Need[];
  getNeedsByType(type: NeedTypeIdentifier): Need[];
  getNeedsNearPosition(position: Position, radius?: number): Need[];

  // Yarn
  placeYarn(
    position?: Position,
    options?: YarnOptions
  ): Promise<Yarn>;

  // Events
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
}
```

### MeowzerCat

```typescript
class MeowzerCat {
  // Properties
  readonly id: string;
  readonly seed: string;
  readonly element: HTMLElement;
  readonly position: Position;
  readonly state: CatStateType;
  readonly personality: Personality;
  readonly isActive: boolean;
  name: string | undefined;
  description: string | undefined;
  metadata: CatMetadata;

  // Placement
  place(container: HTMLElement): void;
  remove(): void;

  // Control
  pause(): void;
  resume(): void;
  destroy(): void;

  // Configuration
  setName(name: string): void;
  setDescription(description: string): void;
  setEnvironment(environment: Environment): void;
  updateMetadata(metadata: Record<string, unknown>): void;

  // Interactions
  respondToNeed(needId: string): Promise<void>;
  playWithYarn(yarnId: string): Promise<void>;
  chaseLaser(position: Position): Promise<void>;

  // Events
  on(event: MeowzerEvent, handler: EventHandler): void;
  off(event: MeowzerEvent, handler: EventHandler): void;

  // Serialization
  toJSON(): CatJSON;
  getBoundaries(): Boundaries;
}
```

### Types

```typescript
// Cat Settings
interface CatSettings {
  color: string; // Hex color or CSS color name
  eyeColor: string; // Hex color or CSS color name
  pattern: CatPattern; // "solid" | "tabby" | "calico" | "tuxedo" | "spotted"
  size: CatSize; // "small" | "medium" | "large"
  furLength: FurLength; // "short" | "medium" | "long"
}

// Personality
interface Personality {
  energy: number; // 0-1: How active the cat is
  curiosity: number; // 0-1: Tendency to investigate
  playfulness: number; // 0-1: Interest in toys
  independence: number; // 0-1: How much they ignore you
  sociability: number; // 0-1: Friendliness toward people
}

// Position
interface Position {
  x: number;
  y: number;
}

// Boundaries
interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Need Types
type NeedTypeIdentifier = "food:basic" | "food:fancy" | "water";

// Cat States
type CatStateType =
  | "idle"
  | "walking"
  | "sitting"
  | "sleeping"
  | "playing";

// Events
type MeowzerEvent =
  | "behaviorChange"
  | "stateChange"
  | "positionChange"
  | "destroy";
```

---

## 🎭 How It Works

### The Libraries

**MeowKit** - Cat Generation

- Takes user settings (color, pattern, size)
- Generates unique seed string
- Creates SVG sprite data
- Output: `ProtoCat` (appearance data)

**Meowtion** - Animation Engine

- Takes `ProtoCat` from MeowKit
- Renders as DOM element with SVG
- Handles movement animations (GSAP)
- Manages animation states (idle, walking, etc.)
- Output: `Cat` (animated sprite)

**MeowBrain** - AI Behaviors

- Takes `Cat` from Meowtion
- Adds autonomous decision-making
- Personality-driven behavior selection
- Manages: wandering, resting, playing, exploring, etc.
- Output: `Brain` (controls the Cat)

**MeowBase** - Storage Layer

- IndexedDB adapter for persistence
- Stores cat data as JSON
- Manages collections
- Handles cache and queries

**SDK Layer** - Public API

- `MeowzerCat` wraps Cat + Brain
- Managers provide organized API surface
- Hooks for lifecycle events
- Plugin system for extensibility

### The Decision Loop

1. Brain evaluates cat's current state (motivation, memory, environment)
2. Calculates behavior weights based on personality
3. Chooses next behavior (wandering, resting, playing, etc.)
4. Executes behavior through Cat's animation methods
5. Updates motivations and memory
6. Waits random interval (personality-dependent)
7. Repeat from step 1

### Interaction Detection

1. Need placed (food/water) → InteractionManager emits event
2. Brain receives event, checks distance to cat
3. If nearby + interested (based on personality) → Brain emits reaction
4. MeowzerCat receives reaction → calls `respondToNeed()`
5. Cat approaches need → consumes → satisfaction!

---

## 🌐 Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions

**Required Features:**

- ES6+ (classes, async/await, modules)
- Promises
- RequestAnimationFrame
- IndexedDB (for storage features)
- SVG rendering

---

## 📝 TypeScript Support

Meowzer is written in TypeScript with full type definitions:

```typescript
import type {
  Meowzer,
  MeowzerCat,
  CatSettings,
  Personality,
  CreateCatOptions,
  MeowzerConfig,
} from "meowzer";

const config: MeowzerConfig = {
  storage: { adapter: "indexeddb", enabled: true },
};

const meowzer: Meowzer = new Meowzer(config);
```

---

## 🐛 Troubleshooting

### "Meowzer already initialized"

**Problem:** Called `init()` twice on same instance.

**Solution:** Only call `init()` once per instance.

```typescript
const meowzer = new Meowzer();
await meowzer.init(); // ✅ First call
// await meowzer.init(); // ❌ Don't call again
```

### Cats not responding to interactions

**Problem:** Brain might not be running or interest level too low.

**Solutions:**

- Check `cat.isActive` - should be `true`
- Increase interaction interest by placing items nearby
- Manually trigger: `await cat.respondToNeed(needId)`
- Check personality: high `independence` = ignores stuff

### Storage not working

**Problem:** IndexedDB not enabled or browser doesn't support it.

**Solutions:**

```typescript
// Check if initialized with storage
if (meowzer.storage._isEnabled()) {
  await meowzer.storage.save(cat.id);
}

// Make sure storage enabled in config
const meowzer = new Meowzer({
  storage: { enabled: true, adapter: "indexeddb" },
});
```

### Cat won't stay in boundaries

**Problem:** Boundaries not set or set after cat creation.

**Solution:**

```typescript
// Set during SDK initialization
const meowzer = new Meowzer({
  behavior: {
    boundaries: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
  },
});

// Or per-cat
cat.setEnvironment({
  boundaries: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
});
```

---

## 🚧 Roadmap

**Current Version:** 1.0.0 (Phase 1 Complete)

**Completed:**

- ✅ Cat creation and management
- ✅ Autonomous AI behaviors
- ✅ IndexedDB persistence
- ✅ Food/water/yarn interactions
- ✅ Laser pointer
- ✅ Lifecycle hooks
- ✅ Plugin system

**Planned:**

- 🔜 Social dynamics (cats interact with each other)
- 🔜 Sound effects (purring, meowing)
- 🔜 Performance mode (handle 50+ cats)
- 🔜 Accessibility features (ARIA labels, reduced motion)
- 🔜 Export/import collections as JSON

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💡 Credits

Built with:

- [GSAP](https://greensock.com/gsap/) - Animation library
- TypeScript
- Love for cats 🐈
