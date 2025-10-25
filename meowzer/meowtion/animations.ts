/**
 * GSAP animations for cat sprites
 */

import gsap from "gsap";
import { css } from "lit";
import type { CatStateType } from "../types.js";

/**
 * Base CSS styles for cat elements (non-animated styles only)
 */
export const baseStyles = css`
  .meowtion-cat {
    position: absolute;
    pointer-events: auto;
    user-select: none;
    will-change: transform;
  }

  .meowtion-cat svg {
    display: block;
  }

  .meowtion-cat-name {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

/**
 * Injects base styles into the document
 */
export function injectBaseStyles(): void {
  if (typeof document === "undefined") return;

  const styleId = "meowtion-base-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = baseStyles.cssText;
  document.head.appendChild(style);
}

/**
 * Animation manager for a single cat
 * Handles GSAP timeline creation and state-based animation switching
 */
export class CatAnimationManager {
  private element: HTMLElement;
  private tailElement: SVGElement | null = null;
  private bodyElement: SVGElement | null = null;
  private svgElement: SVGSVGElement | null = null;
  private headElement: SVGElement | null = null;
  private eyeElements: SVGElement[] = [];
  private legElements: SVGElement[] = []; // [back-left, back-right, front-left, front-right]

  private currentAnimations: gsap.core.Tween[] = [];
  private currentTimelines: gsap.core.Timeline[] = [];

  constructor(element: HTMLElement) {
    this.element = element;
    this._cacheElements();
  }

  /**
   * Cache references to SVG elements we'll animate
   */
  private _cacheElements(): void {
    // Find elements by ID suffix
    const findByIdSuffix = (suffix: string): SVGElement | null => {
      const selector = `[id$="${suffix}"]`;
      return this.element.querySelector(selector);
    };

    this.svgElement = this.element.querySelector("svg");
    this.tailElement = findByIdSuffix("-tail");
    this.bodyElement = findByIdSuffix("-body");
    this.headElement = findByIdSuffix("-head");

    // Find all eye elements
    const eyes = this.element.querySelectorAll('[id$="-eye"]');
    this.eyeElements = Array.from(eyes) as SVGElement[];

    // Find all leg elements in order: back-left, back-right, front-left, front-right
    this.legElements = [
      findByIdSuffix("-leg-back-left"),
      findByIdSuffix("-leg-back-right"),
      findByIdSuffix("-leg-front-left"),
      findByIdSuffix("-leg-front-right"),
    ].filter((el) => el !== null) as SVGElement[];
  }

  /**
   * Start animations for a specific state
   */
  startStateAnimations(state: CatStateType): void {
    // Kill all current animations
    this.stopAllAnimations();

    // Start state-specific animations
    switch (state) {
      case "idle":
        this._animateIdle();
        break;
      case "walking":
        this._animateWalking();
        break;
      case "running":
        this._animateRunning();
        break;
      case "sitting":
        this._animateSitting();
        break;
      case "sleeping":
        this._animateSleeping();
        break;
      case "playing":
        this._animatePlaying();
        break;
    }
  }

  /**
   * Stop all animations
   */
  stopAllAnimations(): void {
    this.currentAnimations.forEach((anim) => anim.kill());
    this.currentAnimations = [];
    this.currentTimelines.forEach((tl) => tl.kill());
    this.currentTimelines = [];
  }

  /**
   * Pause all animations
   */
  pause(): void {
    this.currentAnimations.forEach((anim) => anim.pause());
    this.currentTimelines.forEach((tl) => tl.pause());
  }

  /**
   * Resume all animations
   */
  resume(): void {
    this.currentAnimations.forEach((anim) => anim.resume());
    this.currentTimelines.forEach((tl) => tl.resume());
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.stopAllAnimations();
  }

  // State-specific animation methods

  private _animateIdle(): void {
    // Tail sway (slow, gentle)
    if (this.tailElement) {
      const anim = gsap.to(this.tailElement, {
        rotation: 10,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "0% 50%",
      });
      this.currentAnimations.push(anim);
    }

    // Body breathe
    if (this.bodyElement) {
      const anim = gsap.to(this.bodyElement, {
        scale: 1.02,
        duration: 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center center",
      });
      this.currentAnimations.push(anim);
    }
  }

  private _animateWalking(): void {
    const walkCycle = 0.8; // Slower, more deliberate than running

    // Walking gait: alternating diagonal pairs (walk pattern)
    if (this.legElements.length === 4) {
      const [backLeft, backRight, frontLeft, frontRight] =
        this.legElements;

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

      this.currentTimelines.push(legTimeline);
    }

    // Gentle tail sway
    if (this.tailElement) {
      const anim = gsap.to(this.tailElement, {
        rotation: 10,
        duration: walkCycle,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "0% 50%",
      });
      this.currentAnimations.push(anim);
    }

    // Subtle body bounce
    if (this.svgElement) {
      const anim = gsap.to(this.svgElement, {
        y: -1.5,
        duration: walkCycle / 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      this.currentAnimations.push(anim);
    }
  }

  private _animateRunning(): void {
    // Create a timeline for coordinated running animation
    const runCycle = 0.4; // Duration of one full running cycle

    // Realistic running animation with alternating diagonal pairs
    // In a running gait, diagonal pairs of legs move together (gallop pattern)
    if (this.legElements.length === 4) {
      const [backLeft, backRight, frontLeft, frontRight] =
        this.legElements;

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

      this.currentTimelines.push(legTimeline);
    }

    // Dynamic tail animation - horizontal whipping motion for balance
    if (this.tailElement) {
      const tailTimeline = gsap.timeline({ repeat: -1 });

      tailTimeline
        // Whip left
        .to(this.tailElement, {
          rotation: -25,
          duration: runCycle / 2,
          ease: "power2.inOut",
          transformOrigin: "0% 50%",
        })
        // Whip right
        .to(this.tailElement, {
          rotation: 25,
          duration: runCycle / 2,
          ease: "power2.inOut",
          transformOrigin: "0% 50%",
        });

      this.currentTimelines.push(tailTimeline);
    }

    // Body bounce synchronized with leg movement
    if (this.svgElement) {
      const bodyTimeline = gsap.timeline({ repeat: -1 });

      bodyTimeline
        // Compress down when legs push
        .to(this.svgElement, {
          y: 1,
          scaleY: 0.95,
          duration: runCycle / 4,
          ease: "power2.in",
          transformOrigin: "center bottom",
        })
        // Extend up during flight phase
        .to(this.svgElement, {
          y: -3,
          scaleY: 1.05,
          duration: runCycle / 4,
          ease: "power2.out",
          transformOrigin: "center bottom",
        })
        // Compress down again
        .to(this.svgElement, {
          y: 1,
          scaleY: 0.95,
          duration: runCycle / 4,
          ease: "power2.in",
          transformOrigin: "center bottom",
        })
        // Return to neutral
        .to(this.svgElement, {
          y: 0,
          scaleY: 1,
          duration: runCycle / 4,
          ease: "power2.out",
          transformOrigin: "center bottom",
        });

      this.currentTimelines.push(bodyTimeline);
    }

    // Head bob for realism
    if (this.headElement) {
      const headTimeline = gsap.timeline({ repeat: -1 });

      headTimeline
        .to(this.headElement, {
          y: -1,
          duration: runCycle / 2,
          ease: "sine.inOut",
        })
        .to(this.headElement, {
          y: 1,
          duration: runCycle / 2,
          ease: "sine.inOut",
        });

      this.currentTimelines.push(headTimeline);
    }
  }

  private _animateSitting(): void {
    // Tail sway (medium pace)
    if (this.tailElement) {
      const anim = gsap.to(this.tailElement, {
        rotation: 10,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "0% 50%",
      });
      this.currentAnimations.push(anim);
    }
  }

  private _animateSleeping(): void {
    // Body breathe (slow)
    if (this.bodyElement) {
      const anim = gsap.to(this.bodyElement, {
        scale: 1.02,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center center",
      });
      this.currentAnimations.push(anim);
    }

    // Close eyes
    this.eyeElements.forEach((eye) => {
      gsap.set(eye, {
        scaleY: 0.1,
        transformOrigin: "center center",
      });
    });
  }

  private _animatePlaying(): void {
    // Tail wag (playful)
    if (this.tailElement) {
      const anim = gsap.to(this.tailElement, {
        rotation: 20,
        duration: 0.4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "0% 50%",
      });
      this.currentAnimations.push(anim);
    }

    // Head tilt
    if (this.headElement) {
      const anim = gsap.to(this.headElement, {
        rotation: 5,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center center",
      });
      this.currentAnimations.push(anim);
    }
  }
}
