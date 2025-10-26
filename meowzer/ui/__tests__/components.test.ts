/**
 * Tests for Phase 2 creation components
 */

import { describe, it, expect } from "vitest";
import { CatCreator } from "../components/cat-creator/cat-creator.js";
import { CatAppearanceForm } from "../components/cat-appearance-form/cat-appearance-form.js";
import { CatPersonalityPicker } from "../components/cat-personality-picker/cat-personality-picker.js";
import { CatPreview } from "../components/cat-preview/cat-preview.js";

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

describe("CatAppearanceForm", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-appearance-form")).toBe(
      CatAppearanceForm
    );
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-appearance-form"
    ) as CatAppearanceForm;
    expect(element).toBeInstanceOf(CatAppearanceForm);
  });

  it("should have settings property", () => {
    const element = document.createElement(
      "cat-appearance-form"
    ) as CatAppearanceForm;
    expect(element).toHaveProperty("settings");
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
