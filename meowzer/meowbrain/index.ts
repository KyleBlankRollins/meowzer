/**
 * Meowbrain - AI library for autonomous cat behavior
 */

export { Brain, type BrainOptions } from "./brain.js";
export {
  getPersonality,
  getPersonalityPresets,
  PERSONALITY_PRESETS,
} from "./personality.js";
export type { BehaviorType } from "./behaviors.js";

import type { Cat } from "../meowtion/cat.js";
import { Brain, type BrainOptions } from "./brain.js";

/**
 * Creates a brain for a cat, enabling autonomous behavior
 * @param cat - The Cat instance to control (from Meowtion)
 * @param options - Configuration for personality and environment
 */
export function createBrain(cat: Cat, options?: BrainOptions): Brain {
  return new Brain(cat, options);
}
