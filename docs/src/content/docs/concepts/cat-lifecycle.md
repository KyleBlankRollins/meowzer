---
title: Cat Lifecycle
description: Understanding how cats are created, managed, and destroyed in Meowzer
---

Every Meowzer cat goes through a well-defined lifecycle from creation to destruction. Understanding this lifecycle helps you manage cats effectively and hook into the right moments for customization.

## Lifecycle Stages

### Overview

```
┌──────────────┐
│ Configuration│  User provides cat config
└──────┬───────┘
       ↓
┌──────────────┐
│   Creation   │  SDK creates cat components
└──────┬───────┘
       ↓
┌──────────────┐
│  Placement   │  Cat placed in DOM and spatial grid
└──────┬───────┘
       ↓
┌──────────────┐
│    Active    │  Cat behaves autonomously
└──────┬───────┘
       ↓
┌──────────────┐
│ Destruction  │  Cat cleaned up and removed
└──────────────┘
```

## Stage 1: Configuration

### What Happens

User provides configuration to create a cat:

```typescript
const config = {
  // Appearance
  primaryColor: "#FF6B35",
  secondaryColor: "#FFFFFF",
  pattern: "stripes",
  accessories: ["collar"],

  // Personality
  personality: "playful",

  // Behavior
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
};
```

### Validation

SDK validates configuration:

**Required checks:**

- Valid colors (hex format)
- Valid pattern type
- Valid accessories
- Valid personality preset
- Valid boundaries

**Defaults applied:**

- Missing colors → random selection
- No pattern → solid color
- No personality → balanced default
- No boundaries → full viewport

### Result

Clean, validated configuration ready for creation.

## Stage 2: Creation

### Internal Process

```typescript
// User calls:
const cat = await meowzer.cats.create(config);

// Internally:
// 1. CatManager receives config
// 2. Generates unique ID
// 3. MeowKit generates SVG
// 4. MeowBase creates CatData
// 5. Meowtion creates rendering layer
// 6. MeowBrain creates AI layer
// 7. SDK wraps in MeowzerCat
// 8. Returns to user
```

### Component Creation

**MeowKit (Visual):**

```typescript
// Generates SVG representation
const svg = generateCatSVG({
  colors: config.colors,
  pattern: config.pattern,
  accessories: config.accessories,
});
```

**MeowBase (Data):**

```typescript
// Creates data structure
const catData: CatData = {
  id: generateId(),
  appearance: { ... },
  personality: { ... },
  state: 'idle',
  position: { x: 0, y: 0 },
  stats: {
    hunger: 50,
    energy: 100,
    happiness: 75
  }
};
```

**Meowtion (Animation):**

```typescript
// Creates animated cat
const meowtionCat = new MeowtionCat(svg, config);
// Sets up state machine
// Initializes GSAP animations
```

**MeowBrain (AI):**

```typescript
// Creates behavior controller
const brain = new MeowBrain(catData, config.personality);
// Loads personality traits
// Initializes decision engine
```

### MeowzerCat Wrapper

SDK wraps everything in a unified interface:

```typescript
const meowzerCat = new MeowzerCat({
  id: catData.id,
  data: catData,
  meowtion: meowtionCat,
  brain: brain,
});
```

### Hooks Available

```typescript
// Before creation
SDK.hooks.register("beforeCreate", (config) => {
  // Modify config
  // Add custom properties
  // Validate further
});

// After creation
SDK.hooks.register("afterCreate", (cat) => {
  // Custom initialization
  // Track analytics
  // Update UI
});
```

## Stage 3: Placement

### Automatic Placement

Cats automatically place themselves in the DOM:

**MeowtionCat constructor:**

```typescript
constructor(svg, config) {
  // Create DOM element
  this.element = createCatElement(svg);

  // Set initial position
  const startPos = this.getRandomStartPosition();
  this.element.style.left = `${startPos.x}px`;
  this.element.style.top = `${startPos.y}px`;

  // Auto-append to body
  document.body.appendChild(this.element);
}
```

**Spatial Grid Registration:**

```typescript
// CatManager adds to spatial grid
spatialGrid.addCat(cat);

// Grid tracks position for proximity queries
grid[cellX][cellY].push(cat);
```

### Position Initialization

**Random placement:**

- Within configured boundaries
- Avoids edge spawn
- Ensures visibility

**Custom placement:**

```typescript
// Can override with specific position
const cat = await meowzer.cats.create({
  ...config,
  initialPosition: { x: 100, y: 200 },
});
```

### Hooks Available

```typescript
// Before placement
SDK.hooks.register("beforePlace", (cat, position) => {
  // Override position
  // Add placement effects
});

// After placement
SDK.hooks.register("afterPlace", (cat) => {
  // Placement animations
  // UI updates
});
```

## Stage 4: Active

### Behavior Loop

Once active, cats run autonomous behavior:

```typescript
// Main behavior loop (simplified)
async function behaviorLoop() {
  while (cat.isActive) {
    // 1. Perception
    const surroundings = perceiveSurroundings();

    // 2. Decision
    const action = brain.decide(surroundings);

    // 3. Execution
    await executeAction(action);

    // 4. Wait
    await sleep(getDecisionInterval());
  }
}
```

### State Machine

Cats transition through states:

```
Initial: IDLE
    ↓
Decision: "I'm curious, let's explore"
    ↓
Transition: IDLE → WALKING
    ↓
Execute: Walk to random point
    ↓
Arrival: Reached destination
    ↓
Decision: "I'm tired"
    ↓
Transition: WALKING → SITTING
    ↓
Rest for duration
    ↓
Decision: "I see food!"
    ↓
Transition: SITTING → WALKING
    ↓
Walk to food
    ↓
Arrival: At food
    ↓
Transition: WALKING → EATING
    ↓
Consume food
    ↓
Transition: EATING → IDLE
    ↓
Repeat...
```

### Activity Types

**Wandering:**

- Random destination selection
- Personality influences frequency
- Boundary-aware pathing

**Resting:**

- Sitting animation
- Energy regeneration
- Duration based on energy level

**Interacting:**

- Approaching food/water
- Playing with yarn
- Chasing laser pointer

**Idle:**

- Standing still
- Looking around
- Waiting for stimulus

### Perception System

Cats detect nearby elements:

```typescript
function perceiveSurroundings() {
  return {
    // Nearby needs (food, water)
    needs: findNearbyNeeds(position, detectionRadius),

    // Nearby toys
    toys: findNearbyToys(position, detectionRadius),

    // Laser pointer
    laser: findLaserPointer(),

    // Boundaries
    boundaries: checkBoundaries(position),

    // Other cats
    nearbyCats: spatialGrid.findNearby(position),
  };
}
```

**Detection factors:**

- Distance to item
- Personality traits (curiosity, playfulness)
- Current state and goals
- Internal needs (hunger, energy)

### Decision Making

Brain evaluates options and chooses action:

```typescript
function decide(surroundings) {
  // Evaluate all possible actions
  const options = [
    { action: "walkRandom", score: evaluateWandering() },
    { action: "rest", score: evaluateResting() },
    { action: "eatFood", score: evaluateEating(surroundings.needs) },
    {
      action: "playWithYarn",
      score: evaluatePlaying(surroundings.toys),
    },
    {
      action: "chaseLaser",
      score: evaluateLaser(surroundings.laser),
    },
  ];

  // Weight by personality
  const weighted = applyPersonality(options);

  // Choose highest scoring action
  return selectBestAction(weighted);
}
```

**Personality influence:**

- Playful → higher toy scores
- Lazy → higher rest scores
- Curious → higher exploration scores
- Energetic → lower rest scores

### Updates

Cats continuously update:

**Position updates:**

- Animation frame updates
- Spatial grid cell changes
- Boundary collision checks

**State updates:**

- Hunger increases over time
- Energy decreases with activity
- Happiness influenced by interactions

**Visual updates:**

- Animation plays via GSAP
- CSS transforms for movement
- State-specific sprite changes

### Hooks Available

```typescript
// Before any decision
SDK.hooks.register("beforeDecision", (cat, context) => {
  // Influence decision making
});

// State changes
SDK.hooks.register("stateChange", (cat, oldState, newState) => {
  // React to state transitions
});

// Movement
SDK.hooks.register("beforeMove", (cat, destination) => {
  // Override movement
});

// Interactions
SDK.hooks.register("beforeInteract", (cat, item) => {
  // Custom interaction logic
});
```

## Stage 5: Destruction

### Triggering Destruction

**Manual destruction:**

```typescript
await meowzer.cats.destroy(cat.id);
```

**Automatic scenarios:**

- SDK shutdown
- Page unload
- Collection clear

### Cleanup Process

```typescript
async function destroy(catId) {
  const cat = findCat(catId);

  // 1. Stop AI loop
  cat.brain.stop();

  // 2. Stop animations
  cat.meowtion.stopAllAnimations();

  // 3. Remove from spatial grid
  spatialGrid.removeCat(cat);

  // 4. Remove DOM element
  cat.meowtion.element.remove();

  // 5. Remove event listeners
  cat.removeAllListeners();

  // 6. Clear references
  delete activeCats[catId];

  // 7. Emit event
  emit("catDestroyed", { catId });
}
```

### Memory Management

**Critical cleanups:**

- GSAP animations killed
- Event listeners removed
- DOM elements removed
- Timers/intervals cleared
- References nullified

**Prevents:**

- Memory leaks
- Zombie cats
- Event handler buildup
- Animation conflicts

### Hooks Available

```typescript
// Before destruction
SDK.hooks.register("beforeDestroy", (cat) => {
  // Save state
  // Final logging
  // Cleanup custom data
});

// After destruction
SDK.hooks.register("afterDestroy", (catId) => {
  // Update UI
  // Analytics
  // Notifications
});
```

## Special Lifecycle Cases

### Saving and Loading

**Save preserves state:**

```typescript
// Active cat → stored data
await meowzer.storage.save(cat.id);

// Internally:
// 1. Serialize current state
// 2. Store in IndexedDB
// 3. Cat continues running
```

**Load recreates cat:**

```typescript
// Stored data → active cat
const cat = await meowzer.storage.load(catId);

// Internally:
// 1. Retrieve data from IndexedDB
// 2. Run full creation process
// 3. Restore previous state
// 4. Resume from saved position
```

**State restored:**

- Position
- Current state (idle, walking, etc.)
- Stats (hunger, energy)
- Personality configuration
- Appearance

### Pausing and Resuming

**Pause:**

```typescript
cat.brain.pause();
cat.meowtion.pause();

// Cat freezes in place
// No decisions made
// Animations stop
```

**Resume:**

```typescript
cat.brain.resume();
cat.meowtion.resume();

// Cat continues from pause point
// Resumes decision making
// Animations restart
```

### Tab Visibility

**Page hidden:**

```typescript
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Optionally pause all cats
    meowzer.cats.pauseAll();
  } else {
    // Resume all cats
    meowzer.cats.resumeAll();
  }
});
```

**Benefits:**

- Saves CPU when tab inactive
- Prevents animation jank
- Improves battery life

## Lifecycle Events

### Complete Event List

**Creation:**

- `beforeCreate` - Before cat creation starts
- `afterCreate` - After cat fully created
- `beforePlace` - Before DOM placement
- `afterPlace` - After placed in DOM

**Activity:**

- `stateChange` - State machine transition
- `beforeDecision` - Before AI decision
- `afterDecision` - After AI decision
- `beforeMove` - Before position change
- `afterMove` - After position change
- `beforeInteract` - Before interaction
- `afterInteract` - After interaction

**Destruction:**

- `beforeDestroy` - Before cleanup starts
- `afterDestroy` - After fully destroyed

**Storage:**

- `beforeSave` - Before saving to storage
- `afterSave` - After save complete
- `beforeLoad` - Before loading from storage
- `afterLoad` - After load complete

### Using Events

```typescript
// Track complete lifecycle
meowzer.on("afterCreate", (cat) => {
  console.log("Created:", cat.id);
});

meowzer.on("stateChange", ({ cat, oldState, newState }) => {
  console.log(`${cat.id}: ${oldState} → ${newState}`);
});

meowzer.on("afterDestroy", ({ catId }) => {
  console.log("Destroyed:", catId);
});
```

## Best Practices

### Creation

**Do:**

- Validate config before creating
- Use presets for common configurations
- Handle creation errors gracefully
- Track created cats if needed

**Don't:**

- Create too many cats at once (performance)
- Forget to destroy cats when done
- Ignore creation errors

### Active Management

**Do:**

- Let cats behave autonomously
- Use events to react to behavior
- Respect the state machine
- Monitor performance with many cats

**Don't:**

- Manually manipulate cat DOM
- Override position constantly
- Force rapid state changes
- Create circular event dependencies

### Destruction

**Do:**

- Destroy cats when no longer needed
- Handle destruction in cleanup code
- Use `beforeDestroy` for final save
- Clean up custom references

**Don't:**

- Leave cats running indefinitely
- Destroy while animations active
- Forget to remove custom listeners
- Destroy the same cat twice

## Next Steps

Learn more about specific aspects:

- [Architecture](/concepts/architecture) - Overall system design
- [AI Behaviors](/concepts/ai-behaviors) - How MeowBrain works
- [Cat Manager API](/api/managers/cat-manager) - Cat management methods

---

_Understanding the cat lifecycle helps you create, manage, and destroy cats effectively throughout your application._ 🔄
