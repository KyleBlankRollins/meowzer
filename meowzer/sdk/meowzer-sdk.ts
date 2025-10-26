import { CatManager } from "./managers/cat-manager.js";
import { StorageManager } from "./managers/storage-manager.js";
import { HookManager } from "./managers/hook-manager.js";
import {
  PluginManager,
  type MeowzerPlugin,
  type PluginInstallOptions,
} from "./plugin.js";
import { MeowzerUtils } from "./utils.js";
import { ConfigManager, type MeowzerConfig } from "./config.js";
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
 *
 * cat.place(document.body);
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
  constructor(config?: Partial<MeowzerConfig>) {
    this._config = new ConfigManager(config);
    this.hooks = new HookManager();
    this.cats = new CatManager(this._config, this.hooks);
    this.storage = new StorageManager(
      this.cats,
      this._config,
      this.hooks
    );
    this.plugins = new PluginManager({
      meowzer: this,
      hooks: this.hooks,
      cats: this.cats,
      storage: this.storage,
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
    this.cats.destroyAll();

    // Close storage connection if enabled
    if (this._config.get().storage.enabled) {
      await this.storage._close();

      // Unregister global storage manager
      const globalKey = Symbol.for("meowzer.storage");
      delete (globalThis as any)[globalKey];
    }

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
  configure(config: Partial<MeowzerConfig>): void {
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
}
