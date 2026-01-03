/**
 * Meowkit - Cat character creation library
 * Main entry point
 */

// Re-export validation
export { validateCatSettings } from "./validation.js";

// Re-export serialization
export {
  generateSeed,
  parseSeed,
  serializeCat,
} from "./serialization.js";

// Wrapper for deserializeCat that provides buildCatFromSeed
import { buildCatFromSeed } from "./builder.js";
import type { ProtoCat } from "../types/index.js";

export function deserializeCat(json: string): ProtoCat {
  const minimal = JSON.parse(json);
  const protoCat = buildCatFromSeed(minimal.seed);
  protoCat.id = minimal.id;
  protoCat.metadata.createdAt = new Date(minimal.metadata.createdAt);
  return protoCat;
}

// Re-export builder and main functions
export { buildCat, buildCatFromSeed } from "./builder.js";

// Re-export accessory functions
export { generateHatSVG } from "./accessories.js";

// Re-export color utilities
export { isValidColor, normalizeColor } from "./color-utils.js";

export { generateCatSVG } from "./svg-generator.js";
export { generateId } from "./utils.js";

// Re-export types from shared types package
export type {
  CatSettings,
  ProtoCat,
  AppearanceData,
  DimensionData,
  SpriteData,
  SVGElements,
  ViewBox,
  ValidationResult,
  CatPattern,
  CatSize,
  FurLength,
  HatType,
  HatData,
  HatAccessory,
  BaseAccessory,
  AccessorySettings,
} from "../types/index.js";
