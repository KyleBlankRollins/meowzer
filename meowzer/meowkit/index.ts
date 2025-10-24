/**
 * Meowkit - Cat character creation library
 * Main entry point
 */

export {
  buildCat,
  buildCatFromSeed,
  validateSettings,
  generateSeed,
  parseSeed,
  serializeCat,
  deserializeCat,
  CatBuilder,
} from "./meowkit.js";

export { generateCatSVG } from "./svg-generator.js";
export {
  generateId,
  darkenColor,
  lightenColor,
  randomColor,
} from "./utils.js";

// Re-export types from shared types file
export type {
  CatSettings,
  ProtoCat,
  AppearanceData,
  DimensionData,
  SpriteData,
  SVGElements,
  ViewBox,
  MetadataInfo,
  ValidationResult,
  CatPattern,
  CatSize,
  FurLength,
} from "../types.js";
