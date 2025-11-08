/**
 * Cat Component Modules
 *
 * Component-based architecture for MeowzerCat.
 * Each component handles a single responsibility:
 * - CatLifecycle: pause/resume/destroy
 * - CatPersistence: save/delete/dirty tracking
 * - CatAccessories: hat management and sprite updates
 * - CatInteractions: need/yarn/laser interactions
 * - CatEvents: event aggregation and forwarding
 */

export { CatLifecycle } from "./cat-lifecycle.js";
export { CatPersistence } from "./cat-persistence.js";
export { CatAccessories } from "./cat-accessories.js";
export { CatInteractions } from "./cat-interactions.js";
export { CatEvents } from "./cat-events.js";

// Re-export types
export type {
  LifecycleEvent,
  LifecycleEventData,
} from "./cat-lifecycle.js";
export type {
  PersistenceEvent,
  PersistenceEventData,
} from "./cat-persistence.js";
export type {
  AccessoryEvent,
  AccessoryEventData,
} from "./cat-accessories.js";
export type {
  InteractionEvent,
  InteractionEventData,
} from "./cat-interactions.js";
