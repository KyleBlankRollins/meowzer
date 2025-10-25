/**
 * Idle state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate idle state - gentle breathing and tail sway
 */
export function animateIdle(
  elements: AnimationElements
): gsap.core.Tween[] {
  const animations: gsap.core.Tween[] = [];

  // Tail sway (slow, gentle)
  if (elements.tailElement) {
    const anim = gsap.to(elements.tailElement, {
      rotation: 10,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "0% 50%",
    });
    animations.push(anim);
  }

  // Body breathe
  if (elements.bodyElement) {
    const anim = gsap.to(elements.bodyElement, {
      scale: 1.02,
      duration: 4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
    animations.push(anim);
  }

  return animations;
}
