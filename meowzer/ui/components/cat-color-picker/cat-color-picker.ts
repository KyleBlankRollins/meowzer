import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colorPickerStyles } from "./cat-color-picker.styles.js";

/**
 * Cat color swatches organized by color family
 * Each family has 4 variants: dark, medium, light, very light
 */
const CAT_COLOR_SWATCHES = {
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
    this.showPicker = !this.showPicker;
  }

  private handleClickOutside(e: MouseEvent) {
    const path = e.composedPath();
    const clickedInside = path.some(
      (el) => el === this.shadowRoot?.querySelector(".color-picker")
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

        ${this.showPicker
          ? html`
              <div class="swatch-panel">
                ${Object.entries(CAT_COLOR_SWATCHES).map(
                  ([family, colors]) => html`
                    <div class="swatch-row">
                      ${colors.map(
                        (color) => html`
                          <button
                            class="swatch ${this.value === color
                              ? "selected"
                              : ""}"
                            style="background-color: ${color}"
                            @click=${() =>
                              this.handleSwatchClick(color)}
                            title="${family}: ${color}"
                          ></button>
                        `
                      )}
                    </div>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
}
