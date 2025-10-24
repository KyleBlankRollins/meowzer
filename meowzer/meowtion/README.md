# Meowtion

Animation library for bringing cat sprites to life with movement and physics.

## Overview

Meowtion takes a `ProtoCat` object (from Meowkit) and creates an animated `Cat` instance that can move around a web page. This library handles rendering, animation states, and physics primitives. It provides low-level animation controls that are meant to be controlled by Meowbrain (the AI library) rather than directly by users.

## Core Concepts

### Cat (Output)

The primary object created by Meowtion - a fully animated cat instance:

```typescript
interface Cat {
  id: string; // Unique identifier
  element: HTMLElement; // DOM element containing the cat
  state: CatState; // Current animation state
  position: Position; // Current position on page
  velocity: Velocity; // Current movement velocity
  boundaries: Boundaries; // Movement constraints

  // Low-level animation methods (controlled by Meowbrain)
  moveTo(x: number, y: number, duration?: number): Promise<void>;
  setPosition(x: number, y: number): void;
  setVelocity(vx: number, vy: number): void;
  setState(state: CatStateType): void;
  stop(): void;

  // Lifecycle methods
  destroy(): void;
  pause(): void;
  resume(): void;

  // Event listeners (for Meowbrain to observe)
  on(event: CatEvent, handler: EventHandler): void;
  off(event: CatEvent, handler: EventHandler): void;
}

interface Position {
  x: number; // X coordinate (pixels)
  y: number; // Y coordinate (pixels)
}

interface Velocity {
  x: number; // X velocity (pixels/second)
  y: number; // Y velocity (pixels/second)
}

type CatStateType =
  | "idle"
  | "walking"
  | "running"
  | "sitting"
  | "sleeping"
  | "playing";

interface CatState {
  type: CatStateType;
  startTime: number; // When this state began
  loop: boolean; // Whether animation loops
}

type CatEvent =
  | "stateChange"
  | "moveStart"
  | "moveEnd"
  | "boundaryHit";
type EventHandler = (data: any) => void;
```

## API Design

### Primary Animation Function

```typescript
/**
 * Creates an animated Cat instance from a ProtoCat
 * @param protoCat - The cat definition from Meowkit
 * @param options - Optional configuration for behavior and rendering
 */
function animateCat(
  protoCat: ProtoCat,
  options?: AnimationOptions
): Cat;

interface AnimationOptions {
  container?: HTMLElement; // Where to append cat (default: document.body)
  initialPosition?: Position; // Starting position (default: {x: 0, y: 0})
  initialState?: CatStateType; // Starting animation state (default: 'idle')
  physics?: PhysicsOptions; // Movement physics configuration
  boundaries?: Boundaries; // Keep cat within certain bounds
}

interface PhysicsOptions {
  gravity?: boolean; // Apply gravity effect (default: false)
  friction?: number; // Movement friction 0-1 (default: 0.1)
  maxSpeed?: number; // Maximum velocity (default: 300)
}

interface Boundaries {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}
```

### Cat Builder Pattern

For more control over configuration:

```typescript
class CatAnimator {
  constructor(protoCat: ProtoCat);

  in(container: HTMLElement): CatAnimator;
  at(x: number, y: number): CatAnimator;
  withState(state: CatStateType): CatAnimator;
  withPhysics(options: PhysicsOptions): CatAnimator;
  withinBounds(boundaries: Boundaries): CatAnimator;

  animate(): Cat;
}

// Usage
const cat = new CatAnimator(protoCat)
  .in(document.getElementById("playground"))
  .at(100, 100)
  .withState("idle")
  .withinBounds({ minX: 0, maxX: 800, minY: 0, maxY: 600 })
  .animate();
```

## Animation System

### State Machine

Cats use a state machine to manage animation transitions:

```typescript
interface StateTransition {
  from: CatStateType;
  to: CatStateType;
  duration: number; // Transition time in ms
  easing?: EasingFunction;
}

type EasingFunction = (t: number) => number;
```

**Valid State Transitions:**

- `idle` ↔ `walking` ↔ `running`
- `idle` ↔ `sitting` ↔ `sleeping`
- `idle` ↔ `playing`
- Any state → `idle` (always allowed)

### SVG Animation Techniques

Meowtion animates SVG elements using:

1. **CSS Transforms**: For position and rotation
2. **SMIL/CSS Animations**: For looping behaviors (tail swaying, breathing)
3. **JavaScript RAF**: For physics-based movement
4. **Keyframe Sequences**: For complex state animations

Example internal animation:

```typescript
// Walking animation - alternating leg movement
function applyWalkingAnimation(cat: Cat) {
  const svg = cat.element.querySelector("svg");
  const tail = svg.querySelector(
    `#${cat.protoCat.spriteData.elements.tail}`
  );

  // Sway tail while walking
  tail.style.animation = "tail-sway 0.6s ease-in-out infinite";

  // Slight body bounce
  svg.style.animation = "body-bounce 0.4s ease-in-out infinite";
}
```

## Movement System

### Movement Primitives

Meowtion provides low-level movement controls:

```typescript
interface Cat {
  // Smooth interpolated movement to position
  moveTo(x: number, y: number, duration?: number): Promise<void>;

  // Immediate position change (no animation)
  setPosition(x: number, y: number): void;

  // Set velocity for physics-based movement
  setVelocity(vx: number, vy: number): void;

  // Stop all movement immediately
  stop(): void;
}
```

### Movement Characteristics

- **Smooth interpolation**: Uses easing functions for natural movement
- **Boundary enforcement**: Automatically prevents cats from moving outside defined boundaries
- **Physics integration**: Respects friction and max speed settings
- **State synchronization**: Automatically matches animation state to movement speed

### Boundary Behavior

When a cat hits a boundary:

- Movement is stopped at the boundary edge
- `boundaryHit` event is emitted with direction information
- Velocity is reset to zero
- Meowbrain can listen to this event and decide new behavior

## Implementation Considerations

### DOM Structure

Each cat creates this DOM structure:

```html
<div
  class="meowtion-cat"
  data-cat-id="abc123"
  style="position: absolute; left: 100px; top: 100px;"
>
  <svg viewBox="0 0 100 100" width="100" height="100">
    <!-- SVG content from ProtoCat -->
  </svg>
</div>
```

### CSS Animations

Meowtion includes built-in CSS animations:

```css
@keyframes tail-sway {
  0%,
  100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@keyframes body-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes blink {
  0%,
  90%,
  100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}
```

### Performance Optimization

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Throttle physics calculations to 60 FPS
- Pause animations for off-screen cats
- Use `will-change` hint for frequently animated properties
- Debounce event handlers

### Zero Dependencies

Like Meowkit, Meowtion has no dependencies:

- Native Web Animations API
- RequestAnimationFrame for physics
- Native event listeners
- Pure CSS animations where possible

## Usage Examples

### Basic Setup (Typically controlled by Meowbrain)

```typescript
import { buildCatFromSeed } from "meowkit";
import { animateCat } from "meowtion";

const protoCat = buildCatFromSeed("tabby-FF9500-00FF00-m-short-v1");
const cat = animateCat(protoCat, {
  initialPosition: { x: 100, y: 100 },
  initialState: "idle",
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
});

// Low-level movement (normally Meowbrain does this)
await cat.moveTo(400, 200, 2000);
cat.setState("sitting");
```

### Observing Events

```typescript
// Meowbrain listens to these events to make decisions
cat.on("moveEnd", () => {
  console.log("Cat finished moving");
});

cat.on("boundaryHit", (data) => {
  console.log("Cat hit boundary:", data.direction);
});

cat.on("stateChange", (data) => {
  console.log("Cat state changed to:", data.newState);
});
```

### Multiple Cats

```typescript
const cats = [
  "tabby-FF9500-00FF00-m-short-v1",
  "calico-FFFFFF-0000FF-s-long-v1",
  "tuxedo-000000-FFFF00-l-short-v1",
].map((seed, index) => {
  const protoCat = buildCatFromSeed(seed);
  return animateCat(protoCat, {
    initialPosition: { x: 100 + index * 150, y: 100 },
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  });
});

// Meowbrain would control these cats autonomously
```

## Integration with Meowbrain

Meowtion is designed to be controlled by Meowbrain, the AI library. While you can use Meowtion directly for scripted animations, the recommended approach is:

```typescript
import { buildCatFromSeed } from "meowkit";
import { animateCat } from "meowtion";
import { createBrain } from "meowbrain";

const protoCat = buildCatFromSeed("tabby-FF9500-00FF00-m-short-v1");
const cat = animateCat(protoCat);
const brain = createBrain(cat, { personality: "playful" });

brain.start(); // Cat now acts autonomously
```

## Future Enhancements

- **Sound effects**: Purring, meowing (optional audio)
- **Collision detection**: Emit events when cats collide with each other
- **Particle effects**: Hearts, Z's, etc. (visual feedback)
- **Sprite swapping**: Different poses for each state
- **Path constraints**: Follow predefined paths or rails
- **React/Vue/Svelte wrappers**: Framework-specific components
