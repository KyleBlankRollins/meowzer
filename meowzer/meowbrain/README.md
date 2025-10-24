# Meowbrain

Artificial intelligence library for autonomous cat behavior and decision-making.

## Overview

Meowbrain gives cats "brains" - autonomous behavior systems that control `Cat` instances from Meowtion. Instead of users directly controlling cats, Meowbrain makes cats act independently based on personality traits, environmental stimuli, and decision-making algorithms. This creates lifelike, unpredictable behavior that makes cats feel alive.

## Core Concepts

### Brain (Primary Interface)

A brain controls a single cat and makes autonomous decisions:

```typescript
interface Brain {
  id: string; // Unique identifier
  cat: Cat; // The cat being controlled
  personality: Personality; // Behavioral traits
  state: BrainState; // Current decision state
  memory: Memory; // Short-term memory for decision-making

  // Lifecycle methods
  start(): void; // Begin autonomous behavior
  stop(): void; // Pause autonomous behavior
  destroy(): void; // Clean up and remove

  // Configuration
  setPersonality(personality: Partial<Personality>): void;
  setEnvironment(environment: Environment): void;

  // Observation (for debugging/monitoring)
  on(event: BrainEvent, handler: EventHandler): void;
  off(event: BrainEvent, handler: EventHandler): void;
}

interface BrainState {
  currentBehavior: BehaviorType; // What the cat is currently doing
  motivation: Motivation; // Current motivations/needs
  lastDecisionTime: number; // When last decision was made
  decisionCooldown: number; // Time until next decision
}

type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring";
type BrainEvent =
  | "behaviorChange"
  | "decisionMade"
  | "reactionTriggered";
type EventHandler = (data: any) => void;
```

### Personality

Personality traits influence decision-making and behavior patterns:

```typescript
interface Personality {
  energy: number; // 0-1: Low energy = more resting, high = more active
  curiosity: number; // 0-1: How likely to explore and investigate
  playfulness: number; // 0-1: Frequency of playful behaviors
  independence: number; // 0-1: How much cat ignores vs reacts to stimuli
  sociability: number; // 0-1: Attraction to other cats/elements
}

// Preset personalities
type PersonalityPreset =
  | "lazy"
  | "playful"
  | "curious"
  | "aloof"
  | "energetic"
  | "balanced";
```

**Preset Examples:**

- `lazy`: High rest frequency, low energy, minimal movement
- `playful`: High playfulness, high energy, frequent state changes
- `curious`: High curiosity, explores boundaries, investigates
- `aloof`: High independence, ignores most stimuli
- `energetic`: High energy, constant movement, rarely sits
- `balanced`: Medium values across all traits

### Motivation System

Motivations are internal "needs" that drive behavior:

```typescript
interface Motivation {
  rest: number; // 0-1: Need to rest/sleep (increases over time)
  stimulation: number; // 0-1: Need for activity/play (increases when idle)
  exploration: number; // 0-1: Desire to explore new areas
}
```

Motivations naturally increase/decrease over time and influence behavior choices.

### Memory

Short-term memory for decision-making:

```typescript
interface Memory {
  visitedPositions: Position[]; // Recently visited locations
  lastInteractionTime: number; // Last time cat reacted to stimulus
  boundaryHits: number; // Number of recent boundary collisions
  previousBehaviors: BehaviorType[]; // Recent behavior history
}
```

Memory helps prevent repetitive behaviors and creates variety.

### Environment

Environmental context that influences decisions:

```typescript
interface Environment {
  boundaries: Boundaries; // Movement constraints
  obstacles?: Obstacle[]; // Things to avoid
  attractors?: Attractor[]; // Things to approach
  otherCats?: Cat[]; // Other cats to interact with
}

interface Obstacle {
  position: Position;
  radius: number;
}

interface Attractor {
  position: Position;
  strength: number; // 0-1: How attractive
  type: "point" | "area";
}
```

## API Design

### Primary Function

```typescript
/**
 * Creates a brain for a cat, enabling autonomous behavior
 * @param cat - The Cat instance to control (from Meowtion)
 * @param options - Configuration for personality and environment
 */
function createBrain(cat: Cat, options?: BrainOptions): Brain;

interface BrainOptions {
  personality?: Personality | PersonalityPreset;
  environment?: Environment;
  decisionInterval?: number; // MS between decisions (default: 2000-5000 random)
  motivationDecay?: MotivationDecay; // How fast motivations change
}

interface MotivationDecay {
  rest: number; // Rate rest need increases (default: 0.001/sec)
  stimulation: number; // Rate stimulation need increases (default: 0.002/sec)
  exploration: number; // Rate exploration desire increases (default: 0.0015/sec)
}
```

### Builder Pattern

```typescript
class BrainBuilder {
  constructor(cat: Cat);

  withPersonality(
    personality: Personality | PersonalityPreset
  ): BrainBuilder;
  withEnvironment(environment: Environment): BrainBuilder;
  withDecisionInterval(min: number, max: number): BrainBuilder;
  withMotivationDecay(decay: MotivationDecay): BrainBuilder;

  build(): Brain;
}

// Usage
const brain = new BrainBuilder(cat)
  .withPersonality("playful")
  .withEnvironment({
    boundaries: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
  })
  .withDecisionInterval(1000, 3000)
  .build();
```

### Preset Personalities

```typescript
/**
 * Get a preset personality configuration
 */
function getPersonality(preset: PersonalityPreset): Personality;

// Example
const lazyPersonality = getPersonality("lazy");
// Returns: { energy: 0.2, curiosity: 0.3, playfulness: 0.2, independence: 0.7, sociability: 0.4 }
```

## Decision-Making System

### Decision Loop

Meowbrain uses a decision loop that runs at configurable intervals:

1. **Evaluate motivations**: Check current needs (rest, stimulation, exploration)
2. **Consider personality**: Weight options based on personality traits
3. **Check memory**: Avoid recent behaviors, prefer new locations
4. **Assess environment**: React to obstacles, attractors, boundaries
5. **Choose behavior**: Select behavior based on weighted probabilities
6. **Execute action**: Control the Cat instance via Meowtion methods

### Behavior Types

**Wandering**: Random movement within boundaries

- Cat picks a random point and moves there
- Movement speed based on energy level
- Changes direction when hitting boundaries or obstacles

**Resting**: Sitting or sleeping in place

- Triggered by high rest motivation
- Duration based on energy level (low energy = longer rest)
- Can transition to sleeping after extended rest

**Playing**: Playful, erratic movements

- Triggered by high playfulness + stimulation motivation
- Quick direction changes, short bursts of running
- Usually followed by resting

**Observing**: Sitting and watching

- Triggered by curiosity + low energy
- Cat sits and occasionally changes orientation
- May transition to exploration

**Exploring**: Deliberate movement to unvisited areas

- Triggered by high exploration motivation
- Moves to areas not recently visited
- Investigates boundaries and attractors

### Decision Weights

Each behavior has a base weight influenced by personality and motivations:

```typescript
function calculateBehaviorWeights(
  personality: Personality,
  motivation: Motivation,
  memory: Memory,
  environment: Environment
): BehaviorWeights;

interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
}
```

Higher weights = more likely to be chosen.

## Implementation Considerations

### Decision Timing

- Decisions are made at random intervals (prevents predictability)
- Default range: 2000-5000ms between decisions
- Some behaviors can interrupt the decision cooldown (e.g., boundary hit)

### Performance

- Use efficient spatial algorithms for obstacle/attractor checks
- Throttle motivation updates to avoid excessive calculations
- Clean up event listeners when brain is destroyed
- Pause decision loop when page is not visible

### Randomness

- Use seeded random for reproducible behavior (optional)
- Add noise to all movements for natural appearance
- Vary behavior durations within ranges

### State Transitions

Valid behavior transitions:

- Any behavior → Resting (if motivation is high enough)
- Wandering ↔ Exploring
- Observing → Wandering/Exploring
- Playing → Wandering/Resting

### Zero Dependencies

Like other Meowzer libraries:

- No external dependencies
- Pure JavaScript decision algorithms
- Native timers and events

## Usage Examples

### Basic Autonomous Cat

```typescript
import { buildCatFromSeed } from "meowkit";
import { animateCat } from "meowtion";
import { createBrain } from "meowbrain";

// Create the cat
const protoCat = buildCatFromSeed("tabby-FF9500-00FF00-m-short-v1");
const cat = animateCat(protoCat, {
  initialPosition: { x: 100, y: 100 },
  boundaries: {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  },
});

// Give it a brain
const brain = createBrain(cat, {
  personality: "playful",
});

brain.start(); // Cat now acts on its own!
```

### Custom Personality

```typescript
const brain = createBrain(cat, {
  personality: {
    energy: 0.8, // Very energetic
    curiosity: 0.9, // Very curious
    playfulness: 0.7, // Pretty playful
    independence: 0.3, // Reacts to environment
    sociability: 0.6, // Somewhat social
  },
});

brain.start();
```

### With Environment

```typescript
const brain = createBrain(cat, {
  personality: "curious",
  environment: {
    boundaries: {
      minX: 0,
      maxX: 800,
      minY: 0,
      maxY: 600,
    },
    attractors: [
      { position: { x: 400, y: 300 }, strength: 0.7, type: "point" }, // Cat drawn to center
    ],
    obstacles: [
      { position: { x: 200, y: 200 }, radius: 50 }, // Avoid this area
    ],
  },
});

brain.start();
```

### Multiple Cats with Different Personalities

```typescript
const personalities = ["lazy", "playful", "curious", "energetic"];

const catsWithBrains = personalities.map((personality, index) => {
  const protoCat = buildCatFromSeed(`tabby-FF9500-00FF00-m-short-v1`);
  const cat = animateCat(protoCat, {
    initialPosition: { x: 100 + index * 150, y: 100 },
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  });

  const brain = createBrain(cat, { personality });
  brain.start();

  return { cat, brain };
});

// All cats now act independently with different behaviors!
```

### Observing Brain Decisions

```typescript
brain.on("behaviorChange", (data) => {
  console.log(`Cat switched to ${data.newBehavior}`);
  console.log(`Motivations:`, data.motivation);
});

brain.on("decisionMade", (data) => {
  console.log("Cat made a decision:", data.chosen, data.weights);
});
```

### Dynamic Environment Updates

```typescript
// Add an attractor dynamically
brain.setEnvironment({
  ...brain.environment,
  attractors: [
    {
      position: { x: mouseX, y: mouseY },
      strength: 0.5,
      type: "point",
    },
  ],
});

// Cat will now be drawn toward mouse position
```

### Temporary Behavior Control

```typescript
// Stop autonomous behavior temporarily
brain.stop();

// Manually control cat
await cat.moveTo(400, 300, 2000);
cat.setState("sitting");

// Resume autonomous behavior
brain.start();
```

## Future Enhancements

- **Social behaviors**: Cats follow, play with, or avoid each other
- **Learning**: Cats remember and prefer certain areas/behaviors
- **Moods**: Temporary emotional states that modify behavior
- **Reactions**: Respond to specific DOM events (clicks, hovers)
- **Energy management**: Cats get tired and need rest
- **Territory**: Cats establish and defend favorite areas
- **Pack dynamics**: Multiple cats form groups or hierarchies
- **Custom behaviors**: Plugin system for user-defined behaviors
