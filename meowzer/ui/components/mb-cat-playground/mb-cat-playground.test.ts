import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-cat-playground";
import type { MbCatPlayground } from "./mb-cat-playground";

describe("MbCatPlayground", () => {
  let el: MbCatPlayground;

  beforeEach(() => {
    el = document.createElement(
      "mb-cat-playground"
    ) as MbCatPlayground;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-cat-playground")).toBeDefined();
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  describe("rendering", () => {
    it("renders container", async () => {
      await el.updateComplete;
      const container = el.shadowRoot?.querySelector(
        ".playground-container"
      );
      expect(container).toBeTruthy();
    });

    it("renders loading state without meowzer provider", async () => {
      await el.updateComplete;
      const loadingContainer = el.shadowRoot?.querySelector(
        ".loading-container"
      );
      expect(loadingContainer).toBeTruthy();
    });

    it("shows loading text", async () => {
      await el.updateComplete;
      const loadingText =
        el.shadowRoot?.querySelector(".loading-text");
      expect(loadingText).toBeTruthy();
      expect(loadingText?.textContent?.trim()).toContain(
        "Waiting for Meowzer provider"
      );
    });

    it("renders mb-loading component", async () => {
      await el.updateComplete;
      const loading = el.shadowRoot?.querySelector("mb-loading");
      expect(loading).toBeTruthy();
    });
  });

  describe("properties", () => {
    it("has cats getter", () => {
      expect(el.cats).toBeDefined();
    });
  });

  describe("context", () => {
    it("has meowzer property", () => {
      expect("meowzer" in el).toBe(true);
    });
  });

  describe("lifecycle", () => {
    it("connects without errors", async () => {
      await el.updateComplete;
      expect(el.isConnected).toBe(true);
    });

    it("can be disconnected", () => {
      const connected = el.isConnected;
      expect(connected).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("has semantic structure", async () => {
      await el.updateComplete;
      const container = el.shadowRoot?.querySelector(
        ".playground-container"
      );
      expect(container).toBeTruthy();
    });

    it("loading state has descriptive text", async () => {
      await el.updateComplete;
      const text = el.shadowRoot?.querySelector(".loading-text");
      expect(text?.textContent).toBeTruthy();
    });
  });
});
