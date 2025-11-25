import { CatManager } from "./managers/cat-manager.js";
import { StorageManager } from "./managers/storage-manager.js";
import { HookManager } from "./managers/hook-manager.js";
import { InteractionManager } from "./managers/interaction-manager.js";
import { LaserPointer } from "./interactions/laser-pointer.js";
import {
  PluginManager,
  type MeowzerPlugin,
  type PluginInstallOptions,
} from "./plugin.js";
import { MeowzerUtils } from "./utils.js";
import {
  ConfigManager,
  type MeowzerConfig,
  type PartialMeowzerConfig,
} from "./config.js";
import { InvalidStateError } from "./errors.js";

/**
 * Main Meowzer SDK class
 *
 * This is the primary entry point for using Meowzer. It provides a unified
 * interface for creating, managing, and persisting animated cats.
 *
 * @example
 * ```ts
 * const meowzer = new Meowzer({
 *   storage: { adapter: 'indexeddb' }
 * });
 *
 * await meowzer.init();
 *
 * const cat = await meowzer.cats.create({
 *   name: "Whiskers",
 *   settings: { color: "orange", pattern: "tabby", ... }
 * });
 * // Cat automatically appears on the page!
 * ```
 */
export class Meowzer {
  /**
   * Cat lifecycle management
   */
  public readonly cats: CatManager;

  /**
   * Storage operations
   */
  public readonly storage: StorageManager;

  /**
   * Lifecycle hooks
   */
  public readonly hooks: HookManager;

  /**
   * Interaction management (food, toys, etc.)
   */
  public readonly interactions: InteractionManager;

  /**
   * Plugin manager
   */
  public readonly plugins: PluginManager;

  /**
   * Utility functions
   */
  public readonly utils = MeowzerUtils;

  /**
   * Configuration management
   * @internal - Users should pass config to constructor
   */
  public readonly _config: ConfigManager;

  private _initialized: boolean = false;

  /**
   * Create a new Meowzer SDK instance
   *
   * @param config - Optional configuration for storage, behavior, etc.
   */
  constructor(config?: PartialMeowzerConfig) {
    this._config = new ConfigManager(config);
    this.hooks = new HookManager();

    // Create storage manager first (needed by CatManager)
    this.storage = new StorageManager(
      // We'll set the cat manager reference after creating it
      null as any,
      this._config,
      this.hooks
    );

    // Create interactions manager (needed by CatManager)
    this.interactions = new InteractionManager(
      this.hooks,
      // We'll set the cat manager reference after creating it
      null as any,
      this._config
    );

    // Create cat manager with all dependencies
    this.cats = new CatManager(
      this._config,
      this.hooks,
      this.storage,
      this.interactions
    );

    // Now set the cat manager references in storage and interactions
    (this.storage as any).catManager = this.cats;
    (this.interactions as any).cats = this.cats;

    this.plugins = new PluginManager({
      meowzer: this,
      hooks: this.hooks,
      cats: this.cats,
      storage: this.storage,
      interactions: this.interactions,
      config: this._config,
    });
  }

  /**
   * Initialize the SDK
   *
   * This sets up storage connections and prepares the SDK for use.
   * Must be called before using storage-related features.
   *
   * @example
   * ```ts
   * const meowzer = new Meowzer();
   * await meowzer.init();
   * ```
   */
  async init(): Promise<void> {
    if (this._initialized) {
      throw new InvalidStateError("Meowzer already initialized", {
        currentState: "initialized",
        expectedState: "uninitialized",
        attemptedOperation: "init",
      });
    }

    // Initialize storage if enabled
    if (this._config.get().storage.enabled) {
      await this.storage._initialize();

      // Register storage manager globally for MeowzerCat instances
      const globalKey = Symbol.for("meowzer.storage");
      (globalThis as any)[globalKey] = this.storage;
    }

    // Register interaction manager globally for Brain/MeowzerCat instances
    const interactionsKey = Symbol.for("meowzer.interactions");
    (globalThis as any)[interactionsKey] = this.interactions;

    // Register hooks manager globally for MeowzerCat instances
    const hooksKey = Symbol.for("meowzer.hooks");
    (globalThis as any)[hooksKey] = this.hooks;

    this._initialized = true;
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * Destroy the SDK and clean up resources
   */
  async destroy(): Promise<void> {
    if (!this._initialized) {
      return;
    }

    // Destroy all cats
    await this.cats.destroyAll();

    // Clean up interactions
    await this.interactions._cleanup();

    // Close storage connection if enabled
    if (this._config.get().storage.enabled) {
      await this.storage._close();

      // Unregister global storage manager
      const globalKey = Symbol.for("meowzer.storage");
      delete (globalThis as any)[globalKey];
    }

    // Unregister global managers
    const interactionsKey = Symbol.for("meowzer.interactions");
    delete (globalThis as any)[interactionsKey];

    const hooksKey = Symbol.for("meowzer.hooks");
    delete (globalThis as any)[hooksKey];

    this._initialized = false;
  }

  /**
   * Update SDK configuration
   *
   * Note: Some config changes may not apply to already-created cats.
   *
   * @example
   * ```ts
   * meowzer.configure({
   *   behavior: { speed: 'fast' }
   * });
   * ```
   */
  configure(config: PartialMeowzerConfig): void {
    this._config.set(config);
  }

  /**
   * Get current configuration
   *
   * @example
   * ```ts
   * const config = meowzer.getConfig();
   * console.log(config.storage.adapter); // 'indexeddb'
   * ```
   */
  getConfig(): MeowzerConfig {
    return this._config.get();
  }

  /**
   * Install a plugin
   *
   * Convenience method for meowzer.plugins.install()
   *
   * @param plugin - Plugin to install
   * @param options - Installation options
   *
   * @example
   * ```ts
   * meowzer.use(analyticsPlugin, {
   *   config: { apiKey: 'xxx' }
   * });
   * ```
   */
  async use(
    plugin: MeowzerPlugin,
    options?: PluginInstallOptions
  ): Promise<void> {
    await this.plugins.install(plugin, options);
  }

  /**
   * Create a new laser pointer for manual control
   *
   * Returns a LaserPointer instance for controlling the laser position.
   * The UI package is responsible for rendering the visual laser dot.
   *
   * Phase 1: Manual control only
   * Phase 3: Auto-patterns (circle, zigzag, etc.)
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
   * // Listen to movement events
   * laser.on("moved", (event) => {
   *   console.log("Laser at:", event.position);
   * });
   *
   * // Turn off when done
   * laser.turnOff();
   * ```
   */
  createLaserPointer(): LaserPointer {
    const id = `laser-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;
    const laser = new LaserPointer(id);

    // Note: InteractionManager will track lasers in future phases
    // For Phase 1, laser is standalone and managed by user

    return laser;
  }
}
