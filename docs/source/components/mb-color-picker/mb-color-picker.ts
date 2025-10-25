import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colorPickerStyles } from "./mb-color-picker.styles.js";

/**
 * Custom Color Picker Component
 * A compact color button that opens Quiet UI's color picker in a popover
 */
@customElement("mb-color-picker")
export class MbColorPicker extends LitElement {
  static styles = colorPickerStyles;

  @property({ type: String })
  value = "#000000";

  @property({ type: String })
  label = "";

  @state()
  private get buttonId() {
    return `color-button-${this.label
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
  }

  private handleColorChange(e: CustomEvent) {
    this.value = e.detail.value;
    this.dispatchEvent(
      new CustomEvent("color-change", {
        detail: { value: this.value },
      })
    );
  }

  render() {
    return html`
      <div class="color-picker">
        ${this.label
          ? html`<label class="label">${this.label}</label>`
          : ""}

        <quiet-button id=${this.buttonId} variant="neutral">
          <span
            class="color-preview"
            style="background-color: ${this.value}"
          ></span>
          <span class="color-value">${this.value}</span>
        </quiet-button>

        <quiet-popover for=${this.buttonId} placement="bottom-start">
          <quiet-color-picker
            label=${this.label || "Color"}
            .value=${this.value}
            format="hex"
            with-input
            size="sm"
            @quiet-change=${this.handleColorChange}
            @quiet-input=${this.handleColorChange}
          ></quiet-color-picker>
        </quiet-popover>
      </div>
    `;
  }
}
