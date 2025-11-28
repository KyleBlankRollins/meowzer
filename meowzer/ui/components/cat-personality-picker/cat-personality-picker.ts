/**
 * CatPersonalityPicker - Interface for selecting personality traits
 *
 * Allows users to customize cat personality or choose from presets.
 *
 * @fires personality-change - Emitted when personality changes, with detail containing updated personality
 */

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Personality, PersonalityPreset } from "meowzer";
import { getPersonality } from "meowzer";
import { catPersonalityPickerStyles } from "./cat-personality-picker.style.js";

// Get preset names for UI display
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
  static styles = [catPersonalityPickerStyles];

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

    // Get the trait values for this preset from meowbrain
    const presetTraits = getPersonality(preset);

    // Update the personality property to reflect the preset values
    this.personality = presetTraits;

    // Emit the change with both the preset and the trait values
    this.emitChange({ preset, ...presetTraits } as any);
  }

  private handleTraitChange(trait: keyof Personality, value: number) {
    // Clear selected preset when manually adjusting traits
    this.selectedPreset = null;

    const updatedPersonality = {
      ...this.personality,
      [trait]: value,
    };

    this.personality = updatedPersonality;
    this.emitChange(updatedPersonality);
  }

  render() {
    return html`
      <div class="personality-section">
        <h4>Appearance</h4>

        <div class="preset-buttons">
          ${PERSONALITY_PRESETS.map(
            (preset) => html`
              <mb-button
                variant=${this.selectedPreset === preset.value
                  ? "primary"
                  : "secondary"}
                @click=${() => this.handlePresetSelect(preset.value)}
              >
                ${preset.name}
              </mb-button>
            `
          )}
        </div>

        <div class="trait-sliders">
          <mb-slider
            label="Curiosity"
            min="0"
            max="1"
            step="0.1"
            .showValue=${false}
            .value=${(this.personality as any).curiosity || 0.5}
            @mb-change=${(e: CustomEvent) =>
              this.handleTraitChange("curiosity", e.detail.value)}
          >
          </mb-slider>

          <mb-slider
            label="Playfulness"
            min="0"
            max="1"
            step="0.1"
            .showValue=${false}
            .value=${(this.personality as any).playfulness || 0.5}
            @mb-change=${(e: CustomEvent) =>
              this.handleTraitChange("playfulness", e.detail.value)}
          >
          </mb-slider>

          <mb-slider
            label="Independence"
            min="0"
            max="1"
            step="0.1"
            .showValue=${false}
            .value=${(this.personality as any).independence || 0.5}
            @mb-change=${(e: CustomEvent) =>
              this.handleTraitChange("independence", e.detail.value)}
          >
          </mb-slider>

          <mb-slider
            label="Sociability"
            min="0"
            max="1"
            step="0.1"
            .showValue=${false}
            .value=${(this.personality as any).sociability || 0.5}
            @mb-change=${(e: CustomEvent) =>
              this.handleTraitChange("sociability", e.detail.value)}
          >
          </mb-slider>

          <mb-slider
            label="Energy"
            min="0"
            max="1"
            step="0.1"
            .showValue=${false}
            .value=${(this.personality as any).energy || 0.5}
            @mb-change=${(e: CustomEvent) =>
              this.handleTraitChange("energy", e.detail.value)}
          >
          </mb-slider>
        </div>
      </div>
    `;
  }
}
