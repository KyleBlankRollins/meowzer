/**
 * Interaction Manager for cat needs and toys
 *
 * Handles placement and tracking of:
 * - Food (basic/fancy)
 * - Water
 * - Laser pointer
 * - Other interactive elements
 */

import type { HookManager } from "./hook-manager.js";
import type { CatManager } from "./cat-manager.js";
import type { ConfigManager } from "../config.js";
import type {
  Position,
  NeedTypeIdentifier,
  PlaceNeedOptions,
  NeedResponseType,
} from "../../types/index.js";
import { Need } from "../interactions/need.js";
import { EventEmitter } from "../../utilities/event-emitter.js";
import type { EventHandler } from "../../utilities/event-emitter.js";

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
  private needs: Map<string, Need>;
  private events: EventEmitter<InteractionEventType>;
  private nextId: number = 0;
  private hooks: HookManager;
  // @ts-expect-error - Will be used for cat proximity queries in future phases
  private cats: CatManager;
  private config: ConfigManager;

  constructor(
    hooks: HookManager,
    cats: CatManager,
    config: ConfigManager
  ) {
    this.hooks = hooks;
    this.cats = cats;
    this.config = config;
    this.needs = new Map();
    this.events = new EventEmitter<InteractionEventType>();
  }

  /**
   * Place a need (food/water) in the environment
   *
   * @example
   * ```ts
   * const food = await meowzer.interactions.placeNeed("food:fancy", { x: 500, y: 300 });
   * console.log(`Placed ${food.type} at (${food.position.x}, ${food.position.y})`);
   * ```
   */
  async placeNeed(
    type: NeedTypeIdentifier,
    position: Position,
    options?: PlaceNeedOptions
  ): Promise<Need> {
    // Trigger before hook
    await this.hooks._trigger("beforeNeedPlace", {
      type,
      position,
      options,
    });

    const id = `need-${this.nextId++}-${Date.now()}`;

    // Create need instance
    const need = new Need(id, type, position, {
      duration: options?.duration,
      onRemove: () => {
        this.needs.delete(id);
      },
    });

    this.needs.set(id, need);

    // Trigger after hook
    await this.hooks._trigger("afterNeedPlace", {
      needId: id,
      type,
      position,
      options,
    });

    // Emit event
    this.events.emit("needPlaced", {
      id,
      type,
      position,
      timestamp: need.timestamp,
    });

    return need;
  }

  /**
   * Remove a need from the environment
   */
  async removeNeed(needId: string): Promise<boolean> {
    const need = this.needs.get(needId);
    if (!need) return false;

    // Trigger before hook
    await this.hooks._trigger("beforeNeedRemove", { needId });

    // Remove need
    need.remove();
    this.needs.delete(needId);

    // Trigger after hook
    await this.hooks._trigger("afterNeedRemove", { needId });

    // Emit event
    this.events.emit("needRemoved", {
      id: needId,
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
  getNeedsByType(type: NeedTypeIdentifier): Need[] {
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

    // Track cat as consuming
    if (responseType === "consuming") {
      need._addConsumingCat(catId);
    } else if (
      responseType === "satisfied" ||
      responseType === "ignoring"
    ) {
      need._removeConsumingCat(catId);
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
   * Get needs near a position
   */
  getNeedsNearPosition(position: Position, radius?: number): Need[] {
    const detectionRadius =
      radius ?? this.config.get().interactions.detectionRanges.need;

    return Array.from(this.needs.values()).filter((need) => {
      if (!need.isActive()) return false;

      const dist = Math.hypot(
        need.position.x - position.x,
        need.position.y - position.y
      );
      return dist <= detectionRadius;
    });
  }

  /**
   * Listen to interaction events
   */
  on(event: InteractionEventType, handler: EventHandler): void {
    this.events.on(event, handler);
  }

  /**
   * Stop listening to interaction events
   */
  off(event: InteractionEventType, handler: EventHandler): void {
    this.events.off(event, handler);
  }

  /**
   * Clear all needs
   * @internal
   */
  async _cleanup(): Promise<void> {
    // Remove all needs
    for (const need of this.needs.values()) {
      need.remove();
    }
    this.needs.clear();

    // Clear event handlers
    this.events.clear();
  }

  /**
   * Get debug information
   */
  getDebugInfo(): {
    activeNeeds: number;
    needsByType: Record<string, number>;
    totalConsumingCats: number;
  } {
    const needsByType: Record<string, number> = {};
    let totalConsumingCats = 0;

    this.needs.forEach((need) => {
      if (need.isActive()) {
        needsByType[need.type] = (needsByType[need.type] || 0) + 1;
        totalConsumingCats += need.getConsumingCats().length;
      }
    });

    return {
      activeNeeds: this.needs.size,
      needsByType,
      totalConsumingCats,
    };
  }
}
