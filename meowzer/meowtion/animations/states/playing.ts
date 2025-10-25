/**
 * Playing state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate playing state - playful tail wag and head tilt
 */
export function animatePlaying(
  elements: AnimationElements
): gsap.core.Tween[] {
  const animations: gsap.core.Tween[] = [];

  // Tail wag (playful)
  if (elements.tailElement) {
    const anim = gsap.to(elements.tailElement, {
      rotation: 20,
      duration: 0.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "0% 50%",
    });
    animations.push(anim);
  }

  // Head tilt
  if (elements.headElement) {
    const anim = gsap.to(elements.headElement, {
      rotation: 5,
      duration: 0.8,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
    animations.push(anim);
  }

  return animations;
}
