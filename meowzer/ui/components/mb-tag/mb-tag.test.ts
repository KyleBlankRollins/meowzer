import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbTag } from "./mb-tag.js";

describe("MbTag", () => {
  let el: MbTag;

  beforeEach(() => {
    el = document.createElement("mb-tag") as MbTag;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-tag")).toBe(MbTag);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbTag);
  });

  describe("rendering", () => {
    it("renders with default properties", () => {
      expect(el.variant).toBe("gray");
      expect(el.size).toBe("md");
      expect(el.removable).toBe(false);
    });

    it("applies variant classes correctly", async () => {
      await el.updateComplete;
      const tag = el.shadowRoot?.querySelector(".mb-tag");
      expect(tag?.classList.contains("mb-tag--gray")).toBe(true);

      el.variant = "blue";
      await el.updateComplete;
      expect(tag?.classList.contains("mb-tag--blue")).toBe(true);

      el.variant = "green";
      await el.updateComplete;
      expect(tag?.classList.contains("mb-tag--green")).toBe(true);

      el.variant = "red";
      await el.updateComplete;
      expect(tag?.classList.contains("mb-tag--red")).toBe(true);
    });

    it("applies size classes correctly", async () => {
      el.size = "sm";
      await el.updateComplete;

      const tag = el.shadowRoot?.querySelector(".mb-tag");
      expect(tag?.classList.contains("mb-tag--sm")).toBe(true);

      el.size = "lg";
      await el.updateComplete;
      expect(tag?.classList.contains("mb-tag--lg")).toBe(true);
    });

    it("renders remove button when removable", async () => {
      el.removable = true;
      await el.updateComplete;

      const removeBtn =
        el.shadowRoot?.querySelector(".mb-tag__remove");
      expect(removeBtn).toBeTruthy();
    });

    it("does not render remove button when not removable", async () => {
      await el.updateComplete;

      const removeBtn =
        el.shadowRoot?.querySelector(".mb-tag__remove");
      expect(removeBtn).toBeFalsy();
    });
  });

  describe("interactions", () => {
    it("emits mb-remove event when remove button clicked", async () => {
      el.removable = true;
      await el.updateComplete;

      let removed = false;
      el.addEventListener("mb-remove", () => {
        removed = true;
      });

      const removeBtn = el.shadowRoot?.querySelector(
        ".mb-tag__remove"
      ) as HTMLButtonElement;
      removeBtn?.click();

      expect(removed).toBe(true);
    });

    it("includes original event in mb-remove detail", async () => {
      el.removable = true;
      await el.updateComplete;

      let eventDetail: any;
      el.addEventListener("mb-remove", (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const removeBtn = el.shadowRoot?.querySelector(
        ".mb-tag__remove"
      ) as HTMLButtonElement;
      removeBtn?.click();

      expect(eventDetail.originalEvent).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has aria-label on remove button", async () => {
      el.removable = true;
      await el.updateComplete;

      const removeBtn =
        el.shadowRoot?.querySelector(".mb-tag__remove");
      expect(removeBtn?.getAttribute("aria-label")).toBe(
        "Remove tag"
      );
    });

    it("exposes tag part for styling", async () => {
      await el.updateComplete;

      const tag = el.shadowRoot?.querySelector(".mb-tag");
      expect(tag?.getAttribute("part")).toBe("tag");
    });

    it("exposes remove part for styling", async () => {
      el.removable = true;
      await el.updateComplete;

      const removeBtn =
        el.shadowRoot?.querySelector(".mb-tag__remove");
      expect(removeBtn?.getAttribute("part")).toBe("remove");
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
