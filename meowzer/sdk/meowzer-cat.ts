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
  HatType,
  HatData,
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
    this.lifecycle = new CatLifecycle(this._cat, this._brain, this.id);

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
    this.accessories.on("hatApplied", () => this.persistence.markDirty());
    this.accessories.on("hatRemoved", () => this.persistence.markDirty());
    this.accessories.on("hatUpdated", () => this.persistence.markDirty());

    // Sync lifecycle state with interactions
    this.lifecycle.on("paused", () => this.interactions.setActive(false));
    this.lifecycle.on("resumed", () => this.interactions.setActive(true));

    // Forward component events to main event system
    this.lifecycle.on("paused", (data) => this.events.emit("pause", data));
    this.lifecycle.on("resumed", (data) => this.events.emit("resume", data));
    this.lifecycle.on("destroyed", (data) => this.events.emit("destroy", data));

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
    return { ...this._brain.state.motivation } as any; // TODO: Get actual personality from brain
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
  // HAT & ACCESSORY METHODS
  // ============================================================================

  /**
   * Add or update the cat's hat
   *
   * @param type - Type of hat ("beanie", "cowboy", or "baseball")
   * @param baseColor - Primary color of the hat
   * @param accentColor - Secondary color for details
   *
   * @example
   * ```ts
   * cat.addHat("beanie", "#FF0000", "#FFFF00");
   * ```
   */
  addHat(
    type: HatType,
    baseColor: string,
    accentColor: string
  ): void {
    // Validate colors
    if (!isValidColor(baseColor)) {
      throw new Error(`Invalid base color: ${baseColor}`);
    }
    if (!isValidColor(accentColor)) {
      throw new Error(`Invalid accent color: ${accentColor}`);
    }

    // Update appearance data
    if (!this._cat.protoCat.appearance.accessories) {
      this._cat.protoCat.appearance.accessories = {};
    }

    this._cat.protoCat.appearance.accessories.hat = {
      type,
      baseColor,
      accentColor,
    };

    // Regenerate SVG with hat
    this._updateCatSprite();

    // Mark as dirty and emit event
    this._markDirty();
    this._emit("hat-applied", {
      id: this.id,
      hat: { type, baseColor, accentColor },
    });
  }

  /**
   * Remove the cat's hat
   *
   * @example
   * ```ts
   * cat.removeHat();
   * ```
   */
  removeHat(): void {
    if (!this.hasHat()) return;

    // Remove hat from appearance data
    if (this._cat.protoCat.appearance.accessories) {
      delete this._cat.protoCat.appearance.accessories.hat;
    }

    // Regenerate SVG without hat
    this._updateCatSprite();

    // Mark as dirty and emit event
    this._markDirty();
    this._emit("hat-removed", { id: this.id });
  }

  /**
   * Update the colors of the cat's current hat
   *
   * @param baseColor - New primary color
   * @param accentColor - New secondary color
   *
   * @example
   * ```ts
   * cat.updateHatColors("#0000FF", "#FF00FF");
   * ```
   */
  updateHatColors(baseColor: string, accentColor: string): void {
    if (!this.hasHat()) {
      return; // Silently return if cat has no hat
    }

    // Validate colors
    if (!isValidColor(baseColor)) {
      throw new Error(`Invalid base color: ${baseColor}`);
    }
    if (!isValidColor(accentColor)) {
      throw new Error(`Invalid accent color: ${accentColor}`);
    }

    // Update colors
    const hat = this._cat.protoCat.appearance.accessories!.hat!;
    hat.baseColor = baseColor;
    hat.accentColor = accentColor;

    // Regenerate SVG with updated colors
    this._updateCatSprite();

    // Mark as dirty and emit event
    this._markDirty();
    this._emit("hat-updated", {
      id: this.id,
      hat: { ...hat },
    });
  }

  /**
   * Check if the cat has a hat
   *
   * @returns True if cat has a hat
   *
   * @example
   * ```ts
   * if (cat.hasHat()) {
   *   console.log("Cat is wearing a hat!");
   * }
   * ```
   */
  hasHat(): boolean {
    return !!this._cat.protoCat.appearance.accessories?.hat;
  }

  /**
   * Get the cat's current hat data
   *
   * @returns Hat data or undefined if cat has no hat
   *
   * @example
   * ```ts
   * const hat = cat.getHat();
   * if (hat) {
   *   console.log(`Cat has a ${hat.type} hat`);
   * }
   * ```
   */
  getHat(): HatData | undefined {
    const hat = this._cat.protoCat.appearance.accessories?.hat;
    return hat ? { ...hat } : undefined;
  }

  /**
   * Update the cat's sprite after appearance changes
   * @internal
   */
  private _updateCatSprite(): void {
    // Regenerate SVG sprite with current appearance
    const newSpriteData = generateCatSVG(
      this._cat.protoCat.appearance,
      this._cat.protoCat.dimensions
    );

    // Update the ProtoCat's sprite data
    this._cat.protoCat.spriteData = newSpriteData;

    // Update the DOM element
    const svgElement = this._cat._internalCat.dom?.getSVG();
    if (svgElement && svgElement.parentElement) {
      // Create temporary container for new SVG
      const temp = document.createElement("div");
      temp.innerHTML = newSpriteData.svg;
      const newSVG = temp.firstElementChild as SVGElement;

      if (newSVG) {
        // Replace old SVG with new one
        svgElement.parentElement.replaceChild(newSVG, svgElement);
      }
    }
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
  // INTERACTION METHODS
  // ============================================================================

  /**
   * Respond to a placed need (food/water)
   *
   * Evaluates cat's interest based on personality, then approaches and consumes if interested.
   *
   * @param needId - ID of the need to respond to
   *
   * @example
   * ```ts
   * const need = await meowzer.interactions.placeNeed("food:fancy", { x: 500, y: 300 });
   * await cat.respondToNeed(need.id);
   * ```
   */
  async respondToNeed(needId: string): Promise<void> {
    const interactionManager = this._getInteractionManager();
    const need = interactionManager.getNeed(needId);

    if (!need || !need.isActive()) return;

    // Evaluate interest
    const interest = this._brain.evaluateInterest(need);

    if (interest > 0.5) {
      // Personality-based delay (more independent cats take longer to respond)
      const personality = this._brain.personality;
      const delay = personality.independence * 2000; // 0-2 seconds

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Verify need is still active after delay
      if (!need.isActive()) return;

      // Trigger lifecycle hook
      const hookManager = this._getHookManager();
      await hookManager._trigger("beforeInteractionStart", {
        catId: this.id,
        interactionId: needId,
        interactionType: "need",
      });

      // Register initial interest
      interactionManager._registerCatResponse(
        this.id,
        needId,
        "interested"
      );

      // Approach the need
      interactionManager._registerCatResponse(
        this.id,
        needId,
        "approaching"
      );
      await this._brain._approachTarget(need.position);

      // Verify need is still active after approach
      if (!need.isActive()) {
        interactionManager._registerCatResponse(
          this.id,
          needId,
          "interrupted"
        );
        return;
      }

      // Consume the need
      interactionManager._registerCatResponse(
        this.id,
        needId,
        "consuming"
      );
      need._addConsumingCat(this.id);
      await this._brain._consumeNeed();

      // Mark as satisfied
      need._removeConsumingCat(this.id);
      interactionManager._registerCatResponse(
        this.id,
        needId,
        "satisfied"
      );

      // Trigger lifecycle hook
      await hookManager._trigger("afterInteractionEnd", {
        catId: this.id,
        interactionId: needId,
        interactionType: "need",
      });
    } else {
      // Not interested
      interactionManager._registerCatResponse(
        this.id,
        needId,
        "ignoring"
      );
    }
  }

  /**
   * Make cat play with yarn
   *
   * Cat evaluates interest in yarn, then may approach and bat/chase it.
   *
   * @param yarnId - ID of the yarn to play with
   *
   * @example
   * ```ts
   * const yarn = await meowzer.interactions.placeYarn({ x: 500, y: 300 });
   * await cat.playWithYarn(yarn.id);
   * ```
   */
  async playWithYarn(yarnId: string): Promise<void> {
    const interactionManager = this._getInteractionManager();
    const yarn = interactionManager.getYarn(yarnId);

    if (!yarn || !yarn.isActive) return;

    // Evaluate interest (higher for moving yarn)
    let interest = this._brain.evaluateInterest({
      type: "yarn",
      position: yarn.position,
      state: yarn.state,
    });

    // Boost interest if yarn is moving
    if (yarn.state === "rolling" || yarn.state === "dragging") {
      interest *= 1.5;
    }

    if (interest > 0.5) {
      const personality = this._brain.personality;
      const delay = personality.independence * 1000; // 0-1 seconds

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Verify yarn is still active
      if (!yarn.isActive) return;

      // Trigger lifecycle hook
      const hookManager = this._getHookManager();
      await hookManager._trigger("beforeInteractionStart", {
        catId: this.id,
        interactionId: yarnId,
        interactionType: "yarn",
      });

      // Mark cat as playing with yarn
      yarn._addPlayingCat(this.id);

      // Approach the yarn
      await this._brain._approachTarget(yarn.position);

      // Verify yarn is still there
      if (!yarn.isActive) {
        yarn._removePlayingCat(this.id);
        return;
      }

      // Play session: batting and chasing
      const playDuration = personality.energy * 10000; // 0-10 seconds
      const startTime = Date.now();

      while (Date.now() - startTime < playDuration && yarn.isActive) {
        // Bat at yarn
        await this._brain._batAtYarn();

        // Apply force to yarn
        const force = {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
        };
        yarn.applyForce(force);

        // If yarn is now rolling, chase it
        if (yarn.state === "rolling") {
          await this._brain._approachTarget(yarn.position);
        }

        // Short pause between interactions
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 1000)
        );
      }

      // Done playing
      yarn._removePlayingCat(this.id);

      // Trigger lifecycle hook
      await hookManager._trigger("afterInteractionEnd", {
        catId: this.id,
        interactionId: yarnId,
        interactionType: "yarn",
      });
    }
  }

  /**
   * Chase laser pointer
   *
   * Makes the cat chase a specific position (like a laser pointer dot).
   * Cats will automatically react to laser pointer movements through
   * brain detection, but this method can be called manually.
   *
   * @param position - Target position to chase
   *
   * @example
   * ```ts
   * await cat.chaseLaser({ x: 500, y: 300 });
   * ```
   */
  async chaseLaser(position: {
    x: number;
    y: number;
  }): Promise<void> {
    // Evaluate interest
    const interest = this._brain.evaluateInterest({
      type: "laser",
      position,
    });

    if (interest > 0.5) {
      const personality = this._brain.personality;

      // Trigger lifecycle hook
      const hookManager = this._getHookManager();
      await hookManager._trigger("beforeInteractionStart", {
        catId: this.id,
        interactionId: "laser",
        interactionType: "laser",
      });

      // Chase the laser position
      await this._brain._chaseTarget(position, {
        speed: 200 + personality.energy * 100,
      });

      // Trigger lifecycle hook
      await hookManager._trigger("afterInteractionEnd", {
        catId: this.id,
        interactionId: "laser",
        interactionType: "laser",
      });
    }
  }

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

    // Listen to Brain reactions and respond
    this._brain.on("reactionTriggered", (data) => {
      this._handleBrainReaction(data);
    });
  }

  /**
   * Handle brain reaction events (laser detection, etc.)
   * @internal
   */
  private async _handleBrainReaction(data: any): Promise<void> {
    if (!this.isActive) return;

    // Handle laser reactions
    if (
      data.type === "laserMoving" ||
      data.type === "laserDetected"
    ) {
      // Get active laser position from global interactions
      try {
        const globalKey = Symbol.for("meowzer.interactions");
        const interactions = (globalThis as any)[globalKey];

        if (interactions && interactions.getActiveLaser) {
          const laser = interactions.getActiveLaser();
          if (laser && laser.isActive) {
            await this.chaseLaser(laser.position);
          }
        }
      } catch {
        // Ignore errors
      }
    }

    // Handle need reactions
    if (data.type === "needDetected") {
      if (data.needId) {
        await this.respondToNeed(data.needId);
      }
    }

    // Handle yarn reactions
    if (data.type === "yarnDetected" || data.type === "yarnMoving") {
      if (data.yarnId) {
        await this.playWithYarn(data.yarnId);
      }
    }
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

  /**
   * Get InteractionManager instance from global registry
   * @internal
   * @throws {Error} If interactions manager not found
   */
  private _getInteractionManager(): any {
    const globalKey = Symbol.for("meowzer.interactions");
    const interactions = (globalThis as any)[globalKey];

    if (!interactions) {
      throw new Error(
        "Interactions not initialized. Call meowzer.init() first."
      );
    }

    return interactions;
  }

  /**
   * Get HookManager instance from global registry
   * @internal
   * @throws {Error} If hooks manager not found
   */
  private _getHookManager(): any {
    const globalKey = Symbol.for("meowzer.hooks");
    const hooks = (globalThis as any)[globalKey];

    if (!hooks) {
      throw new Error(
        "Hooks not initialized. Call meowzer.init() first."
      );
    }

    return hooks;
  }
}
