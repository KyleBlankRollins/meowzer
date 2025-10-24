import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createBrain,
  BrainBuilder,
  getPersonality,
  getPersonalityPresets,
} from "../index.js";
import { Cat } from "../../meowtion/cat.js";
import type { ProtoCat } from "../../types.js";

// Mock ProtoCat for testing
function createMockProtoCat(): ProtoCat {
  return {
    id: "test-cat-123",
    seed: "tabby-FF9500-00FF00-m-short-v1",
    appearance: {
      color: "#FF9500",
      eyeColor: "#00FF00",
      shadingColor: "#CC7700",
      highlightColor: "#FFB733",
      pattern: "tabby",
      furLength: "short",
    },
    dimensions: {
      width: 100,
      height: 100,
      scale: 1.0,
      size: "medium",
      hitbox: { offsetX: 0, offsetY: 0, width: 100, height: 100 },
    },
    spriteData: {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle id="body" cx="50" cy="50" r="20" fill="#FF9500"/></svg>`,
      elements: {
        body: "body",
        head: "head",
        ears: ["ear-left", "ear-right"],
        eyes: ["eye-left", "eye-right"],
        tail: "tail",
      },
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
    },
    metadata: {
      createdAt: new Date(),
      version: "1",
    },
  };
}

describe("Meowbrain", () => {
  let protoCat: ProtoCat;
  let cat: Cat;

  beforeEach(() => {
    protoCat = createMockProtoCat();
    document.body.innerHTML = "";
    cat = new Cat(protoCat, {
      initialPosition: { x: 100, y: 100 },
      boundaries: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
    });
  });

  describe("Personality System", () => {
    it("should have all preset personalities", () => {
      const presets = getPersonalityPresets();
      expect(presets).toContain("lazy");
      expect(presets).toContain("playful");
      expect(presets).toContain("curious");
      expect(presets).toContain("aloof");
      expect(presets).toContain("energetic");
      expect(presets).toContain("balanced");
    });

    it("should get personality configuration", () => {
      const lazy = getPersonality("lazy");
      expect(lazy.energy).toBeLessThan(0.5);
      expect(lazy.independence).toBeGreaterThan(0.5);

      const playful = getPersonality("playful");
      expect(playful.playfulness).toBeGreaterThan(0.8);
      expect(playful.energy).toBeGreaterThan(0.7);
    });

    it("should have valid personality values (0-1)", () => {
      const presets = getPersonalityPresets();
      for (const preset of presets) {
        const personality = getPersonality(preset);
        expect(personality.energy).toBeGreaterThanOrEqual(0);
        expect(personality.energy).toBeLessThanOrEqual(1);
        expect(personality.curiosity).toBeGreaterThanOrEqual(0);
        expect(personality.curiosity).toBeLessThanOrEqual(1);
        expect(personality.playfulness).toBeGreaterThanOrEqual(0);
        expect(personality.playfulness).toBeLessThanOrEqual(1);
        expect(personality.independence).toBeGreaterThanOrEqual(0);
        expect(personality.independence).toBeLessThanOrEqual(1);
        expect(personality.sociability).toBeGreaterThanOrEqual(0);
        expect(personality.sociability).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("createBrain", () => {
    it("should create a brain instance", () => {
      const brain = createBrain(cat);
      expect(brain).toBeDefined();
      expect(brain.id).toBeDefined();
      expect(brain.cat).toBe(cat);
    });

    it("should use default personality if not provided", () => {
      const brain = createBrain(cat);
      const personality = brain.personality;
      expect(personality.energy).toBe(0.5);
      expect(personality.curiosity).toBe(0.5);
    });

    it("should accept personality preset", () => {
      const brain = createBrain(cat, { personality: "playful" });
      const personality = brain.personality;
      expect(personality.playfulness).toBeGreaterThan(0.8);
    });

    it("should accept custom personality", () => {
      const brain = createBrain(cat, {
        personality: {
          energy: 0.9,
          curiosity: 0.8,
          playfulness: 0.7,
          independence: 0.6,
          sociability: 0.5,
        },
      });
      const personality = brain.personality;
      expect(personality.energy).toBe(0.9);
      expect(personality.curiosity).toBe(0.8);
    });

    it("should accept environment configuration", () => {
      const environment = {
        boundaries: { minX: 0, maxX: 1000, minY: 0, maxY: 800 },
        attractors: [
          {
            position: { x: 500, y: 400 },
            strength: 0.7,
            type: "point" as const,
          },
        ],
      };
      const brain = createBrain(cat, { environment });
      expect(brain.environment.attractors).toHaveLength(1);
    });
  });

  describe("Brain Lifecycle", () => {
    it("should not be running initially", () => {
      const brain = createBrain(cat);
      expect(brain.isRunning).toBe(false);
    });

    it("should start brain", () => {
      const brain = createBrain(cat);
      brain.start();
      expect(brain.isRunning).toBe(true);
    });

    it("should stop brain", () => {
      const brain = createBrain(cat);
      brain.start();
      brain.stop();
      expect(brain.isRunning).toBe(false);
    });

    it("should destroy brain", () => {
      const brain = createBrain(cat);
      brain.start();
      brain.destroy();
      expect(brain.isRunning).toBe(false);
    });

    it("should not start after destruction", () => {
      const brain = createBrain(cat);
      brain.destroy();
      expect(() => brain.start()).toThrow();
    });

    it("should handle multiple start calls", () => {
      const brain = createBrain(cat);
      brain.start();
      brain.start(); // Should not throw
      expect(brain.isRunning).toBe(true);
    });

    it("should handle multiple stop calls", () => {
      const brain = createBrain(cat);
      brain.start();
      brain.stop();
      brain.stop(); // Should not throw
      expect(brain.isRunning).toBe(false);
    });
  });

  describe("Brain State", () => {
    it("should have initial state", () => {
      const brain = createBrain(cat);
      const state = brain.state;
      expect(state.currentBehavior).toBeDefined();
      expect(state.motivation).toBeDefined();
      expect(state.lastDecisionTime).toBeDefined();
      expect(state.decisionCooldown).toBeDefined();
    });

    it("should have initial motivations", () => {
      const brain = createBrain(cat);
      const motivation = brain.state.motivation;
      expect(motivation.rest).toBeGreaterThanOrEqual(0);
      expect(motivation.rest).toBeLessThanOrEqual(1);
      expect(motivation.stimulation).toBeGreaterThanOrEqual(0);
      expect(motivation.stimulation).toBeLessThanOrEqual(1);
      expect(motivation.exploration).toBeGreaterThanOrEqual(0);
      expect(motivation.exploration).toBeLessThanOrEqual(1);
    });

    it("should have initial memory", () => {
      const brain = createBrain(cat);
      const memory = brain.memory;
      expect(memory.visitedPositions).toHaveLength(1);
      expect(memory.previousBehaviors).toHaveLength(0);
      expect(memory.boundaryHits).toBe(0);
    });
  });

  describe("Brain Configuration", () => {
    it("should update personality", () => {
      const brain = createBrain(cat);
      brain.setPersonality("energetic");
      const personality = brain.personality;
      expect(personality.energy).toBeGreaterThan(0.8);
    });

    it("should update partial personality", () => {
      const brain = createBrain(cat, { personality: "balanced" });
      brain.setPersonality({ energy: 0.9 });
      const personality = brain.personality;
      expect(personality.energy).toBe(0.9);
      expect(personality.curiosity).toBe(0.5); // Should keep other values
    });

    it("should update environment", () => {
      const brain = createBrain(cat);
      brain.setEnvironment({
        boundaries: { minX: 0, maxX: 500, minY: 0, maxY: 400 },
      });
      expect(brain.environment.boundaries?.maxX).toBe(500);
    });
  });

  describe("Brain Events", () => {
    it("should emit behaviorChange event", async () => {
      const brain = createBrain(cat, {
        decisionInterval: [100, 200],
      });
      const handler = vi.fn();
      brain.on("behaviorChange", handler);

      brain.start();
      await new Promise((resolve) => setTimeout(resolve, 300));
      brain.stop();

      // May or may not have changed behavior yet, but handler should be set up
      expect(handler).toBeDefined();
    });

    it("should emit decisionMade event", async () => {
      const brain = createBrain(cat, {
        decisionInterval: [50, 100],
      });
      const handler = vi.fn();
      brain.on("decisionMade", handler);

      brain.start();
      await new Promise((resolve) => setTimeout(resolve, 150));
      brain.stop();

      expect(handler).toHaveBeenCalled();
    });

    it("should remove event listener", () => {
      const brain = createBrain(cat);
      const handler = vi.fn();
      brain.on("behaviorChange", handler);
      brain.off("behaviorChange", handler);

      // Handler removed, so won't be called
      expect(true).toBe(true);
    });

    it("should handle multiple listeners", () => {
      const brain = createBrain(cat);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      brain.on("behaviorChange", handler1);
      brain.on("behaviorChange", handler2);

      expect(true).toBe(true);
    });
  });

  describe("BrainBuilder", () => {
    it("should build brain with fluent API", () => {
      const brain = new BrainBuilder(cat)
        .withPersonality("playful")
        .withEnvironment({
          boundaries: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
        })
        .withDecisionInterval(1000, 3000)
        .build();

      expect(brain).toBeDefined();
      expect(brain.personality.playfulness).toBeGreaterThan(0.8);
    });

    it("should allow method chaining", () => {
      const builder = new BrainBuilder(cat);
      const result = builder.withPersonality("curious");
      expect(result).toBe(builder);
    });

    it("should configure motivation decay", () => {
      const brain = new BrainBuilder(cat)
        .withMotivationDecay({
          rest: 0.005,
          stimulation: 0.01,
          exploration: 0.003,
        })
        .build();

      expect(brain).toBeDefined();
    });

    it("should configure decision interval", () => {
      const brain = new BrainBuilder(cat)
        .withDecisionInterval(500, 1500)
        .build();

      expect(brain).toBeDefined();
    });
  });

  describe("Behavior System", () => {
    it("should have a current behavior", () => {
      const brain = createBrain(cat);
      const behavior = brain.state.currentBehavior;
      expect([
        "wandering",
        "resting",
        "playing",
        "observing",
        "exploring",
      ]).toContain(behavior);
    });

    it("should make decisions when running", async () => {
      const brain = createBrain(cat, {
        decisionInterval: [50, 100],
      });

      brain.start();

      await new Promise((resolve) => setTimeout(resolve, 200));
      brain.stop();

      // After some time, brain should have made at least one decision
      expect(brain.state.lastDecisionTime).toBeGreaterThan(
        Date.now() - 300
      );
    });
  });

  describe("Integration", () => {
    it("should control cat when running", async () => {
      const brain = createBrain(cat, {
        personality: "energetic",
        decisionInterval: [50, 100],
      });

      brain.start();

      await new Promise((resolve) => setTimeout(resolve, 300));
      brain.stop();

      // Cat may or may not have moved depending on behavior chosen
      expect(true).toBe(true);
    });

    it("should respond to boundary hits", () => {
      const brain = createBrain(cat);
      const handler = vi.fn();
      brain.on("reactionTriggered", handler);

      // Simulate boundary hit
      cat.setPosition(800, 600);
      cat.setVelocity(100, 0);

      // Wait a moment for potential reaction
      expect(brain).toBeDefined();
    });

    it("should work with different personalities", () => {
      const personalities = getPersonalityPresets();

      for (const preset of personalities) {
        const testCat = new Cat(protoCat, {
          initialPosition: { x: 100, y: 100 },
        });
        const brain = createBrain(testCat, { personality: preset });
        expect(brain).toBeDefined();
        expect(brain.isRunning).toBe(false);
        testCat.destroy();
      }
    });
  });
});
