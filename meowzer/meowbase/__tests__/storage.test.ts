import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StorageAdapter } from "../collections/storage.js";
import {
  createMockCollection,
  createMockCat,
  clearMeowbaseStorage,
  countMeowbaseItems,
} from "./helpers.js";

describe("StorageAdapter", () => {
  let storage: StorageAdapter;

  beforeEach(() => {
    storage = new StorageAdapter();
    clearMeowbaseStorage();
  });

  afterEach(() => {
    clearMeowbaseStorage();
  });

  describe("create", () => {
    it("should create a collection in localStorage", async () => {
      const collection = createMockCollection({ name: "My Cats" });
      const result = await storage.create(collection);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
      expect(countMeowbaseItems()).toBe(1);
    });

    it("should not create duplicate collection with same id", async () => {
      const collection = createMockCollection({ name: "My Cats" });
      await storage.create(collection);
      const result = await storage.create(collection);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("already exists");
      }
      expect(countMeowbaseItems()).toBe(1);
    });

    it("should store collection with proper namespace", async () => {
      const collection = createMockCollection();
      await storage.create(collection);

      const key = `meowbase-${collection.id}`;
      const stored = localStorage.getItem(key);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(collection);
    });
  });

  describe("read", () => {
    it("should read a collection by id", async () => {
      const collection = createMockCollection({
        name: "Test Collection",
      });
      await storage.create(collection);

      const result = await storage.read(collection.id);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
    });

    it("should read a collection by name", async () => {
      const collection = createMockCollection({
        name: "Unique Name",
      });
      await storage.create(collection);

      const result = await storage.read("Unique Name");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
    });

    it("should return error for non-existent collection", async () => {
      const result = await storage.read("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });

    it("should read first collection when multiple have same name", async () => {
      const collection1 = createMockCollection({ name: "Duplicate" });
      const collection2 = createMockCollection({ name: "Duplicate" });
      await storage.create(collection1);
      await storage.create(collection2);

      const result = await storage.read("Duplicate");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.name).toBe("Duplicate");
      }
    });
  });

  describe("update", () => {
    it("should update an existing collection", async () => {
      const collection = createMockCollection({
        name: "Original Name",
      });
      await storage.create(collection);

      collection.name = "Updated Name";
      const cat = createMockCat();
      collection.children = [cat];

      const result = await storage.update(collection);

      expect(result.success).toBe(true);

      const readResult = await storage.read(collection.id);
      expect(readResult.success).toBe(true);
      if (readResult.success) {
        expect(readResult.data!.name).toBe("Updated Name");
        expect(readResult.data!.children).toHaveLength(1);
      }
    });

    it("should return error when updating non-existent collection", async () => {
      const collection = createMockCollection();
      const result = await storage.update(collection);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });
  });

  describe("delete", () => {
    it("should delete a collection by id", async () => {
      const collection = createMockCollection();
      await storage.create(collection);

      const result = await storage.delete(collection.id);

      expect(result.success).toBe(true);
      expect(countMeowbaseItems()).toBe(0);
    });

    it("should delete a collection by name", async () => {
      const collection = createMockCollection({ name: "Delete Me" });
      await storage.create(collection);

      const result = await storage.delete("Delete Me");

      expect(result.success).toBe(true);
      expect(countMeowbaseItems()).toBe(0);
    });

    it("should return error when deleting non-existent collection", async () => {
      const result = await storage.delete("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });
  });

  describe("list", () => {
    it("should list all collections", async () => {
      const collection1 = createMockCollection({
        name: "Collection 1",
      });
      const collection2 = createMockCollection({
        name: "Collection 2",
      });
      await storage.create(collection1);
      await storage.create(collection2);

      const result = await storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!).toHaveLength(2);
        const names = result.data!.map((c) => c.name);
        expect(names).toContain("Collection 1");
        expect(names).toContain("Collection 2");
      }
    });

    it("should return empty array when no collections exist", async () => {
      const result = await storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it("should include cat count in listing", async () => {
      const cat1 = createMockCat();
      const cat2 = createMockCat();
      const collection = createMockCollection({
        name: "Cat Collection",
        children: [cat1, cat2],
      });
      await storage.create(collection);

      const result = await storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data![0].catCount).toBe(2);
      }
    });
  });

  describe("findKey", () => {
    it("should find key by id", async () => {
      const collection = createMockCollection();
      await storage.create(collection);

      const key = await storage.findKey(collection.id);

      expect(key).toBe(`meowbase-${collection.id}`);
    });

    it("should find key by name", async () => {
      const collection = createMockCollection({ name: "Find Me" });
      await storage.create(collection);

      const key = await storage.findKey("Find Me");

      expect(key).toBe(`meowbase-${collection.id}`);
    });

    it("should return null for non-existent collection", async () => {
      const key = await storage.findKey("non-existent");

      expect(key).toBeNull();
    });
  });

  describe("extractIdFromKey", () => {
    it("should extract id from localStorage key", () => {
      const collectionId = "test-uuid-123";
      const key = `meowbase-${collectionId}`;

      const extractedId = storage.extractIdFromKey(key);

      expect(extractedId).toBe(collectionId);
    });
  });
});
