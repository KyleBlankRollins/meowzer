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
 * Uses object pooling to avoid creating/destroying animations on state changes
 */
export class CatAnimationManager {
  private element: HTMLElement;
  private elements: AnimationElements;
  private currentAnimations: gsap.core.Tween[] = [];
  private currentTimelines: gsap.core.Timeline[] = [];

  // Animation pools - pre-created animations for each state
  private animationPool: Map<CatStateType, gsap.core.Tween[]> =
    new Map();
  private timelinePool: Map<CatStateType, gsap.core.Timeline[]> =
    new Map();
  private activeState: CatStateType | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.elements = this._cacheElements();
    this._initializeAnimationPool();
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
   * Pre-create all animations for all states
   * Animations are created once and reused by pausing/resuming
   */
  private _initializeAnimationPool(): void {
    const states: CatStateType[] = [
      "idle",
      "walking",
      "running",
      "sitting",
      "sleeping",
      "playing",
    ];

    states.forEach((state) => {
      let animations: gsap.core.Tween[] = [];
      let timelines: gsap.core.Timeline[] = [];

      switch (state) {
        case "idle":
          animations = animateIdle(this.elements);
          break;
        case "walking": {
          const result = animateWalking(this.elements);
          animations = result.animations;
          timelines = result.timelines;
          break;
        }
        case "running": {
          const result = animateRunning(this.elements);
          animations = result.animations;
          timelines = result.timelines;
          break;
        }
        case "sitting":
          animations = animateSitting(this.elements);
          break;
        case "sleeping":
          animations = animateSleeping(this.elements);
          break;
        case "playing":
          animations = animatePlaying(this.elements);
          break;
      }

      // Pause all animations initially
      animations.forEach((anim) => anim.pause());
      timelines.forEach((tl) => tl.pause());

      this.animationPool.set(state, animations);
      this.timelinePool.set(state, timelines);
    });
  }

  /**
   * Start animations for a specific state
   * Uses pooled animations instead of creating new ones
   */
  startStateAnimations(state: CatStateType): void {
    // Pause previous state animations
    if (this.activeState !== null) {
      const prevAnimations = this.animationPool.get(this.activeState);
      const prevTimelines = this.timelinePool.get(this.activeState);

      prevAnimations?.forEach((anim) => anim.pause());
      prevTimelines?.forEach((tl) => tl.pause());
    }

    // Activate new state animations from pool
    this.activeState = state;
    this.currentAnimations = this.animationPool.get(state) || [];
    this.currentTimelines = this.timelinePool.get(state) || [];

    // Restart and resume pooled animations
    this.currentAnimations.forEach((anim) => {
      anim.restart();
      anim.resume();
    });
    this.currentTimelines.forEach((tl) => {
      tl.restart();
      tl.resume();
    });
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
   * Kills all pooled animations
   */
  destroy(): void {
    // Kill all animations in the pool
    this.animationPool.forEach((animations) => {
      animations.forEach((anim) => anim.kill());
    });
    this.timelinePool.forEach((timelines) => {
      timelines.forEach((tl) => tl.kill());
    });

    this.animationPool.clear();
    this.timelinePool.clear();
    this.currentAnimations = [];
    this.currentTimelines = [];
    this.activeState = null;
  }
}
