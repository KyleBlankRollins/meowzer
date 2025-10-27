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

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
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
  static styles = css`
    :host {
      display: block;
    }

    .cat-creator {
      display: grid;
      gap: 1rem;
    }

    .message {
      margin-bottom: 1rem;
    }

    .creator-layout {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr 2fr;
    }

    @media (max-width: 768px) {
      .creator-layout {
        grid-template-columns: 1fr;
      }
    }

    /* Preview Panel */
    .preview-panel {
      position: sticky;
      top: 1rem;
      align-self: start;
    }

    /* Settings Panel */
    .creator-form {
      display: grid;
      gap: 1.5rem;
    }

    .form-section {
      display: grid;
      gap: 1rem;
    }

    .form-section h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--quiet-neutral-text-loud);
      border-bottom: 1px solid var(--quiet-neutral-stroke-soft);
      padding-bottom: 0.5rem;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid var(--quiet-neutral-stroke-soft);
    }
  `;

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
   * Handle size changes
   */
  private handleSizeChange(e: CustomEvent) {
    this.settings = {
      ...this.settings,
      size: (e.target as any).value as CatSettings["size"],
    };
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

      // Show success message
      this.message = `Created ${this.catName}! 🎉`;

      // Reset form
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
            <quiet-card>
              <h3 slot="header">Preview</h3>
              <cat-preview
                .settings=${this.settings}
                autoBuild
              ></cat-preview>
            </quiet-card>
          </div>

          <!-- Settings Panel -->
          <div class="settings-panel">
            <quiet-card>
              <h3 slot="header">Cat Creator</h3>

              <div class="creator-form">
                <!-- Basic Info -->
                <basic-info-section
                  .name=${this.catName}
                  .description=${this.catDescription}
                  @basic-info-change=${this.handleBasicInfoChange}
                ></basic-info-section>

                <quiet-divider></quiet-divider>

                <!-- Appearance -->
                <appearance-section
                  .settings=${this.settings}
                  @appearance-change=${this.handleAppearanceChange}
                ></appearance-section>

                <quiet-divider></quiet-divider>

                <!-- Size -->
                <div class="form-section">
                  <h4>Size</h4>
                  <quiet-select
                    label="Body Size"
                    .value=${this.settings.size}
                    @quiet-change=${this.handleSizeChange}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </quiet-select>
                </div>

                <quiet-divider></quiet-divider>

                <!-- Personality -->
                <cat-personality-picker
                  @personality-change=${this.handlePersonalityChange}
                ></cat-personality-picker>

                <quiet-divider></quiet-divider>

                <!-- Behavior Options -->
                <div class="form-section">
                  <h4>Behavior Options</h4>
                  <quiet-checkbox
                    .checked=${this.makeRoaming}
                    @quiet-change=${this.handleRoamingChange}
                  >
                    Make cat roam the viewport
                  </quiet-checkbox>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                  <quiet-button
                    @click=${this.reset}
                    appearance="outline"
                  >
                    Reset
                  </quiet-button>
                  <quiet-button
                    @click=${this.handleCreate}
                    variant="primary"
                    ?disabled=${this.creating || !this.catName.trim()}
                  >
                    ${this.creating ? "Creating..." : "Create Cat"}
                  </quiet-button>
                </div>
              </div>
            </quiet-card>
          </div>
        </div>
      </div>
    `;
  }
}
