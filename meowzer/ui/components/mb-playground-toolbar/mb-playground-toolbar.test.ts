import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-playground-toolbar.js";
import type { MbPlaygroundToolbar } from "./mb-playground-toolbar.js";

describe("mb-playground-toolbar", () => {
  let element: MbPlaygroundToolbar;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    element = document.createElement(
      "mb-playground-toolbar"
    ) as MbPlaygroundToolbar;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe("Component Registration", () => {
    it("should be registered as mb-playground-toolbar", () => {
      const toolbar = document.createElement("mb-playground-toolbar");
      expect(toolbar).toBeInstanceOf(HTMLElement);
    });

    it("should create element via constructor", () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe(
        "mb-playground-toolbar"
      );
    });
  });

  describe("Rendering", () => {
    it("should render toolbar container", async () => {
      await element.updateComplete;
      const toolbar = element.shadowRoot?.querySelector(".toolbar");
      expect(toolbar).toBeTruthy();
    });

    it("should have toolbar role", async () => {
      await element.updateComplete;
      const toolbar = element.shadowRoot?.querySelector(
        '[role="toolbar"]'
      );
      expect(toolbar).toBeTruthy();
    });

    it("should have accessible label", async () => {
      await element.updateComplete;
      const toolbar = element.shadowRoot?.querySelector(
        '[aria-label="Playground Controls"]'
      );
      expect(toolbar).toBeTruthy();
    });

    it("should render all 7 buttons", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      expect(buttons?.length).toBe(7);
    });

    it("should render 2 dividers", async () => {
      await element.updateComplete;
      const dividers =
        element.shadowRoot?.querySelectorAll(".divider");
      expect(dividers?.length).toBe(2);
    });
  });

  describe("Button Tooltips", () => {
    it("should have Create New Cat tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const createButton = buttons?.[0];
      expect(createButton?.getAttribute("title")).toBe(
        "Create New Cat"
      );
    });

    it("should have View Statistics tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const statsButton = buttons?.[1];
      expect(statsButton?.getAttribute("title")).toBe(
        "View Statistics"
      );
    });

    it("should have Place Basic Food tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const foodButton = buttons?.[2];
      expect(foodButton?.getAttribute("title")).toBe(
        "Place Basic Food"
      );
    });

    it("should have Place Fancy Food tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const fancyButton = buttons?.[3];
      expect(fancyButton?.getAttribute("title")).toBe(
        "Place Fancy Food"
      );
    });

    it("should have Place Water tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const waterButton = buttons?.[4];
      expect(waterButton?.getAttribute("title")).toBe("Place Water");
    });

    it("should have Activate Laser Pointer tooltip when inactive", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const laserButton = buttons?.[5];
      expect(laserButton?.getAttribute("title")).toBe(
        "Activate Laser Pointer"
      );
    });

    it("should have Place Yarn Ball tooltip", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const yarnButton = buttons?.[6];
      expect(yarnButton?.getAttribute("title")).toBe(
        "Place Yarn Ball"
      );
    });
  });

  describe("Button Variants", () => {
    it("should render create button as primary variant", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const createButton = buttons?.[0];
      expect(createButton?.getAttribute("variant")).toBe("primary");
    });

    it("should render other buttons as tertiary variant", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      for (let i = 1; i < (buttons?.length || 0); i++) {
        expect(buttons?.[i].getAttribute("variant")).toBe("tertiary");
      }
    });

    it("should render all buttons as large size", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      buttons?.forEach((button) => {
        expect(button.getAttribute("size")).toBe("lg");
      });
    });
  });

  describe("SVG Icons", () => {
    it("should render create cat icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[0].querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("width")).toBe("16");
    });

    it("should render statistics icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[1].querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 16 16");
    });

    it("should render basic food icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[2].querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
    });

    it("should render fancy food icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[3].querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should render water icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[4].querySelector("svg");
      expect(svg).toBeTruthy();
    });

    it("should render laser icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[5].querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("viewBox")).toBe("0 0 64 64");
    });

    it("should render yarn icon", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const svg = buttons?.[6].querySelector("svg");
      expect(svg).toBeTruthy();
    });
  });

  describe("Event Emissions", () => {
    it("should emit create-cat event when create button clicked", async () => {
      await element.updateComplete;
      let eventFired = false;
      element.addEventListener("create-cat", () => {
        eventFired = true;
      });

      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const createButton = buttons?.[0] as HTMLElement;
      createButton?.click();

      expect(eventFired).toBe(true);
    });

    it("should emit view-stats event when stats button clicked", async () => {
      await element.updateComplete;
      let eventFired = false;
      element.addEventListener("view-stats", () => {
        eventFired = true;
      });

      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const statsButton = buttons?.[1] as HTMLElement;
      statsButton?.click();

      expect(eventFired).toBe(true);
    });

    it("should emit create-cat with bubbles and composed", async () => {
      await element.updateComplete;
      let eventDetails: any = null;
      element.addEventListener("create-cat", (e) => {
        eventDetails = {
          bubbles: e.bubbles,
          composed: e.composed,
        };
      });

      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const createButton = buttons?.[0] as HTMLElement;
      createButton?.click();

      expect(eventDetails?.bubbles).toBe(true);
      expect(eventDetails?.composed).toBe(true);
    });

    it("should emit view-stats with bubbles and composed", async () => {
      await element.updateComplete;
      let eventDetails: any = null;
      element.addEventListener("view-stats", (e) => {
        eventDetails = {
          bubbles: e.bubbles,
          composed: e.composed,
        };
      });

      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      const statsButton = buttons?.[1] as HTMLElement;
      statsButton?.click();

      expect(eventDetails?.bubbles).toBe(true);
      expect(eventDetails?.composed).toBe(true);
    });
  });

  describe("Lifecycle", () => {
    it("should connect to DOM", async () => {
      const toolbar = document.createElement(
        "mb-playground-toolbar"
      ) as MbPlaygroundToolbar;
      container.appendChild(toolbar);
      await toolbar.updateComplete;

      const toolbarElement =
        toolbar.shadowRoot?.querySelector(".toolbar");
      expect(toolbarElement).toBeTruthy();

      toolbar.remove();
    });

    it("should disconnect from DOM", () => {
      const toolbar = document.createElement(
        "mb-playground-toolbar"
      ) as MbPlaygroundToolbar;
      container.appendChild(toolbar);
      toolbar.remove();

      expect(toolbar.isConnected).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should have toolbar role for keyboard navigation", async () => {
      await element.updateComplete;
      const toolbar = element.shadowRoot?.querySelector(
        '[role="toolbar"]'
      );
      expect(toolbar).toBeTruthy();
    });

    it("should have aria-label for screen readers", async () => {
      await element.updateComplete;
      const toolbar = element.shadowRoot?.querySelector(".toolbar");
      expect(toolbar?.getAttribute("aria-label")).toBe(
        "Playground Controls"
      );
    });

    it("should have title attributes on all buttons", async () => {
      await element.updateComplete;
      const buttons =
        element.shadowRoot?.querySelectorAll("mb-button");
      buttons?.forEach((button) => {
        expect(button.getAttribute("title")).toBeTruthy();
      });
    });
  });
});
