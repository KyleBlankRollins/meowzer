/**
 * AppearanceSection - Internal partial for cat appearance customization
 *
 * Not exported from package - internal to cat-creator only.
 * Handles color pickers, pattern, fur length, and size selection.
 *
 * @fires appearance-change - Emitted when any appearance setting changes
 */

import { LitElement, html } from "lit";
import { appearanceSectionStyles } from "./appearance-section.style.js";
import { customElement, property } from "lit/decorators.js";
import type { CatSettings } from "meowzer";
import "../../mb-color-picker/mb-color-picker.js";

@customElement("appearance-section")
export class AppearanceSection extends LitElement {
  static styles = [appearanceSectionStyles];

  @property({ type: Object }) settings!: CatSettings;

  private handleColorChange(e: CustomEvent) {
    this.emitChange({ color: e.detail.value });
  }

  private handleEyeColorChange(e: CustomEvent) {
    this.emitChange({ eyeColor: e.detail.value });
  }

  private handlePatternChange(e: CustomEvent) {
    this.emitChange({
      pattern: (e.target as any).value as CatSettings["pattern"],
    });
  }

  private handleFurLengthChange(e: CustomEvent) {
    this.emitChange({
      furLength: (e.target as any).value as CatSettings["furLength"],
    });
  }

  private handleSizeChange(e: CustomEvent) {
    this.emitChange({
      size: (e.target as any).value as CatSettings["size"],
    });
  }

  private emitChange(changes: Partial<CatSettings>) {
    this.dispatchEvent(
      new CustomEvent("appearance-change", {
        detail: { ...this.settings, ...changes },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="form-section">
        <h4>Appearance</h4>

        <div class="appearance-grid">
          <mb-color-picker
            label="Fur Color"
            .value=${this.settings.color}
            @mb-change=${this.handleColorChange}
          ></mb-color-picker>

          <mb-color-picker
            label="Eye Color"
            .value=${this.settings.eyeColor}
            @mb-change=${this.handleEyeColorChange}
          ></mb-color-picker>

          <div class="select-field">
            <label>Pattern</label>
            <select
              .value=${this.settings.pattern}
              @change=${this.handlePatternChange}
            >
              <option value="solid">Solid</option>
              <option value="tabby">Tabby</option>
              <option value="calico">Calico</option>
              <option value="tuxedo">Tuxedo</option>
              <option value="spotted">Spotted</option>
            </select>
          </div>

          <div class="select-field">
            <label>Fur Length</label>
            <select
              .value=${this.settings.furLength}
              @change=${this.handleFurLengthChange}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          <div class="select-field">
            <label>Body Size</label>
            <select
              .value=${this.settings.size}
              @change=${this.handleSizeChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
}
