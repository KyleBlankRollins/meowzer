/**
 * Simple state machine for cat animation states
 */

import type { CatStateType } from "../types/index.js";

export const VALID_TRANSITIONS: Record<CatStateType, CatStateType[]> =
  {
    idle: ["walking", "running", "sitting", "playing", "sleeping"],
    walking: ["idle", "running", "sitting"],
    running: ["idle", "walking"],
    sitting: ["idle", "sleeping"],
    sleeping: ["idle", "sitting"],
    playing: ["idle", "walking"],
  };

export const TRANSITION_DURATIONS: Record<string, number> = {
  "idle-walking": 300,
  "walking-idle": 300,
  "walking-running": 200,
  "running-walking": 200,
  "running-idle": 400,
  "idle-running": 400,
  "idle-sitting": 500,
  "sitting-idle": 500,
  "sitting-sleeping": 2000,
  "sleeping-sitting": 1000,
  "sleeping-idle": 1000,
  "idle-sleeping": 2000,
  "idle-playing": 300,
  "playing-idle": 300,
  "playing-walking": 300,
  "walking-sitting": 500,
};

/**
 * Validates if a state transition is allowed
 */
export function isValidTransition(
  from: CatStateType,
  to: CatStateType
): boolean {
  if (from === to) return true;
  if (to === "idle") return true; // Can always return to idle
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Gets the duration for a state transition
 */
export function getTransitionDuration(
  from: CatStateType,
  to: CatStateType
): number {
  const key = `${from}-${to}`;
  return TRANSITION_DURATIONS[key] ?? 500; // Default 500ms
}

/**
 * Easing function for smooth transitions
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Easing function for natural movement
 */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Easing function for bouncy movement
 */
export function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
