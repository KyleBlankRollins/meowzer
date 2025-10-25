/**
 * MeowzerCat - High-level wrapper combining Cat + Brain + Metadata
 *
 * This is the main object users interact with. It coordinates:
 * - Meowtion (Cat) for animation
 * - Meowbrain (Brain) for AI behavior
 * - Metadata for persistence
 */

import type { Cat } from "../meowtion/cat.js";
import type { Brain } from "../meowbrain/brain.js";
import type {
  Position,
  CatStateType,
  Personality,
  PersonalityPreset,
  Environment,
  MeowzerEvent,
  EventHandler,
} from "../types.js";

export interface MeowzerCatConfig {
  id: string;
  seed: string;
  cat: Cat;
  brain: Brain;
}

export class MeowzerCat {
  readonly id: string;
  readonly seed: string;
  readonly element: HTMLElement;

  private _cat: Cat;
  private _brain: Brain;
  private _isActive: boolean = false;
  private _eventHandlers: Map<MeowzerEvent, Set<EventHandler>> =
    new Map();

  constructor(config: MeowzerCatConfig) {
    this.id = config.id;
    this.seed = config.seed;
    this._cat = config.cat;
    this._brain = config.brain;
    this.element = config.cat.element;

    // Forward events from cat and brain
    this._setupEventForwarding();
  }

  // ============================================================================
  // READ-ONLY STATE
  // ============================================================================

  get position(): Position {
    return { ...this._cat.position };
  }

  get state(): CatStateType {
    return this._cat.state.type;
  }

  get personality(): Personality {
    return { ...this._brain.state.motivation } as any; // TODO: Fix this to return actual personality
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get name(): string | undefined {
    return this._cat.protoCat.name;
  }

  // ============================================================================
  // LIFECYCLE METHODS
  // ============================================================================

  pause(): void {
    if (!this._isActive) return;

    this._brain.stop();
    this._cat.pause();
    this._isActive = false;
    this._emit("pause", { id: this.id });
  }

  resume(): void {
    if (this._isActive) return;

    this._cat.resume();
    this._brain.start();
    this._isActive = true;
    this._emit("resume", { id: this.id });
  }

  destroy(): void {
    this._brain.stop();
    this._brain.destroy();
    this._cat.destroy();
    this._isActive = false;

    // Emit destroy event before clearing handlers
    this._emit("destroy", { id: this.id });
    this._eventHandlers.clear();
  }

  // ============================================================================
  // CONFIGURATION METHODS
  // ============================================================================

  setPersonality(personality: Personality | PersonalityPreset): void {
    if (typeof personality === "string") {
      // Handle preset
      this._brain.setPersonality(personality as any);
    } else {
      // Handle custom personality object
      this._brain.setPersonality(personality);
    }
  }

  setEnvironment(environment: Environment): void {
    this._brain.setEnvironment(environment);
    // Note: Cat boundaries are read-only and managed by Cat internally
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  on(event: MeowzerEvent, handler: EventHandler): void {
    if (!this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, new Set());
    }
    this._eventHandlers.get(event)!.add(handler);
  }

  off(event: MeowzerEvent, handler: EventHandler): void {
    const handlers = this._eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private _emit(event: MeowzerEvent, data: any): void {
    const handlers = this._eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  // ============================================================================
  // INTERNAL SETUP
  // ============================================================================

  private _setupEventForwarding(): void {
    // Forward Cat state changes
    this._cat.on("stateChange", (data) => {
      this._emit("stateChange", {
        id: this.id,
        state: data.newState,
      });
    });

    // Forward Brain behavior changes
    this._brain.on("behaviorChange", (data) => {
      this._emit("behaviorChange", {
        id: this.id,
        behavior: data.newBehavior,
      });
    });
  }

  // ============================================================================
  // INTERNAL ACCESSORS (for registry/persistence)
  // ============================================================================

  /** @internal */
  get _internalCat(): Cat {
    return this._cat;
  }

  /** @internal */
  get _internalBrain(): Brain {
    return this._brain;
  }
}
