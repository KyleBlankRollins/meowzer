/**
 * BehaviorOrchestrator - Manages behavior execution and transitions
 */

import type { Cat } from "../meowtion/cat.js";
import type { Personality, Position } from "../types/index.js";
import type { BehaviorType } from "./behaviors.js";
import {
  wandering,
  resting,
  playing,
  observing,
  exploring,
  approaching,
  consuming,
  chasing,
  batting,
  getBehaviorDuration,
} from "./behaviors.js";

export interface ExecutionContext {
  duration?: number;
  target?: Position;
  visitedPositions?: Position[];
  options?: {
    speed?: number;
  };
}

/**
 * Orchestrates behavior execution for the cat
 */
export class BehaviorOrchestrator {
  private cat: Cat;
  private personality: Personality;
  private currentBehaviorPromise: Promise<void> | null = null;
  private destroyed: boolean = false;

  constructor(cat: Cat, personality: Personality) {
    this.cat = cat;
    this.personality = personality;
  }

  /**
   * Update personality
   */
  updatePersonality(personality: Personality): void {
    this.personality = personality;
  }

  /**
   * Execute a behavior with the given context
   */
  async execute(
    behavior: BehaviorType,
    context: ExecutionContext = {}
  ): Promise<void> {
    if (this.destroyed) return;

    const duration =
      context.duration ??
      getBehaviorDuration(behavior, this.personality.energy);

    try {
      switch (behavior) {
        case "wandering":
          this.currentBehaviorPromise = wandering(this.cat, duration);
          break;

        case "resting":
          this.currentBehaviorPromise = resting(this.cat, duration);
          break;

        case "playing":
          this.currentBehaviorPromise = playing(this.cat, duration);
          break;

        case "observing":
          this.currentBehaviorPromise = observing(this.cat, duration);
          break;

        case "exploring":
          this.currentBehaviorPromise = exploring(
            this.cat,
            duration,
            context.visitedPositions ?? []
          );
          break;

        case "approaching":
          if (!context.target) {
            console.warn(
              "Approaching behavior requires a target in context"
            );
            return;
          }
          this.currentBehaviorPromise = approaching(
            this.cat,
            context.target,
            duration,
            context.options
          );
          break;

        case "consuming":
          this.currentBehaviorPromise = consuming(this.cat, duration);
          break;

        case "chasing":
          if (!context.target) {
            console.warn(
              "Chasing behavior requires a target in context"
            );
            return;
          }
          this.currentBehaviorPromise = chasing(
            this.cat,
            context.target,
            duration,
            context.options
          );
          break;

        case "batting":
          this.currentBehaviorPromise = batting(this.cat, duration);
          break;
      }

      await this.currentBehaviorPromise;
    } catch (error) {
      // Behavior was interrupted or cat was destroyed
    } finally {
      this.currentBehaviorPromise = null;
    }
  }

  /**
   * Execute approaching behavior toward a target
   * Convenience method for interaction system
   */
  async executeApproaching(
    target: Position,
    options?: { speed?: number }
  ): Promise<void> {
    const duration = getBehaviorDuration(
      "approaching",
      this.personality.energy
    );

    return this.execute("approaching", {
      target,
      duration,
      options,
    });
  }

  /**
   * Execute consuming behavior
   * Convenience method for interaction system
   */
  async executeConsuming(duration?: number): Promise<void> {
    const consumeDuration =
      duration ??
      getBehaviorDuration("consuming", this.personality.energy);

    return this.execute("consuming", { duration: consumeDuration });
  }

  /**
   * Execute chasing behavior toward a moving target
   * Convenience method for interaction system
   */
  async executeChasing(
    target: Position,
    options?: { speed?: number }
  ): Promise<void> {
    const duration = getBehaviorDuration(
      "chasing",
      this.personality.energy
    );

    return this.execute("chasing", {
      target,
      duration,
      options,
    });
  }

  /**
   * Execute batting behavior
   * Convenience method for interaction system
   */
  async executeBatting(duration?: number): Promise<void> {
    const batDuration =
      duration ??
      getBehaviorDuration("batting", this.personality.energy);

    return this.execute("batting", { duration: batDuration });
  }

  /**
   * Stop any currently executing behavior
   */
  stop(): void {
    this.cat.stop();
  }

  /**
   * Destroy the orchestrator
   */
  destroy(): void {
    this.stop();
    this.destroyed = true;
  }
}
