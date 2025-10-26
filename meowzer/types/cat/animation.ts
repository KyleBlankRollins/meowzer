/**
 * Animation and state types (Meowtion)
 */

import type { Position, Boundaries } from "../primitives.js";

/**
 * Animation state types
 */
export type CatStateType =
  | "idle"
  | "walking"
  | "running"
  | "sitting"
  | "sleeping"
  | "playing";

/**
 * Current animation state
 */
export interface CatState {
  type: CatStateType;
  startTime: number;
  loop: boolean;
}

/**
 * Events emitted by animated cats
 */
export type CatEvent =
  | "stateChange"
  | "moveStart"
  | "moveEnd"
  | "boundaryHit";

/**
 * Options for path-based movement
 */
export interface PathOptions {
  curviness?: number;
  autoRotate?: boolean;
  ease?: string;
}

/**
 * Physics configuration for movement
 */
export interface PhysicsOptions {
  gravity?: boolean;
  friction?: number;
  maxSpeed?: number;
}

/**
 * Animation configuration options
 */
export interface AnimationOptions {
  container?: HTMLElement;
  initialPosition?: Position;
  initialState?: CatStateType;
  physics?: PhysicsOptions;
  boundaries?: Boundaries;
}

/**
 * State transition configuration
 */
export interface StateTransition {
  from: CatStateType;
  to: CatStateType;
  duration: number;
  easing?: (t: number) => number;
}
