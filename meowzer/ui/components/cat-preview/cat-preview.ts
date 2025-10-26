/**
 * CatPreview - Live preview of cat being created
 *
 * Shows a visual representation of the cat with current settings.
 * Updates in real-time as settings change.
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { CatSettings } from "meowzer";

@customElement("cat-preview")
export class CatPreview extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .preview-container {
      border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 2rem;
      background: var(--quiet-neutral-background-softest, #f9fafb);
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .preview-cat {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease;
    }

    .cat-body {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
    }

    .cat-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
    }

    .cat-eyes {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      gap: 1.5rem;
    }

    .eye {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: currentColor;
    }

    .cat-ears {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 3rem;
    }

    .ear {
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 25px solid currentColor;
    }

    .preview-label {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      text-align: center;
    }

    .settings-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      padding: 1rem;
      background: var(--quiet-neutral-background, #ffffff);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      font-size: 0.875rem;
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
    }

    .setting-label {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .setting-value {
      font-weight: 500;
      color: var(--quiet-neutral-foreground, #111827);
    }
  `;

  @property({ type: Object }) settings: Partial<CatSettings> = {};

  private getPatternStyles(): string {
    const pattern = this.settings.pattern || "solid";

    switch (pattern) {
      case "tabby":
        return "repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)";
      case "spotted":
        return "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.2) 10%, transparent 10%), radial-gradient(circle at 70% 50%, rgba(0,0,0,0.2) 8%, transparent 8%), radial-gradient(circle at 40% 70%, rgba(0,0,0,0.2) 12%, transparent 12%)";
      case "calico":
        return "radial-gradient(circle at 30% 40%, rgba(255,107,53,0.4) 15%, transparent 15%), radial-gradient(circle at 65% 60%, rgba(44,62,80,0.4) 20%, transparent 20%)";
      case "tuxedo":
        return "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.6) 60%, rgba(0,0,0,0) 60%)";
      default:
        return "none";
    }
  }

  render() {
    const furColor = this.settings.color || "#FF6B35";
    const eyeColor = this.settings.eyeColor || "#4ECDC4";
    const pattern = this.settings.pattern || "solid";
    const size = this.settings.size || "medium";
    const furLength = this.settings.furLength || "short";

    return html`
      <div class="preview-container">
        <div class="preview-cat">
          <div class="cat-ears" style="color: ${furColor}">
            <div class="ear"></div>
            <div class="ear"></div>
          </div>
          <div class="cat-body" style="background-color: ${furColor}">
            <div
              class="cat-pattern"
              style="background: ${this.getPatternStyles()}"
            ></div>
          </div>
          <div class="cat-eyes" style="color: ${eyeColor}">
            <div class="eye"></div>
            <div class="eye"></div>
          </div>
        </div>

        <div class="preview-label">Live Preview</div>

        <div class="settings-summary">
          <div class="setting-row">
            <span class="setting-label">Pattern:</span>
            <span class="setting-value"
              >${pattern.charAt(0).toUpperCase() +
              pattern.slice(1)}</span
            >
          </div>
          <div class="setting-row">
            <span class="setting-label">Size:</span>
            <span class="setting-value"
              >${size.charAt(0).toUpperCase() + size.slice(1)}</span
            >
          </div>
          <div class="setting-row">
            <span class="setting-label">Fur Length:</span>
            <span class="setting-value"
              >${furLength.charAt(0).toUpperCase() +
              furLength.slice(1)}</span
            >
          </div>
        </div>
      </div>
    `;
  }
}
