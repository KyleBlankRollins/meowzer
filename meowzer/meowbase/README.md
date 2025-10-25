# Meowbase

This wrapper around the browser's [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) mimics a simple database and its operations. The goal is to provide a working development tool that can be used for various learning experiences.

Meowbase uses a **document database model** (like MongoDB) where collections contain full cat objects, not just references. This design prioritizes simplicity and helps learners understand document-oriented data structures.

## Architecture

Meowbase is organized into focused, testable modules:

```
meowbase/
├── core/
│   └── utils.ts              # UUID generation and utilities
├── collections/
│   ├── cache.ts              # LRU memory cache
│   └── operations.ts         # Collection CRUD operations
├── storage/
│   ├── adapter-interface.ts  # Storage interface
│   ├── indexeddb-adapter.ts  # IndexedDB implementation
│   └── schema.ts             # Database schema
├── cats/
│   └── operations.ts         # Cat operations within collections
├── types.ts                  # TypeScript interfaces
└── meowbase.ts               # Main facade class
```

## Data Model

### Collections

Collections are the top-level containers in Meowbase. Each collection:

- Has a unique `id` (UUID string)
- Has a `name` (string, not required to be unique)
- Contains an array of `Cat` objects as `children`
- Is stored in IndexedDB

### Cats

Each cat has:

- `id`: UUID string
- `name`: string
- `image`: string (URL or path)
- `birthday`: Date
- `favoriteToy`: Toy object
- `description`: string
- `currentEmotion`: Emotion object
- `importantHumans`: Array of Human objects

See `types.ts` for complete type definitions.

## Memory Management

Meowbase uses an **LRU (Least Recently Used) cache** to manage loaded collections:

- **Default limit**: 5 collections in memory at once
- **Automatic eviction**: When the limit is reached, the least recently accessed collection is saved (if dirty) and removed
- **Dirty tracking**: Collections are marked dirty when modified and must be explicitly saved
- **Size limits**: Collections have a maximum size (default: 100 cats)

## Configuration

```ts
const db = new Meowbase({
  maxLoadedCollections: 5, // Max collections in memory
  maxCollectionSize: 100, // Max cats per collection
});
```

## API Reference

### Collection Management

#### `createCollection(name: string, cats?: Cat[]): MeowbaseResult<Collection>`

Create a new collection and persist it to storage.

```ts
const result = db.createCollection("My Cats", []);
if (result.success) {
  console.log(result.data); // The created collection
}
```

#### `loadCollection(identifier: string): MeowbaseResult<Collection>`

Load a collection into memory by ID or name. If already loaded, updates the access timestamp.

```ts
const result = db.loadCollection("My Cats");
```

#### `loadCollections(identifiers: string[]): MeowbaseResult<Collection[]>`

Load multiple collections at once.

#### `saveCollection(identifier: string): MeowbaseResult`

Save a loaded collection's changes back to storage. Required before unloading.

```ts
db.saveCollection("My Cats");
```

#### `flushChanges(): MeowbaseResult`

Save all dirty (modified) collections to storage.

```ts
db.flushChanges();
```

#### `unloadCollection(identifier: string): MeowbaseResult`

Remove a collection from memory. Fails if the collection has unsaved changes.

```ts
db.unloadCollection("My Cats");
```

#### `unloadAllCollections(): MeowbaseResult`

Remove all collections from memory. Fails if any collection has unsaved changes.

#### `deleteCollection(identifier: string): MeowbaseResult`

Permanently delete a collection from storage.

#### `getCollection(identifier: string): MeowbaseResult<Collection>`

Read a collection from storage without loading it into memory.

#### `listCollections(): MeowbaseResult<Array<{id, name, catCount}>>`

List all collections in storage with metadata.

#### `getLoadedCollections(): Array<{id, name, isDirty, lastAccessed}>`

Get information about currently loaded collections.

#### `isCollectionLoaded(identifier: string): boolean`

Check if a collection is in memory.

#### `getCollectionSize(identifier: string): MeowbaseResult<number>`

Get the number of cats in a collection without loading it.

### Cat Operations

All cat operations require the collection to be loaded into memory first.

#### `findCatInCollection(collectionId: string, catId: string): MeowbaseResult<Cat>`

Find a cat by ID or name within a loaded collection.

```ts
db.loadCollection("My Cats");
const result = db.findCatInCollection("My Cats", "Fluffy");
```

#### `addCatToCollection(collectionId: string, cat: Cat): MeowbaseResult`

Add a cat to a loaded collection. Marks the collection as dirty.

```ts
const cat = {
  id: generateUUID(),
  name: "Fluffy",
  // ... other required fields
};
db.addCatToCollection("My Cats", cat);
db.saveCollection("My Cats"); // Don't forget to save!
```

#### `removeCatFromCollection(collectionId: string, catId: string): MeowbaseResult`

Remove a cat from a loaded collection by ID or name.

#### `updateCatInCollection(collectionId: string, cat: Cat): MeowbaseResult`

Update a cat within a loaded collection. Finds the cat by `id` and replaces it.

### Data Management

#### `loadSampleData(): MeowbaseResult<{collectionsCreated: number, totalCats: number}>`

Load a pre-built sample dataset into storage. This is useful for testing, demos, or learning.

This generates an HTML report in `coverage/index.html` showing line-by-line coverage for all modules.

## Sample Dataset

Meowbase includes a pre-built sample dataset with 15 cats across three collections:

### Collections

1. **shelter** (5 cats)

   - Whiskers - friendly tabby
   - Shadow - shy black cat
   - Luna - energetic kitten
   - Oliver - confident orange tabby
   - Mittens - adorable tuxedo cat

2. **neighborhood** (4 cats)

   - Streetwise - experienced alley cat
   - Patches - friendly calico
   - Bandit - mischievous gray cat
   - Princess - elegant white Persian

3. **home** (6 cats)
   - Mr. Fluffington - long-haired Maine Coon
   - Bella - talkative Siamese
   - Simba - golden tabby
   - Cleo - Halloween black cat
   - Gizmo - mischievous kitten
   - Duchess - senior gray cat

Each cat includes complete data:

- Unique ID and name
- Image URL
- Birthday (serialized as ISO string)
- Favorite toy object
- Description
- Current emotion
- Important humans array

### Loading Sample Data

```ts
import { Meowbase } from "./meowbase/meowbase.js";

const db = new Meowbase();

// Load the sample dataset
const result = db.loadSampleData();

if (result.success) {
  console.log(`Loaded ${result.data.totalCats} cats!`);

  // Now you can work with the data
  db.loadCollection("home");
  const catResult = db.findCatInCollection("home", "Bella");
}
```

**Warning**: `loadSampleData()` clears all existing Meowbase data before loading.

**Note**: This method clears ALL existing Meowbase data before loading.

```ts
const result = db.loadSampleData();
if (result.success) {
  console.log(
    `Loaded ${result.data.collectionsCreated} collections with ${result.data.totalCats} cats`
  );
  // Output: "Loaded 3 collections with 15 cats"
}
```

#### `clearAllData(): MeowbaseResult`

Clear all Meowbase data from storage and unload all collections from memory.

```ts
db.clearAllData();
```

## Result Pattern

All operations return a `MeowbaseResult<T>` which is either:

```ts
// Success
{
  success: true,
  data?: T,
  message?: string
}

// Error
{
  success: false,
  message: string
}
```

Always check `result.success` before accessing `result.data`.

## Usage Example

```ts
import { Meowbase } from "./meowbase/meowbase.js";

const db = new Meowbase();

// Create a collection
const createResult = db.createCollection("Cat Shelter");

if (createResult.success) {
  // Load it into memory
  db.loadCollection("Cat Shelter");

  // Add a cat
  const cat = {
    id: "cat-uuid-123",
    name: "Whiskers",
    // ... other fields
  };
  db.addCatToCollection("Cat Shelter", cat);

  // Save changes
  db.saveCollection("Cat Shelter");

  // Find the cat
  const findResult = db.findCatInCollection(
    "Cat Shelter",
    "Whiskers"
  );

  // Unload when done
  db.unloadCollection("Cat Shelter");
}
```

## Best Practices

1. **Always check `result.success`** before accessing data
2. **Load collections before operating on cats** within them
3. **Save collections** after making changes
4. **Unload collections** when done to free memory
5. **Use `flushChanges()`** periodically to persist all changes
6. **Handle errors gracefully** - operations may fail due to size limits, missing data, etc.

## Testing

Meowbase uses **Vitest** with **happy-dom** for testing. This setup provides fast, reliable tests without requiring a real browser.

### Testing Framework

**Vitest** is a modern test runner with:

- Native TypeScript support
- Fast execution with watch mode
- Built-in coverage reporting
- Jest-compatible API

**happy-dom** simulates browser APIs including:

- DOM APIs
- Window and document objects

This combination allows us to test in a Node.js environment without the overhead of launching a real browser.

**Note:** IndexedDB tests require additional setup (e.g., fake-indexeddb) and are pending implementation.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with visual UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized alongside the source code in `__tests__` directories:

```
meowbase/
├── __tests__/
│   ├── helpers.ts          # Test utilities and mock factories
│   └── cache.test.ts       # CollectionCache tests
├── collections/
├── cats/
└── ...
```

### Writing Tests

#### Test Helpers

The `helpers.ts` file provides factory functions for creating test data:

```ts
import { createMockCat, createMockCollection } from "./helpers.js";

// Create a mock cat with default values
const cat = createMockCat({ name: "Custom Name" });

// Create a collection
const collection = createMockCollection({
  name: "Test Collection",
  children: [cat],
});
```

Available factory functions:

- `createMockCat(overrides?)` - Creates a Cat with all required fields
- `createMockCollection(overrides?)` - Creates a Collection
- `createMockToy(overrides?)` - Creates a Toy object
- `createMockEmotion(overrides?)` - Creates an Emotion object
- `createMockHuman(overrides?)` - Creates a Human object

#### Example Test

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { CollectionCache } from "../collections/cache.js";
import { createMockCollection } from "./helpers.js";

describe("CollectionCache", () => {
  let cache: CollectionCache;

  beforeEach(() => {
    cache = new CollectionCache();
  });

  it("should add a collection to cache", () => {
    const collection = createMockCollection({ name: "My Cats" });
    cache.set(collection.id, collection);

    const retrieved = cache.get(collection.id);
    expect(retrieved).toEqual(collection);
  });
});
```

#### Testing Best Practices

1. **Type-safe assertions** - Always check `result.success` before accessing `result.data`:

   ```ts
   expect(result.success).toBe(true);
   if (result.success) {
     expect(result.data!.name).toBe("Expected Name");
   }
   ```

2. **Use factory functions** - Don't manually create test objects; use the provided helpers for consistency

3. **Test isolation** - Each test should be independent and not rely on state from other tests

4. **Descriptive test names** - Use clear, behavior-focused descriptions:
   ```ts
   it("should mark collection as dirty when adding a cat", () => { ... });
   ```

### Test Coverage

Current test coverage:

- **CollectionCache**: 20 tests covering cache operations and collection management
- **CollectionCache**: 20 tests covering LRU eviction, dirty tracking, get/set/remove operations

To view detailed coverage reports:

```bash
npm run test:coverage
```

This generates an HTML report in `coverage/index.html` showing line-by-line coverage for all modules.
