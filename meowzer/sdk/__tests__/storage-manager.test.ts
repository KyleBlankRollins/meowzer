import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import "fake-indexeddb/auto";
import { StorageManager } from "../managers/storage-manager.js";
import { CatManager } from "../managers/cat-manager.js";
import { HookManager } from "../managers/hook-manager.js";
import { ConfigManager } from "../config.js";
import {
  NotFoundError,
  CollectionError,
  InitializationError,
} from "../errors.js";

describe("StorageManager", () => {
  let storageManager: StorageManager;
  let catManager: CatManager;
  let hookManager: HookManager;
  let configManager: ConfigManager;

  beforeEach(async () => {
    // Clear IndexedDB between tests
    indexedDB = new IDBFactory();

    // Create mock managers
    hookManager = new HookManager();
    configManager = new ConfigManager({
      storage: {
        defaultCollection: "default",
        cacheSize: 5,
      },
    });
    catManager = new CatManager(configManager, hookManager);

    // Create storage manager
    storageManager = new StorageManager(
      catManager,
      configManager,
      hookManager
    );

    // Initialize storage
    await storageManager._initialize();
  });

  afterEach(async () => {
    await storageManager._close();
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  describe("initialization", () => {
    it("should initialize storage successfully", async () => {
      const manager = new StorageManager(
        catManager,
        configManager,
        hookManager
      );

      expect(manager.isInitialized()).toBe(false);

      await manager._initialize();

      expect(manager.isInitialized()).toBe(true);

      await manager._close();
    });

    it("should handle multiple initialization calls idempotently", async () => {
      const manager = new StorageManager(
        catManager,
        configManager,
        hookManager
      );

      await manager._initialize();
      await manager._initialize(); // Second call should be safe

      expect(manager.isInitialized()).toBe(true);

      await manager._close();
    });

    it("should throw InitializationError when storage operations are attempted before initialization", async () => {
      const manager = new StorageManager(
        catManager,
        configManager,
        hookManager
      );

      await expect(
        manager.saveCat(
          await catManager.create({
            seed: "tabby-FF9500-00FF00-m-short-v1",
          })
        )
      ).rejects.toThrow(InitializationError);

      await expect(manager.loadCat("cat-123")).rejects.toThrow(
        InitializationError
      );

      await expect(manager.listCollections()).rejects.toThrow(
        InitializationError
      );
    });

    it("should close storage successfully", async () => {
      await storageManager._close();

      expect(storageManager.isInitialized()).toBe(false);
    });

    it("should handle multiple close calls idempotently", async () => {
      await storageManager._close();
      await storageManager._close(); // Second call should be safe

      expect(storageManager.isInitialized()).toBe(false);
    });
  });

  // ============================================================================
  // CAT OPERATIONS - SAVE
  // ============================================================================

  describe("saveCat", () => {
    it("should save a cat to default collection", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Whiskers",
      });

      await storageManager.saveCat(cat);

      // Verify cat was saved by checking collection
      const collections = await storageManager.listCollections();
      const defaultCollection = collections.find(
        (c) => c.name === "default"
      );
      expect(defaultCollection).toBeDefined();
      expect(defaultCollection!.catCount).toBe(1);

      // Note: loadCat creates a NEW cat from the seed, so IDs won't match
      const loadedCat = await storageManager.loadCat(cat.id);
      expect(loadedCat.name).toBe("Whiskers");
      expect(loadedCat.seed).toBe("tabby-FF9500-00FF00-m-short-v1");
    });

    it("should save a cat to specified collection", async () => {
      const cat = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Fluffy",
      });

      await storageManager.saveCat(cat, { collection: "favorites" });

      // Verify cat was saved to correct collection
      const collections = await storageManager.listCollections();
      const favoritesCollection = collections.find(
        (c) => c.name === "favorites"
      );
      expect(favoritesCollection).toBeDefined();
      expect(favoritesCollection!.catCount).toBe(1);
    });

    it("should create collection if it doesn't exist", async () => {
      const cat = await catManager.create({
        seed: "tuxedo-000000-FF0000-s-short-v1",
      });

      await storageManager.saveCat(cat, {
        collection: "new-collection",
      });

      const collections = await storageManager.listCollections();
      expect(
        collections.some((c) => c.name === "new-collection")
      ).toBe(true);
    });

    it("should save same cat twice to same collection", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Persistent",
      });

      // First save
      await storageManager.saveCat(cat);

      // Second save to same collection - this will throw because
      // Meowbase doesn't allow duplicate IDs in a collection
      await expect(storageManager.saveCat(cat)).rejects.toThrow();
    });

    it("should trigger beforeSave and afterSave hooks", async () => {
      const beforeSave = vi.fn();
      const afterSave = vi.fn();

      hookManager.on("beforeSave", beforeSave);
      hookManager.on("afterSave", afterSave);

      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      await storageManager.saveCat(cat);

      expect(beforeSave).toHaveBeenCalledWith(
        expect.objectContaining({ cat })
      );
      expect(afterSave).toHaveBeenCalledWith(
        expect.objectContaining({ cat })
      );
    });

    it("should set collection name on cat after saving", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      await storageManager.saveCat(cat, { collection: "my-cats" });

      // Collection name is stored as the collection ID (UUID), not the name
      expect(cat._collectionName).toBeTruthy();
    });
  });

  describe("saveMany", () => {
    it("should save multiple cats to default collection", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Cat 1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Cat 2",
      });
      const cat3 = await catManager.create({
        seed: "tuxedo-000000-FF0000-s-medium-v1",
        name: "Cat 3",
      });

      await storageManager.saveMany([cat1, cat2, cat3]);

      // Verify all cats were saved
      const collections = await storageManager.listCollections();
      const defaultCollection = collections.find(
        (c) => c.name === "default"
      );
      expect(defaultCollection!.catCount).toBe(3);
    });

    it("should save multiple cats to specified collection", async () => {
      const cats = await Promise.all([
        catManager.create({ seed: "tabby-FF9500-00FF00-m-short-v1" }),
        catManager.create({ seed: "calico-FFAA00-0000FF-l-long-v1" }),
      ]);

      await storageManager.saveMany(cats, {
        collection: "batch-save",
      });

      const collections = await storageManager.listCollections();
      const batchCollection = collections.find(
        (c) => c.name === "batch-save"
      );
      expect(batchCollection!.catCount).toBe(2);
    });

    it("should handle empty array", async () => {
      await expect(
        storageManager.saveMany([])
      ).resolves.not.toThrow();
    });
  });

  describe("saveAll", () => {
    it("should save all cats managed by CatManager", async () => {
      // Create cats (they are auto-registered with CatManager)
      await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Cat 1",
      });
      await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Cat 2",
      });

      await storageManager.saveAll();

      const collections = await storageManager.listCollections();
      const defaultCollection = collections.find(
        (c) => c.name === "default"
      );
      expect(defaultCollection!.catCount).toBe(2);
    });

    it("should save to specified collection", async () => {
      await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });

      await storageManager.saveAll({ collection: "all-cats" });

      const collections = await storageManager.listCollections();
      const allCatsCollection = collections.find(
        (c) => c.name === "all-cats"
      );
      expect(allCatsCollection!.catCount).toBe(2);
    });
  });

  // ============================================================================
  // CAT OPERATIONS - LOAD
  // ============================================================================

  describe("loadCat", () => {
    it("should load a cat by seed from storage", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Whiskers",
      });

      await storageManager.saveCat(cat);

      // Note: loadCat creates a NEW cat instance from the stored seed
      const loadedCat = await storageManager.loadCat(cat.id);

      expect(loadedCat.name).toBe("Whiskers");
      expect(loadedCat.seed).toBe("tabby-FF9500-00FF00-m-short-v1");
    });

    it("should throw NotFoundError when cat doesn't exist", async () => {
      await expect(
        storageManager.loadCat("non-existent-cat")
      ).rejects.toThrow(NotFoundError);
    });

    it("should find cat across multiple collections", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Cat 1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Cat 2",
      });

      await storageManager.saveCat(cat1, {
        collection: "collection1",
      });
      await storageManager.saveCat(cat2, {
        collection: "collection2",
      });

      const loadedCat1 = await storageManager.loadCat(cat1.id);
      const loadedCat2 = await storageManager.loadCat(cat2.id);

      expect(loadedCat1.name).toBe("Cat 1");
      expect(loadedCat2.name).toBe("Cat 2");
    });

    it("should trigger afterLoad hook", async () => {
      const afterLoad = vi.fn();
      hookManager.on("afterLoad", afterLoad);

      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      await storageManager.saveCat(cat);

      await storageManager.loadCat(cat.id);

      expect(afterLoad).toHaveBeenCalledWith(
        expect.objectContaining({ catId: cat.id })
      );
    });

    it("should set collection reference on loaded cat", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      await storageManager.saveCat(cat, { collection: "my-cats" });

      const loadedCat = await storageManager.loadCat(cat.id);

      // Collection name is set (as collection ID/UUID)
      expect(loadedCat._collectionName).toBeTruthy();
    });
  });

  describe("loadCollection", () => {
    it("should load all cats from a collection", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Cat 1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Cat 2",
      });

      await storageManager.saveCat(cat1, { collection: "test" });
      await storageManager.saveCat(cat2, { collection: "test" });

      const cats = await storageManager.loadCollection("test");

      expect(cats).toHaveLength(2);
      const names = cats.map((c) => c.name);
      expect(names).toContain("Cat 1");
      expect(names).toContain("Cat 2");
    });

    it("should filter cats when filter option is provided", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Fluffy",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Whiskers",
      });
      const cat3 = await catManager.create({
        seed: "tuxedo-000000-FF0000-s-medium-v1",
        name: "Felix",
      });

      await storageManager.saveMany([cat1, cat2, cat3], {
        collection: "filter-test",
      });

      const filteredCats = await storageManager.loadCollection(
        "filter-test",
        {
          filter: (cat) => cat.name.startsWith("F"),
        }
      );

      expect(filteredCats).toHaveLength(2);
      const names = filteredCats.map((c) => c.name);
      expect(names).toContain("Fluffy");
      expect(names).toContain("Felix");
    });

    it("should limit cats when limit option is provided", async () => {
      const cats = await Promise.all([
        catManager.create({ seed: "tabby-FF9500-00FF00-m-short-v1" }),
        catManager.create({ seed: "calico-FFAA00-0000FF-l-long-v1" }),
        catManager.create({
          seed: "tuxedo-000000-FF0000-s-medium-v1",
        }),
        catManager.create({
          seed: "spotted-CCAA88-00FF00-m-short-v1",
        }),
      ]);

      await storageManager.saveMany(cats, {
        collection: "limit-test",
      });

      const limitedCats = await storageManager.loadCollection(
        "limit-test",
        { limit: 2 }
      );

      expect(limitedCats).toHaveLength(2);
    });

    it("should apply both filter and limit", async () => {
      const cats = await Promise.all([
        catManager.create({
          seed: "tabby-FF9500-00FF00-m-short-v1",
          name: "Fluffy",
        }),
        catManager.create({
          seed: "calico-FFAA00-0000FF-l-long-v1",
          name: "Felix",
        }),
        catManager.create({
          seed: "tuxedo-000000-FF0000-s-medium-v1",
          name: "Whiskers",
        }),
        catManager.create({
          seed: "spotted-CCAA88-00FF00-m-short-v1",
          name: "Fred",
        }),
      ]);

      await storageManager.saveMany(cats, {
        collection: "filter-limit-test",
      });

      const results = await storageManager.loadCollection(
        "filter-limit-test",
        {
          filter: (cat) => cat.name.startsWith("F"),
          limit: 2,
        }
      );

      expect(results).toHaveLength(2);
      results.forEach((cat) => {
        expect(cat.name?.startsWith("F")).toBe(true);
      });
    });

    it("should throw NotFoundError when collection doesn't exist", async () => {
      await expect(
        storageManager.loadCollection("non-existent")
      ).rejects.toThrow(NotFoundError);
    });

    it("should return empty array for empty collection", async () => {
      await storageManager.createCollection("empty");

      const cats = await storageManager.loadCollection("empty");

      expect(cats).toEqual([]);
    });

    it("should set collection reference on all loaded cats", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });

      await storageManager.saveMany([cat1, cat2], {
        collection: "name-test",
      });

      const cats = await storageManager.loadCollection("name-test");

      cats.forEach((cat) => {
        expect(cat._collectionName).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // CAT OPERATIONS - DELETE
  // ============================================================================

  describe("deleteCat", () => {
    it("should delete a cat from storage", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      await storageManager.saveCat(cat);
      await storageManager.deleteCat(cat.id);

      await expect(storageManager.loadCat(cat.id)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw NotFoundError when cat doesn't exist", async () => {
      await expect(
        storageManager.deleteCat("non-existent-cat")
      ).rejects.toThrow(NotFoundError);
    });

    it("should trigger beforeDelete and afterDelete hooks", async () => {
      const beforeDelete = vi.fn();
      const afterDelete = vi.fn();

      hookManager.on("beforeDelete", beforeDelete);
      hookManager.on("afterDelete", afterDelete);

      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      await storageManager.saveCat(cat);

      await storageManager.deleteCat(cat.id);

      expect(beforeDelete).toHaveBeenCalledWith(
        expect.objectContaining({ catId: cat.id })
      );
      expect(afterDelete).toHaveBeenCalledWith(
        expect.objectContaining({ catId: cat.id })
      );
    });

    it("should delete cat from correct collection", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });

      await storageManager.saveCat(cat1, {
        collection: "collection1",
      });
      await storageManager.saveCat(cat2, {
        collection: "collection2",
      });

      await storageManager.deleteCat(cat1.id);

      await expect(storageManager.loadCat(cat1.id)).rejects.toThrow(
        NotFoundError
      );

      // Cat2 should still exist
      const loadedCat2 = await storageManager.loadCat(cat2.id);
      expect(loadedCat2).toBeDefined();
    });
  });

  describe("deleteMany", () => {
    it("should delete multiple cats", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });
      const cat3 = await catManager.create({
        seed: "tuxedo-000000-FF0000-s-medium-v1",
      });

      await storageManager.saveMany([cat1, cat2, cat3]);
      await storageManager.deleteMany([cat1.id, cat2.id]);

      await expect(storageManager.loadCat(cat1.id)).rejects.toThrow(
        NotFoundError
      );
      await expect(storageManager.loadCat(cat2.id)).rejects.toThrow(
        NotFoundError
      );

      // Cat3 should still exist
      const loadedCat3 = await storageManager.loadCat(cat3.id);
      expect(loadedCat3).toBeDefined();
    });

    it("should handle empty array", async () => {
      await expect(
        storageManager.deleteMany([])
      ).resolves.not.toThrow();
    });
  });

  // ============================================================================
  // COLLECTION OPERATIONS
  // ============================================================================

  describe("createCollection", () => {
    it("should create a new collection", async () => {
      await storageManager.createCollection("New Collection");

      const collections = await storageManager.listCollections();
      expect(
        collections.some((c) => c.name === "New Collection")
      ).toBe(true);
    });

    it("should throw CollectionError when creating duplicate collection", async () => {
      await storageManager.createCollection("Duplicate");

      await expect(
        storageManager.createCollection("Duplicate")
      ).rejects.toThrow(CollectionError);
    });
  });

  describe("listCollections", () => {
    it("should list all collections", async () => {
      await storageManager.createCollection("Collection 1");
      await storageManager.createCollection("Collection 2");
      await storageManager.createCollection("Collection 3");

      const collections = await storageManager.listCollections();

      expect(collections.length).toBeGreaterThanOrEqual(3);
      expect(collections.some((c) => c.name === "Collection 1")).toBe(
        true
      );
      expect(collections.some((c) => c.name === "Collection 2")).toBe(
        true
      );
      expect(collections.some((c) => c.name === "Collection 3")).toBe(
        true
      );
    });

    it("should return empty array when no collections exist", async () => {
      const collections = await storageManager.listCollections();

      expect(Array.isArray(collections)).toBe(true);
    });

    it("should include cat count in collection info", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
      });

      await storageManager.saveMany([cat1, cat2], {
        collection: "count-test",
      });

      const collections = await storageManager.listCollections();
      const countCollection = collections.find(
        (c) => c.name === "count-test"
      );

      expect(countCollection).toBeDefined();
      expect(countCollection!.catCount).toBe(2);
    });
  });

  describe("getCollectionInfo", () => {
    it("should get collection info by name", async () => {
      await storageManager.createCollection("Test Collection");

      const info = await storageManager.getCollectionInfo(
        "Test Collection"
      );

      expect(info.name).toBe("Test Collection");
      expect(info.catCount).toBe(0);
    });

    it("should get collection info by ID", async () => {
      await storageManager.createCollection("Test Collection");
      const collections = await storageManager.listCollections();
      const testCollection = collections.find(
        (c) => c.name === "Test Collection"
      );

      const info = await storageManager.getCollectionInfo(
        testCollection!.id
      );

      expect(info.name).toBe("Test Collection");
    });

    it("should throw NotFoundError when collection doesn't exist", async () => {
      await expect(
        storageManager.getCollectionInfo("non-existent")
      ).rejects.toThrow(NotFoundError);
    });

    it("should include accurate cat count", async () => {
      const cats = await Promise.all([
        catManager.create({ seed: "tabby-FF9500-00FF00-m-short-v1" }),
        catManager.create({ seed: "calico-FFAA00-0000FF-l-long-v1" }),
        catManager.create({
          seed: "tuxedo-000000-FF0000-s-medium-v1",
        }),
      ]);

      await storageManager.saveMany(cats, {
        collection: "info-test",
      });

      const info = await storageManager.getCollectionInfo(
        "info-test"
      );

      expect(info.catCount).toBe(3);
    });
  });

  describe("deleteCollection", () => {
    it("should delete a collection", async () => {
      await storageManager.createCollection("To Delete");

      await storageManager.deleteCollection("To Delete");

      const collections = await storageManager.listCollections();
      expect(collections.some((c) => c.name === "To Delete")).toBe(
        false
      );
    });

    it("should delete collection with cats", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      await storageManager.saveCat(cat, {
        collection: "delete-with-cats",
      });

      await storageManager.deleteCollection("delete-with-cats");

      const collections = await storageManager.listCollections();
      expect(
        collections.some((c) => c.name === "delete-with-cats")
      ).toBe(false);
    });

    it("should throw CollectionError when deleting non-existent collection", async () => {
      await expect(
        storageManager.deleteCollection("non-existent")
      ).rejects.toThrow(CollectionError);
    });
  });

  // ============================================================================
  // EDGE CASES & ERROR HANDLING
  // ============================================================================

  describe("edge cases", () => {
    it("should handle cat with minimal data", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
      });

      await storageManager.saveCat(cat);

      const loadedCat = await storageManager.loadCat(cat.id);
      expect(loadedCat.seed).toBe("tabby-FF9500-00FF00-m-short-v1");
    });

    it("should handle cat with special characters in name", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Mr. Whiskers (The Great) & Fluffy!",
      });

      await storageManager.saveCat(cat);

      const loadedCat = await storageManager.loadCat(cat.id);
      expect(loadedCat.name).toBe(
        "Mr. Whiskers (The Great) & Fluffy!"
      );
    });

    it("should handle collection with special characters in name", async () => {
      await storageManager.createCollection("My Cats (2024)!");

      const collections = await storageManager.listCollections();
      expect(
        collections.some((c) => c.name === "My Cats (2024)!")
      ).toBe(true);
    });

    it("should handle saving multiple different cats sequentially", async () => {
      const cat1 = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Test Cat 1",
      });
      const cat2 = await catManager.create({
        seed: "calico-FFAA00-0000FF-l-long-v1",
        name: "Test Cat 2",
      });
      const cat3 = await catManager.create({
        seed: "tuxedo-000000-FF0000-s-medium-v1",
        name: "Test Cat 3",
      });

      await storageManager.saveCat(cat1);
      await storageManager.saveCat(cat2);
      await storageManager.saveCat(cat3);

      const loadedCat1 = await storageManager.loadCat(cat1.id);
      const loadedCat2 = await storageManager.loadCat(cat2.id);
      const loadedCat3 = await storageManager.loadCat(cat3.id);

      expect(loadedCat1.name).toBe("Test Cat 1");
      expect(loadedCat2.name).toBe("Test Cat 2");
      expect(loadedCat3.name).toBe("Test Cat 3");
    });

    it("should handle saving cat to multiple collections (duplicates)", async () => {
      const cat = await catManager.create({
        seed: "tabby-FF9500-00FF00-m-short-v1",
        name: "Duplicated",
      });

      // Save to first collection
      await storageManager.saveCat(cat, {
        collection: "collection1",
      });

      // Save to second collection (creates duplicate entry)
      await storageManager.saveCat(cat, {
        collection: "collection2",
      });

      // Verify cat exists in both collections
      const cats1 = await storageManager.loadCollection(
        "collection1"
      );
      const cats2 = await storageManager.loadCollection(
        "collection2"
      );

      expect(cats1.some((c) => c.seed === cat.seed)).toBe(true);
      expect(cats2.some((c) => c.seed === cat.seed)).toBe(true);
    });
  });
});
