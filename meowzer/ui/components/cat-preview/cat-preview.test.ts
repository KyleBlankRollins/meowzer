import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CatPreview } from "./cat-preview.js";
import type { CatSettings, ProtoCat } from "meowzer";

describe("CatPreview", () => {
  let el: CatPreview;

  beforeEach(() => {
    el = document.createElement("cat-preview") as CatPreview;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("cat-preview")).toBe(CatPreview);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(CatPreview);
  });

  describe("rendering", () => {
    it("renders empty state when no settings or protoCat", async () => {
      await el.updateComplete;
      const loadingText = el.shadowRoot?.querySelector(
        ".preview-loading"
      );
      expect(loadingText).toBeTruthy();
    });

    it("renders error state when validation errors present", async () => {
      el.validationErrors = ["Invalid cat name"];
      await el.updateComplete;

      const errorContainer =
        el.shadowRoot?.querySelector(".preview-error");
      expect(errorContainer).toBeTruthy();
      expect(errorContainer?.textContent).toContain(
        "Invalid cat name"
      );
    });

    it("renders simplified preview when settings provided", async () => {
      el.settings = {
        color: "#FF6B35",
        eyeColor: "#4ECDC4",
        pattern: "solid",
        size: "medium",
        furLength: "short",
      } as Partial<CatSettings>;
      await el.updateComplete;

      const catPreview = el.shadowRoot?.querySelector(".preview-cat");
      expect(catPreview).toBeTruthy();
    });

    it("renders ProtoCat preview when protoCat provided", async () => {
      el.protoCat = {
        seed: "test-seed-123",
        dimensions: {
          scale: 1,
          size: "medium",
        },
        appearance: {
          pattern: "tabby",
        },
        spriteData: {
          svg: "<svg></svg>",
        },
      } as ProtoCat;
      await el.updateComplete;

      const protoCatPreview = el.shadowRoot?.querySelector(
        ".protocat-preview"
      );
      expect(protoCatPreview).toBeTruthy();
    });
  });

  describe("properties", () => {
    it("has settings property", () => {
      expect(el).toHaveProperty("settings");
    });

    it("has protoCat property", () => {
      expect(el).toHaveProperty("protoCat");
    });

    it("has validationErrors property with default empty array", () => {
      expect(el.validationErrors).toEqual([]);
    });

    it("has autoBuild property with default false", () => {
      expect(el.autoBuild).toBe(false);
    });
  });

  describe("simplified preview", () => {
    it("displays cat visual elements", async () => {
      el.settings = {
        color: "#FF6B35",
        eyeColor: "#4ECDC4",
      } as Partial<CatSettings>;
      await el.updateComplete;

      const ears = el.shadowRoot?.querySelector(".cat-ears");
      const body = el.shadowRoot?.querySelector(".cat-body");
      const eyes = el.shadowRoot?.querySelector(".cat-eyes");

      expect(ears).toBeTruthy();
      expect(body).toBeTruthy();
      expect(eyes).toBeTruthy();
    });

    it("displays live preview label", async () => {
      el.settings = { color: "#FF6B35" } as Partial<CatSettings>;
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(".preview-label");
      expect(label?.textContent).toBe("Live Preview");
    });

    it("displays settings summary", async () => {
      el.settings = {
        pattern: "tabby",
        size: "large",
        furLength: "long",
      } as Partial<CatSettings>;
      await el.updateComplete;

      const summary = el.shadowRoot?.querySelector(
        ".settings-summary"
      );
      expect(summary).toBeTruthy();
    });

    it("displays pattern in settings summary", async () => {
      el.settings = { pattern: "spotted" } as Partial<CatSettings>;
      await el.updateComplete;

      const summary = el.shadowRoot?.querySelector(
        ".settings-summary"
      );
      expect(summary?.textContent).toContain("Spotted");
    });

    it("displays size in settings summary", async () => {
      el.settings = { size: "small" } as Partial<CatSettings>;
      await el.updateComplete;

      const summary = el.shadowRoot?.querySelector(
        ".settings-summary"
      );
      expect(summary?.textContent).toContain("Small");
    });

    it("displays fur length in settings summary", async () => {
      el.settings = { furLength: "medium" } as Partial<CatSettings>;
      await el.updateComplete;

      const summary = el.shadowRoot?.querySelector(
        ".settings-summary"
      );
      expect(summary?.textContent).toContain("Medium");
    });

    it("uses default color when not provided", async () => {
      el.settings = {} as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("#FF6B35"); // default fur color
    });

    it("uses default eye color when not provided", async () => {
      el.settings = {} as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("#4ECDC4"); // default eye color
    });

    it("applies custom colors", async () => {
      el.settings = {
        color: "#123456",
        eyeColor: "#ABCDEF",
      } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("#123456");
      expect(style).toContain("#ABCDEF");
    });
  });

  describe("ProtoCat preview", () => {
    it("displays seed information", async () => {
      el.protoCat = {
        seed: "unique-seed-456",
        dimensions: { scale: 1, size: "medium" },
        appearance: { pattern: "calico" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      const details = el.shadowRoot?.querySelector(
        ".preview-details"
      );
      expect(details?.textContent).toContain("unique-seed-456");
    });

    it("displays size information", async () => {
      el.protoCat = {
        seed: "test",
        dimensions: { scale: 1, size: "large" },
        appearance: { pattern: "solid" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      const details = el.shadowRoot?.querySelector(
        ".preview-details"
      );
      expect(details?.textContent).toContain("large");
    });

    it("displays pattern information", async () => {
      el.protoCat = {
        seed: "test",
        dimensions: { scale: 1, size: "medium" },
        appearance: { pattern: "tuxedo" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      const details = el.shadowRoot?.querySelector(
        ".preview-details"
      );
      expect(details?.textContent).toContain("Tuxedo");
    });

    it("prioritizes protoCat over settings", async () => {
      el.settings = { color: "#FF0000" } as Partial<CatSettings>;
      el.protoCat = {
        seed: "proto-wins",
        dimensions: { scale: 1, size: "medium" },
        appearance: { pattern: "solid" },
        spriteData: { svg: "<svg>protocat</svg>" },
      } as ProtoCat;
      await el.updateComplete;

      const protoCatPreview = el.shadowRoot?.querySelector(
        ".protocat-preview"
      );
      const simplifiedPreview =
        el.shadowRoot?.querySelector(".preview-cat");

      expect(protoCatPreview).toBeTruthy();
      expect(simplifiedPreview).toBeFalsy();
    });
  });

  describe("validation errors", () => {
    it("renders multiple validation errors", async () => {
      el.validationErrors = ["Error 1", "Error 2", "Error 3"];
      await el.updateComplete;

      const errorTexts =
        el.shadowRoot?.querySelectorAll(".error-text");
      expect(errorTexts?.length).toBe(3);
    });

    it("displays all error messages", async () => {
      el.validationErrors = ["Name is required", "Invalid color"];
      await el.updateComplete;

      const errorContainer =
        el.shadowRoot?.querySelector(".preview-error");
      expect(errorContainer?.textContent).toContain(
        "Name is required"
      );
      expect(errorContainer?.textContent).toContain("Invalid color");
    });

    it("prioritizes protoCat over validation errors", async () => {
      el.validationErrors = ["Some error"];
      el.protoCat = {
        seed: "test",
        dimensions: { scale: 1, size: "medium" },
        appearance: { pattern: "solid" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      const protoCatPreview = el.shadowRoot?.querySelector(
        ".protocat-preview"
      );
      const errorPreview =
        el.shadowRoot?.querySelector(".preview-error");

      expect(protoCatPreview).toBeTruthy();
      expect(errorPreview).toBeFalsy();
    });

    it("shows validation errors over simplified preview", async () => {
      el.settings = { color: "#FF0000" } as Partial<CatSettings>;
      el.validationErrors = ["Validation failed"];
      await el.updateComplete;

      const errorPreview =
        el.shadowRoot?.querySelector(".preview-error");
      const simplifiedPreview =
        el.shadowRoot?.querySelector(".preview-cat");

      expect(errorPreview).toBeTruthy();
      expect(simplifiedPreview).toBeFalsy();
    });
  });

  describe("pattern styles", () => {
    it("renders solid pattern", async () => {
      el.settings = { pattern: "solid" } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("none");
    });

    it("renders tabby pattern", async () => {
      el.settings = { pattern: "tabby" } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("repeating-linear-gradient");
    });

    it("renders spotted pattern", async () => {
      el.settings = { pattern: "spotted" } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("radial-gradient");
    });

    it("renders calico pattern", async () => {
      el.settings = { pattern: "calico" } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("radial-gradient");
    });

    it("renders tuxedo pattern", async () => {
      el.settings = { pattern: "tuxedo" } as Partial<CatSettings>;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(
        ".preview-container"
      );
      const style = container?.getAttribute("style");
      expect(style).toContain("linear-gradient");
    });
  });

  describe("empty state", () => {
    it("shows loading component", async () => {
      await el.updateComplete;

      const loading = el.shadowRoot?.querySelector("mb-loading");
      expect(loading).toBeTruthy();
    });

    it("shows waiting message", async () => {
      await el.updateComplete;

      const loadingContainer = el.shadowRoot?.querySelector(
        ".preview-loading"
      );
      expect(loadingContainer?.textContent).toContain(
        "Waiting for settings"
      );
    });
  });

  describe("reactivity", () => {
    it("updates when settings change", async () => {
      el.settings = { pattern: "solid" } as Partial<CatSettings>;
      await el.updateComplete;

      let summary = el.shadowRoot?.querySelector(".settings-summary");
      expect(summary?.textContent).toContain("Solid");

      el.settings = { pattern: "tabby" } as Partial<CatSettings>;
      await el.updateComplete;

      summary = el.shadowRoot?.querySelector(".settings-summary");
      expect(summary?.textContent).toContain("Tabby");
    });

    it("updates when protoCat changes", async () => {
      el.protoCat = {
        seed: "seed-1",
        dimensions: { scale: 1, size: "medium" },
        appearance: { pattern: "solid" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      let details = el.shadowRoot?.querySelector(".preview-details");
      expect(details?.textContent).toContain("seed-1");

      el.protoCat = {
        seed: "seed-2",
        dimensions: { scale: 1, size: "large" },
        appearance: { pattern: "tabby" },
        spriteData: { svg: "<svg></svg>" },
      } as ProtoCat;
      await el.updateComplete;

      details = el.shadowRoot?.querySelector(".preview-details");
      expect(details?.textContent).toContain("seed-2");
    });

    it("updates when validation errors change", async () => {
      el.validationErrors = [];
      el.settings = { color: "#FF0000" } as Partial<CatSettings>;
      await el.updateComplete;

      let simplifiedPreview =
        el.shadowRoot?.querySelector(".preview-cat");
      expect(simplifiedPreview).toBeTruthy();

      el.validationErrors = ["New error"];
      await el.updateComplete;

      const errorPreview =
        el.shadowRoot?.querySelector(".preview-error");
      expect(errorPreview).toBeTruthy();
    });
  });
});
