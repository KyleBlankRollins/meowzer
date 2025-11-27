import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbIcon } from "./mb-icon.js";

describe("MbIcon", () => {
  let el: MbIcon;

  beforeEach(() => {
    el = document.createElement("mb-icon") as MbIcon;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-icon")).toBe(MbIcon);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbIcon);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.size).toBe("24");
      expect(el.svg).toBe("");
      expect(el.name).toBe("");
      expect(el.label).toBe("");
    });

    it("renders with size attribute", async () => {
      el.size = "16";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("16");
    });

    it("supports size variants", async () => {
      const sizes: Array<"16" | "20" | "24" | "32" | "48"> = [
        "16",
        "20",
        "24",
        "32",
        "48",
      ];

      for (const size of sizes) {
        el.size = size;
        await el.updateComplete;
        expect(el.getAttribute("size")).toBe(size);
      }
    });

    it("renders SVG string content", async () => {
      el.svg =
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      const svg = container?.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("supports label property", async () => {
      el.label = "Home icon";
      await el.updateComplete;

      expect(el.label).toBe("Home icon");
    });
  });

  describe("accessibility", () => {
    it("has presentation role by default", async () => {
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      expect(container?.getAttribute("role")).toBe("presentation");
    });

    it("has img role when label is provided", async () => {
      el.label = "Home icon";
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      expect(container?.getAttribute("role")).toBe("img");
    });

    it("includes aria-label when label is provided", async () => {
      el.label = "Home icon";
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      expect(container?.getAttribute("aria-label")).toBe("Home icon");
    });

    it("does not include aria-label when no label", async () => {
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      expect(container?.hasAttribute("aria-label")).toBe(false);
    });

    it("exposes icon part", async () => {
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('[part="icon"]');
      expect(container).toBeTruthy();
    });
  });

  describe("slots", () => {
    it("supports default slot for SVG content", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });

    it("renders slotted SVG content", async () => {
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svg.setAttribute("viewBox", "0 0 24 24");
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "12");
      circle.setAttribute("cy", "12");
      circle.setAttribute("r", "10");
      svg.appendChild(circle);
      el.appendChild(svg);

      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });

  describe("rendering modes", () => {
    it("prefers svg property over slot", async () => {
      // Add slotted content
      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      el.appendChild(svg);

      // Set svg property
      el.svg =
        '<svg viewBox="0 0 24 24"><rect width="10" height="10"/></svg>';
      await el.updateComplete;

      // Should render svg property content, not slot
      const container = el.shadowRoot?.querySelector('[part="icon"]');
      const rect = container?.querySelector("rect");
      expect(rect).toBeTruthy();

      // Slot should not be rendered
      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeFalsy();
    });

    it("uses slot when no svg property", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });

  describe("size variants", () => {
    it("reflects size attribute on host", async () => {
      el.size = "32";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("32");
    });

    it("supports custom size via CSS variable", async () => {
      el.style.setProperty("--mb-icon-size", "64px");
      await el.updateComplete;

      const computedStyle = getComputedStyle(el);
      expect(computedStyle.getPropertyValue("--mb-icon-size")).toBe(
        "64px"
      );
    });
  });
});
