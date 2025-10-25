/**
 * Running state animations
 */

import gsap from "gsap";
import type { AnimationElements } from "../types.js";

/**
 * Animate running state - gallop pattern with coordinated leg movement, tail whip, and dynamic body bounce
 */
export function animateRunning(elements: AnimationElements): {
  animations: gsap.core.Tween[];
  timelines: gsap.core.Timeline[];
} {
  const animations: gsap.core.Tween[] = [];
  const timelines: gsap.core.Timeline[] = [];
  const runCycle = 0.4; // Duration of one full running cycle

  // Realistic running animation with alternating diagonal pairs
  // In a running gait, diagonal pairs of legs move together (gallop pattern)
  if (elements.legElements.length === 4) {
    const [backLeft, backRight, frontLeft, frontRight] =
      elements.legElements;

    // Timeline for coordinated leg movement
    const legTimeline = gsap.timeline({ repeat: -1 });

    // Phase 1: Back left & front right forward, others back (0-0.2s)
    legTimeline
      .to(
        [backLeft, frontRight],
        {
          y: -6,
          duration: runCycle / 4,
          ease: "power2.out",
        },
        0
      )
      .to(
        [backRight, frontLeft],
        {
          y: 2,
          duration: runCycle / 4,
          ease: "power2.in",
        },
        0
      )

      // Phase 2: Return to neutral (0.2-0.3s)
      .to(
        [backLeft, frontRight],
        {
          y: 0,
          duration: runCycle / 8,
          ease: "power2.in",
        },
        runCycle / 4
      )
      .to(
        [backRight, frontLeft],
        {
          y: 0,
          duration: runCycle / 8,
          ease: "power2.out",
        },
        runCycle / 4
      )

      // Phase 3: Back right & front left forward, others back (0.3-0.5s)
      .to(
        [backRight, frontLeft],
        {
          y: -6,
          duration: runCycle / 4,
          ease: "power2.out",
        },
        runCycle * 0.375
      )
      .to(
        [backLeft, frontRight],
        {
          y: 2,
          duration: runCycle / 4,
          ease: "power2.in",
        },
        runCycle * 0.375
      )

      // Phase 4: Return to neutral (0.5-0.6s)
      .to(
        [backRight, frontLeft],
        {
          y: 0,
          duration: runCycle / 8,
          ease: "power2.in",
        },
        runCycle * 0.625
      )
      .to(
        [backLeft, frontRight],
        {
          y: 0,
          duration: runCycle / 8,
          ease: "power2.out",
        },
        runCycle * 0.625
      );

    timelines.push(legTimeline);
  }

  // Dynamic tail animation - horizontal whipping motion for balance
  if (elements.tailElement) {
    const tailTimeline = gsap.timeline({ repeat: -1 });

    tailTimeline
      // Whip left
      .to(elements.tailElement, {
        rotation: -25,
        duration: runCycle / 2,
        ease: "power2.inOut",
        transformOrigin: "0% 50%",
      })
      // Whip right
      .to(elements.tailElement, {
        rotation: 25,
        duration: runCycle / 2,
        ease: "power2.inOut",
        transformOrigin: "0% 50%",
      });

    timelines.push(tailTimeline);
  }

  // Body bounce synchronized with leg movement
  if (elements.svgElement) {
    const bodyTimeline = gsap.timeline({ repeat: -1 });

    bodyTimeline
      // Compress down when legs push
      .to(elements.svgElement, {
        y: 1,
        scaleY: 0.95,
        duration: runCycle / 4,
        ease: "power2.in",
        transformOrigin: "center bottom",
      })
      // Extend up during flight phase
      .to(elements.svgElement, {
        y: -3,
        scaleY: 1.05,
        duration: runCycle / 4,
        ease: "power2.out",
        transformOrigin: "center bottom",
      })
      // Compress down again
      .to(elements.svgElement, {
        y: 1,
        scaleY: 0.95,
        duration: runCycle / 4,
        ease: "power2.in",
        transformOrigin: "center bottom",
      })
      // Return to neutral
      .to(elements.svgElement, {
        y: 0,
        scaleY: 1,
        duration: runCycle / 4,
        ease: "power2.out",
        transformOrigin: "center bottom",
      });

    timelines.push(bodyTimeline);
  }

  // Head bob for realism
  if (elements.headElement) {
    const headTimeline = gsap.timeline({ repeat: -1 });

    headTimeline
      .to(elements.headElement, {
        y: -1,
        duration: runCycle / 2,
        ease: "sine.inOut",
      })
      .to(elements.headElement, {
        y: 1,
        duration: runCycle / 2,
        ease: "sine.inOut",
      });

    timelines.push(headTimeline);
  }

  return { animations, timelines };
}
