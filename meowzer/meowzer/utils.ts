/**
 * Utility functions for Meowzer
 *
 * Includes random generation, validation, and helper functions
 */

import type {
  CatSettings,
  CatPattern,
  CatSize,
  FurLength,
  ValidationResult,
  Boundaries,
} from "../types.js";

// ============================================================================
// RANDOM GENERATION
// ============================================================================

const NAMED_COLORS = [
  "#FF9500", // Orange
  "#000000", // Black
  "#FFFFFF", // White
  "#A52A2A", // Brown
  "#D3D3D3", // Gray
  "#FFD700", // Golden
  "#F5DEB3", // Cream
];

const EYE_COLORS = [
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFD700", // Gold
  "#FFA500", // Amber
  "#808080", // Gray
];

const PATTERNS: CatPattern[] = [
  "solid",
  "tabby",
  "calico",
  "tuxedo",
  "spotted",
];
const SIZES: CatSize[] = ["small", "medium", "large"];
const FUR_LENGTHS: FurLength[] = ["short", "medium", "long"];

/**
 * Generates random CatSettings
 */
export function getRandomSettings(): CatSettings {
  return {
    color:
      NAMED_COLORS[Math.floor(Math.random() * NAMED_COLORS.length)],
    eyeColor:
      EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)],
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    size: SIZES[Math.floor(Math.random() * SIZES.length)],
    furLength:
      FUR_LENGTHS[Math.floor(Math.random() * FUR_LENGTHS.length)],
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates hex color format
 */
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validates named color (checks if it's in our list or valid hex)
 */
function isValidColor(color: string): boolean {
  return isValidHexColor(color) || NAMED_COLORS.includes(color);
}

/**
 * Validates CatSettings object
 */
export function validateSettings(
  settings: CatSettings
): ValidationResult {
  const errors: string[] = [];

  // Validate color
  if (!isValidColor(settings.color)) {
    errors.push(
      `Invalid color format: ${settings.color}. Must be hex (#RRGGBB) or named color.`
    );
  }

  // Validate eye color
  if (!isValidColor(settings.eyeColor)) {
    errors.push(
      `Invalid eye color format: ${settings.eyeColor}. Must be hex (#RRGGBB) or named color.`
    );
  }

  // Validate pattern
  if (!PATTERNS.includes(settings.pattern)) {
    errors.push(
      `Invalid pattern: ${
        settings.pattern
      }. Must be one of: ${PATTERNS.join(", ")}`
    );
  }

  // Validate size
  if (!SIZES.includes(settings.size)) {
    errors.push(
      `Invalid size: ${settings.size}. Must be one of: ${SIZES.join(
        ", "
      )}`
    );
  }

  // Validate fur length
  if (!FUR_LENGTHS.includes(settings.furLength)) {
    errors.push(
      `Invalid fur length: ${
        settings.furLength
      }. Must be one of: ${FUR_LENGTHS.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// BOUNDARIES
// ============================================================================

/**
 * Get viewport boundaries
 */
export function getViewportBoundaries(): Boundaries {
  return {
    minX: 0,
    maxX: window.innerWidth,
    minY: 0,
    maxY: window.innerHeight,
  };
}

/**
 * Validate boundaries object
 */
export function validateBoundaries(boundaries: Boundaries): boolean {
  if (
    boundaries.minX !== undefined &&
    boundaries.maxX !== undefined
  ) {
    if (boundaries.minX >= boundaries.maxX) return false;
  }
  if (
    boundaries.minY !== undefined &&
    boundaries.maxY !== undefined
  ) {
    if (boundaries.minY >= boundaries.maxY) return false;
  }
  return true;
}
