/**
 * Enhanced MeowzerCat - Component-based cat entity
 *
 * This is the main object users interact with. It composes specialized components:
 * - CatLifecycle: pause/resume/destroy
 * - CatPersistence: save/delete/dirty tracking
 * - CatAccessories: hat management and sprite updates
 * - CatInteractions: need/yarn/laser interactions
 * - CatEvents: event aggregation and forwarding
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
  MeowzerCatConfig,
  SaveOptions,
} from "../types/index.js";
import type { MeowzerEventType, EventHandler } from "./types.js";
import {
  CatLifecycle,
  CatPersistence,
  CatAccessories,
  CatInteractions,
  CatEvents,
} from "./cat-modules/index.js";
import type { CatManagers } from "./cat-modules/types.js";

/**
 * Enhanced MeowzerCat with component-based architecture
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

  // Internal components (for delegation)
  private _cat: Cat;
  private _brain: Brain;

  // Public components (exposed for direct access)
  readonly lifecycle: CatLifecycle;
  readonly persistence: CatPersistence;
  readonly accessories: CatAccessories;
  readonly interactions: CatInteractions;
  readonly events: CatEvents;

  constructor(config: MeowzerCatConfig, managers: CatManagers) {
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

    // Initialize components with explicit dependencies
    this.lifecycle = new CatLifecycle(
      this._cat,
      this._brain,
      this.id
    );

    this.persistence = new CatPersistence(
      this.id,
      () => this, // Pass function to get current cat data
      managers.storage
    );

    this.accessories = new CatAccessories(this._cat, this.id);

    this.interactions = new CatInteractions(
      this._cat,
      this._brain,
      this.id,
      managers.interactions,
      managers.hooks
    );

    this.events = new CatEvents(this._cat, this._brain, this.id);

    // Setup component reactions
    this.setupComponentReactions();

    // Setup menu button click handler
    this._setupMenuButton();
  }

  /**
   * Setup cross-component reactions (observer pattern)
   */
  private setupComponentReactions(): void {
    // Auto-mark dirty when accessories change
    this.accessories.on("hatApplied", () =>
      this.persistence.markDirty()
    );
    this.accessories.on("hatRemoved", () =>
      this.persistence.markDirty()
    );
    this.accessories.on("hatUpdated", () =>
      this.persistence.markDirty()
    );

    // Sync lifecycle state with interactions
    this.lifecycle.on("paused", () =>
      this.interactions.setActive(false)
    );
    this.lifecycle.on("resumed", () =>
      this.interactions.setActive(true)
    );

    // Forward component events to main event system
    this.lifecycle.on("paused", (data) =>
      this.events.emit("pause", data)
    );
    this.lifecycle.on("resumed", (data) =>
      this.events.emit("resume", data)
    );
    this.lifecycle.on("destroyed", (data) =>
      this.events.emit("destroy", data)
    );

    this.accessories.on("hatApplied", (data) =>
      this.events.emit("hat-applied", data)
    );
    this.accessories.on("hatRemoved", (data) =>
      this.events.emit("hat-removed", data)
    );
    this.accessories.on("hatUpdated", (data) =>
      this.events.emit("hat-updated", data)
    );
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
    return this._brain.personality;
  }

  get isActive(): boolean {
    return this.lifecycle.isActive;
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
      this.persistence.markDirty();
      this._updateTimestamp();
    }
  }

  setDescription(description: string): void {
    if (this._description !== description) {
      this._description = description;
      this.persistence.markDirty();
      this._updateTimestamp();
    }
  }

  setPersonality(personality: Personality | PersonalityPreset): void {
    if (typeof personality === "string") {
      this._brain.setPersonality(personality as any);
    } else {
      this._brain.setPersonality(personality);
    }
    this.persistence.markDirty();
    this._updateTimestamp();
  }

  setEnvironment(environment: Environment): void {
    this._brain.setEnvironment(environment);
    this.persistence.markDirty();
    this._updateTimestamp();
  }

  updateMetadata(metadata: Record<string, unknown>): void {
    this._metadata = {
      ...this._metadata,
      ...metadata,
    };
    this.persistence.markDirty();
    this._updateTimestamp();
  }

  // ============================================================================
  // ============================================================================
  // UTILITIES
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
    await this.persistence.save(options);
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
    await this.persistence.delete();
    this.lifecycle.destroy();
  }

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
    this.persistence.setCollectionName(name);
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
    return this.persistence.isDirty;
  }

  /**
   * Mark cat as clean (just saved)
   * @internal
   */
  _markClean(): void {
    this.persistence.markClean();
  }
}
