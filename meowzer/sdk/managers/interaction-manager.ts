/**
 * Interaction Manager for cat needs and toys
 *
 * Handles placement and tracking of:
 * - Food (basic/fancy)
 * - Water
 * - Laser pointer
 * - Other interactive elements
 *
 * Uses SpatialGrid for efficient proximity detection
 */

import { SpatialGrid } from "./spatial-grid.js";
import type { MeowzerCat } from "../meowzer-cat.js";
import type { Position } from "../../types/index.js";
import { EventEmitter } from "../../utilities/event-emitter.js";

/**
 * Need types for food and water
 */
export type NeedType = "food:basic" | "food:fancy" | "water";

/**
 * Cat response types to needs
 */
export type NeedResponseType =
  | "interested"
  | "approaching"
  | "consuming"
  | "ignoring"
  | "satisfied";

/**
 * Options for placing a need
 */
export interface PlaceNeedOptions {
  duration?: number; // Auto-remove after duration (ms), unlimited if not set
  detectionRadius?: number; // How far cats can detect this need (default: 150)
}

/**
 * Need instance in the environment
 */
export interface Need {
  id: string;
  type: NeedType;
  position: Position;
  timestamp: number;
  duration?: number;
  detectionRadius: number;
  respondingCats: Set<string>; // Cat IDs currently responding
}

/**
 * Event data for need placement
 */
export interface NeedPlacedEvent {
  id: string;
  type: NeedType;
  position: Position;
  timestamp: number;
}

/**
 * Event data for cat responding to need
 */
export interface NeedResponseEvent {
  catId: string;
  needId: string;
  responseType: NeedResponseType;
  timestamp: number;
}

/**
 * Interaction event types
 */
export type InteractionEventType =
  | "needPlaced"
  | "needRemoved"
  | "needResponse";

/**
 * Manages interactive elements (food, water, toys) and cat responses
 */
export class InteractionManager {
  private spatialGrid: SpatialGrid;
  private needs: Map<string, Need>;
  private events: EventEmitter<InteractionEventType>;
  private autoRemoveTimers: Map<string, number>;
  private nextId: number = 0;

  constructor(spatialGrid: SpatialGrid) {
    this.spatialGrid = spatialGrid;
    this.needs = new Map();
    this.events = new EventEmitter<InteractionEventType>();
    this.autoRemoveTimers = new Map();
  }

  /**
   * Place a need (food/water) in the environment
   *
   * @example
   * ```ts
   * const food = interactionManager.placeNeed("food:fancy", { x: 500, y: 300 });
   * console.log(`Placed ${food.type} at (${food.position.x}, ${food.position.y})`);
   * ```
   */
  placeNeed(
    type: NeedType,
    position: Position,
    options: PlaceNeedOptions = {}
  ): Need {
    const id = `need-${this.nextId++}`;
    const timestamp = Date.now();
    const detectionRadius = options.detectionRadius ?? 150;

    const need: Need = {
      id,
      type,
      position,
      timestamp,
      duration: options.duration,
      detectionRadius,
      respondingCats: new Set(),
    };

    this.needs.set(id, need);

    // Setup auto-removal if duration specified
    if (options.duration) {
      const timer = window.setTimeout(() => {
        this.removeNeed(id);
      }, options.duration);
      this.autoRemoveTimers.set(id, timer);
    }

    // Emit event
    this.events.emit("needPlaced", {
      id,
      type,
      position,
      timestamp,
    });

    // Notify nearby cats
    this._notifyNearbyCats(need);

    return need;
  }

  /**
   * Remove a need from the environment
   */
  removeNeed(needId: string): boolean {
    const need = this.needs.get(needId);
    if (!need) return false;

    // Clear auto-remove timer if exists
    const timer = this.autoRemoveTimers.get(needId);
    if (timer) {
      window.clearTimeout(timer);
      this.autoRemoveTimers.delete(needId);
    }

    this.needs.delete(needId);

    this.events.emit("needRemoved", {
      id: needId,
      type: need.type,
      position: need.position,
      timestamp: Date.now(),
    } as any);

    return true;
  }

  /**
   * Get a need by ID
   */
  getNeed(needId: string): Need | undefined {
    return this.needs.get(needId);
  }

  /**
   * Get all active needs
   */
  getAllNeeds(): Need[] {
    return Array.from(this.needs.values());
  }

  /**
   * Get needs by type
   */
  getNeedsByType(type: NeedType): Need[] {
    return Array.from(this.needs.values()).filter(
      (n) => n.type === type
    );
  }

  /**
   * Check if a need is still active
   */
  isNeedActive(needId: string): boolean {
    return this.needs.has(needId);
  }

  /**
   * Register a cat's response to a need
   * @internal Called by MeowzerCat.respondToNeed()
   */
  _registerCatResponse(
    catId: string,
    needId: string,
    responseType: NeedResponseType
  ): void {
    const need = this.needs.get(needId);
    if (!need) return;

    // Track cat as responding
    if (
      responseType === "interested" ||
      responseType === "approaching" ||
      responseType === "consuming"
    ) {
      need.respondingCats.add(catId);
    } else if (
      responseType === "satisfied" ||
      responseType === "ignoring"
    ) {
      need.respondingCats.delete(catId);
    }

    // Emit response event
    this.events.emit("needResponse", {
      catId,
      needId,
      responseType,
      timestamp: Date.now(),
    });
  }

  /**
   * Find cats near a specific need
   */
  findCatsNearNeed(needId: string): MeowzerCat[] {
    const need = this.needs.get(needId);
    if (!need) return [];

    return this.spatialGrid.findCatsInRadius(
      need.position,
      need.detectionRadius
    );
  }

  /**
   * Find needs near a specific position
   */
  findNeedsNearPosition(position: Position, radius: number): Need[] {
    return Array.from(this.needs.values()).filter((need) => {
      const dx = need.position.x - position.x;
      const dy = need.position.y - position.y;
      const distSq = dx * dx + dy * dy;
      return distSq <= radius * radius;
    });
  }

  /**
   * Subscribe to interaction events
   */
  on(
    event: InteractionEventType,
    handler: (data: any) => void
  ): void {
    this.events.on(event, handler);
  }

  /**
   * Unsubscribe from interaction events
   */
  off(
    event: InteractionEventType,
    handler: (data: any) => void
  ): void {
    this.events.off(event, handler);
  }

  /**
   * Clear all needs and timers
   */
  clear(): void {
    // Clear all timers
    this.autoRemoveTimers.forEach((timer) =>
      window.clearTimeout(timer)
    );
    this.autoRemoveTimers.clear();

    this.needs.clear();
  }

  /**
   * Notify nearby cats about a newly placed need
   * Uses spatial grid for efficient proximity detection
   * @private
   */
  private _notifyNearbyCats(need: Need): void {
    const nearbyCats = this.spatialGrid.findCatsInRadius(
      need.position,
      need.detectionRadius
    );

    // Cats will evaluate the need based on their personality/state
    // This is handled by MeowzerCat.respondToNeed() which will be
    // implemented in Phase 3 when full interaction logic is added
    nearbyCats.forEach((cat) => {
      // For now, just emit that cats are aware
      // Full implementation will call: cat.respondToNeed(need.id)
      console.log(
        `Cat ${cat.id} is aware of ${need.type} at`,
        need.position
      );
    });
  }

  /**
   * Get debug information
   */
  getDebugInfo(): {
    activeNeeds: number;
    needsByType: Record<string, number>;
    totalRespondingCats: number;
  } {
    const needsByType: Record<string, number> = {};
    let totalRespondingCats = 0;

    this.needs.forEach((need) => {
      needsByType[need.type] = (needsByType[need.type] || 0) + 1;
      totalRespondingCats += need.respondingCats.size;
    });

    return {
      activeNeeds: this.needs.size,
      needsByType,
      totalRespondingCats,
    };
  }
}
