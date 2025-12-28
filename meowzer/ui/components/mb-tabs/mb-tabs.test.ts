import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { MbTabs } from "./mb-tabs.js";

describe("MbTabs", () => {
  let el: MbTabs;

  beforeEach(() => {
    el = document.createElement("mb-tabs") as MbTabs;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-tabs")).toBe(MbTabs);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbTabs);
  });

  describe("rendering", () => {
    it("renders with default properties", () => {
      expect(el.tabs).toEqual([]);
      expect(el.activeIndex).toBe(0);
      expect(el.disabled).toBe(false);
      expect(el.size).toBe("md");
    });

    it("renders tabs from array", async () => {
      el.tabs = ["Tab 1", "Tab 2", "Tab 3"];
      await el.updateComplete;

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      expect(tabs?.length).toBe(3);
      expect(tabs?.[0].textContent?.trim()).toBe("Tab 1");
      expect(tabs?.[1].textContent?.trim()).toBe("Tab 2");
      expect(tabs?.[2].textContent?.trim()).toBe("Tab 3");
    });

    it("marks active tab correctly", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      el.activeIndex = 1;
      await el.updateComplete;

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      expect(
        tabs?.[0].classList.contains("mb-tabs__tab--active")
      ).toBe(false);
      expect(
        tabs?.[1].classList.contains("mb-tabs__tab--active")
      ).toBe(true);
    });

    it("applies size classes correctly", async () => {
      el.tabs = ["Tab"];
      el.size = "lg";
      await el.updateComplete;

      const tab = el.shadowRoot?.querySelector(".mb-tabs__tab");
      expect(tab?.classList.contains("mb-tabs__tab--lg")).toBe(true);
    });
  });

  describe("interactions", () => {
    it("dispatches tab-change event on click", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      await el.updateComplete;

      const listener = vi.fn();
      el.addEventListener("tab-change", listener);

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      (tabs?.[1] as HTMLElement)?.click();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toEqual({
        index: 1,
        label: "Tab 2",
      });
    });

    it("does not dispatch event when clicking active tab", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      el.activeIndex = 0;
      await el.updateComplete;

      const listener = vi.fn();
      el.addEventListener("tab-change", listener);

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      (tabs?.[0] as HTMLElement)?.click();

      expect(listener).not.toHaveBeenCalled();
    });

    it("does not dispatch event when disabled", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      el.disabled = true;
      await el.updateComplete;

      const listener = vi.fn();
      el.addEventListener("tab-change", listener);

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      (tabs?.[1] as HTMLElement)?.click();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has correct ARIA attributes", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      el.activeIndex = 0;
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector(".mb-tabs");
      expect(container?.getAttribute("role")).toBe("tablist");

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      expect(tabs?.[0].getAttribute("role")).toBe("tab");
      expect(tabs?.[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs?.[1].getAttribute("aria-selected")).toBe("false");
    });

    it("manages tabindex correctly", async () => {
      el.tabs = ["Tab 1", "Tab 2"];
      el.activeIndex = 1;
      await el.updateComplete;

      const tabs = el.shadowRoot?.querySelectorAll(".mb-tabs__tab");
      expect(tabs?.[0].getAttribute("tabindex")).toBe("-1");
      expect(tabs?.[1].getAttribute("tabindex")).toBe("0");
    });
  });
});
