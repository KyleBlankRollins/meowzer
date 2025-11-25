---
title: "MeowzerCat"
description: "Individual cat instance API"
---

The `MeowzerCat` class represents an individual cat instance. It combines animation (Meowtion), AI behavior (MeowBrain), and persistence into a single cohesive API.

Returned by `meowzer.cats.create()` and `meowzer.storage.load()`.

## Properties

### id

```typescript
readonly id: string
```

Unique identifier for this cat.

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.id); // "cat-1732479823-xk9p2"
```

---

### seed

```typescript
readonly seed: string
```

Reproducible seed string for cat appearance. Use this to recreate identical-looking cats.

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.seed); // "tabby-FF9500-00FF00-m-short-v1"

// Later, recreate same appearance
const clone = await meowzer.cats.create({ seed: cat.seed });
```

---

### name

```typescript
readonly name: string | undefined
```

Cat's name (if provided during creation).

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
console.log(cat.name); // "Whiskers"
```

---

### description

```typescript
readonly description: string | undefined
```

Cat's description (if provided during creation).

**Example:**

```javascript
const cat = await meowzer.cats.create({
  name: "Whiskers",
  description: "A friendly orange tabby",
});
console.log(cat.description); // "A friendly orange tabby"
```

---

### element

```typescript
readonly element: HTMLElement
```

The DOM element representing this cat. Useful for direct manipulation or positioning.

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.element.tagName); // "DIV"
console.log(cat.element.className); // "meow-cat"
```

---

### position

```typescript
readonly position: Position
```

Current position of the cat on the page.

**Type:**

```typescript
interface Position {
  x: number; // X coordinate (px)
  y: number; // Y coordinate (px)
}
```

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.position); // { x: 0, y: 0 }
```

---

### state

```typescript
readonly state: CatStateType
```

Current animation/behavior state.

**Type:**

```typescript
type CatStateType =
  | "idle"
  | "walking"
  | "running"
  | "sitting"
  | "sleeping"
  | "playing"
  | "eating"
  | "grooming";
```

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.state); // "idle"

cat.on("stateChanged", (event) => {
  console.log("State changed:", event.newState);
});
```

---

### personality

```typescript
readonly personality: Personality
```

Cat's personality traits (affects behavior).

**Type:**

```typescript
interface Personality {
  energy: number; // 0-1 (low to high activity)
  curiosity: number; // 0-1 (exploration tendency)
  playfulness: number; // 0-1 (toy interest)
  independence: number; // 0-1 (self-sufficiency)
  sociability: number; // 0-1 (interaction responsiveness)
}
```

**Example:**

```javascript
const cat = await meowzer.cats.create({
  personality: {
    energy: 0.8,
    curiosity: 0.6,
    playfulness: 0.9,
    independence: 0.4,
    sociability: 0.7,
  },
});

console.log(cat.personality);
// { energy: 0.8, curiosity: 0.6, ... }
```

---

### isActive

```typescript
readonly isActive: boolean
```

Whether the cat is currently active (running AI and animations).

**Example:**

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears and is active
console.log(cat.isActive); // true

cat.lifecycle.pause();
console.log(cat.isActive); // false
```

---

### metadata

```typescript
readonly metadata: CatMetadata
```

Custom metadata and system timestamps.

**Type:**

```typescript
interface CatMetadata {
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown; // Custom fields
}
```

**Example:**

```javascript
const cat = await meowzer.cats.create({
  metadata: {
    tags: ["playful", "office"],
    adoptedDate: new Date().toISOString(),
  },
});

console.log(cat.metadata.tags); // ["playful", "office"]
console.log(cat.metadata.createdAt); // Date object
```

---

### createdAt

```typescript
readonly createdAt: Date
```

When the cat was created.

**Example:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.createdAt); // Date object
```

---

### updatedAt

```typescript
readonly updatedAt: Date
```

When the cat was last updated.

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
console.log(cat.updatedAt); // Same as createdAt initially

cat.setName("Whiskers Jr.");
console.log(cat.updatedAt); // Updated timestamp
```

## Component Properties

MeowzerCat uses a component-based architecture. Each component handles a specific concern:

### lifecycle

```typescript
readonly lifecycle: CatLifecycle
```

Manages cat lifecycle operations (place, pause, resume, destroy).

**Example:**

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// Pause AI and animations
cat.lifecycle.pause();

// Resume
cat.lifecycle.resume();

// Check if active
console.log(cat.lifecycle.isActive); // false (after pause)

// Destroy cat
cat.lifecycle.destroy();
```

**See [Lifecycle Methods](#lifecycle-methods) below for details.**

---

### persistence

```typescript
readonly persistence: CatPersistence
```

Manages save/load operations and dirty state tracking.

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });

// Save to storage
await cat.persistence.save();

// Check if has unsaved changes
console.log(cat.persistence.isDirty); // false

// Make change
cat.setName("Whiskers Jr.");
console.log(cat.persistence.isDirty); // true

// Delete from storage
await cat.persistence.delete();
```

---

### accessories

```typescript
readonly accessories: CatAccessories
```

Manages cat accessories (hats, etc.).

**Example:**

```javascript
const cat = await meowzer.cats.create();

// Apply hat
cat.accessories.applyHat({
  type: "party",
  color: "#FF0000",
});

// Check current hat
console.log(cat.accessories.currentHat); // { type: "party", ... }

// Remove hat
cat.accessories.removeHat();
```

---

### interactions

```typescript
readonly interactions: CatInteractions
```

Manages cat responses to interactive elements (food, toys, laser).

**Example:**

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// Place food
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Cat will automatically detect and respond if hungry

// Manually trigger response
cat.interactions.respondToNeed(food.id);
```

---

### events

```typescript
readonly events: CatEvents
```

Event system for listening to cat state changes.

**Example:**

```javascript
const cat = await meowzer.cats.create();

// Listen to events
cat.events.on("stateChanged", (event) => {
  console.log("State:", event.newState);
});

cat.events.on("moveEnd", (event) => {
  console.log("Moved to:", event.position);
});
```

## Lifecycle Methods

Methods for managing cat lifecycle. Access via `cat.lifecycle.*`.

### pause()

```typescript
pause(): void
```

Pause the cat's AI and animations. Cat remains visible but stops moving.

**Example:**

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// Pause
cat.lifecycle.pause();
console.log(cat.isActive); // false

// Resume later
cat.lifecycle.resume();
```

---

### resume()

```typescript
resume(): void
```

Resume the cat's AI and animations.

**Example:**

```javascript
// Pause cats when page is hidden
document.addEventListener("visibilitychange", () => {
  const cats = meowzer.cats.getAll();

  if (document.hidden) {
    cats.forEach((cat) => cat.lifecycle.pause());
  } else {
    cats.forEach((cat) => cat.lifecycle.resume());
  }
});
```

---

### destroy()

```typescript
destroy(): void
```

Destroy the cat, stopping all behaviors and removing from DOM.

**Example:**

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// Later, destroy
cat.lifecycle.destroy();

// Cat is now removed from page and memory
console.log(meowzer.cats.has(cat.id)); // false
```

:::note
This only removes from memory. To delete from storage, use `cat.delete()`.
:::

## Configuration Methods

### setName()

```typescript
setName(name: string): void
```

Update cat's name.

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
cat.setName("Whiskers Jr.");
console.log(cat.name); // "Whiskers Jr."
```

---

### setDescription()

```typescript
setDescription(description: string): void
```

Update cat's description.

**Example:**

```javascript
cat.setDescription("A very playful orange tabby");
```

---

### setPersonality()

```typescript
setPersonality(personality: Personality | PersonalityPreset): void
```

Update cat's personality traits.

**Parameters:**

| Name          | Type                               | Description     |
| ------------- | ---------------------------------- | --------------- |
| `personality` | `Personality \| PersonalityPreset` | New personality |

**Presets:** `"playful"`, `"lazy"`, `"curious"`, `"energetic"`, `"calm"`

**Example:**

```javascript
// Use preset
cat.setPersonality("playful");

// Custom traits
cat.setPersonality({
  energy: 0.9,
  curiosity: 0.7,
  playfulness: 0.95,
  independence: 0.3,
  sociability: 0.8,
});
```

---

### updateMetadata()

```typescript
updateMetadata(metadata: Record<string, unknown>): void
```

Merge new metadata with existing metadata.

**Example:**

```javascript
cat.updateMetadata({
  tags: ["office", "playful"],
  favoriteFood: "tuna",
  customField: "value",
});

console.log(cat.metadata.tags); // ["office", "playful"]
```

---

### setEnvironment()

```typescript
setEnvironment(environment: Environment): void
```

Update cat's environmental awareness (affects behavior).

**Type:**

```typescript
interface Environment {
  temperature?: number; // 0-100
  noise?: number; // 0-100
  crowding?: number; // 0-100
}
```

**Example:**

```javascript
cat.setEnvironment({
  temperature: 75,
  noise: 30,
  crowding: 10,
});
```

## Persistence Methods

### save()

```typescript
async save(options?: SaveOptions): Promise<void>
```

Save cat to storage.

**Parameters:**

| Name      | Type          | Optional | Description  |
| --------- | ------------- | -------- | ------------ |
| `options` | `SaveOptions` | Yes      | Save options |

**SaveOptions:**

```typescript
interface SaveOptions {
  collection?: string; // Collection name
}
```

**Example:**

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });

// Save to default collection
await cat.save();

// Save to specific collection
await cat.save({ collection: "favorites" });
```

---

### delete()

```typescript
async delete(): Promise<void>
```

Delete cat from storage and destroy it.

**Example:**

```javascript
await cat.delete();
// Cat removed from storage and destroyed
```

## Interaction Methods

### respondToNeed()

```typescript
async respondToNeed(needId: string): Promise<void>
```

Make cat respond to a placed need (food/water).

**Example:**

```javascript
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Make cat respond
await cat.interactions.respondToNeed(food.id);
```

---

### playWithYarn()

```typescript
async playWithYarn(yarnId: string): Promise<void>
```

Make cat play with yarn.

**Example:**

```javascript
const yarn = await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});

await cat.interactions.playWithYarn(yarn.id);
```

---

### chaseLaser()

```typescript
async chaseLaser(position: Position): Promise<void>
```

Make cat chase laser pointer at position.

**Example:**

```javascript
const laser = meowzer.createLaserPointer();
laser.turnOn({ x: 500, y: 300 });

const cat = meowzer.cats.get("cat-123");
await cat.interactions.chaseLaser({ x: 500, y: 300 });
```

## Events

Listen to cat events using `cat.on()` or `cat.events.on()`.

### on()

```typescript
on(event: MeowzerEventType, handler: EventHandler): void
```

Add event listener.

### off()

```typescript
off(event: MeowzerEventType, handler: EventHandler): void
```

Remove event listener.

### Event Types

| Event          | Description         | Event Data                  |
| -------------- | ------------------- | --------------------------- |
| `stateChanged` | Cat state changed   | `{ newState, oldState }`    |
| `moveStart`    | Cat started moving  | `{ position }`              |
| `moveEnd`      | Cat finished moving | `{ position }`              |
| `boundaryHit`  | Cat hit boundary    | `{ position, boundary }`    |
| `pause`        | Cat was paused      | `{ catId }`                 |
| `resume`       | Cat was resumed     | `{ catId }`                 |
| `destroy`      | Cat was destroyed   | `{ catId }`                 |
| `hat-applied`  | Hat was applied     | `{ hat }`                   |
| `hat-removed`  | Hat was removed     | `{}`                        |
| `hat-updated`  | Hat was updated     | `{ hat }`                   |
| `menuClick`    | Cat was clicked     | `{ id, position, catRect }` |

### Examples

```javascript
const cat = await meowzer.cats.create();
// Cat automatically appears on the page!

// State changes
cat.on("stateChanged", (event) => {
  console.log(`${cat.name} is now ${event.newState}`);
});

// Movement
cat.on("moveStart", (event) => {
  console.log("Started moving to:", event.position);
});

cat.on("moveEnd", (event) => {
  console.log("Finished moving. Now at:", event.position);
});

// Boundaries
cat.on("boundaryHit", (event) => {
  console.log("Hit boundary:", event.boundary);
});

// Lifecycle
cat.on("pause", () => {
  console.log("Cat paused");
});

// Menu clicks
cat.on("menuClick", (event) => {
  console.log("Cat clicked at:", event.position);
  // Show custom menu at event.position
});
```

## Utility Methods

### getBoundaries()

```typescript
getBoundaries(): Boundaries
```

Get current movement boundaries.

**Returns:**

```typescript
interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
```

**Example:**

```javascript
const boundaries = cat.getBoundaries();
console.log(boundaries); // { minX: 0, maxX: 1920, minY: 0, maxY: 1080 }
```

---

### toJSON()

```typescript
toJSON(): CatJSON
```

Convert cat to JSON representation.

**Example:**

```javascript
const json = cat.toJSON();
console.log(json);
// {
//   id: "cat-123",
//   seed: "tabby-FF9500-00FF00-m-short-v1",
//   name: "Whiskers",
//   position: { x: 100, y: 200 },
//   state: "walking",
//   personality: { ... },
//   metadata: { ... }
// }
```

## Complete Example

```javascript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();

// Create cat
const cat = await meowzer.cats.create({
  name: "Whiskers",
  description: "A friendly orange tabby",
  settings: {
    color: "#FF9500",
    pattern: "tabby",
    eyeColor: "#FFD700",
  },
  personality: {
    energy: 0.8,
    playfulness: 0.9,
    sociability: 0.7,
  },
  metadata: {
    tags: ["playful", "friendly"],
  },
});

// Cat automatically appears on the page!

// Listen to events
cat.on("stateChanged", (event) => {
  console.log(`State: ${event.newState}`);
});

cat.on("menuClick", (event) => {
  console.log("Cat clicked!");
});

// Add interaction
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Save cat
await cat.save({ collection: "favorites" });

// Later, pause
cat.lifecycle.pause();

// Resume
cat.lifecycle.resume();

// Cleanup
cat.lifecycle.destroy();
```

## See Also

- [CatManager](/api/managers/cat-manager) - Create and manage cats
- [Meowzer SDK](/api/meowzer-sdk) - Main SDK class
- [Customization Tutorial](/tutorials/customization) - Customize cat appearance
- [Basic Integration](/tutorials/basic-integration) - Get started with cats
