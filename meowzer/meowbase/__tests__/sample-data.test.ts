import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Meowbase } from "../meowbase.js";
import { StorageAdapter } from "../collections/storage.js";
import {
  clearMeowbaseStorage,
  countMeowbaseItems,
} from "./helpers.js";

describe("Meowbase - Sample Data", () => {
  let db: Meowbase;

  beforeEach(async () => {
    const storage = new StorageAdapter();
    db = new Meowbase(undefined, storage);
    await db.initialize();
    clearMeowbaseStorage();
  });

  afterEach(async () => {
    clearMeowbaseStorage();
    await db.close();
  });

  describe("loadSampleData", () => {
    it("should load sample dataset with three collections", async () => {
      const result = await db.loadSampleData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data!.collectionsCreated).toBe(3);
        expect(result.data!.totalCats).toBe(15); // 5 + 4 + 6
      }
    });

    it("should create shelter, neighborhood, and home collections", async () => {
      await db.loadSampleData();

      const listResult = await db.listCollections();
      expect(listResult.success).toBe(true);

      if (listResult.success) {
        const names = listResult.data!.map((c) => c.name);
        expect(names).toContain("shelter");
        expect(names).toContain("neighborhood");
        expect(names).toContain("home");
      }
    });

    it("should have correct cat counts per collection", async () => {
      await db.loadSampleData();

      const shelterResult = await db.getCollection("shelter");
      const neighborhoodResult = await db.getCollection(
        "neighborhood"
      );
      const homeResult = await db.getCollection("home");

      expect(shelterResult.success).toBe(true);
      expect(neighborhoodResult.success).toBe(true);
      expect(homeResult.success).toBe(true);

      if (
        shelterResult.success &&
        neighborhoodResult.success &&
        homeResult.success
      ) {
        expect(shelterResult.data!.children).toHaveLength(5);
        expect(neighborhoodResult.data!.children).toHaveLength(4);
        expect(homeResult.data!.children).toHaveLength(6);
      }
    });

    it("should clear existing data before loading", async () => {
      // Create some initial data
      await db.createCollection("existing", []);
      expect(countMeowbaseItems()).toBe(1);

      // Load sample data
      await db.loadSampleData();

      // Should only have 3 collections from sample data
      expect(countMeowbaseItems()).toBe(3);

      // Existing collection should be gone
      const result = await db.getCollection("existing");
      expect(result.success).toBe(false);
    });

    it("should clear memory cache when loading", async () => {
      // Load and keep a collection in memory
      await db.createCollection("test-collection", []);
      await db.loadCollection("test-collection");
      expect(db.isCollectionLoaded("test-collection")).toBe(true);

      // Load sample data
      await db.loadSampleData();

      // Cache should be cleared
      expect(db.isCollectionLoaded("test-collection")).toBe(false);
    });

    it("should create cats with all required fields", async () => {
      await db.loadSampleData();

      const result = await db.getCollection("home");
      expect(result.success).toBe(true);

      if (result.success) {
        const firstCat = result.data!.children[0];

        // Check all required fields exist
        expect(firstCat.id).toBeTruthy();
        expect(firstCat.name).toBeTruthy();
        expect(firstCat.image).toBeTruthy();
        // Birthday is serialized as string in localStorage
        expect(firstCat.birthday).toBeTruthy();
        expect(typeof firstCat.birthday).toBe("string");
        expect(firstCat.favoriteToy).toBeTruthy();
        expect(firstCat.favoriteToy.id).toBeTruthy();
        expect(firstCat.description).toBeTruthy();
        expect(firstCat.currentEmotion).toBeTruthy();
        expect(firstCat.currentEmotion.name).toBeTruthy();
        expect(Array.isArray(firstCat.importantHumans)).toBe(true);
      }
    });
  });

  describe("clearAllData", () => {
    it("should clear all meowbase data from localStorage", async () => {
      await db.loadSampleData();
      expect(countMeowbaseItems()).toBe(3);

      const result = await db.clearAllData();

      expect(result.success).toBe(true);
      expect(countMeowbaseItems()).toBe(0);
    });

    it("should clear memory cache", async () => {
      await db.createCollection("test", []);
      await db.loadCollection("test");
      expect(db.isCollectionLoaded("test")).toBe(true);

      await db.clearAllData();

      expect(db.isCollectionLoaded("test")).toBe(false);
    });

    it("should work when no data exists", async () => {
      const result = await db.clearAllData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.message).toContain("0 collections");
      }
    });
  });
});
