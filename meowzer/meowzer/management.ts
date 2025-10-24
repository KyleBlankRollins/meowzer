/**
 * Cat Management Functions
 *
 * Functions for managing and controlling active cats
 */

import { catRegistry } from "./registry.js";
import type { MeowzerCat } from "./meowzer-cat.js";

/**
 * Returns an array of all currently active cats
 */
export function getAllCats(): MeowzerCat[] {
  return catRegistry.getAll();
}

/**
 * Retrieves a specific cat by its unique ID
 */
export function getCatById(id: string): MeowzerCat | null {
  return catRegistry.get(id) || null;
}

/**
 * Removes all cats from the page and cleans up resources
 */
export function destroyAllCats(): void {
  catRegistry.clear();
}

/**
 * Pauses autonomous behavior for all cats
 */
export function pauseAllCats(): void {
  const cats = catRegistry.getAll();
  cats.forEach((cat) => cat.pause());
}

/**
 * Resumes autonomous behavior for all cats
 */
export function resumeAllCats(): void {
  const cats = catRegistry.getAll();
  cats.forEach((cat) => cat.resume());
}
