/**
 * Cat management business logic
 */

import {
  getAllCats,
  createRandomCat,
  createCatFromSeed,
  destroyAllCats,
  getCatById,
  buildCatFromSeed,
} from "../../../../../meowzer/meowzer/meowzer.js";
import type { Meowbase, Cat } from "meowzer";

export interface CreateCatOptions {
  container: HTMLElement;
}

export interface LoadCatOptions {
  container: HTMLElement;
  name: string;
}

/**
 * Get current count of active cats
 */
export function getActiveCatCount(): number {
  return getAllCats().length;
}

/**
 * Create a random roaming cat
 */
export function createRandomRoamingCat(
  options: CreateCatOptions
): ReturnType<typeof createRandomCat> {
  return createRandomCat({
    container: options.container,
  });
}

/**
 * Create cat object for database storage
 */
export function createCatRecord(meowzerCat: {
  id: string;
  name?: string;
  seed: string;
}) {
  return {
    id: meowzerCat.id,
    name: meowzerCat.name || "Unknown Cat",
    image: meowzerCat.seed,
    birthday: new Date(),
    favoriteToy: {
      id: crypto.randomUUID(),
      name: "Random Toy",
      image: "🎾",
      type: "toy",
      description: "A randomly selected toy",
    },
    description: "A randomly generated roaming cat",
    currentEmotion: {
      id: crypto.randomUUID(),
      name: "Curious",
    },
    importantHumans: [],
  };
}

/**
 * Ensure collection exists in database
 */
export async function ensureCollectionExists(
  db: Meowbase,
  collectionName: string
): Promise<void> {
  const loadResult = await db.loadCollection(collectionName);

  if (!loadResult.success) {
    await db.createCollection(collectionName, []);
    await db.loadCollection(collectionName);
  }
}

/**
 * Save cat to database collection
 */
export async function saveCatToDatabase(
  db: Meowbase,
  collectionName: string,
  catRecord: ReturnType<typeof createCatRecord>
): Promise<void> {
  await ensureCollectionExists(db, collectionName);
  db.addCatToCollection(collectionName, catRecord);
  await db.saveCollection(collectionName);
}

/**
 * Load saved cats from database
 */
export async function loadSavedCats(
  db: Meowbase,
  collectionName: string
): Promise<Cat[]> {
  try {
    const loadResult = await db.loadCollection(collectionName);
    if (loadResult.success) {
      const collectionResult = await db.getCollection(collectionName);
      if (collectionResult.success && collectionResult.data) {
        return collectionResult.data.children;
      }
    }
    return [];
  } catch (error) {
    console.error("Failed to load saved cats:", error);
    return [];
  }
}

/**
 * Check if cat is currently loaded
 */
export function isCatLoaded(catId: string): boolean {
  return getCatById(catId) !== null;
}

/**
 * Check if cat is paused
 */
export function isCatPaused(catId: string): boolean {
  const cat = getCatById(catId);
  return cat ? !cat.isActive : false;
}

/**
 * Load a cat from seed
 */
export function loadCatFromSeed(
  seed: string,
  options: LoadCatOptions
): void {
  createCatFromSeed(seed, {
    container: options.container,
    name: options.name,
  });
}

/**
 * Focus on a cat (scroll into view)
 */
export function focusOnCat(catId: string): void {
  const cat = getCatById(catId);
  if (cat) {
    cat.element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

/**
 * Pause a cat
 */
export function pauseCat(catId: string): void {
  const cat = getCatById(catId);
  if (cat) {
    cat.pause();
  }
}

/**
 * Resume a cat
 */
export function resumeCat(catId: string): void {
  const cat = getCatById(catId);
  if (cat) {
    cat.resume();
  }
}

/**
 * Delete a cat from database and DOM
 */
export async function deleteCat(
  db: Meowbase,
  collectionName: string,
  catId: string
): Promise<void> {
  // Remove from database
  db.removeCatFromCollection(collectionName, catId);
  await db.saveCollection(collectionName);

  // Remove from DOM if loaded
  const cat = getCatById(catId);
  if (cat) {
    cat.destroy();
  }
}

/**
 * Destroy all active cats
 */
export function destroyAll(): void {
  destroyAllCats();
}

/**
 * Generate SVG preview for a cat
 */
export function generateCatPreview(cat: Cat): string {
  try {
    const seed = cat.image;
    if (!seed) {
      return "🐱";
    }

    const protoCat = buildCatFromSeed(seed);

    const svg = protoCat.spriteData.svg
      .replace(/width="100"/, 'width="40"')
      .replace(/height="100"/, 'height="40"')
      .replace(/viewBox="[^"]*"/, 'viewBox="0 0 100 100"');

    return svg;
  } catch (e) {
    console.error("Failed to generate preview:", e);
    return "🐱";
  }
}
