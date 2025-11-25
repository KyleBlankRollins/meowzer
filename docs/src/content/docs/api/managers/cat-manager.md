---
title: "CatManager"
description: "Create, find, and manage cats"
---

The `CatManager` handles cat lifecycle operations and coordinates between MeowKit (generation), MeowBrain (AI), Meowtion (animation), and storage.

Access via `meowzer.cats`.

## Methods

### create()

```typescript
async create(options?: CreateCatOptions): Promise<MeowzerCat>
```

Create a new cat with optional configuration.

**Parameters:**

| Name      | Type               | Optional | Description          |
| --------- | ------------------ | -------- | -------------------- |
| `options` | `CreateCatOptions` | Yes      | Cat creation options |

**Returns:** `Promise<MeowzerCat>`

#### CreateCatOptions

```typescript
interface CreateCatOptions {
  id?: string; // Custom ID (auto-generated if not provided)
  name?: string; // Cat name
  description?: string; // Cat description
  seed?: string; // Seed for reproducible generation
  settings?: CatSettings; // Appearance settings
  metadata?: CatMetadata; // Custom metadata
}
```

### Examples

**Random cat:**

```javascript
const cat = await meowzer.cats.create();
console.log(cat.name); // Auto-generated name
```

**Named cat:**

```javascript
const cat = await meowzer.cats.create({
  name: "Whiskers",
  description: "A friendly orange tabby",
});
```

**Custom appearance:**

```javascript
const cat = await meowzer.cats.create({
  name: "Tiger",
  settings: {
    color: "#FF6600",
    pattern: "tabby",
    patternColor: "#000000",
    eyeColor: "#FFD700",
    size: "large",
    furLength: "medium",
  },
});
```

**From seed (reproducible):**

```javascript
// Create cat from existing seed
const cat = await meowzer.cats.create({
  seed: "abc123xyz",
});

// Cat will have same appearance every time
```

**With metadata:**

```javascript
const cat = await meowzer.cats.create({
  name: "Office Cat",
  metadata: {
    tags: ["office", "playful"],
    favoriteFood: "tuna",
    adoptedDate: new Date().toISOString(),
  },
});
```

---

### createMany()

```typescript
async createMany(
  optionsArray: CreateCatOptions[]
): Promise<MeowzerCat[]>
```

Create multiple cats at once.

**Parameters:**

| Name           | Type                 | Description               |
| -------------- | -------------------- | ------------------------- |
| `optionsArray` | `CreateCatOptions[]` | Array of creation options |

**Returns:** `Promise<MeowzerCat[]>`

**Example:**

```javascript
const cats = await meowzer.cats.createMany([
  { name: "Whiskers" },
  { name: "Mittens" },
  { name: "Shadow", settings: { color: "#000000" } },
]);

console.log(cats.length); // 3
// All cats automatically appear on the page!
```

---

### get()

```typescript
get(id: string): MeowzerCat | undefined
```

Get a cat by ID. Returns `undefined` if not found.

**Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Cat ID      |

**Returns:** `MeowzerCat | undefined`

**Example:**

```javascript
const cat = meowzer.cats.get("cat-123");
if (cat) {
  console.log(cat.name);
} else {
  console.log("Cat not found");
}
```

---

### has()

```typescript
has(id: string): boolean
```

Check if a cat exists in memory.

**Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Cat ID      |

**Returns:** `boolean`

**Example:**

```javascript
if (meowzer.cats.has("cat-123")) {
  const cat = meowzer.cats.get("cat-123");
  console.log("Found:", cat.name);
}
```

---

### getAll()

```typescript
getAll(): MeowzerCat[]
```

Get all cats currently in memory.

**Returns:** `MeowzerCat[]`

**Example:**

```javascript
const allCats = meowzer.cats.getAll();
console.log(`${allCats.length} cats in memory`);

allCats.forEach((cat) => {
  console.log(`- ${cat.name} (${cat.id})`);
});
```

---

### find()

```typescript
find(options?: FindCatsOptions): MeowzerCat[]
```

Find cats matching criteria.

**Parameters:**

| Name      | Type              | Optional | Description     |
| --------- | ----------------- | -------- | --------------- |
| `options` | `FindCatsOptions` | Yes      | Search criteria |

**Returns:** `MeowzerCat[]`

#### FindCatsOptions

```typescript
interface FindCatsOptions {
  name?: string; // Search by name (partial match)
  tags?: string[]; // Filter by tags (any match)
  sortBy?: "name" | "createdAt" | "updatedAt"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort direction
  limit?: number; // Maximum results
}
```

### Examples

**Find by name:**

```javascript
// Partial match, case-insensitive
const cats = meowzer.cats.find({ name: "whisk" });
// Returns cats with names like "Whiskers", "Whiskey", etc.
```

**Find by tags:**

```javascript
const playfulCats = meowzer.cats.find({
  tags: ["playful"],
});

const officeCats = meowzer.cats.find({
  tags: ["office", "friendly"],
});
```

**Sort and limit:**

```javascript
// Get 5 most recently created cats
const recentCats = meowzer.cats.find({
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 5,
});

// Get cats alphabetically
const alphabetical = meowzer.cats.find({
  sortBy: "name",
  sortOrder: "asc",
});
```

**Combined criteria:**

```javascript
const results = meowzer.cats.find({
  tags: ["playful"],
  sortBy: "updatedAt",
  sortOrder: "desc",
  limit: 10,
});
```

---

### destroy()

```typescript
async destroy(id: string): Promise<void>
```

Destroy a cat by ID.

This removes the cat from memory and stops all animations/AI. It does **not** delete from storage - use `storage.delete()` for that.

**Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Cat ID      |

**Example:**

```javascript
await meowzer.cats.destroy("cat-123");
console.log("Cat destroyed");
```

:::caution
This only removes from memory. To delete from storage, use:

```javascript
await meowzer.storage.delete(catId);
```

:::

---

### destroyMany()

```typescript
async destroyMany(ids: string[]): Promise<void>
```

Destroy multiple cats by ID.

**Parameters:**

| Name  | Type       | Description  |
| ----- | ---------- | ------------ |
| `ids` | `string[]` | Array of IDs |

**Example:**

```javascript
const ids = ["cat-1", "cat-2", "cat-3"];
await meowzer.cats.destroyMany(ids);
```

---

### destroyAll()

```typescript
async destroyAll(): Promise<void>
```

Destroy all cats and clean up resources.

**Example:**

```javascript
// Remove all cats from memory
await meowzer.cats.destroyAll();
console.log("All cats destroyed");
```

## Common Patterns

### Create Cats

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
// Cat automatically appears on the page!
```

### Create Multiple Random Cats

```javascript
const count = 5;
const options = Array.from({ length: count }, (_, i) => ({
  name: `Cat ${i + 1}`,
}));

const cats = await meowzer.cats.createMany(options);
// All cats automatically appear on the page!
```

### Find and Update

```javascript
const playfulCats = meowzer.cats.find({ tags: ["playful"] });
playfulCats.forEach((cat) => {
  cat.setName(`${cat.name} (Playful)`);
});
```

### Clean Up Old Cats

```javascript
const allCats = meowzer.cats.getAll();
const oneHourAgo = Date.now() - 60 * 60 * 1000;

const oldCats = allCats.filter(
  (cat) => cat.createdAt.getTime() < oneHourAgo
);

await meowzer.cats.destroyMany(oldCats.map((cat) => cat.id));
console.log(`Removed ${oldCats.length} old cats`);
```

### Track Cat Count

```javascript
let catCount = 0;

meowzer.hooks.on("afterCreate", () => {
  catCount++;
  updateUI();
});

meowzer.hooks.on("afterDelete", () => {
  catCount--;
  updateUI();
});

function updateUI() {
  document.getElementById("count").textContent = catCount;
}
```

## Integration with Storage

### Create and Save

```javascript
const cat = await meowzer.cats.create({ name: "Whiskers" });
// Cat automatically appears on the page!

// Save to storage
await cat.save();
// or
await meowzer.storage.save(cat.id);
```

### Load from Storage

```javascript
// Load creates the cat instance
const cat = await meowzer.storage.load("cat-123");

// Now in memory and automatically on the page
console.log(meowzer.cats.has(cat.id)); // true
```

### Destroy vs Delete

```javascript
// Remove from memory only
await meowzer.cats.destroy(cat.id);

// Remove from memory AND storage
await cat.delete();
// or
await meowzer.storage.delete(cat.id);
await meowzer.cats.destroy(cat.id);
```

## Lifecycle Hooks

Listen to cat creation and destruction:

```javascript
// Before cat is created
meowzer.hooks.on("beforeCreate", (ctx) => {
  console.log("Creating cat with options:", ctx.options);
});

// After cat is created
meowzer.hooks.on("afterCreate", (ctx) => {
  console.log("Cat created:", ctx.cat.id, ctx.cat.name);
});

// Before cat is destroyed
meowzer.hooks.on("beforeDelete", (ctx) => {
  console.log("Destroying cat:", ctx.catId);
});

// After cat is destroyed
meowzer.hooks.on("afterDelete", (ctx) => {
  console.log("Cat destroyed:", ctx.catId);
});
```

## Error Handling

```javascript
try {
  const cat = await meowzer.cats.create({
    settings: {
      color: "invalid-color", // Will throw
    },
  });
} catch (error) {
  if (error.name === "InvalidSettingsError") {
    console.error("Invalid cat settings:", error.message);
  }
}
```

## Performance Tips

### Batch Operations

```javascript
// Good: Create multiple cats at once
const cats = await meowzer.cats.createMany([
  { name: "Cat 1" },
  { name: "Cat 2" },
  { name: "Cat 3" },
]);

// Avoid: Creating one at a time in a loop
for (let i = 0; i < 3; i++) {
  await meowzer.cats.create({ name: `Cat ${i}` }); // Slower
}
```

### Limit Active Cats

```javascript
const MAX_CATS = 10;

async function addCat() {
  const allCats = meowzer.cats.getAll();

  if (allCats.length >= MAX_CATS) {
    // Remove oldest cat
    const oldest = allCats.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )[0];
    await meowzer.cats.destroy(oldest.id);
  }

  const cat = await meowzer.cats.create();
  // Cat automatically appears on the page!
}
```

### Pause Inactive Cats

```javascript
// Pause cats when page is hidden
document.addEventListener("visibilitychange", () => {
  const allCats = meowzer.cats.getAll();

  if (document.hidden) {
    allCats.forEach((cat) => cat.lifecycle.pause());
  } else {
    allCats.forEach((cat) => cat.lifecycle.resume());
  }
});
```

## See Also

- [MeowzerCat API](/api/meowzer-cat) - Individual cat instance methods
- [StorageManager API](/api/managers/storage-manager) - Persistence operations
- [Meowzer SDK](/api/meowzer-sdk) - Main SDK class
- [Basic Integration Tutorial](/tutorials/basic-integration) - Create your first cats
