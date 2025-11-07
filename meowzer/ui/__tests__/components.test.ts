/**
 * Tests for Phase 2, Phase 3, Phase 4, and Phase 5 components
 */

import { describe, it, expect } from "vitest";
import { CatCreator } from "../components/cat-creator/cat-creator.js";
import { CatPersonalityPicker } from "../components/cat-personality-picker/cat-personality-picker.js";
import { CatPreview } from "../components/cat-preview/cat-preview.js";
import { MbCatPlayground } from "../components/mb-cat-playground/mb-cat-playground.js";

describe("CatCreator", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-creator")).toBe(CatCreator);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-creator"
    ) as CatCreator;
    expect(element).toBeInstanceOf(CatCreator);
  });
});

describe("CatPersonalityPicker", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-personality-picker")).toBe(
      CatPersonalityPicker
    );
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-personality-picker"
    ) as CatPersonalityPicker;
    expect(element).toBeInstanceOf(CatPersonalityPicker);
  });

  it("should have personality property", () => {
    const element = document.createElement(
      "cat-personality-picker"
    ) as CatPersonalityPicker;
    expect(element).toHaveProperty("personality");
  });
});

describe("CatPreview", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-preview")).toBe(CatPreview);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-preview"
    ) as CatPreview;
    expect(element).toBeInstanceOf(CatPreview);
  });

  it("should have settings property", () => {
    const element = document.createElement(
      "cat-preview"
    ) as CatPreview;
    expect(element).toHaveProperty("settings");
  });
});

// Phase 5: Drop-in Solutions

describe("MbCatPlayground", () => {
  it("should be a custom element", () => {
    expect(customElements.get("mb-cat-playground")).toBe(
      MbCatPlayground
    );
  });

  it("should create instance", () => {
    const element = document.createElement(
      "mb-cat-playground"
    ) as MbCatPlayground;
    expect(element).toBeInstanceOf(MbCatPlayground);
  });

  it("should have showPreview property", () => {
    const element = document.createElement(
      "mb-cat-playground"
    ) as MbCatPlayground;
    expect(element).toHaveProperty("showPreview");
    expect(element.showPreview).toBe(true);
  });

  it("should have showStats property", () => {
    const element = document.createElement(
      "mb-cat-playground"
    ) as MbCatPlayground;
    expect(element).toHaveProperty("showStats");
    expect(element.showStats).toBe(true);
  });

  it("should have autoInit property", () => {
    const element = document.createElement(
      "mb-cat-playground"
    ) as MbCatPlayground;
    expect(element).toHaveProperty("autoInit");
    expect(element.autoInit).toBe(true);
  });
});
