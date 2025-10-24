/**
 * Cat Registry - Internal tracking of all active cats
 *
 * Maintains a map of all MeowzerCat instances by ID
 * Provides efficient lookup and management of cats
 */

import type { MeowzerCat } from "./meowzer-cat.js";

class CatRegistry {
  private _cats: Map<string, MeowzerCat> = new Map();

  /**
   * Register a new cat
   */
  register(cat: MeowzerCat): void {
    if (this._cats.has(cat.id)) {
      throw new Error(`Cat with ID ${cat.id} is already registered`);
    }
    this._cats.set(cat.id, cat);
  }

  /**
   * Unregister a cat (called when destroyed)
   */
  unregister(id: string): void {
    this._cats.delete(id);
  }

  /**
   * Get a cat by ID
   */
  get(id: string): MeowzerCat | undefined {
    return this._cats.get(id);
  }

  /**
   * Get all active cats
   */
  getAll(): MeowzerCat[] {
    return Array.from(this._cats.values());
  }

  /**
   * Check if a cat is registered
   */
  has(id: string): boolean {
    return this._cats.has(id);
  }

  /**
   * Get number of active cats
   */
  get size(): number {
    return this._cats.size;
  }

  /**
   * Clear all cats (for cleanup)
   */
  clear(): void {
    // Destroy all cats before clearing
    this._cats.forEach((cat) => cat.destroy());
    this._cats.clear();
  }
}

// Singleton instance
export const catRegistry = new CatRegistry();
