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
  CatPattern,
  FurLength,
} from "../types.js";
import { generateCatSVG } from "./svg-generator.js";
import { generateId, darkenColor, lightenColor } from "./utils.js";
import { normalizeColor } from "./color-utils.js";
import { validateCatSettings } from "./validation.js";
import { generateSeed, parseSeed } from "./serialization.js";

const VERSION = "1.0.0";

/**
 * Creates appearance data from settings
 */
function createAppearanceData(settings: CatSettings): AppearanceData {
  const color = normalizeColor(settings.color);
  const eyeColor = normalizeColor(settings.eyeColor);

  return {
    color: `#${color}`,
    eyeColor: `#${eyeColor}`,
    pattern: settings.pattern,
    furLength: settings.furLength,
    shadingColor: darkenColor(`#${color}`, 0.3),
    highlightColor: lightenColor(`#${color}`, 0.2),
  };
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
  const seed = generateSeed(settings);
  const appearance = createAppearanceData(settings);
  const dimensions = createDimensionData(settings.size);

  // Generate SVG sprite
  const spriteData: SpriteData = generateCatSVG(
    appearance,
    dimensions
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
  const settings = parseSeed(seed);
  return buildCat(settings);
}

/**
 * Builder class for more control over cat creation
 */
export class CatBuilder {
  private settings: Partial<CatSettings> = {};

  withColor(color: string): CatBuilder {
    this.settings.color = color;
    return this;
  }

  withEyeColor(eyeColor: string): CatBuilder {
    this.settings.eyeColor = eyeColor;
    return this;
  }

  withPattern(pattern: CatPattern): CatBuilder {
    this.settings.pattern = pattern;
    return this;
  }

  withSize(size: CatSize): CatBuilder {
    this.settings.size = size;
    return this;
  }

  withFurLength(furLength: FurLength): CatBuilder {
    this.settings.furLength = furLength;
    return this;
  }

  build(): ProtoCat {
    // Ensure all required fields are present
    if (
      !this.settings.color ||
      !this.settings.eyeColor ||
      !this.settings.pattern ||
      !this.settings.size ||
      !this.settings.furLength
    ) {
      throw new Error(
        "All cat properties must be set before building"
      );
    }

    return buildCat(this.settings as CatSettings);
  }
}
