import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MbAccordion } from "./mb-accordion.js";
import { MbAccordionItem } from "./mb-accordion-item.js";

describe("MbAccordion", () => {
  let el: MbAccordion;

  beforeEach(() => {
    el = document.createElement("mb-accordion") as MbAccordion;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  const waitForUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 10));

  describe("Basic rendering", () => {
    it("should create element", () => {
      expect(el).toBeInstanceOf(MbAccordion);
    });

    it("should render slot", async () => {
      await waitForUpdate();
      const slot = el.shadowRoot!.querySelector("slot");
      expect(slot).toBeTruthy();
    });

    it("should have role=group", async () => {
      await waitForUpdate();
      const base = el.shadowRoot!.querySelector(".mb-accordion");
      expect(base?.getAttribute("role")).toBe("group");
    });
  });

  describe("CSS parts", () => {
    it("should expose base part", async () => {
      await waitForUpdate();
      const base = el.shadowRoot!.querySelector("[part~='base']");
      expect(base).toBeTruthy();
    });
  });
});

describe("MbAccordionItem", () => {
  let el: MbAccordionItem;

  beforeEach(() => {
    el = document.createElement(
      "mb-accordion-item"
    ) as MbAccordionItem;
    el.innerHTML = "<p>Content goes here</p>";
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  const waitForUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 10));

  describe("Basic rendering", () => {
    it("should create element", () => {
      expect(el).toBeInstanceOf(MbAccordionItem);
    });

    it("should have default title", () => {
      expect(el.title).toBe("");
    });

    it("should not be open by default", () => {
      expect(el.open).toBe(false);
    });

    it("should not be disabled by default", () => {
      expect(el.disabled).toBe(false);
    });

    it("should render header button", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      );
      expect(button).toBeTruthy();
    });

    it("should render content area", async () => {
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-accordion-item__content"
      );
      expect(content).toBeTruthy();
    });

    it("should render chevron icon", async () => {
      await waitForUpdate();
      const icon = el.shadowRoot!.querySelector(
        ".mb-accordion-item__icon svg"
      );
      expect(icon).toBeTruthy();
    });
  });

  describe("Properties", () => {
    it("should set title property", async () => {
      el.title = "Section Title";
      await waitForUpdate();
      expect(el.title).toBe("Section Title");
    });

    it("should display title in header", async () => {
      el.title = "Section Title";
      await waitForUpdate();
      const title = el.shadowRoot!.querySelector(
        ".mb-accordion-item__title"
      );
      expect(title?.textContent).toContain("Section Title");
    });

    it("should set open property", async () => {
      el.open = true;
      await waitForUpdate();
      expect(el.open).toBe(true);
    });

    it("should reflect open attribute", async () => {
      el.open = true;
      await waitForUpdate();
      expect(el.hasAttribute("open")).toBe(true);
    });

    it("should set disabled property", async () => {
      el.disabled = true;
      await waitForUpdate();
      expect(el.disabled).toBe(true);
    });

    it("should disable button when disabled", async () => {
      el.disabled = true;
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe("Click interaction", () => {
    it("should toggle open on click", async () => {
      await waitForUpdate();
      expect(el.open).toBe(false);

      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;
      button.click();
      await waitForUpdate();

      expect(el.open).toBe(true);
    });

    it("should toggle closed on click when open", async () => {
      el.open = true;
      await waitForUpdate();

      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;
      button.click();
      await waitForUpdate();

      expect(el.open).toBe(false);
    });

    it("should emit mb-toggle event on toggle", async () => {
      await waitForUpdate();
      let eventFired = false;
      let eventDetail: any;

      el.addEventListener("mb-toggle", (e: Event) => {
        eventFired = true;
        eventDetail = (e as CustomEvent).detail;
      });

      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;
      button.click();
      await waitForUpdate();

      expect(eventFired).toBe(true);
      expect(eventDetail.open).toBe(true);
    });

    it("should not toggle when disabled", async () => {
      el.disabled = true;
      await waitForUpdate();

      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;
      button.click();
      await waitForUpdate();

      expect(el.open).toBe(false);
    });
  });

  describe("Keyboard interaction", () => {
    it("should toggle on Enter key", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;

      button.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );
      await waitForUpdate();

      expect(el.open).toBe(true);
    });

    it("should toggle on Space key", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;

      button.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true })
      );
      await waitForUpdate();

      expect(el.open).toBe(true);
    });

    it("should not toggle on other keys", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      ) as HTMLButtonElement;

      button.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true })
      );
      await waitForUpdate();

      expect(el.open).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should have aria-expanded=false when closed", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      );
      expect(button?.getAttribute("aria-expanded")).toBe("false");
    });

    it("should have aria-expanded=true when open", async () => {
      el.open = true;
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      );
      expect(button?.getAttribute("aria-expanded")).toBe("true");
    });

    it("should have aria-controls", async () => {
      await waitForUpdate();
      const button = el.shadowRoot!.querySelector(
        ".mb-accordion-item__header"
      );
      expect(button?.getAttribute("aria-controls")).toBe("content");
    });

    it("should have role=region on content", async () => {
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-accordion-item__content"
      );
      expect(content?.getAttribute("role")).toBe("region");
    });

    it("should have aria-hidden=true when closed", async () => {
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-accordion-item__content"
      );
      expect(content?.getAttribute("aria-hidden")).toBe("true");
    });

    it("should have aria-hidden=false when open", async () => {
      el.open = true;
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        ".mb-accordion-item__content"
      );
      expect(content?.getAttribute("aria-hidden")).toBe("false");
    });
  });

  describe("CSS parts", () => {
    it("should expose base part", async () => {
      await waitForUpdate();
      const base = el.shadowRoot!.querySelector("[part~='base']");
      expect(base).toBeTruthy();
    });

    it("should expose header part", async () => {
      await waitForUpdate();
      const header = el.shadowRoot!.querySelector("[part~='header']");
      expect(header).toBeTruthy();
    });

    it("should expose title part", async () => {
      await waitForUpdate();
      const title = el.shadowRoot!.querySelector("[part~='title']");
      expect(title).toBeTruthy();
    });

    it("should expose icon part", async () => {
      await waitForUpdate();
      const icon = el.shadowRoot!.querySelector("[part~='icon']");
      expect(icon).toBeTruthy();
    });

    it("should expose content part", async () => {
      await waitForUpdate();
      const content = el.shadowRoot!.querySelector(
        "[part~='content']"
      );
      expect(content).toBeTruthy();
    });
  });

  describe("Slots", () => {
    it("should render default slot", async () => {
      await waitForUpdate();
      const slot = el.shadowRoot!.querySelector("slot:not([name])");
      expect(slot).toBeTruthy();
    });

    it("should render title slot", async () => {
      await waitForUpdate();
      const slot = el.shadowRoot!.querySelector("slot[name='title']");
      expect(slot).toBeTruthy();
    });
  });
});
