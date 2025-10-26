/**
 * CatAppearanceForm - Form for customizing cat appearance
 *
 * Allows users to customize color, pattern, size, fur length, and eye color.
 *
 * @fires settings-change - Emitted when any setting changes, with detail containing updated settings
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type {
  CatSettings,
  CatPattern,
  CatSize,
  FurLength,
} from "meowzer";

const PATTERNS: CatPattern[] = [
  "solid",
  "tabby",
  "calico",
  "tuxedo",
  "spotted",
];
const SIZES: CatSize[] = ["small", "medium", "large"];
const FUR_LENGTHS: FurLength[] = ["short", "medium", "long"];

const PRESET_COLORS = [
  { name: "Orange", value: "#FF6B35" },
  { name: "Gray", value: "#95A3A4" },
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#2C3E50" },
  { name: "Brown", value: "#8B4513" },
  { name: "Cream", value: "#FFF8DC" },
];

const PRESET_EYE_COLORS = [
  { name: "Blue", value: "#4ECDC4" },
  { name: "Green", value: "#90EE90" },
  { name: "Yellow", value: "#F4D03F" },
  { name: "Amber", value: "#FF8C00" },
  { name: "Gray", value: "#95A3A4" },
];

@customElement("cat-appearance-form")
export class CatAppearanceForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .appearance-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .color-picker-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .preset-colors {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .color-swatch {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .color-swatch:hover {
      transform: scale(1.1);
      border-color: var(--quiet-primary-stroke, #3b82f6);
    }

    .color-swatch.selected {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      border-width: 3px;
      box-shadow: 0 0 0 2px
        var(--quiet-primary-background-softest, #dbeafe);
    }
  `;

  @property({ type: Object }) settings: Partial<CatSettings> = {};

  private emitChange(newSettings: Partial<CatSettings>) {
    this.dispatchEvent(
      new CustomEvent("settings-change", {
        detail: newSettings,
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleColorChange(color: string) {
    this.emitChange({ ...this.settings, color });
  }

  private handleEyeColorChange(eyeColor: string) {
    this.emitChange({ ...this.settings, eyeColor });
  }

  private handlePatternChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.emitChange({
      ...this.settings,
      pattern: select.value as CatPattern,
    });
  }

  private handleSizeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.emitChange({
      ...this.settings,
      size: select.value as CatSize,
    });
  }

  private handleFurLengthChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.emitChange({
      ...this.settings,
      furLength: select.value as FurLength,
    });
  }

  render() {
    return html`
      <div class="appearance-section">
        <!-- Fur Color -->
        <div class="color-picker-group">
          <quiet-text-field
            label="Fur Color"
            type="color"
            .value=${this.settings.color || "#FF6B35"}
            @quiet-input=${(e: CustomEvent) =>
              this.handleColorChange(e.detail.value)}
          >
          </quiet-text-field>

          <div class="preset-colors">
            ${PRESET_COLORS.map(
              (preset) => html`
                <button
                  class="color-swatch ${this.settings.color ===
                  preset.value
                    ? "selected"
                    : ""}"
                  style="background-color: ${preset.value}"
                  @click=${() => this.handleColorChange(preset.value)}
                  title=${preset.name}
                  aria-label=${`Select ${preset.name} color`}
                ></button>
              `
            )}
          </div>
        </div>

        <!-- Eye Color -->
        <div class="color-picker-group">
          <quiet-text-field
            label="Eye Color"
            type="color"
            .value=${this.settings.eyeColor || "#4ECDC4"}
            @quiet-input=${(e: CustomEvent) =>
              this.handleEyeColorChange(e.detail.value)}
          >
          </quiet-text-field>

          <div class="preset-colors">
            ${PRESET_EYE_COLORS.map(
              (preset) => html`
                <button
                  class="color-swatch ${this.settings.eyeColor ===
                  preset.value
                    ? "selected"
                    : ""}"
                  style="background-color: ${preset.value}"
                  @click=${() =>
                    this.handleEyeColorChange(preset.value)}
                  title=${preset.name}
                  aria-label=${`Select ${preset.name} eye color`}
                ></button>
              `
            )}
          </div>
        </div>

        <!-- Pattern -->
        <quiet-select
          label="Pattern"
          .value=${this.settings.pattern || "solid"}
          @quiet-change=${this.handlePatternChange}
        >
          ${PATTERNS.map(
            (pattern) => html`
              <option value=${pattern}>
                ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              </option>
            `
          )}
        </quiet-select>

        <!-- Size -->
        <quiet-select
          label="Size"
          .value=${this.settings.size || "medium"}
          @quiet-change=${this.handleSizeChange}
        >
          ${SIZES.map(
            (size) => html`
              <option value=${size}>
                ${size.charAt(0).toUpperCase() + size.slice(1)}
              </option>
            `
          )}
        </quiet-select>

        <!-- Fur Length -->
        <quiet-select
          label="Fur Length"
          .value=${this.settings.furLength || "short"}
          @quiet-change=${this.handleFurLengthChange}
        >
          ${FUR_LENGTHS.map(
            (length) => html`
              <option value=${length}>
                ${length.charAt(0).toUpperCase() + length.slice(1)}
              </option>
            `
          )}
        </quiet-select>
      </div>
    `;
  }
}
