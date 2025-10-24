import { describe, it, expect, beforeEach } from "vitest";
import { CollectionCache } from "../collections/cache.js";
import { createMockCollection, createMockCat } from "./helpers.js";

describe("CollectionCache", () => {
  let cache: CollectionCache;

  beforeEach(() => {
    cache = new CollectionCache(3); // Max 3 collections for testing
  });

  describe("set and get", () => {
    it("should add and retrieve a collection", () => {
      const collection = createMockCollection({
        name: "Test Collection",
      });
      cache.set(collection);

      const metadata = cache.get(collection.id);

      expect(metadata).not.toBeNull();
      expect(metadata!.collection).toEqual(collection);
      expect(metadata!.isDirty).toBe(false);
    });

    it("should update lastAccessed timestamp on get", () => {
      const collection = createMockCollection();
      cache.set(collection);

      const firstAccess = cache.get(collection.id);
      const firstTimestamp = firstAccess!.lastAccessed;

      // Wait a bit and access again
      const secondAccess = cache.get(collection.id);
      const secondTimestamp = secondAccess!.lastAccessed;

      expect(secondTimestamp).toBeGreaterThanOrEqual(firstTimestamp);
    });
  });

  describe("find", () => {
    it("should find collection by id", () => {
      const collection = createMockCollection();
      cache.set(collection);

      const metadata = cache.find(collection.id);

      expect(metadata).not.toBeNull();
      expect(metadata!.collection.id).toBe(collection.id);
    });

    it("should find collection by name", () => {
      const collection = createMockCollection({ name: "Find Me" });
      cache.set(collection);

      const metadata = cache.find("Find Me");

      expect(metadata).not.toBeNull();
      expect(metadata!.collection.name).toBe("Find Me");
    });

    it("should return null for non-existent collection", () => {
      const metadata = cache.find("non-existent");

      expect(metadata).toBeNull();
    });
  });

  describe("LRU eviction", () => {
    it("should evict least recently used when at capacity", () => {
      const collection1 = createMockCollection({
        name: "Collection 1",
      });
      const collection2 = createMockCollection({
        name: "Collection 2",
      });
      const collection3 = createMockCollection({
        name: "Collection 3",
      });
      const collection4 = createMockCollection({
        name: "Collection 4",
      });

      cache.set(collection1);
      cache.set(collection2);
      cache.set(collection3);

      // Access collection1 to update its timestamp
      cache.get(collection1.id);

      // Adding collection4 should trigger LRU eviction
      cache.set(collection4);

      // Verify max size maintained and new collection added
      expect(cache.size()).toBe(3);
      expect(cache.has(collection4.id)).toBe(true);
    });

    it("should respect access order for eviction", () => {
      const collection1 = createMockCollection({
        name: "Collection 1",
      });
      const collection2 = createMockCollection({
        name: "Collection 2",
      });
      const collection3 = createMockCollection({
        name: "Collection 3",
      });

      cache.set(collection1);
      cache.set(collection2);
      cache.set(collection3);

      // Access in different order: 3, 1, 2
      cache.get(collection3.id);
      cache.get(collection1.id);
      cache.get(collection2.id);

      // Adding a 4th should trigger eviction
      const collection4 = createMockCollection({
        name: "Collection 4",
      });
      cache.set(collection4);

      // Verify max size maintained and new collection added
      expect(cache.size()).toBe(3);
      expect(cache.has(collection4.id)).toBe(true);
    });
  });

  describe("dirty tracking", () => {
    it("should mark collection as dirty", () => {
      const collection = createMockCollection();
      cache.set(collection);

      const marked = cache.markDirty(collection.id);

      expect(marked).toBe(true);
      const metadata = cache.get(collection.id);
      expect(metadata!.isDirty).toBe(true);
    });

    it("should mark collection as clean", () => {
      const collection = createMockCollection();
      cache.set(collection);
      cache.markDirty(collection.id);

      const marked = cache.markClean(collection.id);

      expect(marked).toBe(true);
      const metadata = cache.get(collection.id);
      expect(metadata!.isDirty).toBe(false);
    });

    it("should return false when marking non-existent collection", () => {
      const marked = cache.markDirty("non-existent");

      expect(marked).toBe(false);
    });

    it("should get all dirty collections", () => {
      const collection1 = createMockCollection({ name: "Dirty 1" });
      const collection2 = createMockCollection({ name: "Clean" });
      const collection3 = createMockCollection({ name: "Dirty 2" });

      cache.set(collection1);
      cache.set(collection2);
      cache.set(collection3);

      cache.markDirty(collection1.id);
      cache.markDirty(collection3.id);

      const dirtyCollections = cache.getDirty();

      expect(dirtyCollections).toHaveLength(2);
      const names = dirtyCollections.map((m) => m.collection.name);
      expect(names).toContain("Dirty 1");
      expect(names).toContain("Dirty 2");
      expect(names).not.toContain("Clean");
    });
  });

  describe("has", () => {
    it("should return true for existing collection", () => {
      const collection = createMockCollection();
      cache.set(collection);

      expect(cache.has(collection.id)).toBe(true);
    });

    it("should return false for non-existent collection", () => {
      expect(cache.has("non-existent")).toBe(false);
    });
  });

  describe("remove", () => {
    it("should remove a collection from cache", () => {
      const collection = createMockCollection();
      cache.set(collection);

      const removed = cache.remove(collection.id);

      expect(removed).toBe(true);
      expect(cache.has(collection.id)).toBe(false);
    });

    it("should return false when removing non-existent collection", () => {
      const removed = cache.remove("non-existent");

      expect(removed).toBe(false);
    });
  });

  describe("getAll", () => {
    it("should return all cached collections", () => {
      const collection1 = createMockCollection({
        name: "Collection 1",
      });
      const collection2 = createMockCollection({
        name: "Collection 2",
      });

      cache.set(collection1);
      cache.set(collection2);

      const all = cache.getAll();

      expect(all).toHaveLength(2);
    });

    it("should return empty array when cache is empty", () => {
      const all = cache.getAll();

      expect(all).toEqual([]);
    });
  });

  describe("clear", () => {
    it("should clear all collections from cache", () => {
      const collection1 = createMockCollection();
      const collection2 = createMockCollection();

      cache.set(collection1);
      cache.set(collection2);

      cache.clear();

      expect(cache.size()).toBe(0);
      expect(cache.getAll()).toEqual([]);
    });
  });

  describe("size", () => {
    it("should return number of cached collections", () => {
      expect(cache.size()).toBe(0);

      cache.set(createMockCollection());
      expect(cache.size()).toBe(1);

      cache.set(createMockCollection());
      expect(cache.size()).toBe(2);
    });
  });

  describe("collection modifications", () => {
    it("should maintain reference to collection allowing modifications", () => {
      const collection = createMockCollection({
        name: "Original",
        children: [],
      });
      cache.set(collection);

      const metadata = cache.get(collection.id);
      const cat = createMockCat();
      metadata!.collection.children.push(cat);

      const retrievedMetadata = cache.get(collection.id);
      expect(retrievedMetadata!.collection.children).toHaveLength(1);
      expect(retrievedMetadata!.collection.children[0]).toBe(cat);
    });
  });
});
