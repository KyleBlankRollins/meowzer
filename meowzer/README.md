# Meowzer

High-level API wrapper for creating, managing, and persisting autonomous cat instances on web pages.

## Overview

Meowzer is the unified interface that combines four underlying libraries into a simple, user-friendly API. It handles the complexity of coordinating Meowkit (cat creation), Meowtion (animation), Meowbrain (AI), and Meowbase (persistence) so that frontend developers can create autonomous cats with minimal code.

**Internal Libraries:**

- **Meowkit** → Creates cat data from settings (seed generation, visual properties)
- **Meowtion** → Renders and animates (low-level animation primitives)
- **Meowbrain** → Makes cats act autonomously (AI decision-making)
- **Meowbase** → Persists cat data in IndexedDB (storage layer)

**Goal:** Programmatically create cat sprites that move autonomously around a web page, with the ability to save and load cat state across sessions, all with zero external dependencies.

## Core Concepts

### MeowzerCat (Public Interface)

The main object returned by Meowzer - combines Cat and Brain:

```typescript
interface MeowzerCat {
  id: string; // Unique identifier
  name: string; // User-assigned name
  seed: string; // Cat seed (for recreation/sharing)
  element: HTMLElement; // DOM element containing the cat

  // Metadata (persisted by Meowbase)
  birthday: Date; // When the cat was created
  image: string; // Data URL of cat sprite snapshot
  description: string; // User-provided description
  favoriteToy?: Toy; // Optional favorite toy
  currentEmotion?: Emotion; // Current emotional state
  importantHumans?: Human[]; // Registered humans

  // State (read-only)
  readonly position: Position;
  readonly state: CatStateType;
  readonly personality: Personality;
  readonly isActive: boolean;

  // Lifecycle
  pause(): void; // Pause autonomous behavior
  resume(): void; // Resume autonomous behavior
  destroy(): void; // Remove cat completely
  save(): Promise<void>; // Save to Meowbase

  // Configuration
  setPersonality(personality: Personality | PersonalityPreset): void;
  setEnvironment(environment: Environment): void;
  setName(name: string): void;
  setDescription(description: string): void;

  // Events
  on(event: MeowzerEvent, handler: EventHandler): void;
  off(event: MeowzerEvent, handler: EventHandler): void;
}

type MeowzerEvent =
  | "behaviorChange"
  | "stateChange"
  | "pause"
  | "resume"
  | "destroy";
```

### CatSettings (Input)

User-defined settings for cat appearance:

```typescript
interface CatSettings {
  color: string; // Primary fur color (hex or named color)
  eyeColor: string; // Eye color (hex or named color)
  pattern: CatPattern; // Fur pattern type
  size: CatSize; // Overall size category
  furLength: FurLength; // Fur length style
}

type CatPattern = "solid" | "tabby" | "calico" | "tuxedo" | "spotted";
type CatSize = "small" | "medium" | "large";
type FurLength = "short" | "medium" | "long";
```

### MeowzerOptions (Configuration)

Options for creating cats:

```typescript
interface MeowzerOptions {
  container?: HTMLElement; // Where to append cat (default: document.body)
  position?: Position; // Starting position (default: random)
  personality?: Personality | PersonalityPreset; // Behavior traits (default: 'balanced')
  boundaries?: Boundaries; // Movement constraints (default: viewport)
  environment?: Environment; // Obstacles, attractors, etc.
  autoStart?: boolean; // Start autonomous behavior immediately (default: true)

  // Metadata (for persistence)
  name?: string; // Name for the cat (default: random name)
  description?: string; // Description (default: '')
  collectionId?: string; // Collection to add cat to (optional)
}
```

### Supporting Types (from Meowbase)

```typescript
interface Toy {
  id: string;
  name: string;
  image: string;
  type: string;
  description: string;
}

interface Human {
  id: string;
  name: string;
  isFoodGiver: boolean;
  isScary: boolean;
}

interface Emotion {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  children: MeowzerCat[];
}
```

## Public API

### Creating Cats

#### Create from Settings

```typescript
/**
 * Creates a new autonomous cat from user-defined settings
 */
function createCat(
  settings: CatSettings,
  options?: MeowzerOptions
): MeowzerCat;

// Example
const cat = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  {
    personality: "playful",
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  }
);
```

#### Create from Seed

```typescript
/**
 * Creates a cat from a seed string (for recreating or sharing cats)
 */
function createCatFromSeed(
  seed: string,
  options?: MeowzerOptions
): MeowzerCat;

// Example
const cat = createCatFromSeed("tabby-FF9500-00FF00-m-short-v1", {
  personality: "curious",
  position: { x: 100, y: 100 },
});
```

#### Create Random Cat

```typescript
/**
 * Generates a random cat with random appearance and personality
 */
function createRandomCat(options?: MeowzerOptions): MeowzerCat;

// Example
const randomCat = createRandomCat({
  container: document.getElementById("playground"),
});
```

### Managing Cats

#### Get All Active Cats

```typescript
/**
 * Returns an array of all currently active cats
 */
function getAllCats(): MeowzerCat[];

// Example
const allCats = getAllCats();
console.log(`There are ${allCats.length} cats on the page`);
```

#### Get Cat by ID

```typescript
/**
 * Retrieves a specific cat by its unique ID
 */
function getCatById(id: string): MeowzerCat | null;

// Example
const cat = getCatById("cat-abc123");
if (cat) {
  cat.pause();
}
```

#### Destroy All Cats

```typescript
/**
 * Removes all cats from the page and cleans up resources
 */
function destroyAllCats(): void;

// Example
destroyAllCats(); // Clean slate
```

### Persistence (Meowbase Integration)

#### Save Cat

```typescript
/**
 * Saves a cat to Meowbase (IndexedDB)
 * Automatically called when cat properties change if auto-save is enabled
 */
async function saveCat(cat: MeowzerCat): Promise<void>;

// Example
const cat = createCat({
  color: "#FF9500",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
});
cat.setName("Whiskers");
await saveCat(cat);
```

#### Load Cat

```typescript
/**
 * Loads a previously saved cat from Meowbase and recreates it
 */
async function loadCat(
  id: string,
  options?: MeowzerOptions
): Promise<MeowzerCat>;

// Example
const savedCat = await loadCat("cat-abc123", {
  container: document.getElementById("playground"),
  autoStart: true,
});
```

#### Load All Cats

```typescript
/**
 * Loads all saved cats from Meowbase
 */
async function loadAllCats(
  options?: MeowzerOptions
): Promise<MeowzerCat[]>;

// Example
const allSavedCats = await loadAllCats({ autoStart: false });
console.log(`Loaded ${allSavedCats.length} cats`);
```

#### Delete Cat from Storage

```typescript
/**
 * Removes a cat from Meowbase storage (does not destroy active instance)
 */
async function deleteCat(id: string): Promise<void>;

// Example
await deleteCat("cat-abc123");
```

### Collections (Meowbase)

#### Create Collection

```typescript
/**
 * Creates a new collection to organize cats
 */
async function createCollection(name: string): Promise<Collection>;

// Example
const familyCats = await createCollection("Family Cats");
```

#### Add Cat to Collection

```typescript
/**
 * Adds a cat to a collection
 */
async function addCatToCollection(
  catId: string,
  collectionId: string
): Promise<void>;

// Example
await addCatToCollection("cat-abc123", "collection-xyz");
```

#### Get Collection

```typescript
/**
 * Retrieves a collection and all its cats
 */
async function getCollection(id: string): Promise<Collection>;

// Example
const collection = await getCollection("collection-xyz");
console.log(`Collection has ${collection.children.length} cats`);
```

#### Load Collection

```typescript
/**
 * Loads all cats from a collection and creates active instances
 */
async function loadCollection(
  id: string,
  options?: MeowzerOptions
): Promise<MeowzerCat[]>;

// Example
const cats = await loadCollection("collection-xyz", {
  autoStart: true,
});
```

### Global Configuration

#### Set Default Boundaries

```typescript
/**
 * Sets default boundaries for all new cats
 */
function setDefaultBoundaries(boundaries: Boundaries): void;

// Example
setDefaultBoundaries({
  minX: 0,
  maxX: window.innerWidth,
  minY: 0,
  maxY: window.innerHeight,
});

// Update on window resize
window.addEventListener("resize", () => {
  setDefaultBoundaries({
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  });
});
```

#### Set Default Container

```typescript
/**
 * Sets default container element for all new cats
 */
function setDefaultContainer(container: HTMLElement): void;

// Example
setDefaultContainer(document.getElementById("cat-playground"));
```

### Utilities

#### Pause All Cats

```typescript
/**
 * Pauses autonomous behavior for all cats
 */
function pauseAllCats(): void;
```

#### Resume All Cats

```typescript
/**
 * Resumes autonomous behavior for all cats
 */
function resumeAllCats(): void;
```

#### Get Random Settings

```typescript
/**
 * Generates random CatSettings (useful for cat generators)
 */
function getRandomSettings(): CatSettings;

// Example
const settings = getRandomSettings();
// Returns: { color: '#A52A2A', eyeColor: '#FFD700', pattern: 'calico', ... }
```

#### Validate Settings

```typescript
/**
 * Validates CatSettings object
 */
function validateSettings(settings: CatSettings): ValidationResult;

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Example
const result = validateSettings({
  color: "not-a-color",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
});
// Returns: { valid: false, errors: ['Invalid color format'] }
```

### Personality Presets

```typescript
/**
 * Get available personality presets
 */
function getPersonalityPresets(): PersonalityPreset[];
// Returns: ['lazy', 'playful', 'curious', 'aloof', 'energetic', 'balanced']

/**
 * Get full personality configuration for a preset
 */
function getPersonalityConfig(preset: PersonalityPreset): Personality;

// Example
const playfulConfig = getPersonalityConfig("playful");
// Returns: { energy: 0.9, curiosity: 0.7, playfulness: 0.95, ... }
```

## Usage Examples

### Simple - One Random Cat

```typescript
import { createRandomCat } from "meowzer";

const cat = createRandomCat({ name: "Mittens" });
// Cat appears and starts wandering around
```

### Create and Save Cat

```typescript
import { createCat, saveCat } from "meowzer";

const cat = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  {
    name: "Whiskers",
    description: "A playful orange tabby",
    personality: "playful",
  }
);

// Save to IndexedDB
await saveCat(cat);
console.log(`Saved cat with ID: ${cat.id}`);
```

### Load Saved Cat

```typescript
import { loadCat } from "meowzer";

// On next page load
const cat = await loadCat("cat-abc123", {
  container: document.getElementById("playground"),
  autoStart: true,
});

console.log(`Loaded ${cat.name}`);
```

### Custom Cat with Specific Appearance

```typescript
import { createCat } from "meowzer";

const orangeTabby = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  {
    personality: "curious",
    position: { x: 200, y: 200 },
  }
);
```

### Recreate Cat from Seed (Sharing)

```typescript
import { createCatFromSeed } from "meowzer";

// User shares this code with someone
const sharedSeed = "tabby-FF9500-00FF00-m-short-v1";

// Another user creates the same cat
const cat = createCatFromSeed(sharedSeed, {
  personality: "playful",
});
```

### Multiple Cats with Different Personalities

```typescript
import { createRandomCat } from "meowzer";

const personalities = ["lazy", "playful", "curious", "energetic"];

personalities.forEach((personality) => {
  createRandomCat({ personality });
});

// Four cats with different behaviors now on screen
```

### Managing Cats

```typescript
import {
  createCat,
  getAllCats,
  pauseAllCats,
  resumeAllCats,
} from "meowzer";

// Create some cats
createCat({
  color: "#FF9500",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
});
createCat({
  color: "#000000",
  eyeColor: "#0000FF",
  pattern: "tuxedo",
  size: "large",
  furLength: "short",
});

// Get info about all cats
const allCats = getAllCats();
console.log(`Active cats: ${allCats.length}`);

// Pause all when user navigates away
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseAllCats();
  } else {
    resumeAllCats();
  }
});
```

### With Event Listeners

```typescript
import { createCat } from "meowzer";

const cat = createCat({
  color: "#A52A2A",
  eyeColor: "#FFD700",
  pattern: "calico",
  size: "small",
  furLength: "long",
});

cat.on("behaviorChange", (event) => {
  console.log(`Cat is now ${event.behavior}`);
});

cat.on("stateChange", (event) => {
  console.log(`Animation state: ${event.state}`);
});
```

### Dynamic Boundaries (Responsive)

```typescript
import { createCat, setDefaultBoundaries } from "meowzer";

// Set initial boundaries
setDefaultBoundaries({
  minX: 0,
  maxX: window.innerWidth,
  minY: 0,
  maxY: window.innerHeight,
});

// Create cats
const cat1 = createCat({
  color: "#FF9500",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
});
const cat2 = createCat({
  color: "#FFFFFF",
  eyeColor: "#0000FF",
  pattern: "calico",
  size: "small",
  furLength: "long",
});

// Update boundaries on resize
window.addEventListener("resize", () => {
  const newBoundaries = {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  };

  setDefaultBoundaries(newBoundaries);

  // Update existing cats
  cat1.setEnvironment({ boundaries: newBoundaries });
  cat2.setEnvironment({ boundaries: newBoundaries });
});
```

### Cat Generator UI

```typescript
import {
  getRandomSettings,
  createCat,
  validateSettings,
  saveCat,
} from "meowzer";

document
  .getElementById("generate-btn")
  .addEventListener("click", async () => {
    const settings = getRandomSettings();
    const name = prompt("What's your cat's name?") || "Unnamed Cat";

    const cat = createCat(settings, {
      personality: "balanced",
      name,
      description: "A randomly generated cat",
    });

    // Save to storage
    await saveCat(cat);

    // Display the seed so user can share
    document.getElementById("cat-code").textContent = cat.seed;
    document.getElementById("cat-id").textContent = cat.id;
  });

document
  .getElementById("create-btn")
  .addEventListener("click", async () => {
    const userSettings = {
      color: document.getElementById("color-input").value,
      eyeColor: document.getElementById("eye-color-input").value,
      pattern: document.getElementById("pattern-select").value,
      size: document.getElementById("size-select").value,
      furLength: document.getElementById("fur-length-select").value,
    };

    const validation = validateSettings(userSettings);
    if (validation.valid) {
      const name = document.getElementById("name-input").value;
      const cat = createCat(userSettings, { name });
      await saveCat(cat);
    } else {
      alert(validation.errors.join("\n"));
    }
  });
```

### Working with Collections

```typescript
import {
  createCollection,
  createCat,
  addCatToCollection,
  loadCollection,
  saveCat,
} from "meowzer";

// Create a collection
const familyCats = await createCollection("Family Cats");

// Create and save cats to the collection
const cat1 = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  { name: "Whiskers", collectionId: familyCats.id }
);
await saveCat(cat1);

const cat2 = createCat(
  {
    color: "#000000",
    eyeColor: "#0000FF",
    pattern: "tuxedo",
    size: "large",
    furLength: "short",
  },
  { name: "Shadow", collectionId: familyCats.id }
);
await saveCat(cat2);

// Later, load all cats from the collection
const cats = await loadCollection(familyCats.id, { autoStart: true });
console.log(`Loaded ${cats.length} cats from collection`);
```

### Auto-Save on Changes

```typescript
import { createCat } from "meowzer";

const cat = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  { name: "Whiskers" }
);

// Changes are automatically saved
cat.setName("Mr. Whiskers");
cat.setDescription("The most distinguished gentleman cat");

// Manual save if needed
await cat.save();
```

## Implementation Considerations

### Initialization

Meowzer automatically initializes on import and sets up:

- Default boundaries (viewport size)
- Default container (document.body)
- Internal cat registry
- Meowbase connection (IndexedDB)
- Global event listeners for cleanup

### Cat Registry

Internally maintains a registry of all active cats:

- Tracks cat instances by ID
- Syncs with Meowbase storage layer
- Automatically cleans up destroyed cats
- Provides efficient lookup for management functions
- Handles auto-save when properties change

### Resource Management

- Automatically pauses cats when page is hidden (via Page Visibility API)
- Cleans up event listeners when cats are destroyed
- Manages memory efficiently for multiple cats
- Automatically saves cat state before page unload
- Uses IndexedDB for persistent storage (via Meowbase)
- Handles cache management for large collections

### Error Handling

```typescript
// Meowzer methods throw descriptive errors
try {
  createCatFromSeed("invalid-seed-format");
} catch (error) {
  console.error("Failed to create cat:", error.message);
}
```

### Zero Dependencies

Like all Meowzer libraries:

- No external dependencies
- Pure JavaScript/TypeScript
- Works in all modern browsers

## TypeScript Support

Meowzer is written in TypeScript with full type definitions:

```typescript
import type {
  MeowzerCat,
  CatSettings,
  MeowzerOptions,
  Personality,
  PersonalityPreset,
} from "meowzer";

const settings: CatSettings = {
  color: "#FF9500",
  eyeColor: "#00FF00",
  pattern: "tabby",
  size: "medium",
  furLength: "short",
};

const cat: MeowzerCat = createCat(settings);
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Requires: ES6+, Promises, RequestAnimationFrame

## Library Integration

Meowzer coordinates all four libraries:

```
┌─────────────────────--------────────────────────┐
│              MEOWZER                            │
│        (Public API Layer)                       │
└─────────────────────--------────────────────────┘
     │             │            │           │
     ▼             ▼            ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ MEOWKIT  │ │ MEOWTION │ │ MEOWBRAIN│ │ MEOWBASE │
│  (Data)  │ │(Animation)│ │   (AI)   │ │(Storage) │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
      │            │             │            │
      └────────────┴─────────────┴────────────┘
                    │
              MeowzerCat
              (Unified Type)
```

**Data Flow:**

1. User calls `createCat(settings)` → **Meowkit** generates ProtoCat from settings
2. Meowkit output → **Meowtion** creates animated Cat instance
3. Cat instance → **Meowbrain** adds autonomous behavior
4. Complete MeowzerCat → **Meowbase** persists to IndexedDB
5. On reload: **Meowbase** → Meowkit → Meowtion → Meowbrain → Active cat

**Shared Type:** All libraries work with the same `MeowzerCat` type, which combines:

- Visual properties (Meowkit)
- Animation state (Meowtion)
- Personality/behavior (Meowbrain)
- Metadata/persistence (Meowbase)

## Future Enhancements

- **Custom behaviors**: Plugin system for user-defined AI behaviors
- **Performance mode**: Optimize for many cats (>20)
- **Social dynamics**: Cats interact with each other
- **Debug mode**: Visual overlay showing AI decision-making
- **Sound effects**: Optional audio for purring, meowing
- **Accessibility**: ARIA labels, reduced motion support
- **Import/Export**: Share entire collections as JSON
