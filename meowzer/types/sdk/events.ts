/**
 * SDK event types and handlers
 */

/**
 * Events emitted by MeowzerCat instances
 */
export const MeowzerEvent = {
  STATE_CHANGE: "stateChange",
  MOVE: "move",
  BEHAVIOR_CHANGE: "behaviorChange",
  UPDATE: "update",
  PAUSE: "pause",
  RESUME: "resume",
  DESTROY: "destroy",
} as const;

/**
 * Type for MeowzerCat events
 */
export type MeowzerEventType =
  (typeof MeowzerEvent)[keyof typeof MeowzerEvent];

/**
 * Event handler function
 */
export type EventHandler = (data: any) => void;
