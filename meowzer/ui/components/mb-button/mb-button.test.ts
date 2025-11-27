import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbButton } from "./mb-button.js";

describe("MbButton", () => {
  let el: MbButton;

  beforeEach(() => {
    el = document.createElement("mb-button") as MbButton;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-button")).toBe(MbButton);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbButton);
  });

  describe("rendering", () => {
    it("renders with default properties", () => {
      expect(el.variant).toBe("primary");
      expect(el.size).toBe("md");
      expect(el.disabled).toBe(false);
      expect(el.loading).toBe(false);
    });

    it("applies variant classes correctly", async () => {
      await el.updateComplete;
      const button = el.shadowRoot?.querySelector("button");
      expect(button?.classList.contains("mb-button--primary")).toBe(
        true
      );

      el.variant = "secondary";
      await el.updateComplete;
      expect(button?.classList.contains("mb-button--secondary")).toBe(
        true
      );
    });

    it("applies size classes correctly", async () => {
      el.size = "sm";
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.classList.contains("mb-button--sm")).toBe(true);

      el.size = "lg";
      await el.updateComplete;
      expect(button?.classList.contains("mb-button--lg")).toBe(true);
    });

    it("applies loading class when loading", async () => {
      el.loading = true;
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.classList.contains("mb-button--loading")).toBe(
        true
      );
    });
  });

  describe("interactions", () => {
    it("emits mb-click event when clicked", async () => {
      await el.updateComplete;

      let clicked = false;
      el.addEventListener("mb-click", () => {
        clicked = true;
      });

      const button = el.shadowRoot?.querySelector("button");
      button?.click();

      expect(clicked).toBe(true);
    });

    it("does not emit mb-click when disabled", async () => {
      el.disabled = true;
      await el.updateComplete;

      let clicked = false;
      el.addEventListener("mb-click", () => {
        clicked = true;
      });

      const button = el.shadowRoot?.querySelector("button");
      button?.click();

      expect(clicked).toBe(false);
    });

    it("does not emit mb-click when loading", async () => {
      el.loading = true;
      await el.updateComplete;

      let clicked = false;
      el.addEventListener("mb-click", () => {
        clicked = true;
      });

      const button = el.shadowRoot?.querySelector("button");
      button?.click();

      expect(clicked).toBe(false);
    });

    it("sets disabled attribute when disabled", async () => {
      el.disabled = true;
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.hasAttribute("disabled")).toBe(true);
    });

    it("sets disabled attribute when loading", async () => {
      el.loading = true;
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.hasAttribute("disabled")).toBe(true);
    });

    it("sets aria-busy when loading", async () => {
      el.loading = true;
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.getAttribute("aria-busy")).toBe("true");
    });
  });

  describe("accessibility", () => {
    it("has correct button type", async () => {
      await el.updateComplete;
      const button = el.shadowRoot?.querySelector("button");
      expect(button?.type).toBe("button");
    });

    it("can set type to submit", async () => {
      el.type = "submit";
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector("button");
      expect(button?.type).toBe("submit");
    });

    it("exposes button part for styling", async () => {
      await el.updateComplete;
      const button = el.shadowRoot?.querySelector("button");
      expect(button?.getAttribute("part")).toBe("button");
    });
  });

  describe("slots", () => {
    it("supports icon slot", async () => {
      const icon = document.createElement("span");
      icon.slot = "icon";
      icon.textContent = "🐱";
      el.appendChild(icon);

      await el.updateComplete;
      const iconSlot = el.shadowRoot?.querySelector(
        'slot[name="icon"]'
      );
      expect(iconSlot).toBeTruthy();
    });
  });
});
