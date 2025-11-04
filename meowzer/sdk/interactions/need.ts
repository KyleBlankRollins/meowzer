/**
 * Need class - Represents a placed need (food/water) in the environment
 */

import type {
  Position,
  NeedTypeIdentifier,
} from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

export type NeedEvent = "consumed" | "removed";

/**
 * Need class for food and water items
 */
export class Need {
  readonly id: string;
  readonly type: NeedTypeIdentifier;
  readonly position: Position;
  readonly timestamp: number;

  private _active: boolean = true;
  private _consumingCats: Set<string> = new Set();
  private _events: EventEmitter<NeedEvent>;
  private _removalTimeout?: ReturnType<typeof setTimeout>;
  private _onRemove?: () => void;

  constructor(
    id: string,
    type: NeedTypeIdentifier,
    position: Position,
    options?: {
      duration?: number;
      onRemove?: () => void;
    }
  ) {
    this.id = id;
    this.type = type;
    this.position = { ...position };
    this.timestamp = Date.now();
    this._events = new EventEmitter<NeedEvent>();
    this._onRemove = options?.onRemove;

    // Set up auto-removal if duration specified
    if (options?.duration && options.duration > 0) {
      this._removalTimeout = setTimeout(() => {
        this.remove();
      }, options.duration);
    }
  }

  /**
   * Check if need is still active
   */
  isActive(): boolean {
    return this._active;
  }

  /**
   * Get list of cats currently consuming this need
   */
  getConsumingCats(): string[] {
    return Array.from(this._consumingCats);
  }

  /**
   * Mark a cat as consuming this need
   * @internal
   */
  _addConsumingCat(catId: string): void {
    this._consumingCats.add(catId);
    this._events.emit("consumed", {
      needId: this.id,
      catId,
      timestamp: Date.now(),
    });
  }

  /**
   * Mark a cat as finished consuming
   * @internal
   */
  _removeConsumingCat(catId: string): void {
    this._consumingCats.delete(catId);
  }

  /**
   * Remove this need from the environment
   */
  remove(): void {
    if (!this._active) return;

    this._active = false;

    // Clear auto-removal timeout if set
    if (this._removalTimeout) {
      clearTimeout(this._removalTimeout);
      this._removalTimeout = undefined;
    }

    // Notify listeners
    this._events.emit("removed", {
      needId: this.id,
      timestamp: Date.now(),
    });

    // Call removal callback if provided
    if (this._onRemove) {
      this._onRemove();
    }

    // Clear event handlers
    this._events.clear();
  }

  /**
   * Listen to need events
   */
  on(event: NeedEvent, handler: EventHandler): void {
    this._events.on(event, handler);
  }

  /**
   * Stop listening to need events
   */
  off(event: NeedEvent, handler: EventHandler): void {
    this._events.off(event, handler);
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      timestamp: this.timestamp,
      active: this._active,
      consumingCats: Array.from(this._consumingCats),
    };
  }
}
