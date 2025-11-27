import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { MbColorPicker } from "./mb-color-picker.js";

describe("MbColorPicker", () => {
  let el: MbColorPicker;

  beforeEach(() => {
    el = document.createElement("mb-color-picker") as MbColorPicker;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  const waitForUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 10));

  describe("Basic rendering", () => {
    it("should create element", () => {
      expect(el).toBeInstanceOf(MbColorPicker);
    });

    it("should have default value", () => {
      expect(el.value).toBe("#000000");
    });

    it("should have default format", () => {
      expect(el.format).toBe("hex");
    });

    it("should not be inline by default", () => {
      expect(el.inline).toBe(false);
    });

    it("should not be disabled by default", () => {
      expect(el.disabled).toBe(false);
    });

    it("should render swatch", async () => {
      await waitForUpdate();
      const swatch = el.shadowRoot!.querySelector(
        ".mb-color-picker__swatch"
      );
      expect(swatch).toBeTruthy();
    });

    it("should render grid", async () => {
      await waitForUpdate();
      const grid = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid"
      );
      expect(grid).toBeTruthy();
    });

    it("should render hue slider", async () => {
      await waitForUpdate();
      const slider = el.shadowRoot!.querySelector(
        ".mb-color-picker__hue-slider"
      );
      expect(slider).toBeTruthy();
    });

    it("should render text input", async () => {
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      );
      expect(input).toBeTruthy();
    });

    it("should render native input", async () => {
      await waitForUpdate();
      const native = el.shadowRoot!.querySelector(
        ".mb-color-picker__native"
      ) as HTMLInputElement;
      expect(native).toBeTruthy();
      expect(native.type).toBe("color");
    });
  });

  describe("Properties", () => {
    it("should set value property", async () => {
      el.value = "#ff0000";
      await waitForUpdate();
      expect(el.value).toBe("#ff0000");
    });

    it("should reflect inline attribute", async () => {
      el.inline = true;
      await waitForUpdate();
      expect(el.hasAttribute("inline")).toBe(true);
    });

    it("should set disabled property", async () => {
      el.disabled = true;
      await waitForUpdate();
      expect(el.disabled).toBe(true);
    });

    it("should update text input when value changes", async () => {
      el.value = "#3498db";
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      expect(input.value).toBe("#3498DB");
    });
  });

  describe("Color conversions", () => {
    it("should display red color", async () => {
      el.value = "#ff0000";
      await waitForUpdate();
      const swatch = el.shadowRoot!.querySelector(
        ".mb-color-picker__swatch-color"
      ) as HTMLElement;
      expect(swatch.style.background).toBe("#ff0000");
    });

    it("should display green color", async () => {
      el.value = "#00ff00";
      await waitForUpdate();
      const swatch = el.shadowRoot!.querySelector(
        ".mb-color-picker__swatch-color"
      ) as HTMLElement;
      expect(swatch.style.background).toBe("#00ff00");
    });

    it("should display blue color", async () => {
      el.value = "#0000ff";
      await waitForUpdate();
      const swatch = el.shadowRoot!.querySelector(
        ".mb-color-picker__swatch-color"
      ) as HTMLElement;
      expect(swatch.style.background).toBe("#0000ff");
    });

    it("should handle black", async () => {
      el.value = "#000000";
      await waitForUpdate();
      expect(el.value).toBe("#000000");
    });

    it("should handle white", async () => {
      el.value = "#ffffff";
      await waitForUpdate();
      expect(el.value).toBe("#ffffff");
    });
  });

  describe("Text input", () => {
    it("should accept valid hex input", async () => {
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "#ff5733";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();
      expect(el.value).toBe("#ff5733");
    });

    it("should add # prefix if missing", async () => {
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "ff5733";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();
      expect(el.value).toBe("#ff5733");
    });

    it("should ignore invalid hex", async () => {
      el.value = "#ff0000";
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "invalid";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();
      expect(el.value).toBe("#ff0000");
    });

    it("should accept uppercase hex", async () => {
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "#FF5733";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();
      expect(el.value.toLowerCase()).toBe("#ff5733");
    });
  });

  describe("Events", () => {
    it("should emit mb-change on text input change", async () => {
      await waitForUpdate();
      const spy = vi.fn();
      el.addEventListener("mb-change", spy);

      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "#00ff00";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();

      expect(spy).toHaveBeenCalled();
      const event = spy.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value).toBe("#00ff00");
    });

    it("should emit mb-change on native input", async () => {
      await waitForUpdate();
      const spy = vi.fn();
      el.addEventListener("mb-change", spy);

      const native = el.shadowRoot!.querySelector(
        ".mb-color-picker__native"
      ) as HTMLInputElement;
      native.value = "#00ff00";
      native.dispatchEvent(new Event("input"));
      await waitForUpdate();

      expect(spy).toHaveBeenCalled();
    });

    it("should bubble events", async () => {
      const container = document.createElement("div");
      container.appendChild(el);
      document.body.appendChild(container);
      await waitForUpdate();

      const spy = vi.fn();
      container.addEventListener("mb-change", spy);

      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      input.value = "#00ff00";
      input.dispatchEvent(new Event("change"));
      await waitForUpdate();

      expect(spy).toHaveBeenCalled();
      container.remove();
    });
  });

  describe("Grid interaction", () => {
    it("should have grid handle", async () => {
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid-handle"
      );
      expect(handle).toBeTruthy();
    });

    it("should position grid handle for red", async () => {
      el.value = "#ff0000";
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid-handle"
      ) as HTMLElement;
      expect(handle.style.left).toBe("100%");
      expect(handle.style.top).toBe("0%");
    });
  });

  describe("Hue slider", () => {
    it("should have hue handle", async () => {
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        ".mb-color-picker__hue-handle"
      );
      expect(handle).toBeTruthy();
    });

    it("should position hue handle for red", async () => {
      el.value = "#ff0000";
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        ".mb-color-picker__hue-handle"
      ) as HTMLElement;
      expect(handle.style.left).toBe("0%");
    });
  });

  describe("Disabled state", () => {
    it("should disable text input", async () => {
      el.disabled = true;
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector(
        ".mb-color-picker__text-input"
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("should disable native input", async () => {
      el.disabled = true;
      await waitForUpdate();
      const native = el.shadowRoot!.querySelector(
        ".mb-color-picker__native"
      ) as HTMLInputElement;
      expect(native.disabled).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have role on grid", async () => {
      await waitForUpdate();
      const grid = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid"
      );
      expect(grid?.getAttribute("role")).toBe("slider");
    });

    it("should have role on hue slider", async () => {
      await waitForUpdate();
      const slider = el.shadowRoot!.querySelector(
        ".mb-color-picker__hue-slider"
      );
      expect(slider?.getAttribute("role")).toBe("slider");
    });

    it("should have aria-label on grid", async () => {
      await waitForUpdate();
      const grid = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid"
      );
      expect(grid?.getAttribute("aria-label")).toBe(
        "Color saturation and brightness"
      );
    });

    it("should have aria-label on hue slider", async () => {
      await waitForUpdate();
      const slider = el.shadowRoot!.querySelector(
        ".mb-color-picker__hue-slider"
      );
      expect(slider?.getAttribute("aria-label")).toBe("Color hue");
    });

    it("should have tabindex when not disabled", async () => {
      await waitForUpdate();
      const grid = el.shadowRoot!.querySelector(
        ".mb-color-picker__grid"
      );
      expect(grid?.getAttribute("tabindex")).toBe("0");
    });
  });

  describe("CSS parts", () => {
    it("should expose base part", async () => {
      await waitForUpdate();
      const base = el.shadowRoot!.querySelector("[part~='base']");
      expect(base).toBeTruthy();
    });

    it("should expose preview part", async () => {
      await waitForUpdate();
      const preview = el.shadowRoot!.querySelector(
        "[part~='preview']"
      );
      expect(preview).toBeTruthy();
    });

    it("should expose swatch part", async () => {
      await waitForUpdate();
      const swatch = el.shadowRoot!.querySelector("[part~='swatch']");
      expect(swatch).toBeTruthy();
    });

    it("should expose input part", async () => {
      await waitForUpdate();
      const input = el.shadowRoot!.querySelector("[part~='input']");
      expect(input).toBeTruthy();
    });

    it("should expose grid part", async () => {
      await waitForUpdate();
      const grid = el.shadowRoot!.querySelector("[part~='grid']");
      expect(grid).toBeTruthy();
    });

    it("should expose grid-handle part", async () => {
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        "[part~='grid-handle']"
      );
      expect(handle).toBeTruthy();
    });

    it("should expose hue-slider part", async () => {
      await waitForUpdate();
      const slider = el.shadowRoot!.querySelector(
        "[part~='hue-slider']"
      );
      expect(slider).toBeTruthy();
    });

    it("should expose hue-handle part", async () => {
      await waitForUpdate();
      const handle = el.shadowRoot!.querySelector(
        "[part~='hue-handle']"
      );
      expect(handle).toBeTruthy();
    });
  });
});
