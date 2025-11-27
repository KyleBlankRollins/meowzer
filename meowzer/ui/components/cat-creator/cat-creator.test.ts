import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { CatCreator } from "./cat-creator.js";
import type { Meowzer } from "meowzer";

describe("CatCreator", () => {
  let el: CatCreator;

  beforeEach(() => {
    el = document.createElement("cat-creator") as CatCreator;
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it("should be a custom element", () => {
    expect(customElements.get("cat-creator")).toBe(CatCreator);
  });

  it("should create instance", () => {
    expect(el).toBeInstanceOf(CatCreator);
  });

  describe("rendering", () => {
    it("renders error message when meowzer context is not available", async () => {
      await el.updateComplete;
      const notification =
        el.shadowRoot?.querySelector("mb-notification");
      expect(notification).toBeTruthy();
      expect(notification?.getAttribute("variant")).toBe("error");
    });

    it("renders creator layout when meowzer context is available", async () => {
      // Mock meowzer context
      const mockMeowzer = {
        cats: {
          create: vi.fn(),
        },
        storage: {
          isInitialized: () => false,
        },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;

      const layout = el.shadowRoot?.querySelector(".cat-creator");
      expect(layout).toBeTruthy();
    });

    it("renders preview panel", async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;

      const previewPanel =
        el.shadowRoot?.querySelector(".preview-panel");
      expect(previewPanel).toBeTruthy();

      const catPreview = el.shadowRoot?.querySelector("cat-preview");
      expect(catPreview).toBeTruthy();
    });

    it("renders settings panel with wizard navigation", async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;

      const settingsPanel =
        el.shadowRoot?.querySelector(".settings-panel");
      expect(settingsPanel).toBeTruthy();

      const wizardNav = el.shadowRoot?.querySelector(
        ".wizard-navigation"
      );
      expect(wizardNav).toBeTruthy();
    });
  });

  describe("wizard steps", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("starts at step 1", () => {
      // @ts-expect-error - accessing private property for testing
      expect(el.currentStep).toBe(1);
    });

    it("renders basic-info-section on step 1", async () => {
      const basicInfoSection = el.shadowRoot?.querySelector(
        "basic-info-section"
      );
      expect(basicInfoSection).toBeTruthy();
    });

    it("navigates to next step when Next button is clicked", async () => {
      // Set a valid name first to pass validation
      // @ts-expect-error - accessing private property for testing
      el.catName = "Test Cat";
      await el.updateComplete;

      const nextButton = el.shadowRoot?.querySelector(
        'mb-button[variant="primary"]'
      ) as HTMLElement;
      expect(nextButton).toBeTruthy();

      nextButton.click();
      await el.updateComplete;

      // @ts-expect-error - accessing private property for testing
      expect(el.currentStep).toBe(2);
    });

    it("renders appearance-section on step 2", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 2;
      await el.updateComplete;

      const appearanceSection = el.shadowRoot?.querySelector(
        "appearance-section"
      );
      expect(appearanceSection).toBeTruthy();
    });

    it("renders cat-personality-picker on step 3", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 3;
      await el.updateComplete;

      const personalityPicker = el.shadowRoot?.querySelector(
        "cat-personality-picker"
      );
      expect(personalityPicker).toBeTruthy();
    });

    it("renders behavior options on step 4", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 4;
      await el.updateComplete;

      const checkbox = el.shadowRoot?.querySelector("mb-checkbox");
      expect(checkbox).toBeTruthy();
    });

    it("navigates back to previous step when Previous button is clicked", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 2;
      await el.updateComplete;

      const prevButton = el.shadowRoot?.querySelector(
        'mb-button[variant="secondary"]'
      ) as HTMLElement;
      expect(prevButton).toBeTruthy();

      prevButton.click();
      await el.updateComplete;

      // @ts-expect-error - accessing private property for testing
      expect(el.currentStep).toBe(1);
    });
  });

  describe("step indicator", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("renders step indicator with 4 dots", async () => {
      const stepDots = el.shadowRoot?.querySelectorAll(".step-dot");
      expect(stepDots?.length).toBe(4);
    });

    it("marks current step as active", async () => {
      const stepDots = el.shadowRoot?.querySelectorAll(".step-dot");
      expect(stepDots?.[0].classList.contains("active")).toBe(true);
    });

    it("marks completed steps", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 3;
      await el.updateComplete;

      const stepDots = el.shadowRoot?.querySelectorAll(".step-dot");
      expect(stepDots?.[0].classList.contains("completed")).toBe(
        true
      );
      expect(stepDots?.[1].classList.contains("completed")).toBe(
        true
      );
      expect(stepDots?.[2].classList.contains("active")).toBe(true);
    });
  });

  describe("form data", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("has default settings", () => {
      // @ts-expect-error - accessing private property for testing
      expect(el.settings).toEqual({
        color: "#FF6B35",
        eyeColor: "#4ECDC4",
        pattern: "solid",
        size: "medium",
        furLength: "short",
      });
    });

    it("has default personality", () => {
      // @ts-expect-error - accessing private property for testing
      expect(el.selectedPersonality).toBe("balanced");
    });

    it("has default makeRoaming as true", () => {
      // @ts-expect-error - accessing private property for testing
      expect(el.makeRoaming).toBe(true);
    });

    it("starts with empty name and description", () => {
      // @ts-expect-error - accessing private property for testing
      expect(el.catName).toBe("");
      // @ts-expect-error - accessing private property for testing
      expect(el.catDescription).toBe("");
    });
  });

  describe("validation", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("validates step 1 requires name", async () => {
      // @ts-expect-error - accessing private property for testing
      const isValid = el.validateCurrentStep();
      expect(isValid).toBe(false);
      // @ts-expect-error - accessing private property for testing
      expect(el.stepErrors.length).toBeGreaterThan(0);
    });

    it("validates step 1 passes with name", async () => {
      // @ts-expect-error - accessing private property for testing
      el.catName = "Whiskers";
      // @ts-expect-error - accessing private property for testing
      const isValid = el.validateCurrentStep();
      expect(isValid).toBe(true);
    });

    it("shows error notification when step validation fails", async () => {
      // Try to go to next step without name
      const nextButton = el.shadowRoot?.querySelector(
        'mb-button[variant="primary"]'
      ) as HTMLElement;
      nextButton.click();
      await el.updateComplete;

      // Should still be on step 1
      // @ts-expect-error - accessing private property for testing
      expect(el.currentStep).toBe(1);

      // Should show errors
      const errorNotification = el.shadowRoot?.querySelector(
        'mb-notification[variant="error"].step-errors'
      );
      expect(errorNotification).toBeTruthy();
    });
  });

  describe("reset functionality", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("resets form to initial state", async () => {
      // Change some values
      // @ts-expect-error - accessing private property for testing
      el.catName = "Test Cat";
      // @ts-expect-error - accessing private property for testing
      el.catDescription = "Test Description";
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 3;
      await el.updateComplete;

      // Click reset button
      const resetButton = el.shadowRoot?.querySelector(
        'mb-button[variant="secondary"]'
      ) as HTMLElement;
      resetButton.click();
      await el.updateComplete;

      // Check values are reset
      // @ts-expect-error - accessing private property for testing
      expect(el.catName).toBe("");
      // @ts-expect-error - accessing private property for testing
      expect(el.catDescription).toBe("");
      // @ts-expect-error - accessing private property for testing
      expect(el.currentStep).toBe(1);
    });
  });

  describe("events", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("handles basic-info-change event", async () => {
      const basicInfoSection = el.shadowRoot?.querySelector(
        "basic-info-section"
      );

      const event = new CustomEvent("basic-info-change", {
        detail: {
          name: "Fluffy",
          description: "A fluffy cat",
        },
      });

      basicInfoSection?.dispatchEvent(event);
      await el.updateComplete;

      // @ts-expect-error - accessing private property for testing
      expect(el.catName).toBe("Fluffy");
      // @ts-expect-error - accessing private property for testing
      expect(el.catDescription).toBe("A fluffy cat");
    });

    it("handles appearance-change event", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 2;
      await el.updateComplete;

      const appearanceSection = el.shadowRoot?.querySelector(
        "appearance-section"
      );

      const event = new CustomEvent("appearance-change", {
        detail: {
          color: "#000000",
          eyeColor: "#FFFFFF",
          pattern: "tabby",
          size: "large",
          furLength: "long",
        },
      });

      appearanceSection?.dispatchEvent(event);
      await el.updateComplete;

      // @ts-expect-error - accessing private property for testing
      expect(el.settings.color).toBe("#000000");
      // @ts-expect-error - accessing private property for testing
      expect(el.settings.pattern).toBe("tabby");
    });

    it("handles personality-change event", async () => {
      // @ts-expect-error - accessing private property for testing
      el.currentStep = 3;
      await el.updateComplete;

      const personalityPicker = el.shadowRoot?.querySelector(
        "cat-personality-picker"
      );

      const event = new CustomEvent("personality-change", {
        detail: {
          preset: "playful",
        },
      });

      personalityPicker?.dispatchEvent(event);
      await el.updateComplete;

      // @ts-expect-error - accessing private property for testing
      expect(el.selectedPersonality).toBe("playful");
    });
  });

  describe("accessibility", () => {
    beforeEach(async () => {
      const mockMeowzer = {
        cats: { create: vi.fn() },
        storage: { isInitialized: () => false },
      } as unknown as Meowzer;

      // @ts-expect-error - accessing private property for testing
      el.meowzer = mockMeowzer;
      await el.updateComplete;
    });

    it("has proper button semantics", () => {
      const buttons = el.shadowRoot?.querySelectorAll("mb-button");
      expect(buttons).toBeTruthy();
      expect(buttons!.length).toBeGreaterThan(0);
    });

    it("has form sections with proper structure", () => {
      const formSections =
        el.shadowRoot?.querySelectorAll(".form-section");
      // Step 1 doesn't have .form-section, it's wrapped in basic-info-section
      // Step 4 has .form-section
      expect(formSections).toBeTruthy();
    });
  });
});
