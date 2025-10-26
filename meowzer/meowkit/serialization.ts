/**
 * Seed generation, parsing, and serialization utilities
 */

import type {
  CatSettings,
  ProtoCat,
  CatSize,
  CatPattern,
  FurLength,
} from "../types/index.js";
import { normalizeColor } from "./color-utils.js";
import { validateCatSettings } from "./validation.js";

/**
 * Generates a compact seed string from CatSettings
 * Format: pattern-color-eyeColor-size-furLength-v1
 */
export function generateSeed(settings: CatSettings): string {
  const color = normalizeColor(settings.color);
  const eyeColor = normalizeColor(settings.eyeColor);
  const size = settings.size.charAt(0); // s, m, l

  return `${settings.pattern}-${color}-${eyeColor}-${size}-${settings.furLength}-v1`;
}

/**
 * Parses a seed string back into CatSettings
 */
export function parseSeed(seed: string): CatSettings {
  const parts = seed.split("-");

  if (parts.length !== 6) {
    throw new Error("Invalid seed format");
  }

  const [pattern, color, eyeColor, sizeChar, furLength, version] =
    parts;

  if (version !== "v1") {
    throw new Error(`Unsupported seed version: ${version}`);
  }

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
 * Converts ProtoCat to minimal JSON for storage
 */
export function serializeCat(cat: ProtoCat): string {
  // Only store seed and metadata, SVG can be regenerated
  const minimal = {
    id: cat.id,
    seed: cat.seed,
    metadata: {
      createdAt: cat.metadata.createdAt.toISOString(),
      version: cat.metadata.version,
    },
  };

  return JSON.stringify(minimal);
}
