/**
 * Meowkit - Cat character creation library
 * Transforms user settings into ProtoCat objects with SVG sprites
 */

import type {
  CatSettings,
  ProtoCat,
  AppearanceData,
  DimensionData,
  SpriteData,
  ValidationResult,
  CatPattern,
  CatSize,
  FurLength,
} from "../types.js";
import { generateCatSVG } from "./svg-generator.js";
import { generateId, darkenColor, lightenColor } from "./utils.js";

const VERSION = "1.0.0";

/**
 * Validates CatSettings before building
 */
export function validateSettings(
  settings: CatSettings
): ValidationResult {
  const errors: string[] = [];

  // Validate color format (hex or named color)
  if (!isValidColor(settings.color)) {
    errors.push(
      "Invalid color format. Use hex (e.g., #FF9500) or named colors."
    );
  }

  if (!isValidColor(settings.eyeColor)) {
    errors.push(
      "Invalid eyeColor format. Use hex (e.g., #00FF00) or named colors."
    );
  }

  // Validate enums
  const validPatterns: CatPattern[] = [
    "solid",
    "tabby",
    "calico",
    "tuxedo",
    "spotted",
  ];
  if (!validPatterns.includes(settings.pattern)) {
    errors.push(
      `Invalid pattern. Must be one of: ${validPatterns.join(", ")}`
    );
  }

  const validSizes: CatSize[] = ["small", "medium", "large"];
  if (!validSizes.includes(settings.size)) {
    errors.push(
      `Invalid size. Must be one of: ${validSizes.join(", ")}`
    );
  }

  const validFurLengths: FurLength[] = ["short", "medium", "long"];
  if (!validFurLengths.includes(settings.furLength)) {
    errors.push(
      `Invalid furLength. Must be one of: ${validFurLengths.join(
        ", "
      )}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

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
  const validation = validateSettings(settings);
  if (!validation.valid) {
    throw new Error(`Invalid seed: ${validation.errors.join(", ")}`);
  }

  return settings;
}

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
  const validation = validateSettings(settings);
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

/**
 * Reconstructs ProtoCat from stored JSON
 */
export function deserializeCat(json: string): ProtoCat {
  const minimal = JSON.parse(json);

  // Regenerate the full cat from seed
  const protoCat = buildCatFromSeed(minimal.seed);

  // Restore original ID and metadata
  protoCat.id = minimal.id;
  protoCat.metadata.createdAt = new Date(minimal.metadata.createdAt);

  return protoCat;
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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if a color string is valid
 */
function isValidColor(color: string): boolean {
  // Check for hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return true;
  }

  // Check for named colors (basic set)
  const namedColors = [
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
    "grey",
    "cyan",
    "magenta",
    "lime",
    "navy",
  ];

  return namedColors.includes(color.toLowerCase());
}

/**
 * Normalizes color to hex format without #
 */
function normalizeColor(color: string): string {
  // If already hex, remove # and return
  if (color.startsWith("#")) {
    return color.substring(1).toUpperCase();
  }

  // Convert named colors to hex
  const namedColorMap: Record<string, string> = {
    black: "000000",
    white: "FFFFFF",
    red: "FF0000",
    green: "008000",
    blue: "0000FF",
    yellow: "FFFF00",
    orange: "FFA500",
    purple: "800080",
    pink: "FFC0CB",
    brown: "A52A2A",
    gray: "808080",
    grey: "808080",
    cyan: "00FFFF",
    magenta: "FF00FF",
    lime: "00FF00",
    navy: "000080",
  };

  const hex = namedColorMap[color.toLowerCase()];
  if (!hex) {
    throw new Error(`Unknown color name: ${color}`);
  }

  return hex;
}
