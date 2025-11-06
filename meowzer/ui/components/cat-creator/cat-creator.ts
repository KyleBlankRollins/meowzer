/**
 * CatCreator - Main component for creating new cats
 *
 * Orchestrates the cat creation flow with appearance customization,
 * personality selection, and live preview.
 *
 * Uses composition pattern with:
 * - cat-preview (enhanced with ProtoCat support)
 * - cat-personality-picker
 * - appearance-section (internal partial)
 * - basic-info-section (internal partial)
 *
 * @example
 * ```html
 * <meowzer-provider>
 *   <cat-creator></cat-creator>
 * </meowzer-provider>
 * ```
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { catCreatorStyles } from "./cat-creator.style.js";
import type {
  Meowzer,
  CatSettings,
  PersonalityPreset,
} from "meowzer";

// Import child components
import "../cat-preview/cat-preview.js";
import "../cat-personality-picker/cat-personality-picker.js";
import "./partials/appearance-section.js";
import "./partials/basic-info-section.js";

// Import shared utilities
import { validateCatForm } from "../../shared/validation/cat-validation.js";

@customElement("cat-creator")
export class CatCreator extends LitElement {
  static styles = [catCreatorStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state() private catName = "";
  @state() private catDescription = "";
  @state() private settings: CatSettings = {
    color: "#FF6B35",
    eyeColor: "#4ECDC4",
    pattern: "solid",
    size: "medium",
    furLength: "short",
  };
  @state() private selectedPersonality: PersonalityPreset =
    "balanced";
  @state() private makeRoaming = true;
  @state() private creating = false;
  @state() private message = "";
  @state() private currentStep = 1;
  @state() private stepErrors: string[] = [];

  /**
   * Validate the current step
   */
  private validateCurrentStep(): boolean {
    this.stepErrors = [];

    switch (this.currentStep) {
      case 1: // Basic Info
        if (!this.catName.trim()) {
          this.stepErrors.push("Name is required");
        }
        const nameValidation = validateCatForm({
          name: this.catName,
          description: this.catDescription,
        });
        if (!nameValidation.valid) {
          this.stepErrors.push(...nameValidation.errors);
        }
        break;

      case 2: // Appearance & Size
        // Settings are always valid due to defaults
        break;

      case 3: // Personality
        if (!this.selectedPersonality) {
          this.stepErrors.push("Please select a personality");
        }
        break;

      case 4: // Behavior
        // Behavior options are optional
        break;
    }

    return this.stepErrors.length === 0;
  }

  /**
   * Navigate to next step
   */
  private nextStep() {
    if (this.validateCurrentStep() && this.currentStep < 4) {
      this.currentStep++;
      this.stepErrors = [];
    }
  }

  /**
   * Navigate to previous step
   */
  private previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.stepErrors = [];
    }
  }

  /**
   * Handle basic info changes from basic-info-section
   */
  private handleBasicInfoChange(e: CustomEvent) {
    this.catName = e.detail.name;
    this.catDescription = e.detail.description;
  }

  /**
   * Handle appearance changes from appearance-section
   */
  private handleAppearanceChange(e: CustomEvent) {
    this.settings = e.detail;
  }

  /**
   * Handle personality changes from cat-personality-picker
   */
  private handlePersonalityChange(e: CustomEvent) {
    if (e.detail.preset) {
      this.selectedPersonality = e.detail.preset;
    }
  }

  /**
   * Handle roaming checkbox change
   */
  private handleRoamingChange(e: CustomEvent) {
    this.makeRoaming = (e.target as any).checked;
  }

  /**
   * Create the cat
   */
  private async handleCreate() {
    if (!this.meowzer) {
      this.message = "Meowzer SDK not available";
      return;
    }

    // Validate form
    const validation = validateCatForm({
      name: this.catName,
      description: this.catDescription,
    });

    if (!validation.valid) {
      this.message = validation.errors.join(", ");
      return;
    }

    this.creating = true;
    this.message = "";

    try {
      const cat = await this.meowzer.cats.create({
        name: this.catName || undefined,
        description: this.catDescription || undefined,
        settings: this.settings,
      });

      // Set personality
      cat.setPersonality(this.selectedPersonality);

      // Save cat to storage
      if (this.meowzer.storage.isInitialized()) {
        console.log("Saving cat to storage:", cat.name, cat.id);
        await this.meowzer.storage.saveCat(cat);
        console.log("Cat saved successfully");
      } else {
        console.warn(
          "Storage not initialized, cat will not be persisted"
        );
      }

      // Spawn roaming cat if requested
      if (this.makeRoaming) {
        cat.element.style.position = "fixed";
        document.body.appendChild(cat.element);
        cat.resume();
      }

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent("cat-created", {
          detail: { cat },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form (this will close the dialog via parent component)
      this.reset();
    } catch (error) {
      console.error("Failed to create cat:", error);
      this.message = `Error creating cat: ${error}`;
      this.dispatchEvent(
        new CustomEvent("cat-creation-error", {
          detail: { error },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      this.creating = false;
    }
  }

  /**
   * Reset the form
   */
  private reset() {
    this.catName = "";
    this.catDescription = "";
    this.settings = {
      color: "#FF6B35",
      eyeColor: "#4ECDC4",
      pattern: "solid",
      size: "medium",
      furLength: "short",
    };
    this.selectedPersonality = "balanced";
    this.makeRoaming = true;
    this.message = "";
    this.currentStep = 1;
    this.stepErrors = [];
  }

  /**
   * Render step indicator dots
   */
  private renderStepIndicator() {
    const steps = [1, 2, 3, 4];

    return html`
      <div class="step-indicator">
        ${steps.map((step) => {
          const isActive = step === this.currentStep;
          const isCompleted = step < this.currentStep;
          const classes = isActive
            ? "active"
            : isCompleted
            ? "completed"
            : "";

          return html` <div class="step-dot ${classes}"></div> `;
        })}
      </div>
    `;
  }

  /**
   * Render wizard navigation buttons
   */
  private renderWizardNavigation() {
    const isLastStep = this.currentStep === 4;
    const isFirstStep = this.currentStep === 1;

    return html`
      <div class="wizard-navigation">
        <div class="nav-group">
          ${!isFirstStep
            ? html`
                <quiet-button
                  @click=${this.previousStep}
                  appearance="outline"
                >
                  Previous
                </quiet-button>
              `
            : html`<span></span>`}
        </div>

        <!-- Step Indicator in the middle -->
        ${this.renderStepIndicator()}

        <div class="nav-group">
          ${!isLastStep
            ? html`
                <quiet-button
                  @click=${this.nextStep}
                  variant="primary"
                >
                  Next
                </quiet-button>
              `
            : html`
                <quiet-button
                  @click=${this.handleCreate}
                  variant="primary"
                  ?disabled=${this.creating}
                >
                  ${this.creating ? "Creating..." : "Create Cat"}
                </quiet-button>
              `}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.meowzer) {
      return html`
        <quiet-callout variant="destructive">
          <strong>No Meowzer SDK</strong>
          <p>
            Please wrap this component in a
            <code>&lt;meowzer-provider&gt;</code>.
          </p>
        </quiet-callout>
      `;
    }

    return html`
      <div class="cat-creator">
        ${this.message
          ? html`<quiet-callout variant="primary" class="message">
              ${this.message}
            </quiet-callout>`
          : ""}

        <div class="creator-layout">
          <!-- Preview Panel -->
          <div class="preview-panel">
            <cat-preview
              .settings=${this.settings}
              autoBuild
            ></cat-preview>
            <div class="preview-actions">
              <quiet-button
                @click=${this.reset}
                appearance="outline"
                size="sm"
              >
                Reset
              </quiet-button>
            </div>
          </div>

          <!-- Wizard Panel -->
          <div class="settings-panel">
            <!-- Step Errors -->
            ${this.stepErrors.length > 0
              ? html`
                  <quiet-callout
                    variant="destructive"
                    class="step-errors"
                  >
                    <strong>Please fix the following:</strong>
                    <ul>
                      ${this.stepErrors.map(
                        (error) => html`<li>${error}</li>`
                      )}
                    </ul>
                  </quiet-callout>
                `
              : ""}

            <div class="creator-form">
              <!-- Step 1: Basic Info -->
              ${this.currentStep === 1
                ? html`
                    <basic-info-section
                      .name=${this.catName}
                      .description=${this.catDescription}
                      @basic-info-change=${this.handleBasicInfoChange}
                    ></basic-info-section>
                  `
                : ""}

              <!-- Step 2: Appearance & Size -->
              ${this.currentStep === 2
                ? html`
                    <appearance-section
                      .settings=${this.settings}
                      @appearance-change=${this
                        .handleAppearanceChange}
                    ></appearance-section>
                  `
                : ""}

              <!-- Step 3: Personality -->
              ${this.currentStep === 3
                ? html`
                    <cat-personality-picker
                      @personality-change=${this
                        .handlePersonalityChange}
                    ></cat-personality-picker>
                  `
                : ""}

              <!-- Step 4: Behavior Options -->
              ${this.currentStep === 4
                ? html`
                    <div class="form-section">
                      <h4>Behavior Options</h4>
                      <quiet-checkbox
                        .checked=${this.makeRoaming}
                        @quiet-change=${this.handleRoamingChange}
                      >
                        Make cat roam the viewport
                      </quiet-checkbox>
                    </div>
                  `
                : ""}
            </div>

            <!-- Wizard Navigation -->
            ${this.renderWizardNavigation()}
          </div>
        </div>
      </div>
    `;
  }
}
