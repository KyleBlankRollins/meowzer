/**
 * CatPreview - Live preview of cat being created
 *
 * Shows a visual representation of the cat with current settings.
 * Supports both simplified preview (CSS-based) and full ProtoCat rendering (SVG).
 * Updates in real-time as settings change.
 */

import { LitElement, html }  from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CatSettings, ProtoCat } from "meowzer";
import { MeowzerUtils } from "meowzer";
import { catPreviewStyles } from "./cat-preview.style.js";

@customElement("cat-preview")
export class CatPreview extends LitElement {
  static styles = [catPreviewStyles];

  /**
   * Cat settings for simplified preview (CSS-based)
   */
  @property({ type: Object }) settings?: Partial<CatSettings>;

  /**
   * Full ProtoCat object for accurate preview (SVG-based)
   * Takes precedence over settings if provided
   */
  @property({ type: Object }) protoCat?: ProtoCat;

  /**
   * Show validation errors
   */
  @property({ type: Array }) validationErrors: string[] = [];

  /**
   * Whether to auto-build ProtoCat from settings
   * If true, will use MeowzerUtils.buildPreview() when only settings are provided
   */
  @property({ type: Boolean }) autoBuild: boolean = false;

  @state() private builtProtoCat: ProtoCat | null = null;
  @state() private buildError: string | null = null;

  updated(changedProperties: Map<string, any>) {
    if (
      this.autoBuild &&
      !this.protoCat &&
      this.settings &&
      changedProperties.has("settings")
    ) {
      this.buildPreviewFromSettings();
    }
  }

  private async buildPreviewFromSettings() {
    if (!this.settings) return;

    try {
      this.builtProtoCat = MeowzerUtils.buildPreview(
        this.settings as CatSettings
      );
      this.buildError = null;
    } catch (error) {
      this.buildError = `Failed to build preview: ${error}`;
      this.builtProtoCat = null;
    }
  }

  private getPatternStyles(): string {
    if (!this.settings) return "none";
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
    // Priority: protoCat > builtProtoCat > simplified preview > error
    const activeProtoCat = this.protoCat || this.builtProtoCat;

    if (activeProtoCat) {
      return this.renderProtoCatPreview(activeProtoCat);
    }

    if (this.buildError) {
      return this.renderError([this.buildError]);
    }

    if (this.validationErrors.length > 0) {
      return this.renderError(this.validationErrors);
    }

    if (this.settings) {
      return this.renderSimplifiedPreview();
    }

    return this.renderEmpty();
  }

  /**
   * Render ProtoCat preview with actual SVG
   */
  private renderProtoCatPreview(protoCat: ProtoCat) {
    return html`
      <div class="preview-container">
        <div
          class="protocat-preview"
          style="--cat-scale: ${protoCat.dimensions.scale}"
          .innerHTML=${protoCat.spriteData.svg}
        ></div>
        <div class="preview-details">
          <p>
            <strong>Seed:</strong>
            <code>${protoCat.seed}</code>
          </p>
          <p><strong>Size:</strong> ${protoCat.dimensions.size}</p>
          <p>
            <strong>Pattern:</strong>
            ${protoCat.appearance.pattern.charAt(0).toUpperCase() +
            protoCat.appearance.pattern.slice(1)}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Render error state
   */
  private renderError(errors: string[]) {
    return html`
      <div class="preview-container">
        <div class="preview-error">
          <p>Preview Error</p>
          ${errors.map(
            (err) => html`<p class="error-text">${err}</p>`
          )}
        </div>
      </div>
    `;
  }

  /**
   * Render empty state
   */
  private renderEmpty() {
    return html`
      <div class="preview-container">
        <div class="preview-loading">
          <quiet-spinner size="md"></quiet-spinner>
          <p>Waiting for settings...</p>
        </div>
      </div>
    `;
  }

  /**
   * Render simplified CSS-based preview
   */
  private renderSimplifiedPreview() {
    if (!this.settings) return this.renderEmpty();

    const furColor = this.settings.color || "#FF6B35";
    const eyeColor = this.settings.eyeColor || "#4ECDC4";
    const pattern = this.settings.pattern || "solid";
    const size = this.settings.size || "medium";
    const furLength = this.settings.furLength || "short";

    return html`
      <div
        class="preview-container"
        style="--preview-fur-color: ${furColor}; --preview-eye-color: ${eyeColor}; --preview-pattern: ${this.getPatternStyles()}"
      >
        <div class="preview-cat">
          <div class="cat-ears">
            <div class="ear"></div>
            <div class="ear"></div>
          </div>
          <div class="cat-body">
            <div class="cat-pattern"></div>
          </div>
          <div class="cat-eyes">
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
