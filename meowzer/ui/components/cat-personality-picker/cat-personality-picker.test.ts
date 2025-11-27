import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CatPersonalityPicker } from "./cat-personality-picker.js";

describe("CatPersonalityPicker", () => {
  let el: CatPersonalityPicker;

  beforeEach(() => {
    el = document.createElement(
      "cat-personality-picker"
    ) as CatPersonalityPicker;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("cat-personality-picker")).toBe(
      CatPersonalityPicker
    );
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(CatPersonalityPicker);
  });

  describe("rendering", () => {
    it("renders preset buttons", async () => {
      await el.updateComplete;
      const buttons = el.shadowRoot?.querySelectorAll("mb-button");
      expect(buttons?.length).toBe(6); // 6 preset buttons
    });

    it("renders all preset options", async () => {
      await el.updateComplete;
      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );
      const buttonTexts = buttons.map((btn) =>
        btn.textContent?.trim()
      );

      expect(buttonTexts).toContain("Playful");
      expect(buttonTexts).toContain("Lazy");
      expect(buttonTexts).toContain("Curious");
      expect(buttonTexts).toContain("Aloof");
      expect(buttonTexts).toContain("Energetic");
      expect(buttonTexts).toContain("Balanced");
    });

    it("renders trait sliders", async () => {
      await el.updateComplete;
      const sliders = el.shadowRoot?.querySelectorAll("mb-slider");
      expect(sliders?.length).toBe(5); // 5 trait sliders
    });

    it("renders all trait sliders with correct labels", async () => {
      await el.updateComplete;
      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const labels = sliders.map((slider) =>
        slider.getAttribute("label")
      );

      expect(labels).toContain("Curiosity");
      expect(labels).toContain("Playfulness");
      expect(labels).toContain("Independence");
      expect(labels).toContain("Sociability");
      expect(labels).toContain("Energy");
    });
  });

  describe("personality property", () => {
    it("has default personality as empty object", () => {
      expect(el.personality).toEqual({});
    });

    it("reflects personality values in sliders", async () => {
      el.personality = { curiosity: 0.8, playfulness: 0.6 } as any;
      await el.updateComplete;

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );
      const playfulnessSlider = sliders.find(
        (s) => s.getAttribute("label") === "Playfulness"
      );

      expect(curiositySlider?.getAttribute("value")).toBe("0.8");
      expect(playfulnessSlider?.getAttribute("value")).toBe("0.6");
    });

    it("uses default value of 0.5 for undefined traits", async () => {
      await el.updateComplete;
      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );

      expect(curiositySlider?.getAttribute("value")).toBe("0.5");
    });
  });

  describe("preset selection", () => {
    it("highlights selected preset button", async () => {
      await el.updateComplete;
      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );
      const playfulButton = buttons.find(
        (btn) => btn.textContent?.trim() === "Playful"
      );

      playfulButton?.click();
      await el.updateComplete;

      expect(playfulButton?.getAttribute("variant")).toBe("primary");
    });

    it("non-selected preset buttons have tertiary variant", async () => {
      await el.updateComplete;
      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );
      const playfulButton = buttons.find(
        (btn) => btn.textContent?.trim() === "Playful"
      );
      const lazyButton = buttons.find(
        (btn) => btn.textContent?.trim() === "Lazy"
      );

      playfulButton?.click();
      await el.updateComplete;

      expect(lazyButton?.getAttribute("variant")).toBe("tertiary");
    });

    it("emits personality-change event when preset selected", async () => {
      await el.updateComplete;

      let eventDetail: any = null;
      el.addEventListener("personality-change", (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );
      const playfulButton = buttons.find(
        (btn) => btn.textContent?.trim() === "Playful"
      );

      playfulButton?.click();
      await el.updateComplete;

      expect(eventDetail).toBeTruthy();
      expect(eventDetail.preset).toBe("playful");
    });

    it("clears preset selection when trait is manually adjusted", async () => {
      await el.updateComplete;
      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );
      const playfulButton = buttons.find(
        (btn) => btn.textContent?.trim() === "Playful"
      );

      // Select preset
      playfulButton?.click();
      await el.updateComplete;

      expect(playfulButton?.getAttribute("variant")).toBe("primary");

      // Manually adjust a trait
      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );

      curiositySlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.7 },
          bubbles: true,
          composed: true,
        })
      );
      await el.updateComplete;

      // Preset should be cleared
      expect(playfulButton?.getAttribute("variant")).toBe("tertiary");
    });
  });

  describe("trait adjustment", () => {
    it("emits personality-change event when trait slider changes", async () => {
      await el.updateComplete;

      let eventDetail: any = null;
      el.addEventListener("personality-change", (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );

      curiositySlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.7 },
          bubbles: true,
          composed: true,
        })
      );

      await el.updateComplete;

      expect(eventDetail).toBeTruthy();
      expect(eventDetail.curiosity).toBe(0.7);
    });

    it("updates personality property when trait changes", async () => {
      await el.updateComplete;

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const playfulnessSlider = sliders.find(
        (s) => s.getAttribute("label") === "Playfulness"
      );

      playfulnessSlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.9 },
          bubbles: true,
          composed: true,
        })
      );

      await el.updateComplete;

      expect((el.personality as any).playfulness).toBe(0.9);
    });

    it("preserves other trait values when one trait changes", async () => {
      el.personality = { curiosity: 0.8, playfulness: 0.6 } as any;
      await el.updateComplete;

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const energySlider = sliders.find(
        (s) => s.getAttribute("label") === "Energy"
      );

      energySlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.4 },
          bubbles: true,
          composed: true,
        })
      );

      await el.updateComplete;

      expect((el.personality as any).curiosity).toBe(0.8);
      expect((el.personality as any).playfulness).toBe(0.6);
      expect((el.personality as any).energy).toBe(0.4);
    });
  });

  describe("slider configuration", () => {
    it("configures sliders with correct min/max/step", async () => {
      await el.updateComplete;

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );

      sliders.forEach((slider) => {
        expect(slider.getAttribute("min")).toBe("0");
        expect(slider.getAttribute("max")).toBe("1");
        expect(slider.getAttribute("step")).toBe("0.1");
      });
    });
  });

  describe("events", () => {
    it("personality-change event bubbles", async () => {
      await el.updateComplete;

      let eventBubbled = false;
      const listener = () => {
        eventBubbled = true;
      };
      document.addEventListener("personality-change", listener);

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );

      curiositySlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.7 },
          bubbles: true,
          composed: true,
        })
      );

      await el.updateComplete;

      expect(eventBubbled).toBe(true);
      document.removeEventListener("personality-change", listener);
    });

    it("personality-change event is composed", async () => {
      await el.updateComplete;

      let eventComposed = false;
      el.addEventListener("personality-change", (e: Event) => {
        eventComposed = (e as CustomEvent).composed;
      });

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );
      const curiositySlider = sliders.find(
        (s) => s.getAttribute("label") === "Curiosity"
      );

      curiositySlider?.dispatchEvent(
        new CustomEvent("mb-change", {
          detail: { value: 0.7 },
          bubbles: true,
          composed: true,
        })
      );

      await el.updateComplete;

      expect(eventComposed).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("sliders have labels", async () => {
      await el.updateComplete;

      const sliders = Array.from(
        el.shadowRoot?.querySelectorAll("mb-slider") || []
      );

      sliders.forEach((slider) => {
        expect(slider.hasAttribute("label")).toBe(true);
        expect(slider.getAttribute("label")).toBeTruthy();
      });
    });

    it("preset buttons have text content", async () => {
      await el.updateComplete;

      const buttons = Array.from(
        el.shadowRoot?.querySelectorAll("mb-button") || []
      );

      buttons.forEach((button) => {
        expect(button.textContent?.trim()).toBeTruthy();
      });
    });
  });
});
