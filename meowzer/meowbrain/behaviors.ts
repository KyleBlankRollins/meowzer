/**
 * Behavior implementations for cat AI
 */

import type { Cat } from "../meowtion/cat.js";
import type { Position, Boundaries } from "../types/index.js";

export type BehaviorType =
  | "wandering"
  | "resting"
  | "playing"
  | "observing"
  | "exploring"
  | "approaching"
  | "consuming"
  | "chasing"
  | "batting";

/**
 * Random number within range
 */
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Random position within boundaries
 */
function randomPosition(boundaries: Boundaries): Position {
  return {
    x: randomRange(boundaries.minX ?? 0, boundaries.maxX ?? 1000),
    y: randomRange(boundaries.minY ?? 0, boundaries.maxY ?? 1000),
  };
}

/**
 * Distance between two positions
 */
function distance(a: Position, b: Position): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Wandering behavior - random movement within boundaries using curved paths
 */
export async function wandering(
  cat: Cat,
  duration: number
): Promise<void> {
  // Ensure cat is in idle state first (in case it was sitting/sleeping)
  if (cat.state.type !== "idle") {
    cat.setState("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const boundaries = cat.boundaries;
  const targetPosition = randomPosition(boundaries);

  // Calculate movement time based on distance and random speed
  const dist = distance(cat.position, targetPosition);
  const speed = randomRange(50, 150); // pixels per second
  const moveTime = Math.min((dist / speed) * 1000, duration);

  // Create a curved path with varied waypoints for organic, unpredictable movement
  // More waypoints for longer distances, with random variation
  const baseWaypoints = Math.floor(dist / 150);
  const numWaypoints = Math.max(
    1,
    baseWaypoints + (Math.random() > 0.5 ? 1 : 0)
  );
  const waypoints: Position[] = [];

  // Choose a random path style for variety
  const pathStyle = Math.random();

  for (let i = 0; i < numWaypoints; i++) {
    const t = (i + 1) / (numWaypoints + 1);
    const baseX =
      cat.position.x + (targetPosition.x - cat.position.x) * t;
    const baseY =
      cat.position.y + (targetPosition.y - cat.position.y) * t;

    // Calculate perpendicular direction for offset
    const perpX = -(targetPosition.y - cat.position.y);
    const perpY = targetPosition.x - cat.position.x;
    const perpLen = Math.hypot(perpX, perpY);

    let offsetAmount: number;

    if (pathStyle < 0.33) {
      // Style 1: Gentle sine wave
      offsetAmount = Math.sin(t * Math.PI * 2) * randomRange(30, 60);
    } else if (pathStyle < 0.66) {
      // Style 2: Progressive curve (curve gets stronger)
      offsetAmount = (t * t - 0.5) * randomRange(40, 80);
    } else {
      // Style 3: Random offsets (most organic)
      offsetAmount = randomRange(-70, 70);
    }

    waypoints.push({
      x: baseX + (perpX / perpLen) * offsetAmount,
      y: baseY + (perpY / perpLen) * offsetAmount,
    });
  }

  waypoints.push(targetPosition);

  // Vary curviness for more diversity
  const curviness = randomRange(1.0, 1.5);

  try {
    await cat.moveAlongPath(waypoints, moveTime, { curviness });
  } catch (error) {
    // Movement was cancelled or cat was destroyed
    console.log("Wandering cancelled:", error);
  }
}

/**
 * Resting behavior - cat sits or sleeps in place
 */
export async function resting(
  cat: Cat,
  duration: number
): Promise<void> {
  // Stop any movement
  cat.stop();

  // Decide between sitting and sleeping based on duration
  const state = duration > 5000 ? "sleeping" : "sitting";
  cat.setState(state);

  // Rest for the duration
  await new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Playing behavior - erratic, playful movements with zigzag paths
 */
export async function playing(
  cat: Cat,
  duration: number
): Promise<void> {
  // Ensure cat is in idle state first
  if (cat.state.type !== "idle") {
    cat.setState("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const startTime = Date.now();
  const boundaries = cat.boundaries;

  while (Date.now() - startTime < duration) {
    // Quick, short bursts of movement
    const targetPosition = randomPosition(boundaries);
    const dist = distance(cat.position, targetPosition);

    // Faster, shorter movements for playful behavior
    const speed = randomRange(200, 400);
    const moveTime = Math.min((dist / speed) * 1000, 1000);

    // Create varied playful paths - zigzags, loops, or sharp turns
    const waypoints: Position[] = [];
    const playStyle = Math.random();

    if (playStyle < 0.4) {
      // Style 1: Classic zigzag
      const numZigzags = Math.floor(dist / 80) + 1;
      for (let i = 0; i < numZigzags; i++) {
        const t = (i + 1) / (numZigzags + 1);
        const baseX =
          cat.position.x + (targetPosition.x - cat.position.x) * t;
        const baseY =
          cat.position.y + (targetPosition.y - cat.position.y) * t;

        // Alternate sides with varying intensity
        const side = i % 2 === 0 ? 1 : -1;
        const perpX = -(targetPosition.y - cat.position.y);
        const perpY = targetPosition.x - cat.position.x;
        const perpLen = Math.hypot(perpX, perpY);
        const offsetAmount = randomRange(40, 80) * side;

        waypoints.push({
          x: baseX + (perpX / perpLen) * offsetAmount,
          y: baseY + (perpY / perpLen) * offsetAmount,
        });
      }
    } else if (playStyle < 0.7) {
      // Style 2: Sharp turn in the middle (simulates pouncing/chasing)
      const midX = (cat.position.x + targetPosition.x) / 2;
      const midY = (cat.position.y + targetPosition.y) / 2;

      const perpX = -(targetPosition.y - cat.position.y);
      const perpY = targetPosition.x - cat.position.x;
      const perpLen = Math.hypot(perpX, perpY);
      const sharpTurn =
        randomRange(80, 120) * (Math.random() > 0.5 ? 1 : -1);

      waypoints.push({
        x: midX + (perpX / perpLen) * sharpTurn,
        y: midY + (perpY / perpLen) * sharpTurn,
      });
    } else {
      // Style 3: Spiral approach (circling behavior)
      const numSpirals = 3;
      for (let i = 0; i < numSpirals; i++) {
        const t = (i + 1) / (numSpirals + 1);
        const angle = t * Math.PI * 2;
        const radius = (1 - t) * randomRange(40, 70);

        const baseX =
          cat.position.x + (targetPosition.x - cat.position.x) * t;
        const baseY =
          cat.position.y + (targetPosition.y - cat.position.y) * t;

        const perpX = -(targetPosition.y - cat.position.y);
        const perpY = targetPosition.x - cat.position.x;
        const perpLen = Math.hypot(perpX, perpY);

        waypoints.push({
          x: baseX + (perpX / perpLen) * Math.cos(angle) * radius,
          y: baseY + (perpY / perpLen) * Math.sin(angle) * radius,
        });
      }
    }

    waypoints.push(targetPosition);

    // Vary curviness for different play styles
    const curviness =
      playStyle < 0.4 ? 0.6 : playStyle < 0.7 ? 0.9 : 1.3;

    try {
      await cat.moveAlongPath(waypoints, moveTime, {
        curviness,
        ease: "power2.inOut",
      });
    } catch (error) {
      break;
    }

    // Short pause between movements
    await new Promise((resolve) =>
      setTimeout(resolve, randomRange(200, 500))
    );
  }
}

/**
 * Observing behavior - cat sits and watches
 */
export async function observing(
  cat: Cat,
  duration: number
): Promise<void> {
  cat.stop();
  cat.setState("sitting");

  // Occasionally change orientation (not implemented in Cat yet, but prepared)
  await new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Exploring behavior - moves toward unvisited areas
 */
export async function exploring(
  cat: Cat,
  duration: number,
  visitedPositions: Position[]
): Promise<void> {
  // Ensure cat is in idle state first
  if (cat.state.type !== "idle") {
    cat.setState("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const boundaries = cat.boundaries;

  // Find least visited area by checking distance to all visited positions
  let bestPosition = randomPosition(boundaries);
  let maxMinDistance = 0;

  // Generate several candidate positions and pick the one farthest from visited areas
  for (let i = 0; i < 10; i++) {
    const candidate = randomPosition(boundaries);
    let minDistance = Infinity;

    // Find minimum distance to any visited position
    for (const visited of visitedPositions) {
      const dist = distance(candidate, visited);
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    // Keep the candidate with the largest minimum distance
    if (minDistance > maxMinDistance) {
      maxMinDistance = minDistance;
      bestPosition = candidate;
    }
  }

  // Move to the least visited area
  const dist = distance(cat.position, bestPosition);
  const speed = randomRange(60, 120);
  const moveTime = Math.min((dist / speed) * 1000, duration);

  try {
    await cat.moveTo(bestPosition.x, bestPosition.y, moveTime);
  } catch (error) {
    // Movement was cancelled or cat was destroyed
  }
}

/**
 * Approaching behavior - cat moves toward a target (food, toy, etc.)
 */
export async function approaching(
  cat: Cat,
  target: Position,
  duration: number,
  options?: { speed?: number }
): Promise<void> {
  // Ensure cat is in idle state first
  if (cat.state.type !== "idle") {
    cat.setState("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  const dist = distance(cat.position, target);
  const speed = options?.speed ?? randomRange(80, 150);
  const moveTime = Math.min((dist / speed) * 1000, duration);

  try {
    await cat.moveTo(target.x, target.y, moveTime);
  } catch (error) {
    // Movement was cancelled or cat was destroyed
    console.log("Approaching cancelled:", error);
  }
}

/**
 * Consuming behavior - cat eats/drinks at location
 */
export async function consuming(
  cat: Cat,
  duration: number
): Promise<void> {
  cat.stop();
  cat.setState("sitting");

  await new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Chasing behavior - cat follows a moving target at high speed
 */
export async function chasing(
  cat: Cat,
  target: Position,
  duration: number,
  options?: { speed?: number }
): Promise<void> {
  // Ensure cat is in running state
  cat.setState("running");

  const speed = options?.speed ?? randomRange(150, 250); // Faster than approaching
  const dist = distance(cat.position, target);
  const moveTime = Math.min((dist / speed) * 1000, duration);

  try {
    await cat.moveTo(target.x, target.y, moveTime);
  } catch (error) {
    // Movement was cancelled or cat was destroyed
    console.log("Chasing cancelled:", error);
  }
}

/**
 * Batting behavior - cat swipes at an object
 */
export async function batting(
  cat: Cat,
  duration: number
): Promise<void> {
  cat.stop();
  cat.setState("sitting");

  // Quick swipe animation (would be handled by animation system)
  await new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Get behavior duration based on personality and type
 */
export function getBehaviorDuration(
  behavior: BehaviorType,
  energy: number
): number {
  switch (behavior) {
    case "wandering":
      return randomRange(3000, 8000);
    case "resting":
      // Lower energy = longer rest
      return randomRange(4000, 10000) * (1.5 - energy);
    case "playing":
      // Higher energy = longer play
      return randomRange(2000, 6000) * (0.5 + energy);
    case "observing":
      return randomRange(3000, 7000);
    case "exploring":
      return randomRange(5000, 12000);
    case "approaching":
      // Quick approach
      return randomRange(2000, 4000);
    case "consuming":
      // Eating/drinking takes time
      return randomRange(3000, 6000);
    case "chasing":
      // Short bursts of high-speed chasing
      return randomRange(1000, 3000);
    case "batting":
      // Quick swipes
      return randomRange(500, 1000);
    default:
      return 5000;
  }
}
