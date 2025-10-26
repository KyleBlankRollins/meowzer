/**
 * Meowtion - Animation library for cat sprites
 */

export { Cat } from "./cat.js";
export { CatAnimator } from "./animator.js";
export {
  injectBaseStyles,
  CatAnimationManager,
} from "./animations/index.js";
export { MeowtionContainer } from "./moewtion-container/meowtion-container.js";

import type {
  ProtoCat,
  CatStateType,
  Position,
  Boundaries,
  PhysicsOptions,
} from "../types/index.js";
import { Cat } from "./cat.js";

export interface AnimationOptions {
  container?: HTMLElement;
  initialPosition?: Position;
  initialState?: CatStateType;
  physics?: PhysicsOptions;
  boundaries?: Boundaries;
}

/**
 * Creates an animated Cat instance from a ProtoCat
 * @param protoCat - The cat definition from Meowkit
 * @param options - Optional configuration for behavior and rendering
 */
export function animateCat(
  protoCat: ProtoCat,
  options?: AnimationOptions
): Cat {
  return new Cat(protoCat, options);
}
