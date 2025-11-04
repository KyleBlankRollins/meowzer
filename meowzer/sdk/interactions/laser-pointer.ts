/**
 * LaserPointer - SDK logic for laser pointer interactions
 *
 * This class handles state management and event emission for laser pointers.
 * The UI package is responsible for rendering the visual laser dot.
 *
 * Phase 1: Manual control only
 * Phase 3: Auto-patterns (circle, zigzag, etc.)
 */

import type {
  Position,
  LaserPattern,
  LaserPatternOptions,
} from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

export type LaserEvent =
  | "moved"
  | "activated"
  | "deactivated"
  | "patternStarted"
  | "patternStopped";

/**
 * LaserPointer class
 *
 * Manages laser pointer state and emits events.
 * UI package listens to events and renders visual representation.
 *
 * @example
 * ```ts
 * const laser = meowzer.createLaserPointer();
 *
 * // Turn on at position
 * laser.turnOn({ x: 500, y: 300 });
 *
 * // Move to new position
 * laser.moveTo({ x: 600, y: 400 });
 *
 * // Listen to events
 * laser.on("moved", (event) => {
 *   console.log("Laser moved to:", event.position);
 * });
 *
 * // Turn off
 * laser.turnOff();
 * ```
 */
export class LaserPointer {
  readonly id: string;
  private _active: boolean = false;
  private _position: Position = { x: 0, y: 0 };
  private _previousPosition?: Position;
  // @ts-expect-error - Will be used in Phase 3 for auto-patterns
  private _pattern?: LaserPattern;
  private _patternAnimation?: number;
  private _events: EventEmitter<LaserEvent>;

  constructor(id: string) {
    this.id = id;
    this._events = new EventEmitter<LaserEvent>();
  }

  /**
   * Check if laser is currently active (turned on)
   */
  get isActive(): boolean {
    return this._active;
  }

  /**
   * Get current laser position
   */
  get position(): Position {
    return { ...this._position };
  }

  /**
   * Turn on the laser at a specific position
   *
   * @param position - Initial position for the laser
   *
   * @example
   * ```ts
   * laser.turnOn({ x: 500, y: 300 });
   * ```
   */
  turnOn(position: Position): void {
    this._active = true;
    this._position = { ...position };
    this._events.emit("activated", {
      id: this.id,
      position: this._position,
      timestamp: Date.now(),
    });
  }

  /**
   * Turn off the laser
   *
   * @example
   * ```ts
   * laser.turnOff();
   * ```
   */
  turnOff(): void {
    this._active = false;
    this.stopPattern();
    this._events.emit("deactivated", {
      id: this.id,
      timestamp: Date.now(),
    });
  }

  /**
   * Move laser to a new position
   *
   * Only works if laser is active. Emits "moved" event with velocity data.
   *
   * @param position - New position for the laser
   *
   * @example
   * ```ts
   * laser.moveTo({ x: 600, y: 400 });
   * ```
   */
  moveTo(position: Position): void {
    if (!this._active) return;

    this._previousPosition = { ...this._position };
    this._position = { ...position };

    const velocity = this._previousPosition
      ? {
          x: position.x - this._previousPosition.x,
          y: position.y - this._previousPosition.y,
        }
      : { x: 0, y: 0 };

    this._events.emit("moved", {
      id: this.id,
      position: this._position,
      previousPosition: this._previousPosition,
      velocity,
      timestamp: Date.now(),
    });
  }

  /**
   * Start an automatic pattern
   *
   * @future Phase 3 - Not implemented in Phase 1
   * @param pattern - Pattern type (circle, zigzag, etc.)
   * @param options - Pattern-specific options
   */
  startPattern(
    pattern: LaserPattern,
    // @ts-expect-error - Will be used in Phase 3 for pattern options
    options?: LaserPatternOptions
  ): void {
    // Phase 1: Manual only, patterns in Phase 3
    console.warn(
      `Auto-patterns not implemented in Phase 1. Pattern "${pattern}" will be available in Phase 3.`
    );
  }

  /**
   * Stop the current automatic pattern
   *
   * @future Phase 3 - Not implemented in Phase 1
   */
  stopPattern(): void {
    if (this._patternAnimation) {
      cancelAnimationFrame(this._patternAnimation);
      this._patternAnimation = undefined;
    }
  }

  /**
   * Listen to laser events
   *
   * @param event - Event name
   * @param handler - Event handler function
   *
   * @example
   * ```ts
   * laser.on("moved", (event) => {
   *   console.log("Laser moved:", event.position);
   * });
   * ```
   */
  on(event: LaserEvent, handler: EventHandler): void {
    this._events.on(event, handler);
  }

  /**
   * Remove event listener
   *
   * @param event - Event name
   * @param handler - Event handler function to remove
   *
   * @example
   * ```ts
   * laser.off("moved", myHandler);
   * ```
   */
  off(event: LaserEvent, handler: EventHandler): void {
    this._events.off(event, handler);
  }

  /**
   * Clean up and destroy the laser pointer
   *
   * Turns off laser and clears all event listeners.
   *
   * @example
   * ```ts
   * laser.destroy();
   * ```
   */
  destroy(): void {
    this.turnOff();
    this._events.clear();
  }
}
