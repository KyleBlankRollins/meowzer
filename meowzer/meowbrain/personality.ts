/**
 * Personality presets and configurations
 */

import type { Personality, PersonalityPreset } from "../types.js";

export const PERSONALITY_PRESETS: Record<
  PersonalityPreset,
  Personality
> = {
  lazy: {
    energy: 0.2,
    curiosity: 0.3,
    playfulness: 0.2,
    independence: 0.7,
    sociability: 0.4,
  },
  playful: {
    energy: 0.85,
    curiosity: 0.7,
    playfulness: 0.95,
    independence: 0.4,
    sociability: 0.8,
  },
  curious: {
    energy: 0.7,
    curiosity: 0.95,
    playfulness: 0.6,
    independence: 0.5,
    sociability: 0.6,
  },
  aloof: {
    energy: 0.5,
    curiosity: 0.4,
    playfulness: 0.3,
    independence: 0.95,
    sociability: 0.2,
  },
  energetic: {
    energy: 0.95,
    curiosity: 0.6,
    playfulness: 0.8,
    independence: 0.5,
    sociability: 0.7,
  },
  balanced: {
    energy: 0.5,
    curiosity: 0.5,
    playfulness: 0.5,
    independence: 0.5,
    sociability: 0.5,
  },
};

/**
 * Gets a personality configuration by preset name
 */
export function getPersonality(
  preset: PersonalityPreset
): Personality {
  return { ...PERSONALITY_PRESETS[preset] };
}

/**
 * Gets all available personality preset names
 */
export function getPersonalityPresets(): PersonalityPreset[] {
  return Object.keys(PERSONALITY_PRESETS) as PersonalityPreset[];
}

/**
 * Validates a personality object
 */
export function validatePersonality(
  personality: Personality
): boolean {
  const traits = [
    "energy",
    "curiosity",
    "playfulness",
    "independence",
    "sociability",
  ] as const;

  for (const trait of traits) {
    const value = personality[trait];
    if (typeof value !== "number" || value < 0 || value > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a personality from a preset or validates a custom one
 */
export function resolvePersonality(
  input: Personality | PersonalityPreset
): Personality {
  if (typeof input === "string") {
    return getPersonality(input);
  }

  if (!validatePersonality(input)) {
    throw new Error(
      "Invalid personality: all traits must be between 0 and 1"
    );
  }

  return { ...input };
}
