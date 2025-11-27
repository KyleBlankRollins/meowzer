import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbLoading } from "./mb-loading.js";

describe("MbLoading", () => {
  let el: MbLoading;

  beforeEach(() => {
    el = document.createElement("mb-loading") as MbLoading;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-loading")).toBe(MbLoading);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbLoading);
  });

  describe("rendering", () => {
    it("renders with default properties", () => {
      expect(el.size).toBe("md");
      expect(el.overlay).toBe(false);
      expect(el.text).toBe("");
    });

    it("applies size classes correctly", async () => {
      el.size = "sm";
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(".mb-loading");
      expect(container?.classList.contains("mb-loading--sm")).toBe(
        true
      );

      el.size = "lg";
      await el.updateComplete;
      expect(container?.classList.contains("mb-loading--lg")).toBe(
        true
      );
    });

    it("applies overlay class when overlay is true", async () => {
      el.overlay = true;
      await el.updateComplete;

      const overlay = el.shadowRoot?.querySelector(
        ".mb-loading--overlay"
      );
      expect(overlay).toBeTruthy();
    });

    it("renders spinner element", async () => {
      await el.updateComplete;

      const spinner = el.shadowRoot?.querySelector(
        ".mb-loading__spinner"
      );
      expect(spinner).toBeTruthy();
    });

    it("renders text when provided", async () => {
      el.text = "Loading cats...";
      await el.updateComplete;

      const text = el.shadowRoot?.querySelector(".mb-loading__text");
      expect(text?.textContent?.trim()).toBe("Loading cats...");
    });

    it("renders text container with slot", async () => {
      await el.updateComplete;

      const text = el.shadowRoot?.querySelector(".mb-loading__text");
      expect(text).toBeTruthy();

      // Should contain a slot for optional content
      const slot = text?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("exposes spinner part for styling", async () => {
      await el.updateComplete;

      const spinner = el.shadowRoot?.querySelector(
        ".mb-loading__spinner"
      );
      expect(spinner?.getAttribute("part")).toBe("spinner");
    });

    it("exposes text part for styling", async () => {
      el.text = "Loading...";
      await el.updateComplete;

      const text = el.shadowRoot?.querySelector(".mb-loading__text");
      expect(text?.getAttribute("part")).toBe("text");
    });
  });

  describe("slots", () => {
    it("supports default slot for text", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });
});
