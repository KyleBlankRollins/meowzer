---
title: Code Snippets
description: Copy-paste examples for common Meowzer tasks
---

Quick reference snippets for common Meowzer operations. All examples assume you have initialized Meowzer:

```typescript
import { Meowzer } from "meowzer";

const meowzer = new Meowzer();
await meowzer.init();
```

## Creating Cats

### Random Cat

```typescript
const cat = await meowzer.cats.create();
// Cat has random appearance and personality
```

### Named Cat

```typescript
const cat = await meowzer.cats.create({
  name: "Whiskers",
});
```

### Custom Appearance

```typescript
const cat = await meowzer.cats.create({
  name: "Tiger",
  settings: {
    color: "#FF6600", // Orange fur
    pattern: "tabby", // Striped pattern
    eyeColor: "#FFD700", // Golden eyes
    size: "medium",
    furLength: "short",
  },
});
```

### All Patterns

```typescript
// Create one of each pattern
const patterns = ["solid", "tabby", "spotted", "tuxedo", "calico"];

for (const pattern of patterns) {
  await meowzer.cats.create({
    name: `${pattern} cat`,
    settings: {
      color: "#FF9500",
      pattern: pattern,
    },
  });
}
```

### Different Sizes

```typescript
// Small, medium, and large cats
const sizes = ["small", "medium", "large"];

for (const size of sizes) {
  await meowzer.cats.create({
    name: `${size} cat`,
    settings: { size },
  });
}
```

### Themed Cats

```typescript
// Create a black cat
const blackCat = await meowzer.cats.create({
  name: "Shadow",
  settings: {
    color: "#000000",
    eyeColor: "#FFD700",
    pattern: "solid",
  },
});

// Create a tuxedo cat
const tuxedoCat = await meowzer.cats.create({
  name: "Formal Felix",
  settings: {
    color: "#FFFFFF",
    pattern: "tuxedo",
  },
});

// Create a ginger tabby
const gingerCat = await meowzer.cats.create({
  name: "Garfield",
  settings: {
    color: "#FF6600",
    pattern: "tabby",
    eyeColor: "#00FF00",
  },
});
```

### With Description and Metadata

```typescript
const cat = await meowzer.cats.create({
  name: "Fluffy",
  description: "A very playful long-haired cat",
  settings: {
    color: "#FFFFFF",
    furLength: "long",
  },
  metadata: {
    adoptedDate: new Date().toISOString(),
    favoriteFood: "tuna",
    tags: ["playful", "fluffy", "friendly"],
  },
});
```

## Personality

### Preset Personalities

```typescript
const personalities = [
  "playful",
  "lazy",
  "curious",
  "energetic",
  "calm",
];

for (const personality of personalities) {
  await meowzer.cats.create({
    name: `${personality} cat`,
    personality: personality,
  });
}
```

### Custom Personality Traits

```typescript
// Hyperactive cat
const hyperCat = await meowzer.cats.create({
  name: "Zoom",
  personality: {
    energy: 1.0, // Maximum energy
    playfulness: 0.95,
    curiosity: 0.8,
    independence: 0.2,
    sociability: 0.9,
  },
});

// Very lazy cat
const lazyCat = await meowzer.cats.create({
  name: "Garfield",
  personality: {
    energy: 0.1, // Minimum energy
    playfulness: 0.1,
    curiosity: 0.2,
    independence: 0.9,
    sociability: 0.3,
  },
});
```

### Balanced Personality

```typescript
const cat = await meowzer.cats.create({
  name: "Balanced",
  personality: {
    energy: 0.5,
    playfulness: 0.5,
    curiosity: 0.5,
    independence: 0.5,
    sociability: 0.5,
  },
});
```

## Managing Cats

### Find Cats by Name

```typescript
const whiskers = meowzer.cats.findByName("Whiskers");
if (whiskers) {
  console.log(`Found ${whiskers.name}!`);
}
```

### Find Cats by Criteria

```typescript
// Find all orange cats
const orangeCats = meowzer.cats.find(
  (cat) => cat.settings.color === "#FF9500"
);

// Find all playful cats
const playfulCats = meowzer.cats.find(
  (cat) => cat.personality.playfulness > 0.7
);

// Find all large cats
const largeCats = meowzer.cats.find(
  (cat) => cat.settings.size === "large"
);
```

### Get All Cats

```typescript
const allCats = meowzer.cats.getAll();
console.log(`Total cats: ${allCats.length}`);

allCats.forEach((cat) => {
  console.log(`- ${cat.name} (${cat.settings.pattern})`);
});
```

### Check if Cat Exists

```typescript
if (meowzer.cats.has(catId)) {
  console.log("Cat exists!");
  const cat = meowzer.cats.get(catId);
}
```

### Destroy Specific Cat

```typescript
await meowzer.cats.destroy(catId);
console.log("Cat removed");
```

### Destroy All Cats

```typescript
await meowzer.cats.destroyAll();
console.log("All cats removed");
```

### Destroy Multiple Cats

```typescript
// Remove all orange cats
const orangeCats = meowzer.cats.find(
  (cat) => cat.settings.color === "#FF9500"
);
const ids = orangeCats.map((cat) => cat.id);
await meowzer.cats.destroyMany(ids);
```

## Interactions

### Place Food

```typescript
// Basic food (kibble)
const kibble = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Fancy food (wet food)
const wetFood = await meowzer.interactions.placeNeed("food:fancy", {
  x: 500,
  y: 300,
});
```

### Place Water

```typescript
const water = await meowzer.interactions.placeNeed("water", {
  x: 450,
  y: 350,
});
```

### Random Food Placement

```typescript
function placeRandomFood() {
  const types = ["food:basic", "food:fancy"];
  const type = types[Math.floor(Math.random() * types.length)];

  return meowzer.interactions.placeNeed(type, {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  });
}

// Place food every 10 seconds
setInterval(placeRandomFood, 10000);
```

### Feed Near Cat

```typescript
const cats = meowzer.cats.getAll();
if (cats.length > 0) {
  const randomCat = cats[Math.floor(Math.random() * cats.length)];
  const position = randomCat.getPosition();

  await meowzer.interactions.placeNeed("food:fancy", {
    x: position.x + 50,
    y: position.y,
  });
}
```

### Throw Yarn

```typescript
const yarn = await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});
```

### Interactive Yarn Throwing

```typescript
document.addEventListener("click", async (e) => {
  await meowzer.interactions.placeYarn({
    x: e.clientX,
    y: e.clientY,
  });
  console.log("Yarn thrown!");
});
```

### Random Yarn Placement

```typescript
function throwRandomYarn() {
  return meowzer.interactions.placeYarn({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  });
}

// Throw yarn every 15 seconds
setInterval(throwRandomYarn, 15000);
```

### Laser Pointer

```typescript
const laser = meowzer.createLaserPointer();

// Turn on at mouse position
document.addEventListener("click", (e) => {
  if (!laser.isActive) {
    laser.turnOn({ x: e.clientX, y: e.clientY });
  } else {
    laser.turnOff();
  }
});

// Move with mouse
document.addEventListener("mousemove", (e) => {
  if (laser.isActive) {
    laser.moveTo({ x: e.clientX, y: e.clientY });
  }
});
```

### Auto-move Laser Pointer

```typescript
const laser = meowzer.createLaserPointer();
laser.turnOn({ x: 400, y: 300 });

// Move laser in a circle
let angle = 0;
setInterval(() => {
  if (laser.isActive) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 200;

    laser.moveTo({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });

    angle += 0.05;
  }
}, 50);
```

### Get All Active Items

```typescript
const needs = meowzer.interactions.getAllNeeds();
const yarn = meowzer.interactions.getAllYarn();

console.log(`Active needs: ${needs.length}`);
console.log(`Active yarn: ${yarn.length}`);
```

### Clear All Interactions

```typescript
await meowzer.interactions.clearAllNeeds();
await meowzer.interactions.clearAllYarn();
console.log("All interactions cleared");
```

## Persistence

### Save a Cat

```typescript
const cat = await meowzer.cats.create({ name: "Whiskers" });
await meowzer.storage.save(cat.id);
console.log("Cat saved!");
```

### Auto-save on Create

```typescript
meowzer.hooks.on("afterCreate", async (ctx) => {
  await meowzer.storage.save(ctx.cat.id);
  console.log(`Auto-saved ${ctx.cat.name}`);
});
```

### Load a Cat

```typescript
const cat = await meowzer.storage.load("cat-id-here");
console.log(`Loaded ${cat.name}`);
```

### Load All Cats

```typescript
const cats = await meowzer.storage.loadAll();
console.log(`Loaded ${cats.length} cats`);
```

### List Saved Cats (Metadata Only)

```typescript
const savedCats = await meowzer.storage.listCats();
savedCats.forEach((meta) => {
  console.log(`${meta.name} - Created: ${meta.createdAt}`);
});
```

### Delete from Storage

```typescript
await meowzer.storage.delete(catId);
console.log("Deleted from storage");
```

### Collections

```typescript
// Create collection
const collectionId = await meowzer.storage.createCollection(
  "My Favorites",
  { description: "My favorite cats" }
);

// Add cat to collection
await meowzer.storage.save(cat.id);
await meowzer.storage.addToCollection(collectionId, cat.id);

// Load collection
const favoriteCats = await meowzer.storage.loadCollection(
  collectionId
);
console.log(`Loaded ${favoriteCats.length} favorites`);

// List all collections
const collections = await meowzer.storage.listCollections();
collections.forEach((c) => {
  console.log(`${c.name}: ${c.catIds.length} cats`);
});
```

### Clear All Storage

```typescript
// Danger zone!
await meowzer.storage.clearCollection();
console.log("All cats deleted from storage");
```

## Events

### Cat State Changes

```typescript
cat.on("stateChanged", (event) => {
  console.log(`${cat.name} is now ${event.newState}`);
});
```

### Movement Events

```typescript
cat.on("moveStart", (event) => {
  console.log("Started moving to:", event.position);
});

cat.on("moveEnd", (event) => {
  console.log("Arrived at:", event.position);
});
```

### Boundary Hits

```typescript
cat.on("boundaryHit", (event) => {
  console.log(`Hit ${event.boundary} boundary`);
});
```

### Lifecycle Hooks

```typescript
// Before cat is created
meowzer.hooks.on("beforeCreate", (ctx) => {
  console.log("Creating cat with:", ctx.options);
});

// After cat is created
meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("Created:", ctx.cat.name);
});

// Before destruction
meowzer.hooks.on("beforeDestroy", (ctx) => {
  console.log("Destroying:", ctx.catId);
});

// After destruction
meowzer.hooks.on("afterDestroy", (ctx) => {
  console.log("Destroyed:", ctx.catId);
});
```

### Interaction Events

```typescript
// Food placed
meowzer.interactions.on("needPlaced", (event) => {
  console.log(
    `Placed ${event.type} at (${event.position.x}, ${event.position.y})`
  );
});

// Cat ate food
meowzer.interactions.on("needResponse", (event) => {
  console.log(`Cat ${event.catId}: ${event.responseType}`);
});

// Yarn interactions
meowzer.interactions.on("yarnInteraction", (event) => {
  console.log(`Cat ${event.catId} is playing with yarn!`);
});
```

## Configuration

### Custom Boundaries

```typescript
const meowzer = new Meowzer({
  behavior: {
    boundaries: {
      minX: 100,
      maxX: 800,
      minY: 50,
      maxY: 600,
    },
  },
});
```

### Responsive Boundaries

```typescript
function updateBoundaries() {
  const cats = meowzer.cats.getAll();
  cats.forEach((cat) => {
    cat.setBoundaries({
      minX: 0,
      maxX: window.innerWidth,
      minY: 0,
      maxY: window.innerHeight,
    });
  });
}

window.addEventListener("resize", updateBoundaries);
```

### Storage Configuration

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb",
    enabled: true,
    defaultCollection: "my-cats",
    dbName: "meowzer-db",
  },
});
```

### Decision Frequency

```typescript
const meowzer = new Meowzer({
  behavior: {
    decisionInterval: {
      min: 5000, // 5 seconds minimum
      max: 20000, // 20 seconds maximum
    },
  },
});
```

## Advanced Patterns

### Cat Factory

```typescript
class CatFactory {
  static async createRandomCat(meowzer) {
    const colors = [
      "#FF9500",
      "#8B4513",
      "#000000",
      "#FFFFFF",
      "#FFD700",
    ];
    const patterns = [
      "solid",
      "tabby",
      "spotted",
      "tuxedo",
      "calico",
    ];
    const names = ["Whiskers", "Shadow", "Luna", "Oliver", "Leo"];

    return await meowzer.cats.create({
      name: names[Math.floor(Math.random() * names.length)],
      settings: {
        color: colors[Math.floor(Math.random() * colors.length)],
        pattern:
          patterns[Math.floor(Math.random() * patterns.length)],
      },
    });
  }
}

// Usage
const cat = await CatFactory.createRandomCat(meowzer);
```

### Cat Manager UI

```typescript
class CatUI {
  constructor(meowzer) {
    this.meowzer = meowzer;
    this.setupControls();
  }

  setupControls() {
    document
      .getElementById("add-cat")
      .addEventListener("click", () => {
        this.addCat();
      });

    document
      .getElementById("remove-cat")
      .addEventListener("click", () => {
        this.removeCat();
      });

    this.updateCount();
  }

  async addCat() {
    await this.meowzer.cats.create();
    this.updateCount();
  }

  async removeCat() {
    const cats = this.meowzer.cats.getAll();
    if (cats.length > 0) {
      await this.meowzer.cats.destroy(cats[0].id);
      this.updateCount();
    }
  }

  updateCount() {
    const count = this.meowzer.cats.getAll().length;
    document.getElementById("count").textContent = count;
  }
}

// Usage
const ui = new CatUI(meowzer);
```

### Max Cats Limit

```typescript
async function createCatWithLimit(maxCats = 10) {
  const currentCount = meowzer.cats.getAll().length;

  if (currentCount >= maxCats) {
    // Remove oldest cat
    const allCats = meowzer.cats.getAll();
    const oldest = allCats.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )[0];
    await meowzer.cats.destroy(oldest.id);
  }

  return await meowzer.cats.create();
}
```

### Interaction Stats Tracker

```typescript
class InteractionStats {
  constructor(meowzer) {
    this.stats = {
      foodPlaced: 0,
      foodEaten: 0,
      yarnThrown: 0,
      yarnPlayed: 0,
    };

    meowzer.interactions.on("needPlaced", (event) => {
      if (event.type.startsWith("food")) this.stats.foodPlaced++;
    });

    meowzer.interactions.on("needResponse", (event) => {
      if (event.responseType === "consumed") this.stats.foodEaten++;
    });

    meowzer.interactions.on("yarnPlaced", () => {
      this.stats.yarnThrown++;
    });

    meowzer.interactions.on("yarnInteraction", () => {
      this.stats.yarnPlayed++;
    });
  }

  getStats() {
    return { ...this.stats };
  }

  reset() {
    Object.keys(this.stats).forEach((key) => {
      this.stats[key] = 0;
    });
  }
}

// Usage
const tracker = new InteractionStats(meowzer);
setInterval(() => {
  console.log("Stats:", tracker.getStats());
}, 30000);
```

### Auto-cleanup Old Cats

```typescript
async function cleanupOldCats(maxAgeHours = 24) {
  const allCats = meowzer.cats.getAll();
  const maxAge = Date.now() - maxAgeHours * 60 * 60 * 1000;

  const oldCats = allCats.filter(
    (cat) => cat.createdAt.getTime() < maxAge
  );

  await meowzer.cats.destroyMany(oldCats.map((cat) => cat.id));
  console.log(`Cleaned up ${oldCats.length} old cats`);
}

// Run cleanup daily
setInterval(() => cleanupOldCats(24), 24 * 60 * 60 * 1000);
```

## See Also

- [Live Demos](/examples/live-demos) - Interactive examples
- [Basic Integration Tutorial](/tutorials/basic-integration) - Step-by-step guide
- [API Reference](/api/meowzer-sdk) - Complete API documentation
