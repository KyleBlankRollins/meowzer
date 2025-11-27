import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbTextInput } from "./mb-text-input.js";

describe("MbTextInput", () => {
  let el: MbTextInput;

  beforeEach(() => {
    el = document.createElement("mb-text-input") as MbTextInput;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-text-input")).toBe(MbTextInput);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbTextInput);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.label).toBe("");
      expect(el.value).toBe("");
      expect(el.placeholder).toBe("");
      expect(el.helper).toBe("");
      expect(el.errorMessage).toBe("");
      expect(el.error).toBe(false);
      expect(el.required).toBe(false);
      expect(el.disabled).toBe(false);
      expect(el.type).toBe("text");
    });

    it("renders label when provided", async () => {
      el.label = "Username";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-text-input__label"
      );
      expect(label?.textContent?.trim()).toBe("Username");
    });

    it("shows required indicator when required", async () => {
      el.label = "Email";
      el.required = true;
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-text-input__label"
      );
      expect(
        label?.classList.contains("mb-text-input__label--required")
      ).toBe(true);
    });

    it("applies placeholder", async () => {
      el.placeholder = "Enter your name";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      expect(input.placeholder).toBe("Enter your name");
    });

    it("applies value", async () => {
      el.value = "John Doe";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      expect(input.value).toBe("John Doe");
    });

    it("shows helper text when provided", async () => {
      el.helper = "Enter a valid email address";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-text-input__helper"
      );
      expect(helper?.textContent?.trim()).toBe(
        "Enter a valid email address"
      );
    });

    it("shows error message when error is true", async () => {
      el.error = true;
      el.errorMessage = "This field is required";
      await el.updateComplete;

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-text-input__error"
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
        ".mb-text-input__helper"
      );
      expect(helper).toBeFalsy();

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-text-input__error"
      );
      expect(errorMsg).toBeTruthy();
    });

    it("applies disabled state", async () => {
      el.disabled = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("applies input type", async () => {
      el.type = "email";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      expect(input.type).toBe("email");
    });

    it("applies maxlength", async () => {
      el.maxlength = 50;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      expect(input.maxLength).toBe(50);
    });
  });

  describe("interactions", () => {
    it("emits mb-input event on input", async () => {
      await el.updateComplete;

      let inputValue: string | undefined;
      el.addEventListener("mb-input", (e: Event) => {
        inputValue = (e as CustomEvent).detail.value;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      input.value = "test";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(inputValue).toBe("test");
    });

    it("emits mb-change event on change", async () => {
      await el.updateComplete;

      let changeValue: string | undefined;
      el.addEventListener("mb-change", (e: Event) => {
        changeValue = (e as CustomEvent).detail.value;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      input.value = "test";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));

      expect(changeValue).toBe("test");
    });

    it("emits mb-focus event on focus", async () => {
      await el.updateComplete;

      let focused = false;
      el.addEventListener("mb-focus", () => {
        focused = true;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));

      expect(focused).toBe(true);
    });

    it("emits mb-blur event on blur", async () => {
      await el.updateComplete;

      let blurred = false;
      el.addEventListener("mb-blur", () => {
        blurred = true;
      });

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));

      expect(blurred).toBe(true);
    });

    it("updates value property on input", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      ) as HTMLInputElement;
      input.value = "new value";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      expect(el.value).toBe("new value");
    });
  });

  describe("methods", () => {
    it("focus() focuses the input", async () => {
      await el.updateComplete;

      el.focus();

      expect(document.activeElement).toBe(el);
    });
  });

  describe("accessibility", () => {
    it("has aria-label on input", async () => {
      el.label = "Username";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      );
      expect(input?.getAttribute("aria-label")).toBe("Username");
    });

    it("has aria-invalid when error is true", async () => {
      el.error = true;
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      );
      expect(input?.getAttribute("aria-invalid")).toBe("true");
    });

    it("has aria-describedby for error message", async () => {
      el.error = true;
      el.errorMessage = "Error";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      );
      expect(input?.getAttribute("aria-describedby")).toBe(
        "error-message"
      );
    });

    it("has aria-describedby for helper text", async () => {
      el.helper = "Helper";
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      );
      expect(input?.getAttribute("aria-describedby")).toBe(
        "helper-text"
      );
    });

    it("exposes input-container part", async () => {
      await el.updateComplete;

      const container =
        el.shadowRoot?.querySelector(".mb-text-input");
      expect(container?.getAttribute("part")).toBe("input-container");
    });

    it("exposes label part", async () => {
      el.label = "Test";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-text-input__label"
      );
      expect(label?.getAttribute("part")).toBe("label");
    });

    it("exposes input part", async () => {
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector(
        ".mb-text-input__input"
      );
      expect(input?.getAttribute("part")).toBe("input");
    });
  });

  describe("error state", () => {
    it("reflects error attribute on host", async () => {
      el.error = true;
      await el.updateComplete;

      expect(el.hasAttribute("error")).toBe(true);
    });
  });
});
