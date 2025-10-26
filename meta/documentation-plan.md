# Meowzer SDK Documentation Plan

**Last Updated**: October 25, 2025

## 🔄 Recent Changes & Updates

### Critical API Corrections

1. **❌ No High-Level Persistence Functions**: Meowzer does NOT export `saveCat()`, `loadCat()`, `deleteCat()` functions. Persistence requires direct Meowbase API usage.

2. **❌ No Auto-Save**: Cats do NOT automatically save. All persistence is manual via Meowbase.

3. **❌ MeowzerCat Missing Methods**: `save()`, `setName()`, `setDescription()` methods do not exist on MeowzerCat.

4. **✅ Database Integration Pattern**: Meowzer exports Meowbase class and database helper functions (`initializeDatabase()`, `getDatabase()`, etc.) for manual persistence.

### Implementation Status Updates

**Completed** ✅:

- Architecture diagrams (main README + all package READMEs)
- Core creation functions (createCat, createCatFromSeed, createRandomCat)
- Management functions (getAllCats, getCatById, destroyAllCats, pauseAllCats, resumeAllCats)
- Configuration functions (setDefaultContainer, setDefaultBoundaries)
- Utility functions (getRandomSettings, validateSettings, getViewportBoundaries, getPersonalityPresets)
- MeowzerCat lifecycle methods (pause, resume, destroy)
- MeowzerCat configuration methods (setPersonality, setEnvironment)
- Event system (on, off with 5 event types)
- Personality system (6 presets documented)
- Behavior system (5 behaviors with decision engine)
- Animation system (GSAP-based, not pure CSS)

**Needs Verification** ⚠️:

- Environment API (obstacles, attractors, otherCats)
- Collision events from Cat
- Individual cat boundary updates (appear to be read-only)

**Not Implemented** ❌:

- High-level persistence wrapper functions
- Auto-save functionality
- MeowzerCat.save() method
- MeowzerCat.setName() method
- MeowzerCat.setDescription() method

### Architectural Corrections

1. **Dependencies**: Meowzer uses GSAP (not "zero dependencies")
2. **Animation Technology**: GSAP-based (not pure CSS/keyframes)
3. **Persistence Pattern**: Manual Meowbase integration (not transparent wrapper)
4. **Five Libraries**: Meowkit, Meowtion, Meowbrain, Meowbase, Meowzer (integration layer)

---

## Information Architecture

This documentation plan provides a comprehensive structure for the Meowzer SDK docs site, organized into four main categories: **Getting Started**, **Concepts**, **API Reference**, and **Examples**.

---

## 1. Getting Started

**Purpose**: Enable developers to go from zero to their first working cat as quickly as possible. Focus on practical, actionable steps with minimal conceptual overhead.

### 1.1 Introduction

**Goal**: Help developers understand what Meowzer is and decide if it's right for their project.

**Content needed**:

- One-sentence description: "Create autonomous, animated cat characters for web pages" ⚠️ **Remove "zero dependencies" - Meowzer uses GSAP**
- What problems Meowzer solves (lightweight character animation, autonomous behavior without complex AI setup)
- Key features list (autonomous movement, customizable appearance, persistence via IndexedDB, modular architecture)
- Browser compatibility requirements
- **Dependencies**: GSAP (GreenSock Animation Platform) for animations
- Link to quick start guide
- Link to live demo/playground

### 1.2 Installation

**Goal**: Get Meowzer installed and ready to use in under 2 minutes.

**Content needed**:

- NPM installation command: `npm install meowzer`
- CDN option with script tag
- TypeScript setup note (types are included)
- Verification step (import test snippet)
- Next steps link to Basic Usage

### 1.3 Quick Start

**Goal**: Get a working autonomous cat on screen in 5 lines of code or less.

**Content needed**:

- Minimal working example (import + createRandomCat)
- Live code example (interactive demo on page)
- Expected result description (cat appears and wanders)
- Explanation of what's happening behind the scenes (brief, 2-3 sentences)
- "What's next" section pointing to customization and concepts

### 1.4 Basic Usage

**Goal**: Teach core workflows: creating custom cats, controlling behavior, and basic persistence.

**Content needed**:

- Creating a cat with specific appearance (color, pattern, size)
- Setting personality traits (presets or custom)
- Controlling boundaries (keep cat in container)
- Basic event listeners (behaviorChange, stateChange)
- **⚠️ UPDATED**: Saving and loading cats using Meowbase API (not high-level Meowzer functions)
- Pausing/resuming autonomous behavior
- Destroying cats and cleanup
- Links to detailed API reference for each feature

**Persistence Example** (needs to be added):

```typescript
import { createCat, initializeDatabase, getDatabase } from "meowzer";

// Initialize database
await initializeDatabase();
const db = getDatabase();

// Create cat
const cat = createCat(settings, { name: "Whiskers" });

// Save to IndexedDB
await db.createCollection("my-cats");
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: cat.name,
  image: cat.seed,
  birthday: new Date(),
});
await db.saveCollection("my-cats");

// Later: Load cats
const result = await db.loadCollection("my-cats");
```

### 1.5 Configuration Guide

**Goal**: Show developers how to configure Meowzer for their specific use case.

**Content needed**:

- Setting default boundaries for all cats
- Setting default container element
- Configuring physics options (friction, speed)
- Personality presets vs custom personalities
- Environment configuration (obstacles, attractors)
- Performance considerations (number of cats, page visibility handling)
- TypeScript configuration tips

---

## 2. Concepts

**Purpose**: Provide mental models and deeper understanding of how Meowzer works. These docs help developers understand _why_ things work the way they do.

### 2.1 Architecture Overview ✅ COMPLETED (in READMEs)

**Goal**: Help developers understand the system architecture and how the four libraries work together.

**Current Status**: Main README and package READMEs contain comprehensive architecture diagrams and explanations.

**Content needed** (for dedicated docs site):

- High-level architecture diagram showing Meowkit → Meowtion → Meowbrain → Meowzer flow
- Explanation of each library's role:
  - **Meowkit**: Data layer (creates cat definitions from settings)
  - **Meowtion**: Animation layer (renders and animates cats)
  - **Meowbrain**: AI layer (autonomous decision-making)
  - **Meowbase**: Storage layer (IndexedDB persistence)
  - **Meowzer**: Public API (coordinates all libraries)
- Data flow explanation (settings → ProtoCat → Cat → MeowzerCat)
- Why the separation exists (modularity, testability, optional direct library access)
- When to use Meowzer vs individual libraries

### 2.2 Cat Lifecycle

**Goal**: Explain the complete lifecycle from creation to destruction.

**Content needed**:

- Lifecycle stages diagram (Creation → Animation → Autonomous Behavior → Persistence → Destruction)
- Creation phase: CatSettings → ProtoCat → Cat
- Initialization: Brain attachment, DOM insertion
- Active phase: Decision loops, animation updates, state changes
- Pause/resume mechanics
- Persistence: What gets saved, when auto-save happens ⚠️ **Update needed: No auto-save exists**
- Destruction: Cleanup process, event listener removal, memory management
- State transitions and valid state changes

### 2.3 Personality System ✅ COMPLETED (in Meowbrain README)

**Goal**: Teach how personality traits influence cat behavior and how to design personalities for specific use cases.

**Current Status**: Meowbrain README documents all 6 presets with exact values.

**Content needed** (for dedicated docs site):

- Explanation of five personality traits (energy, curiosity, playfulness, independence, sociability)
- How each trait affects behavior (specific examples)
- Personality presets deep-dive (what each preset does)
- Creating custom personalities (trait combinations and their effects)
- How personality interacts with motivation system
- Examples: designing a "lazy house cat" vs "energetic kitten" vs "aloof observer"

### 2.4 Behavior & Decision Making ✅ COMPLETED (in Meowbrain README)

**Goal**: Explain how cats make autonomous decisions and what behaviors are available.

**Current Status**: Meowbrain README contains detailed decision loop flowchart.

**Content needed** (for dedicated docs site):

- Overview of behavior types (wandering, resting, playing, observing, exploring)
- Decision loop explanation (evaluate → consider → choose → execute)
- Motivation system (rest, stimulation, exploration needs)
- How memory prevents repetitive behavior
- Environmental influence on decisions (obstacles, attractors, boundaries)
- Behavior weights and probability calculation
- Decision timing and intervals
- State transitions between behaviors

### 2.5 Animation & Movement ✅ COMPLETED (in Meowtion README)

**Goal**: Explain how cats move and animate, and what's happening under the hood.

**Current Status**: Meowtion README documents all animation states and movement systems.

**Content needed** (for dedicated docs site):

- Animation state machine (idle, walking, running, sitting, sleeping, playing)
- Movement primitives (moveTo, setPosition, setVelocity)
- Physics system (friction, max speed, boundary collision)
- SVG animation techniques (CSS transforms, keyframes) ⚠️ **Update: Uses GSAP, not just CSS**
- Performance optimizations (GPU acceleration, off-screen pausing)
- How movement speed relates to animation states
- Boundary behavior and collision handling

### 2.6 Persistence & Storage ⚠️ NEEDS MAJOR UPDATE

**Goal**: Explain how cats are saved, loaded, and managed in storage.

**Current Implementation**: Persistence is NOT handled by Meowzer high-level API. Users must use Meowbase directly.

**Content needed**:

- **Corrected Architecture**: Meowzer does NOT provide `saveCat()`, `loadCat()`, etc.
- **Meowbase Integration Pattern**: How to use Meowbase alongside Meowzer
- Storage mechanism (IndexedDB via Meowbase)
- What data is persisted (seed, metadata, personality, NOT sprite data)
- Seed-based regeneration (why seeds are used)
- Collections system (organizing cats)
- **NO auto-save behavior exists** - manual saves required via Meowbase API
- Loading strategies (recreate from seed using `createCatFromSeed`)
- Storage limitations and best practices
- Data migration considerations

**Example Pattern** (needs to be documented):

```typescript
// 1. Initialize database
await initializeDatabase();
const db = getDatabase();

// 2. Create collection
await db.createCollection("my-cats");

// 3. Create cat
const cat = createCat(settings, { name: "Whiskers" });

// 4. Manually save cat data to collection
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: "Whiskers",
  image: cat.seed, // Save seed, not full sprite
  birthday: new Date(),
  description: "A friendly cat",
  // ... other metadata
});
await db.saveCollection("my-cats");

// 5. Later: Load and recreate cat
const loadResult = await db.loadCollection("my-cats");
if (loadResult.success) {
  const collectionResult = await db.getCollection("my-cats");
  if (collectionResult.success) {
    const savedCat = collectionResult.data.children[0];
    const recreatedCat = createCatFromSeed(savedCat.image, {
      name: savedCat.name,
    });
  }
}
```

### 2.7 IndexedDB Fundamentals

**Goal**: Provide developers with essential understanding of IndexedDB concepts as they apply to Meowbase.

**Content needed**:

#### 2.7.1 Why IndexedDB?

- Comparison with localStorage (size limits, data types, performance)
- Benefits for Meowbase: large storage capacity (50MB+), structured data, async operations
- Trade-offs: more complex API (abstracted by Meowbase), async-only operations
- Browser support and fallback considerations

#### 2.7.2 ACID Properties in Meowbase

**Atomicity**:

- What it means: Operations either complete fully or not at all
- In Meowbase: When saving a collection, all cats are saved or none are
- Example scenario: If browser crashes during save, data remains consistent
- How Meowbase guarantees atomicity through transactions

**Consistency**:

- What it means: Database always moves from one valid state to another
- In Meowbase: Schema validation ensures all cat objects have required fields
- Type checking: CatSettings validation before persistence
- Referential integrity: Collection references to cats remain valid

**Isolation**:

- What it means: Concurrent operations don't interfere with each other
- In Meowbase: Multiple tabs can read/write without data corruption
- Transaction isolation levels in IndexedDB
- How Meowbase handles concurrent modifications (last-write-wins for simplicity)

**Durability**:

- What it means: Once committed, data survives browser/system crashes
- In Meowbase: Successfully saved cats persist across sessions
- When durability is guaranteed (after transaction completes)
- Important note: Data survives crashes but not browser cache clearing

#### 2.7.3 Transaction Model

**Transaction Basics**:

- What transactions are: Grouped operations that succeed or fail together
- Transaction modes in IndexedDB: readonly, readwrite
- When Meowbase uses each mode

**Meowbase Transaction Patterns**:

- Read operations: Use readonly transactions (multiple simultaneous reads allowed)
- Write operations: Use readwrite transactions (exclusive access)
- Automatic transaction management by Meowbase
- Why developers don't need to manage transactions manually

**Transaction Lifecycle**:

- Opening a transaction
- Performing operations within transaction scope
- Commit (success) vs abort (failure)
- Auto-commit behavior when all operations complete

**Error Handling**:

- Transaction failures and automatic rollback
- How Meowbase surfaces errors through Result pattern
- Recovery strategies (retry logic, user notification)
- Common transaction errors (QuotaExceededError, transaction inactive)

**Performance Considerations**:

- Transaction overhead vs operation batching
- Why saving individual cats is slower than saving collections
- Bulk operations and their benefits
- When to flush changes (balance between consistency and performance)

#### 2.7.4 Schema & Data Structure

**Database Schema**:

- Meowbase database name and version
- Object stores (similar to SQL tables): "collections", "metadata"
- How object stores map to Meowbase concepts

**Collection Object Store**:

```typescript
{
  keyPath: "id",        // Primary key
  indexes: {
    name: {              // Secondary index for name-based lookups
      unique: false,
      multiEntry: false
    }
  }
}
```

**Stored Data Structure**:

```typescript
// What actually gets stored for a collection
{
  id: "uuid-string",
  name: "Collection Name",
  children: [
    {
      id: "cat-uuid",
      seed: "tabby-FF9500-00FF00-m-short-v1",
      name: "Whiskers",
      birthday: "2025-10-24T12:00:00.000Z",
      description: "A friendly cat",
      // ... other metadata
      // NOTE: SVG sprite data is NOT stored
    }
  ],
  metadata: {
    createdAt: "2025-10-24T12:00:00.000Z",
    lastModified: "2025-10-24T14:30:00.000Z",
    version: "1.0.0"
  }
}
```

**Schema Evolution & Versioning**:

- How IndexedDB handles version upgrades
- Meowbase version number and compatibility
- Migration strategy when schema changes
- onupgradeneeded event and data transformation
- Backward compatibility considerations

**Indexes & Query Optimization**:

- Primary key (id) for direct lookups
- Name index for finding collections by name
- Why full-text search is not available (IndexedDB limitation)
- Query performance characteristics (key lookups vs scans)

**Storage Quotas**:

- How browsers allocate storage (persistent vs temporary)
- Default limits (typically 50% of available disk space or 50GB max)
- How to check current usage
- QuotaExceededError handling
- Storage persistence API (request persistent storage)

#### 2.7.5 Meowbase-Specific Implementation Details

**Key-Value Storage Pattern**:

- Collections stored with UUID keys
- Direct key access (fastest retrieval)
- Name-based lookup using index (slower but convenient)

**Document Model**:

- Why Meowbase uses embedded documents (cats within collections)
- Trade-offs: Denormalization vs performance
- Collection size considerations (100 cats default limit)

**Serialization Strategy**:

- JSON serialization for storage
- Date handling (ISO string format)
- Why seeds are stored instead of full SVG data (space efficiency)
- Circular reference prevention

**Cache & Memory Management**:

- In-memory LRU cache (5 collections default)
- Why cache is necessary (IndexedDB async overhead)
- Dirty tracking (unsaved changes)
- Write-through vs write-back caching (Meowbase uses write-back)

**Consistency Model**:

- Eventual consistency between cache and IndexedDB
- When to call flushChanges() or saveCollection()
- Unsaved changes warning on page unload
- Conflict resolution (last-write-wins)

### 2.8 Seeds & Sharing

**Goal**: Explain the seed system and how to share cats.

**Content needed**:

- What a seed is (compact string representation of CatSettings)
- Seed format breakdown (pattern-color-eyeColor-size-furLength-version)
- Deterministic generation (same seed = same cat appearance)
- Use cases: sharing cats, version control, URL parameters
- Creating cats from seeds
- Seed validation
- Version compatibility

### 2.9 Environment & Context

**Goal**: Teach how to create interactive environments for cats.

**Content needed**:

- Boundaries (constraining movement)
- Obstacles (areas to avoid)
- Attractors (points/areas of interest)
- Dynamic environments (updating in response to user actions)
- Multi-cat environments (cats aware of each other)
- Responsive boundaries (viewport changes)
- Performance with complex environments

---

## 3. API Reference

**Purpose**: Complete, authoritative documentation of every public method, interface, and type. Optimized for searchability and quick lookups.

### 3.1 Meowzer API

**Goal**: Document the main Meowzer public API (what most developers will use).

**Current Implementation Status**: ⚠️ **Persistence functions do NOT exist in Meowzer**. Persistence is handled through direct Meowbase API usage.

**Content needed**:

#### 3.1.1 Creation Functions ✅ IMPLEMENTED

- `createCat(settings, options)` - Full signature, parameters, return type, examples
- `createCatFromSeed(seed, options)` - Full signature, parameters, return type, examples
- `createRandomCat(options)` - Full signature, parameters, return type, examples

#### 3.1.2 Management Functions ✅ IMPLEMENTED

- `getAllCats()` - Full signature, return type, examples
- `getCatById(id)` - Full signature, parameters, return type, examples
- `destroyAllCats()` - Full signature, examples
- `pauseAllCats()` - Full signature, examples
- `resumeAllCats()` - Full signature, examples

#### 3.1.3 Global Configuration ✅ IMPLEMENTED

- `setDefaultBoundaries(boundaries)` - Full signature, parameters, examples
- `setDefaultContainer(container)` - Full signature, parameters, examples

#### 3.1.4 Utility Functions ✅ IMPLEMENTED

- `getRandomSettings()` - Full signature, return type, examples
- `validateSettings(settings)` - Full signature, parameters, return type, examples
- `getViewportBoundaries()` - Full signature, return type, examples
- `getPersonalityPresets()` - Full signature, return type, examples

#### 3.1.5 Database Integration ✅ IMPLEMENTED

**Note**: Meowzer exports Meowbase class and helper functions for database management. There are NO high-level `saveCat()`, `loadCat()`, `deleteCat()` functions. Users must use Meowbase API directly.

**Exported Database Functions**:

- `Meowbase` - Class export for direct database access
- `initializeDatabase()` - Initialize singleton database instance
- `getDatabase()` - Get singleton database instance
- `isDatabaseInitialized()` - Check if database is ready
- `closeDatabase()` - Close database connection
- `resetDatabase()` - Reset database instance (testing)

**Database Usage Pattern** (needs documentation):

```typescript
import { initializeDatabase, getDatabase, createCat } from "meowzer";

// Initialize database
await initializeDatabase();
const db = getDatabase();

// Create cat
const cat = createCat(settings);

// Save using Meowbase API directly
await db.createCollection("my-cats");
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: cat.name,
  image: cat.seed,
  birthday: new Date(),
  // ... other metadata
});
await db.saveCollection("my-cats");
```

### 3.2 MeowzerCat Interface

**Goal**: Document the MeowzerCat object returned by creation functions.

**Current Implementation Status**: ✅ IMPLEMENTED (but missing some documented features)

**Content needed**:

#### 3.2.1 Read-Only Properties ✅ IMPLEMENTED

- `id: string` - Unique identifier for the cat
- `seed: string` - Seed string for recreating cat appearance
- `element: HTMLElement` - The cat's DOM element
- `position: Position` - Current {x, y} position (read-only)
- `state: CatStateType` - Current animation state (idle, walking, etc.)
- `personality: Personality` - Current personality traits (read-only)
- `isActive: boolean` - Whether autonomous behavior is running
- `name: string | undefined` - Cat's name (if set)

#### 3.2.2 Lifecycle Methods ✅ IMPLEMENTED

- `pause(): void` - Pause autonomous behavior and animation
- `resume(): void` - Resume autonomous behavior and animation
- `destroy(): void` - Remove cat completely (DOM + cleanup)

**⚠️ MISSING**: No `save()` method exists. Users must use Meowbase API directly.

#### 3.2.3 Configuration Methods ⚠️ PARTIAL

- `setPersonality(personality: Personality | PersonalityPreset): void` - ✅ IMPLEMENTED
- `setEnvironment(environment: Environment): void` - ✅ IMPLEMENTED

**⚠️ MISSING**: No `setName()` or `setDescription()` methods exist on MeowzerCat.
**Note**: Name can only be set during creation via `MeowzerOptions.name`.

#### 3.2.4 Event System ✅ IMPLEMENTED

- `on(event: MeowzerEvent, handler: EventHandler): void` - Subscribe to events
- `off(event: MeowzerEvent, handler: EventHandler): void` - Unsubscribe from events

**Event Types**:

- `"behaviorChange"` - When AI behavior changes (wandering, resting, etc.)
- `"stateChange"` - When animation state changes (idle, walking, etc.)
- `"pause"` - When cat is paused
- `"resume"` - When cat is resumed
- `"destroy"` - When cat is destroyed

**Event Payload Structures** (needs documentation):

```typescript
// behaviorChange
{ id: string, behavior: BehaviorType }

// stateChange
{ id: string, state: CatStateType }

// pause, resume, destroy
{ id: string }
```

#### 3.2.5 Usage Patterns Needed

- Property access patterns
- Event listener examples
- Lifecycle management examples
- Integration with Meowbase for persistence

### 3.3 Types & Interfaces

**Goal**: Provide searchable reference for all TypeScript types.

**Content needed**:

#### 3.3.1 Input Types

- `CatSettings` - All properties with descriptions and valid values
- `MeowzerOptions` - All properties with descriptions and defaults
- `AnimationOptions` - All properties with descriptions and defaults
- `BrainOptions` - All properties with descriptions and defaults

#### 3.3.2 Configuration Types

- `Personality` - All traits with value ranges and effects
- `PersonalityPreset` - All preset values
- `Environment` - All properties with descriptions
- `Boundaries` - All properties with descriptions
- `PhysicsOptions` - All properties with descriptions

#### 3.3.3 State Types

- `CatStateType` - All state values with descriptions
- `BehaviorType` - All behavior values with descriptions
- `Position` - Properties and usage
- `Velocity` - Properties and usage

#### 3.3.4 Advanced Types

- `ProtoCat` - Internal structure (for advanced use)
- `Cat` - Meowtion interface (for advanced use)
- `Brain` - Meowbrain interface (for advanced use)

### 3.4 Events Reference

**Goal**: Document all event types and their payloads.

**Content needed**:

- `behaviorChange` - When fired, payload structure, example handler
- `stateChange` - When fired, payload structure, example handler
- `pause` - When fired, payload structure, example handler
- `resume` - When fired, payload structure, example handler
- `destroy` - When fired, payload structure, example handler
- `moveStart` - When fired, payload structure, example handler (Meowtion-level)
- `moveEnd` - When fired, payload structure, example handler (Meowtion-level)
- `boundaryHit` - When fired, payload structure, example handler (Meowtion-level)

### 3.5 Meowbase API (Storage)

**Goal**: Document Meowbase for developers who need direct storage access.

**Content needed**:

- Collection management methods (createCollection, loadCollection, saveCollection, etc.)
- Cat operations (findCatInCollection, addCatToCollection, etc.)
- Data management (loadSampleData, clearAllData)
- Result pattern explanation
- Storage schema overview
- IndexedDB adapter details

### 3.6 Advanced: Individual Libraries

**Goal**: Document Meowkit, Meowtion, and Meowbrain for advanced use cases.

**Content needed**:

#### 3.6.1 Meowkit (Advanced)

- `buildCat(settings)` - Direct ProtoCat creation
- `buildCatFromSeed(seed)` - Seed-based creation
- `generateSeed(settings)` - Seed generation
- `parseSeed(seed)` - Seed parsing
- SVG generation details

#### 3.6.2 Meowtion (Advanced)

- `animateCat(protoCat, options)` - Direct animation
- Cat interface methods (moveTo, setPosition, setState, etc.)
- Animation state machine
- Physics system
- Performance optimization techniques

#### 3.6.3 Meowbrain (Advanced)

- `createBrain(cat, options)` - Brain creation
- Brain interface methods (start, stop, setPersonality, etc.)
- Decision engine details
- Custom behavior development
- Memory system

---

## 4. Examples

**Purpose**: Practical, copy-paste-ready code examples for common use cases. Each example should be a complete, working implementation.

### 4.1 Basic Examples

#### 4.1.1 Hello Meowzer ✅ VALID

**Goal**: Simplest possible working example.
**Content**: Single cat creation with default settings (3-5 lines)

#### 4.1.2 Custom Cat ✅ VALID

**Goal**: Create a cat with specific appearance.
**Content**: CatSettings configuration with color, pattern, size

#### 4.1.3 Multiple Cats ✅ VALID

**Goal**: Create multiple cats with different personalities.
**Content**: Loop creating cats with different presets

#### 4.1.4 Save and Load ⚠️ NEEDS MAJOR UPDATE

**Goal**: Demonstrate persistence.
**Current Content**: Assumes `saveCat()` and `loadCat()` functions exist
**Correction Needed**: Must use Meowbase API directly

**Updated Example**:

```typescript
import {
  createCat,
  initializeDatabase,
  getDatabase,
  createCatFromSeed,
} from "meowzer";

// Initialize database
await initializeDatabase();
const db = getDatabase();

// Create collection
await db.createCollection("my-cats");

// Create cat
const cat = createCat(settings, { name: "Whiskers" });

// Save to database
db.addCatToCollection("my-cats", {
  id: cat.id,
  name: cat.name,
  image: cat.seed, // Seed is saved, not full sprite
  birthday: new Date(),
  description: "My first cat",
});
await db.saveCollection("my-cats");

// Destroy cat (simulate page reload)
cat.destroy();

// Later: Load and recreate
const loadResult = await db.loadCollection("my-cats");
if (loadResult.success) {
  const collectionResult = await db.getCollection("my-cats");
  if (collectionResult.success) {
    const savedCat = collectionResult.data.children[0];
    const recreatedCat = createCatFromSeed(savedCat.image, {
      name: savedCat.name,
    });
  }
}
```

### 4.2 Intermediate Examples

#### 4.2.1 Cat Creator UI ✅ VALID (exists in docs site)

**Goal**: Build an interactive cat creator.
**Content**: Form inputs for CatSettings, validation, preview, save button
**Status**: Already implemented in `docs/source/components/mb-cat-creator/`

#### 4.2.2 Responsive Boundaries ✅ VALID

**Goal**: Keep cats in viewport on resize.
**Content**: Window resize listener updating boundaries

**Note**: Individual cat boundaries are read-only. Need to use `setDefaultBoundaries()` or recreate cats.

#### 4.2.3 Mouse Follower ⚠️ NEEDS VERIFICATION

**Goal**: Create attractor at mouse position.
**Content**: Mouse move listener creating dynamic attractor

**Status**: Need to verify Environment attractor API is implemented

#### 4.2.4 Collision Detection ⚠️ NEEDS VERIFICATION

**Goal**: Detect when cats hit boundaries.
**Content**: Boundary hit event listener with visual feedback

**Status**: Need to verify if Cat emits boundary collision events

#### 4.2.5 Cat Gallery ⚠️ NEEDS UPDATE

**Goal**: Display saved cats in a gallery.
**Content**: Load all cats, create thumbnails, click to activate

**Update Needed**: Must use Meowbase API to load collections, not `loadAllCats()`

**Pattern**:

```typescript
const db = getDatabase();
const listResult = await db.listCollections();

// Display thumbnails of saved cats
for (const collectionInfo of listResult.data) {
  const result = await db.getCollection(collectionInfo.id);
  if (result.success) {
    const cats = result.data.children;
    // Display thumbnails using cat.image (seed)
  }
}

// Click handler: recreate cat from seed
function onCatClick(savedCat) {
  const cat = createCatFromSeed(savedCat.image, {
    name: savedCat.name,
  });
}
```

### 4.3 Advanced Examples

#### 4.3.1 Custom Environment ⚠️ NEEDS VERIFICATION

**Goal**: Create complex environment with obstacles and attractors.
**Content**: Multi-zone environment with different areas

**Status**: Need to verify Environment API implementation (obstacles, attractors)

#### 4.3.2 Social Cats ⚠️ NEEDS VERIFICATION

**Goal**: Make cats aware of each other.
**Content**: Environment with otherCats array, proximity reactions

**Status**: Need to verify if otherCats feature is implemented

#### 4.3.3 Cat Collections Manager ⚠️ NEEDS UPDATE

**Goal**: Full CRUD for collections.
**Content**: Create, list, load, delete collections UI

**Update Needed**: Use Meowbase API directly, not Meowzer wrapper functions

**Pattern**:

```typescript
const db = getDatabase();

// Create collection
await db.createCollection("My Collection", []);

// List collections
const listResult = await db.listCollections();

// Load collection
await db.loadCollection("My Collection");

// Delete collection
await db.deleteCollection("My Collection");
```

#### 4.3.4 Personality Designer ✅ VALID

**Goal**: Interactive personality trait editor.
**Content**: Sliders for each trait, real-time behavior updates using `cat.setPersonality()`

#### 4.3.5 URL-Based Cat Sharing ✅ VALID

**Goal**: Share cats via URL parameters.
**Content**: Seed in URL, parse on load, shareable links using `createCatFromSeed()`

#### 4.3.6 Cat Playground ✅ VALID (exists in docs site)

**Goal**: Full-featured interactive demo.
**Content**: Creation UI, saved cats list, environment controls, debug panel

**Status**: Already implemented as main docs site demo

### 4.4 Integration Examples

#### 4.4.1 React Integration

**Goal**: Use Meowzer in React app.
**Content**: Custom hook, component lifecycle, ref management

#### 4.4.2 Vue Integration

**Goal**: Use Meowzer in Vue app.
**Content**: Composable, reactive cat state, lifecycle hooks

#### 4.4.3 Svelte Integration

**Goal**: Use Meowzer in Svelte app.
**Content**: Store-based state management, component integration

#### 4.4.4 Vanilla JS (No Build)

**Goal**: Use Meowzer with just CDN script tag.
**Content**: Complete HTML file, no bundler required

### 4.5 Use Case Examples

#### 4.5.1 Website Mascot ⚠️ NEEDS UPDATE

**Goal**: Add a persistent mascot to a site.
**Content**: Single cat, save state ~~in localStorage~~, appears on every page

**Update Needed**: Use Meowbase IndexedDB storage, not localStorage

**Pattern**:

```typescript
// On page load
await initializeDatabase();
const db = getDatabase();

// Try to load existing mascot
const loadResult = await db.loadCollection("site-mascot");
let cat;

if (loadResult.success) {
  const result = await db.getCollection("site-mascot");
  if (result.success && result.data.children.length > 0) {
    const savedCat = result.data.children[0];
    cat = createCatFromSeed(savedCat.image, {
      name: savedCat.name,
    });
  }
} else {
  // First time: create and save mascot
  cat = createRandomCat({ name: "Mascot" });
  await db.createCollection("site-mascot");
  db.addCatToCollection("site-mascot", {
    id: cat.id,
    name: cat.name,
    image: cat.seed,
    birthday: new Date(),
  });
  await db.saveCollection("site-mascot");
}
```

#### 4.5.2 Interactive Loading Screen ✅ VALID

**Goal**: Use cats as entertaining loader.
**Content**: Cats appear during async operations, disappear when done

#### 4.5.3 Achievement System ⚠️ NEEDS DESIGN

**Goal**: Unlock different cat appearances.
**Content**: Track achievements, unlock new patterns/colors

**Status**: Needs design for how unlocks would work (not part of current API)

#### 4.5.4 Virtual Pet ⚠️ NEEDS DESIGN

**Goal**: Build a virtual pet game.
**Content**: Feeding mechanics, mood tracking, care actions

**Status**: Would need additional features beyond current Meowzer API

#### 4.5.5 Multi-User Cat Park ⚠️ OUT OF SCOPE

**Goal**: Shared environment with multiple users' cats.
**Content**: WebSocket sync, conflict resolution, shared boundaries

**Status**: Requires server-side infrastructure not provided by Meowzer

---

## Navigation Structure

```
Meowzer SDK Documentation
│
├── Getting Started
│   ├── Introduction
│   ├── Installation
│   ├── Quick Start
│   ├── Basic Usage
│   └── Configuration Guide
│
├── Concepts
│   ├── Architecture Overview
│   ├── Cat Lifecycle
│   ├── Personality System
│   ├── Behavior & Decision Making
│   ├── Animation & Movement
│   ├── Persistence & Storage
│   ├── IndexedDB Fundamentals
│   │   ├── Why IndexedDB?
│   │   ├── ACID Properties
│   │   ├── Transaction Model
│   │   ├── Schema & Data Structure
│   │   └── Meowbase Implementation
│   ├── Seeds & Sharing
│   └── Environment & Context
│
├── API Reference
│   ├── Meowzer API
│   │   ├── Creation Functions
│   │   ├── Management Functions
│   │   ├── Persistence Functions
│   │   ├── Collection Functions
│   │   ├── Global Configuration
│   │   └── Utility Functions
│   ├── MeowzerCat Interface
│   ├── Types & Interfaces
│   │   ├── Input Types
│   │   ├── Configuration Types
│   │   ├── State Types
│   │   └── Advanced Types
│   ├── Events Reference
│   ├── Meowbase API (Storage)
│   └── Advanced: Individual Libraries
│       ├── Meowkit
│       ├── Meowtion
│       └── Meowbrain
│
└── Examples
    ├── Basic Examples
    │   ├── Hello Meowzer
    │   ├── Custom Cat
    │   ├── Multiple Cats
    │   └── Save and Load
    ├── Intermediate Examples
    │   ├── Cat Creator UI
    │   ├── Responsive Boundaries
    │   ├── Mouse Follower
    │   ├── Collision Detection
    │   └── Cat Gallery
    ├── Advanced Examples
    │   ├── Custom Environment
    │   ├── Social Cats
    │   ├── Cat Collections Manager
    │   ├── Personality Designer
    │   ├── URL-Based Cat Sharing
    │   └── Cat Playground
    ├── Integration Examples
    │   ├── React Integration
    │   ├── Vue Integration
    │   ├── Svelte Integration
    │   └── Vanilla JS (No Build)
    └── Use Case Examples
        ├── Website Mascot
        ├── Interactive Loading Screen
        ├── Achievement System
        ├── Virtual Pet
        └── Multi-User Cat Park
```

---

## Content Guidelines

### Voice & Tone

- **Friendly but professional**: Accessible to beginners, valuable to experts
- **Concise**: Respect developer's time, get to the point
- **Practical**: Every concept should have a code example
- **Encouraging**: Celebrate what developers can build

### Code Examples

- **Complete**: Should run without modification
- **Commented**: Explain non-obvious parts
- **Realistic**: Use real-world patterns, not contrived examples
- **Varied**: Show multiple approaches when appropriate

### Structure

- **Scannable**: Use headings, lists, code blocks
- **Progressive disclosure**: Start simple, link to advanced topics
- **Cross-linked**: Reference related docs liberally
- **Searchable**: Use clear, predictable terminology

### Required Elements for Each Page

- **Goal statement**: What will developer accomplish?
- **Prerequisites**: What should they know first?
- **Code example**: At least one working example
- **Next steps**: Where to go from here?

---

## Search & Discoverability

### Primary Search Queries (optimize for)

- "how to create a cat"
- "personality traits"
- "save cat to storage"
- "multiple cats"
- "cat boundaries"
- "autonomous behavior"
- "seed sharing"
- "TypeScript types"

### SEO Metadata

Each page should have:

- Descriptive title (< 60 chars)
- Meta description (< 160 chars)
- Keywords list
- Open Graph tags

---

## Implementation Priority

### Phase 1: Minimum Viable Docs (MVP) ⚠️ PARTIALLY COMPLETE

1. **Getting Started → All pages**

   - ✅ Quick Start (needs Meowbase integration update)
   - ⚠️ Installation (needs GSAP dependency note)
   - ⚠️ Basic Usage (needs persistence correction)
   - ⚠️ Configuration Guide (needs boundary update clarification)

2. **API Reference → Meowzer API**

   - ✅ Creation functions documented
   - ✅ Management functions documented
   - ❌ Persistence functions section needs complete rewrite (use Meowbase directly)
   - ✅ Configuration functions documented

3. **Examples → Basic Examples**
   - ✅ Hello Meowzer (valid)
   - ✅ Custom Cat (valid)
   - ✅ Multiple Cats (valid)
   - ❌ Save and Load (needs complete rewrite with Meowbase API)

### Phase 2: Core Documentation ⚠️ PARTIALLY COMPLETE

4. **Concepts**

   - ✅ Architecture (completed in READMEs with diagrams)
   - ⚠️ Lifecycle (needs persistence correction)
   - ✅ Personality (completed in Meowbrain README)
   - ✅ Behavior & Decision Making (completed in Meowbrain README)
   - ✅ Animation & Movement (completed in Meowtion README)
   - ❌ Persistence & Storage (needs major rewrite)
   - ✅ IndexedDB Fundamentals (comprehensive existing content)

5. **API Reference**

   - ✅ MeowzerCat Interface (needs minor corrections)
   - ⚠️ Types (needs review)
   - ⚠️ Events (need payload structure documentation)

6. **Examples → Intermediate**
   - ✅ Cat Creator UI (implemented)
   - ⚠️ Responsive Boundaries (needs boundary update clarification)
   - ⚠️ Mouse Follower (needs Environment API verification)
   - ⚠️ Collision Detection (needs event verification)
   - ❌ Cat Gallery (needs Meowbase rewrite)

### Phase 3: Complete Documentation

7. **Concepts → Remaining pages**

   - Seeds & Sharing (straightforward, seed system well-documented)
   - Environment & Context (needs API verification)

8. **API Reference**

   - ✅ Meowbase API (comprehensive README exists)
   - Advanced: Individual Libraries (READMEs exist, need docs site integration)

9. **Examples → Advanced, Integration, Use Case**
   - ⚠️ Most examples need Meowbase API updates
   - ⚠️ Some features need verification (Environment API)
   - ❌ Some use cases need design work

### Current Blockers

1. **Environment API Documentation**: Need to verify obstacles, attractors, otherCats implementation
2. **Event Payloads**: Need to document exact event payload structures
3. **Boundary Updates**: Need to clarify if/how individual cat boundaries can be updated
4. **Missing Features**: Some documented features may not be implemented (needs audit)

### Recommended Next Steps

1. **Audit Environment API**: Verify which features actually exist
2. **Update All Persistence Examples**: Replace fictional API with actual Meowbase patterns
3. **Verify Event System**: Document all event types and payloads
4. **Create Canonical Persistence Guide**: Step-by-step Meowbase integration tutorial
5. **Review Missing Features**: Identify documentation for non-existent features

---

## Success Metrics

### Developer Success

- Time to first working cat: < 5 minutes ✅ (achievable with current API)
- Time to custom cat: < 10 minutes ✅ (achievable with current API)
- Time to saved/loaded cat: ~~< 15 minutes~~ → **< 20 minutes** (requires Meowbase setup + understanding)

### Documentation Quality

- Search findability: < 30 seconds to find answer
- Code example success rate: > 95% work without modification ⚠️ **Currently failing due to incorrect persistence examples**
- Cross-reference completeness: Every concept links to API, every API links to example

### Coverage

- API coverage: ~~100%~~ → **~85%** of public methods documented (missing Environment API verification)
- Example coverage: ~~80%~~ → **~60%** of common use cases have **correct** examples
- Concept coverage: ✅ All core concepts explained (architecture, personality, behavior, animation)

### Documentation Accuracy ⚠️ CRITICAL

- **Current State**: Many examples show non-existent API (`saveCat()`, `loadCat()`, `cat.save()`)
- **Goal**: 100% accuracy - all examples must use actual API
- **Action Required**: Major update to all persistence-related documentation

### Updated Priorities

1. **Fix Incorrect Examples** (HIGH PRIORITY): Update all save/load examples to use Meowbase
2. **Verify Environment API** (MEDIUM PRIORITY): Confirm obstacles, attractors implementation
3. **Complete Event Documentation** (MEDIUM PRIORITY): Document event payload structures
4. **Integration Examples** (LOW PRIORITY): Framework-specific examples can wait
