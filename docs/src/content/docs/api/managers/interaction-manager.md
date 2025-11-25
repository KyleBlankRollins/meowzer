---
title: InteractionManager
description: API reference for the InteractionManager class - create food, toys, and laser pointers for cats to interact with
---

The `InteractionManager` handles all interactive elements that cats can respond to, including food, water, toys, and laser pointers.

## Overview

Access via `meowzer.interactions`:

```typescript
const meowzer = new Meowzer();
await meowzer.init();

// Place food
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Throw yarn
const yarn = await meowzer.interactions.placeYarn({
  x: 500,
  y: 200,
});

// Cats automatically detect and respond to nearby items!
```

## Need Management

"Needs" are consumable items like food and water that cats can interact with.

### placeNeed()

```typescript
async placeNeed(
  type: NeedType,
  position: Position
): Promise<Need>
```

Place a food or water item on the page.

**Parameters:**

| Name       | Type       | Description                                  |
| ---------- | ---------- | -------------------------------------------- |
| `type`     | `NeedType` | Type of need to place                        |
| `position` | `Position` | Where to place it (`{x: number, y: number}`) |

**Need Types:**

- `"food:basic"` - Basic kibble (cheap, satisfying)
- `"food:fancy"` - Wet food (expensive, very satisfying)
- `"water"` - Water bowl (hydration)

**Returns:** `Need` object with `id`, `type`, `position`, `consumed` status

**Example:**

```typescript
// Place basic food
const kibble = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Place fancy food
const wetFood = await meowzer.interactions.placeNeed("food:fancy", {
  x: 500,
  y: 300,
});

// Place water
const water = await meowzer.interactions.placeNeed("water", {
  x: 450,
  y: 350,
});
```

---

### removeNeed()

```typescript
async removeNeed(needId: string): Promise<void>
```

Remove a need from the page (cleanup).

**Parameters:**

| Name     | Type     | Description          |
| -------- | -------- | -------------------- |
| `needId` | `string` | ID of need to remove |

**Example:**

```typescript
const food = await meowzer.interactions.placeNeed("food:basic", {
  x: 400,
  y: 300,
});

// Later, remove it
await meowzer.interactions.removeNeed(food.id);
```

---

### getNeed()

```typescript
getNeed(needId: string): Need | undefined
```

Get a need by ID.

**Parameters:**

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `needId` | `string` | Need ID     |

**Returns:** `Need` object or `undefined` if not found

**Example:**

```typescript
const need = meowzer.interactions.getNeed("need-123");
if (need) {
  console.log(`Need type: ${need.type}`);
  console.log(`Consumed: ${need.consumed}`);
}
```

---

### getAllNeeds()

```typescript
getAllNeeds(): Need[]
```

Get all active needs on the page.

**Returns:** Array of `Need` objects

**Example:**

```typescript
const needs = meowzer.interactions.getAllNeeds();
console.log(`Active needs: ${needs.length}`);

needs.forEach((need) => {
  console.log(
    `${need.type} at (${need.position.x}, ${need.position.y})`
  );
});
```

---

### getNeedsNearPosition()

```typescript
getNeedsNearPosition(
  position: Position,
  radius: number
): Need[]
```

Find needs within a certain distance of a position.

**Parameters:**

| Name       | Type       | Description             |
| ---------- | ---------- | ----------------------- |
| `position` | `Position` | Center point            |
| `radius`   | `number`   | Search radius in pixels |

**Returns:** Array of nearby `Need` objects

**Example:**

```typescript
const catPosition = cat.getPosition();
const nearbyFood = meowzer.interactions.getNeedsNearPosition(
  catPosition,
  150 // 150px radius
);

console.log(`Found ${nearbyFood.length} food items nearby`);
```

---

### clearAllNeeds()

```typescript
async clearAllNeeds(): Promise<void>
```

Remove all needs from the page.

**Example:**

```typescript
// Clean up all food and water
await meowzer.interactions.clearAllNeeds();
```

---

## Yarn (Toys)

Yarn balls are throwable toys that cats can play with.

### placeYarn()

```typescript
async placeYarn(position: Position): Promise<Yarn>
```

Place a yarn ball on the page.

**Parameters:**

| Name       | Type       | Description         |
| ---------- | ---------- | ------------------- |
| `position` | `Position` | Where to place yarn |

**Returns:** `Yarn` object with `id`, `position`

**Example:**

```typescript
// Throw yarn at random position
const yarn = await meowzer.interactions.placeYarn({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
});

// Nearby playful cats may investigate!
```

---

### removeYarn()

```typescript
async removeYarn(yarnId: string): Promise<void>
```

Remove a yarn ball from the page.

**Parameters:**

| Name     | Type     | Description          |
| -------- | -------- | -------------------- |
| `yarnId` | `string` | ID of yarn to remove |

**Example:**

```typescript
await meowzer.interactions.removeYarn(yarn.id);
```

---

### getYarn()

```typescript
getYarn(yarnId: string): Yarn | undefined
```

Get a yarn ball by ID.

**Parameters:**

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| `yarnId` | `string` | Yarn ID     |

**Returns:** `Yarn` object or `undefined`

---

### getAllYarn()

```typescript
getAllYarn(): Yarn[]
```

Get all active yarn balls.

**Returns:** Array of `Yarn` objects

**Example:**

```typescript
const allYarn = meowzer.interactions.getAllYarn();
console.log(`${allYarn.length} yarn balls on the page`);
```

---

### clearAllYarn()

```typescript
async clearAllYarn(): Promise<void>
```

Remove all yarn from the page.

**Example:**

```typescript
await meowzer.interactions.clearAllYarn();
```

---

## Events

The InteractionManager emits events when cats interact with items.

### on()

```typescript
on(event: InteractionEventType, handler: EventHandler): void
```

Listen to interaction events.

**Event Types:**

| Event             | Description              | Event Data                           |
| ----------------- | ------------------------ | ------------------------------------ |
| `needPlaced`      | Need was placed on page  | `{ needId, type, position }`         |
| `needRemoved`     | Need was removed         | `{ needId }`                         |
| `needResponse`    | Cat responded to need    | `{ catId, needId, responseType }`    |
| `yarnPlaced`      | Yarn was placed          | `{ yarnId, position }`               |
| `yarnRemoved`     | Yarn was removed         | `{ yarnId }`                         |
| `yarnInteraction` | Cat interacted with yarn | `{ catId, yarnId, interactionType }` |

**Example:**

```typescript
// Listen for cats eating food
meowzer.interactions.on("needResponse", (event) => {
  console.log(
    `Cat ${event.catId} ${event.responseType} need ${event.needId}`
  );
});

// Listen for yarn play
meowzer.interactions.on("yarnInteraction", (event) => {
  console.log(`Cat ${event.catId} is playing with yarn!`);
});
```

---

### off()

```typescript
off(event: InteractionEventType, handler: EventHandler): void
```

Stop listening to an event.

**Example:**

```typescript
function handleNeedResponse(event) {
  console.log("Need response:", event);
}

meowzer.interactions.on("needResponse", handleNeedResponse);

// Later, stop listening
meowzer.interactions.off("needResponse", handleNeedResponse);
```

---

## Common Patterns

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

### Interactive Yarn Throwing

```typescript
document.addEventListener("click", async (e) => {
  // Throw yarn where user clicks
  const yarn = await meowzer.interactions.placeYarn({
    x: e.clientX,
    y: e.clientY,
  });

  console.log("Yarn thrown! Cats may investigate...");
});
```

### Feed Button

```typescript
document
  .getElementById("feed-cat")
  .addEventListener("click", async () => {
    const cats = meowzer.cats.getAll();
    if (cats.length === 0) {
      alert("No cats to feed!");
      return;
    }

    // Place food near a random cat
    const randomCat = cats[Math.floor(Math.random() * cats.length)];
    const catPos = randomCat.getPosition();

    await meowzer.interactions.placeNeed("food:fancy", {
      x: catPos.x + 50,
      y: catPos.y,
    });
  });
```

### Auto-cleanup Consumed Needs

```typescript
meowzer.interactions.on("needResponse", async (event) => {
  if (event.responseType === "consumed") {
    // Wait a bit, then remove the consumed item
    setTimeout(async () => {
      await meowzer.interactions.removeNeed(event.needId);
    }, 2000);
  }
});
```

### Interaction Analytics

```typescript
const stats = {
  foodPlaced: 0,
  foodEaten: 0,
  yarnThrown: 0,
  yarnPlayed: 0,
};

meowzer.interactions.on("needPlaced", (event) => {
  if (event.type.startsWith("food")) {
    stats.foodPlaced++;
  }
});

meowzer.interactions.on("needResponse", (event) => {
  if (event.responseType === "consumed") {
    stats.foodEaten++;
  }
});

meowzer.interactions.on("yarnPlaced", () => {
  stats.yarnThrown++;
});

meowzer.interactions.on("yarnInteraction", () => {
  stats.yarnPlayed++;
});

// Display stats
setInterval(() => {
  console.log("Interaction Stats:", stats);
}, 30000);
```

---

## Type Definitions

### Position

```typescript
interface Position {
  x: number;
  y: number;
}
```

### Need

```typescript
interface Need {
  id: string;
  type: NeedType;
  position: Position;
  consumed: boolean;
  createdAt: Date;
}

type NeedType = "food:basic" | "food:fancy" | "water";
```

### Yarn

```typescript
interface Yarn {
  id: string;
  position: Position;
  createdAt: Date;
}
```

---

## See Also

- [LaserPointer](/api/interactions/laser-pointer) - Laser pointer API (created via `meowzer.createLaserPointer()`)
- [MeowzerCat](/api/meowzer-cat) - Cat interaction methods
- [Meowzer SDK](/api/meowzer-sdk) - Main SDK class
- [Basic Integration Tutorial](/tutorials/basic-integration) - Learn to use interactions
