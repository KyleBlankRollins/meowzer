/**
 * Foundational primitive types used across all Meowzer packages
 */

/**
 * 2D position in pixels
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 2D velocity in pixels per second
 */
export interface Velocity {
  x: number;
  y: number;
}

/**
 * Rectangular boundaries for movement constraints
 */
export interface Boundaries {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}

/**
 * Generic event handler function
 */
export type EventHandler = (data: any) => void;

/**
 * Easing function for animations
 */
export type EasingFunction = (t: number) => number;

/**
 * SVG viewBox coordinates
 */
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
