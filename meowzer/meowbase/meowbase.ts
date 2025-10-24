import type {
  Collection,
  Cat,
  MeowbaseConfig,
  MeowbaseResult,
} from "./types.js";
import { StorageAdapter } from "./collections/storage.js";
import { CollectionCache } from "./collections/cache.js";
import { CollectionOperations } from "./collections/operations.js";
import { CatOperations } from "./cats/operations.js";
import { getSampleDataset } from "./core/sample-data.js";

/**
 * Meowbase - A localStorage wrapper that mimics database operations
 * Main facade that orchestrates all operations
 */
export class Meowbase {
  private config: MeowbaseConfig;
  private storage: StorageAdapter;
  private cache: CollectionCache;
  private collections: CollectionOperations;
  private cats: CatOperations;

  constructor(config?: Partial<MeowbaseConfig>) {
    this.config = {
      maxLoadedCollections: config?.maxLoadedCollections ?? 5,
      maxCollectionSize: config?.maxCollectionSize ?? 100,
    };

    // Initialize modules
    this.storage = new StorageAdapter();
    this.cache = new CollectionCache(
      this.config.maxLoadedCollections
    );
    this.collections = new CollectionOperations(
      this.storage,
      this.cache,
      this.config
    );
    this.cats = new CatOperations(this.cache, this.config);
  }

  // ===== Collection Management Methods =====

  /**
   * Create a new collection and persist it to localStorage
   */
  createCollection(
    name: string,
    cats: Cat[] = []
  ): MeowbaseResult<Collection> {
    return this.collections.create(name, cats);
  }

  /**
   * Load a collection into memory
   */
  loadCollection(identifier: string): MeowbaseResult<Collection> {
    return this.collections.load(identifier);
  }

  /**
   * Load multiple collections into memory
   */
  loadCollections(
    identifiers: string[]
  ): MeowbaseResult<Collection[]> {
    return this.collections.loadMany(identifiers);
  }

  /**
   * Save a loaded collection back to localStorage
   */
  saveCollection(identifier: string): MeowbaseResult {
    return this.collections.save(identifier);
  }

  /**
   * Save all dirty collections to localStorage
   */
  flushChanges(): MeowbaseResult {
    return this.collections.flush();
  }

  /**
   * Unload a collection from memory
   */
  unloadCollection(identifier: string): MeowbaseResult {
    return this.collections.unload(identifier);
  }

  /**
   * Unload all collections from memory
   */
  unloadAllCollections(): MeowbaseResult {
    return this.collections.unloadAll();
  }

  /**
   * Delete a collection from localStorage
   */
  deleteCollection(identifier: string): MeowbaseResult {
    return this.collections.delete(identifier);
  }

  /**
   * Get a collection from localStorage without loading it into memory
   */
  getCollection(identifier: string): MeowbaseResult<Collection> {
    return this.collections.get(identifier);
  }

  /**
   * List all collection IDs and names in localStorage
   */
  listCollections(): MeowbaseResult<
    Array<{ id: string; name: string; catCount: number }>
  > {
    return this.collections.list();
  }

  /**
   * Get list of currently loaded collections
   */
  getLoadedCollections(): Array<{
    id: string;
    name: string;
    isDirty: boolean;
    lastAccessed: number;
  }> {
    return this.collections.getLoaded();
  }

  /**
   * Check if a collection is currently loaded in memory
   */
  isCollectionLoaded(identifier: string): boolean {
    return this.collections.isLoaded(identifier);
  }

  /**
   * Get the size of a collection without loading it
   */
  getCollectionSize(identifier: string): MeowbaseResult<number> {
    return this.collections.getSize(identifier);
  }

  // ===== Cat Operations on Loaded Collections =====

  /**
   * Find a cat within a loaded collection
   */
  findCatInCollection(
    collectionIdentifier: string,
    catIdentifier: string
  ): MeowbaseResult<Cat> {
    return this.cats.find(collectionIdentifier, catIdentifier);
  }

  /**
   * Add a cat to a loaded collection
   */
  addCatToCollection(
    collectionIdentifier: string,
    cat: Cat
  ): MeowbaseResult {
    return this.cats.add(collectionIdentifier, cat);
  }

  /**
   * Remove a cat from a loaded collection
   */
  removeCatFromCollection(
    collectionIdentifier: string,
    catIdentifier: string
  ): MeowbaseResult {
    return this.cats.remove(collectionIdentifier, catIdentifier);
  }

  /**
   * Update a cat within a loaded collection
   */
  updateCatInCollection(
    collectionIdentifier: string,
    cat: Cat
  ): MeowbaseResult {
    return this.cats.update(collectionIdentifier, cat);
  }

  // ===== Data Management Methods =====

  /**
   * Load sample dataset into localStorage
   * Clears all existing meowbase data and loads three collections:
   * - shelter: 5 cats waiting for adoption
   * - neighborhood: 4 community cats
   * - home: 6 owned indoor cats
   */
  loadSampleData(): MeowbaseResult<{
    collectionsCreated: number;
    totalCats: number;
  }> {
    try {
      // Unload all collections from memory
      this.cache.clear();

      // Clear all existing meowbase data from localStorage
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("meowbase-")) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));

      // Load sample dataset
      const sampleCollections = getSampleDataset();
      let totalCats = 0;

      // Create each collection in storage
      for (const collection of sampleCollections) {
        const result = this.storage.create(collection);
        if (!result.success) {
          return {
            success: false,
            message: `Failed to create collection "${collection.name}": ${result.message}`,
          };
        }
        totalCats += collection.children.length;
      }

      return {
        success: true,
        data: {
          collectionsCreated: sampleCollections.length,
          totalCats,
        },
        message: `Successfully loaded sample data: ${sampleCollections.length} collections with ${totalCats} cats`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to load sample data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Clear all meowbase data from localStorage and memory
   */
  clearAllData(): MeowbaseResult {
    try {
      // Unload all collections from memory
      this.cache.clear();

      // Clear all meowbase data from localStorage
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("meowbase-")) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));

      return {
        success: true,
        message: `Cleared ${keys.length} collections from storage`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
