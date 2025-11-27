import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbSelect } from "./mb-select.js";

describe("MbSelect", () => {
  let el: MbSelect;

  beforeEach(() => {
    el = document.createElement("mb-select") as MbSelect;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-select")).toBe(MbSelect);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbSelect);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.label).toBe("");
      expect(el.value).toBe("");
      expect(el.helper).toBe("");
      expect(el.errorMessage).toBe("");
      expect(el.error).toBe(false);
      expect(el.disabled).toBe(false);
      expect(el.required).toBe(false);
      expect(el.size).toBe("md");
      expect(el.placeholder).toBe("");
    });

    it("applies label", async () => {
      el.label = "Choose option";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(".mb-select__label");
      expect(label?.textContent?.trim()).toContain("Choose option");
    });

    it("applies value via attribute", async () => {
      el.innerHTML = `
        <option value="a">A</option>
        <option value="b">B</option>
      `;
      el.setAttribute("value", "b");
      await el.updateComplete;

      // The component value property should be "b"
      expect(el.value).toBe("b");
    });

    it("applies disabled state", async () => {
      el.disabled = true;
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;
      expect(select.disabled).toBe(true);
    });

    it("shows helper text when provided", async () => {
      el.helper = "Choose an option";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-select__helper"
      );
      expect(helper?.textContent?.trim()).toBe("Choose an option");
    });

    it("shows error message when error is true", async () => {
      el.error = true;
      el.errorMessage = "This field is required";
      await el.updateComplete;

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-select__error"
      );
      expect(errorMsg?.textContent?.trim()).toBe(
        "This field is required"
      );
    });

    it("hides helper text when error is shown", async () => {
      el.helper = "Helper text";
      el.error = true;
      el.errorMessage = "Error message";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-select__helper"
      );
      expect(helper).toBeFalsy();

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-select__error"
      );
      expect(errorMsg).toBeTruthy();
    });

    it("applies required attribute", async () => {
      el.label = "Test Label";
      el.required = true;
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;
      expect(select.required).toBe(true);

      // Check for asterisk in label
      const label = el.shadowRoot?.querySelector(".mb-select__label");
      expect(label?.textContent).toContain("*");
    });

    it("applies name attribute", async () => {
      el.name = "category";
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;
      expect(select.name).toBe("category");
    });

    it("applies size attribute", async () => {
      el.size = "lg";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("lg");
    });

    it("shows placeholder when provided", async () => {
      el.placeholder = "Select an option";
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;
      const placeholderOption = select.querySelector(
        "option[disabled]"
      ) as HTMLOptionElement;

      expect(placeholderOption?.textContent?.trim()).toBe(
        "Select an option"
      );
      expect(placeholderOption?.value).toBe("");
      expect(placeholderOption?.disabled).toBe(true);
    });
  });

  describe("interactions", () => {
    it("emits mb-change event when native select changes", async () => {
      await el.updateComplete;

      let eventFired = false;
      el.addEventListener("mb-change", () => {
        eventFired = true;
      });

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;

      // Trigger change event on select
      select.dispatchEvent(new Event("change"));

      expect(eventFired).toBe(true);
    });

    it("reads value from native select on change", async () => {
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;

      // The component should read whatever value the select has
      // Even if empty, it should sync
      const initialValue = select.value;
      select.dispatchEvent(new Event("change"));

      expect(el.value).toBe(initialValue);
    });

    it("supports focus method", async () => {
      await el.updateComplete;

      el.focus();
      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;

      expect(document.activeElement?.shadowRoot?.activeElement).toBe(
        select
      );
    });

    it("supports blur method", async () => {
      await el.updateComplete;

      el.focus();
      el.blur();

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      ) as HTMLSelectElement;
      expect(
        document.activeElement?.shadowRoot?.activeElement
      ).not.toBe(select);
    });
  });

  describe("accessibility", () => {
    it("has aria-invalid when error is true", async () => {
      el.error = true;
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      );
      expect(select?.getAttribute("aria-invalid")).toBe("true");
    });

    it("has aria-describedby for helper text", async () => {
      el.helper = "Helper text";
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      );
      expect(select?.getAttribute("aria-describedby")).toBe("helper");
    });

    it("has aria-describedby for error message", async () => {
      el.error = true;
      el.errorMessage = "Error message";
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      );
      expect(select?.getAttribute("aria-describedby")).toBe("error");
    });

    it("exposes select part", async () => {
      await el.updateComplete;

      const selectContainer =
        el.shadowRoot?.querySelector(".mb-select");
      expect(selectContainer?.getAttribute("part")).toBe("select");
    });

    it("exposes native part", async () => {
      await el.updateComplete;

      const select = el.shadowRoot?.querySelector(
        ".mb-select__native"
      );
      expect(select?.getAttribute("part")).toBe("native");
    });

    it("exposes label part", async () => {
      el.label = "Label";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(".mb-select__label");
      expect(label?.getAttribute("part")).toBe("label");
    });

    it("exposes chevron part", async () => {
      await el.updateComplete;

      const chevron = el.shadowRoot?.querySelector(
        ".mb-select__chevron"
      );
      expect(chevron?.getAttribute("part")).toBe("chevron");
    });
  });

  describe("error state", () => {
    it("reflects error attribute on host", async () => {
      el.error = true;
      await el.updateComplete;

      expect(el.hasAttribute("error")).toBe(true);
    });
  });

  describe("size variants", () => {
    it("reflects size attribute on host", async () => {
      el.size = "sm";
      await el.updateComplete;

      expect(el.getAttribute("size")).toBe("sm");
    });
  });

  describe("slots", () => {
    it("supports default slot for options", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });
});
