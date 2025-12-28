import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { MbShareCatModal } from "./mb-share-cat-modal.js";
import type { MeowzerCat } from "meowzer";

describe("MbShareCatModal", () => {
  let el: MbShareCatModal;
  let mockCat: Partial<MeowzerCat>;

  beforeEach(() => {
    el = document.createElement(
      "mb-share-cat-modal"
    ) as MbShareCatModal;

    mockCat = {
      id: "cat-123",
      seed: "tabby-FF9500-00FF00-m-short-v1",
      name: "Test Cat",
      description: "A test cat for testing",
      spriteData: {
        svg: "<svg></svg>",
        width: 100,
        height: 100,
      },
    } as Partial<MeowzerCat>;

    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-share-cat-modal")).toBe(
      MbShareCatModal
    );
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbShareCatModal);
  });

  describe("rendering", () => {
    it("renders nothing when cat is not provided", async () => {
      await el.updateComplete;
      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal).toBeNull();
    });

    it("renders modal when cat is provided", async () => {
      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const modal = el.shadowRoot?.querySelector("mb-modal");
      expect(modal).toBeTruthy();
    });

    it("displays cat name", async () => {
      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const name = el.shadowRoot?.querySelector(".cat-name");
      expect(name?.textContent).toBe("Test Cat");
    });

    it("displays unnamed cat when name is missing", async () => {
      el.cat = { ...mockCat, name: undefined } as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const name = el.shadowRoot?.querySelector(".cat-name");
      expect(name?.textContent).toBe("Unnamed Cat");
    });

    it("displays cat description", async () => {
      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const description = el.shadowRoot?.querySelector(
        ".cat-description"
      );
      expect(description?.textContent).toBe("A test cat for testing");
    });

    it("displays seed value", async () => {
      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const seed = el.shadowRoot?.querySelector(".seed-value");
      expect(seed?.textContent).toBe(
        "tabby-FF9500-00FF00-m-short-v1"
      );
    });
  });

  describe("copy functionality", () => {
    it("copies seed to clipboard", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const copyButton = el.shadowRoot?.querySelector(
        'mb-button[variant="primary"]'
      );
      (copyButton as HTMLElement)?.click();

      await el.updateComplete;

      expect(writeTextMock).toHaveBeenCalledWith(
        "tabby-FF9500-00FF00-m-short-v1"
      );
    });

    it("shows copied state after copy", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const copyButton = el.shadowRoot?.querySelector(
        'mb-button[variant="primary"]'
      ) as HTMLElement;

      expect(copyButton?.textContent?.trim()).toBe("Copy Seed");

      copyButton?.click();
      await el.updateComplete;

      expect(copyButton?.textContent?.trim()).toBe("✓ Copied!");
    });
  });

  describe("events", () => {
    it("dispatches close event", async () => {
      el.cat = mockCat as MeowzerCat;
      el.open = true;
      await el.updateComplete;

      const listener = vi.fn();
      el.addEventListener("close", listener);

      const closeButton = el.shadowRoot?.querySelector(
        'mb-button[variant="secondary"]'
      ) as HTMLElement;
      closeButton?.click();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
