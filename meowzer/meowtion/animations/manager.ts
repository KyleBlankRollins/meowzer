/**
 * Animation manager for cat sprites
 * Handles GSAP timeline creation and state-based animation switching
 */

// @ts-ignore - gsap is used for type annotations (gsap.core.Tween, gsap.core.Timeline)
import gsap from "gsap";
import type { CatStateType } from "../../types/index.js";
import type { AnimationElements } from "./types.js";
import { animateIdle } from "./states/idle.js";
import { animateWalking } from "./states/walking.js";
import { animateRunning } from "./states/running.js";
import { animateSitting } from "./states/sitting.js";
import { animateSleeping } from "./states/sleeping.js";
import { animatePlaying } from "./states/playing.js";

/**
 * Animation manager for a single cat
 * Delegates to state-specific animation modules
 */
export class CatAnimationManager {
  private element: HTMLElement;
  private elements: AnimationElements;
  private currentAnimations: gsap.core.Tween[] = [];
  private currentTimelines: gsap.core.Timeline[] = [];

  constructor(element: HTMLElement) {
    this.element = element;
    this.elements = this._cacheElements();
  }

  /**
   * Cache references to SVG elements we'll animate
   */
  private _cacheElements(): AnimationElements {
    // Find elements by ID suffix
    const findByIdSuffix = (suffix: string): SVGElement | null => {
      const selector = `[id$="${suffix}"]`;
      return this.element.querySelector(selector);
    };

    const svgElement = this.element.querySelector("svg");

    // Find all eye elements
    const eyes = this.element.querySelectorAll('[id$="-eye"]');
    const eyeElements = Array.from(eyes) as SVGElement[];

    // Find all leg elements in order: back-left, back-right, front-left, front-right
    const legElements = [
      findByIdSuffix("-leg-back-left"),
      findByIdSuffix("-leg-back-right"),
      findByIdSuffix("-leg-front-left"),
      findByIdSuffix("-leg-front-right"),
    ].filter((el) => el !== null) as SVGElement[];

    return {
      tailElement: findByIdSuffix("-tail"),
      bodyElement: findByIdSuffix("-body"),
      svgElement,
      headElement: findByIdSuffix("-head"),
      eyeElements,
      legElements,
    };
  }

  /**
   * Start animations for a specific state
   */
  startStateAnimations(state: CatStateType): void {
    // Kill all current animations
    this.stopAllAnimations();

    // Delegate to state-specific animation modules
    switch (state) {
      case "idle": {
        const animations = animateIdle(this.elements);
        this.currentAnimations.push(...animations);
        break;
      }
      case "walking": {
        const { animations, timelines } = animateWalking(
          this.elements
        );
        this.currentAnimations.push(...animations);
        this.currentTimelines.push(...timelines);
        break;
      }
      case "running": {
        const { animations, timelines } = animateRunning(
          this.elements
        );
        this.currentAnimations.push(...animations);
        this.currentTimelines.push(...timelines);
        break;
      }
      case "sitting": {
        const animations = animateSitting(this.elements);
        this.currentAnimations.push(...animations);
        break;
      }
      case "sleeping": {
        const animations = animateSleeping(this.elements);
        this.currentAnimations.push(...animations);
        break;
      }
      case "playing": {
        const animations = animatePlaying(this.elements);
        this.currentAnimations.push(...animations);
        break;
      }
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
}
