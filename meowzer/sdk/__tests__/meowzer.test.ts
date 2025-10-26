/**
 * Meowzer Tests
 *
 * Comprehensive test suite for the Meowzer wrapper API
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import {
  createCat,
  createCatFromSeed,
  createRandomCat,
  getAllCats,
  getCatById,
  destroyAllCats,
  pauseAllCats,
  resumeAllCats,
  getRandomSettings,
  validateSettings,
  setDefaultBoundaries,
  setDefaultContainer,
  getViewportBoundaries,
  getPersonalityPresets,
} from "../meowzer.js";
import type { CatSettings } from "../../types.js";

describe("Meowzer", () => {
  beforeEach(() => {
    // Clean up any existing cats
    destroyAllCats();
  });

  afterEach(() => {
    // Clean up after each test
    destroyAllCats();
  });

  // ==========================================================================
  // CREATION FUNCTIONS
  // ==========================================================================

  describe("createCat", () => {
    const validSettings: CatSettings = {
      color: "#FF9500",
      eyeColor: "#00FF00",
      pattern: "tabby",
      size: "medium",
      furLength: "short",
    };

    it("should create a cat with valid settings", () => {
      const cat = createCat(validSettings);

      expect(cat).toBeDefined();
      expect(cat.id).toBeDefined();
      expect(cat.seed).toBeDefined();
      expect(cat.element).toBeInstanceOf(HTMLElement);
    });

    it("should create a cat with default options", () => {
      const cat = createCat(validSettings);

      expect(cat.isActive).toBe(true); // autoStart defaults to true
    });

    it("should create a cat with custom position", () => {
      const cat = createCat(validSettings, {
        position: { x: 100, y: 200 },
      });

      expect(cat.position.x).toBe(100);
      expect(cat.position.y).toBe(200);
    });

    it("should create a cat with custom personality", () => {
      const cat = createCat(validSettings, {
        personality: "playful",
      });

      expect(cat).toBeDefined();
      expect(cat.personality).toBeDefined();
    });

    it("should respect autoStart option", () => {
      const cat = createCat(validSettings, { autoStart: false });

      expect(cat.isActive).toBe(false);
    });

    it("should register cat automatically", () => {
      const cat = createCat(validSettings);
      const foundCat = getCatById(cat.id);

      expect(foundCat).toBe(cat);
    });
  });

  describe("createCatFromSeed", () => {
    it("should create a cat from a seed", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };
      const originalCat = createCat(settings);
      const seed = originalCat.seed;

      destroyAllCats();

      const recreatedCat = createCatFromSeed(seed);

      expect(recreatedCat.seed).toBe(seed);
    });

    it("should accept options", () => {
      const settings: CatSettings = {
        color: "#000000",
        eyeColor: "#0000FF",
        pattern: "solid",
        size: "large",
        furLength: "long",
      };
      const cat = createCat(settings);
      const seed = cat.seed;

      destroyAllCats();

      const recreatedCat = createCatFromSeed(seed, {
        position: { x: 50, y: 50 },
        personality: "lazy",
        autoStart: false,
      });

      expect(recreatedCat.position.x).toBe(50);
      expect(recreatedCat.position.y).toBe(50);
      expect(recreatedCat.isActive).toBe(false);
    });
  });

  describe("createRandomCat", () => {
    it("should create a random cat", () => {
      const cat = createRandomCat();

      expect(cat).toBeDefined();
      expect(cat.id).toBeDefined();
      expect(cat.seed).toBeDefined();
    });

    it("should create different cats each time", () => {
      const cat1 = createRandomCat({ autoStart: false });
      const cat2 = createRandomCat({ autoStart: false });

      // Seeds should be different (extremely unlikely to be the same)
      expect(cat1.seed).not.toBe(cat2.seed);
    });

    it("should accept options", () => {
      const cat = createRandomCat({
        autoStart: false,
        position: { x: 123, y: 456 },
      });

      expect(cat.isActive).toBe(false);
      expect(cat.position.x).toBe(123);
      expect(cat.position.y).toBe(456);
    });
  });

  // ==========================================================================
  // MANAGEMENT FUNCTIONS
  // ==========================================================================

  describe("getAllCats", () => {
    it("should return empty array when no cats exist", () => {
      const cats = getAllCats();

      expect(cats).toEqual([]);
    });

    it("should return all active cats", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const cat1 = createCat(settings);
      const cat2 = createCat(settings);
      const cat3 = createCat(settings);

      const cats = getAllCats();

      expect(cats).toHaveLength(3);
      expect(cats).toContain(cat1);
      expect(cats).toContain(cat2);
      expect(cats).toContain(cat3);
    });
  });

  describe("getCatById", () => {
    it("should return null for non-existent cat", () => {
      const cat = getCatById("non-existent-id");

      expect(cat).toBeNull();
    });

    it("should return cat by ID", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };
      const createdCat = createCat(settings);

      const foundCat = getCatById(createdCat.id);

      expect(foundCat).toBe(createdCat);
    });
  });

  describe("destroyAllCats", () => {
    it("should destroy all cats", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      createCat(settings);
      createCat(settings);
      createCat(settings);

      expect(getAllCats()).toHaveLength(3);

      destroyAllCats();

      expect(getAllCats()).toHaveLength(0);
    });
  });

  describe("pauseAllCats", () => {
    it("should pause all active cats", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const cat1 = createCat(settings);
      const cat2 = createCat(settings);

      expect(cat1.isActive).toBe(true);
      expect(cat2.isActive).toBe(true);

      pauseAllCats();

      expect(cat1.isActive).toBe(false);
      expect(cat2.isActive).toBe(false);
    });
  });

  describe("resumeAllCats", () => {
    it("should resume all paused cats", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const cat1 = createCat(settings);
      const cat2 = createCat(settings);

      pauseAllCats();

      expect(cat1.isActive).toBe(false);
      expect(cat2.isActive).toBe(false);

      resumeAllCats();

      expect(cat1.isActive).toBe(true);
      expect(cat2.isActive).toBe(true);
    });
  });

  // ==========================================================================
  // MEOWZERCAT CLASS
  // ==========================================================================

  describe("MeowzerCat", () => {
    const validSettings: CatSettings = {
      color: "#FF9500",
      eyeColor: "#00FF00",
      pattern: "tabby",
      size: "medium",
      furLength: "short",
    };

    describe("Lifecycle", () => {
      it("should pause and resume", () => {
        const cat = createCat(validSettings);

        expect(cat.isActive).toBe(true);

        cat.pause();
        expect(cat.isActive).toBe(false);

        cat.resume();
        expect(cat.isActive).toBe(true);
      });

      it("should handle multiple pause calls", () => {
        const cat = createCat(validSettings);

        cat.pause();
        cat.pause();
        cat.pause();

        expect(cat.isActive).toBe(false);
      });

      it("should handle multiple resume calls", () => {
        const cat = createCat(validSettings, { autoStart: false });

        cat.resume();
        cat.resume();
        cat.resume();

        expect(cat.isActive).toBe(true);
      });

      it("should destroy and clean up", () => {
        const cat = createCat(validSettings);
        const catId = cat.id;

        cat.destroy();

        expect(getCatById(catId)).toBeNull();
      });
    });

    describe("Configuration", () => {
      it("should set personality preset", () => {
        const cat = createCat(validSettings);

        cat.setPersonality("lazy");

        expect(cat.personality).toBeDefined();
      });

      it("should set custom personality", () => {
        const cat = createCat(validSettings);

        cat.setPersonality({
          energy: 0.8,
          curiosity: 0.6,
          playfulness: 0.9,
          independence: 0.4,
          sociability: 0.7,
        });

        expect(cat.personality).toBeDefined();
      });

      it("should set environment", () => {
        const cat = createCat(validSettings);

        cat.setEnvironment({
          boundaries: {
            minX: 0,
            maxX: 500,
            minY: 0,
            maxY: 500,
          },
        });

        expect(cat).toBeDefined();
      });
    });

    describe("Events", () => {
      it("should emit pause event", () => {
        const cat = createCat(validSettings);
        const handler = vi.fn();

        cat.on("pause", handler);
        cat.pause();

        expect(handler).toHaveBeenCalledWith({ id: cat.id });
      });

      it("should emit resume event", () => {
        const cat = createCat(validSettings);
        const handler = vi.fn();

        cat.on("resume", handler);
        cat.pause();
        cat.resume();

        expect(handler).toHaveBeenCalledWith({ id: cat.id });
      });

      it("should emit destroy event", () => {
        const cat = createCat(validSettings);
        const handler = vi.fn();

        cat.on("destroy", handler);
        cat.destroy();

        expect(handler).toHaveBeenCalledWith({ id: cat.id });
      });

      it("should remove event listener", () => {
        const cat = createCat(validSettings);
        const handler = vi.fn();

        cat.on("pause", handler);
        cat.off("pause", handler);
        cat.pause();

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe("State", () => {
      it("should have position", () => {
        const cat = createCat(validSettings, {
          position: { x: 100, y: 200 },
        });

        expect(cat.position).toEqual({ x: 100, y: 200 });
      });

      it("should have state", () => {
        const cat = createCat(validSettings);

        expect(cat.state).toBeDefined();
        expect(typeof cat.state).toBe("string");
      });

      it("should have personality", () => {
        const cat = createCat(validSettings, {
          personality: "playful",
        });

        expect(cat.personality).toBeDefined();
      });
    });
  });

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  describe("getRandomSettings", () => {
    it("should generate valid random settings", () => {
      const settings = getRandomSettings();

      expect(settings).toBeDefined();
      expect(settings.color).toBeDefined();
      expect(settings.eyeColor).toBeDefined();
      expect(settings.pattern).toBeDefined();
      expect(settings.size).toBeDefined();
      expect(settings.furLength).toBeDefined();

      const validation = validateSettings(settings);
      expect(validation.valid).toBe(true);
    });

    it("should generate different settings each time", () => {
      const settings1 = getRandomSettings();
      const settings2 = getRandomSettings();

      // At least one property should be different
      const isDifferent =
        settings1.color !== settings2.color ||
        settings1.eyeColor !== settings2.eyeColor ||
        settings1.pattern !== settings2.pattern ||
        settings1.size !== settings2.size ||
        settings1.furLength !== settings2.furLength;

      expect(isDifferent).toBe(true);
    });
  });

  describe("validateSettings", () => {
    it("should validate correct settings", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const result = validateSettings(settings);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid color", () => {
      const settings: CatSettings = {
        color: "not-a-color",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const result = validateSettings(settings);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid pattern", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "invalid" as any,
        size: "medium",
        furLength: "short",
      };

      const result = validateSettings(settings);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("pattern"))).toBe(
        true
      );
    });

    it("should reject invalid size", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "huge" as any,
        furLength: "short",
      };

      const result = validateSettings(settings);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("size"))).toBe(
        true
      );
    });
  });

  describe("getViewportBoundaries", () => {
    it("should return viewport boundaries", () => {
      const boundaries = getViewportBoundaries();

      expect(boundaries).toBeDefined();
      expect(boundaries.minX).toBe(0);
      expect(boundaries.minY).toBe(0);
      expect(typeof boundaries.maxX).toBe("number");
      expect(typeof boundaries.maxY).toBe("number");
    });
  });

  describe("setDefaultBoundaries", () => {
    it("should set default boundaries", () => {
      setDefaultBoundaries({
        minX: 0,
        maxX: 500,
        minY: 0,
        maxY: 500,
      });

      // Create a cat without specifying boundaries
      const cat = createCat({
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      });

      expect(cat).toBeDefined();
    });
  });

  describe("setDefaultContainer", () => {
    it("should set default container", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      setDefaultContainer(container);

      const cat = createCat({
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      });

      expect(cat.element.parentElement).toBe(container);

      document.body.removeChild(container);
    });
  });

  describe("getPersonalityPresets", () => {
    it("should return all personality presets", () => {
      const presets = getPersonalityPresets();

      expect(presets).toBeDefined();
      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
      expect(presets).toContain("lazy");
      expect(presets).toContain("playful");
      expect(presets).toContain("curious");
    });
  });

  // ==========================================================================
  // INTEGRATION TESTS
  // ==========================================================================

  describe("Integration", () => {
    it("should create multiple cats with different personalities", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const cat1 = createCat(settings, { personality: "lazy" });
      const cat2 = createCat(settings, { personality: "playful" });
      const cat3 = createCat(settings, { personality: "energetic" });

      expect(getAllCats()).toHaveLength(3);
      expect(cat1.personality).toBeDefined();
      expect(cat2.personality).toBeDefined();
      expect(cat3.personality).toBeDefined();
    });

    it("should handle full lifecycle", () => {
      const cat = createRandomCat();

      expect(cat.isActive).toBe(true);

      cat.pause();
      expect(cat.isActive).toBe(false);

      cat.resume();
      expect(cat.isActive).toBe(true);

      cat.destroy();
      expect(getCatById(cat.id)).toBeNull();
    });

    it("should handle seed recreation", () => {
      const settings: CatSettings = {
        color: "#FF9500",
        eyeColor: "#00FF00",
        pattern: "tabby",
        size: "medium",
        furLength: "short",
      };

      const originalCat = createCat(settings);
      const seed = originalCat.seed;

      destroyAllCats();

      const recreatedCat = createCatFromSeed(seed);

      expect(recreatedCat.seed).toBe(seed);
    });
  });
});
