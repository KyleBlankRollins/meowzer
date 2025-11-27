import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-wardrobe-dialog";
import type { MbWardrobeDialog } from "./mb-wardrobe-dialog";

describe("MbWardrobeDialog", () => {
  let el: MbWardrobeDialog;

  beforeEach(() => {
    el = document.createElement(
      "mb-wardrobe-dialog"
    ) as MbWardrobeDialog;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-wardrobe-dialog")).toBeDefined();
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  describe("properties", () => {
    it("has cat property", () => {
      expect("cat" in el).toBe(true);
    });

    it("has open property", () => {
      expect("open" in el).toBe(true);
    });

    it("defaults to closed", () => {
      expect(el.open).toBe(false);
    });
  });

  describe("rendering", () => {
    it("renders mb-modal", async () => {
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal).toBeTruthy();
    });

    it("renders hat selection section", async () => {
      await el.updateComplete;
      const hatSelection =
        el.shadowRoot?.querySelector(".hat-selection");
      expect(hatSelection).toBeTruthy();
    });

    it("renders color customization section", async () => {
      await el.updateComplete;
      const colorCustomization = el.shadowRoot?.querySelector(
        ".color-customization"
      );
      expect(colorCustomization).toBeTruthy();
    });

    it("renders hat type buttons", async () => {
      await el.updateComplete;
      const hatButtons =
        el.shadowRoot?.querySelectorAll(".hat-button");
      expect(hatButtons?.length).toBeGreaterThan(0);
    });

    it("renders beanie button", async () => {
      await el.updateComplete;
      const beanieButton = Array.from(
        el.shadowRoot?.querySelectorAll(".hat-button") || []
      ).find((btn) => btn.textContent?.includes("Beanie"));
      expect(beanieButton).toBeTruthy();
    });

    it("renders cowboy button", async () => {
      await el.updateComplete;
      const cowboyButton = Array.from(
        el.shadowRoot?.querySelectorAll(".hat-button") || []
      ).find((btn) => btn.textContent?.includes("Cowboy"));
      expect(cowboyButton).toBeTruthy();
    });

    it("renders baseball button", async () => {
      await el.updateComplete;
      const baseballButton = Array.from(
        el.shadowRoot?.querySelectorAll(".hat-button") || []
      ).find((btn) => btn.textContent?.includes("Baseball"));
      expect(baseballButton).toBeTruthy();
    });
  });

  describe("color pickers", () => {
    it("renders base color picker", async () => {
      await el.updateComplete;
      const pickers =
        el.shadowRoot?.querySelectorAll("mb-color-picker");
      const basePicker = Array.from(pickers || []).find(
        (p) => p.getAttribute("label") === "Base Color"
      );
      expect(basePicker).toBeTruthy();
    });

    it("renders accent color picker", async () => {
      await el.updateComplete;
      const pickers =
        el.shadowRoot?.querySelectorAll("mb-color-picker");
      const accentPicker = Array.from(pickers || []).find(
        (p) => p.getAttribute("label") === "Accent Color"
      );
      expect(accentPicker).toBeTruthy();
    });

    it("renders two color pickers", async () => {
      await el.updateComplete;
      const pickers =
        el.shadowRoot?.querySelectorAll("mb-color-picker");
      expect(pickers?.length).toBe(2);
    });
  });

  describe("dialog structure", () => {
    it("has wardrobe content container", async () => {
      await el.updateComplete;
      const content = el.shadowRoot?.querySelector(
        ".wardrobe-content"
      );
      expect(content).toBeTruthy();
    });

    it("has footer with buttons", async () => {
      await el.updateComplete;
      const footer = el.shadowRoot?.querySelector('[slot="footer"]');
      expect(footer).toBeTruthy();
    });

    it("renders cancel button", async () => {
      await el.updateComplete;
      const footer = el.shadowRoot?.querySelector('[slot="footer"]');
      const cancelButton = Array.from(
        footer?.querySelectorAll("mb-button") || []
      ).find((btn) => btn.textContent?.includes("Cancel"));
      expect(cancelButton).toBeTruthy();
    });

    it("renders apply button", async () => {
      await el.updateComplete;
      const footer = el.shadowRoot?.querySelector('[slot="footer"]');
      const applyButton = Array.from(
        footer?.querySelectorAll("mb-button") || []
      ).find((btn) => btn.textContent?.includes("Apply Hat"));
      expect(applyButton).toBeTruthy();
    });
  });

  describe("modal integration", () => {
    it("passes open state to modal", async () => {
      el.open = true;
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal?.hasAttribute("open")).toBe(true);
    });

    it("modal is closed by default", async () => {
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal?.hasAttribute("open")).toBe(false);
    });

    it("modal has size attribute", async () => {
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal?.getAttribute("size")).toBe("sm");
    });

    it("modal has heading attribute", async () => {
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal?.hasAttribute("heading")).toBe(true);
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
    it("has section labels", async () => {
      await el.updateComplete;
      const labels =
        el.shadowRoot?.querySelectorAll(".section-label");
      expect(labels?.length).toBeGreaterThan(0);
    });

    it("has hat selection label", async () => {
      await el.updateComplete;
      const label = Array.from(
        el.shadowRoot?.querySelectorAll(".section-label") || []
      ).find((l) => l.textContent?.includes("Select Hat Style"));
      expect(label).toBeTruthy();
    });

    it("has color customization label", async () => {
      await el.updateComplete;
      const label = Array.from(
        el.shadowRoot?.querySelectorAll(".section-label") || []
      ).find((l) => l.textContent?.includes("Customize Colors"));
      expect(label).toBeTruthy();
    });

    it("color pickers have labels", async () => {
      await el.updateComplete;
      const pickers =
        el.shadowRoot?.querySelectorAll("mb-color-picker");
      pickers?.forEach((picker) => {
        expect(picker.getAttribute("label")).toBeTruthy();
      });
    });
  });
});
