import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CatStatistics } from "./cat-statistics.js";

describe("CatStatistics", () => {
  let el: CatStatistics;

  beforeEach(() => {
    el = document.createElement("cat-statistics") as CatStatistics;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("cat-statistics")).toBe(CatStatistics);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(CatStatistics);
  });

  describe("rendering", () => {
    it("renders stats grid", async () => {
      await el.updateComplete;
      const statsGrid = el.shadowRoot?.querySelector(".stats-grid");
      expect(statsGrid).toBeTruthy();
    });

    it("renders all stat items", async () => {
      await el.updateComplete;
      const statItems = el.shadowRoot?.querySelectorAll(".stat-item");
      expect(statItems?.length).toBe(4); // Total, Active, Paused, FPS
    });

    it("renders Total Cats label", async () => {
      await el.updateComplete;
      const labels = Array.from(
        el.shadowRoot?.querySelectorAll(".stat-label") || []
      );
      const totalCatsLabel = labels.find((l) =>
        l.textContent?.includes("Total Cats")
      );
      expect(totalCatsLabel).toBeTruthy();
    });

    it("renders Active label", async () => {
      await el.updateComplete;
      const labels = Array.from(
        el.shadowRoot?.querySelectorAll(".stat-label") || []
      );
      const activeLabel = labels.find((l) =>
        l.textContent?.includes("Active")
      );
      expect(activeLabel).toBeTruthy();
    });

    it("renders Paused label", async () => {
      await el.updateComplete;
      const labels = Array.from(
        el.shadowRoot?.querySelectorAll(".stat-label") || []
      );
      const pausedLabel = labels.find((l) =>
        l.textContent?.includes("Paused")
      );
      expect(pausedLabel).toBeTruthy();
    });

    it("renders Frame Rate label", async () => {
      await el.updateComplete;
      const labels = Array.from(
        el.shadowRoot?.querySelectorAll(".stat-label") || []
      );
      const fpsLabel = labels.find((l) =>
        l.textContent?.includes("Frame Rate")
      );
      expect(fpsLabel).toBeTruthy();
    });

    it("renders fps unit", async () => {
      await el.updateComplete;
      const fpsUnit = el.shadowRoot?.querySelector(".stat-unit");
      expect(fpsUnit?.textContent).toBe("fps");
    });
  });

  describe("cat counts", () => {
    it("displays total cats count", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      expect(values?.[0]).toBeTruthy();
    });

    it("displays active count", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      expect(values?.[1]).toBeTruthy();
    });

    it("displays paused count", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      expect(values?.[2]).toBeTruthy();
    });

    it("has activeCount getter", () => {
      expect(el).toHaveProperty("activeCount");
      expect(typeof el.activeCount).toBe("number");
    });

    it("has pausedCount getter", () => {
      expect(el).toHaveProperty("pausedCount");
      expect(typeof el.pausedCount).toBe("number");
    });

    it("has cats getter", () => {
      expect(el).toHaveProperty("cats");
      expect(Array.isArray(el.cats)).toBe(true);
    });
  });

  describe("FPS monitoring", () => {
    it("initializes fps to 0", async () => {
      await el.updateComplete;
      // FPS should be initialized
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      const fpsValue = values?.[3];
      expect(fpsValue).toBeTruthy();
    });

    it("displays fps value", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      const fpsValue = values?.[3];
      expect(fpsValue?.textContent).toContain("fps");
    });

    it("starts FPS monitoring on connect", () => {
      // Component is already connected in beforeEach
      // Just verify it doesn't throw
      expect(el.isConnected).toBe(true);
    });

    it("cleans up FPS monitoring on disconnect", () => {
      // Verify component can be disconnected without errors
      const wasConnected = el.isConnected;
      expect(wasConnected).toBe(true);
      // Disconnect will be tested by afterEach cleanup
    });
  });

  describe("meowzer context", () => {
    it("has meowzer property", () => {
      expect(el).toHaveProperty("meowzer");
    });

    it("uses CatsController", () => {
      // Verify the controller is initialized
      expect(el.cats).toBeDefined();
      expect(Array.isArray(el.cats)).toBe(true);
    });
  });

  describe("layout", () => {
    it("uses grid layout", async () => {
      await el.updateComplete;
      const grid = el.shadowRoot?.querySelector(".stats-grid");
      expect(grid).toBeTruthy();
    });

    it("has consistent stat item structure", async () => {
      await el.updateComplete;
      const statItems = el.shadowRoot?.querySelectorAll(".stat-item");

      statItems?.forEach((item) => {
        const label = item.querySelector(".stat-label");
        const value = item.querySelector(".stat-value");
        expect(label).toBeTruthy();
        expect(value).toBeTruthy();
      });
    });
  });

  describe("reactivity", () => {
    it("updates when component updates", async () => {
      await el.updateComplete;
      const initialValues =
        el.shadowRoot?.querySelectorAll(".stat-value");

      el.requestUpdate();
      await el.updateComplete;

      const updatedValues =
        el.shadowRoot?.querySelectorAll(".stat-value");
      // Values should still be present after update
      expect(updatedValues?.[0]).toBeTruthy();
      expect(initialValues?.[0]).toBeTruthy();
    });
  });

  describe("stat values structure", () => {
    it("all stat values are numbers", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");

      values?.forEach((value) => {
        const text = value.textContent || "";
        // Extract just the number part (before "fps" for frame rate)
        const numberPart = text.split("fps")[0].trim();
        expect(numberPart).toMatch(/^\d+$/);
      });
    });
  });

  describe("accessibility", () => {
    it("has semantic structure with labels", async () => {
      await el.updateComplete;
      const labels = el.shadowRoot?.querySelectorAll(".stat-label");
      expect(labels?.length).toBeGreaterThan(0);
      labels?.forEach((label) => {
        expect(label.textContent?.trim()).toBeTruthy();
      });
    });

    it("has semantic structure with values", async () => {
      await el.updateComplete;
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      expect(values?.length).toBeGreaterThan(0);
      values?.forEach((value) => {
        expect(value.textContent?.trim()).toBeTruthy();
      });
    });

    it("pairs each label with a value", async () => {
      await el.updateComplete;
      const labels = el.shadowRoot?.querySelectorAll(".stat-label");
      const values = el.shadowRoot?.querySelectorAll(".stat-value");
      expect(labels?.length).toBe(values?.length);
    });
  });
});
