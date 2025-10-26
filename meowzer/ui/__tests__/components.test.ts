/**
 * Tests for Phase 2, Phase 3, Phase 4, and Phase 5 components
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
import { CatGallery } from "../components/cat-gallery/cat-gallery.js";
import { CollectionPicker } from "../components/collection-picker/collection-picker.js";
import { CatThumbnail } from "../components/cat-thumbnail/cat-thumbnail.js";
import { CatExporter } from "../components/cat-exporter/cat-exporter.js";
import { CatImporter } from "../components/cat-importer/cat-importer.js";
import { MbCatOverlay } from "../components/mb-cat-overlay/mb-cat-overlay.js";
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

describe("CatGallery", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-gallery")).toBe(CatGallery);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-gallery"
    ) as CatGallery;
    expect(element).toBeInstanceOf(CatGallery);
  });
});

describe("CollectionPicker", () => {
  it("should be a custom element", () => {
    expect(customElements.get("collection-picker")).toBe(
      CollectionPicker
    );
  });

  it("should create instance", () => {
    const element = document.createElement(
      "collection-picker"
    ) as CollectionPicker;
    expect(element).toBeInstanceOf(CollectionPicker);
  });

  it("should have selectedCollection property", () => {
    const element = document.createElement(
      "collection-picker"
    ) as CollectionPicker;
    expect(element).toHaveProperty("selectedCollection");
  });
});

describe("CatThumbnail", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-thumbnail")).toBe(CatThumbnail);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-thumbnail"
    ) as CatThumbnail;
    expect(element).toBeInstanceOf(CatThumbnail);
  });

  it("should have cat property", () => {
    const element = document.createElement(
      "cat-thumbnail"
    ) as CatThumbnail;
    expect(element).toHaveProperty("cat");
  });
});

describe("CatExporter", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-exporter")).toBe(CatExporter);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-exporter"
    ) as CatExporter;
    expect(element).toBeInstanceOf(CatExporter);
  });
});

describe("CatImporter", () => {
  it("should be a custom element", () => {
    expect(customElements.get("cat-importer")).toBe(CatImporter);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "cat-importer"
    ) as CatImporter;
    expect(element).toBeInstanceOf(CatImporter);
  });
});

// Phase 5: Drop-in Solutions

describe("MbCatOverlay", () => {
  it("should be a custom element", () => {
    expect(customElements.get("mb-cat-overlay")).toBe(MbCatOverlay);
  });

  it("should create instance", () => {
    const element = document.createElement(
      "mb-cat-overlay"
    ) as MbCatOverlay;
    expect(element).toBeInstanceOf(MbCatOverlay);
  });

  it("should have position property", () => {
    const element = document.createElement(
      "mb-cat-overlay"
    ) as MbCatOverlay;
    expect(element).toHaveProperty("position");
    expect(element.position).toBe("bottom-right");
  });

  it("should have autoInit property", () => {
    const element = document.createElement(
      "mb-cat-overlay"
    ) as MbCatOverlay;
    expect(element).toHaveProperty("autoInit");
    expect(element.autoInit).toBe(true);
  });
});

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
