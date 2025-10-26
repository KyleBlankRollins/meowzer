/**
 * SDK configuration and options types
 */

import type { Position, Boundaries } from "../primitives.js";
import type {
  Personality,
  PersonalityPreset,
  Environment,
} from "../cat/behavior.js";
import type { CatMetadata } from "../cat/metadata.js";

/**
 * Options for creating a cat
 */
export interface CreateCatOptions {
  name?: string;
  description?: string;
  seed?: string;
  settings?: any; // CatSettings - avoid circular dependency
  container?: HTMLElement;
  position?: Position;
  personality?: Personality | PersonalityPreset;
  boundaries?: Boundaries;
  environment?: Environment;
  autoStart?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Options for saving a cat
 */
export interface SaveOptions {
  collection?: string;
  overwrite?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Options for loading cats
 */
export interface LoadOptions {
  collection?: string;
  limit?: number;
  offset?: number;
}

/**
 * Options for finding cats
 */
export interface FindCatsOptions {
  name?: string;
  seed?: string;
  tags?: string[];
  limit?: number;
}

/**
 * Configuration for the Meowzer SDK
 */
export interface MeowzerConfig {
  storage?: {
    enabled?: boolean;
    dbName?: string;
    defaultCollection?: string;
  };
  defaults?: {
    personality?: Personality | PersonalityPreset;
    boundaries?: Boundaries;
    autoStart?: boolean;
  };
}

/**
 * Configuration for creating a MeowzerCat instance
 * @internal
 */
export interface MeowzerCatConfig {
  id: string;
  seed: string;
  cat: any; // Meowtion Cat instance
  brain: any; // Meowbrain Brain instance
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
