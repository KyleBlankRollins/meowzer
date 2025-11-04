# Phase 1 Implementation Status

**Date:** November 4, 2025  
**Feature:** Cat Interactions System - Phase 1 (MVP)  
**Branch:** pattern-updates

## Overview

Phase 1 implementation focuses on:

- Food placement (basic + fancy types)
- Laser pointer (manual control only)
- InteractionManager base structure
- New lifecycle hooks
- Brain behavior extensions (approaching, consuming)

## Implementation Progress

### ✅ Completed Tasks (8/15)

#### 1. ✅ Interaction Types (TypeScript Definitions)

**File:** `meowzer/types/sdk/interactions.ts`  
**Status:** Complete

Created comprehensive type definitions including:

- `NeedTypeIdentifier`: `"food:basic" | "food:fancy" | "water"`
- `NeedPlacedEvent`, `NeedRemovedEvent`, `NeedResponseEvent`
- `LaserPattern`, `LaserMovedEvent`, `LaserResponseEvent`
- `InteractionConfig` with `DetectionRanges` and `ResponseRates`
- All types exported from `meowzer/types/index.ts`

#### 2. ✅ Lifecycle Hooks

**File:** `meowzer/sdk/managers/hook-manager.ts`  
**Status:** Complete

Added 8 new lifecycle hooks to `LifecycleHook` constant:

- `BEFORE_NEED_PLACE` / `AFTER_NEED_PLACE`
- `BEFORE_NEED_REMOVE` / `AFTER_NEED_REMOVE`
- `BEFORE_INTERACTION_START` / `AFTER_INTERACTION_START`
- `BEFORE_INTERACTION_END` / `AFTER_INTERACTION_END`

Added corresponding TypeScript context interfaces:

- `NeedPlaceHookContext`
- `NeedRemoveHookContext`
- `InteractionHookContext`

#### 3. ✅ Interaction Configuration

**File:** `meowzer/sdk/config.ts`  
**Status:** Complete

Added required `interactions` config to `MeowzerConfig`:

```typescript
interactions: {
  enabled: true,
  detectionRanges: {
    need: 150,
    laser: 200,
    rcCar: 250,
    yarn: 150,
  },
  responseRates: {
    basicFood: 0.7,
    fancyFood: 0.9,
    water: 0.5,
  },
}
```

Updated `mergeConfig()` to handle deep merging of interaction config.

#### 4. ✅ New Behavior Types

**Files:**

- `meowzer/meowbrain/behaviors.ts`
- `meowzer/types/cat/behavior.ts`

**Status:** Complete

Added two new behavior types:

- `approaching`: Cat moves toward target (food, toy, etc.)
- `consuming`: Cat eats/drinks at location

Implemented behavior functions with appropriate durations:

- `approaching`: 2000-4000ms
- `consuming`: 3000-6000ms (with required rest after)

#### 5. ✅ Decision Engine Updates

**File:** `meowzer/meowbrain/decision-engine.ts`  
**Status:** Complete with minor fix needed

Updated `BehaviorWeights` interface and `calculateBehaviorWeights()`.

Added motivation updates for new behaviors in `updateMotivations()`:

- `approaching`: Light activity, slight fatigue
- `consuming`: Satisfies rest and stimulation needs

Updated `isValidBehaviorTransition()` with rules:

- `approaching` and `consuming` can interrupt most behaviors
- After `consuming`, cat must transition to `resting`
- Valid transitions defined for all behavior combinations

**⚠️ Minor Fix Needed:** Line 260 has a TypeScript warning about type comparison in the transition check.

#### 6. ✅ Brain.evaluateInterest() Method

**File:** `meowzer/meowbrain/brain.ts`  
**Status:** Complete

Implemented comprehensive interest evaluation:

- Returns 0-1 interest level based on:
  - Personality traits (energy, curiosity, independence)
  - Current behavior state
  - Need type (basic food, fancy food, water)
  - Distance from need
  - Current motivations

Added internal methods:

- `_approachTarget()`: Trigger approaching behavior
- `_consumeNeed()`: Trigger consuming behavior

#### 7. ✅ Need Class

**File:** `meowzer/sdk/interactions/need.ts`  
**Status:** Complete

Full-featured Need class with:

- Position, type, timestamp tracking
- Active state management
- Consuming cats tracking (`_addConsumingCat`, `_removeConsumingCat`)
- Auto-removal with optional duration
- Event emission (consumed, removed)
- Cleanup on removal

#### 8. ✅ InteractionManager

**File:** `meowzer/sdk/managers/interaction-manager.ts`  
**Status:** Complete with minor cleanup needed

Implemented core functionality:

- `placeNeed()`: Async, triggers hooks, emits events
- `removeNeed()`: Async, triggers hooks, cleanup
- `getNeed()`, `getAllNeeds()`, `getNeedsByType()`
- `getNeedsNearPosition()`: Uses config detection ranges
- `_registerCatResponse()`: Track cat interactions
- Event system integration
- Debug info methods

**⚠️ Minor Cleanup Needed:** Unused `cats` property (line 40)

---

### 🟡 In Progress (1/15)

#### 9. 🟡 Add InteractionManager to Meowzer SDK

**File:** `meowzer/sdk/meowzer-sdk.ts`  
**Status:** Not started

**Required Changes:**

1. Import InteractionManager
2. Add `public readonly interactions: InteractionManager;` property
3. Instantiate in constructor: `this.interactions = new InteractionManager(this.hooks, this.cats, this._config);`
4. Register globally in `init()`: `(globalThis as any)[Symbol.for("meowzer.interactions")] = this.interactions;`
5. Cleanup in `destroy()`: `await this.interactions._cleanup();`
6. Add to PluginContext in `plugin.ts`

---

### ⬜ Remaining Tasks (6/15)

#### 10. ⬜ Add respondToNeed() to MeowzerCat

**File:** `meowzer/sdk/meowzer-cat.ts`  
**Status:** Not started

**Required Implementation:**

```typescript
async respondToNeed(needId: string): Promise<void> {
  const interactionManager = this._getInteractionManager();
  const need = interactionManager.getNeed(needId);

  if (!need || !need.isActive()) return;

  // Evaluate interest
  const interest = this._brain.evaluateInterest(need);

  if (interest > 0.5) {
    // Personality-based delay
    const delay = this._personality.independence * 2000; // 0-2 seconds

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Trigger lifecycle hook
    await this._getHookManager()._trigger("beforeInteractionStart", {
      catId: this.id,
      interactionId: needId,
      interactionType: "need",
    });

    // Register response
    interactionManager._registerCatResponse(this.id, needId, "interested");

    // Approach the need
    interactionManager._registerCatResponse(this.id, needId, "approaching");
    await this._brain._approachTarget(need.position);

    // Consume
    interactionManager._registerCatResponse(this.id, needId, "consuming");
    need._addConsumingCat(this.id);
    await this._brain._consumeNeed();

    // Satisfied
    need._removeConsumingCat(this.id);
    interactionManager._registerCatResponse(this.id, needId, "satisfied");

    // Trigger lifecycle hook
    await this._getHookManager()._trigger("afterInteractionEnd", {
      catId: this.id,
      interactionId: needId,
      interactionType: "need",
    });
  } else {
    interactionManager._registerCatResponse(this.id, needId, "ignoring");
  }
}

private _getInteractionManager(): InteractionManager {
  const globalKey = Symbol.for("meowzer.interactions");
  const interactions = (globalThis as any)[globalKey];

  if (!interactions) {
    throw new Error("Interactions not initialized");
  }

  return interactions;
}

private _getHookManager(): HookManager {
  // Similar to _getInteractionManager
  const globalKey = Symbol.for("meowzer.hooks");
  return (globalThis as any)[globalKey];
}
```

#### 11. ⬜ Integrate Need Detection in Brain

**File:** `meowzer/meowbrain/brain.ts`  
**Status:** Not started

**Required Changes in `_makeDecision()` method:**

Add need checking after behavior weight calculation:

```typescript
private async _makeDecision(): Promise<void> {
  // ... existing code ...

  // Calculate behavior weights
  const weights = calculateBehaviorWeights(
    this._personality,
    this._state.motivation,
    this._memory,
    this._environment
  );

  // NEW: Check for nearby needs
  const nearbyNeeds = this._checkNearbyNeeds();
  if (nearbyNeeds.length > 0) {
    // Evaluate interest in nearest need
    const nearest = nearbyNeeds[0];
    const interest = this.evaluateInterest(nearest);

    if (interest > 0.5) {
      // Boost approaching behavior weight
      weights.approaching += interest * 2;
    }
  }

  // Choose a behavior (existing code)
  let chosenBehavior = chooseBehavior(weights);

  // ... rest of existing code ...
}

private _checkNearbyNeeds(): Array<{ type: string; position: Position }> {
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (!interactions) return [];

    const needs = interactions.getNeedsNearPosition(this.cat.position);
    return needs.map((need: any) => ({
      type: need.type,
      position: need.position,
      id: need.id,
    }));
  } catch {
    return [];
  }
}
```

#### 12. ⬜ Add Need Broadcast Listener to Brain

**File:** `meowzer/meowbrain/brain.ts`  
**Status:** Not started

**Required Changes in constructor:**

```typescript
constructor(cat: Cat, options: BrainOptions = {}) {
  // ... existing initialization ...

  // Listen to cat events (existing)
  this.cat.on("boundaryHit", this._handleBoundaryHit.bind(this));

  // NEW: Listen for need placement events
  this._setupNeedListener();
}

private _setupNeedListener(): void {
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (interactions) {
      interactions.on("needPlaced", (event: any) => {
        this._handleNeedPlaced(event);
      });
    }
  } catch {
    // Interactions not available
  }
}

private _handleNeedPlaced(event: { id: string; type: string; position: Position }): void {
  if (!this._running || this._destroyed) return;

  // Check if need is nearby
  const dist = Math.hypot(
    event.position.x - this.cat.position.x,
    event.position.y - this.cat.position.y
  );

  const detectionRange = 150; // From config

  if (dist <= detectionRange) {
    // Evaluate immediate interest
    const interest = this.evaluateInterest({
      type: event.type,
      position: event.position,
    });

    // If very interested, interrupt current behavior
    if (interest > 0.7 && this._personality.independence < 0.5) {
      // Trigger cat response (will be implemented in MeowzerCat)
      this._emit("reactionTriggered", {
        type: "needDetected",
        needId: event.id,
        interest,
      });
    }
  }
}
```

**Required Changes in destroy():**

```typescript
destroy(): void {
  if (this._destroyed) return;

  this.stop();

  // NEW: Clean up need listener
  try {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];
    if (interactions) {
      interactions.off("needPlaced", this._handleNeedPlaced);
    }
  } catch {
    // Ignore
  }

  this._destroyed = true;
  this.events.clear();
}
```

#### 13. ⬜ Create LaserPointer Class

**File:** `meowzer/sdk/interactions/laser-pointer.ts` (new file)  
**Status:** Not started

**Required Implementation:**

```typescript
import type {
  Position,
  LaserPattern,
  LaserPatternOptions,
} from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

export type LaserEvent =
  | "moved"
  | "activated"
  | "deactivated"
  | "patternStarted"
  | "patternStopped";

export class LaserPointer {
  readonly id: string;
  private _active: boolean = false;
  private _position: Position = { x: 0, y: 0 };
  private _previousPosition?: Position;
  private _pattern?: LaserPattern;
  private _patternAnimation?: number;
  private _events: EventEmitter<LaserEvent>;

  constructor(id: string) {
    this.id = id;
    this._events = new EventEmitter<LaserEvent>();
  }

  get isActive(): boolean {
    return this._active;
  }

  get position(): Position {
    return { ...this._position };
  }

  turnOn(position: Position): void {
    this._active = true;
    this._position = { ...position };
    this._events.emit("activated", {
      id: this.id,
      position: this._position,
      timestamp: Date.now(),
    });
  }

  turnOff(): void {
    this._active = false;
    this.stopPattern();
    this._events.emit("deactivated", {
      id: this.id,
      timestamp: Date.now(),
    });
  }

  moveTo(position: Position): void {
    if (!this._active) return;

    this._previousPosition = { ...this._position };
    this._position = { ...position };

    const velocity = this._previousPosition
      ? {
          x: position.x - this._previousPosition.x,
          y: position.y - this._previousPosition.y,
        }
      : { x: 0, y: 0 };

    this._events.emit("moved", {
      id: this.id,
      position: this._position,
      previousPosition: this._previousPosition,
      velocity,
      timestamp: Date.now(),
    });
  }

  startPattern(
    pattern: LaserPattern,
    options?: LaserPatternOptions
  ): void {
    // Phase 1: Manual only, patterns in Phase 3
    console.warn("Auto-patterns not implemented in Phase 1");
  }

  stopPattern(): void {
    if (this._patternAnimation) {
      cancelAnimationFrame(this._patternAnimation);
      this._patternAnimation = undefined;
    }
  }

  on(event: LaserEvent, handler: EventHandler): void {
    this._events.on(event, handler);
  }

  off(event: LaserEvent, handler: EventHandler): void {
    this._events.off(event, handler);
  }

  destroy(): void {
    this.turnOff();
    this._events.clear();
  }
}
```

#### 14. ⬜ Add createLaserPointer() to Meowzer SDK

**File:** `meowzer/sdk/meowzer-sdk.ts`  
**Status:** Not started

**Required Changes:**

````typescript
import { LaserPointer } from "./interactions/laser-pointer.js";

export class Meowzer {
  // ... existing properties ...

  /**
   * Create a new laser pointer
   *
   * Returns LaserPointer instance for control.
   * UI package is responsible for rendering.
   *
   * @example
   * ```ts
   * const laser = meowzer.createLaserPointer();
   * laser.turnOn({ x: 500, y: 300 });
   * laser.moveTo({ x: 600, y: 400 });
   * ```
   */
  createLaserPointer(): LaserPointer {
    const id = `laser-${Date.now()}-${Math.random()}`;
    const laser = new LaserPointer(id);

    // Register with interaction manager if available
    // (InteractionManager will track lasers in future phases)

    return laser;
  }
}
````

#### 15. ✅ Export Types from Types Package

**File:** `meowzer/types/index.ts`  
**Status:** Complete

All interaction types exported and available.

---

## Minor Fixes Required

### 1. InteractionManager - Unused Property

**File:** `meowzer/sdk/managers/interaction-manager.ts` (Line 40)  
**Issue:** `private cats: CatManager;` is declared but never used

**Fix:**
Either remove the property or use it in future methods. Since it's part of the constructor dependency injection and may be needed for spatial queries in the future, it can stay with a comment:

```typescript
private cats: CatManager; // Will be used for cat proximity queries
```

Or add an ESLint ignore comment:

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
private cats: CatManager;
```

### 2. Decision Engine - Type Comparison Warning

**File:** `meowzer/meowbrain/decision-engine.ts` (Line 260)  
**Issue:** TypeScript warning about type comparison that will never match

**Current Code:**

```typescript
if (from === "consuming" && to !== "resting") return false;
```

**Problem:** The type narrowing makes `to` only have types that don't include "resting" at this point.

**Fix:** Move this check earlier in the function:

```typescript
export function isValidBehaviorTransition(
  from: BehaviorType,
  to: BehaviorType
): boolean {
  // After consuming, must rest
  if (from === "consuming" && to !== "resting") return false;

  // Any behavior can transition to resting
  if (to === "resting") return true;

  // Approaching and consuming can interrupt most behaviors (need-driven)
  if (to === "approaching" || to === "consuming") return true;

  // Define valid transitions
  // ... rest of code
}
```

---

## Testing Checklist

Once all tasks are complete, test the following scenarios:

### Food Placement & Response

- [ ] Place basic food - verify event emission
- [ ] Place fancy food - verify higher response rate
- [ ] Place water - verify cats respond after activity
- [ ] Verify lifecycle hooks fire correctly
- [ ] Verify multiple cats can consume same food
- [ ] Test auto-removal with duration option
- [ ] Test manual removal

### Brain Behavior Integration

- [ ] Verify `approaching` behavior triggers correctly
- [ ] Verify `consuming` behavior triggers correctly
- [ ] Verify cats rest after consuming
- [ ] Verify personality affects response (aloof vs playful)
- [ ] Verify distance affects interest
- [ ] Verify current state affects interest
- [ ] Test hybrid detection (broadcast + polling)

### Laser Pointer

- [ ] Create laser pointer
- [ ] Turn on/off
- [ ] Move laser - verify events
- [ ] Manual control only (patterns disabled)

### Edge Cases

- [ ] Cat destroyed during approach
- [ ] Need removed during approach
- [ ] Multiple needs near cat
- [ ] SDK destroyed during interaction
- [ ] Config validation

---

## Next Steps

1. **Fix minor issues** (estimated: 5 minutes)

   - Add comment or suppress warning for unused `cats` property
   - Reorder type check in `isValidBehaviorTransition()`

2. **Complete Task 9** - Add InteractionManager to SDK (estimated: 15 minutes)

   - Update meowzer-sdk.ts
   - Update plugin.ts for PluginContext
   - Test initialization

3. **Complete Task 10** - Add respondToNeed() (estimated: 30 minutes)

   - Implement full response flow
   - Handle personality-based delays
   - Hook integration

4. **Complete Tasks 11-12** - Brain integration (estimated: 45 minutes)

   - Need detection in decision loop
   - Broadcast listener setup
   - Event handling

5. **Complete Tasks 13-14** - Laser pointer (estimated: 30 minutes)

   - LaserPointer class
   - SDK integration
   - Event system

6. **Testing** (estimated: 1-2 hours)
   - Manual testing of all scenarios
   - Fix any discovered issues

**Total Estimated Time to Complete:** ~3-4 hours

---

## Notes

- All foundational work is complete (types, config, behaviors, managers)
- Remaining work is primarily integration and wiring
- No breaking changes to existing cat behavior when interactions are disabled
- Phase 2 and 3 features (water, yarn, RC car, auto-patterns) are not included
- UI package work is separate and not covered in this Phase 1 scope
