/**
 * Type definitions for the Meowzer SDK
 */

/**
 * Extensible metadata that can be attached to cats
 * Users can add any custom properties they need
 */
export interface CatMetadata {
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Options for saving a cat
 */
export interface SaveOptions {
  overwrite?: boolean;
}

/**
 * Events emitted by MeowzerCat instances
 * Use as: MeowzerEvent.STATE_CHANGE
 */
export const MeowzerEvent = {
  STATE_CHANGE: "stateChange",
  MOVE: "move",
  BEHAVIOR_CHANGE: "behaviorChange",
  UPDATE: "update",
  PAUSE: "pause",
  RESUME: "resume",
  DESTROY: "destroy",
  MENU_CLICK: "menuClick",
  HAT_APPLIED: "hat-applied",
  HAT_REMOVED: "hat-removed",
  HAT_UPDATED: "hat-updated",
  // Placeholders for future features:
  PICK_UP: "pickUp",
  DROP: "drop",
  PET: "pet",
  OUTFIT_CHANGE: "outfitChange",
} as const;

/**
 * Type for MeowzerCat events
 */
export type MeowzerEventType =
  (typeof MeowzerEvent)[keyof typeof MeowzerEvent];

/**
 * Handler for MeowzerCat events
 */
export type EventHandler = (data: any) => void;

/**
 * Configuration for MeowzerCat creation
 */
export interface MeowzerCatConfig {
  id: string;
  cat: any; // Meowtion Cat instance
  brain: any; // Meowbrain Brain instance
  seed: string;
  name?: string;
  description?: string;
  metadata?: CatMetadata;
}
