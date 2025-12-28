import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbShareCatModalStyles } from "./mb-share-cat-modal.style.js";
import type { MeowzerCat } from "meowzer";
import "../mb-modal/mb-modal.js";
import "../mb-button/mb-button.js";

/**
 * Modal for sharing a cat's seed value.
 *
 * Displays cat preview, name, description, and seed with copy functionality.
 *
 * @element mb-share-cat-modal
 *
 * @fires close - Fired when modal is closed
 *
 * @example
 * ```html
 * <mb-share-cat-modal
 *   .cat=${myCat}
 *   ?open=${true}
 *   @close=${handleClose}
 * ></mb-share-cat-modal>
 * ```
 */
@customElement("mb-share-cat-modal")
export class MbShareCatModal extends LitElement {
  static styles = [baseStyles, mbShareCatModalStyles];

  /**
   * The cat to share
   */
  @property({ type: Object })
  cat?: MeowzerCat;

  /**
   * Whether the modal is open
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Whether copy button is in "copied" state
   */
  @state()
  private copied = false;

  /**
   * Timeout ID for resetting copied state
   */
  private copiedTimeout?: number;

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
    }
  }

  /**
   * Copy seed to clipboard
   */
  private async handleCopy() {
    if (!this.cat?.seed) return;

    try {
      await navigator.clipboard.writeText(this.cat.seed);
      this.copied = true;

      // Reset after 3 seconds
      if (this.copiedTimeout) {
        clearTimeout(this.copiedTimeout);
      }
      this.copiedTimeout = window.setTimeout(() => {
        this.copied = false;
      }, 3000);
    } catch (error) {
      console.error("Failed to copy seed:", error);
    }
  }

  /**
   * Handle modal close
   */
  private handleClose() {
    this.copied = false;
    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
    }

    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.cat) {
      return html``;
    }

    return html`
      <mb-modal
        ?open=${this.open}
        heading="Share Cat"
        size="md"
        @mb-close=${this.handleClose}
      >
        <div class="share-content">
          <!-- Cat Preview -->
          <div
            class="cat-preview"
            .innerHTML=${this.cat.element.innerHTML}
          ></div>

          <!-- Cat Info -->
          <div class="cat-info">
            ${this.cat.name
              ? html`<h3 class="cat-name">${this.cat.name}</h3>`
              : html`<h3 class="cat-name">Unnamed Cat</h3>`}
            ${this.cat.description
              ? html`<p class="cat-description">
                  ${this.cat.description}
                </p>`
              : ""}
          </div>

          <!-- Seed Section -->
          <div class="seed-section">
            <label class="seed-label">Cat Seed</label>
            <div class="seed-display">
              <code class="seed-value">${this.cat.seed}</code>
            </div>
            <p class="seed-help">
              Copy this seed to recreate this cat on another device.
            </p>
          </div>
        </div>

        <!-- Footer with Copy Button -->
        <div slot="footer" class="modal-footer">
          <mb-button
            variant="secondary"
            @mb-click=${this.handleClose}
          >
            Close
          </mb-button>
          <mb-button variant="primary" @mb-click=${this.handleCopy}>
            ${this.copied ? "✓ Copied!" : "Copy Seed"}
          </mb-button>
        </div>
      </mb-modal>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-share-cat-modal": MbShareCatModal;
  }
}
