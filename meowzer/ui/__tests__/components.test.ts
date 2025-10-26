/**
 * Tests for Phase 2 and Phase 3 components
 */

import { describe, it, expect } from "vitest";
import { CatCreator } from "../components/cat-creator/cat-creator.js";
import { CatAppearanceForm } from "../components/cat-appearance-form/cat-appearance-form.js";
import { CatPersonalityPicker } from "../components/cat-personality-picker/cat-personality-picker.js";
import { CatPreview } from "../components/cat-preview/cat-preview.js";
import { CatManager } from "../components/cat-manager/cat-manager.js";
import { CatCard } from "../components/cat-card/cat-card.js";
import { CatControls } from "../components/cat-controls/cat-controls.js";
import { CatListItem } from "../components/cat-list-item/cat-list-item.js";

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

describe("CatManager", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-manager")).toBe(CatManager);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-manager"
    ) as CatManager;
    expect(element).toBeInstanceOf(CatManager);
  });
});

describe("CatCard", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-card")).toBe(CatCard);
  });

  it("should create instance", () => {
    const element = document.createElement("cat-card") as CatCard;
    expect(element).toBeInstanceOf(CatCard);
  });

  it("should have cat property", () => {
    const element = document.createElement("cat-card") as CatCard;
    expect(element).toHaveProperty("cat");
  });

  it("should have selected property", () => {
    const element = document.createElement("cat-card") as CatCard;
    expect(element).toHaveProperty("selected");
  });
});

describe("CatControls", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-controls")).toBe(CatControls);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-controls"
    ) as CatControls;
    expect(element).toBeInstanceOf(CatControls);
  });

  it("should have cat property", () => {
    const element = document.createElement(
      "cat-controls"
    ) as CatControls;
    expect(element).toHaveProperty("cat");
  });
});

describe("CatListItem", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-list-item")).toBe(CatListItem);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-list-item"
    ) as CatListItem;
    expect(element).toBeInstanceOf(CatListItem);
  });

  it("should have cat property", () => {
    const element = document.createElement(
      "cat-list-item"
    ) as CatListItem;
    expect(element).toHaveProperty("cat");
  });

  it("should have selected property", () => {
    const element = document.createElement(
      "cat-list-item"
    ) as CatListItem;
    expect(element).toHaveProperty("selected");
  });
});
