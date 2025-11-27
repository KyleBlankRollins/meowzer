import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbSlider } from "./mb-slider.js";

describe("MbSlider", () => {
  let el: MbSlider;

  beforeEach(() => {
    el = document.createElement("mb-slider") as MbSlider;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-slider")).toBe(MbSlider);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbSlider);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.label).toBe("");
      expect(el.min).toBe(0);
      expect(el.max).toBe(100);
      expect(el.step).toBe(1);
      expect(el.value).toBe(0);
      expect(el.showValue).toBe(true);
      expect(el.decimalPlaces).toBe(0);
      expect(el.disabled).toBe(false);
    });

    it("applies custom min/max/step", async () => {
      el.min = 0;
      el.max = 1;
      el.step = 0.1;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      expect(input.min).toBe("0");
      expect(input.max).toBe("1");
      expect(input.step).toBe("0.1");
    });

    it("applies custom value", async () => {
      el.value = 50;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      expect(input.value).toBe("50");
    });

    it("shows label when provided", async () => {
      el.label = "Volume";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(".mb-slider__label");
      expect(label?.textContent?.trim()).toBe("Volume");
    });

    it("shows value when showValue is true", async () => {
      el.value = 42;
      el.showValue = true;
      await el.updateComplete;

      const valueDisplay = el.shadowRoot?.querySelector(
        ".mb-slider__value"
      );
      expect(valueDisplay?.textContent?.trim()).toBe("42");
    });

    it("hides value when showValue is false", async () => {
      el.showValue = false;
      await el.updateComplete;

      const valueDisplay = el.shadowRoot?.querySelector(
        ".mb-slider__value"
      );
      expect(valueDisplay).toBeFalsy();
    });

    it("formats value with decimal places", async () => {
      el.value = 0.567;
      el.decimalPlaces = 2;
      await el.updateComplete;

      const valueDisplay = el.shadowRoot?.querySelector(
        ".mb-slider__value"
      );
      expect(valueDisplay?.textContent?.trim()).toBe("0.57");
    });

    it("shows helper text when provided", async () => {
      el.helper = "Adjust volume level";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-slider__helper"
      );
      expect(helper?.textContent?.trim()).toBe("Adjust volume level");
    });
  });

  describe("interactions", () => {
    it("emits mb-input event on input", async () => {
      await el.updateComplete;

      let inputValue: number | undefined;
      el.addEventListener("mb-input", (e: Event) => {
        inputValue = (e as CustomEvent).detail.value;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      input.value = "75";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(inputValue).toBe(75);
    });

    it("emits mb-change event on change", async () => {
      await el.updateComplete;

      let changeValue: number | undefined;
      el.addEventListener("mb-change", (e: Event) => {
        changeValue = (e as CustomEvent).detail.value;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      input.value = "60";
      input.dispatchEvent(new Event("change", { bubbles: true }));

      expect(changeValue).toBe(60);
    });

    it("updates value property on input", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      input.value = "80";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(el.value).toBe(80);
    });

    it("updates progress bar on value change", async () => {
      el.min = 0;
      el.max = 100;
      el.value = 50;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for progress update

      const progress = el.shadowRoot?.querySelector(
        ".mb-slider__progress"
      ) as HTMLElement;
      expect(progress.style.width).toBe("50%");
    });
  });

  describe("disabled state", () => {
    it("disables input when disabled", async () => {
      el.disabled = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-slider__input"
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("reflects disabled attribute on host", async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("has aria-label on input", async () => {
      el.label = "Volume";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(".mb-slider__input");
      expect(input?.getAttribute("aria-label")).toBe("Volume");
    });

    it("has aria-valuemin on input", async () => {
      el.min = 0;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(".mb-slider__input");
      expect(input?.getAttribute("aria-valuemin")).toBe("0");
    });

    it("has aria-valuemax on input", async () => {
      el.max = 100;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(".mb-slider__input");
      expect(input?.getAttribute("aria-valuemax")).toBe("100");
    });

    it("has aria-valuenow on input", async () => {
      el.value = 50;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(".mb-slider__input");
      expect(input?.getAttribute("aria-valuenow")).toBe("50");
    });

    it("exposes slider part", async () => {
      await el.updateComplete;

      const slider = el.shadowRoot?.querySelector(".mb-slider");
      expect(slider?.getAttribute("part")).toBe("slider");
    });

    it("exposes label part", async () => {
      el.label = "Test";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(".mb-slider__label");
      expect(label?.getAttribute("part")).toBe("label");
    });

    it("exposes value part", async () => {
      el.showValue = true;
      await el.updateComplete;

      const value = el.shadowRoot?.querySelector(".mb-slider__value");
      expect(value?.getAttribute("part")).toBe("value");
    });

    it("exposes input part", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(".mb-slider__input");
      expect(input?.getAttribute("part")).toBe("input");
    });
  });
});
