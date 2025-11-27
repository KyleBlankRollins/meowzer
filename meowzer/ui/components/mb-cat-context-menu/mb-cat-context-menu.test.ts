import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./mb-cat-context-menu";
import type { MbCatContextMenu } from "./mb-cat-context-menu";

describe("MbCatContextMenu", () => {
  let el: MbCatContextMenu;

  beforeEach(() => {
    el = document.createElement(
      "mb-cat-context-menu"
    ) as MbCatContextMenu;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("mb-cat-context-menu")).toBeDefined();
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(HTMLElement);
  });

  describe("properties", () => {
    it("has cat property", () => {
      expect("cat" in el).toBe(true);
    });

    it("has open property", () => {
      expect("open" in el).toBe(true);
    });

    it("has left property", () => {
      expect("left" in el).toBe(true);
    });

    it("has top property", () => {
      expect("top" in el).toBe(true);
    });

    it("defaults to closed", () => {
      expect(el.open).toBe(false);
    });

    it("defaults left to 0", () => {
      expect(el.left).toBe(0);
    });

    it("defaults top to 0", () => {
      expect(el.top).toBe(0);
    });
  });

  describe("rendering", () => {
    it("renders empty when closed", async () => {
      el.open = false;
      await el.updateComplete;
      const content = el.shadowRoot?.querySelector(
        ".context-menu-content"
      );
      expect(content).toBeFalsy();
    });

    it("renders empty when no cat", async () => {
      el.open = true;
      el.cat = undefined;
      await el.updateComplete;
      const content = el.shadowRoot?.querySelector(
        ".context-menu-content"
      );
      expect(content).toBeFalsy();
    });

    it("renders menu content when open with cat", async () => {
      el.open = true;
      el.cat = {} as any; // Mock cat
      await el.updateComplete;
      const content = el.shadowRoot?.querySelector(
        ".context-menu-content"
      );
      expect(content).toBeTruthy();
    });

    it("renders rename button", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(".menu-item");
      const renameButton = Array.from(buttons || []).find((btn) =>
        btn.textContent?.trim().includes("Rename")
      );
      expect(renameButton).toBeTruthy();
    });

    it("renders change hat button", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(".menu-item");
      const changeHatButton = Array.from(buttons || []).find((btn) =>
        btn.textContent?.trim().includes("Change Hat")
      );
      expect(changeHatButton).toBeTruthy();
    });

    it("renders remove button", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(".menu-item");
      const removeButton = Array.from(buttons || []).find((btn) =>
        btn.textContent?.trim().includes("Remove")
      );
      expect(removeButton).toBeTruthy();
    });

    it("renders separator", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const separator = el.shadowRoot?.querySelector("hr");
      expect(separator).toBeTruthy();
    });
  });

  describe("menu items", () => {
    it("renders 3 menu items", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(".menu-item");
      expect(buttons?.length).toBe(3);
    });

    it("rename and change hat are normal items", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const normalButtons = el.shadowRoot?.querySelectorAll(
        ".menu-item.normal"
      );
      expect(normalButtons?.length).toBe(2);
    });

    it("remove is destructive item", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const destructiveButtons = el.shadowRoot?.querySelectorAll(
        ".menu-item.destructive"
      );
      expect(destructiveButtons?.length).toBe(1);
    });
  });

  describe("positioning", () => {
    it("sets left position", async () => {
      el.open = true;
      el.cat = {} as any;
      el.left = 100;
      await el.updateComplete;
      expect(el.style.left).toBe("100px");
    });

    it("sets top position", async () => {
      el.open = true;
      el.cat = {} as any;
      el.top = 200;
      await el.updateComplete;
      expect(el.style.top).toBe("200px");
    });

    it("updates position when left changes", async () => {
      el.open = true;
      el.cat = {} as any;
      el.left = 100;
      await el.updateComplete;
      expect(el.style.left).toBe("100px");

      el.left = 150;
      await el.updateComplete;
      expect(el.style.left).toBe("150px");
    });

    it("updates position when top changes", async () => {
      el.open = true;
      el.cat = {} as any;
      el.top = 100;
      await el.updateComplete;
      expect(el.style.top).toBe("100px");

      el.top = 150;
      await el.updateComplete;
      expect(el.style.top).toBe("150px");
    });
  });

  describe("open attribute", () => {
    it("reflects open property to attribute", async () => {
      el.open = false;
      await el.updateComplete;
      expect(el.hasAttribute("open")).toBe(false);

      el.open = true;
      await el.updateComplete;
      expect(el.hasAttribute("open")).toBe(true);
    });
  });

  describe("lifecycle", () => {
    it("connects without errors", async () => {
      await el.updateComplete;
      expect(el.isConnected).toBe(true);
    });

    it("can be disconnected", () => {
      const connected = el.isConnected;
      expect(connected).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("uses semantic button elements", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(
        "button.menu-item"
      );
      expect(buttons?.length).toBeGreaterThan(0);
    });

    it("buttons have text content", async () => {
      el.open = true;
      el.cat = {} as any;
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll(
        "button.menu-item"
      );
      buttons?.forEach((button) => {
        expect(button.textContent?.trim()).toBeTruthy();
      });
    });
  });
});
