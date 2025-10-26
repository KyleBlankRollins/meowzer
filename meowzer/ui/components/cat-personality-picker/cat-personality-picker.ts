/**
 * CatPersonalityPicker - Interface for selecting personality traits
 *
 * Allows users to customize cat personality or choose from presets.
 *
 * @fires personality-change - Emitted when personality changes, with detail containing updated personality
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Personality, PersonalityPreset } from "meowzer";

const PERSONALITY_PRESETS: Array<{
  name: string;
  value: PersonalityPreset;
}> = [
  { name: "Playful", value: "playful" },
  { name: "Lazy", value: "lazy" },
  { name: "Curious", value: "curious" },
  { name: "Aloof", value: "aloof" },
  { name: "Energetic", value: "energetic" },
  { name: "Balanced", value: "balanced" },
];

@customElement("cat-personality-picker")
export class CatPersonalityPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .personality-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preset-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .trait-sliders {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .expander-content {
      padding: 1rem 0;
    }
  `;

  @property({ type: Object }) personality: Partial<Personality> = {};
  @state() private selectedPreset: PersonalityPreset | null = null;

  private emitChange(newPersonality: Partial<Personality>) {
    this.dispatchEvent(
      new CustomEvent("personality-change", {
        detail: newPersonality,
        bubbles: true,
        composed: true,
      })
    );
  }

  private handlePresetSelect(preset: PersonalityPreset) {
    this.selectedPreset = preset;

    // Convert preset to personality object
    // For now, we'll just pass the preset string and let the SDK handle it
    this.emitChange({ preset } as any);
  }

  private handleTraitChange(trait: keyof Personality, value: number) {
    this.emitChange({
      ...this.personality,
      [trait]: value,
    });
  }

  render() {
    return html`
      <div class="personality-section">
        <quiet-text-field
          label="Personality"
          readonly
          value="Choose a preset or customize traits"
        ></quiet-text-field>

        <div class="preset-buttons">
          ${PERSONALITY_PRESETS.map(
            (preset) => html`
              <quiet-button
                appearance=${this.selectedPreset === preset.value
                  ? "normal"
                  : "outline"}
                variant=${this.selectedPreset === preset.value
                  ? "primary"
                  : "neutral"}
                @click=${() => this.handlePresetSelect(preset.value)}
              >
                ${preset.name}
              </quiet-button>
            `
          )}
        </div>

        <quiet-expander>
          <span slot="summary">Advanced: Custom Traits</span>
          <div class="expander-content">
            <quiet-callout variant="info">
              <p>
                Adjust individual personality traits for fine-tuned
                behavior.
              </p>
            </quiet-callout>

            <div class="trait-sliders">
              <quiet-slider
                label="Curiosity"
                min="0"
                max="1"
                step="0.1"
                .value=${(this.personality as any).curiosity || 0.5}
                @quiet-change=${(e: CustomEvent) =>
                  this.handleTraitChange(
                    "curiosity",
                    parseFloat(e.detail.value)
                  )}
              >
              </quiet-slider>

              <quiet-slider
                label="Playfulness"
                min="0"
                max="1"
                step="0.1"
                .value=${(this.personality as any).playfulness || 0.5}
                @quiet-change=${(e: CustomEvent) =>
                  this.handleTraitChange(
                    "playfulness",
                    parseFloat(e.detail.value)
                  )}
              >
              </quiet-slider>

              <quiet-slider
                label="Independence"
                min="0"
                max="1"
                step="0.1"
                .value=${(this.personality as any).independence ||
                0.5}
                @quiet-change=${(e: CustomEvent) =>
                  this.handleTraitChange(
                    "independence",
                    parseFloat(e.detail.value)
                  )}
              >
              </quiet-slider>

              <quiet-slider
                label="Sociability"
                min="0"
                max="1"
                step="0.1"
                .value=${(this.personality as any).sociability || 0.5}
                @quiet-change=${(e: CustomEvent) =>
                  this.handleTraitChange(
                    "sociability",
                    parseFloat(e.detail.value)
                  )}
              >
              </quiet-slider>

              <quiet-slider
                label="Energy"
                min="0"
                max="1"
                step="0.1"
                .value=${(this.personality as any).energy || 0.5}
                @quiet-change=${(e: CustomEvent) =>
                  this.handleTraitChange(
                    "energy",
                    parseFloat(e.detail.value)
                  )}
              >
              </quiet-slider>
            </div>
          </div>
        </quiet-expander>
      </div>
    `;
  }
}
