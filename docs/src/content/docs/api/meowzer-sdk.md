---
title: "Meowzer SDK"
description: "Main SDK class and entry point"
---

The `Meowzer` class is the primary entry point for the SDK. It provides a unified interface for creating, managing, and persisting animated cats.

## Constructor

```typescript
new Meowzer(config?: PartialMeowzerConfig)
```

Creates a new Meowzer SDK instance with optional configuration.

### Parameters

| Name     | Type                   | Optional | Description                           |
| -------- | ---------------------- | -------- | ------------------------------------- |
| `config` | `PartialMeowzerConfig` | Yes      | SDK configuration (storage, behavior) |

### Example

```javascript
import { Meowzer } from "meowzer";

// Default configuration
const meowzer = new Meowzer();

// With custom configuration
const meowzer = new Meowzer({
  storage: {
    enabled: true,
    defaultCollection: "my-cats",
  },
  behavior: {
    pauseOnPageHide: true,
  },
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
});
```

## Properties

### cats

```typescript
readonly cats: CatManager
```

Manager for cat lifecycle operations (create, find, destroy).

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
const allCats = meowzer.cats.getAll();
await meowzer.cats.destroy(cat.id);
```

See [CatManager API](/api/managers/cat-manager) for complete documentation.

---

### storage

```typescript
readonly storage: StorageManager
```

Manager for persistence operations (save, load, delete).

**Example:**

```javascript
await meowzer.storage.save(cat.id);
const savedCat = await meowzer.storage.load(cat.id);
const allSavedCats = await meowzer.storage.listCats();
```

See [StorageManager API](/api/managers/storage-manager) for complete documentation.

---

### interactions

```typescript
readonly interactions: InteractionManager
```

Manager for interactive elements (food, toys, laser pointer).

**Example:**

```javascript
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 300,
  y: 400,
});

const yarn = await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});
```

See [InteractionManager API](/api/managers/interaction-manager) for complete documentation.

---

### hooks

```typescript
readonly hooks: HookManager
```

Manager for lifecycle event hooks.

**Example:**

```javascript
meowzer.hooks.on("afterCreate", (context) => {
  console.log("Cat created:", context.cat.id);
});

meowzer.hooks.on("beforeDestroy", (context) => {
  console.log("Cat destroying:", context.catId);
});
```

See [HookManager API](/api/managers/hook-manager) for complete documentation.

---

### plugins

```typescript
readonly plugins: PluginManager
```

Manager for plugin system.

**Example:**

```javascript
await meowzer.plugins.install(analyticsPlugin);
const installed = meowzer.plugins.getInstalled();
```

See [PluginManager API](/api/managers/plugin-manager) for complete documentation.

---

### utils

```typescript
readonly utils: MeowzerUtils
```

Utility functions for cat names and helpers.

**Example:**

```javascript
const name = meowzer.utils.generateCatName();
const randomColor = meowzer.utils.randomColor();
```

## Methods

### init()

```typescript
async init(): Promise<void>
```

Initialize the SDK. **Must be called before using any features.**

This sets up storage connections and prepares the SDK for use. Call this immediately after creating your Meowzer instance.

**Example:**

```javascript
const meowzer = new Meowzer();
await meowzer.init();

// Now ready to create cats
const cat = await meowzer.cats.create();
```

**Throws:**

- `InvalidStateError` - If already initialized

:::caution
Always call `await meowzer.init()` before creating cats or using any SDK features.
:::

---

### isInitialized()

```typescript
isInitialized(): boolean
```

Check if the SDK has been initialized.

**Returns:** `true` if initialized, `false` otherwise

**Example:**

```javascript
const meowzer = new Meowzer();
console.log(meowzer.isInitialized()); // false

await meowzer.init();
console.log(meowzer.isInitialized()); // true
```

---

### getConfig()

```typescript
getConfig(): MeowzerConfig
```

Get the current SDK configuration (read-only).

**Returns:** Complete configuration object

**Example:**

```javascript
const config = meowzer.getConfig();
console.log(config.storage.enabled); // true
console.log(config.storage.defaultCollection); // "my-cats"
console.log(config.boundaries); // { minX: 0, maxX: 1920, ... }
```

---

### configure()

```typescript
configure(config: PartialMeowzerConfig): void
```

Update SDK configuration after initialization.

**Parameters:**

| Name     | Type                   | Description             |
| -------- | ---------------------- | ----------------------- |
| `config` | `PartialMeowzerConfig` | Configuration to update |

**Example:**

```javascript
meowzer.configure({
  storage: {
    autoSave: true,
  },
  behavior: {
    pauseOnPageHide: false,
  },
});
```

:::note
Configuration changes may not apply to already-created cats. Create new cats to use new config.
:::

---

### use()

```typescript
async use(
  plugin: MeowzerPlugin,
  options?: PluginInstallOptions
): Promise<void>
```

Install a plugin. Convenience method for `meowzer.plugins.install()`.

**Parameters:**

| Name      | Type                   | Optional | Description          |
| --------- | ---------------------- | -------- | -------------------- |
| `plugin`  | `MeowzerPlugin`        | No       | Plugin to install    |
| `options` | `PluginInstallOptions` | Yes      | Installation options |

**Example:**

```javascript
await meowzer.use(analyticsPlugin, {
  config: {
    apiKey: "your-key",
  },
});
```

---

### createLaserPointer()

```typescript
createLaserPointer(): LaserPointer
```

Create a laser pointer for cats to chase.

**Returns:** `LaserPointer` instance

**Example:**

```javascript
const laser = meowzer.createLaserPointer();

// Turn on at position
laser.turnOn({ x: 500, y: 300 });

// Move to new position
laser.moveTo({ x: 600, y: 400 });

// Listen to events
laser.on("moved", (event) => {
  console.log("Laser at:", event.position);
});

// Turn off
laser.turnOff();
```

**Follow mouse example:**

```javascript
const laser = meowzer.createLaserPointer();

document.addEventListener("click", (e) => {
  if (!laser.isActive) {
    laser.turnOn({ x: e.clientX, y: e.clientY });
  } else {
    laser.turnOff();
  }
});

document.addEventListener("mousemove", (e) => {
  if (laser.isActive) {
    laser.moveTo({ x: e.clientX, y: e.clientY });
  }
});
```

---

### destroy()

```typescript
async destroy(): Promise<void>
```

Destroy the SDK and clean up all resources.

This will:

- Destroy all cats
- Clean up interactions
- Close storage connections
- Unregister global managers

**Example:**

```javascript
// Clean shutdown
await meowzer.destroy();
```

:::tip
Call this before removing your app to prevent memory leaks.
:::

## Configuration

### MeowzerConfig

Complete configuration interface:

```typescript
interface MeowzerConfig {
  container?: HTMLElement;
  boundaries?: Boundaries;
  storage: StorageConfig;
  behavior: BehaviorConfig;
  interactions: InteractionConfig;
  debug: boolean;
}
```

### StorageConfig

```typescript
interface StorageConfig {
  enabled: boolean; // Whether storage is enabled
  autoSave: boolean; // Whether cats auto-save on changes
  defaultCollection: string; // Default collection name
  cacheSize: number; // Max collections in cache
}
```

**Defaults:**

```javascript
{
  enabled: true,
  autoSave: false,
  defaultCollection: "my-cats",
  cacheSize: 5
}
```

### BehaviorConfig

```typescript
interface BehaviorConfig {
  pauseOnPageHide: boolean; // Pause cats when page hidden
  cleanupOnUnload: boolean; // Cleanup on page unload
}
```

**Defaults:**

```javascript
{
  pauseOnPageHide: true,
  cleanupOnUnload: true
}
```

### InteractionConfig

```typescript
interface InteractionConfig {
  enabled: boolean; // Whether interactions are enabled
  detectionRanges: {
    need: number; // Detection range for food (px)
    laser: number; // Detection range for laser (px)
    rcCar: number; // Detection range for RC car (px)
    yarn: number; // Detection range for yarn (px)
  };
  responseRates: {
    basicFood: number; // Response rate for basic food (0-1)
    fancyFood: number; // Response rate for fancy food (0-1)
    water: number; // Response rate for water (0-1)
  };
}
```

**Defaults:**

```javascript
{
  enabled: true,
  detectionRanges: {
    need: 150,
    laser: 200,
    rcCar: 250,
    yarn: 150
  },
  responseRates: {
    basicFood: 0.7,
    fancyFood: 0.9,
    water: 0.5
  }
}
```

### Boundaries

```typescript
interface Boundaries {
  minX: number; // Minimum X coordinate (px)
  maxX: number; // Maximum X coordinate (px)
  minY: number; // Minimum Y coordinate (px)
  maxY: number; // Maximum Y coordinate (px)
}
```

**Default:** Window dimensions

```javascript
{
  minX: 0,
  maxX: window.innerWidth,
  minY: 0,
  maxY: window.innerHeight
}
```

## Complete Example

```javascript
import { Meowzer } from "meowzer";

// Create instance with configuration
const meowzer = new Meowzer({
  storage: {
    enabled: true,
    defaultCollection: "office-cats",
  },
  behavior: {
    pauseOnPageHide: true,
  },
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
});

// Initialize
await meowzer.init();

// Listen to lifecycle events
meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("New cat!", ctx.cat.name);
});

// Create cats
const cats = await Promise.all([
  meowzer.cats.create({ name: "Whiskers" }),
  meowzer.cats.create({ name: "Mittens" }),
  meowzer.cats.create({ name: "Shadow" }),
]);

// Cats automatically appear on the page!

// Add interaction
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Cleanup on page unload
window.addEventListener("beforeunload", async () => {
  await meowzer.destroy();
});
```

## See Also

- [CatManager](/api/managers/cat-manager) - Create and manage cats
- [MeowzerCat](/api/meowzer-cat) - Individual cat API
- [Getting Started](/getting-started/quick-start) - Quick start guide
- [Configuration Guide](/guides/configuration) - Detailed configuration
