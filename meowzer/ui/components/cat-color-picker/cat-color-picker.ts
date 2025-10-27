import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colorPickerStyles } from "./cat-color-picker.styles.js";

/**
 * Custom Color Picker Component
 * A compact color button that opens Quiet UI's color picker in a popover
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

  @state()
  private get buttonId() {
    return `color-button-${this.label
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
  }

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
      <div class="color-picker">
        ${this.label
          ? html`<label class="label">${this.label}</label>`
          : ""}

        <quiet-button id=${this.buttonId} variant="neutral">
          <span
            class="color-preview"
            style="background-color: ${this.internalValue}"
          ></span>
          <span class="color-value">${this.internalValue}</span>
        </quiet-button>

        <quiet-popover for=${this.buttonId} placement="bottom-start">
          <quiet-color-picker
            label=${this.label || "Color"}
            .value=${this.internalValue}
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
