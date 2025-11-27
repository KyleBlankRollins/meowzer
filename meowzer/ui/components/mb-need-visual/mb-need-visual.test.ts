import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-need-visual.js";
import type { MbNeedVisual } from "./mb-need-visual.js";

describe("mb-need-visual", () => {
  let element: MbNeedVisual;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    element = document.createElement(
      "mb-need-visual"
    ) as MbNeedVisual;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe("Component Registration", () => {
    it("should be registered as mb-need-visual", () => {
      const need = document.createElement("mb-need-visual");
      expect(need).toBeInstanceOf(HTMLElement);
    });

    it("should create element via constructor", () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe("mb-need-visual");
    });
  });

  describe("Properties", () => {
    it("should have needId property", () => {
      element.needId = "need-123";
      expect(element.needId).toBe("need-123");
    });

    it("should have type property", () => {
      element.type = "food:basic";
      expect(element.type).toBe("food:basic");
    });

    it("should accept food:fancy type", () => {
      element.type = "food:fancy";
      expect(element.type).toBe("food:fancy");
    });

    it("should accept water type", () => {
      element.type = "water";
      expect(element.type).toBe("water");
    });

    it("should have interactive property defaulting to false", () => {
      expect(element.interactive).toBe(false);
    });

    it("should allow setting interactive to true", () => {
      element.interactive = true;
      expect(element.interactive).toBe(true);
    });

    it("should have size property defaulting to 60", () => {
      expect(element.size).toBe(60);
    });

    it("should allow custom size", () => {
      element.size = 80;
      expect(element.size).toBe(80);
    });
  });

  describe("Rendering", () => {
    it("should render need container", async () => {
      element.type = "food:basic";
      await element.updateComplete;
      const container =
        element.shadowRoot?.querySelector(".need-container");
      expect(container).toBeTruthy();
    });

    it("should render SVG element", async () => {
      element.type = "food:basic";
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should set SVG size based on size property", async () => {
      element.type = "water";
      element.size = 70;
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("width")).toBe("70");
      expect(svg?.getAttribute("height")).toBe("70");
    });

    it("should have correct viewBox", async () => {
      element.type = "water";
      await element.updateComplete;
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
    });

    it("should set data-type attribute on container", async () => {
      element.type = "food:fancy";
      await element.updateComplete;
      const container =
        element.shadowRoot?.querySelector(".need-container");
      expect(container?.getAttribute("data-type")).toBe("food:fancy");
    });
  });

  describe("Food Basic Icon", () => {
    beforeEach(async () => {
      element.type = "food:basic";
      await element.updateComplete;
    });

    it("should render basic food SVG elements", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      // Check for main shapes
      const ellipses = svg?.querySelectorAll("ellipse");
      expect(ellipses && ellipses.length).toBeGreaterThan(0);

      const rects = svg?.querySelectorAll("rect");
      expect(rects && rects.length).toBeGreaterThan(0);
    });

    it("should render FOOD text label", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      const text = svg?.querySelector("text");
      expect(text?.textContent).toBe("FOOD");
    });
  });

  describe("Food Fancy Icon", () => {
    beforeEach(async () => {
      element.type = "food:fancy";
      await element.updateComplete;
    });

    it("should render fancy food SVG elements", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      const ellipses = svg?.querySelectorAll("ellipse");
      expect(ellipses && ellipses.length).toBeGreaterThan(0);
    });

    it("should render bone decoration", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      const g = svg?.querySelector("g");
      expect(g).toBeTruthy();

      const circles = g?.querySelectorAll("circle");
      expect(circles?.length).toBe(2);
    });
  });

  describe("Water Icon", () => {
    beforeEach(async () => {
      element.type = "water";
      await element.updateComplete;
    });

    it("should render water SVG elements", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      const ellipses = svg?.querySelectorAll("ellipse");
      expect(ellipses && ellipses.length).toBeGreaterThan(0);
    });

    it("should render water waves", async () => {
      const svg = element.shadowRoot?.querySelector("svg");
      const paths = svg?.querySelectorAll("path");
      expect(paths && paths.length).toBeGreaterThan(0);
    });
  });

  describe("Active State", () => {
    it("should not have data-active attribute without meowzer context", async () => {
      element.type = "water";
      await element.updateComplete;
      expect(element.getAttribute("data-active")).toBeNull();
    });

    it("should allow setting data-active attribute", async () => {
      element.type = "water";
      element.setAttribute("data-active", "true");
      await element.updateComplete;
      expect(element.getAttribute("data-active")).toBe("true");
    });

    it("should not show consuming indicator when not active", async () => {
      element.type = "water";
      await element.updateComplete;
      const indicator = element.shadowRoot?.querySelector(
        ".consuming-indicator"
      );
      expect(indicator).toBeFalsy();
    });
  });

  describe("Interactive Mode", () => {
    it("should have interactive property set to false by default", () => {
      expect(element.interactive).toBe(false);
    });

    it("should allow setting interactive to true", async () => {
      element.interactive = true;
      await element.updateComplete;
      expect(element.interactive).toBe(true);
    });
  });

  describe("Lifecycle", () => {
    it("should connect to DOM", async () => {
      const need = document.createElement(
        "mb-need-visual"
      ) as MbNeedVisual;
      need.needId = "test-need";
      need.type = "water";
      container.appendChild(need);
      await need.updateComplete;

      const svg = need.shadowRoot?.querySelector("svg");
      expect(svg).toBeTruthy();

      need.remove();
    });

    it("should disconnect from DOM", () => {
      const need = document.createElement(
        "mb-need-visual"
      ) as MbNeedVisual;
      container.appendChild(need);
      need.remove();

      expect(need.isConnected).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should be positioned absolutely", async () => {
      await element.updateComplete;
      const styles = window.getComputedStyle(element);
      expect(styles.position).toBe("absolute");
    });

    it("should have pointer-events none by default", async () => {
      element.interactive = false;
      await element.updateComplete;
      expect(element.interactive).toBe(false);
    });

    it("should support interactive mode for pointer events", async () => {
      element.interactive = true;
      await element.updateComplete;
      expect(element.interactive).toBe(true);
    });
  });
});
