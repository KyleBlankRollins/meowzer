/**
 * Meowkit - Cat character creation library
 * Transforms user settings into ProtoCat objects with SVG sprites
 *
 * This file maintained for any direct imports.
 * All implementations moved to focused modules.
 */

// Re-export everything from the new modular structure
export { validateCatSettings as validateSettings } from "./validation.js";
export {
  generateSeed,
  parseSeed,
  serializeCat,
} from "./serialization.js";
export { buildCat, buildCatFromSeed, CatBuilder } from "./builder.js";

// Export deserializeCat from index to handle circular dependency
export { deserializeCat } from "./index.js";
