/**
 * Walking state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate walking state - 4-beat gait with leg movement, tail sway, and body bounce
 */
export function animateWalking(elements: AnimationElements): {
  animations: gsap.core.Tween[];
  timelines: gsap.core.Timeline[];
} {
  const animations: gsap.core.Tween[] = [];
  const timelines: gsap.core.Timeline[] = [];
  const walkCycle = 0.8; // Slower, more deliberate than running

  // Walking gait: alternating diagonal pairs (walk pattern)
  if (elements.legElements.length === 4) {
    const [backLeft, backRight, frontLeft, frontRight] =
      elements.legElements;

    console.log(">> 4 leg elements found");

    const legTimeline = gsap.timeline({ repeat: -1 });

    // Walking uses a 4-beat gait: back-left, front-right, back-right, front-left
    legTimeline
      // Back left forward
      .to(
        backLeft,
        {
          y: -4,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        0
      )
      .to(
        backLeft,
        {
          y: 0,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle / 4
      )

      // Front right forward (offset from back left)
      .to(
        frontRight,
        {
          y: -4,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle / 8
      )
      .to(
        frontRight,
        {
          y: 0,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle * 0.375
      )

      // Back right forward
      .to(
        backRight,
        {
          y: -4,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle * 0.5
      )
      .to(
        backRight,
        {
          y: 0,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle * 0.75
      )

      // Front left forward (offset from back right)
      .to(
        frontLeft,
        {
          y: -4,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle * 0.625
      )
      .to(
        frontLeft,
        {
          y: 0,
          duration: walkCycle / 4,
          ease: "sine.inOut",
        },
        walkCycle * 0.875
      );

    console.log("leg timeline: ", legTimeline);

    timelines.push(legTimeline);
  }

  // Gentle tail sway
  if (elements.tailElement) {
    const anim = gsap.to(elements.tailElement, {
      rotation: 10,
      duration: walkCycle,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "0% 50%",
    });
    animations.push(anim);
  }

  // Subtle body bounce
  if (elements.svgElement) {
    const anim = gsap.to(elements.svgElement, {
      y: -1.5,
      duration: walkCycle / 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    animations.push(anim);
  }

  return { animations, timelines };
}
