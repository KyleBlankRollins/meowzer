/**
 * BrainBuilder - Builder pattern for Brain configuration
 */

import type { Cat } from "../meowtion/cat.js";
import type {
  Personality,
  PersonalityPreset,
  Environment,
} from "../types.js";
import { Brain, type BrainOptions } from "./brain.js";

export class BrainBuilder {
  private _cat: Cat;
  private _options: BrainOptions = {};

  constructor(cat: Cat) {
    this._cat = cat;
  }

  /**
   * Set the personality
   */
  withPersonality(
    personality: Personality | PersonalityPreset
  ): BrainBuilder {
    this._options.personality = personality;
    return this;
  }

  /**
   * Set the environment
   */
  withEnvironment(environment: Environment): BrainBuilder {
    this._options.environment = environment;
    return this;
  }

  /**
   * Set decision interval range
   */
  withDecisionInterval(min: number, max: number): BrainBuilder {
    this._options.decisionInterval = [min, max];
    return this;
  }

  /**
   * Set motivation decay rates
   */
  withMotivationDecay(decay: {
    rest: number;
    stimulation: number;
    exploration: number;
  }): BrainBuilder {
    this._options.motivationDecay = decay;
    return this;
  }

  /**
   * Build and return the Brain instance
   */
  build(): Brain {
    return new Brain(this._cat, this._options);
  }
}
