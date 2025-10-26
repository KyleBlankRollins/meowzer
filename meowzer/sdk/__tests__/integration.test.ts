/**
 * Integration Tests - End-to-end workflows
 *
 * Tests complete scenarios that involve multiple SDK components
 * working together: cats, storage, hooks, plugins, etc.
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import "fake-indexeddb/auto";
import { Meowzer } from "../meowzer-sdk.js";
import type { MeowzerPlugin } from "../plugin.js";
import type { CreateHookContext } from "../managers/hook-manager.js";

describe("Integration Tests", () => {
  let meowzer: Meowzer;

  beforeEach(async () => {
    // Reset IndexedDB between tests
    indexedDB = new IDBFactory();
  });

  afterEach(async () => {
    if (meowzer) {
      await meowzer.destroy();
    }
  });

  // ==========================================================================
  // BASIC CAT LIFECYCLE
  // ==========================================================================

  describe("Complete Cat Lifecycle", () => {
    it("should create cat and control pause/resume", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      // Create cat
      const cat = await meowzer.cats.create({
        name: "Lifecycle Test Cat",
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      expect(cat.id).toBeDefined();
      expect(cat.name).toBe("Lifecycle Test Cat");

      // Pause cat (should be safe even if not active)
      cat.pause();

      // Resume cat
      cat.resume();
      expect(cat.isActive).toBe(true);

      // Pause again
      cat.pause();
      expect(cat.isActive).toBe(false);
    });

    it("should create multiple cats and manage them", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      await meowzer.cats.create({ name: "Cat 1" });
      const cat2 = await meowzer.cats.create({ name: "Cat 2" });
      await meowzer.cats.create({ name: "Cat 3" });

      const allCats = meowzer.cats.getAll();
      expect(allCats).toHaveLength(3);
      expect(allCats.map((c) => c.name)).toContain("Cat 1");
      expect(allCats.map((c) => c.name)).toContain("Cat 2");
      expect(allCats.map((c) => c.name)).toContain("Cat 3");

      // Destroy one cat
      await meowzer.cats.destroy(cat2.id);
      const remainingCats = meowzer.cats.getAll();
      expect(remainingCats).toHaveLength(2);
      expect(remainingCats.map((c) => c.name)).not.toContain("Cat 2");
    });

    it("should retrieve cat by ID", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      const cat = await meowzer.cats.create({ name: "Findable Cat" });
      const foundCat = meowzer.cats.get(cat.id);

      expect(foundCat).toBeDefined();
      expect(foundCat?.id).toBe(cat.id);
      expect(foundCat?.name).toBe("Findable Cat");
    });
  });

  // ==========================================================================
  // STORAGE PERSISTENCE
  // ==========================================================================

  describe("Storage Persistence Workflows", () => {
    it("should persist cats to storage and reload them", async () => {
      meowzer = new Meowzer({
        storage: {
          enabled: true,
          defaultCollection: "test-collection",
        },
      });
      await meowzer.init();

      // Create and save cats
      const cat1 = await meowzer.cats.create({
        name: "Persistent Cat 1",
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      const cat2 = await meowzer.cats.create({
        name: "Persistent Cat 2",
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });

      await meowzer.storage.saveCat(cat1);
      await meowzer.storage.saveCat(cat2);

      // Verify they were saved
      const collections = await meowzer.storage.listCollections();
      const testCollection = collections.find(
        (c) => c.name === "test-collection"
      );
      expect(testCollection).toBeDefined();
      expect(testCollection!.catCount).toBe(2);

      // Load them back
      const loadedCat1 = await meowzer.storage.loadCat(cat1.id);
      const loadedCat2 = await meowzer.storage.loadCat(cat2.id);

      expect(loadedCat1.name).toBe("Persistent Cat 1");
      expect(loadedCat2.name).toBe("Persistent Cat 2");
    });

    it("should handle multiple collections", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      const cat1 = await meowzer.cats.create({
        name: "Favorites Cat",
      });
      const cat2 = await meowzer.cats.create({ name: "Archive Cat" });

      await meowzer.storage.saveCat(cat1, {
        collection: "favorites",
      });
      await meowzer.storage.saveCat(cat2, { collection: "archive" });

      const collections = await meowzer.storage.listCollections();
      expect(collections.some((c) => c.name === "favorites")).toBe(
        true
      );
      expect(collections.some((c) => c.name === "archive")).toBe(
        true
      );

      const favoriteCats = await meowzer.storage.loadCollection(
        "favorites"
      );
      const archiveCats = await meowzer.storage.loadCollection(
        "archive"
      );

      expect(favoriteCats).toHaveLength(1);
      expect(archiveCats).toHaveLength(1);
      expect(favoriteCats[0].name).toBe("Favorites Cat");
      expect(archiveCats[0].name).toBe("Archive Cat");
    });

    it("should save all managed cats at once", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      await meowzer.cats.create({ name: "Batch Cat 1" });
      await meowzer.cats.create({ name: "Batch Cat 2" });
      await meowzer.cats.create({ name: "Batch Cat 3" });

      // Save all at once
      await meowzer.storage.saveAll({ collection: "batch-save" });

      const collections = await meowzer.storage.listCollections();
      const batchCollection = collections.find(
        (c) => c.name === "batch-save"
      );
      expect(batchCollection!.catCount).toBe(3);
    });

    it("should delete cats from storage", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      const cat = await meowzer.cats.create({
        name: "Temporary Cat",
      });
      await meowzer.storage.saveCat(cat);

      // Verify it was saved
      const loadedCat = await meowzer.storage.loadCat(cat.id);
      expect(loadedCat).toBeDefined();

      // Delete from storage
      await meowzer.storage.deleteCat(cat.id);

      // Verify it's gone
      await expect(meowzer.storage.loadCat(cat.id)).rejects.toThrow();
    });
  });

  // ==========================================================================
  // HOOKS INTEGRATION
  // ==========================================================================

  describe("Lifecycle Hooks Integration", () => {
    it("should trigger hooks during cat lifecycle", async () => {
      const beforeCreate = vi.fn();
      const afterCreate = vi.fn();
      const beforeDelete = vi.fn();
      const afterDelete = vi.fn();

      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      meowzer.hooks.on("beforeCreate", beforeCreate);
      meowzer.hooks.on("afterCreate", afterCreate);
      meowzer.hooks.on("beforeDelete", beforeDelete);
      meowzer.hooks.on("afterDelete", afterDelete);

      // Create cat
      const cat = await meowzer.cats.create({ name: "Hooked Cat" });

      expect(beforeCreate).toHaveBeenCalledTimes(1);
      expect(afterCreate).toHaveBeenCalledTimes(1);
      expect(afterCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          cat: expect.objectContaining({ name: "Hooked Cat" }),
        })
      );

      // Destroy cat
      await meowzer.cats.destroy(cat.id);

      expect(beforeDelete).toHaveBeenCalledTimes(1);
      expect(afterDelete).toHaveBeenCalledTimes(1);
    });

    it("should allow hooks to access context data", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      let capturedContext: CreateHookContext | undefined;

      meowzer.hooks.on(
        "beforeCreate",
        (context: CreateHookContext) => {
          capturedContext = context;
        }
      );

      await meowzer.cats.create({ name: "Context Test" });

      expect(capturedContext).toBeDefined();
      expect(capturedContext!.options.name).toBe("Context Test");
      expect(capturedContext!.hook).toBe("beforeCreate");
      expect(capturedContext!.timestamp).toBeInstanceOf(Date);
    });

    it("should support one-time hooks", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      const onceHandler = vi.fn();

      meowzer.hooks.once("afterCreate", onceHandler);

      await meowzer.cats.create({ name: "Cat 1" });
      await meowzer.cats.create({ name: "Cat 2" });

      expect(onceHandler).toHaveBeenCalledTimes(1);
    });

    it("should trigger storage hooks", async () => {
      const beforeSave = vi.fn();
      const afterSave = vi.fn();
      const afterLoad = vi.fn();

      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      meowzer.hooks.on("beforeSave", beforeSave);
      meowzer.hooks.on("afterSave", afterSave);
      meowzer.hooks.on("afterLoad", afterLoad);

      const cat = await meowzer.cats.create({
        name: "Storage Hooks Cat",
      });
      await meowzer.storage.saveCat(cat);

      expect(beforeSave).toHaveBeenCalledTimes(1);
      expect(afterSave).toHaveBeenCalledTimes(1);

      await meowzer.storage.loadCat(cat.id);

      expect(afterLoad).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // PLUGIN INTEGRATION
  // ==========================================================================

  describe("Plugin System Integration", () => {
    it("should install and uninstall plugins", async () => {
      const onInstall = vi.fn();
      const onUninstall = vi.fn();
      const hookHandler = vi.fn();

      const testPlugin: MeowzerPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        install: async (context) => {
          onInstall(context);
          context.hooks.on("afterCreate", hookHandler);
        },
        uninstall: async (context) => {
          onUninstall(context);
        },
      };

      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      await meowzer.plugins.install(testPlugin);

      expect(onInstall).toHaveBeenCalledTimes(1);
      expect(meowzer.plugins.has("test-plugin")).toBe(true);

      // Plugin hook should fire
      await meowzer.cats.create({ name: "Plugin Test Cat" });
      expect(hookHandler).toHaveBeenCalledTimes(1);

      // Uninstall plugin
      await meowzer.plugins.uninstall("test-plugin");
      expect(onUninstall).toHaveBeenCalledTimes(1);
      expect(meowzer.plugins.has("test-plugin")).toBe(false);
    });

    it("should support plugin custom state via closure", async () => {
      let pluginState = { count: 0, items: [] as string[] };

      const plugin: MeowzerPlugin = {
        name: "stateful-plugin",
        version: "1.0.0",
        install: async (context) => {
          // Plugin maintains its own state
          context.hooks.on("afterCreate", () => {
            pluginState.count++;
          });
        },
      };

      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();
      await meowzer.plugins.install(plugin);

      expect(pluginState.count).toBe(0);

      await meowzer.cats.create({ name: "Cat 1" });
      expect(pluginState.count).toBe(1);

      await meowzer.cats.create({ name: "Cat 2" });
      expect(pluginState.count).toBe(2);
    });

    it("should support multiple plugins working together", async () => {
      const plugin1Handler = vi.fn();
      const plugin2Handler = vi.fn();

      const plugin1: MeowzerPlugin = {
        name: "plugin-1",
        version: "1.0.0",
        install: async (context) => {
          context.hooks.on("afterCreate", plugin1Handler);
        },
      };

      const plugin2: MeowzerPlugin = {
        name: "plugin-2",
        version: "1.0.0",
        install: async (context) => {
          context.hooks.on("afterCreate", plugin2Handler);
        },
      };

      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      await meowzer.plugins.install(plugin1);
      await meowzer.plugins.install(plugin2);

      await meowzer.cats.create({ name: "Multi-Plugin Cat" });

      expect(plugin1Handler).toHaveBeenCalledTimes(1);
      expect(plugin2Handler).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // COMPLEX WORKFLOWS
  // ==========================================================================

  describe("Complex Workflows", () => {
    it("should handle complete workflow: create, save, load, modify, delete", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      // Create cat
      const cat = await meowzer.cats.create({
        name: "Workflow Cat",
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      expect(cat.name).toBe("Workflow Cat");

      // Save to storage
      await meowzer.storage.saveCat(cat, {
        collection: "workflow-test",
      });

      // Verify in storage
      const collections = await meowzer.storage.listCollections();
      const workflowCollection = collections.find(
        (c) => c.name === "workflow-test"
      );
      expect(workflowCollection!.catCount).toBe(1);

      // Load from storage
      const loadedCat = await meowzer.storage.loadCat(cat.id);
      expect(loadedCat.name).toBe("Workflow Cat");
      expect(loadedCat.seed).toBe("tabby-FF9500-00FF00-m-short-v1");

      // Delete from storage
      await meowzer.storage.deleteCat(cat.id);

      // Verify deletion
      await expect(meowzer.storage.loadCat(cat.id)).rejects.toThrow();
    });

    it("should handle batch operations with hooks and storage", async () => {
      const hookCalls: string[] = [];

      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      meowzer.hooks.on(
        "afterCreate",
        (context: CreateHookContext) => {
          if (context.cat) {
            hookCalls.push(`created:${context.cat.name}`);
          }
        }
      );

      meowzer.hooks.on("afterSave", () => {
        hookCalls.push("saved");
      });

      // Create multiple cats
      const cats = await meowzer.cats.createMany([
        { name: "Batch Cat 1" },
        { name: "Batch Cat 2" },
        { name: "Batch Cat 3" },
      ]);

      expect(cats).toHaveLength(3);
      expect(
        hookCalls.filter((h) => h.startsWith("created:"))
      ).toHaveLength(3);

      // Save all
      await meowzer.storage.saveMany(cats, { collection: "batch" });

      expect(hookCalls.filter((h) => h === "saved")).toHaveLength(3);

      // Load collection
      const loadedCats = await meowzer.storage.loadCollection(
        "batch"
      );
      expect(loadedCats).toHaveLength(3);
    });

    it("should handle plugin that interacts with storage", async () => {
      const autoSavePlugin: MeowzerPlugin = {
        name: "auto-save",
        version: "1.0.0",
        install: async (context) => {
          context.hooks.on(
            "afterCreate",
            async (hookContext: CreateHookContext) => {
              if (hookContext.cat) {
                await context.storage.saveCat(hookContext.cat, {
                  collection: "auto-saved",
                });
              }
            }
          );
        },
      };

      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();
      await meowzer.plugins.install(autoSavePlugin);

      // Create cat - should auto-save via plugin
      const cat = await meowzer.cats.create({
        name: "Auto-Saved Cat",
      });

      // Verify it was auto-saved
      const collections = await meowzer.storage.listCollections();
      const autoSavedCollection = collections.find(
        (c) => c.name === "auto-saved"
      );
      expect(autoSavedCollection).toBeDefined();
      expect(autoSavedCollection!.catCount).toBe(1);

      // Verify we can load it
      const loadedCat = await meowzer.storage.loadCat(cat.id);
      expect(loadedCat.name).toBe("Auto-Saved Cat");
    });
  });

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  describe("Error Handling Integration", () => {
    it("should work without initialization but storage will fail", async () => {
      // Create meowzer but don't initialize
      meowzer = new Meowzer({ storage: { enabled: true } });

      // Creating cats works without init
      const cat = await meowzer.cats.create({ name: "Early Cat" });
      expect(cat).toBeDefined();

      // But storage operations require init
      await expect(meowzer.storage.saveCat(cat)).rejects.toThrow();
    });

    it("should handle storage errors gracefully", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });
      await meowzer.init();

      // Try to load non-existent cat
      await expect(
        meowzer.storage.loadCat("non-existent-id")
      ).rejects.toThrow("not found");

      // Try to load non-existent collection
      await expect(
        meowzer.storage.loadCollection("non-existent-collection")
      ).rejects.toThrow();
    });

    it("should continue working after plugin error", async () => {
      const faultyPlugin: MeowzerPlugin = {
        name: "faulty-plugin",
        version: "1.0.0",
        install: async (meowzer) => {
          meowzer.hooks.on("afterCreate", () => {
            throw new Error("Plugin error");
          });
        },
      };

      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();
      await meowzer.plugins.install(faultyPlugin);

      // Cat creation should still work despite plugin error
      const cat = await meowzer.cats.create({
        name: "Resilient Cat",
      });
      expect(cat).toBeDefined();
      expect(cat.name).toBe("Resilient Cat");
    });
  });

  // ==========================================================================
  // SDK LIFECYCLE
  // ==========================================================================

  describe("SDK Lifecycle", () => {
    it("should initialize and destroy cleanly", async () => {
      meowzer = new Meowzer({ storage: { enabled: true } });

      expect(meowzer.isInitialized()).toBe(false);

      await meowzer.init();

      expect(meowzer.isInitialized()).toBe(true);

      await meowzer.destroy();

      expect(meowzer.isInitialized()).toBe(false);
    });

    it("should clean up cats on destroy", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      const cat = await meowzer.cats.create({ name: "Temporary" });
      cat.resume(); // Activate the cat

      expect(cat.isActive).toBe(true);
      expect(meowzer.cats.getAll()).toHaveLength(1);

      await meowzer.destroy();

      expect(meowzer.cats.getAll()).toHaveLength(0);
    });

    it("should handle re-initialization", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();
      await meowzer.destroy();

      // Re-initialize
      await meowzer.init();

      expect(meowzer.isInitialized()).toBe(true);

      const cat = await meowzer.cats.create({ name: "Reborn Cat" });
      expect(cat).toBeDefined();
    });
  });

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  describe("Configuration Integration", () => {
    it("should respect custom configuration", async () => {
      meowzer = new Meowzer({
        storage: {
          enabled: true,
          defaultCollection: "custom-default",
          cacheSize: 10,
        },
      });
      await meowzer.init();

      const cat = await meowzer.cats.create({
        name: "Custom Config Cat",
      });
      await meowzer.storage.saveCat(cat);

      const collections = await meowzer.storage.listCollections();
      expect(
        collections.some((c) => c.name === "custom-default")
      ).toBe(true);
    });

    it("should work with storage disabled", async () => {
      meowzer = new Meowzer({ storage: { enabled: false } });
      await meowzer.init();

      const cat = await meowzer.cats.create({
        name: "No Storage Cat",
      });
      expect(cat).toBeDefined();

      // Storage operations should not be available or should throw
      expect(meowzer.storage.isInitialized()).toBe(false);
    });
  });
});
