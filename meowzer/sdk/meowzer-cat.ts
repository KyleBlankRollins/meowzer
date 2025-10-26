/**
 * Enhanced MeowzerCat - High-level wrapper with full CRUD operations
 *
 * This is the main object users interact with. It coordinates:
 * - Meowtion (Cat) for animation
 * - Meowbrain (Brain) for AI behavior
 * - Metadata for persistence and extensibility
 */

import type { Cat } from "../meowtion/cat.js";
import type { Brain } from "../meowbrain/brain.js";
import type {
  Position,
  CatStateType,
  Personality,
  PersonalityPreset,
  Environment,
} from "../types.js";
import { EventEmitter } from "../utilities/event-emitter.js";
import type { Boundaries } from "../types.js";
import type { MeowzerEventType, EventHandler } from "./types.js";

/**
 * Extensible metadata for cats
 */
export interface CatMetadata {
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * Options for saving a cat
 */
export interface SaveOptions {
  collection?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for creating a MeowzerCat
 */
export interface MeowzerCatConfig {
  id: string;
  seed: string;
  cat: Cat;
  brain: Brain;
  name?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * JSON representation of a cat (for serialization)
 */
export interface CatJSON {
  id: string;
  seed: string;
  name?: string;
  description?: string;
  position: Position;
  state: CatStateType;
  personality: Personality;
  isActive: boolean;
  metadata: CatMetadata;
}

/**
 * Enhanced MeowzerCat with full CRUD operations
 */
export class MeowzerCat {
  // Identity
  readonly id: string;
  readonly seed: string;
  readonly element: HTMLElement;

  // Mutable metadata
  private _name?: string;
  private _description?: string;
  private _metadata: CatMetadata;

  // Internal components
  private _cat: Cat;
  private _brain: Brain;
  private _isActive: boolean = false;
  private events: EventEmitter<MeowzerEventType>;

  // Storage reference (set by StorageManager when saved)
  /** @internal */
  _collectionName?: string;

  constructor(config: MeowzerCatConfig) {
    this.id = config.id;
    this.seed = config.seed;
    this._cat = config.cat;
    this._brain = config.brain;
    this.element = config.cat.element;
    this._name = config.name;
    this._description = config.description;

    // Initialize metadata
    const now = new Date();
    this._metadata = {
      createdAt: now,
      updatedAt: now,
      ...config.metadata,
    };

    // Initialize event system
    this.events = new EventEmitter<MeowzerEventType>();

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
    return { ...this._brain.state.motivation } as any; // TODO: Get actual personality from brain
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get name(): string | undefined {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get metadata(): CatMetadata {
    return { ...this._metadata };
  }

  get createdAt(): Date {
    return this._metadata.createdAt as Date;
  }

  get updatedAt(): Date {
    return this._metadata.updatedAt as Date;
  }

  // ============================================================================
  // CONFIGURATION METHODS
  // ============================================================================

  setName(name: string): void {
    this._name = name;
    this._updateTimestamp();
  }

  setDescription(description: string): void {
    this._description = description;
    this._updateTimestamp();
  }

  setPersonality(personality: Personality | PersonalityPreset): void {
    if (typeof personality === "string") {
      this._brain.setPersonality(personality as any);
    } else {
      this._brain.setPersonality(personality);
    }
    this._updateTimestamp();
  }

  setEnvironment(environment: Environment): void {
    this._brain.setEnvironment(environment);
    this._updateTimestamp();
  }

  updateMetadata(metadata: Record<string, unknown>): void {
    this._metadata = {
      ...this._metadata,
      ...metadata,
    };
    this._updateTimestamp();
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
    this.events.clear();
  }

  // ============================================================================
  // PERSISTENCE METHODS (Called by StorageManager)
  // ============================================================================

  /**
   * Save this cat to storage
   *
   * @example
   * ```ts
   * await cat.save();
   * await cat.save({ collection: "favorites" });
   * ```
   *
   * @throws {StorageError} If save fails
   */
  async save(options?: SaveOptions): Promise<void> {
    const storage = this._getStorageManager();
    await storage.saveCat(this, options);
  }

  /**
   * Delete this cat from storage
   *
   * @example
   * ```ts
   * await cat.delete();
   * ```
   *
   * @throws {StorageError} If delete fails
   */
  async delete(): Promise<void> {
    const storage = this._getStorageManager();
    await storage.deleteCat(this.id);
    this.destroy();
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Clone this cat (creates a new cat with same appearance)
   */
  async clone(): Promise<MeowzerCat> {
    throw new Error(
      "clone() must be called through CatManager. Use meowzer.cats.createFromSeed(cat.seed) instead."
    );
  }

  /**
   * Convert cat to JSON representation
   */
  toJSON(): CatJSON {
    return {
      id: this.id,
      seed: this.seed,
      name: this._name,
      description: this._description,
      position: this.position,
      state: this.state,
      personality: this.personality,
      isActive: this.isActive,
      metadata: this.metadata,
    };
  }

  /**
   * Get current boundaries
   */
  getBoundaries(): Boundaries {
    return { ...this._cat.boundaries };
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  on(event: MeowzerEventType, handler: EventHandler): void {
    this.events.on(event, handler);
  }

  off(event: MeowzerEventType, handler: EventHandler): void {
    this.events.off(event, handler);
  }

  private _emit(event: MeowzerEventType, data: any): void {
    this.events.emit(event, data);
  }

  // ============================================================================
  // INTERNAL HELPERS
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

  private _updateTimestamp(): void {
    this._metadata.updatedAt = new Date();
  }

  // ============================================================================
  // INTERNAL ACCESSORS (for SDK internals)
  // ============================================================================

  /** @internal */
  get _internalCat(): Cat {
    return this._cat;
  }

  /** @internal */
  get _internalBrain(): Brain {
    return this._brain;
  }

  /** @internal */
  _setCollectionName(name: string): void {
    this._collectionName = name;
  }

  /** @internal */
  _getInternalMetadata(): CatMetadata {
    return this._metadata;
  }

  /**
   * Get StorageManager instance from global registry
   * @internal
   * @throws {Error} If storage manager not found
   */
  private _getStorageManager(): any {
    // Storage manager is injected by Meowzer SDK at initialization
    // We access it through a global symbol to avoid circular dependencies
    const globalKey = Symbol.for("meowzer.storage");
    const storage = (globalThis as any)[globalKey];

    if (!storage) {
      throw new Error(
        "Storage not initialized. Call meowzer.init() first."
      );
    }

    return storage;
  }
}
