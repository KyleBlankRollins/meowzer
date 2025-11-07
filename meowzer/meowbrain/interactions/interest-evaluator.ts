/**
 * InterestEvaluator - Evaluates cat's interest in different interaction types
 */

import type { Cat } from "../../meowtion/cat.js";
import type {
  Personality,
  BrainState,
  Position,
} from "../../types/index.js";

export interface InteractionTarget {
  type: string;
  position: Position;
  state?: string;
}

/**
 * Evaluates cat interest in interactions based on personality and state
 */
export class InterestEvaluator {
  private personality: Personality;
  private getState: () => BrainState;
  private cat: Cat;

  constructor(
    personality: Personality,
    getState: () => BrainState,
    cat: Cat
  ) {
    this.personality = personality;
    this.getState = getState;
    this.cat = cat;
  }

  /**
   * Update personality for interest evaluation
   */
  updatePersonality(personality: Personality): void {
    this.personality = personality;
  }

  /**
   * Evaluate whether cat is interested in a need or yarn
   *
   * Takes into account personality, current state, and target type.
   * Returns a number 0-1 representing interest level.
   *
   * @param target - The target object with type, position, and optional state
   * @returns Interest level (0-1), where values > 0.5 indicate interest
   */
  evaluateInterest(target: InteractionTarget): number {
    const state = this.getState();

    // Start with base interest from personality traits
    let interest = 0;

    // Different target types have different base appeal
    if (target.type === "food:basic") {
      // Basic food: Appeals to lower energy cats
      interest = 0.5 + (1 - this.personality.energy) * 0.3;
      // Independent cats are less interested
      interest *= 1 - this.personality.independence * 0.3;
    } else if (target.type === "food:fancy") {
      // Fancy food: More universally appealing
      interest = 0.7 + this.personality.curiosity * 0.2;
      // Curious cats love fancy food
      interest *= 1 + this.personality.curiosity * 0.3;
    } else if (target.type === "water") {
      // Water: Base interest for water
      interest = 0.3;

      // Higher interest after activity (playing, exploring)
      if (
        state.currentBehavior === "playing" ||
        state.currentBehavior === "exploring"
      ) {
        interest += 0.3;
      }

      // Motivation-based adjustment (rest need increases water interest)
      interest += (1 - state.motivation.rest) * 0.2;

      // Personality adjustment
      interest *= 1 - this.personality.independence * 0.2;
    } else if (target.type === "yarn") {
      // Yarn: Base interest
      interest = 0.5 + this.personality.curiosity * 0.3;

      // Moving yarn is more interesting
      if (target.state === "rolling" || target.state === "dragging") {
        interest *= 1.5;
      }

      // Playful cats more interested
      interest += this.personality.energy * 0.2;

      // Reduce for independence
      interest *= 1 - this.personality.independence * 0.3;

      // Clamp to 0-1
      return Math.max(0, Math.min(1, interest));
    } else if (target.type === "laser") {
      // Laser pointer: Highly interesting to most cats
      interest = 0.8 + this.personality.curiosity * 0.2;

      // Energy level boosts interest
      interest += this.personality.energy * 0.3;

      // Even independent cats love lasers
      interest *= 1 - this.personality.independence * 0.1;

      // Clamp to 0-1
      return Math.max(0, Math.min(1, interest));
    }

    // Current state affects interest
    switch (state.currentBehavior) {
      case "resting":
        // Very low interest when resting unless it's fancy food
        interest *= target.type === "food:fancy" ? 0.5 : 0.2;
        break;
      case "consuming":
        // Already eating, no interest in more food
        return 0;
      case "playing":
        // Moderate interest, may finish playing first
        interest *= 0.6;
        break;
      case "approaching":
        // Already approaching something, lower interest
        interest *= 0.3;
        break;
    }

    // Rest motivation increases food interest
    interest += state.motivation.rest * 0.2;

    // Distance affects interest (farther = less interested)
    const dist = Math.hypot(
      target.position.x - this.cat.position.x,
      target.position.y - this.cat.position.y
    );
    const distanceFactor = Math.max(0, 1 - dist / 500); // Loses interest beyond 500px
    interest *= 0.7 + distanceFactor * 0.3;

    // Clamp to 0-1
    return Math.min(1, Math.max(0, interest));
  }
}
