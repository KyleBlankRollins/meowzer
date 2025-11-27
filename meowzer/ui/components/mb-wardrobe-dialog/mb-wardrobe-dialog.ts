import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { wardrobeDialogStyles } from "./mb-wardrobe-dialog.style.js";
import type { HatType } from "meowzer";
import type { MeowzerCat } from "meowzer";
import { MeowzerUtils } from "meowzer";

/**
 * Wardrobe Dialog Component
 *
 * Allows users to select and customize hats for their cats.
 * Provides hat type selection, color customization, and live preview.
 *
 * @example
 * ```html
 * <mb-wardrobe-dialog
 *   .cat=${myCat}
 *   ?open=${true}
 *   @dialog-close=${handleClose}
 * ></mb-wardrobe-dialog>
 * ```
 *
 * @fires dialog-close - Dispatched when dialog is closed (cancel or apply)
 * @fires hat-applied - Dispatched when hat is successfully applied to cat
 */
@customElement("mb-wardrobe-dialog")
export class MbWardrobeDialog extends LitElement {
  static styles = wardrobeDialogStyles;

  /**
   * The cat to customize
   */
  @property({ type: Object })
  cat?: MeowzerCat;

  /**
   * Whether the dialog is open
   */
  @property({ type: Boolean })
  open = false;

  /**
   * Selected hat type
   */
  @state()
  private selectedHatType: HatType = "beanie";

  /**
   * Base color for the hat
   */
  @state()
  private baseColor = "#FF0000";

  /**
   * Accent color for the hat
   */
  @state()
  private accentColor = "#FFFF00";

  /**
   * Available hat types with display info
   */
  private readonly hatTypes: Array<{
    type: HatType;
    label: string;
    emoji: string;
  }> = [
    { type: "beanie", label: "Beanie", emoji: "🧢" },
    { type: "cowboy", label: "Cowboy", emoji: "🤠" },
    { type: "baseball", label: "Baseball", emoji: "⚾" },
  ];

  /**
   * Generate a standalone SVG for a hat (for preview/selection)
   * Creates a small centered hat icon
   */
  private generateHatPreviewSVG(
    type: HatType,
    baseColor: string,
    accentColor: string
  ): string {
    return MeowzerUtils.buildHatPreview(type, baseColor, accentColor);
  }

  /**
   * Initialize state when dialog opens
   */
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("open") && this.open) {
      this.initializeState();
    }
  }

  /**
   * Initialize dialog state based on cat's current hat
   */
  private initializeState() {
    if (!this.cat) return;

    const currentHat = this.cat.accessories.getHat();
    if (currentHat) {
      // Cat has a hat - use its settings
      this.selectedHatType = currentHat.type;
      this.baseColor = currentHat.baseColor;
      this.accentColor = currentHat.accentColor;
    } else {
      // No hat - use defaults
      this.selectedHatType = "beanie";
      this.baseColor = "#FF0000";
      this.accentColor = "#FFFF00";
    }
  }

  /**
   * Handle hat type selection
   */
  private handleHatSelect(type: HatType) {
    this.selectedHatType = type;
  }

  /**
   * Handle base color change
   */
  private handleBaseColorChange(e: CustomEvent) {
    this.baseColor = e.detail.value;
  }

  /**
   * Handle accent color change
   */
  private handleAccentColorChange(e: CustomEvent) {
    this.accentColor = e.detail.value;
  }

  /**
   * Handle cancel action
   */
  private handleCancel() {
    this.dispatchEvent(
      new CustomEvent("dialog-close", {
        detail: { applied: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle apply action
   */
  private handleApply() {
    if (!this.cat) return;

    const hasHat = this.cat.accessories.hasHat();

    if (hasHat) {
      // Update existing hat colors
      const currentHat = this.cat.accessories.getHat();
      if (currentHat && currentHat.type === this.selectedHatType) {
        // Same hat type - just update colors
        this.cat.accessories.updateHatColors(
          this.baseColor,
          this.accentColor
        );
      } else {
        // Different hat type - remove old and add new
        this.cat.accessories.removeHat();
        this.cat.accessories.addHat(
          this.selectedHatType,
          this.baseColor,
          this.accentColor
        );
      }
    } else {
      // Add new hat
      this.cat.accessories.addHat(
        this.selectedHatType,
        this.baseColor,
        this.accentColor
      );
    }

    this.dispatchEvent(
      new CustomEvent("hat-applied", {
        detail: {
          type: this.selectedHatType,
          baseColor: this.baseColor,
          accentColor: this.accentColor,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.dispatchEvent(
      new CustomEvent("dialog-close", {
        detail: { applied: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle dialog close event from Carbon
   * The cds-modal-closed event fires after the modal closes via any method
   */
  private handleDialogClose() {
    this.dispatchEvent(
      new CustomEvent("dialog-close", {
        detail: { applied: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Render hat type selection buttons
   */
  private renderHatSelection() {
    return html`
      <div class="hat-selection">
        <label class="section-label">Select Hat Style:</label>
        <div class="hat-buttons">
          ${this.hatTypes.map(
            (hat) => html`
              <mb-button
                class="hat-button"
                variant=${this.selectedHatType === hat.type
                  ? "primary"
                  : "tertiary"}
                @click=${() => this.handleHatSelect(hat.type)}
              >
                <div class="hat-button-content">
                  <span class="hat-icon">
                    ${unsafeSVG(
                      this.generateHatPreviewSVG(
                        hat.type,
                        this.baseColor,
                        this.accentColor
                      )
                    )}
                  </span>
                  <span class="hat-label">${hat.label}</span>
                </div>
              </mb-button>
            `
          )}
        </div>
      </div>
    `;
  }

  /**
   * Render color customization controls
   */
  private renderColorPickers() {
    return html`
      <div class="color-customization">
        <label class="section-label">Customize Colors:</label>

        <div class="color-pickers">
          <mb-color-picker
            label="Base Color"
            .value=${this.baseColor}
            @mb-change=${this.handleBaseColorChange}
          ></mb-color-picker>

          <mb-color-picker
            label="Accent Color"
            .value=${this.accentColor}
            @mb-change=${this.handleAccentColorChange}
          ></mb-color-picker>
        </div>
      </div>
    `;
  }

  render() {
    const catName = this.cat?.name || "Cat";

    return html`
      <mb-modal
        ?open=${this.open}
        @mb-close=${this.handleDialogClose}
        size="sm"
        heading="Change Hat for ${catName}"
      >
        <div class="wardrobe-content">
          ${this.renderHatSelection()} ${this.renderColorPickers()}
        </div>

        <div slot="footer">
          <mb-button @click=${this.handleCancel} variant="secondary">
            Cancel
          </mb-button>
          <mb-button @click=${this.handleApply} variant="primary">
            Apply Hat
          </mb-button>
        </div>
      </mb-modal>
    `;
  }
}
