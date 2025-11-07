/**
 * Hat Accessories Tests - MeowzerCat hat functionality
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Meowzer } from "../meowzer-sdk.js";
import type { MeowzerCat } from "../meowzer-cat.js";
import type { HatType } from "../index.js";

describe("Hat Accessories", () => {
  let meowzer: Meowzer;
  let cat: MeowzerCat;

  beforeEach(async () => {
    meowzer = new Meowzer({
      storage: { enabled: false },
    });
    await meowzer.init();

    // Create a test cat
    cat = await meowzer.cats.create();
  });

  afterEach(async () => {
    await meowzer.destroy();
  });

  describe("Adding Hats", () => {
    it("should add a beanie hat to a cat", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");

      expect(cat.hasHat()).toBe(true);
      const hat = cat.getHat();
      expect(hat).toBeDefined();
      expect(hat?.type).toBe("beanie");
      expect(hat?.baseColor).toBe("#FF0000");
      expect(hat?.accentColor).toBe("#FFFF00");
    });

    it("should add a cowboy hat to a cat", () => {
      cat.addHat("cowboy", "#8B4513", "#FFD700");

      const hat = cat.getHat();
      expect(hat?.type).toBe("cowboy");
      expect(hat?.baseColor).toBe("#8B4513");
      expect(hat?.accentColor).toBe("#FFD700");
    });

    it("should add a baseball cap to a cat", () => {
      cat.addHat("baseball", "#0000FF", "#FFFFFF");

      const hat = cat.getHat();
      expect(hat?.type).toBe("baseball");
      expect(hat?.baseColor).toBe("#0000FF");
      expect(hat?.accentColor).toBe("#FFFFFF");
    });

    it("should replace existing hat when adding a new one", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");
      expect(cat.getHat()?.type).toBe("beanie");

      cat.addHat("cowboy", "#8B4513", "#FFD700");
      expect(cat.getHat()?.type).toBe("cowboy");
      expect(cat.hasHat()).toBe(true);
    });
  });

  describe("Removing Hats", () => {
    it("should remove a hat from a cat", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");
      expect(cat.hasHat()).toBe(true);

      cat.removeHat();
      expect(cat.hasHat()).toBe(false);
      expect(cat.getHat()).toBeUndefined();
    });

    it("should handle removing hat when cat has no hat", () => {
      expect(cat.hasHat()).toBe(false);

      // Should not throw
      expect(() => cat.removeHat()).not.toThrow();

      expect(cat.hasHat()).toBe(false);
    });
  });

  describe("Updating Hat Colors", () => {
    beforeEach(() => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");
    });

    it("should update hat colors", () => {
      cat.updateHatColors("#00FF00", "#0000FF");

      const hat = cat.getHat();
      expect(hat?.type).toBe("beanie"); // Type unchanged
      expect(hat?.baseColor).toBe("#00FF00");
      expect(hat?.accentColor).toBe("#0000FF");
    });

    it("should do nothing if cat has no hat", () => {
      cat.removeHat();
      expect(cat.hasHat()).toBe(false);

      // Should not throw
      expect(() =>
        cat.updateHatColors("#00FF00", "#0000FF")
      ).not.toThrow();

      expect(cat.hasHat()).toBe(false);
    });
  });

  describe("Hat Queries", () => {
    it("should return false for hasHat when cat has no hat", () => {
      expect(cat.hasHat()).toBe(false);
    });

    it("should return true for hasHat when cat has a hat", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");
      expect(cat.hasHat()).toBe(true);
    });

    it("should return undefined for getHat when cat has no hat", () => {
      expect(cat.getHat()).toBeUndefined();
    });

    it("should return hat data for getHat when cat has a hat", () => {
      cat.addHat("cowboy", "#8B4513", "#FFD700");

      const hat = cat.getHat();
      expect(hat).toEqual({
        type: "cowboy",
        baseColor: "#8B4513",
        accentColor: "#FFD700",
      });
    });
  });

  describe("Hat Types", () => {
    const hatTypes: HatType[] = ["beanie", "cowboy", "baseball"];

    hatTypes.forEach((hatType) => {
      it(`should support ${hatType} hat type`, () => {
        cat.addHat(hatType, "#000000", "#FFFFFF");

        const hat = cat.getHat();
        expect(hat?.type).toBe(hatType);
      });
    });
  });

  describe("Cat State Persistence", () => {
    it("should maintain hat data in cat's internal protoCat", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");

      const protoCat = (cat as any)._cat.protoCat;
      expect(protoCat.appearance.accessories?.hat).toBeDefined();
      expect(protoCat.appearance.accessories.hat.type).toBe("beanie");
      expect(protoCat.appearance.accessories.hat.baseColor).toBe(
        "#FF0000"
      );
      expect(protoCat.appearance.accessories.hat.accentColor).toBe(
        "#FFFF00"
      );
    });

    it("should remove hat data from internal protoCat when hat is removed", () => {
      cat.addHat("beanie", "#FF0000", "#FFFF00");
      cat.removeHat();

      const protoCat = (cat as any)._cat.protoCat;
      expect(protoCat.appearance.accessories?.hat).toBeUndefined();
    });
  });
});
