/**
 * CatPersistence Component
 *
 * Manages cat persistence operations: save, delete, and dirty tracking.
 * This component coordinates with StorageManager and HookManager for persistence.
 */

import type { SaveOptions } from "../../types/index.js";
import type { StorageManager } from "../managers/storage-manager.js";
import { EventEmitter } from "../../utilities/event-emitter.js";

export type PersistenceEvent = "saved" | "deleted" | "dirtyChanged";

export interface PersistenceEventData {
  catId: string;
  collectionName?: string;
}

/**
 * Component that manages cat persistence (save/delete/dirty tracking)
 */
export class CatPersistence extends EventEmitter<PersistenceEvent> {
  private catId: string;
  private getCatData: () => any; // Function to get current cat data for saving
  private storage: StorageManager;
  private _isDirty: boolean = true; // New cats are dirty by default
  private _collectionName?: string;

  constructor(
    catId: string,
    getCatData: () => any,
    storage: StorageManager
  ) {
    super();
    this.catId = catId;
    this.getCatData = getCatData;
    this.storage = storage;
  }

  /**
   * Get whether the cat has unsaved changes
   */
  get isDirty(): boolean {
    return this._isDirty;
  }

  /**
   * Get the collection name this cat belongs to (if any)
   */
  get collectionName(): string | undefined {
    return this._collectionName;
  }

  /**
   * Mark cat as dirty (needs to be saved)
   */
  markDirty(): void {
    if (!this._isDirty) {
      this._isDirty = true;
      this.emit("dirtyChanged", { catId: this.catId });
    }
  }

  /**
   * Mark cat as clean (just saved)
   * @internal
   */
  markClean(): void {
    if (this._isDirty) {
      this._isDirty = false;
      this.emit("dirtyChanged", { catId: this.catId });
    }
  }

  /**
   * Set the collection name this cat belongs to
   * @internal
   */
  setCollectionName(name: string): void {
    this._collectionName = name;
  }

  /**
   * Save the cat to storage
   *
   * @param options - Save options (collection name, etc.)
   *
   * @example
   * ```ts
   * await cat.persistence.save();
   * await cat.persistence.save({ collection: "favorites" });
   * ```
   *
   * @throws {StorageError} If save fails
   */
  async save(options?: SaveOptions): Promise<void> {
    const catData = this.getCatData();
    await this.storage.saveCat(catData, options);
    this.emit("saved", {
      catId: this.catId,
      collectionName: options?.collection || this._collectionName,
    });
  }

  /**
   * Delete the cat from storage
   * Note: This does NOT destroy the cat instance - caller must handle that
   *
   * @example
   * ```ts
   * await cat.persistence.delete();
   * cat.lifecycle.destroy(); // Caller's responsibility
   * ```
   *
   * @throws {StorageError} If delete fails
   */
  async delete(): Promise<void> {
    await this.storage.deleteCat(this.catId);
    this.emit("deleted", { catId: this.catId });
  }
}
