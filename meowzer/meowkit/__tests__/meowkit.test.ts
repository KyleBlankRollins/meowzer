import { describe, it, expect } from "vitest";
import {
  buildCat,
  buildCatFromSeed,
  validateSettings,
  generateSeed,
  parseSeed,
  serializeCat,
  deserializeCat,
  CatBuilder,
} from "../meowkit.js";
import type { CatSettings } from "../../types.js";

describe("Meowkit", () => {
  const validSettings: CatSettings = {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  };

  describe("validateSettings", () => {
    it("should validate correct settings", () => {
      const result = validateSettings(validSettings);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject invalid color", () => {
      const result = validateSettings({
        ...validSettings,
        color: "not-a-color",
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid pattern", () => {
      const result = validateSettings({
        ...validSettings,
        pattern: "invalid" as any,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("pattern"))).toBe(
        true
      );
    });

    it("should accept named colors", () => {
      const result = validateSettings({
        ...validSettings,
        color: "orange",
        eyeColor: "green",
      });
      expect(result.valid).toBe(true);
    });
  });

  describe("generateSeed and parseSeed", () => {
    it("should generate a seed from settings", () => {
      const seed = generateSeed(validSettings);
      expect(seed).toMatch(
        /^tabby-[0-9A-F]{6}-[0-9A-F]{6}-m-short-v1$/
      );
    });

    it("should parse a seed back to settings", () => {
      const seed = "tabby-FF9500-00FF00-m-short-v1";
      const settings = parseSeed(seed);
      expect(settings.pattern).toBe("tabby");
      expect(settings.color).toBe("#FF9500");
      expect(settings.eyeColor).toBe("#00FF00");
      expect(settings.size).toBe("medium");
      expect(settings.furLength).toBe("short");
    });

    it("should round-trip settings through seed", () => {
      const seed = generateSeed(validSettings);
      const parsed = parseSeed(seed);
      expect(parsed.pattern).toBe(validSettings.pattern);
      expect(parsed.size).toBe(validSettings.size);
      expect(parsed.furLength).toBe(validSettings.furLength);
    });

    it("should throw on invalid seed format", () => {
      expect(() => parseSeed("invalid-seed")).toThrow();
    });

    it("should throw on unsupported version", () => {
      expect(() =>
        parseSeed("tabby-FF9500-00FF00-m-short-v99")
      ).toThrow();
    });
  });

  describe("buildCat", () => {
    it("should create a ProtoCat from settings", () => {
      const cat = buildCat(validSettings);
      expect(cat.id).toBeDefined();
      expect(cat.seed).toBeDefined();
      expect(cat.appearance.color).toBeDefined();
      expect(cat.dimensions.width).toBe(100);
      expect(cat.spriteData.svg).toBeDefined();
      expect(cat.metadata.createdAt).toBeInstanceOf(Date);
    });

    it("should generate unique IDs", () => {
      const cat1 = buildCat(validSettings);
      const cat2 = buildCat(validSettings);
      expect(cat1.id).not.toBe(cat2.id);
    });

    it("should include shading colors", () => {
      const cat = buildCat(validSettings);
      expect(cat.appearance.shadingColor).toBeDefined();
      expect(cat.appearance.highlightColor).toBeDefined();
    });

    it("should scale based on size", () => {
      const small = buildCat({ ...validSettings, size: "small" });
      const medium = buildCat({ ...validSettings, size: "medium" });
      const large = buildCat({ ...validSettings, size: "large" });

      expect(small.dimensions.scale).toBeLessThan(
        medium.dimensions.scale
      );
      expect(medium.dimensions.scale).toBeLessThan(
        large.dimensions.scale
      );
    });

    it("should generate SVG with correct viewBox", () => {
      const cat = buildCat(validSettings);
      expect(cat.spriteData.viewBox.width).toBe(100);
      expect(cat.spriteData.viewBox.height).toBe(100);
    });

    it("should include element IDs for animation", () => {
      const cat = buildCat(validSettings);
      expect(cat.spriteData.elements.body).toBeDefined();
      expect(cat.spriteData.elements.head).toBeDefined();
      expect(cat.spriteData.elements.tail).toBeDefined();
      expect(cat.spriteData.elements.eyes).toHaveLength(2);
      expect(cat.spriteData.elements.ears).toHaveLength(2);
    });

    it("should include pattern elements for non-solid patterns", () => {
      const cat = buildCat(validSettings); // tabby
      expect(cat.spriteData.elements.pattern).toBeDefined();
      expect(cat.spriteData.elements.pattern?.length).toBeGreaterThan(
        0
      );
    });

    it("should not include pattern elements for solid", () => {
      const cat = buildCat({ ...validSettings, pattern: "solid" });
      expect(cat.spriteData.elements.pattern).toBeUndefined();
    });

    it("should throw on invalid settings", () => {
      expect(() =>
        buildCat({ ...validSettings, pattern: "invalid" as any })
      ).toThrow();
    });
  });

  describe("buildCatFromSeed", () => {
    it("should create a cat from seed", () => {
      const seed = "tabby-FF9500-00FF00-m-short-v1";
      const cat = buildCatFromSeed(seed);
      expect(cat.seed).toBe(seed);
      expect(cat.appearance.color).toBe("#FF9500");
    });

    it("should create identical cats from same seed", () => {
      const seed = "calico-A52A2A-0000FF-l-medium-v1";
      const cat1 = buildCatFromSeed(seed);
      const cat2 = buildCatFromSeed(seed);

      // IDs will be different, but appearance should match
      expect(cat1.appearance.color).toBe(cat2.appearance.color);
      expect(cat1.appearance.eyeColor).toBe(cat2.appearance.eyeColor);
      expect(cat1.appearance.pattern).toBe(cat2.appearance.pattern);
    });
  });

  describe("serializeCat and deserializeCat", () => {
    it("should serialize a cat to JSON", () => {
      const cat = buildCat(validSettings);
      const json = serializeCat(cat);
      expect(json).toBeDefined();
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe(cat.id);
      expect(parsed.seed).toBe(cat.seed);
    });

    it("should deserialize a cat from JSON", () => {
      const cat = buildCat(validSettings);
      const json = serializeCat(cat);
      const restored = deserializeCat(json);

      expect(restored.id).toBe(cat.id);
      expect(restored.seed).toBe(cat.seed);
      expect(restored.appearance.color).toBe(cat.appearance.color);
    });

    it("should preserve creation date", () => {
      const cat = buildCat(validSettings);
      const json = serializeCat(cat);
      const restored = deserializeCat(json);

      expect(restored.metadata.createdAt.getTime()).toBe(
        cat.metadata.createdAt.getTime()
      );
    });

    it("should regenerate SVG on deserialization", () => {
      const cat = buildCat(validSettings);
      const json = serializeCat(cat);
      const restored = deserializeCat(json);

      expect(restored.spriteData.svg).toBeDefined();
      expect(restored.spriteData.svg.length).toBeGreaterThan(0);
    });
  });

  describe("CatBuilder", () => {
    it("should build a cat using builder pattern", () => {
      const cat = new CatBuilder()
        .withColor("#FF9500")
        .withEyeColor("#00FF00")
        .withPattern("tabby")
        .withSize("medium")
        .withFurLength("short")
        .build();

      expect(cat.appearance.color).toBe("#FF9500");
      expect(cat.appearance.pattern).toBe("tabby");
    });

    it("should throw if not all properties are set", () => {
      const builder = new CatBuilder()
        .withColor("#FF9500")
        .withEyeColor("#00FF00");

      expect(() => builder.build()).toThrow();
    });

    it("should allow method chaining", () => {
      const builder = new CatBuilder();
      const result = builder
        .withColor("#FF9500")
        .withEyeColor("#00FF00");

      expect(result).toBe(builder);
    });
  });

  describe("SVG Generation", () => {
    it("should generate valid SVG markup", () => {
      const cat = buildCat(validSettings);
      const svg = cat.spriteData.svg;

      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it("should include all body parts", () => {
      const cat = buildCat(validSettings);
      const svg = cat.spriteData.svg;

      expect(svg).toContain(
        'id="' + cat.spriteData.elements.body + '"'
      );
      expect(svg).toContain(
        'id="' + cat.spriteData.elements.head + '"'
      );
      expect(svg).toContain(
        'id="' + cat.spriteData.elements.tail + '"'
      );
    });

    it("should apply correct colors", () => {
      const cat = buildCat(validSettings);
      const svg = cat.spriteData.svg;

      expect(svg).toContain(cat.appearance.color);
      expect(svg).toContain(cat.appearance.eyeColor);
    });

    it("should include pattern-specific elements", () => {
      const tabby = buildCat({ ...validSettings, pattern: "tabby" });
      expect(tabby.spriteData.svg).toContain("pattern-overlay");

      const solid = buildCat({ ...validSettings, pattern: "solid" });
      expect(solid.spriteData.svg).not.toContain("pattern-overlay");
    });
  });
});
