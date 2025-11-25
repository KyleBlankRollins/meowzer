---
title: Architecture
description: Understanding how Meowzer is built and how its components work together
---

Meowzer is designed as a modular, layered architecture that separates concerns and enables flexibility. Understanding this architecture helps you make the most of the SDK and extend it effectively.

## High-Level Overview

Meowzer consists of four core libraries working together, with the SDK as the developer-facing layer:

```
┌─────────────────────────────────────────────────┐
│                  Meowzer SDK                    │  ← Developer Interface
│  (Managers, Lifecycle, High-level APIs)         │
└─────────────────────────────────────────────────┘
                      ↓
    ┌─────────────────┼─────────────────┐
    ↓                 ↓                 ↓
┌─────────┐      ┌─────────┐      ┌──────────┐
│MeowBrain│      │Meowtion │      │ MeowKit  │    ← Feature Libraries
│   (AI)  │      │(Render) │      │(Builder) │
└─────────┘      └─────────┘      └──────────┘
    ↓                 ↓                 ↓
    └─────────────────┼─────────────────┘
                      ↓
              ┌──────────────┐
              │  MeowBase    │                      ← Data Foundation
              │(Data, Types) │
              └──────────────┘
```

## The Four Libraries

### MeowBase - Data Foundation

**Purpose:** Core data structures, types, and utilities

**Responsibilities:**

- Cat data models and schemas
- Collection management
- Storage adapters (IndexedDB, memory)
- Data validation
- Type definitions

**Key Exports:**

- `CatData` - Complete cat data structure
- `Collection` - Grouping and organizing cats
- `StorageAdapter` - Persistence interface
- Core types and primitives

**Why Separate:**

- Data layer independent of rendering/behavior
- Can swap storage implementations
- Reusable across different frontends
- Clean separation of concerns

### MeowKit - Cat Builder

**Purpose:** Visual construction and customization

**Responsibilities:**

- SVG cat generation
- Color palette management
- Accessory system
- Pattern rendering (stripes, spots, tuxedo)
- Serialization/deserialization

**Key Exports:**

- `CatBuilder` - Fluent API for cat creation
- `generateCatSVG()` - SVG rendering
- Color utilities
- Validation functions

**Why Separate:**

- Visual logic decoupled from behavior
- Can render cats without AI/animation
- Reusable in design tools
- Static generation possible

### Meowtion - Animation Engine

**Purpose:** Movement, animation, and rendering

**Responsibilities:**

- CSS/DOM cat rendering
- GSAP-based animations
- State machine (idle, walking, sitting, playing, eating)
- Movement physics
- Animation sequencing

**Key Exports:**

- `MeowtionCat` - Animated cat class
- State machine
- Animation helpers
- Movement controls

**Why Separate:**

- Animation can be swapped (Canvas, WebGL, etc.)
- Supports headless rendering
- Independent performance optimization
- Different animation strategies possible

### MeowBrain - AI & Behavior

**Purpose:** Autonomous decision-making and personality

**Responsibilities:**

- Behavior orchestration
- Decision engine
- Personality influence
- Interaction detection
- Need satisfaction (food, water, play)

**Key Exports:**

- `MeowBrain` - AI controller
- Behavior system
- Personality types
- Decision-making logic

**Why Separate:**

- AI can be enhanced independently
- Behavior swappable
- Can run without rendering (simulation)
- Machine learning integration possible

## The SDK Layer

### Purpose

The SDK wraps the four libraries and provides:

1. **Unified API** - Single import, cohesive interface
2. **Manager Pattern** - Organized feature access
3. **Lifecycle Management** - Creation, destruction, persistence
4. **Convenience Methods** - Common tasks simplified
5. **Type Safety** - Full TypeScript support

### Core Managers

**CatManager:**

- Cat creation and destruction
- Spatial grid management
- Finding cats
- Global cat operations

**StorageManager:**

- Saving and loading cats
- Collection management
- IndexedDB persistence
- Data migration

**InteractionManager:**

- Food and water placement
- Yarn and laser pointer
- Need satisfaction
- Event system

**HookManager:**

- Lifecycle hooks
- Custom behavior injection
- Event listeners
- Plugin support

**PluginManager:**

- Plugin registration
- Module loading
- Extension system

## Data Flow

### Cat Creation Flow

```
User Code
    ↓
SDK.cats.create(config)
    ↓
CatManager validates config
    ↓
MeowKit generates SVG
    ↓
MeowBase creates CatData
    ↓
Meowtion creates MeowtionCat (rendering)
    ↓
MeowBrain creates MeowBrain (AI)
    ↓
SDK wraps in MeowzerCat
    ↓
CatManager adds to spatial grid
    ↓
MeowtionCat auto-places in DOM
    ↓
Cat appears and begins autonomous behavior
```

### Interaction Flow (Feeding Example)

```
User Code
    ↓
SDK.interactions.placeNeed('food:basic', position)
    ↓
InteractionManager creates need element
    ↓
Places in DOM at position
    ↓
Emits 'needPlaced' event
    ↓
All cats receive event notification
    ↓
MeowBrain (each cat) evaluates need
    ↓
Decision engine checks:
  - Distance to need
  - Current hunger level
  - Personality traits
  - Current activity
    ↓
Cat decides to approach (or not)
    ↓
MeowBrain updates target
    ↓
Meowtion animates movement
    ↓
Cat reaches need
    ↓
MeowBrain triggers consumption
    ↓
InteractionManager removes need from DOM
    ↓
Emits 'needConsumed' event
    ↓
Cat updates internal state (satisfied)
```

### Save/Load Flow

```
Save:
User Code → SDK.storage.save(catId)
    ↓
StorageManager gets cat from CatManager
    ↓
MeowzerCat.toData() serializes state
    ↓
MeowBase adapts to storage format
    ↓
IndexedDB stores data
    ↓
Returns save confirmation

Load:
User Code → SDK.storage.load(catId)
    ↓
StorageManager queries IndexedDB
    ↓
MeowBase retrieves CatData
    ↓
CatManager.create(data) recreates cat
    ↓
Full creation flow (as above)
    ↓
Cat restored with previous state
```

## Spatial Grid System

### Purpose

The spatial grid divides the page into a grid to efficiently detect nearby cats and interactions.

### How It Works

**Grid Structure:**

```typescript
// Page divided into cells (e.g., 100x100px each)
Grid Cell (0,0)  | Grid Cell (1,0)  | Grid Cell (2,0)
-----------------+------------------+-----------------
Grid Cell (0,1)  | Grid Cell (1,1)  | Grid Cell (2,1)
-----------------+------------------+-----------------
Grid Cell (0,2)  | Grid Cell (1,2)  | Grid Cell (2,2)
```

**Cat Registration:**

- When cat is created, added to grid based on position
- Cat updates grid cell when moving
- Maintains reference in current cell

**Proximity Detection:**

- To find nearby cats, check current cell + adjacent cells
- Much faster than checking all cats
- Scales to hundreds of cats

**Benefits:**

- O(1) lookups for nearby entities
- Efficient collision detection
- Scalable performance
- Memory efficient

## Event System

### Architecture

Meowzer uses an event-driven architecture for loose coupling:

**Event Flow:**

```
Action occurs
    ↓
Component emits event
    ↓
Event system broadcasts
    ↓
Registered listeners receive
    ↓
Callbacks execute
```

### Key Events

**Lifecycle Events:**

- `catCreated` - New cat added
- `catDestroyed` - Cat removed
- `catStateChanged` - State machine transition

**Interaction Events:**

- `needPlaced` - Food/water added
- `needConsumed` - Cat consumed need
- `needRemoved` - Need removed manually
- `yarnPlaced` - Yarn thrown
- `laserToggled` - Laser pointer on/off

**Storage Events:**

- `catSaved` - Cat persisted
- `catLoaded` - Cat restored
- `collectionCreated` - New collection

### Usage Pattern

```typescript
// Listen to events
SDK.on("catCreated", (cat) => {
  console.log("New cat:", cat.id);
});

// Components emit events internally
// User code just listens
```

## State Management

### Cat State Machine

Each cat runs a state machine controlling behavior:

```
       ┌─────┐
       │Idle │ ←──────────┐
       └──┬──┘            │
          │               │
    ┌─────┴─────┐        │
    ↓           ↓        │
┌────────┐  ┌────────┐  │
│Walking │  │Sitting │  │
└───┬────┘  └───┬────┘  │
    │           │       │
    └─────┬─────┘       │
          ↓             │
    ┌──────────┐        │
    │ Playing  │────────┤
    └──────────┘        │
          ↓             │
    ┌──────────┐        │
    │  Eating  │────────┘
    └──────────┘
```

**States:**

- **Idle** - Standing, looking around, waiting
- **Walking** - Moving to destination
- **Sitting** - Resting, low energy
- **Playing** - Interacting with toys
- **Eating** - Consuming food/water

**Transitions:**

- Driven by MeowBrain decisions
- Influenced by personality
- Triggered by interactions
- Timed behaviors

### Global State

**SDK manages:**

- Active cats registry
- Spatial grid state
- Interaction elements
- Storage connections
- Plugin instances

**Persistence:**

- Individual cat state → MeowBase
- Collections → IndexedDB
- Session data → Memory or IndexedDB

## Performance Considerations

### Optimization Strategies

**Lazy Loading:**

- Libraries loaded on demand
- Cats created only when needed
- Storage initialized on first use

**Spatial Partitioning:**

- Grid system prevents O(n²) checks
- Only nearby entities considered
- Scales to large cat populations

**Animation Efficiency:**

- GSAP handles GPU acceleration
- RequestAnimationFrame for smooth updates
- Paused when tab inactive

**Memory Management:**

- Cats properly destroyed and cleaned up
- Event listeners removed
- DOM elements removed
- No memory leaks

**Batching:**

- Multiple cat operations batched
- Storage writes debounced
- DOM updates minimized

## Extension Points

### Where You Can Customize

**Custom Behaviors:**

```typescript
// Add custom behavior to MeowBrain
SDK.hooks.register("beforeDecision", (cat, context) => {
  // Custom decision logic
});
```

**Custom Storage:**

```typescript
// Implement custom StorageAdapter
class CustomAdapter implements StorageAdapter {
  // Your implementation
}
SDK.storage.setAdapter(new CustomAdapter());
```

**Custom Animations:**

```typescript
// Override animation behavior
SDK.hooks.register("beforeAnimate", (cat, animation) => {
  // Custom animation
});
```

**Plugins:**

```typescript
// Create full plugins
const myPlugin = {
  name: "my-plugin",
  init(sdk) {
    // Plugin initialization
  },
};
SDK.plugins.register(myPlugin);
```

## Design Principles

### Why This Architecture?

**Modularity:**

- Each library has single responsibility
- Can use libraries independently
- Easy to test in isolation

**Flexibility:**

- Swap implementations
- Extend without modifying core
- Multiple rendering strategies

**Scalability:**

- Spatial grid enables many cats
- Efficient event system
- Optimized data structures

**Developer Experience:**

- Simple SDK API
- TypeScript support
- Predictable patterns
- Easy to understand

**Maintainability:**

- Clear separation of concerns
- Limited interdependencies
- Well-defined interfaces
- Comprehensive types

## Common Patterns

### Creating and Managing Cats

**Standard pattern:**

```typescript
// Initialize SDK
const meowzer = new MeowzerSDK();
await meowzer.init();

// Create cat
const cat = await meowzer.cats.create({
  personality: "playful",
});

// Cat automatically placed and active

// Later: destroy
await meowzer.cats.destroy(cat.id);
```

### Handling Interactions

**Standard pattern:**

```typescript
// Place interaction
const needId = meowzer.interactions.placeNeed("food:basic", {
  x: 100,
  y: 200,
});

// Listen for consumption
meowzer.on("needConsumed", ({ catId, needId }) => {
  console.log(`Cat ${catId} ate!`);
});
```

### Persistence

**Standard pattern:**

```typescript
// Save cat
await meowzer.storage.save(cat.id);

// Load later
const loaded = await meowzer.storage.load(catId);

// Manage collections
await meowzer.storage.createCollection("favorites");
await meowzer.storage.addToCollection("favorites", cat.id);
```

## Next Steps

Dive deeper into specific topics:

- [Cat Lifecycle](/concepts/cat-lifecycle) - Understanding cat states and transitions
- [AI Behaviors](/concepts/ai-behaviors) - How MeowBrain makes decisions
- [API Reference](/api/meowzer-sdk) - Complete API documentation

---

_Understanding Meowzer's architecture helps you build better integrations, debug issues, and extend functionality effectively._ 🏗️
