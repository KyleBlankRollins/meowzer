import type {
  Cat,
  MeowbaseConfig,
  MeowbaseResult,
} from "../types.js";
import { CollectionCache } from "../collections/cache.js";

/**
 * Operations for managing cats within loaded collections
 */
export class CatOperations {
  private cache: CollectionCache;
  private config: MeowbaseConfig;

  constructor(cache: CollectionCache, config: MeowbaseConfig) {
    this.cache = cache;
    this.config = config;
  }

  /**
   * Find a cat within a loaded collection
   */
  find(
    collectionIdentifier: string,
    catIdentifier: string
  ): MeowbaseResult<Cat> {
    const metadata = this.cache.find(collectionIdentifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${collectionIdentifier}" is not loaded. Call load() first.`,
      };
    }

    const cat = metadata.collection.children.find(
      (c) => c.id === catIdentifier || c.name === catIdentifier
    );

    if (!cat) {
      return {
        success: false,
        message: `Cat "${catIdentifier}" not found in collection "${metadata.collection.name}"`,
      };
    }

    return {
      success: true,
      data: cat,
    };
  }

  /**
   * Add a cat to a loaded collection
   */
  add(collectionIdentifier: string, cat: Cat): MeowbaseResult {
    const metadata = this.cache.find(collectionIdentifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${collectionIdentifier}" is not loaded. Call load() first.`,
      };
    }

    if (
      metadata.collection.children.length >=
      this.config.maxCollectionSize
    ) {
      return {
        success: false,
        message: `Collection "${metadata.collection.name}" is at maximum capacity (${this.config.maxCollectionSize})`,
      };
    }

    // Check if cat already exists
    const exists = metadata.collection.children.some(
      (c) => c.id === cat.id
    );
    if (exists) {
      return {
        success: false,
        message: `Cat with id "${cat.id}" already exists in collection`,
      };
    }

    metadata.collection.children.push(cat);
    this.cache.markDirty(metadata.collection.id);

    return {
      success: true,
      message: `Cat "${cat.name}" added to collection "${metadata.collection.name}"`,
    };
  }

  /**
   * Remove a cat from a loaded collection
   */
  remove(
    collectionIdentifier: string,
    catIdentifier: string
  ): MeowbaseResult {
    const metadata = this.cache.find(collectionIdentifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${collectionIdentifier}" is not loaded. Call load() first.`,
      };
    }

    const initialLength = metadata.collection.children.length;
    metadata.collection.children =
      metadata.collection.children.filter(
        (c) => c.id !== catIdentifier && c.name !== catIdentifier
      );

    if (metadata.collection.children.length === initialLength) {
      return {
        success: false,
        message: `Cat "${catIdentifier}" not found in collection "${metadata.collection.name}"`,
      };
    }

    this.cache.markDirty(metadata.collection.id);

    return {
      success: true,
      message: `Cat removed from collection "${metadata.collection.name}"`,
    };
  }

  /**
   * Update a cat within a loaded collection
   */
  update(collectionIdentifier: string, cat: Cat): MeowbaseResult {
    const metadata = this.cache.find(collectionIdentifier);

    if (!metadata) {
      return {
        success: false,
        message: `Collection "${collectionIdentifier}" is not loaded. Call load() first.`,
      };
    }

    const index = metadata.collection.children.findIndex(
      (c) => c.id === cat.id
    );

    if (index === -1) {
      return {
        success: false,
        message: `Cat with id "${cat.id}" not found in collection "${metadata.collection.name}"`,
      };
    }

    metadata.collection.children[index] = cat;
    this.cache.markDirty(metadata.collection.id);

    return {
      success: true,
      message: `Cat "${cat.name}" updated in collection "${metadata.collection.name}"`,
    };
  }
}
