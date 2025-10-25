/**
 * Cat creation business logic
 */

import type {
  Meowbase,
  ProtoCat,
  CatSettings,
  PersonalityPreset,
} from "meowzer";
import { createCat } from "meowzer";

export interface CatCreationData {
  protoCat: ProtoCat;
  name: string;
  description: string;
  settings: CatSettings;
}

export interface CatCreationOptions {
  makeRoaming?: boolean;
  personality?: PersonalityPreset;
  container?: HTMLElement;
}

/**
 * Create a cat object for database storage
 */
export function createCatObject(data: CatCreationData) {
  return {
    id: data.protoCat.id,
    name: data.name,
    image: data.protoCat.spriteData.svg,
    birthday: new Date(),
    favoriteToy: {
      id: crypto.randomUUID(),
      name: "Yarn Ball",
      image: "🧶",
      type: "toy",
      description: "A colorful ball of yarn",
    },
    description: data.description || `A ${data.settings.pattern} cat`,
    currentEmotion: {
      id: crypto.randomUUID(),
      name: "Happy",
    },
    importantHumans: [],
  };
}

/**
 * Save cat to database collection
 */
export async function saveCatToCollection(
  db: Meowbase,
  collectionName: string,
  catData: ReturnType<typeof createCatObject>
): Promise<{ success: boolean; message: string }> {
  try {
    const result = db.addCatToCollection(collectionName, catData);

    if (!result.success) {
      return result;
    }

    await db.saveCollection(collectionName);

    return {
      success: true,
      message: `Created ${catData.name}! 🎉`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating cat: ${error}`,
    };
  }
}

/**
 * Spawn a roaming cat in the viewport
 */
export function spawnRoamingCat(
  settings: CatSettings,
  options: CatCreationOptions = {}
): void {
  const playground = document.getElementById("cat-playground");
  const container = options.container || playground || document.body;

  createCat(settings, {
    container,
    personality: options.personality || "balanced",
    autoStart: true,
  });
}

/**
 * Initialize collection if it doesn't exist
 */
export async function ensureCollectionExists(
  db: Meowbase,
  collectionName: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const loadResult = await db.loadCollection(collectionName);

    if (!loadResult.success) {
      // Collection doesn't exist, create it
      const createResult = await db.createCollection(
        collectionName,
        []
      );

      if (!createResult.success) {
        return {
          success: false,
          message: `Error creating collection: ${createResult.message}`,
        };
      }

      // Load the newly created collection
      const secondLoadResult = await db.loadCollection(
        collectionName
      );

      if (!secondLoadResult.success) {
        return {
          success: false,
          message: `Error loading collection: ${secondLoadResult.message}`,
        };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Error initializing collection: ${error}`,
    };
  }
}
