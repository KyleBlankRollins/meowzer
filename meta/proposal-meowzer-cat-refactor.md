# MeowzerCat Refactoring Proposal

**Date:** November 7, 2025  
**Status:** Proposal  
**Author:** Copilot (based on codebase analysis)

## Executive Summary

The current `MeowzerCat` class has grown to ~1,000 lines and exhibits several maintainability issues:

1. **God Object Anti-Pattern**: Single class handles too many responsibilities
2. **Global Dependency Injection**: Uses `globalThis` with Symbols for service location
3. **Mixed Concerns**: Business logic, event handling, DOM manipulation, persistence all in one file
4. **Low Cohesion**: Hat accessories, interactions, persistence, and core state mixed together
5. **Testing Challenges**: Hard to test in isolation due to global dependencies
6. **Tight Coupling**: Direct access to internal `_cat` and `_brain` properties throughout

**Recommendation:** Extract concerns into focused, composable modules using **dependency injection** and **composition over inheritance**.

---

## Breaking Changes Policy

**BREAKING CHANGES ARE ACCEPTABLE AND ENCOURAGED** when they result in:

- Better maintainability
- Clearer APIs
- Stronger type safety
- Easier testing
- Better performance

This is a greenfield project with 0 production users. We should prioritize the best architecture over backwards compatibility.

## Current Architecture Problems

### 1. God Object Anti-Pattern

The `MeowzerCat` class currently handles:

- Identity and metadata management
- Event system orchestration
- Lifecycle management (pause/resume/destroy)
- Interaction coordination (needs, yarn, laser)
- Accessory management (hats, outfits)
- Persistence operations (save/delete)
- DOM manipulation (sprite updates)
- Global service location

**Impact:**

- Hard to understand what a MeowzerCat "is" vs what it "does"
- Difficult to add new features without touching core class
- Testing requires mocking entire global state

### 2. Global Dependency Injection

```typescript
private _getStorageManager(): any {
  const globalKey = Symbol.for("meowzer.storage");
  const storage = (globalThis as any)[globalKey];
  if (!storage) {
    throw new Error("Storage not initialized...");
  }
  return storage;
}
```

**Problems:**

- Runtime dependency resolution (fails late)
- No compile-time type safety
- Hidden dependencies (not visible in constructor)
- Difficult to mock for testing
- Couples every cat to global SDK state

### 3. Mixed Concerns

**Accessory Management (~200 lines):**

```typescript
addHat(type, baseColor, accentColor) { ... }
removeHat() { ... }
updateHatColors(baseColor, accentColor) { ... }
hasHat() { ... }
getHat() { ... }
private _updateCatSprite() { ... }
```

**Interaction Coordination (~300 lines):**

```typescript
async respondToNeed(needId) { ... }
async playWithYarn(yarnId) { ... }
async chaseLaser(position) { ... }
async pet() { ... }
private async _handleBrainReaction(data) { ... }
```

**Persistence (~100 lines):**

```typescript
async save(options) { ... }
async delete() { ... }
private _markDirty() { ... }
get _needsSave() { ... }
_markClean() { ... }
```

These concerns have different:

- Change frequencies (accessories change rarely, interactions frequently)
- Dependencies (persistence needs storage, interactions need managers)
- Testing requirements (accessories need visual regression, interactions need async)

### 4. Event Forwarding Complexity

```typescript
private _setupEventForwarding(): void {
  this._cat.on("stateChange", (data) => {
    this._emit("stateChange", { id: this.id, state: data.newState });
  });

  this._brain.on("behaviorChange", (data) => {
    this._emit("behaviorChange", { id: this.id, behavior: data.newBehavior });
  });

  this._brain.on("reactionTriggered", (data) => {
    this._handleBrainReaction(data);
  });
}
```

Manually forwarding events from 2+ subsystems is error-prone and verbose.

---

## Proposed Architecture

### Core Principle: Composition Over Inheritance

Extract concerns into **focused modules** that:

- Have single responsibilities
- Declare dependencies explicitly
- Can be tested in isolation
- Are easy to extend/replace

### New Structure

```
meowzer-cat.ts (Core Identity - ~150 lines)
├── modules/
│   ├── cat-lifecycle.ts        (~100 lines)
│   ├── cat-persistence.ts      (~150 lines)
│   ├── cat-accessories.ts      (~200 lines)
│   ├── cat-interactions.ts     (~300 lines)
│   └── cat-events.ts           (~100 lines)
└── types/
    └── cat-modules.ts          (interfaces)
```

### 1. Core MeowzerCat (Identity Only)

**Responsibility:** Cat identity, basic metadata, coordinating modules

```typescript
export class MeowzerCat {
  // Identity (immutable)
  readonly id: string;
  readonly seed: string;
  readonly element: HTMLElement;

  // Mutable metadata
  private _name?: string;
  private _description?: string;
  private _metadata: CatMetadata;

  // Internal components (delegated)
  private _cat: Cat;
  private _brain: Brain;

  // Modules (composed)
  private lifecycle: CatLifecycle;
  private persistence: CatPersistence;
  private accessories: CatAccessories;
  private interactions: CatInteractions;
  private events: CatEvents;

  constructor(config: MeowzerCatConfig, managers: CatManagers) {
    // Initialize identity
    this.id = config.id;
    this.seed = config.seed;
    this._cat = config.cat;
    this._brain = config.brain;
    this.element = config.cat.element;

    // Initialize metadata
    this._name = config.name;
    this._description = config.description;
    this._metadata = {
      /* ... */
    };

    // Initialize modules with dependencies
    this.lifecycle = new CatLifecycle(this._cat, this._brain);
    this.persistence = new CatPersistence(
      this,
      managers.storage,
      managers.hooks
    );
    this.accessories = new CatAccessories(this._cat);
    this.interactions = new CatInteractions(
      this._cat,
      this._brain,
      managers.interactions,
      managers.hooks
    );
    this.events = new CatEvents(this._cat, this._brain);
  }

  // Delegate to modules
  pause() {
    this.lifecycle.pause();
  }
  resume() {
    this.lifecycle.resume();
  }
  destroy() {
    this.lifecycle.destroy();
  }

  async save(options) {
    await this.persistence.save(options);
  }
  async delete() {
    await this.persistence.delete();
  }

  addHat(type, base, accent) {
    this.accessories.addHat(type, base, accent);
  }
  removeHat() {
    this.accessories.removeHat();
  }

  async respondToNeed(id) {
    await this.interactions.respondToNeed(id);
  }
  async playWithYarn(id) {
    await this.interactions.playWithYarn(id);
  }

  on(event, handler) {
    this.events.on(event, handler);
  }
  off(event, handler) {
    this.events.off(event, handler);
  }
}
```

**Benefits:**

- Core class is ~150 lines (down from 1,000)
- Clear separation of concerns
- Dependencies explicit in constructor
- Easy to understand cat's core identity

---

### 2. CatLifecycle Module

**Responsibility:** Pause, resume, destroy, active state

```typescript
export class CatLifecycle {
  private cat: Cat;
  private brain: Brain;
  private _isActive: boolean = false;

  constructor(cat: Cat, brain: Brain) {
    this.cat = cat;
    this.brain = brain;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  pause(): void {
    if (!this._isActive) return;
    this.brain.stop();
    this.cat.pause();
    this._isActive = false;
  }

  resume(): void {
    if (this._isActive) return;
    this.cat.resume();
    this.brain.start();
    this._isActive = true;
  }

  destroy(): void {
    this.brain.stop();
    this.brain.destroy();
    this.cat.destroy();
    this._isActive = false;
  }
}
```

**Benefits:**

- Single responsibility
- No external dependencies
- Easy to test (mock Cat and Brain)
- Can add lifecycle hooks without touching core

---

### 3. CatPersistence Module

**Responsibility:** Storage operations, dirty tracking

```typescript
export class CatPersistence {
  private cat: MeowzerCat;
  private storage: StorageManager;
  private hooks: HookManager;
  private _isDirty: boolean = true;
  private _collectionName?: string;

  constructor(
    cat: MeowzerCat,
    storage: StorageManager,
    hooks: HookManager
  ) {
    this.cat = cat;
    this.storage = storage;
    this.hooks = hooks;
  }

  get isDirty(): boolean {
    return this._isDirty;
  }

  markDirty(): void {
    this._isDirty = true;
  }

  markClean(): void {
    this._isDirty = false;
  }

  setCollectionName(name: string): void {
    this._collectionName = name;
  }

  async save(options?: SaveOptions): Promise<void> {
    await this.storage.saveCat(this.cat, options);
  }

  async delete(): Promise<void> {
    await this.storage.deleteCat(this.cat.id);
    // Note: Destroy is handled by caller
  }
}
```

**Benefits:**

- Explicit storage dependency
- Testable with mock StorageManager
- Clear dirty tracking API
- No global state access

---

### 4. CatAccessories Module

**Responsibility:** Hat management, sprite updates

```typescript
export class CatAccessories {
  private cat: Cat;
  private eventEmitter: EventEmitter<AccessoryEvent>;

  constructor(cat: Cat) {
    this.cat = cat;
    this.eventEmitter = new EventEmitter();
  }

  addHat(
    type: HatType,
    baseColor: string,
    accentColor: string
  ): void {
    this.validateColors(baseColor, accentColor);

    if (!this.cat.protoCat.appearance.accessories) {
      this.cat.protoCat.appearance.accessories = {};
    }

    this.cat.protoCat.appearance.accessories.hat = {
      type,
      baseColor,
      accentColor,
    };

    this.updateSprite();
    this.eventEmitter.emit("hatApplied", {
      type,
      baseColor,
      accentColor,
    });
  }

  removeHat(): void {
    if (!this.hasHat()) return;

    delete this.cat.protoCat.appearance.accessories?.hat;
    this.updateSprite();
    this.eventEmitter.emit("hatRemoved", {});
  }

  updateHatColors(baseColor: string, accentColor: string): void {
    if (!this.hasHat()) return;

    this.validateColors(baseColor, accentColor);
    const hat = this.cat.protoCat.appearance.accessories!.hat!;
    hat.baseColor = baseColor;
    hat.accentColor = accentColor;

    this.updateSprite();
    this.eventEmitter.emit("hatUpdated", { ...hat });
  }

  hasHat(): boolean {
    return !!this.cat.protoCat.appearance.accessories?.hat;
  }

  getHat(): HatData | undefined {
    const hat = this.cat.protoCat.appearance.accessories?.hat;
    return hat ? { ...hat } : undefined;
  }

  on(event: AccessoryEvent, handler: EventHandler): void {
    this.eventEmitter.on(event, handler);
  }

  private updateSprite(): void {
    const newSpriteData = generateCatSVG(
      this.cat.protoCat.appearance,
      this.cat.protoCat.dimensions
    );

    this.cat.protoCat.spriteData = newSpriteData;

    const svgElement = this.cat._internalCat.dom?.getSVG();
    if (svgElement?.parentElement) {
      const temp = document.createElement("div");
      temp.innerHTML = newSpriteData.svg;
      const newSVG = temp.firstElementChild as SVGElement;
      if (newSVG) {
        svgElement.parentElement.replaceChild(newSVG, svgElement);
      }
    }
  }

  private validateColors(base: string, accent: string): void {
    if (!isValidColor(base)) {
      throw new Error(`Invalid base color: ${base}`);
    }
    if (!isValidColor(accent)) {
      throw new Error(`Invalid accent color: ${accent}`);
    }
  }
}
```

**Benefits:**

- Self-contained accessory logic
- Own event system
- No global dependencies
- Easy to extend (outfits, accessories)

---

### 5. CatInteractions Module

**Responsibility:** Coordinate cat responses to interactions

```typescript
export class CatInteractions {
  private cat: Cat;
  private brain: Brain;
  private catId: string;
  private interactions: InteractionManager;
  private hooks: HookManager;

  constructor(
    cat: Cat,
    brain: Brain,
    catId: string,
    interactions: InteractionManager,
    hooks: HookManager
  ) {
    this.cat = cat;
    this.brain = brain;
    this.catId = catId;
    this.interactions = interactions;
    this.hooks = hooks;

    // Setup brain reaction listener
    this.brain.on("reactionTriggered", this.handleBrainReaction);
  }

  async respondToNeed(needId: string): Promise<void> {
    const need = this.interactions.getNeed(needId);
    if (!need?.isActive()) return;

    const interest = this.brain.evaluateInterest(need);
    if (interest <= 0.5) {
      this.interactions._registerCatResponse(
        this.catId,
        needId,
        "ignoring"
      );
      return;
    }

    // Delay based on personality
    await this.delayBasedOnIndependence();
    if (!need.isActive()) return;

    // Trigger hooks
    await this.hooks._trigger("beforeInteractionStart", {
      catId: this.catId,
      interactionId: needId,
      interactionType: "need",
    });

    // Execute interaction sequence
    this.interactions._registerCatResponse(
      this.catId,
      needId,
      "interested"
    );
    this.interactions._registerCatResponse(
      this.catId,
      needId,
      "approaching"
    );

    await this.brain._approachTarget(need.position);

    if (!need.isActive()) {
      this.interactions._registerCatResponse(
        this.catId,
        needId,
        "interrupted"
      );
      return;
    }

    this.interactions._registerCatResponse(
      this.catId,
      needId,
      "consuming"
    );
    need._addConsumingCat(this.catId);
    await this.brain._consumeNeed();
    need._removeConsumingCat(this.catId);

    this.interactions._registerCatResponse(
      this.catId,
      needId,
      "satisfied"
    );

    await this.hooks._trigger("afterInteractionEnd", {
      catId: this.catId,
      interactionId: needId,
      interactionType: "need",
    });
  }

  async playWithYarn(yarnId: string): Promise<void> {
    // Similar structure...
  }

  async chaseLaser(position: Position): Promise<void> {
    // Similar structure...
  }

  private handleBrainReaction = async (data: any): Promise<void> => {
    if (
      data.type === "laserMoving" ||
      data.type === "laserDetected"
    ) {
      const laser = this.interactions.getActiveLaser();
      if (laser?.isActive) {
        await this.chaseLaser(laser.position);
      }
    } else if (data.type === "needDetected" && data.needId) {
      await this.respondToNeed(data.needId);
    } else if (data.type === "yarnDetected" && data.yarnId) {
      await this.playWithYarn(data.yarnId);
    }
  };

  private async delayBasedOnIndependence(): Promise<void> {
    const delay = this.brain.personality.independence * 2000;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  destroy(): void {
    this.brain.off("reactionTriggered", this.handleBrainReaction);
  }
}
```

**Benefits:**

- All interaction logic in one place
- Explicit dependencies
- Easier to test interaction sequences
- Can add new interactions without touching core

---

### 6. CatEvents Module

**Responsibility:** Event aggregation and forwarding

```typescript
export class CatEvents {
  private emitter: EventEmitter<MeowzerEventType>;
  private cat: Cat;
  private brain: Brain;
  private catId: string;

  constructor(cat: Cat, brain: Brain, catId: string) {
    this.emitter = new EventEmitter();
    this.cat = cat;
    this.brain = brain;
    this.catId = catId;

    this.setupForwarding();
  }

  on(event: MeowzerEventType, handler: EventHandler): void {
    this.emitter.on(event, handler);
  }

  off(event: MeowzerEventType, handler: EventHandler): void {
    this.emitter.off(event, handler);
  }

  emit(event: MeowzerEventType, data: any): void {
    this.emitter.emit(event, data);
  }

  private setupForwarding(): void {
    // Forward cat state changes
    this.cat.on("stateChange", (data) => {
      this.emitter.emit("stateChange", {
        id: this.catId,
        state: data.newState,
      });
    });

    // Forward brain behavior changes
    this.brain.on("behaviorChange", (data) => {
      this.emitter.emit("behaviorChange", {
        id: this.catId,
        behavior: data.newBehavior,
      });
    });
  }

  clear(): void {
    this.emitter.clear();
  }
}
```

**Benefits:**

- Centralized event logic
- Easy to add new event sources
- Can test event forwarding in isolation

---

## Implementation Strategy

### Phase 1: Extract Modules + Remove Global Dependencies

1. Create module files in `meowzer/sdk/cat-modules/`
2. Change MeowzerCat constructor to require explicit manager dependencies
3. Remove all `Symbol.for()` global lookups
4. Update CatManager to pass dependencies to MeowzerCat constructor
5. Add comprehensive tests for each module

### Phase 2: Clean API Design

Expose modules directly, remove wrapper methods:

```typescript
class MeowzerCat {
  // NO wrappers - explicit module usage only
  readonly lifecycle: CatLifecycle;
  readonly persistence: CatPersistence;
  readonly accessories: CatAccessories;
  readonly interactions: CatInteractions;
  readonly events: CatEvents;
}

// Usage
cat.lifecycle.pause();
cat.persistence.save();
cat.accessories.addHat("beanie", "#FF0000", "#FFFF00");
```

**Why No Wrappers:**

- Forces clear module boundaries
- Makes dependencies explicit
- Reduces MeowzerCat API surface dramatically
- Prevents god object anti-pattern from returning
- Better IDE autocomplete organization

---

## Benefits Summary

### Maintainability

- ✅ Each module < 200 lines
- ✅ Clear single responsibilities
- ✅ Easy to locate code for features
- ✅ Reduced cognitive load

### Testability

- ✅ Mock dependencies explicitly
- ✅ Test modules in isolation
- ✅ No global state setup
- ✅ Faster test execution

### Extensibility

- ✅ Add new accessories without touching core
- ✅ Add new interactions without touching core
- ✅ Easy to create custom modules
- ✅ Plugin-friendly architecture

### Type Safety

- ✅ Compile-time dependency checking
- ✅ No `any` types from global lookups
- ✅ Better IDE autocomplete
- ✅ Catch errors at build time

---

## Alternative OOP Architectures for Game Entities

### 1. Keep Current Architecture ❌

**Pros:** No refactoring work  
**Cons:** Growing complexity, testing difficulties, hard to extend  
**Verdict:** Unacceptable - technical debt will compound

### 2. Service Locator Pattern (Current) ❌

**Pros:** Loose coupling between cat and managers  
**Cons:** Runtime errors, hidden dependencies, hard to test  
**Verdict:** Anti-pattern - replace immediately

### 3. Component-Based Architecture (Module Pattern) ✅ **RECOMMENDED**

**Concept:** MeowzerCat as entity container, modules as components. Common in game engines (Unity, Unreal).

```typescript
// Entity is a composition of components
class MeowzerCat {
  readonly id: string;
  readonly lifecycle: CatLifecycle;
  readonly persistence: CatPersistence;
  readonly accessories: CatAccessories;
  readonly interactions: CatInteractions;
  readonly events: CatEvents;

  constructor(config: MeowzerCatConfig, managers: CatManagers) {
    this.id = config.id;

    // Compose from components
    this.lifecycle = new CatLifecycle(config.cat, config.brain);
    this.persistence = new CatPersistence(
      this,
      managers.storage,
      managers.hooks
    );
    this.accessories = new CatAccessories(config.cat);
    this.interactions = new CatInteractions(
      config.cat,
      config.brain,
      this.id,
      managers.interactions,
      managers.hooks
    );
    this.events = new CatEvents(config.cat, config.brain, this.id);
  }

  // No wrapper methods - direct component access
  // cat.lifecycle.pause()
  // cat.accessories.addHat()
}
```

**Pros:**

- Industry-standard pattern for game entities
- Clear component boundaries
- Easy to add/remove components
- Components are reusable (could apply to other entities)
- Familiar to game developers
- Testable in isolation

**Cons:**

- More verbose API (`cat.lifecycle.pause()` vs `cat.pause()`)
- Requires understanding component system

**Verdict:** ✅ **Best fit for simulation game** - Aligns with established game development patterns

---

### 4. Entity-Component-System (ECS) Architecture 🎮 **ADVANCED**

**Concept:** Separate data (components) from behavior (systems). Used by modern game engines for performance.

```typescript
// Pure data components
interface LifecycleComponent {
  isActive: boolean;
  isPaused: boolean;
}

interface AccessoryComponent {
  hat?: HatData;
  outfit?: OutfitData;
}

interface PersistenceComponent {
  isDirty: boolean;
  collectionName?: string;
  lastSaved?: Date;
}

// Entity is just an ID + component registry
class MeowzerCat {
  readonly id: string;
  private components = new Map<string, any>();

  addComponent<T>(type: string, component: T): void {
    this.components.set(type, component);
  }

  getComponent<T>(type: string): T | undefined {
    return this.components.get(type);
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }
}

// Systems operate on components
class LifecycleSystem {
  pause(cat: MeowzerCat): void {
    const lifecycle =
      cat.getComponent<LifecycleComponent>("lifecycle");
    const runtime = cat.getComponent<RuntimeComponent>("runtime");

    if (lifecycle && runtime && lifecycle.isActive) {
      runtime.brain.stop();
      runtime.cat.pause();
      lifecycle.isPaused = true;
      lifecycle.isActive = false;
    }
  }

  resume(cat: MeowzerCat): void {
    // Similar...
  }
}

class AccessorySystem {
  addHat(cat: MeowzerCat, hat: HatData): void {
    const accessory =
      cat.getComponent<AccessoryComponent>("accessory");
    const runtime = cat.getComponent<RuntimeComponent>("runtime");

    if (accessory && runtime) {
      accessory.hat = hat;
      this.updateSprite(runtime.cat, accessory);
    }
  }
}

// Usage
const cat = new MeowzerCat("cat-123");
cat.addComponent("lifecycle", { isActive: true, isPaused: false });
cat.addComponent("accessory", {});

lifecycleSystem.pause(cat);
accessorySystem.addHat(cat, hatData);
```

**Pros:**

- Maximum performance (data-oriented design)
- Cache-friendly memory layout
- Easy to add new component types
- Systems can process multiple entities efficiently
- Used by high-performance game engines

**Cons:**

- Significant architectural shift
- Lose type safety (components accessed via strings)
- More complex to understand
- Overkill for current scale

**Verdict:** 🎮 **Future consideration** - If we need to scale to 100s of cats or add many entity types, this becomes compelling

---

### 5. Strategy Pattern with Pluggable Behaviors 🎯

**Concept:** Use strategy pattern for variable behaviors. Common in game AI systems.

```typescript
// Abstract behavior strategies
interface InteractionStrategy {
  respondToNeed(cat: MeowzerCat, needId: string): Promise<void>;
  playWithYarn(cat: MeowzerCat, yarnId: string): Promise<void>;
  chaseLaser(cat: MeowzerCat, position: Position): Promise<void>;
}

interface PersonalityStrategy {
  calculateDelay(): number;
  evaluateInterest(interaction: any): number;
}

// Concrete implementations
class PlayfulInteractionStrategy implements InteractionStrategy {
  async respondToNeed(
    cat: MeowzerCat,
    needId: string
  ): Promise<void> {
    // Enthusiastic, fast response
    await this.approachQuickly(cat, needId);
  }

  async playWithYarn(cat: MeowzerCat, yarnId: string): Promise<void> {
    // Extra playful interactions
    await this.playEnthusiastically(cat, yarnId);
  }
}

class LazyInteractionStrategy implements InteractionStrategy {
  async respondToNeed(
    cat: MeowzerCat,
    needId: string
  ): Promise<void> {
    // Slow, reluctant response
    await this.delay(5000);
    await this.approachSlowly(cat, needId);
  }

  async playWithYarn(cat: MeowzerCat, yarnId: string): Promise<void> {
    // Minimal effort
    await this.playHalfheartedly(cat, yarnId);
  }
}

class MeowzerCat {
  private interactionStrategy: InteractionStrategy;
  private personalityStrategy: PersonalityStrategy;

  constructor(
    config: MeowzerCatConfig,
    strategies: {
      interaction: InteractionStrategy;
      personality: PersonalityStrategy;
    }
  ) {
    this.interactionStrategy = strategies.interaction;
    this.personalityStrategy = strategies.personality;
  }

  // Delegate to strategies
  async respondToNeed(needId: string): Promise<void> {
    await this.interactionStrategy.respondToNeed(this, needId);
  }

  // Can swap strategies at runtime
  setInteractionStrategy(strategy: InteractionStrategy): void {
    this.interactionStrategy = strategy;
  }
}
```

**Pros:**

- Perfect for AI behavior variations
- Can swap behaviors at runtime (cat mood changes)
- Easy to add new behavior types
- Testable strategies
- Common in game AI systems

**Cons:**

- Many small classes/interfaces
- May be over-abstraction for simple behaviors
- Strategies need access to cat internals

**Verdict:** 🎯 **Excellent for AI/personality** - Consider for `interactions` module to support behavior variation

---

### 6. Decorator Pattern for Progressive Enhancement 🎨

**Concept:** Wrap cats with decorators to add features. Good for unlockable abilities/cosmetics.

```typescript
// Base cat
class BasicMeowzerCat {
  constructor(
    protected config: MeowzerCatConfig,
    protected managers: CatManagers
  ) {}

  async interact(needId: string): Promise<void> {
    // Basic interaction logic
  }
}

// Decorators add features
class HatDecorator extends BasicMeowzerCat {
  private hat?: HatData;

  addHat(hat: HatData): void {
    this.hat = hat;
    this.updateSprite();
  }

  removeHat(): void {
    this.hat = undefined;
    this.updateSprite();
  }

  private updateSprite(): void {
    // Update visual with hat
  }
}

class SpecialAbilityDecorator extends HatDecorator {
  async interact(needId: string): Promise<void> {
    // Add special ability before interaction
    await this.useSpecialAbility();
    await super.interact(needId);
  }

  private async useSpecialAbility(): Promise<void> {
    // Special ability logic
  }
}

// Usage - progressively enhance cats
let cat: BasicMeowzerCat = new BasicMeowzerCat(config, managers);
cat = new HatDecorator(cat); // Add cosmetics
cat = new SpecialAbilityDecorator(cat); // Add abilities
```

**Pros:**

- Perfect for unlockable features
- Add features without modifying base class
- Can layer multiple decorators
- Good for progression systems

**Cons:**

- Type safety issues with chaining
- Can create deep wrapper chains
- Harder to access specific decorator features

**Verdict:** 🎨 **Good for progression systems** - Consider if adding unlockable cat abilities/cosmetics

---

### 7. Observer Pattern for Reactive Systems �️

**Concept:** Module events trigger reactions in other modules. Already partially implemented.

```typescript
// Modules observe each other
class CatLifecycle extends EventEmitter {
  pause(): void {
    this.brain.stop();
    this.cat.pause();
    this.emit("paused", { catId: this.catId });
  }
}

class CatPersistence {
  constructor(
    private cat: MeowzerCat,
    private storage: StorageManager
  ) {
    // React to lifecycle changes
    this.cat.lifecycle.on("paused", () => this.markDirty());
    this.cat.lifecycle.on("destroyed", () => this.handleDestroy());

    // React to accessory changes
    this.cat.accessories.on("hatApplied", () => this.markDirty());
    this.cat.accessories.on("hatRemoved", () => this.markDirty());
  }

  private markDirty(): void {
    this.isDirty = true;
  }

  private async handleDestroy(): Promise<void> {
    if (this.isDirty) {
      await this.save();
    }
  }
}
```

**Pros:**

- Decouples modules
- Automatic reactions to state changes
- Easy to add new observers
- Common in game event systems

**Cons:**

- Can create complex event chains
- Harder to debug (implicit behavior)
- Memory leaks if not cleaned up

**Verdict:** 👁️ **Already using this** - Good for cross-module reactions, but needs explicit cleanup in `destroy()`

---

## Recommended Hybrid Approach for Game Simulation 🎯

Combine multiple OOP patterns for a robust game entity architecture:

### Primary: Component-Based Architecture (Module Pattern)

Use the proposed module extraction as base architecture:

```typescript
class MeowzerCat {
  // Components
  readonly lifecycle: CatLifecycle;
  readonly persistence: CatPersistence;
  readonly accessories: CatAccessories;
  readonly interactions: CatInteractions;
  readonly events: CatEvents;
}
```

**Timeline:** 2 weeks (as proposed)

---

### Enhancement 1: Strategy Pattern for Interactions

Replace monolithic `CatInteractions` with pluggable strategies:

```typescript
interface InteractionBehavior {
  respondToNeed(
    context: InteractionContext,
    needId: string
  ): Promise<void>;
  playWithYarn(
    context: InteractionContext,
    yarnId: string
  ): Promise<void>;
  chaseLaser(
    context: InteractionContext,
    position: Position
  ): Promise<void>;
}

class CatInteractions {
  constructor(
    private context: InteractionContext,
    private behavior: InteractionBehavior // Pluggable!
  ) {}

  async respondToNeed(needId: string): Promise<void> {
    await this.behavior.respondToNeed(this.context, needId);
  }
}

// Different behaviors based on personality
class PlayfulBehavior implements InteractionBehavior {
  /* ... */
}
class ShyBehavior implements InteractionBehavior {
  /* ... */
}
class LazyBehavior implements InteractionBehavior {
  /* ... */
}
```

**Benefits:**

- Easy to add new personality types
- Can change behavior at runtime (mood system)
- Testable behavior variations

**Timeline:** +1 week after base refactor

---

### Enhancement 2: Observer Pattern for Module Communication

Make modules reactive to each other:

```typescript
class CatPersistence {
  constructor(cat: MeowzerCat, storage: StorageManager) {
    // Auto-save on changes
    cat.accessories.on("changed", () => this.markDirty());
    cat.lifecycle.on("destroyed", () => this.autoSave());
  }
}
```

**Benefits:**

- Automatic dirty tracking
- Cross-module reactions
- Loose coupling

**Timeline:** Built into module refactor (no extra time)

---

### Future: ECS for Multi-Entity Optimization

If we expand beyond cats (other pets, NPCs, objects):

```typescript
// All game entities use ECS
class GameEntity {
  addComponent<T>(type: string, component: T): void;
  getComponent<T>(type: string): T | undefined;
}

// Shared systems
class PhysicsSystem {
  /* ... */
}
class RenderSystem {
  /* ... */
}
class AISystem {
  /* ... */
}
```

**Timeline:** Future consideration when scaling to 100s of entities

---

## Open Questions

1. **Module Lifecycle**: Should modules have explicit `destroy()` methods? **→ YES** - Critical for cleanup in game entities
2. **Event Bubbling**: Should module events automatically bubble to MeowzerCat? **→ NO** - Direct module events preferred
3. **Module Communication**: Should modules observe each other or communicate through parent? **→ OBSERVER PATTERN** - Reactive module communication
4. **Public Module Access**: Should users access modules directly? **→ YES** - `cat.lifecycle.pause()` exposes component architecture
5. **Bundle Size**: Optional modules that can be tree-shaken? **→ YES** - Accessories, persistence as optional imports
6. **Breaking Changes**: Remove wrapper methods entirely? **→ YES** - Forces component-based thinking
7. **Strategy Pattern**: Should interaction behaviors be pluggable? **→ YES** - Enables personality variation and AI behaviors
8. **Entity Pooling**: Should we implement object pooling for performance? **→ FUTURE** - Consider if creating/destroying many cats frequently

---

## Success Criteria

After refactoring:

### Code Quality

- ✅ No file > 300 lines (target: < 200 lines per file)
- ✅ Each module testable with < 20 lines of setup
- ✅ No `Symbol.for()` lookups anywhere in SDK
- ✅ No `any` types except for well-justified edge cases
- ✅ 100% test coverage on new modules
- ✅ All module dependencies explicit in constructors

### Architecture

- ✅ Clear module boundaries with single responsibilities
- ✅ **BREAKING:** No wrapper methods in MeowzerCat (forces explicit module usage)
- ✅ Modules can be tested in complete isolation
- ✅ Easy to add new modules without modifying existing code
- ✅ Documentation shows module extension examples

### Developer Experience

- ✅ IDE autocomplete shows organized module structure
- ✅ Error messages indicate which module failed
- ✅ Stack traces don't go through wrapper layers
- ✅ Comprehensive documentation with examples
- ✅ Clear API boundaries

### Performance

- ✅ Optional tree-shakeable modules
- ✅ Lazy module initialization where possible
- ✅ No performance regression vs current implementation
- ✅ Benchmark tests show < 5% overhead from module system

### Future-Proofing

- ✅ Easy to add functional API in future phases
- ✅ Module system supports composition patterns
- ✅ Can adopt event sourcing for persistence without changing runtime API
- ✅ Plugin system can extend modules

---

## Timeline Estimate

### Phase 1: Component Extraction (2 weeks) ⚡ **PRIORITY**

**Goal:** Extract MeowzerCat into component-based architecture

- Day 1-2: Create component files (Lifecycle, Persistence, Accessories, Interactions, Events)
- Day 3-5: Refactor MeowzerCat constructor to use explicit DI, remove global Symbol.for() lookups
- Day 6-7: Remove wrapper methods, expose components directly
- Day 8-9: Comprehensive component tests
- Day 10: Update documentation and examples

**Deliverable:** `cat.lifecycle.pause()`, `cat.accessories.addHat()`, etc.

---

### Phase 2: Strategy Pattern for Interactions (1 week) 🎯 **NEXT**

**Goal:** Make interaction behaviors pluggable based on personality

- Day 1-2: Define `InteractionBehavior` interface
- Day 3-4: Implement behavior strategies (Playful, Shy, Lazy, Curious)
- Day 5: Refactor `CatInteractions` to use strategies
- Day 6-7: Tests and documentation for behavior system

**Deliverable:** Pluggable personality behaviors, runtime behavior swapping

---

### Phase 3: Observer Pattern Enhancements (3 days) 👁️ **INCLUDED**

**Goal:** Robust cross-component communication

- Day 1: Implement component event system
- Day 2: Add auto-dirty tracking in persistence component
- Day 3: Tests and cleanup handlers

**Deliverable:** Reactive components with automatic state synchronization

---

### Future Enhancements (Optional)

- **Decorator Pattern for Unlockables** (1 week) - Progressive feature enhancement
- **Entity Pooling** (3 days) - Performance optimization for many cats
- **Full ECS Migration** (3-4 weeks) - If scaling to 100s of entities
- **Multiplayer/Networking Support** (4+ weeks) - Synchronization across clients

---

## Conclusion

The current `MeowzerCat` class suffers from the God Object anti-pattern and global dependency injection issues. **As a simulation game with zero production users**, we should adopt industry-standard game development patterns that prioritize maintainability and extensibility.

### Primary Recommendation: Component-Based Architecture (Module Pattern) 🎮

1. **Extract components** - Lifecycle, Persistence, Accessories, Interactions, Events
2. **Remove global lookups** - Explicit dependency injection only
3. **Expose components directly** - No wrapper methods (`cat.lifecycle.pause()`)
4. **Update all examples** - Show component-based API

**Why Component-Based Architecture:**

- ✅ **Industry standard** - Used by Unity, Unreal, and modern game engines
- ✅ **Best maintainability** - Clear component boundaries prevent god objects
- ✅ **Best testability** - Components test in complete isolation
- ✅ **Best extensibility** - Easy to add custom components or swap implementations
- ✅ **Best type safety** - Compile-time dependency checking
- ✅ **Familiar to game devs** - Aligns with established game development patterns
- ✅ **Future-proof** - Can evolve to full ECS if needed for performance

**Game-Specific Benefits:**

- Easy to add new entity types (dogs, birds) by reusing components
- Component composition supports feature unlocks and progression systems
- Strategy pattern for interactions enables personality/AI variation
- Observer pattern between components enables reactive gameplay
- Clear separation supports multiplayer/networking (if needed)

---

### Recommended Implementation Phases

#### Phase 1: Component Extraction (2 weeks) - **DO THIS NOW**

Extract existing functionality into components:

```typescript
class MeowzerCat {
  readonly lifecycle: CatLifecycle;
  readonly persistence: CatPersistence;
  readonly accessories: CatAccessories;
  readonly interactions: CatInteractions;
  readonly events: CatEvents;
}
```

#### Phase 2: Strategy Pattern for Interactions (1 week) - **NEXT**

Make interaction behaviors pluggable based on personality:

```typescript
interface InteractionBehavior {
  respondToNeed(...): Promise<void>;
  playWithYarn(...): Promise<void>;
}

class PlayfulBehavior implements InteractionBehavior { /* ... */ }
class ShyBehavior implements InteractionBehavior { /* ... */ }
```

#### Phase 3: Observer Pattern for Components (Built-in) - **INCLUDED**

Components react to each other's events:

```typescript
// Persistence auto-marks dirty on changes
cat.accessories.on("hatApplied", () => persistence.markDirty());
```

#### Future: Full ECS (If Needed) - **SCALING**

If we add many entity types or need 100s of simultaneous entities:

```typescript
class GameEntity {
  addComponent<T>(type: string, component: T): void;
}

// Shared systems across all entity types
class PhysicsSystem {
  /* ... */
}
class AISystem {
  /* ... */
}
```

---

### Why Not Other Patterns?

- **❌ Functional/Immutable**: Not OOP, unfamiliar for game development
- **❌ Mixins/Traits**: Complex type inference, harder to debug
- **❌ Manager-Based (ID only)**: Loses OOP benefits, worse API ergonomics
- **❌ Event Sourcing**: Over-engineered, performance overhead
- **✅ Decorator Pattern**: Good for unlockables - consider for Phase 4

---

### Success Metrics

After Phase 1 completion:

- ✅ Each component < 200 lines
- ✅ Zero `Symbol.for()` global lookups
- ✅ Components testable with < 10 lines setup
- ✅ Clear component boundaries in API
- ✅ Documentation shows component architecture

After Phase 2 completion:

- ✅ Interaction behaviors pluggable
- ✅ Easy to add new personality types
- ✅ Behavior can change at runtime (mood system)

---

**Final Recommendation:** Start with component-based architecture (Phase 1: 2 weeks), then add strategy pattern for interactions (Phase 2: 1 week). This gives us a solid OOP game architecture that's familiar, maintainable, and extensible. Total investment: ~3 weeks for a production-ready game entity system.
