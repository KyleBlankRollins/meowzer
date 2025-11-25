---
title: AI Behaviors
description: Understanding how MeowBrain makes cats autonomous and intelligent
---

MeowBrain is the intelligence layer that brings Meowzer cats to life. It makes cats autonomous, personality-driven, and responsive to their environment. Understanding how the AI works helps you predict behavior and customize it effectively.

## Core Concepts

### What Makes Cats "Smart"?

Meowzer cats exhibit intelligent behavior through:

1. **Autonomous Decision-Making** - Cats choose actions independently
2. **Personality-Driven Behavior** - Individual traits influence decisions
3. **Environmental Awareness** - Cats perceive and react to surroundings
4. **Goal-Oriented Actions** - Cats pursue needs and interests
5. **State-Based Behavior** - Current state affects future actions

### The AI Architecture

```
┌─────────────────────────────────────────┐
│          MeowBrain Instance             │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Perception   │───▶│   Decision   │  │
│  │   System     │    │    Engine    │  │
│  └──────────────┘    └──────┬───────┘  │
│                             ↓          │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Personality  │───▶│   Behavior   │  │
│  │    Traits    │    │ Orchestrator │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## The Perception System

### What Cats Can Detect

Cats have a perception radius and can detect:

**Nearby Needs:**

- Food (basic and fancy)
- Water
- Distance to each need
- Type of need

**Toys and Interactions:**

- Yarn balls
- Laser pointer (global, no distance limit)
- Toy positions
- Toy availability

**Environment:**

- Boundaries (page edges or custom bounds)
- Current position
- Available space
- Movement options

**Internal State:**

- Current hunger level
- Current energy level
- Current happiness
- Active state (idle, walking, etc.)

### Detection Radius

```typescript
// Typical detection distances
const DETECTION_RANGES = {
  food: 200, // pixels
  water: 200,
  yarn: 150,
  laser: Infinity, // Always visible when active
  boundary: 50, // Edge avoidance
};
```

**How it works:**

```typescript
function detectFood(catPosition) {
  const allFood = getAllNeedsOfType("food");

  return allFood.filter((food) => {
    const distance = calculateDistance(catPosition, food.position);
    return distance <= DETECTION_RANGES.food;
  });
}
```

### Perception Factors

**What influences detection:**

1. **Distance** - Closer items detected first
2. **Curiosity** - High curiosity = larger effective radius
3. **Current Focus** - Active goals may filter perception
4. **Personality** - Traits affect what gets noticed

**Example:**

```typescript
// Playful cat notices yarn more readily
const effectiveRadius = baseRadius * (1 + personality.playfulness);

// Curious cat detects items farther away
const curiosityBonus = personality.curiosity * 50; // +50px per point
const finalRadius = baseRadius + curiosityBonus;
```

## The Decision Engine

### How Decisions Are Made

Every decision cycle (typically 1-3 seconds), the brain:

```
1. Perceive surroundings
    ↓
2. Generate action options
    ↓
3. Score each option
    ↓
4. Apply personality weights
    ↓
5. Add randomness (realism)
    ↓
6. Select highest scoring action
    ↓
7. Execute action
```

### Action Options

**Available actions:**

```typescript
const POSSIBLE_ACTIONS = [
  "idle", // Stand still, look around
  "walkRandom", // Wander to random point
  "rest", // Sit down
  "eatFood", // Approach and eat food
  "drinkWater", // Approach and drink water
  "playWithYarn", // Approach and play with yarn
  "chaseLaser", // Follow laser pointer
  "avoidBoundary", // Turn away from edge
];
```

### Scoring System

Each action receives a score based on multiple factors:

```typescript
function scoreAction(action, context) {
  let score = 0;

  // Base scores
  switch (action) {
    case "eatFood":
      score = context.hunger * 10; // 0-1000 range
      if (hasNearbyFood) score += 200;
      if (isFancyFood) score += 100;
      break;

    case "rest":
      score = (100 - context.energy) * 8; // More score when tired
      break;

    case "playWithYarn":
      score = context.personality.playfulness * 500;
      if (hasNearbyYarn) score += 300;
      break;

    case "walkRandom":
      score = context.personality.curiosity * 300;
      score += context.personality.energy * 200;
      break;
  }

  return score;
}
```

### Personality Influence

Personality traits directly affect action scores:

```typescript
// Playful cat (playfulness: 0.9)
playWithYarn: base 450 → weighted 450 * 0.9 = 405
walkRandom: base 200 → weighted 200 * 0.6 = 120

// Lazy cat (energy: 0.2, playfulness: 0.3)
rest: base 600 → weighted 600 * 1.2 = 720
playWithYarn: base 450 → weighted 450 * 0.3 = 135
```

**Weight multipliers:**

```typescript
function applyPersonalityWeights(scores, personality) {
  return {
    idle: scores.idle * (1 - personality.energy),
    walkRandom:
      scores.walkRandom * personality.curiosity * personality.energy,
    rest: scores.rest * (1 - personality.energy + 0.5),
    eatFood: scores.eatFood * personality.sociability,
    playWithYarn: scores.playWithYarn * personality.playfulness,
    chaseLaser: scores.chaseLaser * personality.playfulness,
  };
}
```

### Randomness and Realism

Pure score-based decisions feel robotic. Adding randomness creates natural behavior:

```typescript
function selectAction(scores) {
  // Add random variance (-10% to +10%)
  const randomized = Object.entries(scores).map(
    ([action, score]) => ({
      action,
      score: score * (0.9 + Math.random() * 0.2),
    })
  );

  // Sort by score
  randomized.sort((a, b) => b.score - a.score);

  // Usually pick top, occasionally pick 2nd or 3rd
  const roll = Math.random();
  if (roll < 0.7) return randomized[0].action; // 70% - best
  if (roll < 0.9) return randomized[1]?.action; // 20% - second
  return randomized[2]?.action || randomized[0].action; // 10% - third
}
```

**Benefits:**

- Cats don't always choose optimal action
- More lifelike, less predictable
- Creates variety in behavior
- Feels more autonomous

## Personality Traits

### Core Traits

Each cat has 5 core traits (0.0 to 1.0 scale):

**Energy:**

- How active and energetic the cat is
- High energy → more movement, less rest
- Low energy → more sitting, slower walking

**Playfulness:**

- Interest in toys and play activities
- High playfulness → chases yarn, loves laser
- Low playfulness → ignores toys

**Curiosity:**

- Desire to explore and investigate
- High curiosity → wanders more, larger perception
- Low curiosity → stays in smaller area

**Sociability:**

- Response to food and interactions
- High sociability → approaches needs faster
- Low sociability → more independent

**Independence:**

- Tendency to ignore external stimuli
- High independence → focuses on own goals
- Low independence → reactive to environment

### Personality Presets

**Playful:**

```typescript
{
  energy: 0.8,
  playfulness: 0.9,
  curiosity: 0.7,
  sociability: 0.6,
  independence: 0.4
}
```

_Loves toys, high energy, explores actively_

**Lazy:**

```typescript
{
  energy: 0.2,
  playfulness: 0.3,
  curiosity: 0.4,
  sociability: 0.5,
  independence: 0.6
}
```

_Rests often, slow movement, low activity_

**Curious:**

```typescript
{
  energy: 0.6,
  playfulness: 0.5,
  curiosity: 0.9,
  sociability: 0.5,
  independence: 0.3
}
```

_Explores everything, notices all items_

**Energetic:**

```typescript
{
  energy: 0.95,
  playfulness: 0.7,
  curiosity: 0.7,
  sociability: 0.5,
  independence: 0.4
}
```

_Constantly moving, rarely sits, very active_

**Calm:**

```typescript
{
  energy: 0.5,
  playfulness: 0.4,
  curiosity: 0.5,
  sociability: 0.7,
  independence: 0.3
}
```

_Balanced behavior, responds to interactions_

### How Traits Work Together

**Energy + Playfulness:**

- High both → active toy chaser
- High energy, low playfulness → active wanderer
- Low energy, high playfulness → lazy but toy-responsive

**Curiosity + Independence:**

- High both → explores alone extensively
- High curiosity, low independence → explores reactively
- Low curiosity, high independence → stays in place

**Sociability + Independence:**

- High sociability, low independence → very responsive
- Both high → selective interaction (contradiction!)
- Both low → minimal interaction

## Behavior Orchestrator

### Role

The orchestrator manages behavior execution:

```typescript
class BehaviorOrchestrator {
  async run() {
    while (this.active) {
      // 1. Perceive
      const context = this.perceive();

      // 2. Decide
      const action = this.decide(context);

      // 3. Execute
      await this.execute(action);

      // 4. Wait
      await this.sleep(this.getInterval());
    }
  }
}
```

### Behavior Execution

**Typical action execution:**

```typescript
async function executeEatFood(food) {
  // 1. Set goal
  this.currentGoal = { type: "eat", target: food };

  // 2. Change state
  this.stateMachine.transition("walking");

  // 3. Move to food
  await this.moveTo(food.position);

  // 4. Arrive at food
  this.stateMachine.transition("eating");

  // 5. Consume
  await this.consumeFood(food);

  // 6. Update stats
  this.hunger = Math.max(0, this.hunger - 30);

  // 7. Clear goal
  this.currentGoal = null;

  // 8. Return to idle
  this.stateMachine.transition("idle");
}
```

### State Machine Integration

Behaviors control state transitions:

```
Decision: "Eat food"
    ↓
Behavior: executeEatFood()
    ↓
State: IDLE → WALKING
    ↓
Animation: Walk animation plays
    ↓
Movement: Cat walks to food
    ↓
State: WALKING → EATING
    ↓
Animation: Eating animation
    ↓
Consumption: Food removed
    ↓
State: EATING → IDLE
    ↓
Animation: Idle animation
```

**State affects future decisions:**

- Can't eat while walking
- Can't walk while eating
- Can play while idle
- Rest requires transition to sitting

### Interruptions

Some actions can interrupt others:

```typescript
function canInterrupt(currentAction, newAction) {
  const INTERRUPTION_RULES = {
    walking: ["chaseLaser", "avoidBoundary"],
    idle: "*", // Can be interrupted by anything
    sitting: ["chaseLaser", "eatFood"],
    eating: [], // Cannot interrupt eating
    playing: ["chaseLaser"],
  };

  const allowed = INTERRUPTION_RULES[currentAction];
  return allowed === "*" || allowed.includes(newAction);
}
```

**High priority actions:**

- Laser pointer (interrupts most things)
- Boundary avoidance (safety)
- Food (if very hungry)

## Decision Examples

### Scenario 1: Hungry Cat with Nearby Food

```
Context:
  - Hunger: 80 (out of 100)
  - Energy: 60
  - Position: (100, 100)
  - Nearby food at (150, 150) - distance: 70px
  - Personality: balanced (all 0.5)

Scoring:
  - eatFood: 80*10 + 200 = 1000
  - walkRandom: 0.5*300 + 0.5*200 = 250
  - rest: (100-60)*8 = 320
  - playWithYarn: no yarn, base = 0
  - idle: base = 100

Selected: eatFood (clear winner)

Execution:
  1. Walk to food
  2. Eat food
  3. Hunger drops to 50
  4. Return to idle
```

### Scenario 2: Playful Cat with Yarn

```
Context:
  - Hunger: 30
  - Energy: 80
  - Position: (200, 200)
  - Yarn at (250, 220) - distance: 55px
  - Personality: playful (playfulness: 0.9, energy: 0.8)

Scoring:
  - playWithYarn: 0.9*500 + 300 = 750
  - walkRandom: 0.7*300 + 0.8*200 = 370
  - eatFood: 30*10 = 300
  - rest: (100-80)*8 = 160

Selected: playWithYarn

Execution:
  1. Walk to yarn
  2. Transition to playing state
  3. Play animation
  4. Return to idle after play duration
```

### Scenario 3: Lazy Cat

```
Context:
  - Hunger: 40
  - Energy: 20 (very tired)
  - Position: (150, 150)
  - Food at (200, 200)
  - Personality: lazy (energy: 0.2, playfulness: 0.3)

Scoring:
  - rest: (100-20)*8 * 1.2 = 768
  - eatFood: 40*10 + 200 = 600
  - walkRandom: 0.4*300 * 0.2 = 24
  - playWithYarn: no yarn = 0

Selected: rest (too tired to even eat)

Execution:
  1. Transition to sitting
  2. Sit for duration
  3. Energy regenerates
  4. Eventually might eat when rested
```

### Scenario 4: Laser Pointer Interruption

```
Current Activity:
  - Cat walking randomly
  - Current state: WALKING

Event: Laser pointer activated

New Decision:
  - chaseLaser: 0.9*1000 = 900 (very high)
  - continueWalking: current action = 200

Interruption Check:
  - canInterrupt('walking', 'chaseLaser') = true

Result:
  1. Stop walking
  2. Transition to walking toward laser
  3. Follow laser pointer
  4. When laser turns off, return to previous behavior
```

## Customization Hooks

### Modifying Decisions

```typescript
// Influence decision scoring
SDK.hooks.register("beforeDecision", (cat, context) => {
  // Example: Make cat always prefer food
  if (context.actions.eatFood) {
    context.actions.eatFood.score *= 2;
  }

  return context;
});
```

### Custom Behaviors

```typescript
// Add new behavior
SDK.hooks.register("registerBehaviors", (behaviors) => {
  behaviors.customAction = async function (cat, context) {
    // Your custom behavior
    console.log("Custom behavior executed!");
  };

  return behaviors;
});
```

### Perception Overrides

```typescript
// Modify what cats perceive
SDK.hooks.register("afterPerception", (cat, perception) => {
  // Add custom items to perception
  perception.customItems = findCustomItems();

  return perception;
});
```

## Performance Considerations

### Decision Frequency

```typescript
// Decision interval based on state
const INTERVALS = {
  idle: 2000, // 2 seconds between decisions
  walking: 3000, // Check every 3s while walking
  sitting: 4000, // Slower checks while resting
  playing: 1000, // Faster during play
  eating: 5000, // Slow while eating
};
```

**Why variable intervals:**

- Active states need faster response
- Idle states can be slower
- Reduces CPU usage
- Maintains responsiveness

### Perception Optimization

```typescript
// Only check what's needed
function perceive() {
  // Quick checks first
  const laser = checkLaserPointer(); // Fast global check
  if (laser) return { laser }; // Skip everything else

  // Use spatial grid for efficiency
  const nearbyItems = spatialGrid.findNearby(position);

  // Filter by type and distance
  const relevant = filterRelevant(nearbyItems);

  return relevant;
}
```

### Batching Decisions

For many cats:

```typescript
// Stagger decision times to spread CPU load
cats.forEach((cat, index) => {
  const offset = index * 100; // 100ms apart
  cat.brain.setDecisionOffset(offset);
});
```

## Best Practices

### Working with AI

**Do:**

- Let cats make their own decisions
- Use events to react to behavior
- Adjust personality for desired behavior
- Test with different personality types

**Don't:**

- Force specific actions constantly
- Override decisions every cycle
- Ignore personality traits
- Create conflicting influences

### Debugging Behavior

```typescript
// Enable decision logging
SDK.config.debug.decisions = true;

// See what cats are thinking
meowzer.on("decision", ({ cat, action, scores }) => {
  console.log(`${cat.id} decided: ${action}`);
  console.log("Scores:", scores);
});
```

### Balancing Personalities

```typescript
// Test personality combinations
const personalities = [
  "playful",
  "lazy",
  "curious",
  "energetic",
  "calm",
];

for (const preset of personalities) {
  const cat = await meowzer.cats.create({ personality: preset });
  // Observe and adjust
}
```

## Next Steps

Explore related topics:

- [Architecture](/concepts/architecture) - How MeowBrain fits in
- [Cat Lifecycle](/concepts/cat-lifecycle) - How AI integrates with lifecycle
- [Customization Tutorial](/tutorials/customization) - Customize cat behavior

---

_Understanding the AI system helps you predict, customize, and extend cat behavior to create unique experiences._ 🧠
