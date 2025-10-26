/**
 * PluginManager Tests - Plugin system
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { Meowzer } from "../meowzer-sdk.js";
import type { MeowzerPlugin, PluginContext } from "../plugin.js";

describe("PluginManager", () => {
  let meowzer: Meowzer;

  beforeEach(async () => {
    meowzer = new Meowzer({ storage: { enabled: false } });
    await meowzer.init();
  });

  afterEach(async () => {
    await meowzer.destroy();
  });

  describe("Plugin Installation", () => {
    it("should install a basic plugin", async () => {
      const install = vi.fn();
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install,
      };

      await meowzer.use(plugin);

      expect(install).toHaveBeenCalledTimes(1);
      expect(meowzer.plugins.has("test-plugin")).toBe(true);
    });

    it("should pass plugin context to install", async () => {
      let receivedContext: PluginContext | undefined;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          receivedContext = context;
        },
      };

      await meowzer.use(plugin);

      expect(receivedContext).toBeDefined();
      expect(receivedContext?.meowzer).toBe(meowzer);
      expect(receivedContext?.hooks).toBe(meowzer.hooks);
      expect(receivedContext?.cats).toBe(meowzer.cats);
      expect(receivedContext?.storage).toBe(meowzer.storage);
    });

    it("should install plugin with options", async () => {
      let receivedOptions: any;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(_context, options) {
          receivedOptions = options;
        },
      };

      await meowzer.use(plugin, {
        config: { apiKey: "test", debug: true },
        enabled: true,
      });

      expect(receivedOptions).toEqual({
        config: { apiKey: "test", debug: true },
        enabled: true,
      });
    });

    it("should throw when installing same plugin twice", async () => {
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
      };

      await meowzer.use(plugin);
      await expect(meowzer.use(plugin)).rejects.toThrow(
        "already installed"
      );
    });
  });

  describe("Plugin Lifecycle", () => {
    it("should call uninstall when plugin is uninstalled", async () => {
      const uninstall = vi.fn();
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
        uninstall,
      };

      await meowzer.use(plugin);
      await meowzer.plugins.uninstall("test-plugin");

      expect(uninstall).toHaveBeenCalledTimes(1);
      expect(meowzer.plugins.has("test-plugin")).toBe(false);
    });

    it("should pass context to uninstall", async () => {
      let receivedContext: PluginContext | undefined;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
        uninstall(context) {
          receivedContext = context;
        },
      };

      await meowzer.use(plugin);
      await meowzer.plugins.uninstall("test-plugin");

      expect(receivedContext).toBeDefined();
      expect(receivedContext?.meowzer).toBe(meowzer);
    });

    it("should throw when uninstalling non-existent plugin", async () => {
      await expect(
        meowzer.plugins.uninstall("non-existent")
      ).rejects.toThrow("not installed");
    });
  });

  describe("Plugin State Management", () => {
    it("should enable and disable plugins", async () => {
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
      };

      await meowzer.use(plugin);
      expect(meowzer.plugins.isEnabled("test-plugin")).toBe(true);

      await meowzer.plugins.disable("test-plugin");
      expect(meowzer.plugins.isEnabled("test-plugin")).toBe(false);

      await meowzer.plugins.enable("test-plugin");
      expect(meowzer.plugins.isEnabled("test-plugin")).toBe(true);
    });

    it("should get plugin instance", async () => {
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
      };

      await meowzer.use(plugin);
      const retrieved = meowzer.plugins.get("test-plugin");

      expect(retrieved).toBeDefined();
      expect(retrieved?.plugin.name).toBe("test-plugin");
      expect(retrieved?.plugin.version).toBe("1.0.0");
      expect(retrieved?.enabled).toBe(true);
      expect(retrieved?.installedAt).toBeInstanceOf(Date);
    });

    it("should return undefined for non-existent plugin", () => {
      const retrieved = meowzer.plugins.get("non-existent");
      expect(retrieved).toBeUndefined();
    });

    it("should list all plugins", async () => {
      const plugin1: MeowzerPlugin = {
        name: "plugin-1",
        version: "1.0.0",
        install: vi.fn(),
      };
      const plugin2: MeowzerPlugin = {
        name: "plugin-2",
        version: "2.0.0",
        install: vi.fn(),
      };

      await meowzer.use(plugin1);
      await meowzer.use(plugin2);

      const all = meowzer.plugins.getAll();
      expect(all).toHaveLength(2);
      expect(all.map((p) => p.plugin.name)).toContain("plugin-1");
      expect(all.map((p) => p.plugin.name)).toContain("plugin-2");
    });
  });

  describe("Plugin Integration", () => {
    it("should allow plugins to register hooks", async () => {
      const hookHandler = vi.fn();
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          context.hooks.on("beforeCreate", hookHandler);
        },
      };

      await meowzer.use(plugin);
      await meowzer.cats.create({ name: "Test" });

      expect(hookHandler).toHaveBeenCalled();
    });

    it("should allow plugins to access cat manager", async () => {
      let catManager: any;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          catManager = context.cats;
        },
      };

      await meowzer.use(plugin);

      expect(catManager).toBe(meowzer.cats);
    });

    it("should allow plugins to access storage manager", async () => {
      let storageManager: any;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          storageManager = context.storage;
        },
      };

      await meowzer.use(plugin);

      expect(storageManager).toBe(meowzer.storage);
    });

    it("should allow plugins to access config", async () => {
      let config: any;
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          config = context.config.get();
        },
      };

      await meowzer.use(plugin);

      expect(config).toBeDefined();
      expect(config.storage).toBeDefined();
      expect(config.behavior).toBeDefined();
    });
  });

  describe("Plugin Error Handling", () => {
    it("should handle plugin install errors", async () => {
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install() {
          throw new Error("Install failed");
        },
      };

      await expect(meowzer.use(plugin)).rejects.toThrow(
        "Install failed"
      );
    });

    it("should handle plugin uninstall errors", async () => {
      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: vi.fn(),
        uninstall() {
          throw new Error("Uninstall failed");
        },
      };

      await meowzer.use(plugin);
      await expect(
        meowzer.plugins.uninstall("test-plugin")
      ).rejects.toThrow("Uninstall failed");
    });
  });

  describe("Complex Plugin Scenarios", () => {
    it("should handle multiple plugins with hooks", async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const plugin1: MeowzerPlugin = {
        name: "plugin-1",
        version: "1.0.0",
        install(context) {
          context.hooks.on("beforeCreate", handler1);
        },
      };

      const plugin2: MeowzerPlugin = {
        name: "plugin-2",
        version: "1.0.0",
        install(context) {
          context.hooks.on("beforeCreate", handler2);
        },
      };

      await meowzer.use(plugin1);
      await meowzer.use(plugin2);
      await meowzer.cats.create({ name: "Test" });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it("should cleanup plugin hooks on uninstall", async () => {
      const handler = vi.fn();
      let hookId: string;

      const plugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install(context) {
          hookId = context.hooks.on("beforeCreate", handler);
        },
        uninstall(context) {
          context.hooks.off(hookId);
        },
      };

      await meowzer.use(plugin);
      await meowzer.cats.create({ name: "Test1" });
      expect(handler).toHaveBeenCalledTimes(1);

      await meowzer.plugins.uninstall("test-plugin");
      await meowzer.cats.create({ name: "Test2" });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not 2
    });
  });
});
