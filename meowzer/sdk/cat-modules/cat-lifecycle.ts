/**
 * CatLifecycle Component
 *
 * Manages cat lifecycle operations: pause, resume, destroy, and active state.
 * This component is responsible for coordinating the cat's animation and AI behavior states.
 */

import type { Cat } from "../../meowtion/cat.js";
import type { Brain } from "../../meowbrain/brain.js";
import { EventEmitter } from "../../utilities/event-emitter.js";

export type LifecycleEvent = "paused" | "resumed" | "destroyed";

export interface LifecycleEventData {
  catId: string;
}

/**
 * Component that manages cat lifecycle (pause/resume/destroy)
 */
export class CatLifecycle extends EventEmitter<LifecycleEvent> {
  private cat: Cat;
  private brain: Brain;
  private catId: string;
  private _isActive: boolean = false;

  constructor(cat: Cat, brain: Brain, catId: string) {
    super();
    this.cat = cat;
    this.brain = brain;
    this.catId = catId;
  }

  /**
   * Get whether the cat is currently active (running)
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Pause the cat's animation and AI behavior
   */
  pause(): void {
    if (!this._isActive) return;

    this.brain.stop();
    this.cat.pause();
    this._isActive = false;

    this.emit("paused", { catId: this.catId });
  }

  /**
   * Resume the cat's animation and AI behavior
   */
  resume(): void {
    if (this._isActive) return;

    this.cat.resume();
    this.brain.start();
    this._isActive = true;

    this.emit("resumed", { catId: this.catId });
  }

  /**
   * Destroy the cat, cleaning up all resources
   */
  destroy(): void {
    this.brain.stop();
    this.brain.destroy();
    this.cat.destroy();
    this._isActive = false;

    this.emit("destroyed", { catId: this.catId });
    this.clear();
  }
}
