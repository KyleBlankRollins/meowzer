import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbTooltip } from "./mb-tooltip.js";

describe("MbTooltip", () => {
  let el: MbTooltip;

  beforeEach(() => {
    el = document.createElement("mb-tooltip") as MbTooltip;
    el.innerHTML = "<button>Hover me</button>";
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  const waitForUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 10));

  describe("Basic rendering", () => {
    it("should create element", () => {
      expect(el).toBeInstanceOf(MbTooltip);
    });

    it("should have default text", () => {
      expect(el.text).toBe("");
    });

    it("should have default position", () => {
      expect(el.position).toBe("top");
    });

    it("should have default delay", () => {
      expect(el.delay).toBe(200);
    });

    it("should not be disabled by default", () => {
      expect(el.disabled).toBe(false);
    });

    it("should render trigger slot", async () => {
      await waitForUpdate();
      const trigger = el.shadowRoot!.querySelector(".mb-tooltip");
      expect(trigger).toBeTruthy();
    });

    it("should render tooltip content", async () => {
      el.text = "Test tooltip";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content).toBeTruthy();
    });

    it("should hide tooltip by default", async () => {
      el.text = "Test tooltip";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(true);
    });
  });

  describe("Properties", () => {
    it("should set text property", async () => {
      el.text = "Helpful hint";
      await waitForUpdate();
      expect(el.text).toBe("Helpful hint");
    });

    it("should display text in tooltip", async () => {
      el.text = "Helpful hint";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.textContent).toContain("Helpful hint");
    });

    it("should set position property", async () => {
      el.position = "bottom";
      await waitForUpdate();
      expect(el.position).toBe("bottom");
    });

    it("should apply position to tooltip", async () => {
      el.text = "Test";
      el.position = "bottom";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("data-position")).toBe("bottom");
    });

    it("should set delay property", async () => {
      el.delay = 500;
      await waitForUpdate();
      expect(el.delay).toBe(500);
    });

    it("should set disabled property", async () => {
      el.disabled = true;
      await waitForUpdate();
      expect(el.disabled).toBe(true);
    });
  });

  describe("Positions", () => {
    it("should support top position", async () => {
      el.text = "Test";
      el.position = "top";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("data-position")).toBe("top");
    });

    it("should support bottom position", async () => {
      el.text = "Test";
      el.position = "bottom";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("data-position")).toBe("bottom");
    });

    it("should support left position", async () => {
      el.text = "Test";
      el.position = "left";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("data-position")).toBe("left");
    });

    it("should support right position", async () => {
      el.text = "Test";
      el.position = "right";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("data-position")).toBe("right");
    });
  });

  describe("Hover interaction", () => {
    it("should show tooltip on mouse enter after delay", async () => {
      el.text = "Test tooltip";
      el.delay = 50;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(false);
    });

    it("should hide tooltip on mouse leave", async () => {
      el.text = "Test tooltip";
      el.delay = 0;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      trigger.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: true })
      );
      await waitForUpdate();

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(true);
    });

    it("should not show tooltip when disabled", async () => {
      el.text = "Test tooltip";
      el.disabled = true;
      el.delay = 0;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(true);
    });

    it("should not show tooltip when text is empty", async () => {
      el.text = "";
      el.delay = 0;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(true);
    });
  });

  describe("Focus interaction", () => {
    it("should show tooltip on focus", async () => {
      el.text = "Test tooltip";
      el.delay = 50;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new FocusEvent("focus", { bubbles: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(false);
    });

    it("should hide tooltip on blur", async () => {
      el.text = "Test tooltip";
      el.delay = 0;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new FocusEvent("focus", { bubbles: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      trigger.dispatchEvent(
        new FocusEvent("blur", { bubbles: true })
      );
      await waitForUpdate();

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.hasAttribute("hidden")).toBe(true);
    });
  });

  describe("Arrow", () => {
    it("should render arrow", async () => {
      el.text = "Test";
      await waitForUpdate();
      const arrow = el.shadowRoot!.querySelector(
        ".mb-tooltip__arrow"
      );
      expect(arrow).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have role=tooltip", async () => {
      el.text = "Test";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("role")).toBe("tooltip");
    });

    it("should have aria-hidden=true when hidden", async () => {
      el.text = "Test";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("aria-hidden")).toBe("true");
    });

    it("should have aria-hidden=false when visible", async () => {
      el.text = "Test tooltip";
      el.delay = 0;
      await waitForUpdate();

      const trigger = el.shadowRoot!.querySelector(
        ".mb-tooltip"
      ) as HTMLElement;
      trigger.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true })
      );
      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = el.shadowRoot!.querySelector(
        ".mb-tooltip__content"
      );
      expect(content?.getAttribute("aria-hidden")).toBe("false");
    });
  });

  describe("CSS parts", () => {
    it("should expose trigger part", async () => {
      await waitForUpdate();
      const trigger = el.shadowRoot!.querySelector(
        "[part~='trigger']"
      );
      expect(trigger).toBeTruthy();
    });

    it("should expose content part", async () => {
      el.text = "Test";
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        "[part~='content']"
      );
      expect(content).toBeTruthy();
    });

    it("should expose arrow part", async () => {
      el.text = "Test";
      await waitForUpdate();
      const arrow = el.shadowRoot!.querySelector("[part~='arrow']");
      expect(arrow).toBeTruthy();
    });
  });

  describe("Slotted content", () => {
    it("should render slotted content", async () => {
      await waitForUpdate();
      const slot = el.shadowRoot!.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });
});
