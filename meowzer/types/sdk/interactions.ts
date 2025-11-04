/**
 * Interaction types for cat interactions system
 */

import type { Position } from "../primitives.js";

// ============================================================================
// NEED TYPES
// ============================================================================

/**
 * Types of needs that can be placed in the environment
 */
export type NeedTypeIdentifier =
  | "food:basic"
  | "food:fancy"
  | "water";

/**
 * Options for placing a need
 */
export interface PlaceNeedOptions {
  /** How long the item remains before auto-removal (ms). Default: unlimited */
  duration?: number;
}

/**
 * A need instance placed in the environment
 */
export interface NeedData {
  /** Unique identifier for this need instance */
  id: string;
  /** Type of need */
  type: NeedTypeIdentifier;
  /** Position in the environment */
  position: Position;
  /** Timestamp when need was placed */
  timestamp: number;
  /** Whether the need is still active */
  active: boolean;
  /** IDs of cats currently consuming this need */
  consumingCats: Set<string>;
}

/**
 * Event emitted when a need is placed
 */
export interface NeedPlacedEvent {
  /** Unique ID for this need instance */
  id: string;
  /** Type of need */
  type: NeedTypeIdentifier;
  /** Position where need was placed */
  position: Position;
  /** Timestamp when placed */
  timestamp: number;
}

/**
 * Event emitted when a need is removed
 */
export interface NeedRemovedEvent {
  /** ID of removed need */
  id: string;
  /** Type of need */
  type: NeedTypeIdentifier;
  /** Timestamp when removed */
  timestamp: number;
}

/**
 * Types of cat responses to needs
 */
export type NeedResponseType =
  | "interested"
  | "approaching"
  | "consuming"
  | "ignoring"
  | "satisfied";

/**
 * Event emitted when a cat responds to a need
 */
export interface NeedResponseEvent {
  /** ID of the cat responding */
  catId: string;
  /** ID of the need */
  needId: string;
  /** Type of response */
  responseType: NeedResponseType;
  /** Timestamp of response */
  timestamp: number;
}

// ============================================================================
// LASER POINTER TYPES
// ============================================================================

/**
 * Laser pointer movement patterns
 */
export type LaserPattern = "manual" | "random" | "circle" | "zigzag";

/**
 * Options for laser patterns
 */
export interface LaserPatternOptions {
  /** Speed of movement (0-1) */
  speed?: number;
  /** Radius for circular patterns */
  radius?: number;
  /** Duration before pattern stops (ms) */
  duration?: number;
}

/**
 * Event emitted when laser pointer moves
 */
export interface LaserMovedEvent {
  /** Laser pointer instance ID */
  id: string;
  /** Current position */
  position: Position;
  /** Previous position */
  previousPosition?: Position;
  /** Velocity (speed and direction) */
  velocity: { x: number; y: number };
  /** Timestamp */
  timestamp: number;
}

/**
 * Types of cat responses to laser pointer
 */
export type LaserResponseType =
  | "noticed"
  | "stalking"
  | "pouncing"
  | "chasing"
  | "lost-interest";

/**
 * Event emitted when a cat responds to laser pointer
 */
export interface LaserResponseEvent {
  /** ID of the cat responding */
  catId: string;
  /** ID of the laser pointer */
  laserId: string;
  /** Type of response */
  responseType: LaserResponseType;
  /** Attention level (0-1, how focused) */
  attentionLevel: number;
  /** Timestamp of response */
  timestamp: number;
}

// ============================================================================
// YARN TYPES
// ============================================================================

/**
 * State of a yarn ball
 */
export type YarnState = "idle" | "dragging" | "rolling";

/**
 * Options for placing yarn
 */
export interface YarnOptions {
  /** How long the yarn remains before auto-removal (ms). Default: unlimited */
  duration?: number;
  /** Physics friction coefficient (default: 0.95) */
  friction?: number;
}

/**
 * Event emitted when yarn is placed
 */
export interface YarnPlacedEvent {
  /** Unique ID for this yarn instance */
  id: string;
  /** Position where yarn was placed */
  position: Position;
  /** Timestamp when placed */
  timestamp: number;
}

/**
 * Event emitted when yarn is moved
 */
export interface YarnMovedEvent {
  /** Yarn instance ID */
  id: string;
  /** Current position */
  position: Position;
  /** Current state */
  state: YarnState;
  /** Current velocity */
  velocity?: { x: number; y: number };
  /** Timestamp */
  timestamp: number;
}

/**
 * Event emitted when yarn is removed
 */
export interface YarnRemovedEvent {
  /** ID of removed yarn */
  id: string;
  /** Timestamp when removed */
  timestamp: number;
}

/**
 * Types of cat responses to yarn
 */
export type YarnResponseType =
  | "noticed"
  | "batting"
  | "pouncing"
  | "carrying"
  | "playing"
  | "ignoring";

/**
 * Event emitted when a cat responds to yarn
 */
export interface YarnResponseEvent {
  /** ID of the cat responding */
  catId: string;
  /** ID of the yarn */
  yarnId: string;
  /** Type of response */
  responseType: YarnResponseType;
  /** Duration of interaction (optional) */
  duration?: number;
  /** Timestamp of response */
  timestamp: number;
}

// ============================================================================
// INTERACTION CONFIGURATION
// ============================================================================

/**
 * Detection ranges for different interaction types
 */
export interface DetectionRanges {
  /** Detection range for needs (px) */
  need: number;
  /** Detection range for laser pointer (px) */
  laser: number;
  /** Detection range for RC car (px) */
  rcCar: number;
  /** Detection range for yarn (px) */
  yarn: number;
}

/**
 * Response rates for different need types
 */
export interface ResponseRates {
  /** Base response rate for basic food (0-1) */
  basicFood: number;
  /** Base response rate for fancy food (0-1) */
  fancyFood: number;
  /** Base response rate for water (0-1) */
  water: number;
}

/**
 * Interaction system configuration
 */
export interface InteractionConfig {
  /** Whether interactions are enabled */
  enabled: boolean;
  /** Detection ranges for different interaction types */
  detectionRanges: DetectionRanges;
  /** Base response rates for needs */
  responseRates: ResponseRates;
}

// ============================================================================
// INTERACTION EVENTS
// ============================================================================

/**
 * Base interaction event
 */
export interface InteractionEvent {
  /** ID of the cat */
  catId: string;
  /** ID of the interaction object */
  interactionId: string;
  /** Type of interaction */
  type: "need" | "laser" | "rcCar" | "yarn";
  /** Timestamp */
  timestamp: number;
}
