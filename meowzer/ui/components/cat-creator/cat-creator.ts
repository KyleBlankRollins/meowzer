/**
 * CatCreator - Main component for creating new cats
 *
 * Orchestrates the cat creation flow with appearance customization,
 * personality selection, and live preview.
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
import type { Meowzer, CatSettings, Personality } from "meowzer";

@customElement("cat-creator")
export class CatCreator extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
    }

    .creator-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 1rem;
    }

    .creator-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .creator-preview {
      position: sticky;
      top: 1rem;
      height: fit-content;
    }

    .creator-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .creator-container {
        grid-template-columns: 1fr;
      }

      .creator-preview {
        position: static;
      }
    }
  `;

  @consume({ context: meowzerContext })
  meowzer?: Meowzer;

  @state() private catName = "";
  @state() private catDescription = "";
  @state() private settings: Partial<CatSettings> = {
    color: "#FF6B35",
    eyeColor: "#4ECDC4",
    pattern: "solid",
    size: "medium",
    furLength: "short",
  };
  @state() private personality: Partial<Personality> = {};
  @state() private creating = false;

  private handleNameChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.catName = input.value;
  }

  private handleDescriptionChange(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.catDescription = textarea.value;
  }

  private handleSettingsChange(newSettings: Partial<CatSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  private handlePersonalityChange(
    newPersonality: Partial<Personality>
  ) {
    this.personality = { ...this.personality, ...newPersonality };
  }

  private async handleCreate() {
    if (!this.meowzer) {
      console.error("Meowzer SDK not available");
      return;
    }

    this.creating = true;

    try {
      const cat = await this.meowzer.cats.create({
        name: this.catName || undefined,
        description: this.catDescription || undefined,
        settings: this.settings as CatSettings,
      });

      // Apply personality if configured
      if (Object.keys(this.personality).length > 0) {
        cat.setPersonality(this.personality as Personality);
      }

      // Cat is automatically placed in DOM and started by the SDK
      // Resume to ensure it's active
      cat.resume();

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent("cat-created", {
          detail: { cat },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.reset();
    } catch (error) {
      console.error("Failed to create cat:", error);
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
    this.personality = {};
  }

  render() {
    if (!this.meowzer) {
      return html`
        <quiet-callout variant="warning">
          <strong>No Meowzer SDK</strong>
          <p>
            Please wrap this component in a
            <code>&lt;meowzer-provider&gt;</code>.
          </p>
        </quiet-callout>
      `;
    }

    return html`
      <div class="creator-container">
        <div class="creator-form">
          <quiet-text-field
            label="Cat Name"
            placeholder="Enter a name for your cat"
            .value=${this.catName}
            @quiet-input=${this.handleNameChange}
          >
          </quiet-text-field>

          <quiet-text-area
            label="Description"
            placeholder="Describe your cat (optional)"
            rows="3"
            .value=${this.catDescription}
            @quiet-input=${this.handleDescriptionChange}
          >
          </quiet-text-area>

          <cat-appearance-form
            .settings=${this.settings}
            @settings-change=${(e: CustomEvent) =>
              this.handleSettingsChange(e.detail)}
          ></cat-appearance-form>

          <cat-personality-picker
            .personality=${this.personality}
            @personality-change=${(e: CustomEvent) =>
              this.handlePersonalityChange(e.detail)}
          ></cat-personality-picker>

          <div class="creator-actions">
            <quiet-button @click=${this.reset} appearance="outline">
              Reset
            </quiet-button>
            <quiet-button
              @click=${this.handleCreate}
              variant="primary"
              ?disabled=${this.creating}
            >
              ${this.creating ? "Creating..." : "Create Cat"}
            </quiet-button>
          </div>
        </div>

        <div class="creator-preview">
          <cat-preview .settings=${this.settings}></cat-preview>
        </div>
      </div>
    `;
  }
}
