/**
 * MeowzerUtils Tests - Utility functions
 */

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { MeowzerUtils } from "../utils.js";

describe("MeowzerUtils", () => {
  describe("ID Generation", () => {
    it("should generate unique IDs", () => {
      const id1 = MeowzerUtils.generateId();
      const id2 = MeowzerUtils.generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs with cat- prefix", () => {
      const id = MeowzerUtils.generateId();
      expect(id).toMatch(/^cat-/);
    });

    it("should generate IDs of consistent format", () => {
      const id = MeowzerUtils.generateId();
      // Format: cat-{timestamp}-{random}
      expect(id).toMatch(/^cat-\d+-[a-z0-9]+$/);
    });
  });

  describe("Seed Generation", () => {
    it("should generate seed from valid settings", () => {
      const seed = MeowzerUtils.generateSeed({
        color: "#FF6600",
        pattern: "tabby",
        eyeColor: "#00FF00",
        size: "medium",
        furLength: "short",
      });

      expect(seed).toBeDefined();
      expect(typeof seed).toBe("string");
      expect(seed).toMatch(/^[\w]+-[\w]+-[\w]+-[\w]+-[\w]+-v1$/);
    });

    it("should generate consistent seeds for same settings", () => {
      const settings = {
        color: "#FF6600",
        pattern: "tabby" as const,
        eyeColor: "#00FF00",
        size: "medium" as const,
        furLength: "short" as const,
      };

      const seed1 = MeowzerUtils.generateSeed(settings);
      const seed2 = MeowzerUtils.generateSeed(settings);

      expect(seed1).toBe(seed2);
    });

    it("should generate different seeds for different settings", () => {
      const settings1 = {
        color: "#FF6600",
        pattern: "tabby" as const,
        eyeColor: "#00FF00",
        size: "medium" as const,
        furLength: "short" as const,
      };

      const settings2 = {
        color: "#000000",
        pattern: "solid" as const,
        eyeColor: "#FFFF00",
        size: "large" as const,
        furLength: "long" as const,
      };

      const seed1 = MeowzerUtils.generateSeed(settings1);
      const seed2 = MeowzerUtils.generateSeed(settings2);

      expect(seed1).not.toBe(seed2);
    });
  });

  describe("Seed Validation", () => {
    it("should validate correct seed format", () => {
      const validSeed = "tabby-FF6600-00FF00-m-short-v1";
      expect(MeowzerUtils.validateSeed(validSeed)).toBe(true);
    });

    it("should reject empty string", () => {
      expect(MeowzerUtils.validateSeed("")).toBe(false);
    });

    it("should reject non-string values", () => {
      expect(MeowzerUtils.validateSeed(null as any)).toBe(false);
      expect(MeowzerUtils.validateSeed(undefined as any)).toBe(false);
      expect(MeowzerUtils.validateSeed(123 as any)).toBe(false);
    });

    it("should reject malformed seeds", () => {
      expect(MeowzerUtils.validateSeed("invalid-seed")).toBe(false);
      expect(MeowzerUtils.validateSeed("not-a-seed-at-all")).toBe(
        false
      );
    });

    it("should accept seeds with different patterns", () => {
      const seeds = [
        "solid-000000-FFFF00-s-short-v1",
        "tabby-FF6600-00FF00-m-medium-v1",
        "calico-FFFFFF-0000FF-l-long-v1",
      ];

      seeds.forEach((seed) => {
        expect(MeowzerUtils.validateSeed(seed)).toBe(true);
      });
    });
  });

  describe("Seed Info", () => {
    it("should return seed info for valid seed", () => {
      const seed = "tabby-FF6600-00FF00-m-short-v1";
      const info = MeowzerUtils.getSeedInfo(seed);

      expect(info).toBeDefined();
      expect(typeof info).toBe("string");
    });

    it("should throw for invalid seed", () => {
      expect(() => {
        MeowzerUtils.getSeedInfo("invalid-seed");
      }).toThrow();
    });
  });

  describe("Name Validation", () => {
    it("should validate normal names", () => {
      expect(MeowzerUtils.validateName("Whiskers")).toBe(true);
      expect(MeowzerUtils.validateName("Mr. Fluffy")).toBe(true);
      expect(MeowzerUtils.validateName("Cat123")).toBe(true);
    });

    it("should trim whitespace before validating", () => {
      expect(MeowzerUtils.validateName("  Whiskers  ")).toBe(true);
    });

    it("should reject empty strings", () => {
      expect(MeowzerUtils.validateName("")).toBe(false);
      expect(MeowzerUtils.validateName("   ")).toBe(false);
    });

    it("should reject non-string values", () => {
      expect(MeowzerUtils.validateName(null as any)).toBe(false);
      expect(MeowzerUtils.validateName(undefined as any)).toBe(false);
      expect(MeowzerUtils.validateName(123 as any)).toBe(false);
    });

    it("should reject names over 100 characters", () => {
      const longName = "a".repeat(101);
      expect(MeowzerUtils.validateName(longName)).toBe(false);
    });

    it("should accept names exactly 100 characters", () => {
      const maxName = "a".repeat(100);
      expect(MeowzerUtils.validateName(maxName)).toBe(true);
    });

    it("should accept special characters", () => {
      expect(MeowzerUtils.validateName("Meow🐱Cat™️")).toBe(true);
      expect(MeowzerUtils.validateName("Sir Whiskers III")).toBe(
        true
      );
    });
  });

  describe("Description Validation", () => {
    it("should validate normal descriptions", () => {
      expect(MeowzerUtils.validateDescription("A friendly cat")).toBe(
        true
      );
      expect(MeowzerUtils.validateDescription("")).toBe(true); // Empty is valid
    });

    it("should reject non-string values", () => {
      expect(MeowzerUtils.validateDescription(null as any)).toBe(
        false
      );
      expect(MeowzerUtils.validateDescription(undefined as any)).toBe(
        false
      );
    });

    it("should reject descriptions over 1000 characters", () => {
      const longDesc = "a".repeat(1001);
      expect(MeowzerUtils.validateDescription(longDesc)).toBe(false);
    });

    it("should accept descriptions exactly 1000 characters", () => {
      const maxDesc = "a".repeat(1000);
      expect(MeowzerUtils.validateDescription(maxDesc)).toBe(true);
    });
  });

  describe("Name Sanitization", () => {
    it("should trim whitespace", () => {
      expect(MeowzerUtils.sanitizeName("  Whiskers  ")).toBe(
        "Whiskers"
      );
      expect(MeowzerUtils.sanitizeName("\tTabby\n")).toBe("Tabby");
    });

    it("should truncate to 100 characters", () => {
      const longName = "a".repeat(150);
      const sanitized = MeowzerUtils.sanitizeName(longName);
      expect(sanitized).toHaveLength(100);
    });

    it("should handle non-string input", () => {
      expect(MeowzerUtils.sanitizeName(null as any)).toBe("");
      expect(MeowzerUtils.sanitizeName(undefined as any)).toBe("");
      expect(MeowzerUtils.sanitizeName(123 as any)).toBe("");
    });

    it("should preserve special characters", () => {
      expect(MeowzerUtils.sanitizeName("Meow🐱Cat™️")).toBe(
        "Meow🐱Cat™️"
      );
    });

    it("should return empty string for whitespace-only input", () => {
      expect(MeowzerUtils.sanitizeName("   ")).toBe("");
    });
  });

  describe("Description Sanitization", () => {
    it("should truncate to 1000 characters", () => {
      const longDesc = "a".repeat(1500);
      const sanitized = MeowzerUtils.sanitizeDescription(longDesc);
      expect(sanitized).toHaveLength(1000);
    });

    it("should handle non-string input", () => {
      expect(MeowzerUtils.sanitizeDescription(null as any)).toBe("");
      expect(MeowzerUtils.sanitizeDescription(undefined as any)).toBe(
        ""
      );
    });

    it("should preserve description as-is if under limit", () => {
      const desc = "A friendly orange tabby cat";
      expect(MeowzerUtils.sanitizeDescription(desc)).toBe(desc);
    });

    it("should not trim whitespace", () => {
      const desc = "  Some description  ";
      expect(MeowzerUtils.sanitizeDescription(desc)).toBe(desc);
    });
  });

  describe("Random Name Generation", () => {
    it("should generate a name", () => {
      const name = MeowzerUtils.randomName();
      expect(name).toBeDefined();
      expect(typeof name).toBe("string");
      expect(name.length).toBeGreaterThan(0);
    });

    it("should generate different names (probabilistic)", () => {
      const names = new Set();
      for (let i = 0; i < 50; i++) {
        names.add(MeowzerUtils.randomName());
      }
      // Should get at least a few different names
      expect(names.size).toBeGreaterThan(1);
    });

    it("should generate valid names", () => {
      for (let i = 0; i < 10; i++) {
        const name = MeowzerUtils.randomName();
        expect(MeowzerUtils.validateName(name)).toBe(true);
      }
    });
  });

  describe("Date Formatting", () => {
    it("should format date to ISO-like string", () => {
      const date = new Date("2025-10-25T14:30:00.000Z");
      const formatted = MeowzerUtils.formatDate(date);

      expect(formatted).toBe("2025-10-25 14:30:00");
    });

    it("should handle different dates", () => {
      const date1 = new Date("2020-01-01T00:00:00.000Z");
      const date2 = new Date("2025-12-31T23:59:59.999Z");

      expect(MeowzerUtils.formatDate(date1)).toBe(
        "2020-01-01 00:00:00"
      );
      expect(MeowzerUtils.formatDate(date2)).toBe(
        "2025-12-31 23:59:59"
      );
    });

    it("should exclude milliseconds", () => {
      const date = new Date("2025-10-25T14:30:00.999Z");
      const formatted = MeowzerUtils.formatDate(date);

      expect(formatted).not.toContain(".999");
      expect(formatted).toBe("2025-10-25 14:30:00");
    });
  });

  describe("Age Calculation", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should calculate age of 0 days for just created", () => {
      const now = new Date("2025-10-25T12:00:00.000Z");
      vi.setSystemTime(now);

      const age = MeowzerUtils.getAge(now);
      expect(age).toBe(0);
    });

    it("should calculate age in days", () => {
      const now = new Date("2025-10-25T12:00:00.000Z");
      vi.setSystemTime(now);

      const created = new Date("2025-10-20T12:00:00.000Z");
      const age = MeowzerUtils.getAge(created);

      expect(age).toBe(5);
    });

    it("should handle fractional days (floor)", () => {
      const now = new Date("2025-10-25T18:00:00.000Z");
      vi.setSystemTime(now);

      const created = new Date("2025-10-24T12:00:00.000Z");
      const age = MeowzerUtils.getAge(created);

      // 30 hours = 1.25 days, should floor to 1
      expect(age).toBe(1);
    });

    it("should handle longer time periods", () => {
      const now = new Date("2025-10-25T12:00:00.000Z");
      vi.setSystemTime(now);

      const created = new Date("2025-01-01T12:00:00.000Z");
      const age = MeowzerUtils.getAge(created);

      // Approximately 297 days (Jan 1 to Oct 25)
      expect(age).toBeGreaterThan(290);
      expect(age).toBeLessThan(300);
    });
  });

  describe("Edge Cases", () => {
    it("should handle concurrent ID generation", () => {
      const ids = [];
      for (let i = 0; i < 100; i++) {
        ids.push(MeowzerUtils.generateId());
      }

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100); // All should be unique
    });

    it("should handle empty metadata gracefully", () => {
      const name = MeowzerUtils.sanitizeName("");
      expect(name).toBe("");
    });

    it("should validate seeds with different cases", () => {
      // Seeds should be validated regardless of hex case
      const seed = "tabby-FF6600-00FF00-m-short-v1";
      expect(MeowzerUtils.validateSeed(seed)).toBe(true);
    });
  });
});
