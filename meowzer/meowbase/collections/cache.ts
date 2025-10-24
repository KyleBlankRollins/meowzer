import type {
  Collection,
  LoadedCollectionMetadata,
} from "../types.js";

/**
 * LRU cache for managing loaded collections in memory
 */
export class CollectionCache {
  private cache: Map<string, LoadedCollectionMetadata>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get a collection from the cache
   * Updates lastAccessed timestamp
   */
  get(collectionId: string): LoadedCollectionMetadata | null {
    const metadata = this.cache.get(collectionId);

    if (metadata) {
      metadata.lastAccessed = Date.now();
      return metadata;
    }

    return null;
  }

  /**
   * Find a collection by ID or name
   * Updates lastAccessed timestamp
   */
  find(identifier: string): LoadedCollectionMetadata | null {
    // Try by ID first
    const byId = this.cache.get(identifier);
    if (byId) {
      byId.lastAccessed = Date.now();
      return byId;
    }

    // Try by name
    for (const metadata of this.cache.values()) {
      if (metadata.collection.name === identifier) {
        metadata.lastAccessed = Date.now();
        return metadata;
      }
    }

    return null;
  }

  /**
   * Add a collection to the cache
   * Automatically evicts LRU if at max capacity
   */
  set(collection: Collection): void {
    // Check if we need to evict
    if (
      this.cache.size >= this.maxSize &&
      !this.cache.has(collection.id)
    ) {
      this.evictLRU();
    }

    this.cache.set(collection.id, {
      collection,
      lastAccessed: Date.now(),
      isDirty: false,
    });
  }

  /**
   * Mark a collection as dirty (has unsaved changes)
   */
  markDirty(collectionId: string): boolean {
    const metadata = this.cache.get(collectionId);
    if (metadata) {
      metadata.isDirty = true;
      return true;
    }
    return false;
  }

  /**
   * Mark a collection as clean (saved)
   */
  markClean(collectionId: string): boolean {
    const metadata = this.cache.get(collectionId);
    if (metadata) {
      metadata.isDirty = false;
      return true;
    }
    return false;
  }

  /**
   * Remove a collection from cache
   */
  remove(collectionId: string): boolean {
    return this.cache.delete(collectionId);
  }

  /**
   * Check if a collection is in the cache
   */
  has(collectionId: string): boolean {
    return this.cache.has(collectionId);
  }

  /**
   * Get all dirty collections
   */
  getDirty(): LoadedCollectionMetadata[] {
    return Array.from(this.cache.values()).filter((m) => m.isDirty);
  }

  /**
   * Get all loaded collections
   */
  getAll(): LoadedCollectionMetadata[] {
    return Array.from(this.cache.values());
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Evict the least recently used collection
   * Returns the evicted metadata for potential auto-save
   */
  private evictLRU(): LoadedCollectionMetadata | null {
    let lruKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [collectionId, metadata] of this.cache) {
      if (metadata.lastAccessed < oldestAccess) {
        oldestAccess = metadata.lastAccessed;
        lruKey = collectionId;
      }
    }

    if (lruKey) {
      const metadata = this.cache.get(lruKey)!;
      this.cache.delete(lruKey);
      return metadata;
    }

    return null;
  }
}
