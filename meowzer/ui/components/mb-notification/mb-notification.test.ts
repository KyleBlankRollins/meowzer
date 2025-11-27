import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { MbNotification } from "./mb-notification.js";

describe("MbNotification", () => {
  let el: MbNotification;

  beforeEach(() => {
    el = document.createElement("mb-notification") as MbNotification;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-notification")).toBe(
      MbNotification
    );
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(MbNotification);
  });

  describe("properties", () => {
    it("renders with default properties", () => {
      expect(el.variant).toBe("info");
      expect(el.title).toBe("");
      expect(el.subtitle).toBe("");
      expect(el.hideCloseButton).toBe(false);
      expect(el.lowContrast).toBe(false);
      expect(el.toast).toBe(false);
      expect(el.position).toBe("top-right");
      expect(el.timeout).toBe(0);
    });

    it("renders info variant", async () => {
      el.variant = "info";
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification--info"
      );
      expect(notification).toBeTruthy();
    });

    it("renders success variant", async () => {
      el.variant = "success";
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification--success"
      );
      expect(notification).toBeTruthy();
    });

    it("renders warning variant", async () => {
      el.variant = "warning";
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification--warning"
      );
      expect(notification).toBeTruthy();
    });

    it("renders error variant", async () => {
      el.variant = "error";
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification--error"
      );
      expect(notification).toBeTruthy();
    });

    it("shows title when provided", async () => {
      el.title = "Test Title";
      await el.updateComplete;

      const title = el.shadowRoot?.querySelector(
        ".mb-notification__title"
      );
      expect(title?.textContent?.trim()).toBe("Test Title");
    });

    it("shows subtitle when provided", async () => {
      el.subtitle = "Test Subtitle";
      await el.updateComplete;

      const subtitle = el.shadowRoot?.querySelector(
        ".mb-notification__subtitle"
      );
      expect(subtitle?.textContent?.trim()).toBe("Test Subtitle");
    });

    it("shows close button by default", async () => {
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      );
      expect(closeButton).toBeTruthy();
    });

    it("hides close button when hideCloseButton is true", async () => {
      el.hideCloseButton = true;
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      );
      expect(closeButton).toBeFalsy();
    });

    it("reflects variant attribute", async () => {
      el.variant = "error";
      await el.updateComplete;

      expect(el.getAttribute("variant")).toBe("error");
    });

    it("reflects low-contrast attribute", async () => {
      el.lowContrast = true;
      await el.updateComplete;

      expect(el.hasAttribute("low-contrast")).toBe(true);
    });

    it("reflects toast attribute", async () => {
      el.toast = true;
      await el.updateComplete;

      expect(el.hasAttribute("toast")).toBe(true);
    });

    it("reflects position attribute", async () => {
      el.position = "bottom-left";
      await el.updateComplete;

      expect(el.getAttribute("position")).toBe("bottom-left");
    });
  });

  describe("interactions", () => {
    it("emits mb-close event when close button clicked", async () => {
      await el.updateComplete;

      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      ) as HTMLButtonElement;
      closeButton.click();

      expect(closeFired).toBe(true);
    });

    it("calls close method when close button clicked", async () => {
      await el.updateComplete;

      const closeSpy = vi.spyOn(el, "close");

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      ) as HTMLButtonElement;
      closeButton.click();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("auto-dismiss", () => {
    it("auto-dismisses after timeout", async () => {
      // Create element with timeout before adding to DOM
      const testEl = document.createElement(
        "mb-notification"
      ) as MbNotification;
      testEl.timeout = 100;

      let closeFired = false;
      testEl.addEventListener("mb-close", () => {
        closeFired = true;
      });

      // Add to DOM to trigger connectedCallback
      document.body.appendChild(testEl);
      await testEl.updateComplete;

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(closeFired).toBe(true);

      // Cleanup
      document.body.removeChild(testEl);
    });

    it("does not auto-dismiss when timeout is 0", async () => {
      let closeFired = false;
      el.addEventListener("mb-close", () => {
        closeFired = true;
      });

      // Wait to ensure no auto-dismiss
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(closeFired).toBe(false);
    });

    it("clears timeout on disconnect", async () => {
      // Create element with timeout
      const testEl = document.createElement(
        "mb-notification"
      ) as MbNotification;
      testEl.timeout = 1000;
      document.body.appendChild(testEl);
      await testEl.updateComplete;

      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

      // Remove element to trigger disconnectedCallback
      document.body.removeChild(testEl);

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has role=alert", async () => {
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification"
      );
      expect(notification?.getAttribute("role")).toBe("alert");
    });

    it("close button has aria-label", async () => {
      await el.updateComplete;

      const closeButton = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      );
      expect(closeButton?.getAttribute("aria-label")).toBe(
        "Close notification"
      );
    });

    it("exposes notification part", async () => {
      await el.updateComplete;

      const notification = el.shadowRoot?.querySelector(
        ".mb-notification"
      );
      expect(notification?.getAttribute("part")).toBe("notification");
    });

    it("exposes icon part", async () => {
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector(
        ".mb-notification__icon"
      );
      expect(icon?.getAttribute("part")).toBe("icon");
    });

    it("exposes content part", async () => {
      await el.updateComplete;

      const content = el.shadowRoot?.querySelector(
        ".mb-notification__content"
      );
      expect(content?.getAttribute("part")).toBe("content");
    });

    it("exposes title part", async () => {
      el.title = "Test";
      await el.updateComplete;

      const title = el.shadowRoot?.querySelector(
        ".mb-notification__title"
      );
      expect(title?.getAttribute("part")).toBe("title");
    });

    it("exposes subtitle part", async () => {
      el.subtitle = "Test";
      await el.updateComplete;

      const subtitle = el.shadowRoot?.querySelector(
        ".mb-notification__subtitle"
      );
      expect(subtitle?.getAttribute("part")).toBe("subtitle");
    });

    it("exposes close part", async () => {
      await el.updateComplete;

      const close = el.shadowRoot?.querySelector(
        ".mb-notification__close"
      );
      expect(close?.getAttribute("part")).toBe("close");
    });
  });

  describe("icons", () => {
    it("renders info icon", async () => {
      el.variant = "info";
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector(
        ".mb-notification__icon svg"
      );
      expect(icon).toBeTruthy();
    });

    it("renders success icon", async () => {
      el.variant = "success";
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector(
        ".mb-notification__icon svg"
      );
      expect(icon).toBeTruthy();
    });

    it("renders warning icon", async () => {
      el.variant = "warning";
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector(
        ".mb-notification__icon svg"
      );
      expect(icon).toBeTruthy();
    });

    it("renders error icon", async () => {
      el.variant = "error";
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector(
        ".mb-notification__icon svg"
      );
      expect(icon).toBeTruthy();
    });
  });

  describe("slots", () => {
    it("supports default slot", async () => {
      await el.updateComplete;

      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeTruthy();
    });
  });
});
