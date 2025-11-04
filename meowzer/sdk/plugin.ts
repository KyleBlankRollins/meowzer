import type { Meowzer } from "./meowzer-sdk.js";
import type { HookManager } from "./managers/hook-manager.js";
import type { CatManager } from "./managers/cat-manager.js";
import type { StorageManager } from "./managers/storage-manager.js";
import type { InteractionManager } from "./managers/interaction-manager.js";
import type { ConfigManager } from "./config.js";

/**
 * Context provided to plugins when they're installed
 */
export interface PluginContext {
  /**
   * Reference to the Meowzer SDK instance
   */
  meowzer: Meowzer;

  /**
   * Lifecycle hooks manager
   */
  hooks: HookManager;

  /**
   * Cat manager
   */
  cats: CatManager;

  /**
   * Storage manager
   */
  storage: StorageManager;

  /**
   * Interaction manager
   */
  interactions: InteractionManager;

  /**
   * Configuration manager
   * @internal
   */
  config: ConfigManager;
}

/**
 * Options that can be passed when installing a plugin
 */
export interface PluginInstallOptions {
  /**
   * Custom configuration for the plugin
   */
  config?: Record<string, unknown>;

  /**
   * Whether to enable the plugin immediately
   * @default true
   */
  enabled?: boolean;
}

/**
 * Meowzer plugin interface
 *
 * Plugins can extend SDK functionality by:
 * - Registering lifecycle hooks
 * - Adding custom methods/properties
 * - Modifying cat behavior
 * - Integrating with external services
 *
 * @example
 * ```ts
 * const analyticsPlugin: MeowzerPlugin = {
 *   name: 'analytics',
 *   version: '1.0.0',
 *
 *   install(ctx) {
 *     // Track cat creations
 *     ctx.hooks.on('afterCreate', ({ cat }) => {
 *       analytics.track('cat_created', { id: cat.id });
 *     });
 *
 *     // Track saves
 *     ctx.hooks.on('afterSave', ({ cat }) => {
 *       analytics.track('cat_saved', { id: cat.id });
 *     });
 *   }
 * };
 *
 * meowzer.use(analyticsPlugin);
 * ```
 */
export interface MeowzerPlugin {
  /**
   * Unique plugin name
   */
  name: string;

  /**
   * Plugin version (semver)
   */
  version: string;

  /**
   * Optional plugin description
   */
  description?: string;

  /**
   * Install function called when plugin is registered
   *
   * @param context - SDK context for accessing managers and hooks
   * @param options - Installation options
   */
  install(
    context: PluginContext,
    options?: PluginInstallOptions
  ): void | Promise<void>;

  /**
   * Optional cleanup function called when plugin is uninstalled
   *
   * @param context - SDK context
   */
  uninstall?(context: PluginContext): void | Promise<void>;
}

/**
 * Installed plugin metadata
 */
export interface InstalledPlugin {
  plugin: MeowzerPlugin;
  options?: PluginInstallOptions;
  installedAt: Date;
  enabled: boolean;
}

/**
 * PluginManager handles plugin registration and lifecycle
 */
export class PluginManager {
  private plugins = new Map<string, InstalledPlugin>();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * Install a plugin
   *
   * @param plugin - Plugin to install
   * @param options - Installation options
   * @throws {Error} If plugin with same name is already installed
   *
   * @example
   * ```ts
   * await pluginManager.install(analyticsPlugin, {
   *   config: { apiKey: '...' }
   * });
   * ```
   */
  async install(
    plugin: MeowzerPlugin,
    options?: PluginInstallOptions
  ): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already installed`);
    }

    const enabled = options?.enabled ?? true;

    // Call plugin's install method
    if (enabled) {
      await plugin.install(this.context, options);
    }

    // Register plugin
    this.plugins.set(plugin.name, {
      plugin,
      options,
      installedAt: new Date(),
      enabled,
    });
  }

  /**
   * Uninstall a plugin
   *
   * @param name - Name of plugin to uninstall
   * @throws {Error} If plugin is not installed
   *
   * @example
   * ```ts
   * await pluginManager.uninstall('analytics');
   * ```
   */
  async uninstall(name: string): Promise<void> {
    const installed = this.plugins.get(name);
    if (!installed) {
      throw new Error(`Plugin "${name}" is not installed`);
    }

    // Call plugin's uninstall method if it exists
    if (installed.plugin.uninstall && installed.enabled) {
      await installed.plugin.uninstall(this.context);
    }

    // Remove plugin
    this.plugins.delete(name);
  }

  /**
   * Enable a disabled plugin
   *
   * @param name - Name of plugin to enable
   * @throws {Error} If plugin is not installed or already enabled
   */
  async enable(name: string): Promise<void> {
    const installed = this.plugins.get(name);
    if (!installed) {
      throw new Error(`Plugin "${name}" is not installed`);
    }

    if (installed.enabled) {
      throw new Error(`Plugin "${name}" is already enabled`);
    }

    // Call plugin's install method
    await installed.plugin.install(this.context, installed.options);
    installed.enabled = true;
  }

  /**
   * Disable an enabled plugin
   *
   * @param name - Name of plugin to disable
   * @throws {Error} If plugin is not installed or already disabled
   */
  async disable(name: string): Promise<void> {
    const installed = this.plugins.get(name);
    if (!installed) {
      throw new Error(`Plugin "${name}" is not installed`);
    }

    if (!installed.enabled) {
      throw new Error(`Plugin "${name}" is already disabled`);
    }

    // Call plugin's uninstall method if it exists
    if (installed.plugin.uninstall) {
      await installed.plugin.uninstall(this.context);
    }

    installed.enabled = false;
  }

  /**
   * Check if a plugin is installed
   *
   * @param name - Plugin name to check
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Check if a plugin is enabled
   *
   * @param name - Plugin name to check
   */
  isEnabled(name: string): boolean {
    const installed = this.plugins.get(name);
    return installed?.enabled ?? false;
  }

  /**
   * Get installed plugin metadata
   *
   * @param name - Plugin name
   */
  get(name: string): InstalledPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all installed plugins
   */
  getAll(): InstalledPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all enabled plugins
   */
  getEnabled(): InstalledPlugin[] {
    return this.getAll().filter((p) => p.enabled);
  }

  /**
   * Get count of installed plugins
   */
  count(): number {
    return this.plugins.size;
  }

  /**
   * Uninstall all plugins
   */
  async uninstallAll(): Promise<void> {
    const names = Array.from(this.plugins.keys());
    for (const name of names) {
      await this.uninstall(name);
    }
  }
}
