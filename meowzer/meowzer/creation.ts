/**
 * Cat Creation Functions
 *
 * High-level functions for creating MeowzerCat instances
 */

import { buildCat, buildCatFromSeed } from "../meowkit/meowkit.js";
import { Cat } from "../meowtion/cat.js";
import { createBrain } from "../meowbrain/index.js";
import { MeowzerCat } from "./meowzer-cat.js";
import { catRegistry } from "./registry.js";
import { getRandomSettings, getViewportBoundaries } from "./utils.js";
import type {
  CatSettings,
  MeowzerOptions,
  Position,
  Boundaries,
  PersonalityPreset,
  Personality,
} from "../types.js";

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Maximum cat sprite dimensions for boundary calculations
 * Cats have a 100x100px viewBox that can be scaled, but we use 80x80 as a safe
 * maximum to prevent overflow/scrolling (accounting for hitbox size from Meowkit)
 */
const CAT_WIDTH = 80;
const CAT_HEIGHT = 80;

// ============================================================================
// GLOBAL DEFAULTS
// ============================================================================

let defaultContainer: HTMLElement = document.body;
let defaultBoundaries: Boundaries = getViewportBoundaries();

export function setDefaultContainer(container: HTMLElement): void {
  defaultContainer = container;
}

export function setDefaultBoundaries(boundaries: Boundaries): void {
  // Adjust boundaries to account for cat size to prevent overflow
  defaultBoundaries = {
    minX: boundaries.minX ?? 0,
    minY: boundaries.minY ?? 0,
    maxX: (boundaries.maxX ?? window.innerWidth) - CAT_WIDTH,
    maxY: (boundaries.maxY ?? window.innerHeight) - CAT_HEIGHT,
  };
}

// ============================================================================
// CREATION FUNCTIONS
// ============================================================================

/**
 * Creates a new autonomous cat from user-defined settings
 */
export function createCat(
  settings: CatSettings,
  options: MeowzerOptions = {}
): MeowzerCat {
  // Generate ProtoCat from settings
  const protoCat = buildCat(settings);

  // Determine position
  const position: Position = options.position || _getRandomPosition();

  // Determine boundaries (adjust for cat size to prevent overflow)
  const boundaries: Boundaries = options.boundaries
    ? _adjustBoundariesForCatSize(options.boundaries)
    : defaultBoundaries;

  // Determine container
  const container: HTMLElement =
    options.container || defaultContainer;

  // Create animated Cat instance
  const cat = new Cat(protoCat, {
    container,
    initialPosition: position,
    initialState: options.autoStart !== false ? "idle" : "idle",
    boundaries,
  });

  // Determine personality
  const personality: Personality | PersonalityPreset =
    options.personality || "balanced";

  // Create Brain instance
  const brain = createBrain(cat, {
    personality,
    environment: {
      boundaries,
      ...options.environment,
    },
  });

  // Create MeowzerCat wrapper
  const meowzerCat = new MeowzerCat({
    id: protoCat.id,
    seed: protoCat.seed,
    cat,
    brain,
  });

  // Register cat
  catRegistry.register(meowzerCat);

  // Auto-start if requested (default: true)
  if (options.autoStart !== false) {
    meowzerCat.resume();
  }

  // Auto-cleanup on destroy
  meowzerCat.on("destroy", () => {
    catRegistry.unregister(meowzerCat.id);
  });

  return meowzerCat;
}

/**
 * Creates a cat from a seed string (for recreating or sharing cats)
 */
export function createCatFromSeed(
  seed: string,
  options: MeowzerOptions = {}
): MeowzerCat {
  // Create ProtoCat from seed
  const protoCat = buildCatFromSeed(seed);

  // Determine position
  const position: Position = options.position || _getRandomPosition();

  // Determine boundaries (adjust for cat size to prevent overflow)
  const boundaries: Boundaries = options.boundaries
    ? _adjustBoundariesForCatSize(options.boundaries)
    : defaultBoundaries;

  // Determine container
  const container: HTMLElement =
    options.container || defaultContainer;

  // Create animated Cat instance
  const cat = new Cat(protoCat, {
    container,
    initialPosition: position,
    initialState: options.autoStart !== false ? "idle" : "idle",
    boundaries,
  });

  // Determine personality
  const personality: Personality | PersonalityPreset =
    options.personality || "balanced";

  // Create Brain instance
  const brain = createBrain(cat, {
    personality,
    environment: {
      boundaries,
      ...options.environment,
    },
  });

  // Create MeowzerCat wrapper
  const meowzerCat = new MeowzerCat({
    id: protoCat.id,
    seed: protoCat.seed,
    cat,
    brain,
  });

  // Register cat
  catRegistry.register(meowzerCat);

  // Auto-start if requested (default: true)
  if (options.autoStart !== false) {
    meowzerCat.resume();
  }

  // Auto-cleanup on destroy
  meowzerCat.on("destroy", () => {
    catRegistry.unregister(meowzerCat.id);
  });

  return meowzerCat;
}

/**
 * Generates a random cat with random appearance and personality
 */
export function createRandomCat(
  options: MeowzerOptions = {}
): MeowzerCat {
  const settings = getRandomSettings();
  return createCat(settings, options);
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Adjust boundaries to account for cat size
 * This prevents cats from causing horizontal/vertical scrolling
 */
function _adjustBoundariesForCatSize(
  boundaries: Boundaries
): Boundaries {
  return {
    minX: boundaries.minX ?? 0,
    minY: boundaries.minY ?? 0,
    maxX: (boundaries.maxX ?? window.innerWidth) - CAT_WIDTH,
    maxY: (boundaries.maxY ?? window.innerHeight) - CAT_HEIGHT,
  };
}

/**
 * Get random position within boundaries
 */
function _getRandomPosition(): Position {
  const minX = defaultBoundaries.minX || 0;
  const maxX = defaultBoundaries.maxX || window.innerWidth;
  const minY = defaultBoundaries.minY || 0;
  const maxY = defaultBoundaries.maxY || window.innerHeight;

  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY),
  };
}
