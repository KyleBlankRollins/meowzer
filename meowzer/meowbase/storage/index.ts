/**
 * Storage layer exports
 */

export type { IStorageAdapter } from "./adapter-interface.js";
export { IndexedDBAdapter } from "./indexeddb-adapter.js";
export { StorageAdapter } from "../collections/storage.js";
export {
  MEOWBASE_SCHEMA,
  applyMeowbaseSchema,
  type StoreNames,
  type StoreRecord,
  type StoreIndexes,
  type CatStorageRecord,
  type CollectionMetadata,
  type CollectionInfo,
} from "./schema.js";
