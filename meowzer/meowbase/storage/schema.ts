import type { Cat } from "../types.js";

/**
 * Storage-specific type extensions for IndexedDB
 */

/**
 * Cat record as stored in IndexedDB
 * Extends Cat interface with collectionId foreign key
 */
export interface CatStorageRecord extends Cat {
  collectionId: string;
}

/**
 * Collection metadata (without children array)
 * Used for storing in collections object store
 */
export interface CollectionMetadata {
  id: string;
  name: string;
}

/**
 * Collection info with cat count
 * Used for list operations
 */
export interface CollectionInfo {
  id: string;
  name: string;
  catCount: number;
}

/**
 * Single source of truth for IndexedDB schema
 * This constant drives both TypeScript types and runtime schema application
 */
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

/**
 * Type utilities derived from schema
 */

/**
 * Union type of all store names
 */
export type StoreNames = keyof typeof MEOWBASE_SCHEMA.stores;

/**
 * Get the record type for a specific store
 */
export type StoreRecord<S extends StoreNames> =
  (typeof MEOWBASE_SCHEMA.stores)[S]["__type"];

/**
 * Get the index names for a specific store
 */
export type StoreIndexes<S extends StoreNames> =
  keyof (typeof MEOWBASE_SCHEMA.stores)[S]["indexes"];

/**
 * Runtime schema application
 * Called during IndexedDB onupgradeneeded event
 */
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
