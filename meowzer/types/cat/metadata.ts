/**
 * Cat metadata and persistence types
 */

import type { Position } from "../primitives.js";
import type { CatStateType } from "./animation.js";
import type { Personality } from "./behavior.js";

/**
 * Extensible metadata for cats
 */
export interface CatMetadata {
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * JSON representation of a cat (for serialization)
 */
export interface CatJSON {
  id: string;
  seed: string;
  name?: string;
  description?: string;
  position: Position;
  state: CatStateType;
  personality: Personality;
  isActive: boolean;
  metadata: CatMetadata;
}

/**
 * Cat seed for recreation
 */
export interface CatSeed {
  seed: string;
  name?: string;
  metadata?: Record<string, unknown>;
}
