---
title: Autonomous Cats
description: Watch autonomous cats with AI behavior move around on screen using Meowzer
---

Try out Meowzer's autonomous cat system. Add cats with different personalities and watch them wander, rest, play, and explore on their own!

<mb-meowzer-demo></mb-meowzer-demo>

## How it works

The demo above uses the **Meowzer** library, which combines:

- **Meowkit** - Creates unique cat sprites from settings (appearance, colors, patterns)
- **Meowtion** - Animates cats with smooth movement and physics
- **Meowbrain** - Gives cats AI-driven autonomous behavior based on personality
- **Meowbase** - Stores cat data persistently (not used in this demo)

### Personalities

Each cat can have one of these personality types:

- **Lazy** - Low energy, rests frequently, minimal movement
- **Playful** - High energy, loves to move around and play
- **Curious** - Explores new areas, investigates boundaries
- **Aloof** - Independent, does its own thing
- **Energetic** - Always active, rarely rests
- **Balanced** - Mix of all traits (default)

### Autonomous Behavior

Cats make their own decisions about what to do next based on:

- Their personality traits (energy, curiosity, playfulness, etc.)
- Current motivations (need for rest, stimulation, exploration)
- Memory (where they've been, what they've done recently)
- Environment (boundaries, obstacles, other cats)

## Creating Cats

```typescript
import { createCat, createRandomCat } from "meowzer";

// Create a specific cat
const cat = createCat(
  {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  },
  {
    personality: "playful",
    autoStart: true,
  }
);

// Or create a random cat
const randomCat = createRandomCat({
  personality: "curious",
});
```

## Managing Cats

```typescript
import {
  getAllCats,
  pauseAllCats,
  resumeAllCats,
  destroyAllCats,
} from "meowzer";

// Get all active cats
const cats = getAllCats();
console.log(`${cats.length} cats are active`);

// Pause all cats (stops autonomous behavior)
pauseAllCats();

// Resume all cats
resumeAllCats();

// Remove all cats from the page
destroyAllCats();
```

## Zero Dependencies

Meowzer has **zero external dependencies** - it's built entirely with native JavaScript/TypeScript. This means:

- No library bloat
- Fast loading times
- Easy to integrate
- Works in all modern browsers
