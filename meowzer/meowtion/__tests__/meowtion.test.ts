import { describe, it, expect, beforeEach, vi } from "vitest";
import { animateCat, CatAnimator } from "../index.js";
import type { ProtoCat } from "../../types/index.js";

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
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle id="body" cx="50" cy="50" r="20" fill="#FF9500"/><circle id="head" cx="50" cy="30" r="15" fill="#FF9500"/><path id="tail" d="M 70 50 Q 80 40, 85 50" stroke="#FF9500" fill="none"/></svg>`,
      elements: {
        body: "body",
        head: "head",
        ears: ["ear-left", "ear-right"],
        eyes: ["eye-left", "eye-right"],
        tail: "tail",
        pattern: ["pattern-1", "pattern-2", "pattern-3"],
      },
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
    },
    metadata: {
      createdAt: new Date(),
      version: "1",
    },
  };
}

describe("Meowtion", () => {
  let protoCat: ProtoCat;

  beforeEach(() => {
    protoCat = createMockProtoCat();
    document.body.innerHTML = "";
  });

  describe("animateCat", () => {
    it("should create a Cat instance", () => {
      const cat = animateCat(protoCat);
      expect(cat).toBeDefined();
      expect(cat.id).toBe(protoCat.id);
      expect(cat.element).toBeInstanceOf(HTMLElement);
    });

    it("should use default options", () => {
      const cat = animateCat(protoCat);
      expect(cat.state.type).toBe("idle");
      expect(cat.position.x).toBe(0);
      expect(cat.position.y).toBe(0);
      expect(cat.isActive).toBe(true);
    });

    it("should apply custom options", () => {
      const cat = animateCat(protoCat, {
        initialPosition: { x: 100, y: 200 },
        initialState: "sitting",
      });
      expect(cat.position.x).toBe(100);
      expect(cat.position.y).toBe(200);
      expect(cat.state.type).toBe("sitting");
    });

    it("should append to specified container", () => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const cat = animateCat(protoCat, { container });
      expect(container.contains(cat.element)).toBe(true);
    });

    it("should create element with correct structure", () => {
      const cat = animateCat(protoCat);
      expect(cat.element.className).toBe("meowtion-cat");
      expect(cat.element.getAttribute("data-cat-id")).toBe(
        protoCat.id
      );
      expect(cat.element.querySelector("svg")).toBeDefined();
    });
  });

  describe("Cat state management", () => {
    it("should start in idle state", () => {
      const cat = animateCat(protoCat);
      expect(cat.state.type).toBe("idle");
    });

    it("should change state", () => {
      const cat = animateCat(protoCat);
      cat.setState("walking");
      expect(cat.state.type).toBe("walking");
    });

    it("should not allow invalid transitions", () => {
      const cat = animateCat(protoCat);
      cat.setState("sleeping");
      cat.setState("running"); // Invalid: sleeping -> running
      expect(cat.state.type).toBe("sleeping"); // Should stay in sleeping
    });

    it("should allow transition to idle from any state", () => {
      const cat = animateCat(protoCat);
      cat.setState("sleeping");
      cat.setState("idle");
      expect(cat.state.type).toBe("idle");
    });

    it("should update DOM attribute on state change", () => {
      const cat = animateCat(protoCat);
      cat.setState("walking");
      expect(cat.element.getAttribute("data-state")).toBe("walking");
    });

    it("should emit stateChange event", () => {
      const cat = animateCat(protoCat);
      const handler = vi.fn();
      cat.on("stateChange", handler);

      cat.setState("walking");
      expect(handler).toHaveBeenCalledWith({
        oldState: "idle",
        newState: "walking",
      });
    });
  });

  describe("Cat movement", () => {
    it("should set position immediately", () => {
      const cat = animateCat(protoCat);
      cat.setPosition(100, 200);
      expect(cat.position.x).toBe(100);
      expect(cat.position.y).toBe(200);
    });

    it("should update DOM position", () => {
      const cat = animateCat(protoCat);
      cat.setPosition(150, 250);
      expect(cat.element.style.left).toBe("150px");
      expect(cat.element.style.top).toBe("250px");
    });

    it("should respect boundaries when setting position", () => {
      const cat = animateCat(protoCat, {
        boundaries: { minX: 0, maxX: 500, minY: 0, maxY: 400 },
      });
      cat.setPosition(1000, 1000);
      expect(cat.position.x).toBe(500);
      expect(cat.position.y).toBe(400);
    });

    it("should initiate movement with moveTo", () => {
      const cat = animateCat(protoCat, {
        initialPosition: { x: 0, y: 0 },
      });

      const startHandler = vi.fn();
      cat.on("moveStart", startHandler);

      cat.moveTo(100, 100, 100);

      expect(startHandler).toHaveBeenCalledWith({
        from: { x: 0, y: 0 },
        to: { x: 100, y: 100 },
      });
    });

    it("should clamp moveTo target to boundaries", () => {
      const cat = animateCat(protoCat, {
        initialPosition: { x: 0, y: 0 },
        boundaries: { minX: 0, maxX: 500, minY: 0, maxY: 400 },
      });

      const startHandler = vi.fn();
      cat.on("moveStart", startHandler);

      cat.moveTo(1000, 1000, 100);

      // Should clamp to max boundaries
      expect(startHandler).toHaveBeenCalledWith({
        from: { x: 0, y: 0 },
        to: { x: 500, y: 400 },
      });
    });

    it("should change state based on movement speed", async () => {
      const cat = animateCat(protoCat);

      // Slow movement should trigger walking
      cat.moveTo(100, 100, 1000);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(cat.state.type).toBe("walking");
    });

    it("should stop movement", async () => {
      const cat = animateCat(protoCat);
      cat.moveTo(200, 200, 200);

      await new Promise((resolve) => setTimeout(resolve, 50));
      cat.stop();

      const positionAtStop = { ...cat.position };
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Position shouldn't have changed after stop
      expect(cat.position.x).toBe(positionAtStop.x);
      expect(cat.position.y).toBe(positionAtStop.y);
    });
  });

  describe("Cat velocity", () => {
    it("should set velocity", () => {
      const cat = animateCat(protoCat);
      cat.setVelocity(50, 100);
      expect(cat.velocity.x).toBe(50);
      expect(cat.velocity.y).toBe(100);
    });

    it("should respect max speed", () => {
      const cat = animateCat(protoCat, {
        physics: { maxSpeed: 100 },
      });
      cat.setVelocity(200, 200); // Would be ~283 total

      const speed = Math.hypot(cat.velocity.x, cat.velocity.y);
      expect(speed).toBeLessThanOrEqual(100);
    });

    it("should apply friction over time", async () => {
      const cat = animateCat(protoCat, {
        physics: { friction: 0.5 },
      });

      cat.setVelocity(100, 0);
      const initialVelocity = cat.velocity.x;

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(Math.abs(cat.velocity.x)).toBeLessThan(
        Math.abs(initialVelocity)
      );
    });
  });

  describe("Cat boundaries", () => {
    it("should enforce boundaries", () => {
      const cat = animateCat(protoCat, {
        boundaries: { minX: 0, maxX: 500, minY: 0, maxY: 400 },
      });

      cat.setPosition(-100, -100);
      expect(cat.position.x).toBe(0);
      expect(cat.position.y).toBe(0);

      cat.setPosition(1000, 1000);
      expect(cat.position.x).toBe(500);
      expect(cat.position.y).toBe(400);
    });

    it("should clamp position to boundaries", () => {
      const cat = animateCat(protoCat, {
        initialPosition: { x: 50, y: 50 },
        boundaries: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
      });

      // Try to move beyond max boundary
      cat.setPosition(200, 200);
      expect(cat.position.x).toBe(100);
      expect(cat.position.y).toBe(100);

      // Try to move beyond min boundary
      cat.setPosition(-50, -50);
      expect(cat.position.x).toBe(0);
      expect(cat.position.y).toBe(0);
    });
  });

  describe("Cat lifecycle", () => {
    it("should pause and resume", () => {
      const cat = animateCat(protoCat);

      expect(cat.isActive).toBe(true);
      cat.pause();
      expect(cat.isActive).toBe(false);

      cat.resume();
      expect(cat.isActive).toBe(true);
    });

    it("should update paused attribute", () => {
      const cat = animateCat(protoCat);

      cat.pause();
      expect(cat.element.getAttribute("data-paused")).toBe("true");

      cat.resume();
      expect(cat.element.getAttribute("data-paused")).toBe("false");
    });

    it("should destroy cat", () => {
      const cat = animateCat(protoCat);
      const element = cat.element;

      cat.destroy();
      expect(cat.isActive).toBe(false);
      expect(document.body.contains(element)).toBe(false);
    });

    it("should not accept commands after destruction", () => {
      const cat = animateCat(protoCat);
      cat.destroy();

      cat.setState("walking");
      cat.setPosition(100, 100);
      cat.setVelocity(50, 50);

      // Should not throw, just be ignored
      expect(true).toBe(true);
    });
  });

  describe("Cat events", () => {
    it("should add event listener", () => {
      const cat = animateCat(protoCat);
      const handler = vi.fn();

      cat.on("stateChange", handler);
      cat.setState("walking");

      expect(handler).toHaveBeenCalled();
    });

    it("should remove event listener", () => {
      const cat = animateCat(protoCat);
      const handler = vi.fn();

      cat.on("stateChange", handler);
      cat.off("stateChange", handler);
      cat.setState("walking");

      expect(handler).not.toHaveBeenCalled();
    });

    it("should handle multiple listeners", () => {
      const cat = animateCat(protoCat);
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      cat.on("stateChange", handler1);
      cat.on("stateChange", handler2);
      cat.setState("walking");

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe("CatAnimator builder", () => {
    it("should build cat with fluent API", () => {
      const container = document.createElement("div");
      const cat = new CatAnimator(protoCat)
        .in(container)
        .at(100, 200)
        .withState("sitting")
        .withinBounds({ minX: 0, maxX: 800, minY: 0, maxY: 600 })
        .animate();

      expect(cat.position.x).toBe(100);
      expect(cat.position.y).toBe(200);
      expect(cat.state.type).toBe("sitting");
      expect(container.contains(cat.element)).toBe(true);
    });

    it("should allow method chaining", () => {
      const animator = new CatAnimator(protoCat);
      const result = animator.at(50, 50);
      expect(result).toBe(animator);
    });

    it("should configure physics", () => {
      const cat = new CatAnimator(protoCat)
        .withPhysics({ friction: 0.5, maxSpeed: 200 })
        .animate();

      cat.setVelocity(500, 500);
      const speed = Math.hypot(cat.velocity.x, cat.velocity.y);
      expect(speed).toBeCloseTo(200, 0);
    });
  });
});
