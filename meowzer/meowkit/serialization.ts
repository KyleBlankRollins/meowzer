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
 * Generates a compact seed string from CatSettings and optional appearance data
 * Format without hat: pattern-color-eyeColor-size-furLength-v1
 * Format with hat: pattern-color-eyeColor-size-furLength-hatType-hatBase-hatAccent-v1
 */
export function generateSeed(
  settings: CatSettings,
  appearance?: AppearanceData
): string {
  const color = normalizeColor(settings.color);
  const eyeColor = normalizeColor(settings.eyeColor);
  const size = settings.size.charAt(0); // s, m, l

  // Check if there's hat data in appearance
  const hat = appearance?.accessories?.hat;

  if (hat) {
    const hatBase = normalizeColor(hat.baseColor);
    const hatAccent = normalizeColor(hat.accentColor);
    return `${settings.pattern}-${color}-${eyeColor}-${size}-${settings.furLength}-${hat.type}-${hatBase}-${hatAccent}-v1`;
  }

  return `${settings.pattern}-${color}-${eyeColor}-${size}-${settings.furLength}-v1`;
}

/**
 * Parses a seed string back into CatSettings
 * Supports both old format (6 parts) and new format with hat (9 parts)
 */
export function parseSeed(seed: string): CatSettings {
  const parts = seed.split("-");

  // Validate format (6 parts without hat, 9 parts with hat)
  if (parts.length !== 6 && parts.length !== 9) {
    throw new Error("Invalid seed format: expected 6 or 9 parts");
  }

  const version = parts[parts.length - 1];

  if (version !== "v1") {
    throw new Error(`Unsupported seed version: ${version}`);
  }

  const [pattern, color, eyeColor, sizeChar, furLength] = parts;

  // Map size character back to full size
  const sizeMap: Record<string, CatSize> = {
    s: "small",
    m: "medium",
    l: "large",
  };

  const size = sizeMap[sizeChar];
  if (!size) {
    throw new Error(`Invalid size in seed: ${sizeChar}`);
  }

  const settings: CatSettings = {
    color: `#${color}`,
    eyeColor: `#${eyeColor}`,
    pattern: pattern as CatPattern,
    size,
    furLength: furLength as FurLength,
  };

  // Validate the parsed settings
  const validation = validateCatSettings(settings);
  if (!validation.valid) {
    throw new Error(`Invalid seed: ${validation.errors.join(", ")}`);
  }

  return settings;
}

/**
 * Parses hat data from a seed string if present
 * Returns undefined if seed doesn't contain hat data
 */
export function parseHatFromSeed(
  seed: string
):
  | { type: HatType; baseColor: string; accentColor: string }
  | undefined {
  const parts = seed.split("-");

  // No hat data if only 6 parts
  if (parts.length !== 9) {
    return undefined;
  }

  const [, , , , , hatType, hatBase, hatAccent] = parts;

  return {
    type: hatType as HatType,
    baseColor: `#${hatBase}`,
    accentColor: `#${hatAccent}`,
  };
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
