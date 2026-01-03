/**
 * Cat building and construction utilities
 */

import type {
  CatSettings,
  ProtoCat,
  AppearanceData,
  DimensionData,
  SpriteData,
  CatSize,
  AccessorySettings,
} from "../types/index.js";
import { generateCatSVG } from "./svg-generator.js";
import { generateId, darkenColor, lightenColor } from "./utils.js";
import { normalizeColor } from "./color-utils.js";
import { validateCatSettings } from "./validation.js";
import { generateSeed, parseSeed } from "./serialization.js";

const VERSION = "1.0.0";

/**
 * Creates appearance data from settings
 */
function createAppearanceData(
  settings: CatSettings,
  accessories?: AccessorySettings
): AppearanceData {
  const color = normalizeColor(settings.color);
  const eyeColor = normalizeColor(settings.eyeColor);

  const appearance: AppearanceData = {
    color: `#${color}`,
    eyeColor: `#${eyeColor}`,
    pattern: settings.pattern,
    furLength: settings.furLength,
    shadingColor: darkenColor(`#${color}`, 0.3),
    highlightColor: lightenColor(`#${color}`, 0.2),
  };

  // Add accessories if provided
  if (accessories) {
    appearance.accessories = accessories;
  }

  return appearance;
}

/**
 * Creates dimension data from settings
 */
function createDimensionData(size: CatSize): DimensionData {
  const scales: Record<CatSize, number> = {
    small: 0.65,
    medium: 1.0,
    large: 1.5,
  };

  const baseWidth = 100;
  const baseHeight = 100;
  const scale = scales[size];

  return {
    size,
    width: baseWidth,
    height: baseHeight,
    scale,
    hitbox: {
      offsetX: 10,
      offsetY: 10,
      width: 80,
      height: 80,
    },
  };
}

/**
 * Creates a complete ProtoCat from user settings
 */
export function buildCat(settings: CatSettings): ProtoCat {
  // Validate settings
  const validation = validateCatSettings(settings);
  if (!validation.valid) {
    throw new Error(
      `Invalid cat settings: ${validation.errors.join(", ")}`
    );
  }

  const id = generateId();
  const appearance = createAppearanceData(settings);
  const seed = generateSeed(settings, id);
  const dimensions = createDimensionData(settings.size);

  // Generate SVG sprite using cat's stable ID
  const spriteData: SpriteData = generateCatSVG(
    appearance,
    dimensions,
    id
  );

  const protoCat: ProtoCat = {
    id,
    seed,
    appearance,
    dimensions,
    spriteData,
    metadata: {
      createdAt: new Date(),
      version: VERSION,
    },
  };

  return protoCat;
}

/**
 * Generates a ProtoCat from a seed string
 */
export function buildCatFromSeed(seed: string): ProtoCat {
  const { settings, id, accessories } = parseSeed(seed);
  const appearance = createAppearanceData(settings, accessories);
  const dimensions = createDimensionData(settings.size);

  // Generate SVG sprite using the stable ID
  const spriteData: SpriteData = generateCatSVG(
    appearance,
    dimensions,
    id
  );

  const protoCat: ProtoCat = {
    id,
    seed,
    appearance,
    dimensions,
    spriteData,
    metadata: {
      createdAt: new Date(),
      version: VERSION,
    },
  };

  return protoCat;
}
