/**
 * Seed generation, parsing, and serialization utilities
 */

import type {
  CatSettings,
  ProtoCat,
  CatSize,
  CatPattern,
  FurLength,
  HatType,
  AppearanceData,
} from "../types/index.js";
import { normalizeColor } from "./color-utils.js";
import { validateCatSettings } from "./validation.js";

/**
 * Seed data structure for base64 JSON encoding
 */
interface SeedData {
  id: string;
  color: string;
  eyeColor: string;
  pattern: CatPattern;
  size: CatSize;
  furLength: FurLength;
  accessories?: {
    hat?: {
      type: HatType;
      baseColor: string;
      accentColor: string;
    };
  };
  version: string;
}

/**
 * Generates a base64-encoded JSON seed string containing all cat data
 */
export function generateSeed(
  settings: CatSettings,
  id: string,
  appearance?: AppearanceData
): string {
  const seedData: SeedData = {
    id,
    color: normalizeColor(settings.color),
    eyeColor: normalizeColor(settings.eyeColor),
    pattern: settings.pattern,
    size: settings.size,
    furLength: settings.furLength,
    version: "v2",
  };

  // Add accessories if present
  if (appearance?.accessories?.hat) {
    seedData.accessories = {
      hat: {
        type: appearance.accessories.hat.type,
        baseColor: normalizeColor(
          appearance.accessories.hat.baseColor
        ),
        accentColor: normalizeColor(
          appearance.accessories.hat.accentColor
        ),
      },
    };
  }

  // Encode as base64 (URL-safe)
  const json = JSON.stringify(seedData);
  return btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Parses a base64-encoded JSON seed string back into CatSettings, ID, and accessories
 */
export function parseSeed(seed: string): {
  settings: CatSettings;
  id: string;
  accessories?: {
    hat?: {
      type: HatType;
      baseColor: string;
      accentColor: string;
    };
  };
} {
  try {
    // Decode base64 (reverse URL-safe substitution)
    const base64 = seed.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = atob(padded);
    const data: SeedData = JSON.parse(json);

    // Validate version
    if (data.version !== "v2") {
      throw new Error(`Unsupported seed version: ${data.version}`);
    }

    const settings: CatSettings = {
      color: `#${data.color}`,
      eyeColor: `#${data.eyeColor}`,
      pattern: data.pattern,
      size: data.size,
      furLength: data.furLength,
    };

    // Validate the parsed settings
    const validation = validateCatSettings(settings);
    if (!validation.valid) {
      throw new Error(
        `Invalid seed: ${validation.errors.join(", ")}`
      );
    }

    return {
      settings,
      id: data.id,
      accessories: data.accessories,
    };
  } catch (e) {
    throw new Error(
      `Failed to parse seed: ${e instanceof Error ? e.message : e}`
    );
  }
}

/**
 * Converts ProtoCat to minimal JSON for storage
 * Includes accessories if present
 */
export function serializeCat(cat: ProtoCat): string {
  // Store seed, metadata, and accessories
  const minimal: any = {
    id: cat.id,
    seed: cat.seed,
    metadata: {
      createdAt: cat.metadata.createdAt.toISOString(),
      version: cat.metadata.version,
    },
  };

  // Include accessories if present
  if (cat.appearance.accessories) {
    minimal.accessories = cat.appearance.accessories;
  }

  return JSON.stringify(minimal);
}
