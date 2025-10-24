import type { Collection, MeowbaseResult } from "../types.js";
import type { CollectionInfo } from "./schema.js";

/**
 * Storage adapter interface
 * Defines the contract that all storage implementations must follow
 *
 * This abstraction allows Meowbase to work with different storage backends
 * (localStorage, IndexedDB, etc.) while maintaining a consistent API
 */
export interface IStorageAdapter {
  /**
   * Initialize the storage adapter
   * For IndexedDB: Opens database connection and applies schema
   * For localStorage: No-op (always ready)
   */
  initialize(): Promise<void>;

  /**
   * Close the storage connection
   * For IndexedDB: Closes database connection
   * For localStorage: No-op
   */
  close(): Promise<void>;

  /**
   * Create a new collection with all its cats
   * @param collection - Full collection object with children array
   * @returns Result with created collection data
   */
  create(collection: Collection): Promise<MeowbaseResult<Collection>>;

  /**
   * Read a collection by ID or name, with all cats populated
   * @param identifier - Collection ID (UUID) or name
   * @returns Result with full collection including all cats
   */
  read(identifier: string): Promise<MeowbaseResult<Collection>>;

  /**
   * Update collection metadata and replace all cats
   * @param collection - Full collection object with updated data
   * @returns Result indicating success or failure
   */
  update(collection: Collection): Promise<MeowbaseResult>;

  /**
   * Delete a collection and all its cats
   * @param identifier - Collection ID or name
   * @returns Result indicating success or failure
   */
  delete(identifier: string): Promise<MeowbaseResult>;

  /**
   * Get metadata for all collections with cat counts
   * @returns Result with array of collection info
   */
  list(): Promise<MeowbaseResult<CollectionInfo[]>>;

  /**
   * Find the storage key for a collection
   * @param identifier - Collection ID or name
   * @returns Storage key string or null if not found
   */
  findKey(identifier: string): Promise<string | null>;
}
