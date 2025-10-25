/**
 * Cat settings validation
 */

import type {
  CatSettings,
  ValidationResult,
  CatPattern,
  CatSize,
  FurLength,
} from "../types.js";
import { isValidColor } from "./color-utils.js";

/**
 * Validates CatSettings before building
 */
export function validateCatSettings(
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
