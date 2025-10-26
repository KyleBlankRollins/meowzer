/**
 * Storage and collection types
 */

/**
 * Collection metadata
 */
export interface CollectionInfo {
  id: string;
  name: string;
  catCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  init(): Promise<void>;
  saveCat(cat: any, collection: string): Promise<void>;
  loadCat(id: string): Promise<any>;
  deleteCat(id: string): Promise<void>;
  listCollections(): Promise<CollectionInfo[]>;
  deleteCollection(name: string): Promise<void>;
}

/**
 * Options for batch save operations
 */
export interface SaveManyOptions {
  collection?: string;
  overwrite?: boolean;
}

/**
 * Options for collection operations
 */
export interface CollectionOptions {
  name?: string;
  limit?: number;
  offset?: number;
}
