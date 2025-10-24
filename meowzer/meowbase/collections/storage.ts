import type { Collection, MeowbaseResult } from "../types.js";
import type { IStorageAdapter } from "../storage/adapter-interface.js";
import type { CollectionInfo } from "../storage/schema.js";

const NAMESPACE_PREFIX = "meowbase-";

/**
 * Storage adapter for localStorage operations
 * Pure functions with no side effects on memory state
 */
export class StorageAdapter implements IStorageAdapter {
  /**
   * Initialize the storage adapter (no-op for localStorage)
   */
  async initialize(): Promise<void> {
    // localStorage is always ready
  }

  /**
   * Close the storage connection (no-op for localStorage)
   */
  async close(): Promise<void> {
    // localStorage doesn't need closing
  }
  /**
   * Create a new collection in localStorage
   */
  async create(
    collection: Collection
  ): Promise<MeowbaseResult<Collection>> {
    const key = `${NAMESPACE_PREFIX}${collection.id}`;

    if (localStorage.getItem(key)) {
      return {
        success: false,
        message: `Collection with id "${collection.id}" already exists`,
      };
    }

    try {
      const serialized = JSON.stringify(collection);
      localStorage.setItem(key, serialized);

      return {
        success: true,
        data: collection,
        message: `Collection "${collection.name}" created successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Read a collection from localStorage
   */
  async read(
    identifier: string
  ): Promise<MeowbaseResult<Collection>> {
    const key = await this.findKey(identifier);

    if (!key) {
      return {
        success: false,
        message: `Collection "${identifier}" not found in localStorage`,
      };
    }

    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) {
        return {
          success: false,
          message: `Collection data is empty`,
        };
      }

      const collection = JSON.parse(serialized) as Collection;
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
   * Update an existing collection in localStorage
   */
  async update(collection: Collection): Promise<MeowbaseResult> {
    const key = `${NAMESPACE_PREFIX}${collection.id}`;

    if (!localStorage.getItem(key)) {
      return {
        success: false,
        message: `Collection with id "${collection.id}" not found in localStorage`,
      };
    }

    try {
      const serialized = JSON.stringify(collection);
      localStorage.setItem(key, serialized);

      return {
        success: true,
        message: `Collection "${collection.name}" updated successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update collection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Delete a collection from localStorage
   */
  async delete(identifier: string): Promise<MeowbaseResult> {
    const key = await this.findKey(identifier);

    if (!key) {
      return {
        success: false,
        message: `Collection "${identifier}" not found in localStorage`,
      };
    }

    try {
      localStorage.removeItem(key);

      return {
        success: true,
        message: `Collection deleted successfully`,
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
   * List all collections in localStorage
   */
  async list(): Promise<MeowbaseResult<CollectionInfo[]>> {
    const collections: CollectionInfo[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(NAMESPACE_PREFIX)) {
          const serialized = localStorage.getItem(key);
          if (serialized) {
            const collection = JSON.parse(serialized) as Collection;
            collections.push({
              id: collection.id,
              name: collection.name,
              catCount: collection.children.length,
            });
          }
        }
      }

      return {
        success: true,
        data: collections,
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
   * Find the localStorage key for a collection by ID or name
   */
  async findKey(identifier: string): Promise<string | null> {
    // Try as ID first
    const keyById = `${NAMESPACE_PREFIX}${identifier}`;
    if (localStorage.getItem(keyById)) {
      return keyById;
    }

    // Search by name
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(NAMESPACE_PREFIX)) {
        const serialized = localStorage.getItem(key);
        if (serialized) {
          try {
            const collection = JSON.parse(serialized) as Collection;
            if (collection.name === identifier) {
              return key;
            }
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    return null;
  }

  /**
   * Get the ID from a localStorage key
   */
  extractIdFromKey(key: string): string {
    return key.replace(NAMESPACE_PREFIX, "");
  }
}
