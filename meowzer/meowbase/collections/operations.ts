import type {
  Collection,
  Cat,
  MeowbaseConfig,
  MeowbaseResult,
} from "../types.js";
import { CollectionCache } from "./cache.js";
import { StorageAdapter } from "./storage.js";
import { generateUUID } from "../core/utils.js";

/**
 * High-level collection operations that orchestrate between storage and cache
 */
export class CollectionOperations {
  private storage: StorageAdapter;
  private cache: CollectionCache;
  private config: MeowbaseConfig;

  constructor(
    storage: StorageAdapter,
    cache: CollectionCache,
    config: MeowbaseConfig
  ) {
    this.storage = storage;
    this.cache = cache;
    this.config = config;
  }

  /**
   * Create a new collection and persist it to localStorage
   */
  create(name: string, cats: Cat[] = []): MeowbaseResult<Collection> {
    if (cats.length > this.config.maxCollectionSize) {
      return {
        success: false,
        message: `Collection size (${cats.length}) exceeds maximum allowed size (${this.config.maxCollectionSize})`,
      };
    }

    const collection: Collection = {
      id: generateUUID(),
      name,
      children: cats,
    };

    return this.storage.create(collection);
  }

  /**
   * Load a collection into memory
   */
  load(identifier: string): MeowbaseResult<Collection> {
    // Check if already loaded
    const cached = this.cache.find(identifier);
    if (cached) {
      return {
        success: true,
        data: cached.collection,
      };
    }

    // Get from storage
    const result = this.storage.read(identifier);
    if (!result.success) {
      return result;
    }

    // Add to cache (cache handles eviction automatically)
    const collection = result.data!;
    this.cache.set(collection);

    return {
      success: true,
      data: collection,
      message: `Collection "${collection.name}" loaded into memory`,
    };
  }

  /**
   * Load multiple collections into memory
   */
  loadMany(identifiers: string[]): MeowbaseResult<Collection[]> {
    const loadedCollections: Collection[] = [];
    const errors: string[] = [];

    for (const identifier of identifiers) {
      const result = this.load(identifier);
      if (result.success) {
        loadedCollections.push(result.data!);
      } else {
        errors.push(`${identifier}: ${result.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: `Failed to load some collections: ${errors.join(
          "; "
        )}`,
      };
    }

    return {
      success: true,
      data: loadedCollections,
    };
  }

  /**
   * Save a loaded collection back to localStorage
   */
  save(identifier: string): MeowbaseResult {
    const metadata = this.cache.find(identifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${identifier}" is not loaded in memory`,
      };
    }

    if (
      metadata.collection.children.length >
      this.config.maxCollectionSize
    ) {
      return {
        success: false,
        message: `Collection size (${metadata.collection.children.length}) exceeds maximum allowed size (${this.config.maxCollectionSize})`,
      };
    }

    const result = this.storage.update(metadata.collection);

    if (result.success) {
      this.cache.markClean(metadata.collection.id);
    }

    return result;
  }

  /**
   * Save all dirty collections to localStorage
   */
  flush(): MeowbaseResult {
    const dirtyCollections = this.cache.getDirty();
    const errors: string[] = [];
    let savedCount = 0;

    for (const metadata of dirtyCollections) {
      if (
        metadata.collection.children.length >
        this.config.maxCollectionSize
      ) {
        errors.push(
          `${metadata.collection.name}: exceeds max size (${metadata.collection.children.length}/${this.config.maxCollectionSize})`
        );
        continue;
      }

      const result = this.storage.update(metadata.collection);
      if (result.success) {
        this.cache.markClean(metadata.collection.id);
        savedCount++;
      } else {
        errors.push(`${metadata.collection.name}: ${result.message}`);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: `Saved ${savedCount} collections, but failed to save some: ${errors.join(
          "; "
        )}`,
      };
    }

    return {
      success: true,
      message: `Flushed ${savedCount} collection(s) to localStorage`,
    };
  }

  /**
   * Unload a collection from memory
   */
  unload(identifier: string): MeowbaseResult {
    const metadata = this.cache.find(identifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${identifier}" is not loaded in memory`,
      };
    }

    if (metadata.isDirty) {
      return {
        success: false,
        message: `Collection "${metadata.collection.name}" has unsaved changes. Call save() first or changes will be lost.`,
      };
    }

    this.cache.remove(metadata.collection.id);

    return {
      success: true,
      message: `Collection unloaded from memory`,
    };
  }

  /**
   * Unload all collections from memory
   */
  unloadAll(): MeowbaseResult {
    const dirtyCollections = this.cache
      .getDirty()
      .map((m) => m.collection.name);

    if (dirtyCollections.length > 0) {
      return {
        success: false,
        message: `Cannot unload all: ${
          dirtyCollections.length
        } collection(s) have unsaved changes: ${dirtyCollections.join(
          ", "
        )}`,
      };
    }

    this.cache.clear();

    return {
      success: true,
      message: `All collections unloaded from memory`,
    };
  }

  /**
   * Delete a collection from localStorage
   */
  delete(identifier: string): MeowbaseResult {
    const result = this.storage.delete(identifier);

    // Also remove from cache if present
    if (result.success) {
      const key = this.storage.findKey(identifier);
      if (key) {
        const collectionId = this.storage.extractIdFromKey(key);
        this.cache.remove(collectionId);
      }
    }

    return result;
  }

  /**
   * Get a collection from storage without loading into memory
   */
  get(identifier: string): MeowbaseResult<Collection> {
    return this.storage.read(identifier);
  }

  /**
   * List all collections in storage
   */
  list(): MeowbaseResult<
    Array<{ id: string; name: string; catCount: number }>
  > {
    return this.storage.list();
  }

  /**
   * Get list of currently loaded collections
   */
  getLoaded(): Array<{
    id: string;
    name: string;
    isDirty: boolean;
    lastAccessed: number;
  }> {
    return this.cache.getAll().map((metadata) => ({
      id: metadata.collection.id,
      name: metadata.collection.name,
      isDirty: metadata.isDirty,
      lastAccessed: metadata.lastAccessed,
    }));
  }

  /**
   * Check if a collection is currently loaded in memory
   */
  isLoaded(identifier: string): boolean {
    return this.cache.find(identifier) !== null;
  }

  /**
   * Get the size of a collection without loading it
   */
  getSize(identifier: string): MeowbaseResult<number> {
    const result = this.storage.read(identifier);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data!.children.length,
    };
  }
}
