/**
 * Meowzer - High-level API wrapper for creating autonomous cats
 *
 * Main entry point that exports the complete public API
 */

// ============================================================================
// CREATION FUNCTIONS
// ============================================================================

export {
  createCat,
  createCatFromSeed,
  createRandomCat,
  setDefaultContainer,
  setDefaultBoundaries,
} from "./creation.js";

// ============================================================================
// WEB COMPONENTS
// ============================================================================

export { MeowtionContainer } from "../meowtion/moewtion-container/meowtion-container.js";
export {
  injectBaseStyles,
  CatAnimationManager,
} from "../meowtion/animations.js";

// ============================================================================
// MANAGEMENT FUNCTIONS
// ============================================================================

export {
  getAllCats,
  getCatById,
  destroyAllCats,
  pauseAllCats,
  resumeAllCats,
} from "./management.js";

// ============================================================================
// DATABASE FUNCTIONS
// ============================================================================

export {
  Meowbase,
  initializeDatabase,
  getDatabase,
  isDatabaseInitialized,
  closeDatabase,
  resetDatabase,
} from "./database.js";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export {
  getRandomSettings,
  validateSettings,
  getViewportBoundaries,
} from "./utils.js";

// ============================================================================
// MEOWKIT (CAT CREATION) FUNCTIONS
// ============================================================================

export {
  buildCat,
  buildCatFromSeed,
  serializeCat,
  deserializeCat,
  CatBuilder,
  validateSettings as validateCatSettings,
  generateSeed,
  parseSeed,
} from "../meowkit/meowkit.js";

export type { ProtoCat } from "../types.js";

// ============================================================================
// PERSONALITY UTILITIES
// ============================================================================

export {
  getPersonality,
  getPersonalityPresets,
} from "../meowbrain/personality.js";

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { MeowzerCat } from "./meowzer-cat.js";
export type {
  CatSettings,
  MeowzerOptions,
  Position,
  Boundaries,
  Personality,
  PersonalityPreset,
  Environment,
  MeowzerEvent,
  ValidationResult,
  CatPattern,
  CatSize,
  FurLength,
  BehaviorType,
} from "../types.js";

// Meowbase type exports
export type {
  Cat,
  Collection,
  MeowbaseConfig,
  MeowbaseResult,
} from "../meowbase/types.js";

export type { IStorageAdapter } from "../meowbase/storage/adapter-interface.js";

// ============================================================================
// INITIALIZATION
// ============================================================================

import { getAllCats } from "./management.js";
import { pauseAllCats, resumeAllCats } from "./management.js";

// Set up global cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const cats = getAllCats();
    cats.forEach((cat) => cat.pause());
  });

  // Pause cats when page is hidden (Page Visibility API)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAllCats();
    } else {
      resumeAllCats();
    }
  });
}
