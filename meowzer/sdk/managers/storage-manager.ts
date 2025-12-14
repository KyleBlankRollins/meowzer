import { Meowbase } from "../../meowbase/meowbase.js";
import { MeowzerCat } from "../meowzer-cat.js";
import { CatManager } from "./cat-manager.js";
import type { ConfigManager } from "../config.js";
import type { HookManager } from "./hook-manager.js";
import { LifecycleHook } from "./hook-manager.js";
import {
  StorageError,
  NotFoundError,
  CollectionError,
  InitializationError,
} from "../errors.js";
import type { Cat as MeowbaseCat } from "../../meowbase/types.js";

/**
 * Options for saving a cat
 */
export interface SaveCatOptions {
  collection?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Options for loading a cat
 */
export interface LoadCatOptions {
  autoStart?: boolean;
  container?: HTMLElement;
}

/**
 * Options for loading a collection
 */
export interface LoadCollectionOptions {
  filter?: (cat: MeowbaseCat) => boolean;
  limit?: number;
}

/**
 * Collection information
 */
export interface CollectionInfo {
  id: string;
  name: string;
  catCount: number;
}

/**
 * StorageManager wraps Meowbase with an ergonomic API
 *
 * Handles all persistence operations for cats and collections,
 * abstracting away the Result pattern and Meowbase internals.
 */
export class StorageManager {
  private meowbase: Meowbase;
  private catManager: CatManager;
  private hooks: HookManager;
  private initialized = false;
  private defaultCollection: string;

  constructor(
    catManager: CatManager,
    config: ConfigManager,
    hooks: HookManager
  ) {
    this.catManager = catManager;
    this.hooks = hooks;
    this.meowbase = new Meowbase({
      maxLoadedCollections: config.get().storage.cacheSize,
    });
    this.defaultCollection = config.get().storage.defaultCollection;
  }

  /**
   * Initialize storage connection
   * @internal - Called by Meowzer.init()
   */
  async _initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.meowbase.initialize();
      this.initialized = true;
    } catch (error) {
      throw new InitializationError("Failed to initialize storage", {
        component: "StorageManager",
        phase: "storage",
        details: error,
      });
    }
  }

  /**
   * Check if storage is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Close storage connection
   * @internal - Called by Meowzer.destroy()
   */
  async _close(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.meowbase.close();
      this.initialized = false;
    } catch (error) {
      throw new StorageError("Failed to close storage", {
        operation: "close",
        details: error,
      });
    }
  }

  // ============================================================================
  // CAT OPERATIONS
  // ============================================================================

  /**
   * Save a cat to storage
   *
   * @example
   * ```ts
   * await storage.saveCat(cat);
   * await storage.saveCat(cat, { collection: "favorites" });
   * ```
   */
  async saveCat(
    cat: MeowzerCat,
    options?: SaveCatOptions
  ): Promise<void> {
    this._ensureInitialized();

    // Skip save if cat hasn't changed (dirty flag optimization)
    if (!cat._needsSave) {
      return;
    }

    // Trigger beforeSave hook
    await this.hooks._trigger(LifecycleHook.BEFORE_SAVE, {
      cat,
      options,
    });

    const collectionName =
      options?.collection ?? this.defaultCollection;

    try {
      // Ensure collection exists and is loaded
      await this._ensureCollectionLoaded(collectionName);

      // Convert MeowzerCat to Meowbase Cat format
      const meowbaseCat: MeowbaseCat = {
        id: cat.id,
        name: cat.name || "Unnamed",
        image: cat.seed,
        birthday: cat.createdAt,
        description: cat.description || "",
        favoriteToy: {
          id: "default-toy",
          name: "String",
          image: "",
          type: "toy",
          description: "A simple string",
        },
        currentEmotion: {
          id: "content",
          name: "Content",
        },
        importantHumans: [],
        // Persist appearance data (colors, patterns, accessories like hats)
        appearance: cat.getAppearance(),
        ...options?.metadata,
      };

      // Check if cat already exists in collection to determine add vs update
      const isUpdate =
        cat.persistence.collectionName === collectionName;

      // Add or update cat in collection
      const result = isUpdate
        ? this.meowbase.updateCatInCollection(
            collectionName,
            meowbaseCat
          )
        : this.meowbase.addCatToCollection(
            collectionName,
            meowbaseCat
          );

      if (!result.success) {
        throw new StorageError(result.message, {
          operation: "write",
          storageType: "indexeddb",
          itemId: cat.id,
        });
      }

      // Save collection to persist changes
      const saveResult = await this.meowbase.saveCollection(
        collectionName
      );

      if (!saveResult.success) {
        throw new StorageError(saveResult.message, {
          operation: "write",
          storageType: "indexeddb",
          itemId: cat.id,
        });
      }

      // Update cat's internal collection reference
      cat._setCollectionName(collectionName);

      // Mark cat as clean (just saved)
      cat._markClean();

      // Trigger afterSave hook
      await this.hooks._trigger(LifecycleHook.AFTER_SAVE, {
        cat,
        options,
      });
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError("Failed to save cat", {
        operation: "write",
        itemId: cat.id,
        details: error,
      });
    }
  }

  /**
   * Save multiple cats to storage
   *
   * @example
   * ```ts
   * await storage.saveMany([cat1, cat2, cat3], { collection: "batch" });
   * ```
   */
  async saveMany(
    cats: MeowzerCat[],
    options?: SaveCatOptions
  ): Promise<void> {
    this._ensureInitialized();

    for (const cat of cats) {
      await this.saveCat(cat, options);
    }
  }

  /**
   * Save all cats currently managed by CatManager
   * Only saves cats with unsaved changes (dirty flag optimization)
   *
   * @example
   * ```ts
   * await storage.saveAll();
   * ```
   */
  async saveAll(options?: SaveCatOptions): Promise<void> {
    const cats = this.catManager.getAll();
    // Only save dirty cats
    const dirtyCats = cats.filter((cat) => cat._needsSave);

    if (dirtyCats.length === 0) {
      return; // Early exit if nothing to save
    }

    await this.saveMany(dirtyCats, options);
  }

  /**
   * Load a cat from storage by ID
   *
   * @example
   * ```ts
   * const cat = await storage.loadCat("cat-123");
   * ```
   */
  async loadCat(catId: string): Promise<MeowzerCat> {
    this._ensureInitialized();

    // Search all collections for the cat
    const collections = await this.listCollections();

    for (const collection of collections) {
      const result = await this.meowbase.loadCollection(
        collection.id
      );

      if (result.success && result.data) {
        const meowbaseCat = result.data.children.find(
          (c) => c.id === catId
        );

        if (meowbaseCat) {
          // Create MeowzerCat from Meowbase data
          const cat = await this.catManager.create({
            seed: meowbaseCat.image,
            name: meowbaseCat.name,
            description: meowbaseCat.description,
          });

          // Restore appearance data if it was saved (includes accessories like hats)
          if (meowbaseCat.appearance) {
            cat.setAppearance(meowbaseCat.appearance);
          }

          // Set collection reference
          cat._setCollectionName(collection.id);

          // Mark as clean since it's just loaded from storage
          cat._markClean();

          // Trigger afterLoad hook
          await this.hooks._trigger(LifecycleHook.AFTER_LOAD, {
            cat,
            catId,
          });

          return cat;
        }
      }
    }

    throw new NotFoundError(
      `Cat with id "${catId}" not found in storage`,
      {
        resourceType: "cat",
        resourceId: catId,
      }
    );
  }

  /**
   * Load all cats from a collection
   *
   * @example
   * ```ts
   * const cats = await storage.loadCollection("my-cats");
   * const filtered = await storage.loadCollection("my-cats", {
   *   filter: (cat) => cat.name.startsWith("F"),
   *   limit: 10
   * });
   * ```
   */
  async loadCollection(
    collectionName: string,
    options?: LoadCollectionOptions
  ): Promise<MeowzerCat[]> {
    this._ensureInitialized();

    try {
      const result = await this.meowbase.loadCollection(
        collectionName
      );

      if (!result.success || !result.data) {
        throw new NotFoundError(
          `Collection "${collectionName}" not found`,
          {
            resourceType: "collection",
            resourceId: collectionName,
          }
        );
      }

      let meowbaseCats = result.data.children;

      // Apply filter if provided
      if (options?.filter) {
        meowbaseCats = meowbaseCats.filter(options.filter);
      }

      // Apply limit if provided
      if (options?.limit && options.limit > 0) {
        meowbaseCats = meowbaseCats.slice(0, options.limit);
      }

      // Convert to MeowzerCat instances
      const cats: MeowzerCat[] = [];

      for (const meowbaseCat of meowbaseCats) {
        const cat = await this.catManager.create({
          id: meowbaseCat.id,
          seed: meowbaseCat.image,
          name: meowbaseCat.name,
          description: meowbaseCat.description,
        });

        // Restore appearance data if it was saved (includes accessories like hats)
        if (meowbaseCat.appearance) {
          cat.setAppearance(meowbaseCat.appearance);
        }

        cat._setCollectionName(collectionName);
        // Mark as clean since it's just loaded from storage
        cat._markClean();
        cats.push(cat);
      }

      return cats;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new StorageError("Failed to load collection", {
        operation: "read",
        details: error,
      });
    }
  }

  /**
   * Delete a cat from storage
   *
   * @example
   * ```ts
   * await storage.deleteCat("cat-123");
   * ```
   */
  async deleteCat(catId: string): Promise<void> {
    this._ensureInitialized();

    // Trigger beforeDelete hook
    await this.hooks._trigger(LifecycleHook.BEFORE_DELETE, { catId });

    // Find which collection contains the cat
    const collections = await this.listCollections();

    for (const collection of collections) {
      const result = await this.meowbase.loadCollection(
        collection.id
      );

      if (result.success && result.data) {
        const catExists = result.data.children.some(
          (c) => c.id === catId
        );

        if (catExists) {
          const removeResult = this.meowbase.removeCatFromCollection(
            collection.id,
            catId
          );

          if (!removeResult.success) {
            throw new StorageError(removeResult.message, {
              operation: "delete",
              itemId: catId,
            });
          }

          const saveResult = await this.meowbase.saveCollection(
            collection.id
          );

          if (!saveResult.success) {
            throw new StorageError(saveResult.message, {
              operation: "delete",
              itemId: catId,
            });
          }

          // Trigger afterDelete hook
          await this.hooks._trigger(LifecycleHook.AFTER_DELETE, {
            catId,
          });

          return;
        }
      }
    }

    throw new NotFoundError(
      `Cat with id "${catId}" not found in storage`,
      {
        resourceType: "cat",
        resourceId: catId,
      }
    );
  }

  /**
   * Delete multiple cats from storage
   */
  async deleteMany(catIds: string[]): Promise<void> {
    for (const catId of catIds) {
      await this.deleteCat(catId);
    }
  }

  // ============================================================================
  // COLLECTION OPERATIONS
  // ============================================================================

  /**
   * Create a new collection
   *
   * @example
   * ```ts
   * await storage.createCollection("My Cats");
   * ```
   */
  async createCollection(name: string): Promise<void> {
    this._ensureInitialized();

    try {
      const result = await this.meowbase.createCollection(name);

      if (!result.success) {
        throw new CollectionError(result.message, {
          collectionName: name,
          operation: "create",
        });
      }
    } catch (error) {
      if (error instanceof CollectionError) {
        throw error;
      }
      throw new CollectionError("Failed to create collection", {
        collectionName: name,
        operation: "create",
        details: error,
      });
    }
  }

  /**
   * List all collections
   *
   * @example
   * ```ts
   * const collections = await storage.listCollections();
   * collections.forEach(c => console.log(c.name, c.catCount));
   * ```
   */
  async listCollections(): Promise<CollectionInfo[]> {
    this._ensureInitialized();

    try {
      const result = await this.meowbase.listCollections();

      if (!result.success || !result.data) {
        throw new CollectionError("Failed to list collections", {
          collectionName: "",
          operation: "query",
        });
      }

      return result.data;
    } catch (error) {
      if (error instanceof CollectionError) {
        throw error;
      }
      throw new CollectionError("Failed to list collections", {
        collectionName: "",
        operation: "query",
        details: error,
      });
    }
  }

  /**
   * Get collection information
   *
   * @example
   * ```ts
   * const info = await storage.getCollectionInfo("my-cats");
   * console.log(info.catCount);
   * ```
   */
  async getCollectionInfo(name: string): Promise<CollectionInfo> {
    this._ensureInitialized();

    const collections = await this.listCollections();
    const collection = collections.find(
      (c) => c.name === name || c.id === name
    );

    if (!collection) {
      throw new NotFoundError(`Collection "${name}" not found`, {
        resourceType: "collection",
        resourceId: name,
      });
    }

    return collection;
  }

  /**
   * Delete a collection and all its cats
   *
   * @example
   * ```ts
   * await storage.deleteCollection("old-cats");
   * ```
   */
  async deleteCollection(name: string): Promise<void> {
    this._ensureInitialized();

    try {
      const result = await this.meowbase.deleteCollection(name);

      if (!result.success) {
        throw new CollectionError(result.message, {
          collectionName: name,
          operation: "delete",
        });
      }
    } catch (error) {
      if (error instanceof CollectionError) {
        throw error;
      }
      throw new CollectionError("Failed to delete collection", {
        collectionName: name,
        operation: "delete",
        details: error,
      });
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Ensure storage is initialized, throw if not
   * @private
   */
  private _ensureInitialized(): void {
    if (!this.initialized) {
      throw new InitializationError(
        "Storage not initialized. Call meowzer.init() first.",
        {
          component: "StorageManager",
          phase: "storage",
        }
      );
    }
  }

  /**
   * Ensure a collection exists and is loaded in memory
   * Creates it if it doesn't exist
   * @private
   */
  private async _ensureCollectionLoaded(name: string): Promise<void> {
    // Check if collection exists
    const collections = await this.listCollections();
    const exists = collections.some(
      (c) => c.name === name || c.id === name
    );

    if (!exists) {
      // Create collection if it doesn't exist
      await this.createCollection(name);
    }

    // Load collection if not already loaded
    if (!this.meowbase.isCollectionLoaded(name)) {
      const result = await this.meowbase.loadCollection(name);

      if (!result.success) {
        throw new CollectionError(
          `Failed to load collection "${name}"`,
          {
            collectionName: name,
            operation: "read",
          }
        );
      }
    }
  }
}
