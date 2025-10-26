/**
 * AI behavior and personality types (Meowbrain)
 */

import type { Position, Boundaries } from "../primitives.js";

/**
 * Personality trait values (0-1 range)
 */
export interface Personality {
  energy: number;
  curiosity: number;
  playfulness: number;
  independence: number;
  sociability: number;
}

/**
 * Preset personality configurations
 */
export type PersonalityPreset =
  | "lazy"
  | "playful"
  | "curious"
  | "aloof"
  | "energetic"
  | "balanced";

/**
 * Available behavior types
 */
export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring";

/**
 * Current motivations/needs (0-1 range)
 */
export interface Motivation {
  rest: number;
  stimulation: number;
  exploration: number;
}

/**
 * Brain's current decision state
 */
export interface BrainState {
  currentBehavior: BehaviorType;
  motivation: Motivation;
  lastDecisionTime: number;
  decisionCooldown: number;
}

/**
 * Short-term memory for decision-making
 */
export interface Memory {
  visitedPositions: Position[];
  lastInteractionTime: number;
  boundaryHits: number;
  previousBehaviors: BehaviorType[];
}

/**
 * Obstacle in the environment
 */
export interface Obstacle {
  position: Position;
  radius: number;
}

/**
 * Attractor in the environment
 */
export interface Attractor {
  position: Position;
  strength: number;
  type: "point" | "area";
}

/**
 * Environmental context for decision-making
 */
export interface Environment {
  boundaries?: Boundaries;
  obstacles?: Obstacle[];
  attractors?: Attractor[];
  otherCats?: any[]; // Avoid circular dependency
}

/**
 * Brain events for observation
 */
export type BrainEvent =
  | "behaviorChange"
  | "decisionMade"
  | "reactionTriggered";

/**
 * Options for configuring a brain
 */
export interface BrainOptions {
  personality?: Personality | PersonalityPreset;
  environment?: Environment;
  decisionInterval?: number;
  motivationDecay?: {
    rest: number;
    stimulation: number;
    exploration: number;
  };
}

/**
 * Behavior weight configuration
 */
export interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
}
