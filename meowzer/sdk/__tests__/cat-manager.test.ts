/**
 * CatManager Tests - Cat creation, management, and lifecycle
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
import { MeowzerCat } from "../meowzer-cat.js";

describe("CatManager", () => {
  let meowzer: Meowzer;

  beforeEach(async () => {
    meowzer = new Meowzer({
      storage: { enabled: false },
    });
    await meowzer.init();
  });

  afterEach(async () => {
    await meowzer.destroy();
  });

  describe("Cat Creation", () => {
    it("should create a cat with default options", async () => {
      const cat = await meowzer.cats.create();

      expect(cat).toBeInstanceOf(MeowzerCat);
      expect(cat.id).toBeTruthy();
      expect(cat.seed).toBeTruthy();
      expect(cat.element).toBeDefined();
      expect(cat.position).toBeDefined();
      expect(cat.state).toBeDefined();
    });

    it("should create a cat with custom name", async () => {
      const cat = await meowzer.cats.create({ name: "Mittens" });

      expect(cat.name).toBe("Mittens");
    });

    it("should create a cat with custom description", async () => {
      const cat = await meowzer.cats.create({
        name: "Whiskers",
        description: "A fluffy orange tabby",
      });

      expect(cat.description).toBe("A fluffy orange tabby");
    });

    it("should create a cat with custom metadata", async () => {
      const cat = await meowzer.cats.create({
        name: "Boots",
        metadata: {
          adoptionDate: "2024-01-15",
          favoriteToys: ["feather", "ball"],
        },
      });

      expect(cat.metadata.adoptionDate).toBe("2024-01-15");
      expect(cat.metadata.favoriteToys).toEqual(["feather", "ball"]);
    });

    it("should create a cat with tags in metadata", async () => {
      const cat = await meowzer.cats.create({
        name: "Fluffy",
        metadata: {
          tags: ["playful", "indoor"],
        },
      });

      expect(cat.metadata?.tags).toContain("playful");
      expect(cat.metadata?.tags).toContain("indoor");
    });

    it("should create a cat from seed", async () => {
      const seed = "tabby-FF9500-00FF00-m-short-v1";
      const cat = await meowzer.cats.create({ seed });

      expect(cat.seed).toBe(seed);
    });

    it("should trigger lifecycle hooks on creation", async () => {
      const beforeCreate = vi.fn();
      const afterCreate = vi.fn();

      meowzer.hooks.on("beforeCreate", beforeCreate);
      meowzer.hooks.on("afterCreate", afterCreate);

      const cat = await meowzer.cats.create({ name: "Smokey" });

      expect(beforeCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({ name: "Smokey" }),
        })
      );

      expect(afterCreate).toHaveBeenCalledWith(
        expect.objectContaining({ cat })
      );
    });
  });

  describe("Batch Operations", () => {
    it("should create multiple cats at once", async () => {
      const cats = await meowzer.cats.createMany([
        { name: "Cat 1" },
        { name: "Cat 2" },
        { name: "Cat 3" },
      ]);

      expect(cats).toHaveLength(3);
      expect(cats[0].name).toBe("Cat 1");
      expect(cats[1].name).toBe("Cat 2");
      expect(cats[2].name).toBe("Cat 3");
    });

    it("should destroy multiple cats at once", async () => {
      const cats = await meowzer.cats.createMany([{}, {}, {}]);
      const ids = cats.map((cat) => cat.id);

      expect(meowzer.cats.getAll()).toHaveLength(3);

      await meowzer.cats.destroyMany(ids);

      expect(meowzer.cats.getAll()).toHaveLength(0);
    });
  });

  describe("Cat Retrieval", () => {
    let testCat: MeowzerCat;

    beforeEach(async () => {
      testCat = await meowzer.cats.create({ name: "TestCat" });
    });

    it("should get cat by ID", () => {
      const cat = meowzer.cats.get(testCat.id);

      expect(cat).toBe(testCat);
    });

    it("should return undefined for non-existent cat", () => {
      const cat = meowzer.cats.get("non-existent-id");

      expect(cat).toBeUndefined();
    });

    it("should get all cats", async () => {
      await meowzer.cats.create({ name: "Cat 2" });
      await meowzer.cats.create({ name: "Cat 3" });

      const allCats = meowzer.cats.getAll();

      expect(allCats).toHaveLength(3);
    });

    it("should find cats by name", async () => {
      await meowzer.cats.create({ name: "Whiskers" });
      await meowzer.cats.create({ name: "Mittens" });
      await meowzer.cats.create({ name: "Shadow" });

      const found = meowzer.cats.find({ name: "Whiskers" });

      expect(found).toHaveLength(1);
      expect(found[0].name).toBe("Whiskers");
    });

    it("should check if cat exists", () => {
      expect(meowzer.cats.has(testCat.id)).toBe(true);
      expect(meowzer.cats.has("non-existent")).toBe(false);
    });
  });

  describe("Cat Updates", () => {
    let testCat: MeowzerCat;

    beforeEach(async () => {
      testCat = await meowzer.cats.create({ name: "Original" });
    });

    it("should update cat name", () => {
      testCat.setName("Updated");

      expect(testCat.name).toBe("Updated");
    });

    it("should update cat description", () => {
      testCat.setDescription("New description");

      expect(testCat.description).toBe("New description");
    });

    it("should update cat metadata", () => {
      testCat.updateMetadata({ age: 3, breed: "Tabby" });

      expect(testCat.metadata.age).toBe(3);
      expect(testCat.metadata.breed).toBe("Tabby");
    });

    it("should add tags to metadata", () => {
      testCat.updateMetadata({ tags: ["playful", "friendly"] });

      expect(testCat.metadata?.tags).toContain("playful");
      expect(testCat.metadata?.tags).toContain("friendly");
    });
  });

  describe("Cat Deletion", () => {
    it("should destroy a cat", async () => {
      const cat = await meowzer.cats.create({ name: "Temporary" });

      expect(meowzer.cats.has(cat.id)).toBe(true);

      await meowzer.cats.destroy(cat.id);

      expect(meowzer.cats.has(cat.id)).toBe(false);
    });

    it("should trigger lifecycle hooks on deletion", async () => {
      const beforeDelete = vi.fn();
      const afterDelete = vi.fn();

      meowzer.hooks.on("beforeDelete", beforeDelete);
      meowzer.hooks.on("afterDelete", afterDelete);

      const cat = await meowzer.cats.create({ name: "Temporary" });
      await meowzer.cats.destroy(cat.id);

      expect(beforeDelete).toHaveBeenCalledWith(
        expect.objectContaining({ catId: cat.id })
      );

      expect(afterDelete).toHaveBeenCalledWith(
        expect.objectContaining({ catId: cat.id })
      );
    });

    it("should destroy all cats", async () => {
      await meowzer.cats.createMany([{}, {}, {}, {}, {}]);
      expect(meowzer.cats.getAll()).toHaveLength(5);

      await meowzer.cats.destroyAll();

      expect(meowzer.cats.getAll()).toHaveLength(0);
    });
  });

  describe("Cat Builder", () => {
    it("should create cat using builder", async () => {
      const cat = await meowzer.cats
        .builder()
        .name("Fluffy")
        .description("A fluffy white cat")
        .metadata({
          tags: ["indoor", "playful"],
          adoptionDate: "2024-01-15",
        })
        .build();

      expect(cat.name).toBe("Fluffy");
      expect(cat.description).toBe("A fluffy white cat");
      expect(cat.metadata?.tags).toContain("indoor");
      expect(cat.metadata?.tags).toContain("playful");
      expect(cat.metadata?.adoptionDate).toBe("2024-01-15");
    });

    it("should create cat from seed using builder", async () => {
      const seed = "solid-000000-FFFF00-l-long-v1";
      const cat = await meowzer.cats
        .builder()
        .name("Generated")
        .fromSeed(seed)
        .build();

      expect(cat.seed).toBe(seed);
    });
  });
});
