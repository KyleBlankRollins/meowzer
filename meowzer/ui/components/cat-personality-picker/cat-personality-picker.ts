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
import { catPersonalityPickerStyles } from "./cat-personality-picker.style.js";

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

// Preset trait values
const PRESET_TRAIT_VALUES: Record<PersonalityPreset, Personality> = {
  playful: {
    curiosity: 0.7,
    playfulness: 0.9,
    independence: 0.4,
    sociability: 0.8,
    energy: 0.8,
  },
  lazy: {
    curiosity: 0.3,
    playfulness: 0.2,
    independence: 0.7,
    sociability: 0.3,
    energy: 0.2,
  },
  curious: {
    curiosity: 0.9,
    playfulness: 0.6,
    independence: 0.6,
    sociability: 0.5,
    energy: 0.6,
  },
  aloof: {
    curiosity: 0.4,
    playfulness: 0.3,
    independence: 0.9,
    sociability: 0.2,
    energy: 0.5,
  },
  energetic: {
    curiosity: 0.6,
    playfulness: 0.7,
    independence: 0.5,
    sociability: 0.7,
    energy: 0.9,
  },
  balanced: {
    curiosity: 0.5,
    playfulness: 0.5,
    independence: 0.5,
    sociability: 0.5,
    energy: 0.5,
  },
};

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

    // Get the trait values for this preset
    const presetTraits = PRESET_TRAIT_VALUES[preset];

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
        <div class="preset-buttons">
          ${PERSONALITY_PRESETS.map(
            (preset) => html`
              <cds-button
                kind=${this.selectedPreset === preset.value
                  ? "primary"
                  : "tertiary"}
                @click=${() => this.handlePresetSelect(preset.value)}
              >
                ${preset.name}
              </cds-button>
            `
          )}
        </div>

        <div class="trait-sliders">
          <div class="slider-field">
            <label>Curiosity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              .value=${String(
                (this.personality as any).curiosity || 0.5
              )}
              @input=${(e: Event) =>
                this.handleTraitChange(
                  "curiosity",
                  parseFloat((e.target as HTMLInputElement).value)
                )}
            />
            <span class="slider-value"
              >${((this.personality as any).curiosity || 0.5).toFixed(
                1
              )}</span
            >
          </div>

          <div class="slider-field">
            <label>Playfulness</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              .value=${String(
                (this.personality as any).playfulness || 0.5
              )}
              @input=${(e: Event) =>
                this.handleTraitChange(
                  "playfulness",
                  parseFloat((e.target as HTMLInputElement).value)
                )}
            />
            <span class="slider-value"
              >${(
                (this.personality as any).playfulness || 0.5
              ).toFixed(1)}</span
            >
          </div>

          <div class="slider-field">
            <label>Independence</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              .value=${String(
                (this.personality as any).independence || 0.5
              )}
              @input=${(e: Event) =>
                this.handleTraitChange(
                  "independence",
                  parseFloat((e.target as HTMLInputElement).value)
                )}
            />
            <span class="slider-value"
              >${(
                (this.personality as any).independence || 0.5
              ).toFixed(1)}</span
            >
          </div>

          <div class="slider-field">
            <label>Sociability</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              .value=${String(
                (this.personality as any).sociability || 0.5
              )}
              @input=${(e: Event) =>
                this.handleTraitChange(
                  "sociability",
                  parseFloat((e.target as HTMLInputElement).value)
                )}
            />
            <span class="slider-value"
              >${(
                (this.personality as any).sociability || 0.5
              ).toFixed(1)}</span
            >
          </div>

          <div class="slider-field">
            <label>Energy</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              .value=${String(
                (this.personality as any).energy || 0.5
              )}
              @input=${(e: Event) =>
                this.handleTraitChange(
                  "energy",
                  parseFloat((e.target as HTMLInputElement).value)
                )}
            />
            <span class="slider-value"
              >${((this.personality as any).energy || 0.5).toFixed(
                1
              )}</span
            >
          </div>
        </div>
      </div>
    `;
  }
}
