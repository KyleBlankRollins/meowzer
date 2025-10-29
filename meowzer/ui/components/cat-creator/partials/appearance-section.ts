/**
 * AppearanceSection - Internal partial for cat appearance customization
 *
 * Not exported from package - internal to cat-creator only.
 * Handles color pickers, pattern, fur length, and size selection.
 *
 * @fires appearance-change - Emitted when any appearance setting changes
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { CatSettings } from "meowzer";
import "../../cat-color-picker/cat-color-picker.js";

@customElement("appearance-section")
export class AppearanceSection extends LitElement {
  static styles = css`
    :host {
      display: block;
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

    .appearance-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 600px) {
      .appearance-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

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
          <cat-color-picker
            label="Fur Color"
            .value=${this.settings.color}
            @color-change=${this.handleColorChange}
          ></cat-color-picker>

          <cat-color-picker
            label="Eye Color"
            .value=${this.settings.eyeColor}
            @color-change=${this.handleEyeColorChange}
          ></cat-color-picker>

          <quiet-select
            label="Pattern"
            .value=${this.settings.pattern}
            @quiet-change=${this.handlePatternChange}
          >
            <option value="solid">Solid</option>
            <option value="tabby">Tabby</option>
            <option value="calico">Calico</option>
            <option value="tuxedo">Tuxedo</option>
            <option value="spotted">Spotted</option>
          </quiet-select>

          <quiet-select
            label="Fur Length"
            .value=${this.settings.furLength}
            @quiet-change=${this.handleFurLengthChange}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </quiet-select>

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
      </div>
    `;
  }
}
