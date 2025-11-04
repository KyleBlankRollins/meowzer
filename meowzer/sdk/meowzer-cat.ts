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
  Boundaries,
  CatStateType,
  Personality,
  PersonalityPreset,
  Environment,
  CatMetadata,
  CatJSON,
  SaveOptions,
  MeowzerCatConfig,
} from "../types/index.js";
import { EventEmitter } from "../utilities/event-emitter.js";
import type { MeowzerEventType, EventHandler } from "./types.js";

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

  // Dirty flag for optimized persistence
  private _isDirty: boolean = false;

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

    // Setup menu button click handler
    this._setupMenuButton();

    // New cats are dirty by default (need initial save)
    this._isDirty = true;
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
    if (this._name !== name) {
      this._name = name;
      this._cat._internalCat.dom?.updateNameText(name);
      this._markDirty();
    }
  }

  setDescription(description: string): void {
    if (this._description !== description) {
      this._description = description;
      this._markDirty();
    }
  }

  setPersonality(personality: Personality | PersonalityPreset): void {
    if (typeof personality === "string") {
      this._brain.setPersonality(personality as any);
    } else {
      this._brain.setPersonality(personality);
    }
    this._markDirty();
  }

  setEnvironment(environment: Environment): void {
    this._brain.setEnvironment(environment);
    this._markDirty();
  }

  updateMetadata(metadata: Record<string, unknown>): void {
    this._metadata = {
      ...this._metadata,
      ...metadata,
    };
    this._markDirty();
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
  // INTERACTION METHODS (Placeholders for future features)
  // ============================================================================

  /**
   * Pick up the cat (follows cursor)
   * @future Not yet implemented
   */
  pickUp(): void {
    console.warn("pickUp() not yet implemented");
    // TODO: Implement in future SDK update
    // this._isHeld = true;
    // this._cat.startFollowingCursor();
    // this._emit("pickUp", { id: this.id });
  }

  /**
   * Drop the cat at current or specified position
   * @future Not yet implemented
   */
  drop(_position?: Position): void {
    console.warn("drop() not yet implemented");
    // TODO: Implement in future SDK update
    // this._isHeld = false;
    // this._cat.stopFollowingCursor();
    // if (position) this._cat.setPosition(position.x, position.y);
    // this._emit("drop", { id: this.id, position });
  }

  /**
   * Check if cat is being held
   * @future Not yet implemented
   */
  get isBeingHeld(): boolean {
    return false; // TODO: Implement in future SDK update
  }

  /**
   * Pet the cat (shows affection)
   * @future Not yet implemented
   */
  async pet(): Promise<void> {
    console.warn("pet() not yet implemented");
    // TODO: Implement in future SDK update
    // await this._brain.handlePet();
    // this._cat.setState("purring");
    // this._emit("pet", { id: this.id });
  }

  /**
   * Change cat's outfit
   * @future Not yet implemented
   */
  setOutfit(_outfit: any): void {
    console.warn("setOutfit() not yet implemented");
    // TODO: Implement in future SDK update
  }

  /**
   * Remove cat's outfit
   * @future Not yet implemented
   */
  removeOutfit(): void {
    console.warn("removeOutfit() not yet implemented");
    // TODO: Implement in future SDK update
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

  /**
   * Setup cat container click handler
   * @internal
   */
  private _setupMenuButton(): void {
    const catElement = this._cat._internalCat.dom?.getElement();
    if (catElement) {
      catElement.addEventListener("click", this._handleMenuClick);
    }
  }

  /**
   * Handle cat click to open menu
   * @internal
   */
  private _handleMenuClick = (e: MouseEvent): void => {
    e.stopPropagation();

    // Get the cat element's bounding box for positioning
    const catElement = this._cat._internalCat.dom?.getElement();
    const rect = catElement?.getBoundingClientRect();

    this._emit("menuClick", {
      id: this.id,
      position: { x: e.clientX, y: e.clientY },
      catRect: rect
        ? {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          }
        : undefined,
    });
  };

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

  /**
   * Mark cat as dirty (needs to be saved)
   * @internal
   */
  private _markDirty(): void {
    this._isDirty = true;
    this._updateTimestamp();
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
   * Check if cat has unsaved changes
   * @internal
   */
  get _needsSave(): boolean {
    return this._isDirty;
  }

  /**
   * Mark cat as clean (just saved)
   * @internal
   */
  _markClean(): void {
    this._isDirty = false;
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
