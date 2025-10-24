import type { Collection, MeowbaseResult } from "../types.js";

const NAMESPACE_PREFIX = "meowbase-";

/**
 * Storage adapter for localStorage operations
 * Pure functions with no side effects on memory state
 */
export class StorageAdapter {
  /**
   * Create a new collection in localStorage
   */
  create(collection: Collection): MeowbaseResult<Collection> {
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
  read(identifier: string): MeowbaseResult<Collection> {
    const key = this.findKey(identifier);

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
  update(collection: Collection): MeowbaseResult {
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
  delete(identifier: string): MeowbaseResult {
    const key = this.findKey(identifier);

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
  list(): MeowbaseResult<
    Array<{ id: string; name: string; catCount: number }>
  > {
    const collections: Array<{
      id: string;
      name: string;
      catCount: number;
    }> = [];

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
  findKey(identifier: string): string | null {
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
