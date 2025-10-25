/**
 * Sleeping state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate sleeping state - slow breathing and closed eyes
 */
export function animateSleeping(
  elements: AnimationElements
): gsap.core.Tween[] {
  const animations: gsap.core.Tween[] = [];

  // Body breathe (slow)
  if (elements.bodyElement) {
    const anim = gsap.to(elements.bodyElement, {
      scale: 1.02,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
    animations.push(anim);
  }

  // Close eyes
  elements.eyeElements.forEach((eye: SVGElement) => {
    gsap.set(eye, {
      scaleY: 0.1,
      transformOrigin: "center center",
    });
  });

  return animations;
}
