import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-laser-visual.js";
import type { MbLaserVisual } from "./mb-laser-visual.js";

describe("mb-laser-visual", () => {
  let element: MbLaserVisual;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    element = document.createElement(
      "mb-laser-visual"
    ) as MbLaserVisual;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe("Component Registration", () => {
    it("should be registered as mb-laser-visual", () => {
      const laser = document.createElement("mb-laser-visual");
      expect(laser).toBeInstanceOf(HTMLElement);
    });

    it("should create element via constructor", () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe("mb-laser-visual");
    });
  });

  describe("Properties", () => {
    it("should have laser property", () => {
      const mockLaser = {
        isActive: false,
        position: { x: 0, y: 0 },
        on: () => {},
        off: () => {},
      } as any;

      element.laser = mockLaser;
      expect(element.laser).toBe(mockLaser);
    });

    it("should allow undefined laser", () => {
      element.laser = undefined;
      expect(element.laser).toBeUndefined();
    });
  });

  describe("Rendering", () => {
    it("should render SVG element", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should have 64x64 SVG dimensions", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("64");
      expect(svg?.getAttribute("height")).toBe("64");
    });

    it("should have correct viewBox", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 64 64");
    });

    it("should render radial gradient definition", async () => {
      await element.updateComplete;
      const defs = element.shadowRoot?.querySelector("defs");
      expect(defs).toBeTruthy();

      const gradient = defs?.querySelector("radialGradient");
      expect(gradient).toBeTruthy();
    });

    it("should render gradient with multiple stops", async () => {
      await element.updateComplete;
      const gradient =
        element.shadowRoot?.querySelector("radialGradient");
      const stops = gradient?.querySelectorAll("stop");
      expect(stops?.length).toBe(4);
    });

    it("should render outer glow circle", async () => {
      await element.updateComplete;
      const circles = element.shadowRoot?.querySelectorAll("circle");
      expect(circles && circles.length).toBeGreaterThanOrEqual(5);
    });

    it("should render center dot circles", async () => {
      await element.updateComplete;
      const circles = element.shadowRoot?.querySelectorAll("circle");

      // Should have: outer glow, middle glow, bright center, inner center, highlight
      expect(circles?.length).toBe(5);
    });

    it("should render highlight circle", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      const circles = svg?.querySelectorAll("circle");

      // Last circle should be the white highlight
      const highlight = circles?.[circles.length - 1];
      expect(highlight?.getAttribute("fill")).toBe("#FFFFFF");
    });
  });

  describe("Active State", () => {
    it("should not have active attribute by default", () => {
      expect(element.hasAttribute("active")).toBe(false);
    });

    it("should allow setting active attribute", async () => {
      element.setAttribute("active", "");
      await element.updateComplete;
      expect(element.hasAttribute("active")).toBe(true);
    });

    it("should remove active attribute", async () => {
      element.setAttribute("active", "");
      await element.updateComplete;
      expect(element.hasAttribute("active")).toBe(true);

      element.removeAttribute("active");
      await element.updateComplete;
      expect(element.hasAttribute("active")).toBe(false);
    });
  });

  describe("Position Updates", () => {
    it("should not set transform without active laser", async () => {
      await element.updateComplete;
      // Transform is only set when laser is active and position updates
      expect(element.style.transform).toBe("");
    });

    it("should have position state", async () => {
      await element.updateComplete;
      // Component has internal position state (defaults to 0, 0)
      // Transform is only applied when _updatePosition() is called
      expect(element.style.transform).toBe("");
    });
  });

  describe("Lifecycle", () => {
    it("should connect to DOM", async () => {
      const laser = document.createElement(
        "mb-laser-visual"
      ) as MbLaserVisual;
      container.appendChild(laser);
      await laser.updateComplete;

      const svg = laser.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      laser.remove();
    });

    it("should disconnect from DOM", () => {
      const laser = document.createElement(
        "mb-laser-visual"
      ) as MbLaserVisual;
      container.appendChild(laser);
      laser.remove();

      expect(laser.isConnected).toBe(false);
    });

    it("should handle laser property changes", async () => {
      const mockLaser1 = {
        isActive: false,
        position: { x: 0, y: 0 },
        on: () => {},
        off: () => {},
      } as any;

      const mockLaser2 = {
        isActive: false,
        position: { x: 100, y: 100 },
        on: () => {},
        off: () => {},
      } as any;

      element.laser = mockLaser1;
      await element.updateComplete;
      expect(element.laser).toBe(mockLaser1);

      element.laser = mockLaser2;
      await element.updateComplete;
      expect(element.laser).toBe(mockLaser2);
    });
  });

  describe("Accessibility", () => {
    it("should be positioned fixed", async () => {
      await element.updateComplete;
      const styles = window.getComputedStyle(element);
      expect(styles.position).toBe("fixed");
    });

    it("should have pointer-events none", async () => {
      await element.updateComplete;
      const styles = window.getComputedStyle(element);
      expect(styles.pointerEvents).toBe("none");
    });

    it("should have high z-index for visibility", async () => {
      await element.updateComplete;
      const styles = window.getComputedStyle(element);
      expect(parseInt(styles.zIndex)).toBeGreaterThan(1000);
    });
  });
});
