import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-yarn-visual.js";
import type { MbYarnVisual } from "./mb-yarn-visual.js";

describe("mb-yarn-visual", () => {
  let element: MbYarnVisual;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    element = document.createElement(
      "mb-yarn-visual"
    ) as MbYarnVisual;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe("Component Registration", () => {
    it("should be registered as mb-yarn-visual", () => {
      const yarn = document.createElement("mb-yarn-visual");
      expect(yarn).toBeInstanceOf(HTMLElement);
    });

    it("should create element via constructor", () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe("mb-yarn-visual");
    });
  });

  describe("Properties", () => {
    it("should have yarnId property", () => {
      element.yarnId = "yarn-123";
      expect(element.yarnId).toBe("yarn-123");
    });

    it("should have interactive property defaulting to true", () => {
      expect(element.interactive).toBe(true);
    });

    it("should allow setting interactive to false", () => {
      element.interactive = false;
      expect(element.interactive).toBe(false);
    });

    it("should have size property defaulting to 40", () => {
      expect(element.size).toBe(40);
    });

    it("should allow custom size", () => {
      element.size = 60;
      expect(element.size).toBe(60);
    });

    it("should have color property defaulting to #FF6B6B", () => {
      expect(element.color).toBe("#FF6B6B");
    });

    it("should allow custom color", () => {
      element.color = "#00FF00";
      expect(element.color).toBe("#00FF00");
    });
  });

  describe("Rendering", () => {
    it("should render yarn container", async () => {
      await element.updateComplete;
      const container =
        element.shadowRoot?.querySelector(".yarn-container");
      expect(container).toBeTruthy();
    });

    it("should render SVG element", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should set SVG size based on size property", async () => {
      element.size = 50;
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("50");
      expect(svg?.getAttribute("height")).toBe("50");
    });

    it("should have correct viewBox", async () => {
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
    });

    it("should render yarn ball circle", async () => {
      await element.updateComplete;
      const circle = element.shadowRoot?.querySelector("circle");
      expect(circle).toBeTruthy();
      expect(circle?.getAttribute("cx")).toBe("50");
      expect(circle?.getAttribute("cy")).toBe("50");
      expect(circle?.getAttribute("r")).toBe("45");
    });

    it("should apply color to yarn ball", async () => {
      element.color = "#FF0000";
      await element.updateComplete;
      const circle = element.shadowRoot?.querySelector("circle");
      expect(circle?.getAttribute("fill")).toBe("#FF0000");
    });

    it("should render yarn strand paths", async () => {
      await element.updateComplete;
      const paths = element.shadowRoot?.querySelectorAll("path");
      expect(paths?.length).toBeGreaterThanOrEqual(4);
    });

    it("should render highlight ellipse", async () => {
      await element.updateComplete;
      const ellipses =
        element.shadowRoot?.querySelectorAll("ellipse");
      expect(ellipses?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Interactive Mode", () => {
    it("should have interactive property set to true by default", async () => {
      await element.updateComplete;
      expect(element.interactive).toBe(true);
    });

    it("should allow setting interactive to false", async () => {
      element.interactive = false;
      await element.updateComplete;
      expect(element.interactive).toBe(false);
    });

    it("should allow mousedown on container when interactive", async () => {
      element.interactive = true;
      await element.updateComplete;
      const container =
        element.shadowRoot?.querySelector(".yarn-container");
      expect(container).toBeTruthy();
    });
  });

  describe("State Management", () => {
    it("should start without data-state attribute", () => {
      expect(element.hasAttribute("data-state")).toBe(false);
    });

    it("should support dragging state", async () => {
      element.setAttribute("data-state", "dragging");
      await element.updateComplete;
      expect(element.getAttribute("data-state")).toBe("dragging");
    });

    it("should support rolling state", async () => {
      element.setAttribute("data-state", "rolling");
      await element.updateComplete;
      expect(element.getAttribute("data-state")).toBe("rolling");
    });

    it("should support idle state", async () => {
      element.setAttribute("data-state", "idle");
      await element.updateComplete;
      expect(element.getAttribute("data-state")).toBe("idle");
    });
  });

  describe("Lifecycle", () => {
    it("should connect to DOM", async () => {
      const yarn = document.createElement(
        "mb-yarn-visual"
      ) as MbYarnVisual;
      yarn.yarnId = "test-yarn";
      container.appendChild(yarn);
      await yarn.updateComplete;

      const svg = yarn.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      yarn.remove();
    });

    it("should disconnect from DOM", () => {
      const yarn = document.createElement(
        "mb-yarn-visual"
      ) as MbYarnVisual;
      container.appendChild(yarn);
      yarn.remove();

      expect(yarn.isConnected).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should be positioned absolutely", async () => {
      await element.updateComplete;
      const styles = window.getComputedStyle(element);
      expect(styles.position).toBe("absolute");
    });

    it("should have interactive property for pointer events", async () => {
      element.interactive = true;
      await element.updateComplete;
      expect(element.interactive).toBe(true);
    });
  });
});
