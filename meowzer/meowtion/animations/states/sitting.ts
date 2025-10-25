/**
 * Sitting state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate sitting state - medium-pace tail sway
 */
export function animateSitting(
  elements: AnimationElements
): gsap.core.Tween[] {
  const animations: gsap.core.Tween[] = [];

  // Tail sway (medium pace)
  if (elements.tailElement) {
    const anim = gsap.to(elements.tailElement, {
      rotation: 10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "0% 50%",
    });
    animations.push(anim);
  }

  return animations;
}
