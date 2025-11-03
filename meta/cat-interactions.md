# Cat Interactions

We need to create interactive features for our cats. These will require updates to both the Meowzer SDK and UI.

The goal is to create fun ways for users to interact with their cats.

## Cat personalities, states, and interactions

Cat personalities and states should affect how cats will respond to interaction events. At the very least, there should be a visual indication that a cat is aware of the interaction event. However, in typical cat fashion, the cat may decide to ignore the event based on its personality or current state.

## Interaction specs

### Food and water: need

**Category:** Environmental Need  
**Interaction Type:** Placement-based (user places food/water in environment, cats respond)

#### Types

1. **Basic Food (Kibble)**

   - Type identifier: `food:basic`
   - Visual: Bag → Bowl with kibble

2. **Fancy Food (Wet/Raw)**

   - Type identifier: `food:fancy`
   - Visual: Can → Bowl with wet food

3. **Water**
   - Type identifier: `water`
   - Visual: Water droplet → Bowl with water

#### Inputs

- **Position:** `{ x: number, y: number }` - Where the food/water is placed in the environment
- **Type:** `'food:basic' | 'food:fancy' | 'water'` - The type of need being placed
- **Duration:** `number` (optional) - How long the item remains before auto-removal (default: unlimited)

#### Outputs

**SDK Event:** `needPlaced`

```typescript
{
  id: string; // Unique ID for this need instance
  type: "food:basic" | "food:fancy" | "water";
  position: {
    x: number;
    y: number;
  }
  timestamp: number;
}
```

**Cat Response Event:** `needResponse`

```typescript
{
  catId: string;
  needId: string;
  responseType: "interested" |
    "approaching" |
    "consuming" |
    "ignoring" |
    "satisfied";
  timestamp: number;
}
```

#### SDK API

**New Method:** `MeowzerCat.prototype.respondToNeed(needId: string): Promise<void>`

- Triggers cat's awareness of and potential response to a placed need
- Cat's personality and current state influence response likelihood
- May trigger movement toward the need or ignore behavior

**New Method:** `Meowzer.prototype.placeNeed(type, position, options?): Need`

- Places a need item in the environment at specified position
- Returns Need instance with methods: `remove()`, `isActive()`
- Emits `needPlaced` event
- Need instance tracks which cats have interacted with it

**New Method:** `Meowzer.prototype.removeNeed(needId: string): void`

- Removes a need from the environment
- Cancels any cats currently responding to it

#### Behavior Rules

- **Basic Food:** Cats respond based on hunger level and energy (lower energy = more likely to respond)
- **Fancy Food:** Higher attraction rate, cats may interrupt current behavior to investigate
- **Water:** Cats respond periodically, especially after playing or exploring behaviors
- **Personality Influence:**
  - Curious cats: More likely to investigate immediately
  - Lazy cats: Only respond when highly motivated
  - Playful cats: May approach but get distracted easily
- **State Influence:**
  - Sleeping/resting: Very low response chance unless fancy food
  - Playing: Moderate response chance, may finish play first
  - Already eating: Will not respond to new food

---

### Laser pointer: toy

**Category:** Interactive Toy  
**Interaction Type:** User-controlled moving target

#### Inputs

- **Position:** `{ x: number, y: number }` - Current laser dot position
- **Active:** `boolean` - Whether laser is currently on/off
- **Movement Pattern:** `'manual' | 'random' | 'circle' | 'zigzag'` (optional auto-movement patterns)

#### Outputs

**SDK Event:** `laserMoved`

```typescript
{
  id: string;              // Laser pointer instance ID
  position: { x: number; y: number };
  previousPosition?: { x: number; y: number };
  velocity: { x: number; y: number };  // Speed and direction
  timestamp: number;
}
```

**Cat Response Event:** `laserResponse`

```typescript
{
  catId: string;
  laserId: string;
  responseType: "noticed" |
    "stalking" |
    "pouncing" |
    "chasing" |
    "lost-interest";
  attentionLevel: number; // 0-1, how focused the cat is
  timestamp: number;
}
```

#### SDK API

**New Class:** `LaserPointer`

```typescript
class LaserPointer {
  constructor(meowzer: Meowzer);

  // Control methods
  turnOn(position: { x: number; y: number }): void;
  turnOff(): void;
  moveTo(position: { x: number; y: number }): void;

  // Auto-patterns
  startPattern(
    pattern: "random" | "circle" | "zigzag",
    options?: PatternOptions
  ): void;
  stopPattern(): void;

  // State
  get isActive(): boolean;
  get position(): { x: number; y: number };

  // Cleanup
  destroy(): void;
}
```

**New Method:** `Meowzer.prototype.createLaserPointer(): LaserPointer`

- Creates and returns a new LaserPointer instance
- Automatically registers with cat response system

**New Method:** `MeowzerCat.prototype.respondToLaser(laserId: string): void`

- Internal method triggered when laser moves near cat
- Cat decides whether to chase based on personality and state

#### Behavior Rules

- **Detection Range:** Cats notice laser within 200px radius
- **Chase Speed:** Playful cats chase faster, lazy cats slower or ignore
- **Attention Span:**
  - Curious/Playful: High attention, long chase duration
  - Lazy: Quick loss of interest
  - Balanced: Moderate engagement
- **Pouncing:** Random chance to pounce when close to laser (higher for playful personalities)
- **State Influence:**
  - Playing/Idle: Most likely to respond
  - Sleeping/Resting: Very unlikely unless high energy personality
  - Walking/Running: May change course to investigate
- **Fatigue:** After extended chasing, cats become less responsive (temporary stamina mechanic)

---

### RC car: toy

**Category:** Interactive Toy  
**Interaction Type:** User-controlled moving object (larger than laser, has collision)

#### Inputs

- **Position:** `{ x: number; y: number }` - Current car position
- **Direction:** `number` - Rotation angle in degrees
- **Speed:** `number` - Current movement speed (0-1)
- **Active:** `boolean` - Whether car is powered on

#### Outputs

**SDK Event:** `rcCarMoved`

```typescript
{
  id: string; // RC car instance ID
  position: {
    x: number;
    y: number;
  }
  direction: number; // Rotation angle
  speed: number; // 0-1
  timestamp: number;
}
```

**Cat Response Event:** `rcCarResponse`

```typescript
{
  catId: string;
  carId: string;
  responseType: "curious" |
    "stalking" |
    "batting" |
    "chasing" |
    "fleeing" |
    "ignoring";
  distance: number; // Distance from car
  timestamp: number;
}
```

#### SDK API

**New Class:** `RCCar`

```typescript
class RCCar {
  constructor(
    meowzer: Meowzer,
    initialPosition: { x: number; y: number }
  );

  // Control methods
  setSpeed(speed: number): void; // 0-1
  setDirection(angle: number): void; // 0-360 degrees
  moveForward(): void;
  moveBackward(): void;
  turnLeft(amount?: number): void;
  turnRight(amount?: number): void;
  stop(): void;

  // Auto-drive patterns
  startAutoDrive(pattern: "random" | "circle" | "patrol"): void;
  stopAutoDrive(): void;

  // State
  get position(): { x: number; y: number };
  get direction(): number;
  get speed(): number;
  get isActive(): boolean;

  // Cleanup
  destroy(): void;
}
```

**New Method:** `Meowzer.prototype.createRCCar(position?): RCCar`

- Creates RC car at specified or random position
- Returns RCCar instance for control

**New Method:** `MeowzerCat.prototype.respondToRCCar(carId: string): void`

- Triggered when RC car enters cat's awareness radius
- Response varies by personality and car behavior

#### Behavior Rules

- **Detection Range:** 250px radius (larger than laser due to size/noise)
- **Response Types:**
  - **Curious:** Approach slowly, may sniff (sitting near car)
  - **Playful:** Chase and attempt to bat at car
  - **Timid/Lazy:** May flee or ignore depending on car speed
- **Speed Influence:**
  - Slow car: More likely to investigate, less threatening
  - Fast car: May trigger chase in playful cats, flee in timid cats
- **Collision:** If car bumps into cat, triggers `surprised` reaction (jump back, brief pause)
- **Personality Responses:**
  - Playful: Chases, tries to catch, bats at wheels
  - Curious: Investigates cautiously, may follow at distance
  - Lazy: Usually ignores unless very slow/close
- **State Influence:**
  - Playing: Most responsive, may integrate car into play
  - Resting: Unlikely to respond unless car is very close
  - Walking: May alter path to investigate or avoid

---

### Yarn: toy

**Category:** Interactive Toy  
**Interaction Type:** Draggable object with physics (cat can interact physically)

#### Inputs

- **Position:** `{ x: number; y: number }` - Yarn ball or end position if being dragged
- **State:** `'idle' | 'dragging' | 'rolling'` - Current yarn state
- **DragPath:** `Array<{ x: number; y: number }>` - Trail of positions if being dragged
- **Active:** `boolean` - Whether yarn is placed in environment

#### Outputs

**SDK Event:** `yarnMoved`

```typescript
{
  id: string;              // Yarn instance ID
  position: { x: number; y: number };
  state: 'idle' | 'dragging' | 'rolling';
  velocity?: { x: number; y: number };  // If rolling
  timestamp: number;
}
```

**Cat Response Event:** `yarnResponse`

```typescript
{
  catId: string;
  yarnId: string;
  responseType: 'noticed' | 'batting' | 'pouncing' | 'carrying' | 'playing' | 'ignoring';
  duration?: number;       // How long interaction lasted
  timestamp: number;
}
```

#### SDK API

**New Class:** `Yarn`

```typescript
class Yarn {
  constructor(
    meowzer: Meowzer,
    initialPosition: { x: number; y: number }
  );

  // Control methods
  startDragging(targetPosition: { x: number; y: number }): void;
  updateDragPosition(position: { x: number; y: number }): void;
  stopDragging(): void; // Releases yarn, may trigger physics roll

  // Physics
  applyForce(velocity: { x: number; y: number }): void; // Kick/bat the yarn

  // State
  get position(): { x: number; y: number };
  get state(): "idle" | "dragging" | "rolling";
  get isBeingPlayedWith(): boolean; // True if cat is interacting

  // Cleanup
  remove(): void;
}
```

**New Method:** `Meowzer.prototype.placeYarn(position?): Yarn`

- Places yarn ball at position (or random if not specified)
- Returns Yarn instance
- Yarn has simple physics (rolls, slows down with friction)

**New Method:** `MeowzerCat.prototype.playWithYarn(yarnId: string): Promise<void>`

- Cat plays with yarn for a duration
- Includes batting, pouncing, and carrying behaviors
- Returns promise that resolves when play session ends

#### Behavior Rules

- **Detection Range:** 150px radius
- **Interaction Types:**
  - **Batting:** Cat swipes at yarn, applying physics force (yarn rolls away)
  - **Pouncing:** Cat jumps on yarn, pinning it temporarily
  - **Carrying:** Cat picks up yarn and moves with it (rare, personality-dependent)
  - **Tangling:** Extended play may cause yarn to "unravel" visual effect
- **Personality Responses:**
  - Playful: Most engaged, long play sessions, multiple interaction types
  - Curious: Investigates, may bat once or twice
  - Lazy: Rarely interacts unless yarn rolls very close
- **Movement Response:**
  - Idle yarn: Moderate interest
  - Rolling yarn: High interest (moving target)
  - Dragged yarn: Maximum interest (simulates prey movement)
- **State Influence:**
  - Playing: Highly responsive
  - Idle/Walking: Moderate response
  - Resting/Sleeping: Low response unless very energetic personality
- **Attention Duration:**
  - Short bursts: 5-15 seconds of active play
  - May return to yarn multiple times if still visible
  - Playful cats have longer engagement times

---

## Implementation Patterns

Based on the existing Meowzer SDK architecture, here are the patterns to follow when implementing cat interactions:

### 1. Manager Pattern

All interaction systems should use dedicated managers (similar to `CatManager`, `StorageManager`, `HookManager`):

```typescript
export class InteractionManager {
  private interactions = new Map<string, BaseInteraction>();
  private hooks: HookManager;
  private cats: CatManager;

  constructor(hooks: HookManager, cats: CatManager) {
    this.hooks = hooks;
    this.cats = cats;
  }

  // Methods for creating/managing interactions
}
```

- Add `InteractionManager` to `Meowzer` SDK as `meowzer.interactions`
- Expose through `PluginContext` for plugin access

### 2. Event System Pattern

All interaction classes should use the `EventEmitter` utility:

```typescript
import { EventEmitter } from "../utilities/event-emitter.js";

export class LaserPointer {
  private events: EventEmitter<"moved" | "activated" | "deactivated">;

  constructor() {
    this.events = new EventEmitter();
  }

  on(event: string, handler: EventHandler): void {
    this.events.on(event, handler);
  }

  private _emit(event: string, data: any): void {
    this.events.emit(event, data);
  }
}
```

- Use `EventEmitter<T>` for type-safe event handling
- Follow naming: `on()`, `off()`, private `_emit()`
- Errors in handlers are caught and logged automatically

### 3. Lifecycle Hooks

Interaction events should integrate with the existing hook system:

```typescript
// In InteractionManager
async placeNeed(type: string, position: Position): Promise<Need> {
  // Trigger hook before placing
  await this.hooks._trigger("beforeNeedPlace", {
    type,
    position,
  });

  const need = new Need(type, position);
  this.interactions.set(need.id, need);

  // Trigger hook after placing
  await this.hooks._trigger("afterNeedPlace", {
    need,
  });

  return need;
}
```

**New Lifecycle Hooks to Add:**

- `beforeNeedPlace` / `afterNeedPlace`
- `beforeNeedRemove` / `afterNeedRemove`
- `beforeInteractionStart` / `afterInteractionStart`
- `beforeInteractionEnd` / `afterInteractionEnd`

### 4. Plugin Compatibility

Interactions should be plugin-compatible:

```typescript
// Example analytics plugin tracking interactions
const analyticsPlugin: MeowzerPlugin = {
  name: "interaction-analytics",
  version: "1.0.0",

  install(ctx) {
    ctx.hooks.on("afterNeedPlace", ({ need }) => {
      analytics.track("need_placed", { type: need.type });
    });

    ctx.hooks.on(
      "afterInteractionStart",
      ({ catId, interactionType }) => {
        analytics.track("cat_interaction", {
          catId,
          interactionType,
        });
      }
    );
  },
};
```

### 5. Brain Behavior Integration

Cat responses should integrate with existing `MeowBrain` behaviors:

```typescript
// In meowbrain/behaviors.ts, add new behaviors:

/**
 * Approaching behavior - cat moves toward a target (food, toy, etc.)
 */
export async function approaching(
  cat: Cat,
  target: Position,
  duration: number,
  options?: { speed?: number }
): Promise<void> {
  // Similar pattern to existing behaviors (wandering, playing, etc.)
  const dist = distance(cat.position, target);
  const speed = options?.speed ?? randomRange(80, 150);
  const moveTime = Math.min((dist / speed) * 1000, duration);

  await cat.moveTo(target.x, target.y, moveTime);
}

/**
 * Consuming behavior - cat eats/drinks at location
 */
export async function consuming(
  cat: Cat,
  duration: number
): Promise<void> {
  cat.stop();
  cat.setState("sitting");
  await new Promise((resolve) => setTimeout(resolve, duration));
}
```

**Add to BehaviorType union:**

```typescript
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching" // New
  | "consuming" // New
  | "chasing" // New
  | "batting"; // New
```

### 6. MeowzerCat Extension Pattern

Add interaction methods to `MeowzerCat`:

```typescript
// In meowzer-cat.ts

/**
 * Make cat aware of and potentially respond to a need
 */
async respondToNeed(needId: string): Promise<void> {
  const interaction = this._getInteractionManager();
  const need = interaction.getNeed(needId);

  if (!need) return;

  // Use brain to decide if cat is interested
  const interested = this._brain.evaluateInterest(need, this.personality);

  if (interested) {
    await this._brain.setBehavior("approaching");
    // Move toward need...
  } else {
    await this._brain.setBehavior("observing");
  }
}
```

### 7. Internal vs Public API

Follow existing pattern for internal access:

- **Public API**: `meowzer.interactions.placeNeed()`
- **Internal Access**: `cat._internalBrain`, `cat._internalCat`
- **Helper Access**: Global symbol pattern for managers (like storage)

```typescript
// Register interaction manager globally
const globalKey = Symbol.for("meowzer.interactions");
(globalThis as any)[globalKey] = this.interactions;

// Access in MeowzerCat
private _getInteractionManager(): InteractionManager {
  const globalKey = Symbol.for("meowzer.interactions");
  const interactions = (globalThis as any)[globalKey];

  if (!interactions) {
    throw new Error("Interactions not initialized");
  }

  return interactions;
}
```

### 8. Cleanup Pattern

All interaction objects must implement cleanup:

```typescript
export class LaserPointer {
  private animationFrame?: number;

  destroy(): void {
    // Cancel any ongoing animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Clear event handlers
    this.events.clear();

    // Remove from DOM if applicable
    this.element?.remove();
  }
}
```

- Called automatically when SDK is destroyed
- Must clean up timers, animation frames, DOM elements
- Clear all event handlers

### 9. TypeScript Patterns

Follow existing type organization:

```typescript
// meowzer/types/sdk/interactions.ts
export interface NeedType {
  id: string;
  type: "food:basic" | "food:fancy" | "water";
  position: Position;
  timestamp: number;
}

export interface InteractionEvent {
  catId: string;
  interactionId: string;
  type: InteractionType;
  timestamp: number;
}

// Export from types/index.ts
export * from "./sdk/interactions.js";
```

### 10. Configuration Pattern

Add interaction config to SDK config:

```typescript
// In config.ts
export interface MeowzerConfig {
  storage: StorageConfig;
  behavior: BehaviorConfig;
  interactions?: {
    enabled: boolean;
    detectionRanges?: {
      need: number; // Default: 150px
      laser: number; // Default: 200px
      rcCar: number; // Default: 250px
      yarn: number; // Default: 150px
    };
    responseRates?: {
      basicFood: number; // Default: 0.7
      fancyFood: number; // Default: 0.9
      water: number; // Default: 0.5
    };
  };
}
```

---

## Implementation Priority

**Phase 1 (MVP):**

- Food placement (basic + fancy types)
- Laser pointer (manual control only)
- InteractionManager base structure
- New lifecycle hooks
- Brain behavior extensions (approaching, consuming)

**Phase 2:**

- Water placement
- Yarn ball (with basic physics)
- Chasing/batting behaviors
- Plugin compatibility testing

**Phase 3:**

- RC Car
- Auto-patterns for laser pointer
- Advanced yarn tangling effects
- Full analytics/telemetry hooks

## SVG templates needed

- Food: basic kibble
  - default: a bag with an image of kibble
  - active: a bowl with kibble in it
- Food: fancy wet food
  - default: a shallow can, like a tuna can
  - active: a bowl with wet food in it
- Food: water
  - default: a water droplet
  - active: a bowel with water in it
- Toy: Laser pointer
  - default: a pen-like laser pointing device
  - active: a red dot
- Toy: RC car
  - default: a car tire + remote control
  - active: a small formula 1 race car
- Toy: Yarn
  - default: a ball of yarn
  - active: a small length of yarn
