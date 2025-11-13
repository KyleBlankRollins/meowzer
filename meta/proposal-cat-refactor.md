# Cat Refactor

The way we create and manage cats needs to change. The current architecture is confusing and hard to debug.

## Goals

- All cat-related UI elements should live in the `meowzer/ui/` directory
- Meowtion should be a purely logical/data-driven system with NO DOM manipulation
- Clear separation: Meowtion handles state/physics/logic, UI handles all rendering/animation

## Architecture Overview

### Meowtion (Logic Layer)

**Responsibilities:**

- State machine (idle, walking, running, sitting, sleeping, playing)
- Physics simulation (velocity, boundaries, collision detection)
- Movement pathfinding (calculate where to move)
- Entity lifecycle management
- Event emission for state changes
- **NO GSAP, NO DOM, NO RENDERING**

**API Pattern:** System-based

```typescript
const catSystem = new CatSystem();
const catId = catSystem.createCat(config);
catSystem.on(catId, "stateChange", (state) => {
  /* ... */
});
catSystem.moveTo(catId, x, y);
```

### UI Layer (`meowzer/ui/`)

**Responsibilities:**

- `<mb-cat>` web component for rendering cats
- ALL GSAP animations and visual tweening
- ALL DOM manipulation
- SVG sprite rendering
- Name/state label display
- Cat context menu
- Visual styling and effects

**Component Usage:**

```typescript
<mb-cat entity-id="cat-123"></mb-cat>
```

The component subscribes to Meowtion entity updates and handles all visual representation.

### MeowBrain

- Receives Meowtion entity references
- Drives behavioral logic
- Interacts with Meowtion system to update cat states
- Interaction detection stays in MeowBrain

### SDK Layer

- End users interact ONLY with `<mb-cat>` web components
- SDK manages the connection between Meowtion entities and UI components
- `MeowzerCat` may still exist as an internal coordination layer, but users don't see it

## Relevant files

Refer to [cat-usage](./cat-usage.md) for details about files that are related to the `Cat` class.

---

## Design Decisions

### Animation Approach

**GSAP lives entirely in the UI layer.** This is the standard web app pattern because:

- GSAP is inherently tied to visual rendering (DOM manipulation)
- Keeping animation in the logic layer adds complexity with no benefit
- Logic layer answers "where should the cat be?", view layer decides "how to animate getting there"

**Flow:**

1. Meowtion calculates state/position changes via pure JS
2. Meowtion emits events with new state data
3. `<mb-cat>` receives events and uses GSAP to smoothly animate visual transitions

### Sprite & Visual Data

- `ProtoCat` concept moves to UI layer
- Meowtion entities track only a "visual config ID" or essential data
- UI layer is responsible for looking up and rendering sprites

### Containers & Placement

- Meowtion has NO concept of containers
- `<mb-cat>` components are placed in DOM normally
- Components subscribe to Meowtion entities via `entity-id` attribute

### Breaking Changes

- Complete rewrite, no backward compatibility needed
- Clean break from current architecture
- No parallel systems during transition
