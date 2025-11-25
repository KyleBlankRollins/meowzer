---
title: StorageManager
description: API reference for the StorageManager class - save and load cats from IndexedDB
---

The `StorageManager` handles all persistence operations, allowing you to save cats to IndexedDB and load them across sessions.

## Overview

Access via `meowzer.storage`:

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb",
    enabled: true,
  },
});

await meowzer.init();

// Save a cat
await meowzer.storage.save(cat.id);

// Load it later
const loadedCat = await meowzer.storage.load(cat.id);
```

## Methods

### save()

```typescript
async save(catId: string, options?: SaveOptions): Promise<void>
```

Save a cat to storage.

**Parameters:**

| Name      | Type          | Optional | Description       |
| --------- | ------------- | -------- | ----------------- |
| `catId`   | `string`      | No       | ID of cat to save |
| `options` | `SaveOptions` | Yes      | Save options      |

**Options:**

```typescript
interface SaveOptions {
  collection?: string; // Collection to save to (default: default collection)
}
```

**Example:**

```typescript
// Save to default collection
await meowzer.storage.save(cat.id);

// Save to specific collection
await meowzer.storage.save(cat.id, {
  collection: "favorites",
});
```

**Throws:**

- `StorageError` - If save operation fails
- `NotFoundError` - If cat doesn't exist in memory

---

### load()

```typescript
async load(catId: string): Promise<MeowzerCat>
```

Load a cat from storage into memory.

**Parameters:**

| Name    | Type     | Description       |
| ------- | -------- | ----------------- |
| `catId` | `string` | ID of cat to load |

**Returns:** `MeowzerCat` instance (automatically placed on page)

**Example:**

```typescript
const cat = await meowzer.storage.load("cat-123");
// Cat is now in memory and appears on the page
console.log(cat.name);
```

**Throws:**

- `NotFoundError` - If cat doesn't exist in storage
- `StorageError` - If load operation fails

---

### loadAll()

```typescript
async loadAll(): Promise<MeowzerCat[]>
```

Load all cats from storage.

**Returns:** Array of `MeowzerCat` instances

**Example:**

```typescript
const cats = await meowzer.storage.loadAll();
console.log(`Loaded ${cats.length} cats`);
```

**Throws:**

- `StorageError` - If load operation fails

:::caution
Loading many cats at once can impact performance. Consider loading cats on-demand or in batches.
:::

---

### delete()

```typescript
async delete(catId: string): Promise<void>
```

Delete a cat from storage (doesn't affect cats in memory).

**Parameters:**

| Name    | Type     | Description         |
| ------- | -------- | ------------------- |
| `catId` | `string` | ID of cat to delete |

**Example:**

```typescript
// Delete from storage only
await meowzer.storage.delete("cat-123");

// To delete from both storage and memory:
await meowzer.storage.delete(cat.id);
await meowzer.cats.destroy(cat.id);
```

**Throws:**

- `StorageError` - If delete operation fails

---

### listCats()

```typescript
async listCats(collection?: string): Promise<CatMetadata[]>
```

Get metadata for all saved cats without loading them.

**Parameters:**

| Name         | Type     | Optional | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| `collection` | `string` | Yes      | Collection to list (default: all) |

**Returns:** Array of metadata objects

```typescript
interface CatMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  collection?: string;
}
```

**Example:**

```typescript
// List all cats
const allCats = await meowzer.storage.listCats();
console.log(allCats.map((c) => c.name));

// List cats in specific collection
const favorites = await meowzer.storage.listCats("favorites");
```

---

## Collection Management

### createCollection()

```typescript
async createCollection(
  name: string,
  metadata?: Record<string, unknown>
): Promise<string>
```

Create a new collection.

**Parameters:**

| Name       | Type                      | Optional | Description         |
| ---------- | ------------------------- | -------- | ------------------- |
| `name`     | `string`                  | No       | Collection name     |
| `metadata` | `Record<string, unknown>` | Yes      | Additional metadata |

**Returns:** Collection ID

**Example:**

```typescript
const collectionId = await meowzer.storage.createCollection(
  "My Favorites",
  {
    description: "My favorite cats",
    theme: "orange",
  }
);
```

---

### getCollection()

```typescript
async getCollection(collectionId: string): Promise<Collection>
```

Get collection information.

**Parameters:**

| Name           | Type     | Description   |
| -------------- | -------- | ------------- |
| `collectionId` | `string` | Collection ID |

**Returns:**

```typescript
interface Collection {
  id: string;
  name: string;
  catIds: string[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example:**

```typescript
const collection = await meowzer.storage.getCollection(collectionId);
console.log(
  `${collection.name} has ${collection.catIds.length} cats`
);
```

---

### listCollections()

```typescript
async listCollections(): Promise<Collection[]>
```

List all collections.

**Returns:** Array of collection objects

**Example:**

```typescript
const collections = await meowzer.storage.listCollections();
collections.forEach((c) => {
  console.log(`${c.name}: ${c.catIds.length} cats`);
});
```

---

### addToCollection()

```typescript
async addToCollection(
  collectionId: string,
  catId: string
): Promise<void>
```

Add a cat to a collection.

**Parameters:**

| Name           | Type     | Description   |
| -------------- | -------- | ------------- |
| `collectionId` | `string` | Collection ID |
| `catId`        | `string` | Cat ID        |

**Example:**

```typescript
await meowzer.storage.addToCollection(collectionId, cat.id);
```

---

### removeFromCollection()

```typescript
async removeFromCollection(
  collectionId: string,
  catId: string
): Promise<void>
```

Remove a cat from a collection (doesn't delete the cat).

**Parameters:**

| Name           | Type     | Description   |
| -------------- | -------- | ------------- |
| `collectionId` | `string` | Collection ID |
| `catId`        | `string` | Cat ID        |

**Example:**

```typescript
await meowzer.storage.removeFromCollection(collectionId, cat.id);
```

---

### loadCollection()

```typescript
async loadCollection(collectionId: string): Promise<MeowzerCat[]>
```

Load all cats from a collection.

**Parameters:**

| Name           | Type     | Description   |
| -------------- | -------- | ------------- |
| `collectionId` | `string` | Collection ID |

**Returns:** Array of loaded cats

**Example:**

```typescript
const cats = await meowzer.storage.loadCollection("favorites");
console.log(`Loaded ${cats.length} favorite cats`);
```

---

### deleteCollection()

```typescript
async deleteCollection(collectionId: string): Promise<void>
```

Delete a collection (cats remain in storage).

**Parameters:**

| Name           | Type     | Description   |
| -------------- | -------- | ------------- |
| `collectionId` | `string` | Collection ID |

**Example:**

```typescript
await meowzer.storage.deleteCollection(collectionId);
```

---

### clearCollection()

```typescript
async clearCollection(collectionId?: string): Promise<void>
```

Delete all cats in a collection (or all cats if no collection specified).

**Parameters:**

| Name           | Type     | Optional | Description                        |
| -------------- | -------- | -------- | ---------------------------------- |
| `collectionId` | `string` | Yes      | Collection to clear (default: all) |

**Example:**

```typescript
// Clear specific collection
await meowzer.storage.clearCollection("temp-cats");

// Clear all cats from storage
await meowzer.storage.clearCollection();
```

:::danger
This permanently deletes cats from storage. This cannot be undone!
:::

---

## Common Patterns

### Save on Create

```typescript
meowzer.hooks.on("afterCreate", async (ctx) => {
  await meowzer.storage.save(ctx.cat.id);
  console.log(`Auto-saved ${ctx.cat.name}`);
});
```

### Auto-load on Init

```typescript
await meowzer.init();

// Load all saved cats
const savedCats = await meowzer.storage.loadAll();
console.log(`Restored ${savedCats.length} cats`);
```

### Collection Manager

```typescript
// Create collection for session
const sessionId = await meowzer.storage.createCollection(
  "Current Session"
);

// Add cats as they're created
meowzer.hooks.on("afterCreate", async (ctx) => {
  await meowzer.storage.save(ctx.cat.id);
  await meowzer.storage.addToCollection(sessionId, ctx.cat.id);
});

// Load session later
const sessionCats = await meowzer.storage.loadCollection(sessionId);
```

### Backup & Restore

```typescript
// Export all cats
const allCats = await meowzer.storage.listCats();
const backup = JSON.stringify(allCats);
localStorage.setItem("cat-backup", backup);

// Restore (in another session)
const backup = localStorage.getItem("cat-backup");
const catIds = JSON.parse(backup);
for (const id of catIds) {
  await meowzer.storage.load(id);
}
```

---

## Storage Adapters

### IndexedDB (Default)

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "indexeddb",
    enabled: true,
    dbName: "meowzer-cats",
    version: 1,
  },
});
```

**Pros:**

- Persists across sessions
- Large storage quota
- Works offline

**Cons:**

- Async operations
- Can fail in private mode
- Browser compatibility required

### Memory (Testing)

```typescript
const meowzer = new Meowzer({
  storage: {
    adapter: "memory",
    enabled: true,
  },
});
```

**Pros:**

- Synchronous operations
- No browser limitations
- Perfect for testing

**Cons:**

- Lost on page refresh
- Limited by RAM
- Not for production

---

## Error Handling

```typescript
try {
  await meowzer.storage.save(cat.id);
} catch (error) {
  if (error.name === "QuotaExceededError") {
    console.error("Storage quota exceeded!");
    // Clean up old cats
    await meowzer.storage.clearCollection();
  } else if (error.name === "NotFoundError") {
    console.error("Cat doesn't exist in memory");
  } else {
    console.error("Storage error:", error);
  }
}
```

---

## See Also

- [CatManager](/api/managers/cat-manager) - Create and manage cats
- [Persistence Setup Tutorial](/tutorials/persistence-setup) - Step-by-step guide
- [Meowzer SDK](/api/meowzer-sdk) - Main SDK class
