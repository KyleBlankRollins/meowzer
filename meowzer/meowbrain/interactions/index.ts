/**
 * Interaction system - Detection and reaction to interactions
 */

export { InteractionDetector } from "./interaction-detector.js";
export type {
  NearbyNeed,
  NearbyYarn,
  DetectionConfig,
} from "./interaction-detector.js";

export { InteractionListener } from "./interaction-listener.js";
export type { InteractionEvent } from "./interaction-listener.js";

export { InterestEvaluator } from "./interest-evaluator.js";
export type { InteractionTarget } from "./interest-evaluator.js";
