---
title: Quick Start
description: Create your first Meowzer cat in 5 minutes
---

Get a cat on your page in under 5 minutes. This guide assumes you've already [installed Meowzer](/getting-started/installation).

## The Essentials

Creating a Meowzer cat requires just 4 steps:

```typescript
import { Meowzer } from "meowzer";

// 1. Create SDK instance
const meowzer = new Meowzer();

// 2. Initialize (REQUIRED before use)
await meowzer.init();

// 3. Create a cat
const cat = await meowzer.cats.create();
```

That's it! The cat automatically appears and starts wandering around your page. 🎉

## What Just Happened?

Let's break down each step:

### 1. Create SDK Instance

```typescript
const meowzer = new Meowzer();
```

Creates a new Meowzer instance. This is your main entry point to all SDK features. You can create multiple instances if needed (e.g., separate instances for different pages).

### 2. Initialize

```typescript
await meowzer.init();
```

**This is required before using any Meowzer features.** Initialization sets up:

- Storage connections (IndexedDB)
- Event systems
- Default configurations

Always `await` this call before proceeding.

### 3. Create a Cat

```typescript
const cat = await meowzer.cats.create();
```

Generates a new cat with:

- Random appearance (colors, pattern, size)
- Random personality traits
- Unique AI behaviors

Returns a `MeowzerCat` instance you can interact with.

The cat is automatically added to the page and starts its autonomous behavior:

- Appears as an animated SVG
- Starts wandering around immediately
- Makes decisions based on its personality
- Responds to interactions

## Complete Example

Here's a full working example you can copy and paste:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My First Meowzer Cat</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    </style>
  </head>
  <body>
    <script type="module">
      import { Meowzer } from "https://esm.sh/meowzer";

      async function init() {
        const meowzer = new Meowzer();
        await meowzer.init();

        const cat = await meowzer.cats.create({
          name: "Whiskers",
        });

        // Cat automatically appears on the page!

        console.log("Cat created:", cat.name);
      }

      init();
    </script>
  </body>
</html>
```

Copy this into an HTML file, open it in a browser, and watch your cat appear!

## Customizing Your Cat

### Give It a Name

```typescript
const cat = await meowzer.cats.create({
  name: "Mittens",
});
```

### Choose Colors

```typescript
const cat = await meowzer.cats.create({
  name: "Tiger",
  settings: {
    color: "#FF6600", // Orange fur
    eyeColor: "#FFD700", // Golden eyes
  },
});
```

### Pick a Pattern

```typescript
const cat = await meowzer.cats.create({
  settings: {
    color: "#8B4513",
    pattern: "tabby", // Options: solid, tabby, spotted, tuxedo, calico
  },
});
```

### Set Personality

```typescript
const cat = await meowzer.cats.create({
  name: "Lazy Larry",
  personality: "lazy", // Options: playful, lazy, curious, energetic, calm
});
```

## Creating Multiple Cats

Want more cats? Just create more:

```typescript
const meowzer = new Meowzer();
await meowzer.init();

// Create 3 cats
const cat1 = await meowzer.cats.create({ name: "Whiskers" });
const cat2 = await meowzer.cats.create({ name: "Mittens" });
const cat3 = await meowzer.cats.create({ name: "Shadow" });

// All cats automatically appear on the page!
```

Or use a loop:

```typescript
const catNames = ["Whiskers", "Mittens", "Shadow", "Tiger", "Fluffy"];

for (const name of catNames) {
  const cat = await meowzer.cats.create({ name });
  // Each cat automatically appears on the page!
}
```

## Interacting With Cats

### Feed a Cat

```typescript
// Place food where the cat can find it
await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});
```

The cat will notice the food and walk over to eat it!

### Throw a Toy

```typescript
// Give the cat something to play with
await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});
```

### Use a Laser Pointer

```typescript
const laser = meowzer.createLaserPointer();

// Turn on the laser
laser.turnOn({ x: 300, y: 300 });

// Move it around
laser.moveTo({ x: 600, y: 400 });

// Turn it off
laser.turnOff();
```

## Saving and Loading

Cats can be saved to IndexedDB and loaded later:

### Save a Cat

```typescript
// Cat automatically gets saved when created (if storage enabled)
// Or manually save:
await meowzer.storage.save(cat.id);
```

### Load a Saved Cat

```typescript
const meowzer = new Meowzer();
await meowzer.init();

// Get list of saved cats
const savedCats = await meowzer.storage.listCats();
console.log("Saved cats:", savedCats);

// Load a specific cat by ID
const cat = await meowzer.storage.load("cat-id-here");
// Cat automatically appears on the page!
```

## Common Patterns

### Set Boundaries

Prevent cats from wandering off-screen:

```typescript
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    },
  },
});
```

### Update Boundaries on Resize

```typescript
window.addEventListener("resize", () => {
  const cats = meowzer.cats.getAll();
  cats.forEach((cat) => {
    cat.setBoundaries({
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    });
  });
});
```

### Listen to Events

```typescript
cat.on("stateChanged", (event) => {
  console.log(`Cat is now ${event.newState}`);
});

meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("New cat created:", ctx.catId);
});
```

### Remove a Cat

```typescript
// Clean up when done
cat.destroy();
```

## Using a Bundler

For production, use a bundler like Vite:

**package.json:**

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "meowzer": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

**main.js:**

```typescript
import { Meowzer } from "meowzer";

async function init() {
  const meowzer = new Meowzer();
  await meowzer.init();

  const cat = await meowzer.cats.create({
    name: "Production Cat",
  });

  // Cat automatically appears on the page!
}

init();
```

**Run:**

```bash
npm run dev
```

## Troubleshooting

### Cat Doesn't Appear

**Check:**

1. Did you call `await meowzer.init()`?
2. Is your container visible in the DOM?
3. Check browser console for errors

### Cat Wanders Off Screen

**Solution:** Set boundaries when creating the Meowzer instance (see "Set Boundaries" above).

### TypeScript Errors

**Solution:** Meowzer includes full TypeScript definitions. Ensure your `tsconfig.json` is configured for ES modules.

### Storage Not Working

**Solution:** Some browsers disable IndexedDB in private mode. Use memory adapter:

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "memory",
  },
});
```

## Next Steps

Now that you have a basic cat working:

1. **[First Cat Tutorial](/getting-started/first-cat)** - Detailed walkthrough with more customization
2. **API Reference** - Complete SDK documentation

## Try It Yourself

Experiment with these challenges:

- ✅ Create a cat with a specific color scheme
- ✅ Make 5 cats with different personalities
- ✅ Set up boundaries that match your viewport
- ✅ Feed a cat and watch it eat
- ✅ Use the laser pointer to play with a cat

Happy cat-making! 🐱
