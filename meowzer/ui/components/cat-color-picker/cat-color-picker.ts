import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colorPickerStyles } from "./cat-color-picker.styles.js";

/**
 * Cat color swatches organized by color family
 * Each family has 4 variants: dark, medium, light, very light
 */
const CAT_COLOR_SWATCHES = {
  // TODO: add more varied colors
  black: ["#000000", "#2b2b2b", "#4a4a4a", "#6e6e6e"],
  brown: ["#3d2817", "#5c3d2e", "#8b5a3c", "#a67c52"],
  orange: ["#cc5500", "#ff6b35", "#ff8c42", "#ffad60"],
  cream: ["#c9a87c", "#d4bc96", "#e8d5b7", "#f5e6d3"],
  gray: ["#5a5a5a", "#808080", "#a8a8a8", "#d3d3d3"],
  white: ["#c0c0c0", "#d9d9d9", "#efefef", "#ffffff"],
  golden: ["#b8860b", "#daa520", "#f0c808", "#ffd700"],
};

/**
 * Custom Color Picker Component
 * A swatch-based color picker with 7 color families
 */
@customElement("cat-color-picker")
export class CatColorPicker extends LitElement {
  static styles = colorPickerStyles;

  @property({ type: String })
  value = "#000000";

  @property({ type: String })
  label = "";

  @state()
  private showPicker = false;

  @state()
  private pickerPosition = { top: 0, left: 0 };

  private portalContainer?: HTMLDivElement;

  private handleSwatchClick(color: string) {
    this.value = color;
    this.showPicker = false;

    this.dispatchEvent(
      new CustomEvent("color-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private togglePicker(e: Event) {
    e.stopPropagation();

    if (!this.showPicker) {
      const button = this.shadowRoot?.querySelector(
        ".color-button"
      ) as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        this.pickerPosition = {
          top: rect.bottom + 4,
          left: rect.left,
        };
      }
    }

    this.showPicker = !this.showPicker;
  }

  private handleClickOutside(e: MouseEvent) {
    if (!this.showPicker) return;

    const path = e.composedPath();
    const clickedInside = path.some(
      (el) =>
        el === this.shadowRoot?.querySelector(".color-picker") ||
        el === this.portalContainer
    );

    if (!clickedInside) {
      this.showPicker = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this)
    );
    this.cleanupPortal();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (changedProperties.has("showPicker")) {
      if (this.showPicker) {
        this.renderToBody();
      } else {
        this.cleanupPortal();
      }
    }
  }

  private renderToBody() {
    if (!this.portalContainer) {
      this.portalContainer = document.createElement("div");
      document.body.appendChild(this.portalContainer);
    }

    // Use Lit's render function to render the swatch panel
    import("lit/html.js").then(({ render }) => {
      if (!this.portalContainer) return;

      render(
        html`
          <div
            class="swatch-panel-portal"
            style="
              position: fixed;
              top: ${this.pickerPosition.top}px;
              left: ${this.pickerPosition.left}px;
              z-index: 999999;
              padding: 0.75rem;
              background: var(--cds-layer);
              border: 1px solid var(--cds-border-subtle-01);
              border-radius: 4px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            "
          >
            ${Object.entries(CAT_COLOR_SWATCHES).map(
              ([family, colors]) => html`
                <div
                  style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;"
                >
                  ${colors.map(
                    (color) => html`
                      <button
                        class="swatch ${this.value === color
                          ? "selected"
                          : ""}"
                        style="
                          width: 32px;
                          height: 32px;
                          border: 2px solid ${this.value === color
                          ? "var(--cds-border-interactive)"
                          : "transparent"};
                          border-radius: 4px;
                          cursor: pointer;
                          padding: 0;
                          background-color: ${color};
                          transition: all 0.15s ease;
                        "
                        @click=${() => this.handleSwatchClick(color)}
                        @mouseenter=${(e: Event) => {
                          const btn = e.target as HTMLElement;
                          btn.style.transform = "scale(1.1)";
                          btn.style.borderColor =
                            "var(--cds-border-interactive)";
                        }}
                        @mouseleave=${(e: Event) => {
                          const btn = e.target as HTMLElement;
                          btn.style.transform = "scale(1)";
                          if (this.value !== color) {
                            btn.style.borderColor = "transparent";
                          }
                        }}
                        title="${family}: ${color}"
                      ></button>
                    `
                  )}
                </div>
              `
            )}
          </div>
        `,
        this.portalContainer
      );
    });
  }

  private cleanupPortal() {
    if (this.portalContainer) {
      this.portalContainer.remove();
      this.portalContainer = undefined;
    }
  }

  render() {
    return html`
      <div class="color-picker">
        ${this.label
          ? html`<label class="label">${this.label}</label>`
          : ""}

        <button
          class="color-button"
          @click=${this.togglePicker}
          style="--color-value: ${this.value}"
        >
          <span class="color-preview"></span>
          <span class="color-value">${this.value}</span>
        </button>

        <!-- Swatch panel rendered to document.body via portal -->
      </div>
    `;
  }
}
