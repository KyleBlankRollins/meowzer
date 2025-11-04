# Phase 2 Implementation Plan: Water, Yarn, and New Behaviors

**Date:** November 4, 2025  
**Feature:** Cat Interactions System - Phase 2  
**Branch:** cat-interactions  
**Last Updated:** November 4, 2025

## Overview

Phase 2 builds on Phase 1's foundation by adding water placement, yarn toy with physics, and extending the brain with chasing/batting behaviors.

## Phase 2 Scope

- ✅ Water placement (extends existing Need system)
- ✅ Yarn ball with basic physics
- ✅ New behaviors: chasing, batting
- ✅ Cat response to laser pointer movement
- ✅ Plugin compatibility testing
- ✅ UI components for Phase 2 interactions

---

## Codebase Status Assessment

### ✅ Already Implemented (Phase 1 Foundation)

1. **Water Type Infrastructure**:

   - `NeedTypeIdentifier` includes "water" type in `types/sdk/interactions.ts` ✅
   - `config.ts` has water response rate (0.5) and detection range (150) ✅
   - `InteractionManager.placeNeed()` supports water placement ✅

2. **Hook System**:

   - Need lifecycle hooks exist: `BEFORE_NEED_PLACE`, `AFTER_NEED_PLACE`, `BEFORE_NEED_REMOVE`, `AFTER_NEED_REMOVE` ✅
   - Interaction hooks exist: `BEFORE_INTERACTION_START`, `AFTER_INTERACTION_START`, `BEFORE_INTERACTION_END`, `AFTER_INTERACTION_END` ✅
   - Hook infrastructure ready for yarn-specific hooks ✅

3. **Laser Types**:

   - `LaserMovedEvent` and `LaserResponseEvent` already defined in types ✅
   - LaserPointer class exists from Phase 1 ✅

4. **Config Structure**:
   - `detectionRanges` includes yarn: 150 ✅
   - Config system supports Phase 2 additions ✅

### ❌ NOT Implemented (Phase 2 Work)

1. **Yarn System**:

   - ❌ Yarn class does not exist (`sdk/interactions/yarn.ts` missing)
   - ❌ Yarn types missing: `YarnState`, `YarnMovedEvent`, `YarnResponseEvent`, `YarnOptions`, `YarnPlacedEvent`, `YarnRemovedEvent`
   - ❌ No yarn methods in InteractionManager
   - ❌ No yarn-specific lifecycle hook constants

2. **New Behaviors**:

   - ❌ "chasing" behavior not in BehaviorType union
   - ❌ "batting" behavior not in BehaviorType union
   - ❌ BehaviorWeights interface missing chasing/batting properties
   - ❌ No behavior implementations for chasing/batting

3. **Decision Engine**:

   - ❌ `calculateBehaviorWeights()` doesn't account for chasing/batting
   - ❌ `updateMotivations()` missing cases for new behaviors
   - ❌ `isValidBehaviorTransition()` missing rules for chasing/batting

4. **Brain Integration**:

   - ❌ No `_checkNearbyYarns()` method
   - ❌ No `_setupYarnListener()` method
   - ❌ No `_handleYarnPlaced()` / `_handleYarnMoved()` handlers
   - ❌ `evaluateInterest()` missing water-specific logic
   - ❌ `evaluateInterest()` missing yarn logic

5. **MeowzerCat**:

   - ❌ No `playWithYarn()` method

6. **UI Components**:
   - ❌ No `mb-interactions-panel` component
   - ❌ No `mb-yarn-visual` component
   - ❌ No `mb-laser-visual` component
   - ❌ No interactions button in `mb-cat-playground`

### 📋 Recommended Implementation Order

For better incremental testing and validation:

1. **Phase 2.1 - Core Types & Infrastructure** (Tasks 1, 4, type updates)
2. **Phase 2.2 - Behaviors & Decision Engine** (Tasks 5, 6, 7)
3. **Phase 2.3 - Yarn System** (Tasks 2, 3)
4. **Phase 2.4 - Brain & Cat Integration** (Tasks 8, 9)
5. **Phase 2.5 - UI Components** (Tasks 13, 14, 15)

---

## Task Breakdown (15 Tasks)

### SDK Tasks (9 tasks)

#### Task 1: Water Type Support

**Status:** Not started  
**Estimated Time:** 30 minutes  
**Dependencies:** None (Phase 1 complete)

**Current State:**

- ✅ Water type exists in `NeedTypeIdentifier` ("water")
- ✅ Config has water response rate (0.5) and detection range (150)
- ✅ InteractionManager.placeNeed() already supports water
- ❌ Brain.evaluateInterest() lacks water-specific evaluation logic

**Files to Modify:**

- `meowzer/meowbrain/brain.ts` - Add water evaluation logic to `evaluateInterest()` method

**Changes Required:**

Update `evaluateInterest()` in Brain to handle water differently:

```typescript
// In evaluateInterest() method
if (needType === "water") {
  // Base interest for water
  interest = 0.3;

  // Higher interest after activity (playing, exploring)
  if (
    this._state.currentBehavior === "playing" ||
    this._state.currentBehavior === "exploring"
  ) {
    interest += 0.3;
  }

  // Motivation-based adjustment (rest need increases water interest)
  interest += (1 - this._state.motivation.rest) * 0.2;

  // Personality adjustment
  interest *= 1 - this._personality.independence * 0.2;
}
```

**Testing:**

- Place water bowl after cat has been playing
- Verify cat shows higher interest
- Test personality influence (independent cats less interested)

---

#### Task 2: Yarn Class

**Status:** Not started  
**Estimated Time:** 2 hours  
**Dependencies:** None (self-contained)

**Current State:**

- ❌ File does not exist: `meowzer/sdk/interactions/yarn.ts`
- ❌ Yarn types not defined

**Files to Create:**

- `meowzer/sdk/interactions/yarn.ts` (new file)

**Implementation:**

```typescript
import type { Position } from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

export type YarnState = "idle" | "dragging" | "rolling";
export type YarnEvent = "moved" | "stopped" | "removed";

export interface YarnOptions {
  duration?: number; // Auto-remove after duration (ms)
  friction?: number; // Physics friction coefficient (default: 0.95)
}

export class Yarn {
  readonly id: string;
  readonly type = "yarn" as const;

  private _position: Position;
  private _state: YarnState = "idle";
  private _velocity: { x: number; y: number } = { x: 0, y: 0 };
  private _friction: number;
  private _active: boolean = true;
  private _animationFrame?: number;
  private _removalTimer?: number;
  private _events: EventEmitter<YarnEvent>;
  private _playingCats: Set<string> = new Set();

  readonly timestamp: number;

  constructor(id: string, position: Position, options?: YarnOptions) {
    this.id = id;
    this._position = { ...position };
    this._friction = options?.friction ?? 0.95;
    this._events = new EventEmitter<YarnEvent>();
    this.timestamp = Date.now();

    // Setup auto-removal if duration specified
    if (options?.duration) {
      this._removalTimer = setTimeout(() => {
        this.remove();
      }, options.duration) as any;
    }
  }

  get position(): Position {
    return { ...this._position };
  }

  get state(): YarnState {
    return this._state;
  }

  get velocity(): { x: number; y: number } {
    return { ...this._velocity };
  }

  get isActive(): boolean {
    return this._active;
  }

  get isBeingPlayedWith(): boolean {
    return this._playingCats.size > 0;
  }

  /**
   * Start dragging yarn to a position
   */
  startDragging(targetPosition: Position): void {
    if (!this._active) return;

    this._state = "dragging";
    this._velocity = { x: 0, y: 0 };
    this._position = { ...targetPosition };

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Update drag position
   */
  updateDragPosition(position: Position): void {
    if (!this._active || this._state !== "dragging") return;

    // Calculate velocity from movement
    this._velocity = {
      x: position.x - this._position.x,
      y: position.y - this._position.y,
    };

    this._position = { ...position };

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Stop dragging - yarn may roll based on velocity
   */
  stopDragging(): void {
    if (!this._active || this._state !== "dragging") return;

    // If velocity is significant, start rolling
    const speed = Math.hypot(this._velocity.x, this._velocity.y);
    if (speed > 10) {
      this._state = "rolling";
      this._startPhysics();
    } else {
      this._state = "idle";
      this._velocity = { x: 0, y: 0 };
    }

    this._emit("moved", {
      id: this.id,
      position: this._position,
      state: this._state,
      velocity: this._velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Apply physics force to yarn (e.g., from cat batting)
   */
  applyForce(force: { x: number; y: number }): void {
    if (!this._active) return;

    this._velocity.x += force.x;
    this._velocity.y += force.y;

    // Clamp velocity to max
    const maxVelocity = 300;
    const speed = Math.hypot(this._velocity.x, this._velocity.y);
    if (speed > maxVelocity) {
      const scale = maxVelocity / speed;
      this._velocity.x *= scale;
      this._velocity.y *= scale;
    }

    this._state = "rolling";
    this._startPhysics();
  }

  /**
   * Track cat playing with yarn
   * @internal
   */
  _addPlayingCat(catId: string): void {
    this._playingCats.add(catId);
  }

  /**
   * Remove cat from playing set
   * @internal
   */
  _removePlayingCat(catId: string): void {
    this._playingCats.delete(catId);
  }

  /**
   * Start physics simulation
   */
  private _startPhysics(): void {
    if (this._animationFrame) return;

    const update = () => {
      if (!this._active || this._state !== "rolling") {
        this._animationFrame = undefined;
        return;
      }

      // Apply friction
      this._velocity.x *= this._friction;
      this._velocity.y *= this._friction;

      // Update position
      this._position.x += this._velocity.x / 60; // Assuming 60fps
      this._position.y += this._velocity.y / 60;

      // Boundary collision (simple bounce)
      if (
        this._position.x < 0 ||
        this._position.x > window.innerWidth
      ) {
        this._velocity.x *= -0.5; // Damped bounce
        this._position.x = Math.max(
          0,
          Math.min(window.innerWidth, this._position.x)
        );
      }
      if (
        this._position.y < 0 ||
        this._position.y > window.innerHeight
      ) {
        this._velocity.y *= -0.5;
        this._position.y = Math.max(
          0,
          Math.min(window.innerHeight, this._position.y)
        );
      }

      // Emit moved event
      this._emit("moved", {
        id: this.id,
        position: this._position,
        state: this._state,
        velocity: this._velocity,
        timestamp: Date.now(),
      });

      // Stop if velocity is too low
      const speed = Math.hypot(this._velocity.x, this._velocity.y);
      if (speed < 1) {
        this._state = "idle";
        this._velocity = { x: 0, y: 0 };
        this._emit("stopped", {
          id: this.id,
          position: this._position,
          timestamp: Date.now(),
        });
        return;
      }

      this._animationFrame = requestAnimationFrame(update);
    };

    this._animationFrame = requestAnimationFrame(update);
  }

  /**
   * Remove yarn from environment
   */
  remove(): void {
    if (!this._active) return;

    this._active = false;

    // Clear timers
    if (this._removalTimer) {
      clearTimeout(this._removalTimer);
    }

    // Stop physics
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }

    // Emit removed event
    this._emit("removed", {
      id: this.id,
      timestamp: Date.now(),
    });

    // Clear events
    this._events.clear();
  }

  on(event: YarnEvent, handler: EventHandler): void {
    this._events.on(event, handler);
  }

  off(event: YarnEvent, handler: EventHandler): void {
    this._events.off(event, handler);
  }

  private _emit(event: YarnEvent, data: any): void {
    this._events.emit(event, data);
  }
}
```

**Testing:**

- Create yarn and verify position tracking
- Test drag/release physics
- Verify force application (batting simulation)
- Test auto-removal with duration
- Verify boundary collision detection

---

#### Task 3: Add Yarn to InteractionManager

**Status:** Not started  
**Estimated Time:** 1 hour  
**Dependencies:** Task 2 (Yarn class must exist)

**Current State:**

- ✅ InteractionManager exists with needs system
- ❌ No yarn-related properties or methods

**Files to Modify:**

- `meowzer/sdk/managers/interaction-manager.ts`

**Changes Required:**

```typescript
// Add import
import { Yarn } from "../interactions/yarn.js";
import type { YarnOptions } from "../interactions/yarn.js";

// Add to class
export class InteractionManager {
  private needs: Map<string, Need>;
  private yarns: Map<string, Yarn>; // NEW
  private nextYarnId: number = 0; // NEW
  // ... existing properties

  constructor(
    hooks: HookManager,
    cats: CatManager,
    config: ConfigManager
  ) {
    // ... existing initialization
    this.yarns = new Map(); // NEW
  }

  /**
   * Place yarn in the environment
   */
  async placeYarn(
    position?: Position,
    options?: YarnOptions
  ): Promise<Yarn> {
    // Trigger before hook
    await this.hooks._trigger("beforeYarnPlace", {
      position,
      options,
    });

    // Use provided position or random
    const yarnPosition = position || {
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
    };

    const id = `yarn-${this.nextYarnId++}-${Date.now()}`;
    const yarn = new Yarn(id, yarnPosition, options);

    this.yarns.set(id, yarn);

    // Setup removal callback
    yarn.on("removed", () => {
      this.yarns.delete(id);
    });

    // Emit event
    this.events.emit("yarnPlaced", {
      id: yarn.id,
      position: yarn.position,
      timestamp: yarn.timestamp,
    });

    // Trigger after hook
    await this.hooks._trigger("afterYarnPlace", {
      yarn,
    });

    return yarn;
  }

  /**
   * Remove yarn from environment
   */
  async removeYarn(yarnId: string): Promise<void> {
    const yarn = this.yarns.get(yarnId);
    if (!yarn) return;

    // Trigger before hook
    await this.hooks._trigger("beforeYarnRemove", {
      yarnId,
    });

    yarn.remove();
    this.yarns.delete(yarnId);

    // Emit event
    this.events.emit("yarnRemoved", {
      id: yarnId,
      timestamp: Date.now(),
    });

    // Trigger after hook
    await this.hooks._trigger("afterYarnRemove", {
      yarnId,
    });
  }

  /**
   * Get yarn by ID
   */
  getYarn(yarnId: string): Yarn | undefined {
    return this.yarns.get(yarnId);
  }

  /**
   * Get all yarns
   */
  getAllYarns(): Yarn[] {
    return Array.from(this.yarns.values());
  }

  /**
   * Get yarns near a position
   */
  getYarnsNearPosition(position: Position, range?: number): Yarn[] {
    const detectionRange =
      range ?? this.config.get().interactions.detectionRanges.yarn;

    return Array.from(this.yarns.values()).filter((yarn) => {
      const dist = Math.hypot(
        yarn.position.x - position.x,
        yarn.position.y - position.y
      );
      return dist <= detectionRange && yarn.isActive();
    });
  }

  /**
   * Cleanup
   */
  async _cleanup(): Promise<void> {
    // Remove all needs
    for (const need of this.needs.values()) {
      need.remove();
    }
    this.needs.clear();

    // Remove all yarns
    for (const yarn of this.yarns.values()) {
      yarn.remove();
    }
    this.yarns.clear();

    this.events.clear();
  }
}
```

**Testing:**

- placeYarn() creates and tracks yarn
- removeYarn() cleans up properly
- getYarnsNearPosition() returns correct yarns
- Events emit correctly

---

#### Task 4: Yarn Lifecycle Hooks

**Status:** Not started  
**Estimated Time:** 30 minutes  
**Dependencies:** None (extends existing hook system)

**Current State:**

- ✅ Hook system infrastructure complete
- ✅ Need hooks exist as template
- ❌ Yarn-specific hook constants not defined

**Files to Modify:**

- `meowzer/sdk/managers/hook-manager.ts`

**Changes Required:**

```typescript
// Add to LifecycleHook constant
export const LifecycleHook = {
  // ... existing hooks
  BEFORE_YARN_PLACE: "beforeYarnPlace",
  AFTER_YARN_PLACE: "afterYarnPlace",
  BEFORE_YARN_REMOVE: "beforeYarnRemove",
  AFTER_YARN_REMOVE: "afterYarnRemove",
} as const;

// Add hook context types
export interface YarnPlaceHookContext {
  position?: Position;
  options?: any;
}

export interface YarnRemoveHookContext {
  yarnId: string;
}

export interface YarnPlacedHookContext {
  yarn: any; // Yarn type
}

// Update HookContext union
export type HookContext =
  | CreateHookContext
  | LoadHookContext
  | SaveHookContext
  | DeleteHookContext
  | NeedPlaceHookContext
  | NeedRemoveHookContext
  | InteractionHookContext
  | YarnPlaceHookContext
  | YarnRemoveHookContext
  | YarnPlacedHookContext;
```

**Testing:**

- Register yarn hooks and verify they fire
- Test before/after hook execution order

---

#### Task 5: Add Chasing Behavior

**Status:** Not started  
**Estimated Time:** 30 minutes  
**Dependencies:** None (extends existing behaviors)

**Current State:**

- ✅ Behavior system exists with 7 behaviors
- ❌ "chasing" not in BehaviorType union (behaviors.ts or types/cat/behavior.ts)
- ❌ No chasing() function implementation

**Files to Modify:**

- `meowzer/meowbrain/behaviors.ts`
- `meowzer/types/cat/behavior.ts`

**Changes Required:**

```typescript
/**
 * Chasing behavior - cat follows a moving target at high speed
 */
export async function chasing(
  cat: Cat,
  target: Position,
  duration: number,
  options?: { speed?: number }
): Promise<void> {
  const speed = options?.speed ?? randomRange(150, 250); // Faster than approaching
  const dist = distance(cat.position, target);
  const moveTime = Math.min((dist / speed) * 1000, duration);

  cat.setState("running");
  await cat.moveTo(target.x, target.y, moveTime);
}

// Add to BehaviorType union (already done in Phase 1, verify)
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching"
  | "consuming"
  | "chasing"; // NEW

// Add to getBehaviorDuration
export function getBehaviorDuration(
  behavior: BehaviorType,
  energy: number
): number {
  switch (behavior) {
    // ... existing cases
    case "chasing":
      return randomRange(1000, 3000); // Short bursts
    default:
      return 3000;
  }
}
```

**File:** `meowzer/types/cat/behavior.ts`

```typescript
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching"
  | "consuming"
  | "chasing"; // NEW

export interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
  approaching: number;
  consuming: number;
  chasing: number; // NEW
}
```

**Testing:**

- Cat chases moving yarn/laser at high speed
- Movement faster than approaching behavior
- Duration is short bursts (1-3 seconds)

---

#### Task 6: Add Batting Behavior

**Status:** Not started  
**Estimated Time:** 30 minutes  
**Dependencies:** None (extends existing behaviors)

**Current State:**

- ✅ Behavior system exists
- ❌ "batting" not in BehaviorType union
- ❌ No batting() function implementation

**Files to Modify:**

- `meowzer/meowbrain/behaviors.ts`
- `meowzer/types/cat/behavior.ts`

**Changes Required:**

```typescript
/**
 * Batting behavior - cat swipes at an object
 */
export async function batting(
  cat: Cat,
  duration: number
): Promise<void> {
  cat.stop();
  cat.setState("sitting");

  // Quick swipe animation (would be handled by animation system)
  await new Promise((resolve) => setTimeout(resolve, duration));
}

// Add to BehaviorType union
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching"
  | "consuming"
  | "chasing"
  | "batting"; // NEW

// Add to getBehaviorDuration
export function getBehaviorDuration(
  behavior: BehaviorType,
  energy: number
): number {
  switch (behavior) {
    // ... existing cases
    case "batting":
      return randomRange(500, 1000); // Quick swipes
    default:
      return 3000;
  }
}
```

**File:** `meowzer/types/cat/behavior.ts`

```typescript
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching"
  | "consuming"
  | "chasing"
  | "batting"; // NEW

export interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
  approaching: number;
  consuming: number;
  chasing: number;
  batting: number; // NEW
}
```

**Testing:**

- Cat performs quick swipe animation
- Duration is 500-1000ms
- Cat stops movement during batting

---

#### Task 7: Update Decision Engine for New Behaviors

**Status:** Not started  
**Estimated Time:** 1 hour  
**Dependencies:** Tasks 5, 6 (behaviors must be defined first)

**Current State:**

- ✅ Decision engine exists with 7 behavior support
- ❌ BehaviorWeights interface missing chasing/batting
- ❌ calculateBehaviorWeights() doesn't handle new behaviors
- ❌ updateMotivations() missing cases for new behaviors
- ❌ isValidBehaviorTransition() missing transition rules

**Files to Modify:**

- `meowzer/meowbrain/decision-engine.ts`

**Changes Required:**

```typescript
// Update BehaviorWeights interface (already done in types)

// Update calculateBehaviorWeights
export function calculateBehaviorWeights(
  personality: Personality,
  motivation: Motivations,
  memory: Memory,
  environment: Environment
): BehaviorWeights {
  // ... existing weight calculations

  // Chasing weight (requires external trigger)
  const chasing = 0; // Base 0, boosted by yarn/laser detection

  // Batting weight (requires nearby object)
  const batting = 0; // Base 0, boosted when near yarn

  return {
    wandering,
    resting,
    playing,
    observing,
    exploring,
    approaching,
    consuming,
    chasing,
    batting,
  };
}

// Update updateMotivations
export function updateMotivations(
  current: Motivations,
  behavior: BehaviorType,
  deltaTime: number,
  decayRates: MotivationDecay
): Motivations {
  // ... existing code

  // Chasing: high energy consumption
  if (behavior === "chasing") {
    rest -= 0.15 * deltaTime;
    stimulation += 0.1 * deltaTime;
  }

  // Batting: moderate stimulation
  if (behavior === "batting") {
    rest -= 0.05 * deltaTime;
    stimulation += 0.05 * deltaTime;
  }

  // ... rest of function
}

// Update isValidBehaviorTransition
export function isValidBehaviorTransition(
  from: BehaviorType,
  to: BehaviorType
): boolean {
  // After consuming, must rest
  if (from === "consuming" && to !== "resting") return false;

  // Any behavior can transition to resting
  if (to === "resting") return true;

  // High priority behaviors (can interrupt most)
  if (
    to === "approaching" ||
    to === "consuming" ||
    to === "chasing" // NEW
  ) {
    return true;
  }

  // Batting can follow chasing or observing
  if (to === "batting") {
    return (
      from === "chasing" ||
      from === "observing" ||
      from === "approaching"
    );
  }

  // Define valid transitions
  const validTransitions: Record<BehaviorType, BehaviorType[]> = {
    wandering: [
      "exploring",
      "playing",
      "observing",
      "resting",
      "approaching",
      "chasing",
    ],
    resting: ["wandering", "exploring", "observing", "approaching"],
    playing: [
      "wandering",
      "resting",
      "approaching",
      "chasing",
      "batting",
    ],
    observing: [
      "wandering",
      "exploring",
      "resting",
      "approaching",
      "chasing",
      "batting",
    ],
    exploring: [
      "wandering",
      "observing",
      "resting",
      "approaching",
      "chasing",
    ],
    approaching: ["consuming", "observing", "resting", "batting"],
    consuming: ["resting"],
    chasing: ["batting", "observing", "resting", "wandering"],
    batting: ["chasing", "observing", "resting"],
  };

  return validTransitions[from]?.includes(to) ?? false;
}
```

**Testing:**

- New behaviors added to behavior weights calculation
- Motivations update correctly (chasing drains energy, batting moderate)
- Valid transitions work (chasing→batting, batting→resting, etc.)
- Invalid transitions blocked (batting can't go to playing directly)

---

#### Task 8: MeowzerCat.playWithYarn()

**Status:** Not started  
**Estimated Time:** 1 hour  
**Dependencies:** Tasks 2, 3, 5, 6 (Yarn class, InteractionManager methods, behaviors)

**Current State:**

- ✅ MeowzerCat class exists with respondToNeed() from Phase 1
- ❌ No playWithYarn() method

**Files to Modify:**

- `meowzer/sdk/meowzer-cat.ts`

**Changes Required:**

````typescript
/**
 * Make cat play with yarn
 *
 * Cat evaluates interest in yarn, then may approach and bat/chase it.
 *
 * @param yarnId - ID of the yarn to play with
 *
 * @example
 * ```ts
 * const yarn = await meowzer.interactions.placeYarn({ x: 500, y: 300 });
 * await cat.playWithYarn(yarn.id);
 * ```
 */
async playWithYarn(yarnId: string): Promise<void> {
  const interactionManager = this._getInteractionManager();
  const yarn = interactionManager.getYarn(yarnId);

  if (!yarn || !yarn.isActive()) return;

  // Evaluate interest (higher for moving yarn)
  let interest = this._brain.evaluateInterest({
    type: "yarn",
    position: yarn.position,
  });

  // Boost interest if yarn is moving
  if (yarn.state === "rolling" || yarn.state === "dragging") {
    interest *= 1.5;
  }

  if (interest > 0.5) {
    const personality = this._brain.personality;
    const delay = personality.independence * 1000; // 0-1 seconds

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Verify yarn is still active
    if (!yarn.isActive()) return;

    // Trigger lifecycle hook
    const hookManager = this._getHookManager();
    await hookManager._trigger("beforeInteractionStart", {
      catId: this.id,
      interactionId: yarnId,
      interactionType: "yarn",
    });

    // Mark cat as playing with yarn
    yarn._addPlayingCat(this.id);

    // Approach the yarn
    await this._brain._approachTarget(yarn.position);

    // Verify yarn is still there
    if (!yarn.isActive()) {
      yarn._removePlayingCat(this.id);
      return;
    }

    // Play session: batting and chasing
    const playDuration = personality.energy * 10000; // 0-10 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < playDuration && yarn.isActive()) {
      // Bat at yarn
      await this._brain._executeBehavior("batting");

      // Apply force to yarn
      const force = {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
      };
      yarn.applyForce(force);

      // If yarn is now rolling, chase it
      if (yarn.state === "rolling") {
        await this._brain._approachTarget(yarn.position, {
          behavior: "chasing",
        });
      }

      // Short pause between interactions
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000)
      );
    }

    // Done playing
    yarn._removePlayingCat(this.id);

    // Trigger lifecycle hook
    await hookManager._trigger("afterInteractionEnd", {
      catId: this.id,
      interactionId: yarnId,
      interactionType: "yarn",
    });
  }
}
````

**Testing:**

- Cat evaluates interest in yarn
- Cat approaches yarn if interested
- Cat bats yarn (applies force)
- Cat chases rolling yarn
- Play duration based on personality
- Lifecycle hooks fire correctly

---

#### Task 9: Brain Integration for Yarn and Laser

**Status:** Not started  
**Estimated Time:** 2 hours  
**Dependencies:** Tasks 1-8 (requires all SDK components)

**Current State:**

- ✅ Brain class exists with need detection from Phase 1
- ❌ No `_checkNearbyYarns()` method
- ❌ No `_setupYarnListener()` method
- ❌ No `_handleYarnPlaced()` handler
- ❌ No `_handleYarnMoved()` handler
- ❌ evaluateInterest() missing water and yarn logic

**Files to Modify:**

- `meowzer/meowbrain/brain.ts`

**Changes Required:**

```typescript
// In constructor, add listeners
constructor(cat: Cat, options: BrainOptions = {}) {
  // ... existing initialization

  // Listen to cat events (existing)
  this.cat.on("boundaryHit", this._handleBoundaryHit.bind(this));

  // Listen for need placement events (existing from Phase 1)
  this._setupNeedListener();

  // NEW: Listen for yarn events
  this._setupYarnListener();

  // NEW: Listen for laser events
  this._setupLaserListener();
}

// Add helper methods

/**
 * Check for nearby yarns (polling)
 * @internal
 */
private _checkNearbyYarns(): Array<{
  type: string;
  position: Position;
  id: string;
  state: string;
}> {
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (!interactions) return [];

    const yarns = interactions.getYarnsNearPosition(this.cat.position);
    return yarns.map((yarn: any) => ({
      type: "yarn",
      position: yarn.position,
      id: yarn.id,
      state: yarn.state,
    }));
  } catch {
    return [];
  }
}

/**
 * Setup listener for yarn placement (broadcast)
 * @internal
 */
private _setupYarnListener(): void {
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (interactions) {
      interactions.on("yarnPlaced", this._handleYarnPlaced.bind(this));
      interactions.on("yarnMoved", this._handleYarnMoved.bind(this));
    }
  } catch {
    // Interactions not available
  }
}

/**
 * Handle yarn placed event
 * @internal
 */
private _handleYarnPlaced = (event: {
  id: string;
  position: Position;
}): void => {
  if (!this._running || this._destroyed) return;

  const dist = Math.hypot(
    event.position.x - this.cat.position.x,
    event.position.y - this.cat.position.y
  );

  const detectionRange = 150;

  if (dist <= detectionRange) {
    const interest = this.evaluateInterest({
      type: "yarn",
      position: event.position,
    });

    if (interest > 0.6 && this._personality.curiosity > 0.5) {
      this._emit("reactionTriggered", {
        type: "yarnDetected",
        yarnId: event.id,
        interest,
      });
    }
  }
};

/**
 * Handle yarn movement (important for chasing)
 * @internal
 */
private _handleYarnMoved = (event: {
  id: string;
  position: Position;
  state: string;
  velocity?: { x: number; y: number };
}): void => {
  if (!this._running || this._destroyed) return;

  // Only react to rolling yarn (moving target)
  if (event.state !== "rolling") return;

  const dist = Math.hypot(
    event.position.x - this.cat.position.x,
    event.position.y - this.cat.position.y
  );

  const detectionRange = 200; // Larger for moving objects

  if (dist <= detectionRange) {
    const interest = this.evaluateInterest({
      type: "yarn",
      position: event.position,
    });

    // Moving yarn is more interesting
    const adjustedInterest = interest * 1.3;

    if (adjustedInterest > 0.7 && this._personality.energy > 0.4) {
      this._emit("reactionTriggered", {
        type: "yarnMoving",
        yarnId: event.id,
        interest: adjustedInterest,
      });
    }
  }
};

/**
 * Setup listener for laser events
 * @internal
 */
private _setupLaserListener(): void {
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (interactions) {
      // Note: Laser events come from LaserPointer instance, not InteractionManager
      // We'll need to listen to individual laser instances
      // This will be handled when laser is created
    }
  } catch {
    // Not available
  }
}

// Update _makeDecision to check for yarns
private async _makeDecision(): Promise<void> {
  // ... existing code ...

  // Calculate behavior weights
  const weights = calculateBehaviorWeights(
    this._personality,
    this._state.motivation,
    this._memory,
    this._environment
  );

  // Check for nearby needs (existing from Phase 1)
  const nearbyNeeds = this._checkNearbyNeeds();
  if (nearbyNeeds.length > 0) {
    const nearest = nearbyNeeds[0];
    const interest = this.evaluateInterest(nearest);
    if (interest > 0.5) {
      weights.approaching += interest * 2;
    }
  }

  // NEW: Check for nearby yarns
  const nearbyYarns = this._checkNearbyYarns();
  if (nearbyYarns.length > 0) {
    const nearest = nearbyYarns[0];
    const interest = this.evaluateInterest(nearest);

    if (interest > 0.5) {
      // Moving yarn triggers chasing, idle yarn triggers approaching
      if (nearest.state === "rolling") {
        weights.chasing += interest * 2.5;
      } else {
        weights.approaching += interest * 1.5;
      }
    }
  }

  // Choose a behavior (existing code)
  let chosenBehavior = chooseBehavior(weights);

  // ... rest of existing code ...
}

// Update destroy to clean up listeners
destroy(): void {
  if (this._destroyed) return;

  this.stop();

  // Clean up need listener (existing)
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];
    if (interactions) {
      interactions.off("needPlaced", this._handleNeedPlaced);
      // NEW: Clean up yarn listeners
      interactions.off("yarnPlaced", this._handleYarnPlaced);
      interactions.off("yarnMoved", this._handleYarnMoved);
    }
  } catch {
    // Ignore
  }

  this._destroyed = true;
  this.events.clear();
}

// Add evaluateInterest handling for yarn
evaluateInterest(target: {
  type: string;
  position: Position;
  state?: string;
}): number {
  // ... existing code for food/water ...

  // NEW: Yarn interest
  if (target.type === "yarn") {
    let interest = 0.5 + this._personality.curiosity * 0.3;

    // Moving yarn is more interesting
    if (target.state === "rolling" || target.state === "dragging") {
      interest *= 1.5;
    }

    // Playful cats more interested
    interest += this._personality.energy * 0.2;

    // Reduce for independence
    interest *= 1 - this._personality.independence * 0.3;

    // Clamp to 0-1
    return Math.max(0, Math.min(1, interest));
  }

  // ... existing code ...
}
```

**Status:** Not started

---

### UI Tasks (6 tasks)

#### Task 10: Water Placement UI

**Status:** Not started (deferred to combined interactions panel - Task 13)

---

#### Task 11: Yarn Placement UI

**Status:** Not started (deferred to combined interactions panel - Task 13)

---

#### Task 12: Laser Pointer UI Controls

**Status:** Not started (deferred to combined interactions panel - Task 13)

---

#### Task 13: Interactions Panel Component

**Status:** Not started  
**Estimated Time:** 2-3 hours  
**Dependencies:** Tasks 1-9 (SDK must be complete for testing)

**Current State:**

- ❌ Component does not exist: `meowzer/ui/components/mb-interactions-panel/`
- ❌ Not exported in `meowzer/ui/components/index.ts`

**Files to Create:**

- `meowzer/ui/components/mb-interactions-panel/mb-interactions-panel.ts`
- `meowzer/ui/components/mb-interactions-panel/mb-interactions-panel.style.ts`
- `meowzer/ui/components/mb-interactions-panel/index.ts`

**Implementation:** Create comprehensive interactions panel with:

- **Needs Section**: Basic Food, Fancy Food, Water (with icons)
- **Toys Section**: Laser Pointer, Yarn (with icons)
- **Phase 3 Preview** (disabled with "Soon" badge): RC Car
- Click handlers for each interaction type
- Placement mode for needs/yarn (click to place)
- Laser mode with cursor tracking
- Quiet UI components: `quiet-button`, `quiet-dialog`, `quiet-badge`
- Use MeowzerContext to access SDK
- Proper cleanup on disconnect

**Testing:**

- Panel opens/closes correctly
- All interaction buttons clickable
- Placement modes work (cursor changes, click to place)
- Laser tracking works smoothly
- Phase 3 items disabled but visible

---

#### Task 14: Add Interactions Button to Playground

**Status:** Not started  
**Estimated Time:** 30 minutes  
**Dependencies:** Task 13 (interactions panel must exist)

**Current State:**

- ✅ Playground component exists with creator/stats buttons
- ❌ No interactions button

**Files to Modify:**

- `meowzer/ui/components/mb-cat-playground/mb-cat-playground.ts`
- `meowzer/ui/components/index.ts` (export new panel component)

**Changes:**

- Add interactions button to global actions (bottom-right, next to stats/creator buttons)
- Icon: sparkles (✨) or toy icon
- Opens `<mb-interactions-panel>` dialog
- Wire up to MeowzerContext
- Follow existing button patterns

**Testing:**

- Button appears in correct position
- Clicking opens interactions panel
- Panel has access to Meowzer SDK instance

---

#### Task 15: Visual Need/Toy Rendering Components

**Status:** Not started  
**Estimated Time:** 2 hours  
**Dependencies:** Tasks 2, 3 (Yarn class and SDK integration)

**Current State:**

- ✅ `mb-need-visual` component may exist from Phase 1 (verify)
- ❌ No yarn visual component
- ❌ No laser visual component

**Files to Create:**

- `meowzer/ui/components/mb-yarn-visual/mb-yarn-visual.ts` (new)
- `meowzer/ui/components/mb-yarn-visual/mb-yarn-visual.style.ts` (new)
- `meowzer/ui/components/mb-laser-visual/mb-laser-visual.ts` (new)
- `meowzer/ui/components/mb-laser-visual/mb-laser-visual.style.ts` (new)

**Implementation:**

- Create visual components that listen to SDK events
- Render SVG at absolute positions (position: absolute)
- Animate transitions:
  - Yarn: idle ball → dragging → rolling with motion blur
  - Laser: red dot with glow/pulse effect
- Handle state changes (yarn moving, laser on/off)
- Handle removal and cleanup
- Use Quiet UI styling patterns (CSS custom properties)
- Performance: Use transform for position updates

**Testing:**

- Visuals render at correct positions
- Yarn shows physics (rolling, dragging states)
- Laser dot follows cursor smoothly
- Cleanup on removal (no memory leaks)
- Multiple instances work correctly

---

## Type Definitions

**Current State:**

- ✅ Base types exist: `NeedTypeIdentifier`, `PlaceNeedOptions`, `NeedData`, laser types
- ❌ Yarn types missing (YarnState, YarnMovedEvent, YarnResponseEvent, etc.)

**File:** `meowzer/types/sdk/interactions.ts`

Add the following types:

```typescript
// Yarn types
export type YarnState = "idle" | "dragging" | "rolling";

export interface YarnMovedEvent {
  id: string;
  position: Position;
  state: YarnState;
  velocity?: { x: number; y: number };
  timestamp: number;
}

export interface YarnResponseEvent {
  catId: string;
  yarnId: string;
  responseType:
    | "noticed"
    | "batting"
    | "pouncing"
    | "carrying"
    | "playing"
    | "ignoring";
  duration?: number;
  timestamp: number;
}

export interface YarnPlacedEvent {
  id: string;
  position: Position;
  timestamp: number;
}

export interface YarnRemovedEvent {
  id: string;
  timestamp: number;
}

// Laser response types
export interface LaserResponseEvent {
  catId: string;
  laserId: string;
  responseType:
    | "noticed"
    | "stalking"
    | "pouncing"
    | "chasing"
    | "lost-interest";
  attentionLevel: number; // 0-1
  timestamp: number;
}

export interface YarnOptions {
  duration?: number; // Auto-remove after duration (ms)
  friction?: number; // Physics friction coefficient (default: 0.95)
}
```

---

## Configuration Updates

**Current State:**

- ✅ `InteractionConfig` interface exists with `detectionRanges` and `responseRates`
- ✅ `detectionRanges` already includes `yarn: 150`
- ✅ `responseRates` includes water: 0.5
- ❌ Missing `yarn` config object for friction/maxVelocity

**File:** `meowzer/sdk/config.ts`

```typescript
// Update InteractionConfig interface (PARTIAL - yarn config section needs adding)
export interface InteractionConfig {
  enabled: boolean;
  detectionRanges: {
    need: number; // 150
    laser: number; // 200
    rcCar: number; // 250
    yarn: number; // 150 (ALREADY EXISTS ✅)
  };
  responseRates: {
    basicFood: number; // 0.7
    fancyFood: number; // 0.9
    water: number; // 0.5
  };
  yarn?: {
    friction: number; // 0.95 (NEW)
    maxVelocity: number; // 300 (NEW)
  };
}

// Update default config
const DEFAULT_CONFIG: MeowzerConfig = {
  // ... existing config
  interactions: {
    enabled: true,
    detectionRanges: {
      need: 150,
      laser: 200,
      rcCar: 250,
      yarn: 150, // NEW
    },
    responseRates: {
      basicFood: 0.7,
      fancyFood: 0.9,
      water: 0.5,
    },
    yarn: {
      friction: 0.95,
      maxVelocity: 300,
    },
  },
};
```

---

## Testing Checklist

### Water Testing

- [ ] Place water - verify event emission
- [ ] Cat responds after playing/exploring
- [ ] Personality affects water interest
- [ ] Water persists correctly
- [ ] Manual removal works
- [ ] Multiple cats can drink from same water
- [ ] Lifecycle hooks fire correctly

### Yarn Testing

- [ ] Place yarn - verify static placement
- [ ] Drag yarn - verify dragging state and events
- [ ] Release yarn - verify rolling physics
- [ ] Cat bats yarn - verify force application
- [ ] Cat chases moving yarn
- [ ] Cat loses interest after time
- [ ] Yarn friction/velocity decay works
- [ ] Multiple cats interact with same yarn
- [ ] Yarn boundary collision works
- [ ] Yarn auto-removal (if duration set)
- [ ] Lifecycle hooks fire correctly

### Laser Testing

- [ ] Turn on laser - verify activation event
- [ ] Move laser - verify movement events
- [ ] Cat detects laser within range
- [ ] Cat chases laser (chasing behavior)
- [ ] Personality affects chase duration
- [ ] Turn off laser - cat stops chasing
- [ ] Multiple cats chase same laser
- [ ] Attention span/fatigue works

### Behavior Testing

- [ ] Chasing behavior triggers correctly
- [ ] Batting behavior triggers correctly
- [ ] Chasing interrupts other behaviors
- [ ] Cats fatigue after extended chasing
- [ ] Behavior transitions valid (chasing→batting, etc.)
- [ ] Motivation updates correct for new behaviors
- [ ] Decision engine weights correct

### UI Testing

- [ ] Interactions panel opens/closes
- [ ] Water button places water
- [ ] Yarn button enables placement mode
- [ ] Drag yarn works (click-drag-release)
- [ ] Laser button enables laser mode
- [ ] Laser tracks mouse cursor
- [ ] Visual SVGs render correctly
- [ ] SVG transitions work (default→active)
- [ ] Interactions cleanup on destroy
- [ ] Panel integrates with playground

---

## Estimated Time

- **SDK Tasks (1-9):** 6-8 hours

  - Task 1 (Water): 30 minutes
  - Task 2 (Yarn Class): 2 hours
  - Task 3 (InteractionManager): 1 hour
  - Task 4 (Hooks): 30 minutes
  - Task 5-6 (Behaviors): 1 hour
  - Task 7 (Decision Engine): 1 hour
  - Task 8 (playWithYarn): 1 hour
  - Task 9 (Brain Integration): 2 hours

- **UI Tasks (10-15):** 4-6 hours

  - Task 13 (Interactions Panel): 2-3 hours
  - Task 14 (Playground Button): 30 minutes
  - Task 15 (Visual Components): 2 hours

- **Testing & Polish:** 2-3 hours

- **Total:** 12-17 hours

---

## Dependencies

**Phase 2 depends on Phase 1:**

- ✅ InteractionManager base structure
- ✅ Need class and lifecycle hooks
- ✅ Brain `evaluateInterest()` method
- ✅ Approaching and consuming behaviors
- ✅ Event system integration
- ✅ LaserPointer class (manual control)

**Phase 2 enables Phase 3:**

- Yarn physics system will be reused for RC car
- Chasing behavior will be used for RC car responses
- Interaction panel structure extends to RC car controls
- Batting behavior foundation for RC car interactions

---

## Notes

- Water is simpler than food (no "basic" vs "fancy" variants)
- Yarn physics should be simple but realistic (friction, velocity decay, boundary collision)
- Laser chasing should feel responsive and fun
- All Phase 2 features must maintain backward compatibility
- UI components must use Quiet UI exclusively
- SVG assets must exist before UI implementation
- Plugin compatibility must be tested with sample plugins
- Behavior transitions must feel natural and not jarring
- Consider adding fatigue/stamina mechanic for extended play sessions

---

## Implementation Status Summary

### ✅ Ready to Start (Foundation Complete)

- Config system with yarn detection range
- Hook infrastructure for yarn lifecycle
- Need system supports water type
- Behavior and decision engine architecture in place

### 🔨 To Be Implemented (0/15 tasks complete)

- **SDK Core** (9 tasks): Types, Yarn class, behaviors, decision engine, brain integration
- **UI Components** (6 tasks): Interactions panel, visual components, playground integration

### 🎯 Critical Path

1. **Week 1**: SDK implementation (Tasks 1-9) - 6-8 hours
2. **Week 2**: UI implementation (Tasks 13-15) - 4-6 hours
3. **Week 3**: Testing and polish - 2-3 hours

---

## Next Steps

1. **Begin with Phase 2.1** (Core Types & Infrastructure):

   - Task 1: Water evaluation logic in Brain
   - Task 4: Add yarn hook constants
   - Update types for yarn events

2. **Continue with Phase 2.2** (Behaviors):

   - Tasks 5-7: Add chasing/batting behaviors and update decision engine

3. **Implement Phase 2.3** (Yarn System):

   - Tasks 2-3: Create Yarn class and add to InteractionManager

4. **Integrate Phase 2.4** (Brain & Cat):

   - Tasks 8-9: Add playWithYarn() and brain yarn detection

5. **Build Phase 2.5** (UI):

   - Tasks 13-15: Create interactions panel and visual components

6. **Test and document**:
   - Run full testing checklist
   - Update API documentation
   - Create Phase 3 plan
