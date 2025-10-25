import type {
  Collection,
  Cat,
  MeowbaseConfig,
  MeowbaseResult,
} from "../types.js";
import { CollectionCache } from "./cache.js";
import type { IStorageAdapter } from "../storage/adapter-interface.js";
import { generateUUID } from "../core/utils.js";

/**
 * High-level collection operations that orchestrate between storage and cache
 */
export class CollectionOperations {
  private storage: IStorageAdapter;
  private cache: CollectionCache;
  private config: MeowbaseConfig;

  constructor(
    storage: IStorageAdapter,
    cache: CollectionCache,
    config: MeowbaseConfig
  ) {
    this.storage = storage;
    this.cache = cache;
    this.config = config;
  }

  /**
   * Create a new collection and persist it to storage
   */
  async create(
    name: string,
    cats: Cat[] = []
  ): Promise<MeowbaseResult<Collection>> {
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

    return await this.storage.create(collection);
  }

  /**
   * Load a collection into memory
   */
  async load(
    identifier: string
  ): Promise<MeowbaseResult<Collection>> {
    // Check if already loaded
    const cached = this.cache.find(identifier);
    if (cached) {
      return {
        success: true,
        data: cached.collection,
      };
    }

    // Get from storage
    const result = await this.storage.read(identifier);
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
  async loadMany(
    identifiers: string[]
  ): Promise<MeowbaseResult<Collection[]>> {
    const loadedCollections: Collection[] = [];
    const errors: string[] = [];

    for (const identifier of identifiers) {
      const result = await this.load(identifier);
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
   * Save a loaded collection back to storage
   */
  async save(identifier: string): Promise<MeowbaseResult> {
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

    const result = await this.storage.update(metadata.collection);

    if (result.success) {
      this.cache.markClean(metadata.collection.id);
    }

    return result;
  }

  /**
   * Save all dirty collections to storage
   */
  async flush(): Promise<MeowbaseResult> {
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

      const result = await this.storage.update(metadata.collection);
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
      message: `Flushed ${savedCount} collection(s) to storage`,
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
   * Delete a collection from storage
   */
  async delete(identifier: string): Promise<MeowbaseResult> {
    const result = await this.storage.delete(identifier);

    // Also remove from cache if present
    if (result.success) {
      const key = await this.storage.findKey(identifier);
      if (key) {
        // Extract ID from key format "meowbase-{id}"
        const collectionId = key.replace("meowbase-", "");
        this.cache.remove(collectionId);
      }
    }

    return result;
  }

  /**
   * Get a collection from storage without loading into memory
   */
  async get(identifier: string): Promise<MeowbaseResult<Collection>> {
    return await this.storage.read(identifier);
  }

  /**
   * List all collections in storage
   */
  async list(): Promise<
    MeowbaseResult<
      Array<{ id: string; name: string; catCount: number }>
    >
  > {
    return await this.storage.list();
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
  async getSize(identifier: string): Promise<MeowbaseResult<number>> {
    const result = await this.storage.read(identifier);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data!.children.length,
    };
  }
}
