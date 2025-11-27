import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbCheckbox } from "./mb-checkbox.js";

describe("MbCheckbox", () => {
  let el: MbCheckbox;

  beforeEach(() => {
    el = document.createElement("mb-checkbox") as MbCheckbox;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-checkbox")).toBe(MbCheckbox);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbCheckbox);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.checked).toBe(false);
      expect(el.indeterminate).toBe(false);
      expect(el.disabled).toBe(false);
      expect(el.helper).toBe("");
      expect(el.errorMessage).toBe("");
      expect(el.error).toBe(false);
      expect(el.required).toBe(false);
    });

    it("applies checked state", async () => {
      el.checked = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.checked).toBe(true);
    });

    it("applies indeterminate state", async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.indeterminate).toBe(true);
    });

    it("applies disabled state", async () => {
      el.disabled = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);

      const checkbox = el.shadowRoot?.querySelector(".mb-checkbox");
      expect(
        checkbox?.classList.contains("mb-checkbox--disabled")
      ).toBe(true);
    });

    it("shows helper text when provided", async () => {
      el.helper = "Check this option";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-checkbox__helper"
      );
      expect(helper?.textContent?.trim()).toBe("Check this option");
    });

    it("shows error message when error is true", async () => {
      el.error = true;
      el.errorMessage = "This field is required";
      await el.updateComplete;

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-checkbox__error"
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
        ".mb-checkbox__helper"
      );
      expect(helper).toBeFalsy();

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-checkbox__error"
      );
      expect(errorMsg).toBeTruthy();
    });

    it("applies name attribute", async () => {
      el.name = "subscribe";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.name).toBe("subscribe");
    });

    it("applies value attribute", async () => {
      el.value = "yes";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.value).toBe("yes");
    });

    it("applies required attribute", async () => {
      el.required = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      expect(input.required).toBe(true);
    });
  });

  describe("interactions", () => {
    it("emits mb-change event when checked", async () => {
      await el.updateComplete;

      let changeDetail: any;
      el.addEventListener("mb-change", (e: Event) => {
        changeDetail = (e as CustomEvent).detail;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      input.click();

      expect(changeDetail.checked).toBe(true);
    });

    it("emits mb-change event when unchecked", async () => {
      el.checked = true;
      await el.updateComplete;

      let changeDetail: any;
      el.addEventListener("mb-change", (e: Event) => {
        changeDetail = (e as CustomEvent).detail;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      input.click();

      expect(changeDetail.checked).toBe(false);
    });

    it("includes value in change event", async () => {
      el.value = "option1";
      await el.updateComplete;

      let changeDetail: any;
      el.addEventListener("mb-change", (e: Event) => {
        changeDetail = (e as CustomEvent).detail;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      input.click();

      expect(changeDetail.value).toBe("option1");
    });

    it("clears indeterminate state on user interaction", async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      input.click();

      expect(el.indeterminate).toBe(false);
    });

    it("updates checked property on change", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      ) as HTMLInputElement;
      input.click();

      expect(el.checked).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("has aria-checked when checked", async () => {
      el.checked = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      );
      expect(input?.getAttribute("aria-checked")).toBe("true");
    });

    it("has aria-checked=false when unchecked", async () => {
      el.checked = false;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      );
      expect(input?.getAttribute("aria-checked")).toBe("false");
    });

    it("has aria-checked=mixed when indeterminate", async () => {
      el.indeterminate = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      );
      expect(input?.getAttribute("aria-checked")).toBe("mixed");
    });

    it("has aria-invalid when error is true", async () => {
      el.error = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      );
      expect(input?.getAttribute("aria-invalid")).toBe("true");
    });

    it("exposes checkbox part", async () => {
      await el.updateComplete;

      const checkbox = el.shadowRoot?.querySelector(".mb-checkbox");
      expect(checkbox?.getAttribute("part")).toBe("checkbox");
    });

    it("exposes input part", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-checkbox__input"
      );
      expect(input?.getAttribute("part")).toBe("input");
    });

    it("exposes box part", async () => {
      await el.updateComplete;

      const box = el.shadowRoot?.querySelector(".mb-checkbox__box");
      expect(box?.getAttribute("part")).toBe("box");
    });

    it("exposes label part", async () => {
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-checkbox__label"
      );
      expect(label?.getAttribute("part")).toBe("label");
    });
  });

  describe("error state", () => {
    it("reflects error attribute on host", async () => {
      el.error = true;
      await el.updateComplete;

      expect(el.hasAttribute("error")).toBe(true);
    });
  });

  describe("slots", () => {
    it("supports default slot for label", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });
});
