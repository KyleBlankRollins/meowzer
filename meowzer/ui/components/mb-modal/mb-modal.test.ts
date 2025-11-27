import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbModal } from "./mb-modal.js";

describe("MbModal", () => {
  let el: MbModal;

  beforeEach(() => {
    el = document.createElement("mb-modal") as MbModal;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
    // Clean up body overflow
    document.body.style.overflow = "";
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-modal")).toBe(MbModal);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbModal);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.open).toBe(false);
      expect(el.size).toBe("md");
      expect(el.heading).toBe("");
      expect(el.showClose).toBe(true);
      expect(el.closeOnBackdrop).toBe(true);
      expect(el.closeOnEscape).toBe(true);
    });

    it("does not render when closed", async () => {
      el.open = false;
      await el.updateComplete;

      const backdrop = el.shadowRoot?.querySelector(
        ".mb-modal__backdrop"
      );
      expect(backdrop).toBeFalsy();
    });

    it("renders when open", async () => {
      el.open = true;
      await el.updateComplete;

      const backdrop = el.shadowRoot?.querySelector(
        ".mb-modal__backdrop"
      );
      expect(backdrop).toBeTruthy();
    });

    it("applies size attribute", async () => {
      el.open = true;
      el.size = "lg";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("lg");
    });

    it("shows heading when provided", async () => {
      el.open = true;
      el.heading = "Test Modal";
      await el.updateComplete;

      const heading = el.shadowRoot?.querySelector(
        ".mb-modal__heading"
      );
      expect(heading?.textContent?.trim()).toBe("Test Modal");
    });

    it("shows close button by default", async () => {
      el.open = true;
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-modal__close"
      );
      expect(closeButton).toBeTruthy();
    });

    it("hides close button when showClose is false", async () => {
      el.open = true;
      el.showClose = false;
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-modal__close"
      );
      expect(closeButton).toBeFalsy();
    });
  });

  describe("interactions", () => {
    it("emits mb-close event when close button clicked", async () => {
      el.open = true;
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-modal__close"
      ) as HTMLButtonElement;
      closeButton.click();

      expect(closeFired).toBe(true);
    });

    it("sets open to false when closed", async () => {
      el.open = true;
      await el.updateComplete;

      el.close();

      expect(el.open).toBe(false);
    });

    it("closes on backdrop click when closeOnBackdrop is true", async () => {
      el.open = true;
      el.closeOnBackdrop = true;
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const backdrop = el.shadowRoot?.querySelector(
        ".mb-modal__backdrop"
      ) as HTMLElement;
      backdrop.click();

      expect(closeFired).toBe(true);
    });

    it("does not close on backdrop click when closeOnBackdrop is false", async () => {
      el.open = true;
      el.closeOnBackdrop = false;
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const backdrop = el.shadowRoot?.querySelector(
        ".mb-modal__backdrop"
      ) as HTMLElement;
      backdrop.click();

      expect(closeFired).toBe(false);
    });

    it("closes on Escape key when closeOnEscape is true", async () => {
      el.open = true;
      el.closeOnEscape = true;
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      el.dispatchEvent(event);

      expect(closeFired).toBe(true);
    });

    it("does not close on Escape when closeOnEscape is false", async () => {
      el.open = true;
      el.closeOnEscape = false;
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      el.dispatchEvent(event);

      expect(closeFired).toBe(false);
    });

    it("prevents body scroll when open", async () => {
      el.open = true;
      await el.updateComplete;

      // Wait for handleOpen to run
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when closed", async () => {
      el.open = true;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      el.open = false;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("accessibility", () => {
    it("has role=dialog", async () => {
      el.open = true;
      await el.updateComplete;

      const modal = el.shadowRoot?.querySelector(".mb-modal");
      expect(modal?.getAttribute("role")).toBe("dialog");
    });

    it("has aria-modal=true", async () => {
      el.open = true;
      await el.updateComplete;

      const modal = el.shadowRoot?.querySelector(".mb-modal");
      expect(modal?.getAttribute("aria-modal")).toBe("true");
    });

    it("close button has aria-label", async () => {
      el.open = true;
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-modal__close"
      );
      expect(closeButton?.getAttribute("aria-label")).toBe(
        "Close modal"
      );
    });

    it("exposes backdrop part", async () => {
      el.open = true;
      await el.updateComplete;

      const backdrop = el.shadowRoot?.querySelector(
        ".mb-modal__backdrop"
      );
      expect(backdrop?.getAttribute("part")).toBe("backdrop");
    });

    it("exposes modal part", async () => {
      el.open = true;
      await el.updateComplete;

      const modal = el.shadowRoot?.querySelector(".mb-modal");
      expect(modal?.getAttribute("part")).toBe("modal");
    });

    it("exposes header part", async () => {
      el.open = true;
      await el.updateComplete;

      const header = el.shadowRoot?.querySelector(
        ".mb-modal__header"
      );
      expect(header?.getAttribute("part")).toBe("header");
    });

    it("exposes body part", async () => {
      el.open = true;
      await el.updateComplete;

      const body = el.shadowRoot?.querySelector(".mb-modal__body");
      expect(body?.getAttribute("part")).toBe("body");
    });

    it("exposes footer part", async () => {
      el.open = true;
      await el.updateComplete;

      const footer = el.shadowRoot?.querySelector(
        ".mb-modal__footer"
      );
      expect(footer?.getAttribute("part")).toBe("footer");
    });
  });

  describe("slots", () => {
    it("supports header slot", async () => {
      el.open = true;
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector(
        'slot[name="header"]'
      );
      expect(slot).toBeTruthy();
    });

    it("supports default slot for body", async () => {
      el.open = true;
      await el.updateComplete;

      const bodySlot = el.shadowRoot?.querySelector(
        ".mb-modal__body > slot:not([name])"
      );
      expect(bodySlot).toBeTruthy();
    });

    it("supports footer slot", async () => {
      el.open = true;
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector(
        'slot[name="footer"]'
      );
      expect(slot).toBeTruthy();
    });
  });

  describe("size variants", () => {
    it("reflects size attribute on host", async () => {
      el.open = true;
      el.size = "sm";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("sm");
    });
  });

  describe("open state", () => {
    it("reflects open attribute on host", async () => {
      el.open = true;
      await el.updateComplete;

      expect(el.hasAttribute("open")).toBe(true);
    });
  });
});
