import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colorPickerStyles } from "./cat-color-picker.styles.js";

/**
 * Custom Color Picker Component
 * A compact color picker
 */
@customElement("cat-color-picker")
export class CatColorPicker extends LitElement {
  static styles = colorPickerStyles;

  @property({ type: String })
  value = "#000000";

  @property({ type: String })
  label = "";

  @state()
  private internalValue = "#000000";

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("value")) {
      this.internalValue = this.value;
    }
  }

  private handleColorChange(e: CustomEvent) {
    // Check if detail exists and has value
    if (!e.detail || e.detail.value === undefined) {
      // Try to get value from target element
      const target = e.target as any;
      if (target && target.value) {
        this.internalValue = target.value;
        this.value = target.value;
      } else {
        return;
      }
    } else {
      this.internalValue = e.detail.value;
      this.value = e.detail.value;
    }

    this.dispatchEvent(
      new CustomEvent("color-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <div
        class="color-picker"
        style="--color-value: ${this.internalValue}"
      >
        ${this.label
          ? html`<label class="label">${this.label}</label>`
          : ""}

        <label class="color-button">
          <input
            type="color"
            .value=${this.internalValue}
            @input=${this.handleColorChange}
            @change=${this.handleColorChange}
          />
          <span class="color-preview"></span>
          <span class="color-value">${this.internalValue}</span>
        </label>
      </div>
    `;
  }
}
