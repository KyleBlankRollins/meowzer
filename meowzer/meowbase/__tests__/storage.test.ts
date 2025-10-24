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
    it("should create a collection in localStorage", () => {
      const collection = createMockCollection({ name: "My Cats" });
      const result = storage.create(collection);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
      expect(countMeowbaseItems()).toBe(1);
    });

    it("should not create duplicate collection with same id", () => {
      const collection = createMockCollection({ name: "My Cats" });
      storage.create(collection);
      const result = storage.create(collection);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("already exists");
      }
      expect(countMeowbaseItems()).toBe(1);
    });

    it("should store collection with proper namespace", () => {
      const collection = createMockCollection();
      storage.create(collection);

      const key = `meowbase-${collection.id}`;
      const stored = localStorage.getItem(key);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(collection);
    });
  });

  describe("read", () => {
    it("should read a collection by id", () => {
      const collection = createMockCollection({
        name: "Test Collection",
      });
      storage.create(collection);

      const result = storage.read(collection.id);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
    });

    it("should read a collection by name", () => {
      const collection = createMockCollection({
        name: "Unique Name",
      });
      storage.create(collection);

      const result = storage.read("Unique Name");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(collection);
      }
    });

    it("should return error for non-existent collection", () => {
      const result = storage.read("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });

    it("should read first collection when multiple have same name", () => {
      const collection1 = createMockCollection({ name: "Duplicate" });
      const collection2 = createMockCollection({ name: "Duplicate" });
      storage.create(collection1);
      storage.create(collection2);

      const result = storage.read("Duplicate");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.name).toBe("Duplicate");
      }
    });
  });

  describe("update", () => {
    it("should update an existing collection", () => {
      const collection = createMockCollection({
        name: "Original Name",
      });
      storage.create(collection);

      collection.name = "Updated Name";
      const cat = createMockCat();
      collection.children = [cat];

      const result = storage.update(collection);

      expect(result.success).toBe(true);

      const readResult = storage.read(collection.id);
      expect(readResult.success).toBe(true);
      if (readResult.success) {
        expect(readResult.data!.name).toBe("Updated Name");
        expect(readResult.data!.children).toHaveLength(1);
      }
    });

    it("should return error when updating non-existent collection", () => {
      const collection = createMockCollection();
      const result = storage.update(collection);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });
  });

  describe("delete", () => {
    it("should delete a collection by id", () => {
      const collection = createMockCollection();
      storage.create(collection);

      const result = storage.delete(collection.id);

      expect(result.success).toBe(true);
      expect(countMeowbaseItems()).toBe(0);
    });

    it("should delete a collection by name", () => {
      const collection = createMockCollection({ name: "Delete Me" });
      storage.create(collection);

      const result = storage.delete("Delete Me");

      expect(result.success).toBe(true);
      expect(countMeowbaseItems()).toBe(0);
    });

    it("should return error when deleting non-existent collection", () => {
      const result = storage.delete("non-existent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toContain("not found");
      }
    });
  });

  describe("list", () => {
    it("should list all collections", () => {
      const collection1 = createMockCollection({
        name: "Collection 1",
      });
      const collection2 = createMockCollection({
        name: "Collection 2",
      });
      storage.create(collection1);
      storage.create(collection2);

      const result = storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!).toHaveLength(2);
        const names = result.data!.map((c) => c.name);
        expect(names).toContain("Collection 1");
        expect(names).toContain("Collection 2");
      }
    });

    it("should return empty array when no collections exist", () => {
      const result = storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it("should include cat count in listing", () => {
      const cat1 = createMockCat();
      const cat2 = createMockCat();
      const collection = createMockCollection({
        name: "Cat Collection",
        children: [cat1, cat2],
      });
      storage.create(collection);

      const result = storage.list();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data![0].catCount).toBe(2);
      }
    });
  });

  describe("findKey", () => {
    it("should find key by id", () => {
      const collection = createMockCollection();
      storage.create(collection);

      const key = storage.findKey(collection.id);

      expect(key).toBe(`meowbase-${collection.id}`);
    });

    it("should find key by name", () => {
      const collection = createMockCollection({ name: "Find Me" });
      storage.create(collection);

      const key = storage.findKey("Find Me");

      expect(key).toBe(`meowbase-${collection.id}`);
    });

    it("should return null for non-existent collection", () => {
      const key = storage.findKey("non-existent");

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
