/**
 * CatEvents Component
 *
 * Manages event aggregation and forwarding from Cat and Brain to MeowzerCat.
 * This component centralizes all event handling logic.
 */

import type { Cat } from "../../meowtion/cat.js";
import type { Brain } from "../../meowbrain/brain.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { MeowzerEventType, EventHandler } from "../types.js";

/**
 * Component that manages cat event system
 */
export class CatEvents {
  private emitter: EventEmitter<MeowzerEventType>;
  private cat: Cat;
  private brain: Brain;
  private catId: string;

  constructor(cat: Cat, brain: Brain, catId: string) {
    this.emitter = new EventEmitter<MeowzerEventType>();
    this.cat = cat;
    this.brain = brain;
    this.catId = catId;

    this.setupForwarding();
  }

  /**
   * Subscribe to cat events
   *
   * @param event - Event type to listen for
   * @param handler - Event handler function
   *
   * @example
   * ```ts
   * cat.events.on("stateChange", (data) => {
   *   console.log(`Cat ${data.id} changed state to ${data.state}`);
   * });
   * ```
   */
  on(event: MeowzerEventType, handler: EventHandler): void {
    this.emitter.on(event, handler);
  }

  /**
   * Unsubscribe from cat events
   *
   * @param event - Event type to stop listening for
   * @param handler - Event handler to remove
   *
   * @example
   * ```ts
   * cat.events.off("stateChange", myHandler);
   * ```
   */
  off(event: MeowzerEventType, handler: EventHandler): void {
    this.emitter.off(event, handler);
  }

  /**
   * Emit a custom event
   * @internal
   */
  emit(event: MeowzerEventType, data: any): void {
    this.emitter.emit(event, data);
  }

  /**
   * Setup event forwarding from Cat and Brain
   */
  private setupForwarding(): void {
    // Forward Cat state changes
    this.cat.on("stateChange", (data) => {
      this.emitter.emit("stateChange", {
        id: this.catId,
        state: data.newState,
      });
    });

    // Forward Brain behavior changes
    this.brain.on("behaviorChange", (data) => {
      this.emitter.emit("behaviorChange", {
        id: this.catId,
        behavior: data.newBehavior,
      });
    });
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.emitter.clear();
  }
}
