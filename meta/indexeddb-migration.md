# IndexedDB Migration Plan for Meowbase

## Executive Summary

This document outlines a comprehensive plan to migrate Meowbase from `localStorage` to IndexedDB, enabling true ACID-compliant transactions, better performance, and larger storage capacity.

## Why IndexedDB?

### Current Limitations with localStorage

- **No transaction support** - Multiple operations aren't atomic
- **Synchronous API** - Blocks the main thread
- **Small storage quota** - Typically 5-10MB limit
- **No indexing** - Must load/parse entire collections to search
- **No ACID guarantees** - Race conditions possible with multi-tab scenarios
- **String-only storage** - Requires JSON serialization overhead

### Benefits of IndexedDB

- ✅ **Native transactions** - ACID-compliant with automatic rollback
- ✅ **Asynchronous API** - Non-blocking operations
- ✅ **Large storage** - Typically 50MB+ (browser dependent)
- ✅ **Indexes** - Fast queries without loading all data
- ✅ **Object storage** - Direct storage of JavaScript objects
- ✅ **Version management** - Built-in schema migration support
- ✅ **Better concurrency** - Read transactions don't block each other

## Architecture Overview

### Current Architecture (localStorage)

```
Meowbase
├── StorageAdapter (localStorage read/write)
├── CollectionCache (in-memory LRU cache)
├── CollectionOperations (CRUD on collections)
└── CatOperations (CRUD on cats within collections)
```

### Proposed Architecture (IndexedDB)

```
Meowbase
├── IndexedDBAdapter (replaces StorageAdapter)
│   ├── Database initialization & version management
│   ├── Transaction management
│   └── Promise-based operations
├── CollectionCache (optional - IndexedDB has its own caching)
├── CollectionOperations (updated for async)
└── CatOperations (updated for async)
```

## Database Schema Design

### Object Stores

#### 1. Collections Object Store

```typescript
{
  name: "collections",
  keyPath: "id",
  autoIncrement: false,
  indexes: [
    { name: "name", keyPath: "name", unique: true }
  ]
}
```

**Stored Object:**

```typescript
// Matches the Collection interface from types.ts
{
  id: string,        // UUID - Primary key
  name: string       // Collection name - Unique index
  // Note: children array is NOT stored here
  // Cats are stored separately and joined via collectionId
}
```

**Type Mapping:**

- Corresponds to `Collection` interface, but without the `children` array
- The `children` field is reconstructed by querying the Cats object store by `collectionId`

#### 2. Cats Object Store

```typescript
{
  name: "cats",
  keyPath: "id",
  autoIncrement: false,
  indexes: [
    { name: "collectionId", keyPath: "collectionId", unique: false },
    { name: "name", keyPath: "name", unique: false },
    { name: "birthday", keyPath: "birthday", unique: false },
    { name: "by_collection_and_name", keyPath: ["collectionId", "name"], unique: false }
  ]
}
```

**Stored Object:**

```typescript
// Matches the Cat interface from types.ts, plus collectionId foreign key
{
  id: string,                    // UUID - Primary key
  collectionId: string,          // Foreign key to collection - Indexed
  name: string,                  // Cat name - Indexed
  image: string,                 // Image URL or emoji
  birthday: Date,                // Birth date - Indexed (stored as timestamp)
  favoriteToy: Toy,              // Nested Toy object
  description: string,           // Description text
  currentEmotion: Emotion,       // Nested Emotion object
  importantHumans: Human[]       // Array of nested Human objects
}
```

**Nested Objects:**

```typescript
// Toy object (stored inline, not in separate table)
{
  id: string,
  name: string,
  image: string,
  type: string,
  description: string
}

// Emotion object (stored inline)
{
  id: string,
  name: string
}

// Human object (stored inline in array)
{
  id: string,
  name: string,
  isFoodGiver: boolean,
  isScary: boolean
}
```

**Type Mapping:**

- Corresponds to `Cat` interface with one addition: `collectionId` field
- All nested objects (Toy, Emotion, Human[]) are stored denormalized (embedded)

#### 3. Metadata Object Store (for system-level data)

```typescript
{
  name: "metadata",
  keyPath: "key",
  autoIncrement: false
}
```

**Purpose:** Store version info, migration status, configuration

**Stored Objects Examples:**

```typescript
// Schema version tracking
{
  key: "schema_version",
  value: 1
}

// Migration status
{
  key: "migrated_from_localstorage",
  value: true,
  timestamp: Date
}

// Last cleanup timestamp
{
  key: "last_cleanup",
  value: Date
}
```

### Type Extensions Required

To support IndexedDB's normalized schema, we need to extend our types:

```typescript
// Extension of Cat interface for IndexedDB storage
export interface CatStorageRecord extends Cat {
  collectionId: string; // Foreign key - required for IndexedDB
}

// Lightweight collection metadata (without children)
export interface CollectionMetadata {
  id: string;
  name: string;
}

// Full collection with stats (for list operations)
export interface CollectionInfo {
  id: string;
  name: string;
  catCount: number;
}
```

**Note on Type Compatibility:**

- The `Collection` interface remains unchanged for the public API
- Internally, `Collection.children` is populated by joining with Cats store
- `CatStorageRecord` is only used within the IndexedDB adapter layer
- Converting between storage and API types happens in the adapter

### Schema-as-Code Pattern

To maintain consistency between TypeScript types and the IndexedDB schema, we'll use a **Schema-as-Code** pattern where a single TypeScript constant serves as the source of truth for both type definitions and runtime schema application.

**Benefits:**

- ✅ Single source of truth - change schema once, types update everywhere
- ✅ Compile-time safety - TypeScript catches type/schema mismatches
- ✅ Zero runtime overhead - all type checking happens at compile time
- ✅ Auto-completion - IDE knows all store and index names
- ✅ Educational - demonstrates proper SDK architecture

**Complete Schema Definition:**

The schema will be defined in `meowzer/meowbase/storage/schema.ts`:

```typescript
// meowzer/meowbase/storage/schema.ts
import type { Cat } from "../types.js";

// Storage-specific type extensions
export interface CatStorageRecord extends Cat {
  collectionId: string;
}

export interface CollectionMetadata {
  id: string;
  name: string;
}

// Single source of truth for schema definition
export const MEOWBASE_SCHEMA = {
  name: "MeowbaseDB",
  version: 1,
  stores: {
    collections: {
      keyPath: "id" as const,
      autoIncrement: false,
      indexes: {
        name: { keyPath: "name" as const, unique: true },
      },
      __type: {} as CollectionMetadata,
    },
    cats: {
      keyPath: "id" as const,
      autoIncrement: false,
      indexes: {
        collectionId: {
          keyPath: "collectionId" as const,
          unique: false,
        },
        name: { keyPath: "name" as const, unique: false },
        birthday: { keyPath: "birthday" as const, unique: false },
        by_collection_and_name: {
          keyPath: ["collectionId", "name"] as const,
          unique: false,
        },
      },
      __type: {} as CatStorageRecord,
    },
    metadata: {
      keyPath: "key" as const,
      autoIncrement: false,
      indexes: {},
      __type: {} as { key: string; value: unknown },
    },
  },
} as const;

// Type utilities derived from schema
export type StoreNames = keyof typeof MEOWBASE_SCHEMA.stores;
export type StoreRecord<S extends StoreNames> =
  (typeof MEOWBASE_SCHEMA.stores)[S]["__type"];
export type StoreIndexes<S extends StoreNames> =
  keyof (typeof MEOWBASE_SCHEMA.stores)[S]["indexes"];

// Runtime schema application
export function applyMeowbaseSchema(
  db: IDBDatabase,
  oldVersion: number
): void {
  if (oldVersion < 1) {
    const { collections, cats, metadata } = MEOWBASE_SCHEMA.stores;

    // Create collections store
    const collectionsStore = db.createObjectStore("collections", {
      keyPath: collections.keyPath,
      autoIncrement: collections.autoIncrement,
    });
    collectionsStore.createIndex("name", "name", { unique: true });

    // Create cats store
    const catsStore = db.createObjectStore("cats", {
      keyPath: cats.keyPath,
      autoIncrement: cats.autoIncrement,
    });
    catsStore.createIndex("collectionId", "collectionId");
    catsStore.createIndex("name", "name");
    catsStore.createIndex("birthday", "birthday");
    catsStore.createIndex("by_collection_and_name", [
      "collectionId",
      "name",
    ]);

    // Create metadata store
    db.createObjectStore("metadata", {
      keyPath: metadata.keyPath,
      autoIncrement: metadata.autoIncrement,
    });
  }
}
```

**Usage Example:**

```typescript
// Type-safe store access
const store = this.getStore("collections", "readwrite");

// Compiler ensures data matches schema
await store.add({
  id: collection.id,
  name: collection.name,
} satisfies StoreRecord<"collections">);

// TypeScript error if you try to add wrong data:
// await store.add({ wrong: 'data' }); // ❌ Compile error
```

## Migration Strategy

### Phase 1: Dual-Storage Adapter Pattern

Create an abstraction layer that allows both storage mechanisms to coexist.

```typescript
interface IStorageAdapter {
  // Collection operations - match current StorageAdapter
  create(collection: Collection): Promise<MeowbaseResult<Collection>>;
  read(identifier: string): Promise<MeowbaseResult<Collection>>;
  update(collection: Collection): Promise<MeowbaseResult>;
  delete(identifier: string): Promise<MeowbaseResult>;
  list(): Promise<
    MeowbaseResult<
      Array<{ id: string; name: string; catCount: number }>
    >
  >;
  findKey(identifier: string): Promise<string | null>;

  // Note: Cat operations are NOT in the storage adapter
  // They are handled in CatOperations which works with loaded collections
}
```

**Key Design Decision:**
The current architecture stores entire collections (including all cats) as single localStorage entries. The IndexedDB adapter must maintain this same abstraction:

- `create(collection)` stores the collection metadata AND all cats in `collection.children`
- `read(identifier)` retrieves collection metadata AND joins with all cats to populate `children`
- `update(collection)` updates collection metadata AND all cats in `collection.children`
- `delete(identifier)` removes collection metadata AND all associated cats

This preserves the existing API contract where collections always include their children.
catId: string
): Promise<MeowbaseResult<Cat>>;
updateCat(cat: Cat): Promise<MeowbaseResult>;
deleteCat(
collectionId: string,
catId: string
): Promise<MeowbaseResult>;
getCatsByCollection(
collectionId: string
): Promise<MeowbaseResult<Cat[]>>;

// Transaction support
beginTransaction(
stores: string[],
mode: "readonly" | "readwrite"
): Promise<Transaction>;
}

````

### Phase 2: Implementation Steps

#### Step 1: Create IndexedDBAdapter

**File:** `meowzer/meowbase/storage/indexeddb-adapter.ts`

**Key responsibilities:**

- Database initialization with version management
- Transaction lifecycle management
- Promise-based CRUD operations
- Error handling and recovery
- Schema application using `applyMeowbaseSchema()`

**Example structure:**

```typescript
import { MEOWBASE_SCHEMA, applyMeowbaseSchema, type StoreNames, type StoreRecord } from './schema.js';
import type { Collection, Cat } from '../types.js';

export class IndexedDBAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        MEOWBASE_SCHEMA.name,
        MEOWBASE_SCHEMA.version
      );

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        applyMeowbaseSchema(db, event.oldVersion);
      };
    });
  }

  // Type-safe store access using schema types
  private getStore<S extends StoreNames>(
    storeName: S,
    mode: IDBTransactionMode
  ): IDBObjectStore {
    const tx = this.db!.transaction([storeName], mode);
    return tx.objectStore(storeName);
  }

  // Implementation of IStorageAdapter.create
  async create(collection: Collection): Promise<MeowbaseResult<Collection>> {
    if (!this.db) {
      return { success: false, message: "Database not initialized" };
    }

    const transaction = this.db.transaction(
      ["collections", "cats"],
      "readwrite"
    );

    try {
      const collectionsStore = this.getStore("collections", "readwrite");
      const catsStore = this.getStore("cats", "readwrite");

      // Store collection metadata (without children)
      // Type safety ensured by StoreRecord<"collections">
      await this.promisifyRequest(
        collectionsStore.add({
          id: collection.id,
          name: collection.name,
        } satisfies StoreRecord<"collections">)
      );

      // Store all cats with collectionId foreign key
      for (const cat of collection.children) {
        await this.promisifyRequest(
          catsStore.add({
            ...cat,
            collectionId: collection.id,
          } satisfies StoreRecord<"cats">)
        );
      }

      await this.commitTransaction(transaction);

      return {
        success: true,
        data: collection,
        message: `Collection "${collection.name}" created successfully`,
      };
    } catch (error) {
      transaction.abort();

      if (error.name === "ConstraintError") {
        return {
          success: false,
          message: `Collection with name "${collection.name}" already exists`,
        };
      }

      return {
        success: false,
        message: `Failed to create collection: ${error.message}`,
      };
    }
  }

  // Implementation of IStorageAdapter.read
  async read(identifier: string): Promise<MeowbaseResult<Collection>> {
    if (!this.db) {
      return { success: false, message: "Database not initialized" };
    }

    try {
      const transaction = this.db.transaction(
        ["collections", "cats"],
        "readonly"
      );
      const collectionsStore = transaction.objectStore("collections");
      const catsStore = transaction.objectStore("cats");

      // Try to find collection by ID first
      let collectionData = await this.promisifyRequest(
        collectionsStore.get(identifier)
      );

      // If not found by ID, search by name using index
      if (!collectionData) {
        const nameIndex = collectionsStore.index("name");
        collectionData = await this.promisifyRequest(
          nameIndex.get(identifier)
        );
      }

      if (!collectionData) {
        return {
          success: false,
          message: `Collection "${identifier}" not found`,
        };
      }

      // Get all cats for this collection
      const collectionIdIndex = catsStore.index("collectionId");
      const cats = await this.promisifyRequest<Cat[]>(
        collectionIdIndex.getAll(collectionData.id)
      );

      // Reconstruct full Collection object with children
      const collection: Collection = {
        id: collectionData.id,
        name: collectionData.name,
        children: cats,
      };

      return {
        success: true,
        data: collection,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve collection: ${error.message}`,
      };
    }
  }

  // Implementation of IStorageAdapter.update
  async update(collection: Collection): Promise<MeowbaseResult> {
    if (!this.db) {
      return { success: false, message: "Database not initialized" };
    }

    const transaction = this.db.transaction(
      ["collections", "cats"],
      "readwrite"
    );

    try {
      const collectionsStore = transaction.objectStore("collections");
      const catsStore = transaction.objectStore("cats");

      // Update collection metadata
      await this.promisifyRequest(
        collectionsStore.put({
          id: collection.id,
          name: collection.name,
        })
      );

      // Delete all existing cats for this collection
      const collectionIdIndex = catsStore.index("collectionId");
      const existingCats = await this.promisifyRequest<CatStorageRecord[]>(
        collectionIdIndex.getAll(collection.id)
      );

      for (const cat of existingCats) {
        await this.promisifyRequest(catsStore.delete(cat.id));
      }

      // Add all cats from the updated collection
      for (const cat of collection.children) {
        const catRecord: CatStorageRecord = {
          ...cat,
          collectionId: collection.id,
        };
        await this.promisifyRequest(catsStore.put(catRecord));
      }

      await this.commitTransaction(transaction);

      return {
        success: true,
        message: `Collection "${collection.name}" updated successfully`,
      };
    } catch (error) {
      transaction.abort();
      return {
        success: false,
        message: `Failed to update collection: ${error.message}`,
      };
    }
  }

  // Implementation of IStorageAdapter.delete
  async delete(identifier: string): Promise<MeowbaseResult> {
    if (!this.db) {
      return { success: false, message: "Database not initialized" };
    }

    try {
      // First, read the collection to get its ID
      const readResult = await this.read(identifier);
      if (!readResult.success || !readResult.data) {
        return {
          success: false,
          message: `Collection "${identifier}" not found`,
        };
      }

      const collectionId = readResult.data.id;

      const transaction = this.db.transaction(
        ["collections", "cats"],
        "readwrite"
      );
      const collectionsStore = transaction.objectStore("collections");
      const catsStore = transaction.objectStore("cats");

      // Delete all cats in this collection
      const collectionIdIndex = catsStore.index("collectionId");
      const cats = await this.promisifyRequest<CatStorageRecord[]>(
        collectionIdIndex.getAll(collectionId)
      );

      for (const cat of cats) {
        await this.promisifyRequest(catsStore.delete(cat.id));
      }

      // Delete the collection itself
      await this.promisifyRequest(collectionsStore.delete(collectionId));

      await this.commitTransaction(transaction);

      return {
        success: true,
        message: "Collection deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete collection: ${error.message}`,
      };
    }
  }

  // Implementation of IStorageAdapter.list
  async list(): Promise<
    MeowbaseResult<Array<{ id: string; name: string; catCount: number }>>
  > {
    if (!this.db) {
      return { success: false, message: "Database not initialized" };
    }

    try {
      const transaction = this.db.transaction(
        ["collections", "cats"],
        "readonly"
      );
      const collectionsStore = transaction.objectStore("collections");
      const catsStore = transaction.objectStore("cats");

      const collections = await this.promisifyRequest<CollectionMetadata[]>(
        collectionsStore.getAll()
      );

      const result = [];

      for (const collection of collections) {
        const collectionIdIndex = catsStore.index("collectionId");
        const cats = await this.promisifyRequest<CatStorageRecord[]>(
          collectionIdIndex.getAll(collection.id)
        );

        result.push({
          id: collection.id,
          name: collection.name,
          catCount: cats.length,
        });
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list collections: ${error.message}`,
      };
    }
  }

  // Implementation of IStorageAdapter.findKey
  async findKey(identifier: string): Promise<string | null> {
    if (!this.db) {
      return null;
    }

    try {
      const transaction = this.db.transaction(["collections"], "readonly");
      const collectionsStore = transaction.objectStore("collections");

      // Try ID first
      const byId = await this.promisifyRequest(
        collectionsStore.get(identifier)
      );
      if (byId) {
        return `meowbase-${byId.id}`; // Match localStorage format
      }

      // Try name
      const nameIndex = collectionsStore.index("name");
      const byName = await this.promisifyRequest(nameIndex.get(identifier));
      if (byName) {
        return `meowbase-${byName.id}`; // Match localStorage format
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Helper methods
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private commitTransaction(transaction: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error("Transaction aborted"));
    });
  }
}
````

**Key Implementation Notes:**

1. **Type Compatibility**: `CatStorageRecord` extends `Cat` with `collectionId`
2. **Join Operation**: The `read()` method joins collections with cats using the `collectionId` index
3. **Cascading Delete**: `delete()` removes all cats when a collection is deleted
4. **Update Strategy**: `update()` uses a delete-then-insert approach for cats to handle array changes
5. **Error Handling**: Constraint errors (duplicate names) are caught and returned with helpful messages

#### Step 2: Update Meowbase API to be Async

All methods must return Promises since IndexedDB is asynchronous.

**Breaking change:** This changes the API from synchronous to asynchronous.

**Before:**

```typescript
const result = db.createCollection("cats", []);
if (result.success) { ... }
```

**After:**

```typescript
const result = await db.createCollection("cats", []);
if (result.success) { ... }
```

**Migration path options:**

1. **Option A (Clean break):** Release v2.0 with breaking changes, provide migration guide
2. **Option B (Compatibility layer):** Maintain localStorage adapter, let users choose
3. **Option C (Automatic migration):** Detect localStorage data and migrate on first run

#### Step 3: Update CollectionOperations

Make all methods async and delegate to the storage adapter.

```typescript
export class CollectionOperations {
  constructor(
    private storage: IStorageAdapter,
    private cache: CollectionCache,
    private config: MeowbaseConfig
  ) {}

  async create(
    name: string,
    cats: Cat[]
  ): Promise<MeowbaseResult<Collection>> {
    // Validation
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        message: "Collection name cannot be empty",
      };
    }

    // Check size limit
    if (cats.length > this.config.maxCollectionSize) {
      return {
        success: false,
        message: `Collection size exceeds maximum of ${this.config.maxCollectionSize}`,
      };
    }

    // Delegate to storage
    const result = await this.storage.createCollection(name, cats);

    // Update cache if successful
    if (result.success && result.data) {
      this.cache.set(result.data.id, {
        collection: result.data,
        lastAccessed: Date.now(),
        isDirty: false,
      });
    }

    return result;
  }

  // ... other methods updated similarly
}
```

#### Step 4: Implement Transaction Support

Add explicit transaction methods for complex operations.

```typescript
export class Meowbase {
  async beginTransaction<T>(
    callback: (tx: MeowbaseTransaction) => Promise<T>
  ): Promise<MeowbaseResult<T>> {
    const transaction = await this.storage.beginTransaction(
      ["collections", "cats"],
      "readwrite"
    );

    try {
      const result = await callback(
        new MeowbaseTransaction(transaction)
      );
      await transaction.commit();
      return { success: true, data: result };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        message: `Transaction failed: ${error.message}`,
      };
    }
  }
}

// Usage example:
const result = await db.beginTransaction(async (tx) => {
  const collection = await tx.createCollection("new-cats", []);
  const cat = await tx.addCat(collection.id, someCat);
  return { collection, cat };
});
```

#### Step 5: Cache Strategy Reevaluation

With IndexedDB's built-in caching and indexes, the in-memory cache may be less critical.

**Options:**

1. **Keep cache** - Maintain for even faster access to frequently used data
2. **Remove cache** - Simplify architecture, rely on IndexedDB's performance
3. **Hybrid** - Cache only metadata, fetch cats on demand

**Recommendation:** Start with Option 2 (remove cache) for simplicity, add back if performance testing shows benefit.

#### Step 6: Migration Tool

Create utility to migrate existing localStorage data to IndexedDB.

```typescript
export class MeowbaseMigrator {
  async migrateFromLocalStorage(): Promise<
    MeowbaseResult<{
      collectionsCount: number;
      catsCount: number;
    }>
  > {
    const localStorageAdapter = new LocalStorageAdapter();
    const indexedDBAdapter = new IndexedDBAdapter();

    await indexedDBAdapter.initialize();

    try {
      // Get all collections from localStorage
      const collectionsResult =
        await localStorageAdapter.listCollections();
      if (!collectionsResult.success) {
        return collectionsResult;
      }

      let totalCats = 0;

      // Migrate each collection
      for (const collectionMeta of collectionsResult.data!) {
        const collectionResult =
          await localStorageAdapter.getCollection(collectionMeta.id);
        if (collectionResult.success && collectionResult.data) {
          await indexedDBAdapter.createCollection(
            collectionResult.data.name,
            collectionResult.data.children
          );
          totalCats += collectionResult.data.children.length;
        }
      }

      return {
        success: true,
        data: {
          collectionsCount: collectionsResult.data!.length,
          catsCount: totalCats,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Migration failed: ${error.message}`,
      };
    }
  }
}
```

### Phase 3: Testing Strategy

#### Unit Tests

- Test each IndexedDBAdapter method in isolation
- Mock IndexedDB using `fake-indexeddb` library
- Verify transaction rollback on errors
- Test concurrent operations

#### Integration Tests

- Test full CRUD flows
- Test migration from localStorage
- Test error recovery scenarios
- Test quota exceeded handling

#### Performance Tests

- Compare read/write performance vs localStorage
- Test with large datasets (1000+ cats)
- Measure transaction overhead
- Test concurrent tab scenarios

#### Browser Compatibility Tests

Test on:

- Chrome/Edge (Blink engine)
- Firefox (Gecko engine)
- Safari (WebKit engine)
- Mobile browsers

### Phase 4: Documentation Updates

#### API Documentation

- Update all method signatures to show `async` and `Promise` returns
- Add transaction usage examples
- Document migration process

#### Migration Guide

Create guide for users upgrading from v1 to v2:

- Breaking changes list
- Code migration examples
- Data migration instructions
- Rollback procedure

#### Educational Content

Since Meowbase is a learning tool:

- Explain ACID properties with examples
- Show transaction benefits with real scenarios
- Compare localStorage vs IndexedDB tradeoffs
- Add debugging tips for IndexedDB

## Implementation Timeline

### Week 1-2: Foundation

- [ ] Create `meowzer/meowbase/storage/schema.ts` with `MEOWBASE_SCHEMA` constant
- [ ] Define type utilities (`StoreNames`, `StoreRecord`, `StoreIndexes`)
- [ ] Implement `applyMeowbaseSchema()` function
- [ ] Create `IStorageAdapter` interface
- [ ] Implement `IndexedDBAdapter` skeleton using schema types
- [ ] Write initial unit tests

### Week 3-4: Core Implementation

- [ ] Implement all CRUD operations in IndexedDBAdapter with type safety
- [ ] Update CollectionOperations to be async
- [ ] Update CatOperations to be async
- [ ] Implement transaction support

### Week 5-6: Migration & Testing

- [ ] Build migration utility
- [ ] Write comprehensive test suite
- [ ] Performance testing and optimization
- [ ] Cross-browser testing
- [ ] Validate schema matches runtime structure

### Week 7-8: Documentation & Release

- [ ] Update API documentation
- [ ] Write migration guide
- [ ] Update educational examples showcasing type safety
- [ ] Create sample apps showcasing transactions
- [ ] Add JSDoc comments explaining Schema-as-Code pattern
- [ ] Release v2.0

## Backward Compatibility Strategy

NEVER worry about backward compatibility. This is a greenfield project with 0 users.

## ACID Compliance Implementation

### Atomicity

**Implementation:** Use IndexedDB transactions. All operations within a transaction succeed or all fail.

```typescript
async updateCatAndEmotion(catId: string, newData: Partial<Cat>): Promise<MeowbaseResult> {
  return this.beginTransaction(async (tx) => {
    // Both updates happen atomically
    await tx.updateCat(catId, newData);
    await tx.logEmotionChange(catId, newData.currentEmotion);
  });
}
```

### Consistency

**Implementation:** Enforce constraints before writes, validate foreign keys.

```typescript
async addCat(collectionId: string, cat: Cat): Promise<MeowbaseResult> {
  // Check collection exists
  const collection = await this.getCollection(collectionId);
  if (!collection.success) {
    return { success: false, message: 'Collection does not exist' };
  }

  // Check size limits
  if (collection.data!.children.length >= this.config.maxCollectionSize) {
    return { success: false, message: 'Collection is full' };
  }

  // Validate cat data
  if (!cat.name || !cat.id) {
    return { success: false, message: 'Invalid cat data' };
  }

  // All constraints satisfied, proceed
  return await this.storage.addCat(collectionId, cat);
}
```

### Isolation

**Implementation:** Use appropriate transaction modes and handle conflicts.

```typescript
// Read-only transactions can run concurrently
async getCat(collectionId: string, catId: string): Promise<MeowbaseResult<Cat>> {
  const tx = await this.storage.beginTransaction(['cats'], 'readonly');
  return await tx.getCat(collectionId, catId);
}

// Write transactions are serialized
async updateCat(cat: Cat): Promise<MeowbaseResult> {
  const tx = await this.storage.beginTransaction(['cats'], 'readwrite');
  return await tx.updateCat(cat);
}
```

### Durability

**Implementation:** IndexedDB automatically flushes to disk after transaction commits.

```typescript
async saveCollection(id: string): Promise<MeowbaseResult> {
  const result = await this.storage.updateCollection(id);
  // Once this promise resolves, data is persisted
  return result;
}
```

## Performance Considerations

### Indexes for Fast Queries

```typescript
// Fast lookup by collection
const cats = await db.getCatsByCollection("collection-123");

// Fast lookup by name (using index)
const cat = await db.findCatByName("collection-123", "Fluffy");

// Range queries
const youngCats = await db.getCatsByBirthdayRange(
  new Date("2020-01-01"),
  new Date("2024-01-01")
);
```

### Batch Operations

```typescript
async addMultipleCats(collectionId: string, cats: Cat[]): Promise<MeowbaseResult> {
  return this.beginTransaction(async (tx) => {
    for (const cat of cats) {
      await tx.addCat(collectionId, cat);
    }
  });
}
```

### Lazy Loading

```typescript
// Load collection metadata without cats
const metadata = await db.getCollectionMetadata(id);

// Load cats only when needed
const cats = await db.getCatsByCollection(id);
```

## Error Handling

### Transaction Errors

```typescript
try {
  await db.beginTransaction(async (tx) => {
    await tx.createCollection("cats", []);
    throw new Error("Simulated error");
    await tx.addCat("cats", someCat); // This won't execute
  });
} catch (error) {
  // Transaction automatically rolled back
  console.error("Transaction failed:", error);
}
```

### Quota Exceeded

```typescript
async createCollection(name: string, cats: Cat[]): Promise<MeowbaseResult<Collection>> {
  try {
    return await this.storage.createCollection(name, cats);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      return {
        success: false,
        message: 'Storage quota exceeded. Please delete some collections.'
      };
    }
    throw error;
  }
}
```

### Version Conflicts

```typescript
request.onblocked = () => {
  return {
    success: false,
    message: "Please close other tabs with Meowbase open to upgrade.",
  };
};

db.onversionchange = () => {
  db.close();
  alert("Database is being upgraded. Page will reload.");
  location.reload();
};
```

## Security Considerations

- **Same-origin policy:** IndexedDB is isolated per origin
- **No SQL injection:** Uses object-based API, not SQL
- **User permissions:** Browser prompts for storage in some cases
- **Data encryption:** Not built-in, but can encrypt before storing
- **Private browsing:** Data cleared when session ends

## Open Questions

1. **Should we maintain localStorage adapter long-term?**

   - Pros: Simpler API for basic use cases, broader compatibility
   - Cons: Maintenance burden, feature parity challenges

2. **How to handle very large collections?**

   - Implement pagination/cursor-based loading?
   - Set stricter size limits?
   - Add warnings for large datasets?

3. **Should we add query builder?**

   - Currently requires manual index usage
   - Could provide SQL-like query API
   - May add complexity for learning tool

4. **Multi-tab synchronization?**
   - IndexedDB has `storage` event for cross-tab communication
   - Could implement optimistic locking
   - May be overkill for educational tool

## Success Criteria

- ✅ All existing tests pass with IndexedDB adapter
- ✅ Performance equal or better than localStorage
- ✅ ACID compliance demonstrated with test cases
- ✅ Migration tool successfully migrates all test data
- ✅ Documentation includes transaction examples
- ✅ Works in Chrome, Firefox, Safari
- ✅ Educational examples showcase ACID benefits

## References

- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [IndexedDB Specification](https://w3c.github.io/IndexedDB/)
- [Browser Storage Quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [IDB Library](https://github.com/jakearchibald/idb) - Promise-based wrapper
- [Dexie.js](https://dexie.org/) - Higher-level IndexedDB wrapper (for reference)
