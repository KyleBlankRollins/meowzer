/**
 * Decision engine for determining cat behavior
 */

import type {
  Personality,
  Motivation,
  Memory,
  Environment,
  Position,
} from "../types/index.js";
import type { BehaviorType } from "./behaviors.js";

export interface BehaviorWeights {
  wandering: number;
  resting: number;
  playing: number;
  observing: number;
  exploring: number;
  approaching: number;
  consuming: number;
}

/**
 * Calculate behavior weights based on personality, motivation, memory, and environment
 */
export function calculateBehaviorWeights(
  personality: Personality,
  motivation: Motivation,
  memory: Memory,
  environment: Environment
): BehaviorWeights {
  const weights: BehaviorWeights = {
    wandering: 0,
    resting: 0,
    playing: 0,
    observing: 0,
    exploring: 0,
    approaching: 0,
    consuming: 0,
  };

  // Base weights from personality
  weights.wandering =
    personality.energy * 0.5 + personality.independence * 0.3;
  weights.resting = (1 - personality.energy) * 0.7;
  weights.playing =
    personality.playfulness * 0.8 + personality.energy * 0.2;
  weights.observing =
    personality.curiosity * 0.4 + (1 - personality.energy) * 0.3;
  weights.exploring =
    personality.curiosity * 0.7 + personality.energy * 0.3;

  // Adjust based on motivations
  weights.resting += motivation.rest * 2; // Strong influence
  weights.playing += motivation.stimulation * 1.5;
  weights.exploring += motivation.exploration * 1.5;
  weights.wandering += motivation.stimulation * 0.5;

  // Adjust based on memory (avoid recent behaviors)
  const recentBehaviors = memory.previousBehaviors.slice(-3);
  for (const behavior of recentBehaviors) {
    if (weights[behavior] > 0) {
      weights[behavior] *= 0.7; // Reduce weight of recent behaviors
    }
  }

  // Adjust based on environment
  if (environment.attractors && environment.attractors.length > 0) {
    weights.exploring += 0.5; // Attractors encourage exploration
    weights.wandering += 0.3;
  }

  if (environment.obstacles && environment.obstacles.length > 0) {
    weights.wandering *= 0.8; // Obstacles discourage wandering
  }

  // Boundary hits increase desire to rest or observe
  if (memory.boundaryHits > 2) {
    weights.resting += 0.5;
    weights.observing += 0.3;
    weights.wandering *= 0.6;
  }

  // Ensure all weights are non-negative
  for (const key in weights) {
    weights[key as BehaviorType] = Math.max(
      0,
      weights[key as BehaviorType]
    );
  }

  return weights;
}

/**
 * Choose a behavior based on weighted probabilities
 */
export function chooseBehavior(
  weights: BehaviorWeights
): BehaviorType {
  const behaviors = Object.keys(weights) as BehaviorType[];
  const totalWeight = behaviors.reduce(
    (sum, behavior) => sum + weights[behavior],
    0
  );

  if (totalWeight === 0) {
    // If all weights are 0, default to wandering
    return "wandering";
  }

  // Weighted random selection
  let random = Math.random() * totalWeight;

  for (const behavior of behaviors) {
    random -= weights[behavior];
    if (random <= 0) {
      return behavior;
    }
  }

  // Fallback (shouldn't reach here)
  return "wandering";
}

/**
 * Update motivations over time
 */
export function updateMotivations(
  motivation: Motivation,
  currentBehavior: BehaviorType,
  deltaTime: number, // seconds
  decayRates: {
    rest: number;
    stimulation: number;
    exploration: number;
  }
): Motivation {
  const updated = { ...motivation };

  // Motivations naturally increase
  updated.rest += decayRates.rest * deltaTime;
  updated.stimulation += decayRates.stimulation * deltaTime;
  updated.exploration += decayRates.exploration * deltaTime;

  // Behaviors satisfy motivations
  switch (currentBehavior) {
    case "resting":
      updated.rest = Math.max(0, updated.rest - 0.1 * deltaTime);
      updated.stimulation += 0.05 * deltaTime; // Gets bored while resting
      break;
    case "playing":
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.15 * deltaTime
      );
      updated.rest += 0.08 * deltaTime; // Gets tired from playing
      break;
    case "exploring":
      updated.exploration = Math.max(
        0,
        updated.exploration - 0.1 * deltaTime
      );
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.05 * deltaTime
      );
      updated.rest += 0.03 * deltaTime;
      break;
    case "wandering":
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.03 * deltaTime
      );
      updated.rest += 0.02 * deltaTime;
      break;
    case "observing":
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.02 * deltaTime
      );
      updated.exploration += 0.02 * deltaTime; // Observing makes curious
      break;
    case "approaching":
      // Approaching is active but not very tiring
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.05 * deltaTime
      );
      updated.rest += 0.01 * deltaTime;
      break;
    case "consuming":
      // Consuming satisfies needs and provides rest
      updated.rest = Math.max(0, updated.rest - 0.15 * deltaTime);
      updated.stimulation = Math.max(
        0,
        updated.stimulation - 0.1 * deltaTime
      );
      break;
  }

  // Clamp all motivations to 0-1
  updated.rest = Math.min(1, Math.max(0, updated.rest));
  updated.stimulation = Math.min(1, Math.max(0, updated.stimulation));
  updated.exploration = Math.min(1, Math.max(0, updated.exploration));

  return updated;
}

/**
 * Update memory with new information
 */
export function updateMemory(
  memory: Memory,
  newPosition: Position,
  newBehavior: BehaviorType,
  boundaryHit: boolean
): Memory {
  const updated = { ...memory };

  // Add new position (keep last 10)
  updated.visitedPositions = [
    ...memory.visitedPositions,
    newPosition,
  ].slice(-10);

  // Add new behavior (keep last 5)
  updated.previousBehaviors = [
    ...memory.previousBehaviors,
    newBehavior,
  ].slice(-5);

  // Update boundary hits (decay over time)
  if (boundaryHit) {
    updated.boundaryHits = Math.min(5, memory.boundaryHits + 1);
  } else {
    updated.boundaryHits = Math.max(0, memory.boundaryHits - 0.5);
  }

  updated.lastInteractionTime = Date.now();

  return updated;
}

/**
 * Determine if a behavior transition is valid
 */
export function isValidBehaviorTransition(
  from: BehaviorType,
  to: BehaviorType
): boolean {
  // After consuming, must rest
  if (from === "consuming" && to !== "resting") return false;

  // Any behavior can transition to resting
  if (to === "resting") return true;

  // Approaching and consuming can interrupt most behaviors (need-driven)
  if (to === "approaching" || to === "consuming") return true;

  // Define valid transitions
  const validTransitions: Record<BehaviorType, BehaviorType[]> = {
    wandering: [
      "exploring",
      "playing",
      "observing",
      "resting",
      "approaching",
    ],
    resting: ["wandering", "exploring", "observing", "approaching"],
    playing: ["wandering", "resting", "approaching"],
    observing: ["wandering", "exploring", "resting", "approaching"],
    exploring: ["wandering", "observing", "resting", "approaching"],
    approaching: ["consuming", "observing", "resting"],
    consuming: ["resting"],
  };

  return validTransitions[from]?.includes(to) ?? false;
}
