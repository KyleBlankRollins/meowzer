import type { Collection, MeowbaseResult } from "../types.js";
import type { IStorageAdapter } from "./adapter-interface.js";
import {
  MEOWBASE_SCHEMA,
  applyMeowbaseSchema,
  type StoreRecord,
  type CatStorageRecord,
  type CollectionMetadata,
  type CollectionInfo,
} from "./schema.js";

const NAMESPACE_PREFIX = "meowbase-";

/**
 * IndexedDB storage adapter
 * Provides async, transactional storage for Meowbase collections
 */
export class IndexedDBAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null;

  /**
   * Initialize the database connection and apply schema
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(
        MEOWBASE_SCHEMA.name,
        MEOWBASE_SCHEMA.version
      );

      request.onerror = () => {
        reject(request.error);
      };
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

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Create a new collection with all its cats
   */
  async create(
    collection: Collection
  ): Promise<MeowbaseResult<Collection>> {
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

      // Store collection metadata (without children)
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

      if (
        error instanceof Error &&
        error.name === "ConstraintError"
      ) {
        return {
          success: false,
          message: `Collection with name "${collection.name}" already exists`,
        };
      }

      return {
        success: false,
        message: `Failed to create collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Read a collection by ID or name, with all cats populated
   */
  async read(
    identifier: string
  ): Promise<MeowbaseResult<Collection>> {
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
      let collectionData = await this.promisifyRequest<
        CollectionMetadata | undefined
      >(collectionsStore.get(identifier));

      // If not found by ID, search by name using index
      if (!collectionData) {
        const nameIndex = collectionsStore.index("name");
        collectionData = await this.promisifyRequest<
          CollectionMetadata | undefined
        >(nameIndex.get(identifier));
      }

      if (!collectionData) {
        return {
          success: false,
          message: `Collection "${identifier}" not found`,
        };
      }

      // Get all cats for this collection
      const collectionIdIndex = catsStore.index("collectionId");
      const cats = await this.promisifyRequest<CatStorageRecord[]>(
        collectionIdIndex.getAll(collectionData.id)
      );

      // Reconstruct full Collection object with children
      const collection: Collection = {
        id: collectionData.id,
        name: collectionData.name,
        children: cats.map(({ collectionId, ...cat }) => cat),
      };

      return {
        success: true,
        data: collection,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Update collection metadata and replace all cats
   */
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
        } satisfies StoreRecord<"collections">)
      );

      // Delete all existing cats for this collection
      const collectionIdIndex = catsStore.index("collectionId");
      const existingCats = await this.promisifyRequest<
        CatStorageRecord[]
      >(collectionIdIndex.getAll(collection.id));

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
        message: `Failed to update collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Delete a collection and all its cats (cascade delete)
   */
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
      await this.promisifyRequest(
        collectionsStore.delete(collectionId)
      );

      await this.commitTransaction(transaction);

      return {
        success: true,
        message: "Collection deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to delete collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Get metadata for all collections with cat counts
   */
  async list(): Promise<MeowbaseResult<CollectionInfo[]>> {
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

      const collections = await this.promisifyRequest<
        CollectionMetadata[]
      >(collectionsStore.getAll());

      const result: CollectionInfo[] = [];

      for (const collection of collections) {
        const collectionIdIndex = catsStore.index("collectionId");
        const catCount = await this.promisifyRequest<number>(
          collectionIdIndex.count(collection.id)
        );

        result.push({
          id: collection.id,
          name: collection.name,
          catCount,
        });
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to list collections: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Find the storage key for a collection
   */
  async findKey(identifier: string): Promise<string | null> {
    if (!this.db) {
      return null;
    }

    try {
      const transaction = this.db.transaction(
        ["collections"],
        "readonly"
      );
      const collectionsStore = transaction.objectStore("collections");

      // Try ID first
      const byId = await this.promisifyRequest<
        CollectionMetadata | undefined
      >(collectionsStore.get(identifier));
      if (byId) {
        return `${NAMESPACE_PREFIX}${byId.id}`;
      }

      // Try name
      const nameIndex = collectionsStore.index("name");
      const byName = await this.promisifyRequest<
        CollectionMetadata | undefined
      >(nameIndex.get(identifier));
      if (byName) {
        return `${NAMESPACE_PREFIX}${byName.id}`;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Convert IDBRequest to Promise
   */
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Helper: Wait for transaction to complete
   */
  private commitTransaction(
    transaction: IDBTransaction
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () =>
        reject(new Error("Transaction aborted"));
    });
  }
}
