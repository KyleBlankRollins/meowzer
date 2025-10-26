# Meowzer SDK Proposal: Unified Public API

**Date**: October 25, 2025  
**Status**: Proposal  
**Author**: Analysis of current codebase

## Executive Summary

The current Meowzer API exposes too much internal complexity, requiring users to understand the architecture of four separate libraries (Meowkit, Meowtion, Meowbrain, Meowbase) and their interactions. This proposal outlines a comprehensive redesign to create a true SDK with an ergonomic, unified API that abstracts implementation details while maintaining flexibility for advanced use cases.

---

## Current State Analysis

### Problems with Current API

#### 1. **Leaky Abstractions**

Users must understand internal library structure:

```typescript
// Current: Users need to know about Meowkit, Meowbase internals
import {
  createCat,              // Meowzer
  buildCatFromSeed,       // Meowkit
  initializeDatabase,     // Database layer
  getDatabase,            // Database layer
  type Meowbase,          // Database types
  type Cat                // Meowbase types (conflicts with Meowtion Cat)
} from "meowzer";

// Confusing: "Cat" means different things in different contexts
const meowzerCat = createCat(settings);  // Returns MeowzerCat
const dbCat: Cat = { ... };              // Meowbase Cat type
const internalCat = meowzerCat._internalCat; // Meowtion Cat
```

#### 2. **No High-Level Persistence API**

Users must manually orchestrate multi-step database operations:

```typescript
// Current: 12 lines of complex code to save a cat
await initializeDatabase();
const db = getDatabase();
await db.createCollection("my-cats");
await db.loadCollection("my-cats");
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: cat.name,
  image: cat.seed,
  birthday: new Date(),
  // ... manual field mapping
});
await db.saveCollection("my-cats");

// Desired: 1 line
await meowzer.cats.save(cat, { collection: "my-cats" });
```

#### 3. **Inconsistent API Surface**

Mix of functions, classes, and singleton patterns:

```typescript
// Functions for creation
createCat(settings);
createCatFromSeed(seed);
createRandomCat();

// Functions for management
getAllCats();
getCatById(id);
destroyAllCats();

// Class for database
const db = new Meowbase();
await db.initialize();

// Singleton for database
await initializeDatabase();
const db = getDatabase();

// Instance methods on MeowzerCat
cat.pause();
cat.resume();
cat.destroy();
```

#### 4. **Missing Essential Methods**

MeowzerCat lacks basic operations:

```typescript
// Not available
cat.setName(name); // ❌ Can only set during creation
cat.setDescription(desc); // ❌ Doesn't exist
cat.save(); // ❌ No instance method
cat.metadata; // ❌ No access to metadata
cat.getBoundaries(); // ❌ Boundaries are hidden
cat.updateBoundaries(b); // ❌ Read-only
```

#### 5. **Complex Type Exports**

Too many types exposed to users:

```typescript
export type { ProtoCat } from "../types.js";
export type { MeowzerCat } from "./meowzer-cat.js";
export type {
  Cat,
  Collection,
  MeowbaseConfig,
  MeowbaseResult,
} from "../meowbase/types.js";
export type { IStorageAdapter } from "../meowbase/storage/adapter-interface.js";

// Users shouldn't need to know about:
// - ProtoCat (internal Meowkit type)
// - IStorageAdapter (internal storage abstraction)
// - MeowbaseResult (Result pattern should be abstracted)
```

#### 6. **No SDK-Level Features**

Missing modern SDK conveniences:

- No centralized configuration
- No plugin/middleware system
- No lifecycle hooks
- No error handling strategy
- No batch operations
- No transaction support
- No migration helpers
- No validation helpers
- No TypeScript utilities

---

## Proposed Solution: Meowzer SDK

### Design Principles

1. **Progressive Disclosure**: Simple for common tasks, powerful when needed
2. **Single Entry Point**: One import, consistent API surface
3. **Type-Safe by Default**: Excellent TypeScript experience
4. **Error Handling**: Consistent error handling (no Result pattern exposure)
5. **Sensible Defaults**: Zero config for 80% of use cases
6. **Escape Hatches**: Advanced users can access lower-level APIs when needed

### SDK Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Meowzer SDK                          │
│  Single unified API with namespaces and manager classes │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐
│ Cat Manager  │  │ Storage Manager │  │   Config   │
│              │  │                 │  │            │
│ - create()   │  │ - save()        │  │ - defaults │
│ - get()      │  │ - load()        │  │ - plugins  │
│ - find()     │  │ - delete()      │  │ - hooks    │
│ - destroy()  │  │ - collections   │  │            │
└──────────────┘  └─────────────────┘  └────────────┘
        │                  │
        └────────┬─────────┘
                 │
    ┌────────────▼──────────────┐
    │   Internal Libraries      │
    │ (Hidden Implementation)   │
    │                           │
    │ - Meowkit (cat creation)  │
    │ - Meowtion (animation)    │
    │ - Meowbrain (AI)          │
    │ - Meowbase (storage)      │
    └───────────────────────────┘
```

---

## Detailed API Design

### 1. SDK Initialization & Configuration

```typescript
import { Meowzer } from "meowzer";

// Simple: Auto-initialize with defaults
const meowzer = new Meowzer();
await meowzer.ready(); // Ensures database is initialized

// Advanced: Custom configuration
const meowzer = new Meowzer({
  container: document.getElementById("cat-playground"),
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
  storage: {
    enabled: true,
    autoSave: false,
    defaultCollection: "my-cats",
    cacheSize: 10,
  },
  behavior: {
    pauseOnPageHide: true,
    cleanupOnUnload: true,
  },
  debug: false,
});

// Check initialization status
if (meowzer.isReady) {
  // SDK is ready
}
```

### 2. Cat Manager API

#### Creating Cats

```typescript
// Simple random cat
const cat = await meowzer.cats.create();

// Custom appearance
const cat = await meowzer.cats.create({
  appearance: {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  name: "Whiskers",
  personality: "playful",
  autoStart: true,
});

// From seed
const cat = await meowzer.cats.createFromSeed(
  "tabby-FF9500-00FF00-m-short-v1",
  {
    name: "Cloned Cat",
  }
);

// Batch create
const cats = await meowzer.cats.createMany([
  { appearance: settings1, personality: "lazy" },
  { appearance: settings2, personality: "energetic" },
]);
```

#### Managing Cats

```typescript
// Get cats
const allCats = meowzer.cats.getAll();
const cat = meowzer.cats.getById("cat-123");
const cats = meowzer.cats.find({ personality: "playful" });
const activeCats = meowzer.cats.find({ isActive: true });

// Update cat
cat.setName("New Name");
cat.setDescription("A friendly cat");
cat.setPersonality("curious");
cat.updateMetadata({ favorite: true });

// Control behavior
cat.pause();
cat.resume();
cat.destroy();

// Access state
cat.id; // string
cat.seed; // string
cat.name; // string | undefined
cat.description; // string | undefined
cat.position; // Position
cat.state; // CatStateType
cat.personality; // Personality
cat.isActive; // boolean
cat.metadata; // CatMetadata (extensible)
cat.element; // HTMLElement

// Batch operations
meowzer.cats.pauseAll();
meowzer.cats.resumeAll();
meowzer.cats.destroyAll();
meowzer.cats.destroyMany(["cat-1", "cat-2"]);
```

#### Events

```typescript
// Per-cat events
cat.on("behaviorChange", (data) => {
  console.log(`Cat ${cat.name} is now ${data.behavior}`);
});

cat.on("stateChange", (data) => {
  console.log(`Animation state: ${data.state}`);
});

cat.on("move", (data) => {
  console.log(`Position: ${data.position.x}, ${data.position.y}`);
});

// Global cat events
meowzer.cats.on("created", (cat) => {
  console.log(`New cat: ${cat.name}`);
});

meowzer.cats.on("destroyed", (catId) => {
  console.log(`Cat ${catId} was destroyed`);
});
```

### 3. Storage Manager API

#### Saving & Loading

```typescript
// Save individual cat (simple)
await cat.save();

// Save with options
await cat.save({ collection: "favorites" });

// Save via manager
await meowzer.storage.saveCat(cat);
await meowzer.storage.saveCat(cat, { collection: "my-cats" });

// Save multiple cats
await meowzer.storage.saveMany([cat1, cat2, cat3], {
  collection: "family-cats",
});

// Save all active cats
await meowzer.storage.saveAll();

// Load cat by ID
const cat = await meowzer.storage.loadCat("cat-123", {
  autoStart: true,
  container: document.body,
});

// Load all from collection
const cats = await meowzer.storage.loadCollection("my-cats");

// Load with filters
const cats = await meowzer.storage.loadCollection("my-cats", {
  filter: (cat) => cat.metadata?.favorite === true,
  limit: 10,
});

// Delete
await cat.delete();
await meowzer.storage.deleteCat("cat-123");
await meowzer.storage.deleteMany(["cat-1", "cat-2"]);
```

#### Collections

```typescript
// Create collection
const collection = await meowzer.storage.collections.create(
  "My Cats"
);

// List collections
const collections = await meowzer.storage.collections.list();

// Get collection info
const info = await meowzer.storage.collections.get("my-cats");
console.log(info.name, info.catCount, info.createdAt);

// Delete collection
await meowzer.storage.collections.delete("my-cats");

// Rename collection
await meowzer.storage.collections.rename("old-name", "new-name");

// Move cat between collections
await meowzer.storage.collections.moveCat(
  "cat-123",
  "from-collection",
  "to-collection"
);

// Export/Import
const exported = await meowzer.storage.collections.export("my-cats");
await meowzer.storage.collections.import(exported);

// Sample data
await meowzer.storage.loadSampleData();
```

#### Transaction Support

```typescript
// Transaction for atomic operations
await meowzer.storage.transaction(async (tx) => {
  await tx.saveCat(cat1);
  await tx.saveCat(cat2);
  await tx.deleteCollection("old-cats");
  // All-or-nothing: if any fails, all rollback
});
```

### 4. Configuration & Utilities

```typescript
// Update defaults
meowzer.config.setDefaults({
  container: document.getElementById("new-container"),
  boundaries: { ... },
});

meowzer.config.setStorageDefaults({
  autoSave: true,
  defaultCollection: "favorites",
});

// Get current config
const config = meowzer.config.get();

// Utilities
meowzer.utils.validateSettings(settings);
meowzer.utils.generateRandomSettings();
meowzer.utils.parseSeed(seed);
meowzer.utils.getPersonalityPresets();
meowzer.utils.getViewportBoundaries();

// Version info
meowzer.version; // "2.0.0"
meowzer.versions; // { meowkit: "1.0.0", meowtion: "1.0.0", ... }
```

### 5. Lifecycle Hooks & Plugins

```typescript
// Lifecycle hooks
meowzer.hooks.beforeCreate((settings) => {
  console.log("Creating cat with", settings);
  // Can modify settings
  return settings;
});

meowzer.hooks.afterCreate((cat) => {
  console.log("Created:", cat.id);
});

meowzer.hooks.beforeSave(async (cat) => {
  // Add timestamp
  cat.updateMetadata({ lastSaved: new Date() });
});

meowzer.hooks.afterLoad((cat) => {
  console.log("Loaded:", cat.name);
});

// Plugin system
const analyticsPlugin = {
  name: "analytics",
  install(meowzer) {
    meowzer.hooks.afterCreate((cat) => {
      analytics.track("cat_created", { id: cat.id });
    });
  },
};

meowzer.use(analyticsPlugin);
```

### 6. Advanced: Direct Library Access

```typescript
// For advanced users who need low-level control
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();

// Access internal libraries (escape hatch)
meowzer.internal.meowkit.buildCat(settings);
meowzer.internal.meowbase.loadCollection("name");

// Or import directly (advanced use)
import {
  Meowkit,
  Meowtion,
  Meowbrain,
  Meowbase,
} from "meowzer/internal";
```

---

## Enhanced MeowzerCat Interface

```typescript
interface MeowzerCat {
  // Identity
  readonly id: string;
  readonly seed: string;

  // Metadata (mutable)
  name: string | undefined;
  description: string | undefined;
  metadata: Record<string, any>; // Extensible metadata

  // State (read-only)
  readonly position: Position;
  readonly state: CatStateType;
  readonly personality: Personality;
  readonly isActive: boolean;
  readonly element: HTMLElement;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // Configuration
  setName(name: string): void;
  setDescription(description: string): void;
  setPersonality(personality: Personality | PersonalityPreset): void;
  setEnvironment(environment: Environment): void;
  updateMetadata(metadata: Record<string, any>): void;

  // Lifecycle
  pause(): void;
  resume(): void;
  destroy(): void;

  // Persistence
  save(options?: SaveOptions): Promise<void>;
  delete(): Promise<void>;

  // Events
  on(event: MeowzerEvent, handler: EventHandler): void;
  off(event: MeowzerEvent, handler: EventHandler): void;
  once(event: MeowzerEvent, handler: EventHandler): void;

  // Utilities
  clone(): Promise<MeowzerCat>;
  toJSON(): CatJSON;
  getBoundaries(): Boundaries;
}

interface SaveOptions {
  collection?: string;
  metadata?: Record<string, any>;
}
```

---

## Error Handling Strategy

### Consistent Error Handling

```typescript
// No more Result pattern in public API
// Use standard try/catch

try {
  const cat = await meowzer.cats.create(settings);
  await cat.save();
} catch (error) {
  if (error instanceof MeowzerError) {
    switch (error.code) {
      case "INVALID_SETTINGS":
        console.error("Invalid cat settings:", error.details);
        break;
      case "STORAGE_ERROR":
        console.error("Failed to save:", error.message);
        break;
      case "NOT_FOUND":
        console.error("Cat not found:", error.details);
        break;
    }
  }
}

// Error types
class MeowzerError extends Error {
  code: ErrorCode;
  details?: any;
}

type ErrorCode =
  | "INVALID_SETTINGS"
  | "STORAGE_ERROR"
  | "NOT_FOUND"
  | "INITIALIZATION_ERROR"
  | "VALIDATION_ERROR"
  | "COLLECTION_ERROR";
```

---

## Type System Improvements

### Simplified Type Exports

```typescript
// Public types (what users need)
export type {
  // Core
  MeowzerCat,

  // Settings
  CatSettings,
  CatAppearance,
  Personality,
  PersonalityPreset,

  // Configuration
  MeowzerConfig,
  StorageConfig,

  // Metadata
  CatMetadata,
  CollectionInfo,

  // Utilities
  Position,
  Boundaries,
  Environment,

  // Events
  MeowzerEvent,
  EventHandler,

  // Enums
  CatPattern,
  CatSize,
  FurLength,
  CatStateType,
  BehaviorType,
};

// Internal types (not exported to users)
// - ProtoCat
// - IStorageAdapter
// - MeowbaseResult
// - Cat (Meowtion)
// - Brain
```

### Enhanced TypeScript Experience

```typescript
// Generic type helpers
type CreateOptions<T extends Partial<CatSettings>> = T & {
  name?: string;
  personality?: PersonalityPreset | Personality;
  autoStart?: boolean;
};

// Fluent API with type inference
const cat = await meowzer.cats
  .create()
  .withAppearance({ color: "orange" })
  .withPersonality("playful")
  .withName("Fluffy")
  .build();

// Type-safe metadata
interface MyCatMetadata {
  favorite: boolean;
  tags: string[];
  rating: number;
}

const cat = await meowzer.cats.create<MyCatMetadata>({
  metadata: {
    favorite: true,
    tags: ["cute", "playful"],
    rating: 5,
  },
});

// Type-safe
cat.metadata.favorite; // boolean
cat.metadata.tags; // string[]
```

---

## Implementation Plan

### Milestone 1: Core SDK Structure (2 weeks)

- [ ] Create `Meowzer` class with configuration system
- [ ] Implement `CatManager` class
- [ ] Enhanced `MeowzerCat` interface with full CRUD methods
- [ ] Error handling system (MeowzerError classes)
- [ ] Global event emitter for SDK-level events

### Milestone 2: Storage Manager (2 weeks)

- [ ] Create `StorageManager` class
- [ ] Wrap Meowbase with ergonomic API
- [ ] Implement `cat.save()` and `cat.delete()` methods
- [ ] Collection operations (create, list, rename, export/import)
- [ ] Transaction support for atomic operations

### Milestone 3: Advanced Features (2 weeks)

- [ ] Lifecycle hooks system (beforeCreate, afterCreate, beforeSave, afterLoad)
- [ ] Plugin architecture with `meowzer.use(plugin)`
- [ ] Batch operations (createMany, saveMany, destroyMany)
- [ ] Type system improvements (generic metadata, fluent builders)
- [ ] Utility methods namespace

### Milestone 4: Testing & Documentation (2 weeks)

- [ ] Unit tests for all SDK APIs (>90% coverage)
- [ ] Integration tests for complete workflows
- [ ] Comprehensive SDK documentation
- [ ] API reference with examples
- [ ] Getting started guide
- [ ] Example projects (basic, intermediate, advanced)

### Milestone 5: Polish & Release (1 week)

- [ ] Performance optimization
- [ ] Bundle size optimization (tree-shaking)
- [ ] Final API review
- [ ] Release v1.0.0

**Total Estimated Time**: 9 weeks

---

## Success Metrics

### Developer Experience

- **Time to first cat**: < 3 minutes
- **Lines of code for common tasks**: 70% reduction vs current API
- **API discoverability**: Full IDE autocomplete support
- **Error debugging**: Clear error messages with actionable suggestions
- **Learning curve**: < 30 minutes to productive use

### Code Examples

#### Before (Current API)

```typescript
// 25+ lines for common task
import {
  createCat,
  initializeDatabase,
  getDatabase,
  type Meowbase,
} from "meowzer";

await initializeDatabase();
const db = getDatabase();

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

await db.createCollection("my-cats");
await db.loadCollection("my-cats");
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: cat.name,
  image: cat.seed,
  birthday: new Date(),
  description: "A friendly cat",
});
await db.saveCollection("my-cats");
```

#### After (Proposed SDK)

```typescript
// 7 lines for same task
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.ready();

const cat = await meowzer.cats.create({
  appearance: { color: "orange", pattern: "tabby" },
  name: "Whiskers",
  description: "A friendly cat",
});

await cat.save({ collection: "my-cats" });
```

**71% reduction in code**

---

## Benefits

### For Developers

1. **Simpler Mental Model**: One SDK class, not four libraries to learn
2. **Less Boilerplate**: Single-method operations vs multi-step processes
3. **Better TypeScript**: Type inference, generics, autocomplete
4. **Consistent API**: Everything follows same patterns
5. **Better Errors**: Clear error messages with actionable details
6. **Modern Features**: Hooks, plugins, batch operations, transactions

### For the Project

1. **Professional SDK**: Modern architecture that scales
2. **Easier Documentation**: Single unified API to document
3. **Clear Boundaries**: SDK vs internal implementation
4. **Plugin Ecosystem**: Easy to build extensions
5. **Future-Proof**: Can evolve internals without breaking public API
6. **Better Testing**: Mock SDK instead of multiple libraries

---

## Risks & Mitigation

### Risk: Increased Bundle Size

**Mitigation**:

- Tree-shaking for unused features
- Separate entry points: `meowzer/core`, `meowzer/storage`
- Lazy loading for optional features (plugins)
- Bundle size monitoring in CI
- Target: <50KB gzipped for core

### Risk: Development Time (9 weeks)

**Mitigation**:

- Prioritize core features first (Milestones 1-2)
- Advanced features can be added post-v1.0
- Community contributions for plugins
- Start with minimal viable SDK, iterate based on usage

### Risk: API Design Mistakes

**Mitigation**:

- Review API design with potential users early
- Beta testing before v1.0 release
- Study modern SDK patterns (Stripe, Firebase, Supabase)
- Keep escape hatches for unforeseen use cases
- Comprehensive examples to validate API ergonomics

---

## Alternatives Considered

### Alternative 1: Keep Current Function-Based API

**Pros**: No refactoring needed  
**Cons**: API remains confusing, doesn't scale, requires deep knowledge of internals

**Decision**: Rejected - doesn't solve the core problem

### Alternative 2: Minimal Wrapper (Convenience Functions Only)

Add helper functions like `saveCat()` and `loadCat()` without full SDK

**Pros**: Quick to implement  
**Cons**: Still inconsistent, no hooks/plugins, no centralized config

**Decision**: Rejected - halfway solution that doesn't provide long-term value

### Alternative 3: Namespace-Only Organization

Keep functions but organize into namespaces: `Meowzer.cats.create()`, `Meowzer.storage.save()`

**Pros**: Simpler than class-based SDK  
**Cons**: No instance state, no configuration, no lifecycle management

**Decision**: Rejected - lacks instance-based features needed for advanced use cases

**Selected Approach**: Class-based SDK provides best balance of simplicity and power

---

## Conclusion

The current Meowzer API exposes too much internal complexity, requiring developers to understand four separate libraries and manually orchestrate their interactions. By creating a unified SDK with a consistent, ergonomic API, we can:

- **Reduce complexity** by 70%+ for common tasks
- **Improve developer experience** with better TypeScript support and IDE autocomplete
- **Enable advanced features** through plugins and hooks
- **Provide clear API boundaries** between public SDK and internal implementation
- **Scale the project** with a professional, modern architecture

The 9-week implementation plan provides a realistic path to delivering a production-ready SDK with comprehensive testing and documentation.

**Recommendation**: Proceed with SDK development starting with Milestone 1 (Core SDK Structure).
