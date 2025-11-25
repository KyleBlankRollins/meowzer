---
title: Customization Guide
description: Complete guide to customizing Meowzer cats - appearance, personality, and behavior
---

Meowzer cats are highly customizable. This guide covers every way to customize cats, from simple appearance tweaks to advanced behavior modifications.

## Appearance Customization

### Basic Colors

Every cat has primary and secondary colors:

```typescript
const cat = await meowzer.cats.create({
  primaryColor: "#FF6B35", // Orange
  secondaryColor: "#FFFFFF", // White
});
```

**Color formats accepted:**

- Hex: `'#FF6B35'`, `'#fff'`
- RGB: `'rgb(255, 107, 53)'`
- Named: `'orange'`, `'white'`, `'black'`

**Tips:**

- Use complementary colors for best results
- Test contrast for visibility
- Consider color blindness accessibility

### Patterns

Add visual interest with patterns:

```typescript
const cat = await meowzer.cats.create({
  primaryColor: "#FF6B35",
  secondaryColor: "#8B4513",
  pattern: "stripes",
});
```

**Available patterns:**

- `'solid'` - Single color, no pattern
- `'stripes'` - Tabby-style stripes
- `'spots'` - Spotted pattern
- `'tuxedo'` - Formal tuxedo markings
- `'calico'` - Multi-colored patches

**Pattern behavior:**

- Primary color = base coat
- Secondary color = pattern color
- Pattern complexity varies by type

### Eye Colors

Customize eye color independently:

```typescript
const cat = await meowzer.cats.create({
  primaryColor: "#000000",
  eyeColor: "#00FF00", // Bright green eyes
});
```

**Popular eye colors:**

- Green: `'#00FF00'`, `'#32CD32'`
- Blue: `'#0000FF'`, `'#1E90FF'`
- Yellow: `'#FFD700'`, `'#FFA500'`
- Heterochromia: Use accessories for dual eyes

### Accessories

Add personality with accessories:

```typescript
const cat = await meowzer.cats.create({
  primaryColor: "#FF6B35",
  accessories: ["collar", "bow"],
});
```

**Available accessories:**

- `'collar'` - Classic cat collar
- `'bow'` - Decorative bow tie
- `'bell'` - Bell on collar
- `'bandana'` - Stylish bandana
- `'hat'` - Tiny hat

**Multiple accessories:**

```typescript
// Stack multiple accessories
accessories: ["collar", "bell", "bow"];
```

**Accessory colors:**

```typescript
// Customize accessory colors
accessoryColors: {
  collar: '#FF0000',
  bow: '#0000FF'
}
```

### Size

Adjust cat size:

```typescript
const cat = await meowzer.cats.create({
  size: "large",
});
```

**Size options:**

- `'small'` - 0.75x scale
- `'medium'` - 1x scale (default)
- `'large'` - 1.5x scale
- Custom: `{ width: 100, height: 80 }`

**Size considerations:**

- Affects hit detection
- Influences movement speed slightly
- May impact performance with many large cats

### Complete Appearance Example

```typescript
const fancyCat = await meowzer.cats.create({
  // Colors
  primaryColor: "#FF6B35", // Orange base
  secondaryColor: "#FFFFFF", // White markings
  eyeColor: "#00FF00", // Green eyes

  // Pattern
  pattern: "stripes",

  // Accessories
  accessories: ["collar", "bell", "bow"],
  accessoryColors: {
    collar: "#FF0000",
    bell: "#FFD700",
    bow: "#0000FF",
  },

  // Size
  size: "large",
});
```

## Personality Customization

### Using Presets

The easiest way to set personality:

```typescript
const cat = await meowzer.cats.create({
  personality: "playful",
});
```

**Available presets:**

**Playful:**

- High energy and playfulness
- Loves toys
- Active exploration
- Quick to engage

**Lazy:**

- Low energy
- Frequent resting
- Slow movement
- Minimal toy interaction

**Curious:**

- High curiosity
- Explores everything
- Notices items from farther away
- Investigates all changes

**Energetic:**

- Very high energy
- Constant movement
- Rarely sits
- Fast reactions

**Calm:**

- Balanced traits
- Steady behavior
- Moderate activity
- Peaceful demeanor

### Custom Personality Traits

Fine-tune with individual traits (0.0 to 1.0):

```typescript
const cat = await meowzer.cats.create({
  personality: {
    energy: 0.8, // Very active
    playfulness: 0.6, // Moderately playful
    curiosity: 0.9, // Very curious
    sociability: 0.5, // Balanced
    independence: 0.3, // Responsive to environment
  },
});
```

**Trait effects:**

**Energy (0.0 - 1.0):**

- `0.0-0.3` - Lazy, rests often, slow movement
- `0.4-0.6` - Moderate activity, balanced
- `0.7-1.0` - Very active, rarely rests

**Playfulness (0.0 - 1.0):**

- `0.0-0.3` - Ignores toys, no play behavior
- `0.4-0.6` - Occasional toy interaction
- `0.7-1.0` - Loves toys, frequent play

**Curiosity (0.0 - 1.0):**

- `0.0-0.3` - Stays in small area, low exploration
- `0.4-0.6` - Moderate wandering
- `0.7-1.0` - Explores constantly, large detection radius

**Sociability (0.0 - 1.0):**

- `0.0-0.3` - Ignores food/water often
- `0.4-0.6` - Normal interaction response
- `0.7-1.0` - Quick to approach needs

**Independence (0.0 - 1.0):**

- `0.0-0.3` - Very reactive to environment
- `0.4-0.6` - Balanced autonomy
- `0.7-1.0` - Focuses on own goals, less reactive

### Trait Combinations

**Explorer cat:**

```typescript
personality: {
  energy: 0.7,
  playfulness: 0.5,
  curiosity: 0.9,      // Key trait
  sociability: 0.4,
  independence: 0.6
}
```

**Couch potato:**

```typescript
personality: {
  energy: 0.2,         // Very low
  playfulness: 0.3,
  curiosity: 0.3,
  sociability: 0.6,
  independence: 0.5
}
```

**Social butterfly:**

```typescript
personality: {
  energy: 0.6,
  playfulness: 0.7,
  curiosity: 0.6,
  sociability: 0.9,    // Key trait
  independence: 0.2    // Low independence
}
```

**Lone wanderer:**

```typescript
personality: {
  energy: 0.7,
  playfulness: 0.4,
  curiosity: 0.8,
  sociability: 0.3,
  independence: 0.9    // Very independent
}
```

### Modifying Existing Cats

Can't directly modify personality after creation, but you can:

**Option 1: Save and recreate**

```typescript
// Get current data
const data = cat.toData();

// Modify personality
data.personality.playfulness = 0.9;

// Destroy old cat
await meowzer.cats.destroy(cat.id);

// Create with modified data
const newCat = await meowzer.cats.create(data);
```

**Option 2: Use hooks**

```typescript
// Influence decisions without changing traits
meowzer.hooks.register("beforeDecision", (cat, context) => {
  if (cat.id === specificCatId) {
    // Boost toy scores
    context.scores.playWithYarn *= 2;
  }
  return context;
});
```

## Behavior Customization

### Initial State

Set the starting state:

```typescript
const cat = await meowzer.cats.create({
  initialState: "sitting",
});
```

**Valid states:**

- `'idle'` - Standing (default)
- `'sitting'` - Resting
- `'walking'` - Moving (requires destination)

### Initial Position

Control spawn location:

```typescript
const cat = await meowzer.cats.create({
  initialPosition: { x: 100, y: 200 },
});
```

**Positioning strategies:**

**Center of page:**

```typescript
initialPosition: {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
}
```

**Random in region:**

```typescript
const x = 100 + Math.random() * 200; // 100-300px
const y = 100 + Math.random() * 200;
initialPosition: {
  x, y;
}
```

**Near element:**

```typescript
const element = document.getElementById('spawn-point');
const rect = element.getBoundingClientRect();
initialPosition: { x: rect.left, y: rect.top }
```

### Boundaries

Restrict where cats can go:

```typescript
const cat = await meowzer.cats.create({
  boundaries: {
    minX: 100,
    maxX: 500,
    minY: 100,
    maxY: 400,
  },
});
```

**Use cases:**

**Contain to element:**

```typescript
const container = document.getElementById('cat-zone');
const rect = container.getBoundingClientRect();

boundaries: {
  minX: rect.left,
  maxX: rect.right,
  minY: rect.top,
  maxY: rect.bottom
}
```

**Multi-zone setup:**

```typescript
// Create cats in different zones
const zones = [
  { minX: 0, maxX: 300, minY: 0, maxY: 400 },
  { minX: 400, maxX: 700, minY: 0, maxY: 400 },
];

for (const zone of zones) {
  await meowzer.cats.create({ boundaries: zone });
}
```

**Responsive boundaries:**

```typescript
// Update on window resize
window.addEventListener("resize", () => {
  for (const cat of meowzer.cats.getAll()) {
    cat.updateBoundaries({
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    });
  }
});
```

### Movement Speed

Adjust how fast cats move:

```typescript
const cat = await meowzer.cats.create({
  movementSpeed: 1.5, // 1.5x normal speed
});
```

**Speed guidelines:**

- `0.5` - Very slow, lazy movement
- `1.0` - Normal speed (default)
- `1.5` - Quick movement
- `2.0` - Very fast, energetic

**Combine with personality:**

```typescript
// Fast energetic cat
{
  personality: 'energetic',
  movementSpeed: 2.0
}

// Slow lazy cat
{
  personality: 'lazy',
  movementSpeed: 0.5
}
```

### Decision Frequency

Control how often cats make decisions:

```typescript
const cat = await meowzer.cats.create({
  decisionInterval: 3000, // 3 seconds between decisions
});
```

**Interval guidelines:**

- `1000` - Very responsive, frequent decisions
- `2000` - Normal (default)
- `5000` - Slower, more contemplative
- `10000` - Very slow decision-making

**Performance tip:**

```typescript
// Slower intervals for many cats
const catCount = meowzer.cats.getAll().length;
const interval = Math.max(2000, catCount * 100);

await meowzer.cats.create({
  decisionInterval: interval,
});
```

## Advanced Customization

### Using Hooks

Hooks let you inject custom behavior:

**Modify decisions:**

```typescript
meowzer.hooks.register("beforeDecision", (cat, context) => {
  // Always prioritize food for a specific cat
  if (cat.id === hungryCatId && context.scores.eatFood) {
    context.scores.eatFood *= 3;
  }
  return context;
});
```

**Add custom actions:**

```typescript
meowzer.hooks.register("afterDecision", (cat, action) => {
  // Log all decisions
  console.log(`${cat.id} decided: ${action}`);
});
```

**Customize animations:**

```typescript
meowzer.hooks.register("beforeAnimate", (cat, animation) => {
  // Speed up animations for energetic cats
  if (cat.personality.energy > 0.7) {
    animation.duration *= 0.7;
  }
  return animation;
});
```

### Custom Behaviors

Create entirely custom behaviors:

```typescript
meowzer.hooks.register("registerBehaviors", (behaviors) => {
  behaviors.spin = async function (cat) {
    // Custom spinning behavior
    cat.meowtion.element.style.transform = "rotate(360deg)";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    cat.meowtion.element.style.transform = "";
  };

  return behaviors;
});

// Trigger custom behavior
meowzer.hooks.register("beforeDecision", (cat, context) => {
  // Randomly spin
  if (Math.random() < 0.1) {
    context.scores.spin = 1000; // High priority
  }
  return context;
});
```

### State Overrides

Monitor and override state changes:

```typescript
meowzer.on("stateChange", ({ cat, oldState, newState }) => {
  // Prevent sitting for energetic cats
  if (newState === "sitting" && cat.personality.energy > 0.8) {
    // Force back to idle
    cat.stateMachine.transition("idle");
  }
});
```

### Perception Customization

Modify what cats perceive:

```typescript
meowzer.hooks.register("afterPerception", (cat, perception) => {
  // Increase detection range for curious cats
  if (cat.personality.curiosity > 0.7) {
    perception.detectionRadius *= 1.5;
  }

  return perception;
});
```

## Preset Configurations

### Common Cat Archetypes

**Guard cat (stays in area):**

```typescript
const guard = await meowzer.cats.create({
  personality: {
    energy: 0.6,
    playfulness: 0.3,
    curiosity: 0.4,
    sociability: 0.5,
    independence: 0.7,
  },
  boundaries: {
    minX: 100,
    maxX: 300,
    minY: 100,
    maxY: 300,
  },
  movementSpeed: 0.8,
});
```

**Playful kitten:**

```typescript
const kitten = await meowzer.cats.create({
  personality: "playful",
  size: "small",
  movementSpeed: 1.5,
  primaryColor: "#FFA500",
  pattern: "spots",
  accessories: ["bow"],
});
```

**Wise old cat:**

```typescript
const elder = await meowzer.cats.create({
  personality: {
    energy: 0.3,
    playfulness: 0.2,
    curiosity: 0.6,
    sociability: 0.7,
    independence: 0.8,
  },
  size: "large",
  movementSpeed: 0.6,
  primaryColor: "#808080",
  pattern: "solid",
  accessories: ["collar"],
});
```

**Chaotic gremlin:**

```typescript
const gremlin = await meowzer.cats.create({
  personality: {
    energy: 1.0,
    playfulness: 1.0,
    curiosity: 0.9,
    sociability: 0.4,
    independence: 0.3,
  },
  movementSpeed: 2.0,
  decisionInterval: 1000,
  primaryColor: "#000000",
  eyeColor: "#FF0000",
  accessories: ["hat"],
});
```

## Randomization

### Random Colors

```typescript
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const cat = await meowzer.cats.create({
  primaryColor: randomColor(),
  secondaryColor: randomColor(),
});
```

### Random Personality

```typescript
const presets = ["playful", "lazy", "curious", "energetic", "calm"];
const random = presets[Math.floor(Math.random() * presets.length)];

const cat = await meowzer.cats.create({
  personality: random,
});
```

### Random Everything

```typescript
function createRandomCat() {
  const patterns = ["solid", "stripes", "spots", "tuxedo", "calico"];
  const accessories = ["collar", "bow", "bell", "bandana", "hat"];
  const sizes = ["small", "medium", "large"];
  const presets = ["playful", "lazy", "curious", "energetic", "calm"];

  return meowzer.cats.create({
    primaryColor: randomColor(),
    secondaryColor: randomColor(),
    eyeColor: randomColor(),
    pattern: patterns[Math.floor(Math.random() * patterns.length)],
    accessories: [
      accessories[Math.floor(Math.random() * accessories.length)],
    ],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    personality: presets[Math.floor(Math.random() * presets.length)],
  });
}
```

## Best Practices

### Appearance

**Do:**

- Test color combinations for readability
- Use consistent styling across cats
- Consider theme/brand colors
- Test on different backgrounds

**Don't:**

- Use colors too similar to background
- Overuse accessories (cluttered)
- Make cats too large (performance)

### Personality

**Do:**

- Match personality to use case
- Test different combinations
- Document expected behavior
- Use presets for consistency

**Don't:**

- Create all cats with same personality
- Use extreme values without testing
- Forget personality affects performance

### Behavior

**Do:**

- Set appropriate boundaries
- Match speed to personality
- Test decision intervals
- Monitor performance

**Don't:**

- Make boundaries too small
- Set speed too high (jerky)
- Use very short intervals (CPU intensive)

## Troubleshooting

**Cat not appearing:**

- Check initial position in viewport
- Verify boundaries include spawn point
- Ensure colors contrast with background

**Cat not moving:**

- Check energy level (might be resting)
- Verify boundaries allow movement
- Check decision interval not too long

**Cat ignoring interactions:**

- Check personality traits (sociability, independence)
- Verify cat in range of items
- Ensure cat not busy with other action

**Performance issues:**

- Reduce cat count
- Increase decision intervals
- Use smaller sizes
- Simplify boundaries

## Next Steps

- [AI Behaviors](/concepts/ai-behaviors) - Understand decision-making
- [Performance Guide](/guides/performance) - Optimize for many cats
- [Best Practices](/guides/best-practices) - Production patterns

---

_Customization makes each Meowzer cat unique! Experiment with combinations to create the perfect cats for your project._ 🎨
