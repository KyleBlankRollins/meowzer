/**
 * MotivationManager - Manages motivation state and updates
 */

import type { Motivation } from "../../types/index.js";
import type { BehaviorType } from "../behaviors.js";

export interface DecayRates {
  rest: number;
  stimulation: number;
  exploration: number;
}

/**
 * Manages cat motivation levels over time
 */
export class MotivationManager {
  private motivation: Motivation;
  private decayRates: DecayRates;

  constructor(initialMotivation: Motivation, decayRates: DecayRates) {
    this.motivation = { ...initialMotivation };
    this.decayRates = { ...decayRates };
  }

  /**
   * Get current motivation
   */
  get current(): Motivation {
    return { ...this.motivation };
  }

  /**
   * Update motivation based on time and behavior
   */
  update(
    deltaTime: number,
    currentBehavior: BehaviorType
  ): Motivation {
    // Base decay over time
    this.motivation.rest = Math.max(
      0,
      this.motivation.rest - this.decayRates.rest * deltaTime
    );
    this.motivation.stimulation = Math.max(
      0,
      this.motivation.stimulation -
        this.decayRates.stimulation * deltaTime
    );
    this.motivation.exploration = Math.max(
      0,
      this.motivation.exploration -
        this.decayRates.exploration * deltaTime
    );

    // Behavior-specific adjustments
    switch (currentBehavior) {
      case "resting":
        // Resting increases rest motivation
        this.motivation.rest = Math.min(
          1,
          this.motivation.rest + 0.01 * deltaTime
        );
        // But decreases stimulation and exploration
        this.motivation.stimulation = Math.max(
          0,
          this.motivation.stimulation - 0.005 * deltaTime
        );
        this.motivation.exploration = Math.max(
          0,
          this.motivation.exploration - 0.005 * deltaTime
        );
        break;

      case "playing":
      case "batting":
      case "chasing":
        // Playing increases stimulation
        this.motivation.stimulation = Math.min(
          1,
          this.motivation.stimulation + 0.008 * deltaTime
        );
        // But decreases rest
        this.motivation.rest = Math.max(
          0,
          this.motivation.rest - 0.008 * deltaTime
        );
        break;

      case "exploring":
        // Exploring increases exploration motivation
        this.motivation.exploration = Math.min(
          1,
          this.motivation.exploration + 0.01 * deltaTime
        );
        // But decreases rest
        this.motivation.rest = Math.max(
          0,
          this.motivation.rest - 0.006 * deltaTime
        );
        break;

      case "consuming":
        // Consuming increases rest and decreases hunger-related motivations
        this.motivation.rest = Math.min(
          1,
          this.motivation.rest + 0.015 * deltaTime
        );
        break;
    }

    return this.current;
  }

  /**
   * Update decay rates
   */
  updateDecayRates(decayRates: Partial<DecayRates>): void {
    this.decayRates = { ...this.decayRates, ...decayRates };
  }

  /**
   * Set motivation directly
   */
  setMotivation(motivation: Partial<Motivation>): void {
    this.motivation = { ...this.motivation, ...motivation };
  }
}
