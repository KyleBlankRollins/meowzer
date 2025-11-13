# Meowtion Refactor Implementation Plan

This document outlines the step-by-step implementation plan for refactoring Meowtion from a tightly-coupled DOM/animation system into a pure logic/data-driven entity system.

## Overview

**Goal:** Separate Meowtion (logic) from UI (rendering) to create a clean, maintainable architecture.

**Approach:** Complete rewrite with no backward compatibility. No parallel systems.

## Phase 1: Create New Meowtion System (Pure Logic)

### 1.1 Core Entity System

**New files to create:**

- `meowzer/meowtion/entity-system.ts` - Main system for managing cat entities
- `meowzer/meowtion/entity.ts` - Individual cat entity class (pure data + logic)
- `meowzer/meowtion/types.ts` - Type definitions for entities and events

**Entity System API:**

```typescript
class CatEntitySystem {
  createEntity(config: EntityConfig): string; // returns entity ID
  getEntity(id: string): CatEntity | undefined;
  destroyEntity(id: string): void;
  update(deltaTime: number): void; // Main update loop
  on(entityId: string, event: string, handler: Function): void;
  off(entityId: string, event: string, handler: Function): void;
}
```

**Entity API:**

```typescript
class CatEntity {
  readonly id: string;

  // State
  state: CatStateType;
  position: Position;
  velocity: Velocity;
  facingRight: boolean;

  // Methods (pure logic, no DOM)
  setState(state: CatStateType): void;
  moveTo(x: number, y: number, duration: number): void;
  moveAlongPath(
    points: Position[],
    duration: number,
    options?: PathOptions
  ): void;
  setVelocity(vx: number, vy: number): void;
  stop(): void;

  // Lifecycle
  pause(): void;
  resume(): void;
  destroy(): void;
}
```

**Events to emit:**

- `stateChange` - When state changes (idle → walking, etc.)
- `positionUpdate` - Every frame with current position
- `velocityUpdate` - When velocity changes
- `moveStart` - When movement animation begins
- `moveEnd` - When movement animation completes
- `boundaryHit` - When entity hits a boundary
- `turnStart` - When entity starts turning around
- `turnEnd` - When entity finishes turning

### 1.2 State Machine (Keep & Refine)

**Files to modify:**

- `meowzer/meowtion/state-machine.ts` - Already pure logic, keep as-is

### 1.3 Physics System (Extract & Purify)

**New file:**

- `meowzer/meowtion/physics-system.ts` - Pure physics calculations

**Refactor from:**

- `meowzer/meowtion/cat/physics.ts` - Remove DOM callbacks, keep pure physics logic

**Responsibilities:**

- Calculate velocity changes based on acceleration/friction
- Handle gravity simulation
- Enforce max speed limits
- Calculate boundary collisions
- All calculations return data, emit events

### 1.4 Movement System (Extract & Purify)

**New file:**

- `meowzer/meowtion/movement-system.ts` - Pure movement/pathfinding logic

**Refactor from:**

- `meowzer/meowtion/cat/movement.ts` - Remove DOM callbacks, keep path calculations

**Responsibilities:**

- Calculate movement paths (linear, curved)
- Interpolate positions over time
- Determine facing direction
- Calculate turn animations (timing only, not visual)
- Emit position updates each frame

### 1.5 Animation Loop (Refactor)

**Modify:**

- `meowzer/meowtion/animator.ts` - Make it drive the entity system update loop

**New approach:**

```typescript
class CatAnimationLoop {
  private entities = new Map<string, CatEntity>();
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  add(entity: CatEntity): void;
  remove(entityId: string): void;
  start(): void;
  stop(): void;

  private loop(timestamp: number): void {
    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;

    // Update all entities
    for (const entity of this.entities.values()) {
      entity.update(deltaTime);
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}
```

## Phase 2: Remove DOM from Meowtion

### 2.1 Delete DOM-Related Files

**Files to DELETE:**

- `meowzer/meowtion/cat/dom.ts` - All DOM manipulation moves to UI
- `meowzer/meowtion/animations/base-styles.ts` - CSS injection moves to UI
- `meowzer/meowtion/animations/index.ts` - GSAP animations move to UI

### 2.2 Update Meowtion Index

**Modify:**

- `meowzer/meowtion/index.ts` - Export new system API

**New exports:**

```typescript
export { CatEntitySystem } from "./entity-system.js";
export { CatEntity } from "./entity.js";
export type {
  EntityConfig,
  EntityState,
  EntityEvent,
} from "./types.js";
export { isValidTransition } from "./state-machine.js";
```

**Remove exports:**

- `Cat` class (old implementation)
- `CatAnimationManager`
- Any DOM-related utilities

### 2.3 Remove Dependencies

**Update `package.json`:**

- Keep only core dependencies (no DOM-related libs if any)
- Meowtion should have NO dependency on GSAP

## Phase 3: Create UI Components

### 3.1 Create `<mb-cat>` Web Component

**New file:**

- `meowzer/ui/components/mb-cat/mb-cat.ts`

**Component structure:**

```typescript
@customElement("mb-cat")
export class MbCat extends LitElement {
  @property({ type: String, attribute: "entity-id" })
  entityId?: string;

  private entity?: CatEntity;
  private animationManager?: CatVisualAnimator;
  private eventUnsubscribers: Array<() => void> = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.entityId) {
      this.subscribeToEntity(this.entityId);
    }
  }

  private subscribeToEntity(id: string) {
    // Get entity from global system
    this.entity = getCatEntitySystem().getEntity(id);

    // Subscribe to entity events
    this.entity?.on("positionUpdate", this.handlePositionUpdate);
    this.entity?.on("stateChange", this.handleStateChange);
    this.entity?.on("turnStart", this.handleTurnStart);
    // etc.
  }

  private handlePositionUpdate = (position: Position) => {
    // Use GSAP to smoothly animate to position
    gsap.to(this.catElement, {
      x: position.x,
      y: position.y,
      duration: 0.016, // ~1 frame for smooth updates
    });
  };

  private handleStateChange = (state: CatStateType) => {
    // Update visual state animations
    this.animationManager?.playStateAnimation(state);
  };

  render() {
    return html`
      <div class="mb-cat-container">
        ${this.renderSprite()} ${this.renderInfo()} ${this.renderContextMenu()}
      </div>
    `;
  }
}
```

### 3.2 Create Visual Animation Manager

**New file:**

- `meowzer/ui/components/mb-cat/visual-animator.ts`

**Purpose:** Handle ALL GSAP animations

- Idle/walking/running state animations
- Sprite transformations
- Visual effects

**Refactor from:**

- `meowzer/meowtion/animations/` - Move GSAP logic here

### 3.3 Create Cat Sprite Renderer

**New file:**

- `meowzer/ui/components/mb-cat/sprite-renderer.ts`

**Purpose:**

- Render SVG sprites
- Handle sprite scaling
- Apply visual transformations

### 3.4 Create Info Display Components

**New files:**

- `meowzer/ui/components/mb-cat/cat-info.ts` - Name/state labels
- `meowzer/ui/components/mb-cat/cat-context-menu.ts` - Context menu

### 3.5 Create Styles

**New file:**

- `meowzer/ui/components/mb-cat/mb-cat.styles.ts`

**Move from:**

- `meowzer/meowtion/animations/base-styles.ts`

## Phase 4: Update MeowBrain

### 4.1 Update Brain to Use New Entity System

**Modify:**

- `meowzer/meowbrain/brain.ts`
- `meowzer/meowbrain/builder.ts`
- `meowzer/meowbrain/behavior-orchestrator.ts`
- `meowzer/meowbrain/behaviors.ts`

**Changes:**

- Replace `Cat` parameter with `CatEntity`
- Use entity event system instead of direct DOM access
- Update all behavior functions to work with new entity API

### 4.2 Update Interaction Systems

**Modify:**

- `meowzer/meowbrain/interactions/interaction-detector.ts`
- `meowzer/meowbrain/interactions/interaction-listener.ts`
- `meowzer/meowbrain/interactions/interest-evaluator.ts`

**Changes:**

- Work with `CatEntity` instead of `Cat`
- Subscribe to entity position updates
- Emit interaction events that UI can consume

## Phase 5: Update SDK

### 5.1 Refactor Cat Manager

**Modify:**

- `meowzer/sdk/managers/cat-manager.ts`

**Changes:**

```typescript
class CatManager {
  private entitySystem: CatEntitySystem;
  private catComponents = new Map<string, HTMLElement>(); // <mb-cat> elements

  async create(options: CreateCatOptions): Promise<string> {
    // 1. Generate cat visual config (meowkit)
    const visualConfig = buildCat(options.settings);

    // 2. Create entity in Meowtion
    const entityId = this.entitySystem.createEntity({
      id: options.id,
      initialPosition: options.position,
      visualConfigId: visualConfig.id,
    });

    // 3. Create Brain
    const entity = this.entitySystem.getEntity(entityId);
    const brain = buildBrain(entity, personality);

    // 4. Create and register <mb-cat> component
    const catComponent = document.createElement("mb-cat");
    catComponent.setAttribute("entity-id", entityId);
    catComponent.setAttribute("visual-config", visualConfig.id);
    this.catComponents.set(entityId, catComponent);

    // 5. Store visual config for component to use
    this.visualConfigRegistry.set(visualConfig.id, visualConfig);

    return entityId;
  }

  get(id: string): HTMLElement | undefined {
    return this.catComponents.get(id);
  }

  destroy(id: string): void {
    this.entitySystem.destroyEntity(id);
    this.catComponents.get(id)?.remove();
    this.catComponents.delete(id);
  }
}
```

### 5.2 Update or Remove MeowzerCat

**Option A: Remove entirely**

- Users only interact with `<mb-cat>` elements
- SDK returns element references

**Option B: Keep as thin wrapper**

```typescript
class MeowzerCat {
  constructor(
    private entityId: string,
    private component: HTMLElement,
    private entity: CatEntity
  ) {}

  // Convenience methods that delegate to entity
  get position() {
    return this.entity.position;
  }
  get state() {
    return this.entity.state;
  }

  moveTo(x: number, y: number) {
    return this.entity.moveTo(x, y);
  }

  // DOM access
  get element() {
    return this.component;
  }
  place(container: HTMLElement) {
    container.appendChild(this.component);
  }
}
```

### 5.3 Update Cat Modules

**Modify all files in `meowzer/sdk/cat-modules/`:**

- `cat-lifecycle.ts` - Use `CatEntity` instead of `Cat`
- `cat-accessories.ts` - Interact with `<mb-cat>` component for visual updates
- `cat-interactions.ts` - Use entity event system
- `cat-events.ts` - Bridge entity events to SDK events

### 5.4 Create Global Registry

**New file:**

- `meowzer/sdk/managers/entity-registry.ts`

**Purpose:**

- Global access to entity system
- Visual config storage
- Component-entity mapping

## Phase 6: Update Tests

### 6.1 Update Meowtion Tests

**Create new tests:**

- `meowzer/meowtion/__tests__/entity-system.test.ts`
- `meowzer/meowtion/__tests__/entity.test.ts`
- `meowzer/meowtion/__tests__/physics-system.test.ts`
- `meowzer/meowtion/__tests__/movement-system.test.ts`

**Delete old tests:**

- Any tests that test DOM manipulation in Meowtion

### 6.2 Update MeowBrain Tests

**Modify:**

- `meowzer/meowbrain/__tests__/meowbrain.test.ts`

**Changes:**

- Use `CatEntity` instead of `Cat`
- Test against entity event system
- Remove any DOM-related assertions

### 6.3 Update SDK Tests

**Modify:**

- `meowzer/sdk/__tests__/cat-manager.test.ts`
- All other SDK tests

**Changes:**

- Test component creation
- Test entity-component binding
- Update all assertions for new API

### 6.4 Create UI Component Tests

**New tests:**

- `meowzer/ui/__tests__/mb-cat.test.ts`
- Test component rendering
- Test entity subscription
- Test visual updates

## Phase 7: Update Types Package

### 7.1 Move ProtoCat to UI Types

**Modify:**

- `meowzer/types/cat/index.ts`

**Changes:**

- Move `ProtoCat` to UI-specific types
- Create new `EntityConfig` type for Meowtion
- Create `VisualConfig` type for UI

### 7.2 Update Shared Types

**Keep in shared types:**

- `Position`
- `Velocity`
- `Boundaries`
- `CatState`
- `CatStateType`
- `PhysicsOptions`

**New types:**

```typescript
// For Meowtion
interface EntityConfig {
  id: string;
  initialPosition?: Position;
  initialState?: CatStateType;
  physics?: PhysicsOptions;
  boundaries?: Boundaries;
  visualConfigId?: string; // Reference to visual data
}

// For UI
interface VisualConfig {
  id: string;
  spriteData: { svg: string };
  dimensions: { scale: number };
  colors: CatColors;
  accessories?: Accessory[];
}
```

## Phase 8: Documentation & Migration

### 8.1 Update README Files

**Update:**

- `meowzer/meowtion/README.md` - Document new pure-logic API
- `meowzer/ui/README.md` - Document `<mb-cat>` component usage
- `meowzer/README.md` - Update SDK examples

## Implementation Order

Execute phases in this order:

1. **Phase 1** - Create new Meowtion system (can work in parallel)
2. **Phase 2** - Remove DOM from Meowtion (after Phase 1)
3. **Phase 3** - Create UI components (can start during Phase 1)
4. **Phase 7** - Update types (before phases 4-5)
5. **Phase 4** - Update MeowBrain (after Phase 1, 7)
6. **Phase 5** - Update SDK (after Phases 1, 3, 4, 7)
7. **Phase 6** - Update tests (ongoing throughout)
8. **Phase 8** - Documentation (final phase)

## Success Criteria

- [ ] Meowtion has zero DOM dependencies
- [ ] Meowtion has zero GSAP dependencies
- [ ] All GSAP code lives in `meowzer/ui/`
- [ ] `<mb-cat>` component renders cats correctly
- [ ] Entity system emits all necessary events
- [ ] MeowBrain works with new entity system
- [ ] SDK creates and manages cats correctly
- [ ] All tests pass
- [ ] Demo works with new architecture
- [ ] Documentation is complete

## Risks & Mitigation

**Risk:** Complexity of coordinating entity-component updates

- **Mitigation:** Use robust event system, comprehensive integration tests

**Risk:** Performance degradation from event overhead

- **Mitigation:** Benchmark, optimize event emission, use batching if needed

**Risk:** GSAP animation timing issues with new architecture

- **Mitigation:** Prototype animation approach early, test smooth transitions

**Risk:** Breaking changes impact development velocity

- **Mitigation:** Complete rewrite means less incremental friction, cleaner end result
