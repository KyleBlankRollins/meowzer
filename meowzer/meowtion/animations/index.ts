/**
 * Animations module barrel exports
 */

export { baseStyles, injectBaseStyles } from "./styles.js";
export { CatAnimationManager } from "./manager.js";
export type { AnimationElements } from "./types.js";

// Export individual animation functions for advanced usage
export { animateIdle } from "./states/idle.js";
export { animateWalking } from "./states/walking.js";
export { animateRunning } from "./states/running.js";
export { animateSitting } from "./states/sitting.js";
export { animateSleeping } from "./states/sleeping.js";
export { animatePlaying } from "./states/playing.js";
