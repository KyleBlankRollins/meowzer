/**
 * Meowzer SDK Tests - Core SDK functionality
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Meowzer } from "../meowzer-sdk.js";

describe("Meowzer SDK", () => {
  let meowzer: Meowzer;

  beforeEach(async () => {
    meowzer = new Meowzer({
      storage: { enabled: false }, // Disable storage for tests
    });
    await meowzer.init();
  });

  afterEach(async () => {
    await meowzer.destroy();
  });

  describe("Initialization", () => {
    it("should initialize successfully", async () => {
      const sdk = new Meowzer({ storage: { enabled: false } });
      await sdk.init();

      expect(sdk.isInitialized()).toBe(true);

      await sdk.destroy();
    });

    it("should throw error if initialized twice", async () => {
      await expect(meowzer.init()).rejects.toThrow(
        "already initialized"
      );
    });

    it("should provide access to managers", () => {
      expect(meowzer.cats).toBeDefined();
      expect(meowzer.storage).toBeDefined();
      expect(meowzer.hooks).toBeDefined();
      expect(meowzer.plugins).toBeDefined();
      expect(meowzer.utils).toBeDefined();
    });
  });

  describe("Configuration", () => {
    it("should accept custom configuration", async () => {
      const customConfig = {
        storage: {
          enabled: false,
          defaultCollection: "test-cats",
          cacheSize: 5,
        },
      };

      const sdk = new Meowzer(customConfig);
      await sdk.init();

      const config = sdk.getConfig();
      expect(config.storage.defaultCollection).toBe("test-cats");
      expect(config.storage.cacheSize).toBe(5);

      await sdk.destroy();
    });

    it("should update configuration", () => {
      meowzer.configure({
        storage: { defaultCollection: "new-collection" },
      });

      const config = meowzer.getConfig();
      expect(config.storage.defaultCollection).toBe("new-collection");
    });
  });

  describe("Lifecycle", () => {
    it("should destroy cleanly", async () => {
      await meowzer.destroy();

      expect(meowzer.isInitialized()).toBe(false);
      expect(meowzer.cats.getAll()).toHaveLength(0);
    });

    it("should handle destroy when not initialized", async () => {
      const sdk = new Meowzer({ storage: { enabled: false } });

      // Should not throw
      await expect(sdk.destroy()).resolves.not.toThrow();
    });
  });

  describe("Plugin System", () => {
    it("should install plugin via use() method", async () => {
      let installed = false;

      const testPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install() {
          installed = true;
        },
      };

      await meowzer.use(testPlugin);

      expect(installed).toBe(true);
      expect(meowzer.plugins.has("test-plugin")).toBe(true);
    });
  });
});
