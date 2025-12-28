/**
 * AdoptSection - Internal partial for adopting a cat from seed
 *
 * Not exported from package - internal to cat-creator only.
 * Handles seed input, validation, preview, and cat adoption.
 *
 * @fires adopt - Emitted when user clicks "Adopt Cat" button
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../../contexts/meowzer-context.js";
import { adoptSectionStyles } from "./adopt-section.style.js";
import { MeowzerUtils, type Meowzer, type ProtoCat } from "meowzer";
import "../../mb-text-input/mb-text-input.js";
import "../../mb-textarea/mb-textarea.js";
import "../../mb-button/mb-button.js";
import "../../mb-notification/mb-notification.js";

export interface AdoptInfo {
  seed: string;
  name: string;
  description: string;
}

@customElement("adopt-section")
export class AdoptSection extends LitElement {
  static styles = [adoptSectionStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state() private seed = "";
  @state() private name = "";
  @state() private description = "";
  @state() private validationError = "";
  @state() private preview?: ProtoCat;
  @state() private adopting = false;

  /**
   * Validate and preview seed
   */
  private handleSeedChange(e: CustomEvent) {
    const newSeed = (e.target as any).value.trim();
    this.seed = newSeed;

    if (!newSeed) {
      this.validationError = "";
      this.preview = undefined;
      return;
    }

    // Validate seed
    const isValid = MeowzerUtils.validateSeed(newSeed);

    if (!isValid) {
      this.validationError = "Invalid seed format";
      this.preview = undefined;
      return;
    }

    // Generate preview
    try {
      this.preview = MeowzerUtils.buildPreviewFromSeed(newSeed);
      this.validationError = "";
    } catch (error) {
      this.validationError = "Failed to generate preview from seed";
      this.preview = undefined;
    }
  }

  private handleNameChange(e: CustomEvent) {
    this.name = (e.target as any).value;
  }

  private handleDescriptionChange(e: CustomEvent) {
    this.description = (e.target as any).value;
  }

  /**
   * Handle adopt button click
   */
  private async handleAdopt() {
    if (!this.isValid || !this.meowzer) {
      return;
    }

    this.adopting = true;

    try {
      const cat = await this.meowzer.cats.create({
        seed: this.seed,
        name: this.name || undefined,
        description: this.description || undefined,
      });

      // Emit success event
      this.dispatchEvent(
        new CustomEvent("adopt", {
          detail: { cat },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.reset();
    } catch (error) {
      console.error("Failed to adopt cat:", error);
      this.validationError = `Failed to adopt cat: ${error}`;
    } finally {
      this.adopting = false;
    }
  }

  /**
   * Reset the form
   */
  private reset() {
    this.seed = "";
    this.name = "";
    this.description = "";
    this.validationError = "";
    this.preview = undefined;
  }

  /**
   * Check if form is valid
   */
  private get isValid(): boolean {
    return !!(this.seed && !this.validationError && this.preview);
  }

  render() {
    return html`
      <div class="adopt-section">
        <div class="adopt-header">
          <h3>Adopt a Cat</h3>
          <p class="adopt-description">
            Paste a cat seed to recreate an existing cat on this
            device.
          </p>
        </div>

        <div class="adopt-form">
          <!-- Seed Input -->
          <div class="form-group">
            <mb-text-input
              label="Cat Seed"
              .value=${this.seed}
              @input=${this.handleSeedChange}
              placeholder="for example: tabby-FF9500-00FF00-m-short-v1"
              ?error=${!!this.validationError}
            ></mb-text-input>
            ${this.validationError
              ? html`
                  <mb-notification
                    variant="error"
                    title="Invalid Seed"
                    class="error-message"
                  >
                    ${this.validationError}
                  </mb-notification>
                `
              : ""}
          </div>

          <!-- Preview -->
          ${this.preview
            ? html`
                <div class="preview-container">
                  <h4>Preview</h4>
                  <div
                    class="cat-preview"
                    .innerHTML=${this.preview.spriteData.svg}
                  ></div>
                </div>
              `
            : ""}

          <!-- Name & Description (only if preview is valid) -->
          ${this.preview
            ? html`
                <div class="form-group">
                  <mb-text-input
                    label="Name (optional)"
                    .value=${this.name}
                    @input=${this.handleNameChange}
                    placeholder="Give your cat a name"
                  ></mb-text-input>
                </div>

                <div class="form-group">
                  <mb-textarea
                    label="Description (optional)"
                    .value=${this.description}
                    @input=${this.handleDescriptionChange}
                    rows="3"
                    placeholder="Add a description"
                  ></mb-textarea>
                </div>
              `
            : ""}
        </div>

        <!-- Adopt Button -->
        <div class="adopt-actions">
          <mb-button
            variant="primary"
            size="lg"
            ?disabled=${!this.isValid}
            ?loading=${this.adopting}
            @mb-click=${this.handleAdopt}
          >
            ${this.adopting ? "Adopting..." : "Adopt Cat"}
          </mb-button>
        </div>
      </div>
    `;
  }
}
