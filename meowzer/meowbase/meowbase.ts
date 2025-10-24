import type {
  Collection,
  Cat,
  MeowbaseConfig,
  MeowbaseResult,
} from "./types.js";
import type { IStorageAdapter } from "./storage/adapter-interface.js";
import { IndexedDBAdapter } from "./storage/indexeddb-adapter.js";
import { CollectionCache } from "./collections/cache.js";
import { CollectionOperations } from "./collections/operations.js";
import { CatOperations } from "./cats/operations.js";
import { getSampleDataset } from "./core/sample-data.js";

/**
 * Meowbase - An IndexedDB wrapper that provides database operations
 * Main facade that orchestrates all operations
 */
export class Meowbase {
  private config: MeowbaseConfig;
  private storage: IStorageAdapter;
  private cache: CollectionCache;
  private collections: CollectionOperations;
  private cats: CatOperations;

  constructor(
    config?: Partial<MeowbaseConfig>,
    storage?: IStorageAdapter
  ) {
    this.config = {
      maxLoadedCollections: config?.maxLoadedCollections ?? 5,
      maxCollectionSize: config?.maxCollectionSize ?? 100,
    };

    // Initialize modules
    this.storage = storage ?? new IndexedDBAdapter();
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

  /**
   * Initialize the database connection
   * Must be called before any other operations
   */
  async initialize(): Promise<void> {
    await this.storage.initialize();
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await this.storage.close();
  }

  // ===== Collection Management Methods =====

  /**
   * Create a new collection and persist it to storage
   */
  async createCollection(
    name: string,
    cats: Cat[] = []
  ): Promise<MeowbaseResult<Collection>> {
    return await this.collections.create(name, cats);
  }

  /**
   * Load a collection into memory
   */
  async loadCollection(
    identifier: string
  ): Promise<MeowbaseResult<Collection>> {
    return await this.collections.load(identifier);
  }

  /**
   * Load multiple collections into memory
   */
  async loadCollections(
    identifiers: string[]
  ): Promise<MeowbaseResult<Collection[]>> {
    return await this.collections.loadMany(identifiers);
  }

  /**
   * Save a loaded collection back to storage
   */
  async saveCollection(identifier: string): Promise<MeowbaseResult> {
    return await this.collections.save(identifier);
  }

  /**
   * Save all dirty collections to storage
   */
  async flushChanges(): Promise<MeowbaseResult> {
    return await this.collections.flush();
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
   * Delete a collection from storage
   */
  async deleteCollection(
    identifier: string
  ): Promise<MeowbaseResult> {
    return await this.collections.delete(identifier);
  }

  /**
   * Get a collection from storage without loading it into memory
   */
  async getCollection(
    identifier: string
  ): Promise<MeowbaseResult<Collection>> {
    return await this.collections.get(identifier);
  }

  /**
   * List all collection IDs and names in storage
   */
  async listCollections(): Promise<
    MeowbaseResult<
      Array<{ id: string; name: string; catCount: number }>
    >
  > {
    return await this.collections.list();
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
  async getCollectionSize(
    identifier: string
  ): Promise<MeowbaseResult<number>> {
    return await this.collections.getSize(identifier);
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
   * Load sample dataset into storage
   * Clears all existing meowbase data and loads three collections:
   * - shelter: 5 cats waiting for adoption
   * - neighborhood: 4 community cats
   * - home: 6 owned indoor cats
   */
  async loadSampleData(): Promise<
    MeowbaseResult<{
      collectionsCreated: number;
      totalCats: number;
    }>
  > {
    try {
      // Unload all collections from memory
      this.cache.clear();

      // Clear all existing meowbase data from storage
      const listResult = await this.storage.list();
      if (listResult.success && listResult.data) {
        for (const info of listResult.data) {
          await this.storage.delete(info.id);
        }
      }

      // Load sample dataset
      const sampleCollections = getSampleDataset();
      let totalCats = 0;

      // Create each collection in storage
      for (const collection of sampleCollections) {
        const result = await this.storage.create(collection);
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
   * Clear all meowbase data from storage and memory
   */
  async clearAllData(): Promise<MeowbaseResult> {
    try {
      // Unload all collections from memory
      this.cache.clear();

      // Get list of all collections
      const listResult = await this.storage.list();
      if (!listResult.success) {
        return listResult;
      }

      // Delete each collection
      const collections = listResult.data || [];
      for (const info of collections) {
        await this.storage.delete(info.id);
      }

      return {
        success: true,
        message: `Cleared ${collections.length} collections from storage`,
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
