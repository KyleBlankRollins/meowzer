import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbTextarea } from "./mb-textarea.js";

describe("MbTextarea", () => {
  let el: MbTextarea;

  beforeEach(() => {
    el = document.createElement("mb-textarea") as MbTextarea;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-textarea")).toBe(MbTextarea);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbTextarea);
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
      expect(el.rows).toBe(3);
      expect(el.showCounter).toBe(false);
      expect(el.resizable).toBe("true");
    });

    it("renders label when provided", async () => {
      el.label = "Description";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-textarea__label"
      );
      expect(label?.textContent?.trim()).toBe("Description");
    });

    it("shows required indicator when required", async () => {
      el.label = "Message";
      el.required = true;
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-textarea__label"
      );
      expect(
        label?.classList.contains("mb-textarea__label--required")
      ).toBe(true);
    });

    it("applies placeholder", async () => {
      el.placeholder = "Enter your message";
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      expect(textarea.placeholder).toBe("Enter your message");
    });

    it("applies value", async () => {
      el.value = "Hello world";
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      expect(textarea.value).toBe("Hello world");
    });

    it("applies rows", async () => {
      el.rows = 5;
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      expect(textarea.getAttribute("rows")).toBe("5");
    });

    it("shows helper text when provided", async () => {
      el.helper = "Maximum 500 characters";
      await el.updateComplete;

      const helper = el.shadowRoot?.querySelector(
        ".mb-textarea__helper"
      );
      expect(helper?.textContent?.trim()).toBe(
        "Maximum 500 characters"
      );
    });

    it("shows error message when error is true", async () => {
      el.error = true;
      el.errorMessage = "This field is required";
      await el.updateComplete;

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-textarea__error"
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
        ".mb-textarea__helper"
      );
      expect(helper).toBeFalsy();

      const errorMsg = el.shadowRoot?.querySelector(
        ".mb-textarea__error"
      );
      expect(errorMsg).toBeTruthy();
    });

    it("applies disabled state", async () => {
      el.disabled = true;
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      expect(textarea.disabled).toBe(true);
    });

    it("applies maxlength", async () => {
      el.maxlength = 100;
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      expect(textarea.maxLength).toBe(100);
    });

    it("shows character counter when showCounter is true", async () => {
      el.showCounter = true;
      el.maxlength = 100;
      el.value = "Hello";
      await el.updateComplete;

      const counter = el.shadowRoot?.querySelector(
        ".mb-textarea__counter"
      );
      expect(counter?.textContent?.trim()).toBe("5/100");
    });

    it("hides counter when showCounter is false", async () => {
      el.showCounter = false;
      el.maxlength = 100;
      await el.updateComplete;

      const counter = el.shadowRoot?.querySelector(
        ".mb-textarea__counter"
      );
      expect(counter).toBeFalsy();
    });

    it("reflects resizable attribute", async () => {
      el.resizable = "false";
      await el.updateComplete;

      expect(el.hasAttribute("resizable")).toBe(true);
      expect(el.getAttribute("resizable")).toBe("false");
    });
  });

  describe("interactions", () => {
    it("emits mb-input event on input", async () => {
      await el.updateComplete;

      let inputValue: string | undefined;
      el.addEventListener("mb-input", (e: Event) => {
        inputValue = (e as CustomEvent).detail.value;
      });

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      textarea.value = "test";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      expect(inputValue).toBe("test");
    });

    it("emits mb-change event on change", async () => {
      await el.updateComplete;

      let changeValue: string | undefined;
      el.addEventListener("mb-change", (e: Event) => {
        changeValue = (e as CustomEvent).detail.value;
      });

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      textarea.value = "test";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));

      expect(changeValue).toBe("test");
    });

    it("emits mb-focus event on focus", async () => {
      await el.updateComplete;

      let focused = false;
      el.addEventListener("mb-focus", () => {
        focused = true;
      });

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      textarea.dispatchEvent(
        new FocusEvent("focus", { bubbles: true })
      );

      expect(focused).toBe(true);
    });

    it("emits mb-blur event on blur", async () => {
      await el.updateComplete;

      let blurred = false;
      el.addEventListener("mb-blur", () => {
        blurred = true;
      });

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      textarea.dispatchEvent(
        new FocusEvent("blur", { bubbles: true })
      );

      expect(blurred).toBe(true);
    });

    it("updates value property on input", async () => {
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      ) as HTMLTextAreaElement;
      textarea.value = "new value";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      expect(el.value).toBe("new value");
    });
  });

  describe("methods", () => {
    it("focus() focuses the textarea", async () => {
      await el.updateComplete;

      el.focus();

      expect(document.activeElement).toBe(el);
    });
  });

  describe("character counter", () => {
    it("shows normal counter class by default", async () => {
      el.showCounter = true;
      el.maxlength = 100;
      el.value = "Hello";
      await el.updateComplete;

      const counter = el.shadowRoot?.querySelector(
        ".mb-textarea__counter"
      );
      expect(
        counter?.classList.contains("mb-textarea__counter--warning")
      ).toBe(false);
      expect(
        counter?.classList.contains("mb-textarea__counter--error")
      ).toBe(false);
    });

    it("shows warning class when approaching limit", async () => {
      el.showCounter = true;
      el.maxlength = 100;
      el.value = "x".repeat(95); // 5 chars remaining
      await el.updateComplete;

      const counter = el.shadowRoot?.querySelector(
        ".mb-textarea__counter"
      );
      expect(
        counter?.classList.contains("mb-textarea__counter--warning")
      ).toBe(true);
    });

    it("shows error class when at limit", async () => {
      el.showCounter = true;
      el.maxlength = 100;
      el.value = "x".repeat(100);
      await el.updateComplete;

      const counter = el.shadowRoot?.querySelector(
        ".mb-textarea__counter"
      );
      expect(
        counter?.classList.contains("mb-textarea__counter--error")
      ).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("has aria-label on textarea", async () => {
      el.label = "Description";
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      );
      expect(textarea?.getAttribute("aria-label")).toBe(
        "Description"
      );
    });

    it("has aria-invalid when error is true", async () => {
      el.error = true;
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      );
      expect(textarea?.getAttribute("aria-invalid")).toBe("true");
    });

    it("has aria-describedby for error message", async () => {
      el.error = true;
      el.errorMessage = "Error";
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      );
      expect(textarea?.getAttribute("aria-describedby")).toBe(
        "error-message"
      );
    });

    it("has aria-describedby for helper text", async () => {
      el.helper = "Helper";
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      );
      expect(textarea?.getAttribute("aria-describedby")).toBe(
        "helper-text"
      );
    });

    it("exposes textarea-container part", async () => {
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(".mb-textarea");
      expect(container?.getAttribute("part")).toBe(
        "textarea-container"
      );
    });

    it("exposes label part", async () => {
      el.label = "Test";
      await el.updateComplete;

      const label = el.shadowRoot?.querySelector(
        ".mb-textarea__label"
      );
      expect(label?.getAttribute("part")).toBe("label");
    });

    it("exposes textarea part", async () => {
      await el.updateComplete;

      const textarea = el.shadowRoot?.querySelector(
        ".mb-textarea__textarea"
      );
      expect(textarea?.getAttribute("part")).toBe("textarea");
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
