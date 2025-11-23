import { LitElement, html } from "lit";
import {
  customElement,
  property,
  state,
  query,
} from "lit/decorators.js";
import { colorPickerStyles } from "./cat-color-picker.styles.js";
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker.js";
import type SlColorPicker from "@shoelace-style/shoelace/dist/components/color-picker/color-picker.js";

/**
 * Color Picker Component using Shoelace with Portal
 * Renders the inline color picker in document.body to escape modal transform context
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

  @query(".color-button")
  private colorButton?: HTMLElement;

  private portalContainer?: HTMLDivElement;
  private portalPicker?: SlColorPicker;

  private handleColorChange(e: Event) {
    const picker = e.target as SlColorPicker;
    this.value = picker.value;

    this.dispatchEvent(
      new CustomEvent("color-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private togglePicker() {
    if (!this.showPicker && this.colorButton) {
      const rect = this.colorButton.getBoundingClientRect();
      this.pickerPosition = {
        top: rect.bottom + 4,
        left: rect.left,
      };
    }
    this.showPicker = !this.showPicker;
  }

  private handleClickOutside = (e: MouseEvent) => {
    if (!this.showPicker) return;

    const path = e.composedPath();
    const clickedInside = path.some(
      (el) => el === this.colorButton || el === this.portalContainer
    );

    if (!clickedInside) {
      this.showPicker = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleClickOutside);
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

    // Update portal picker value when component value changes
    if (changedProperties.has("value") && this.portalPicker) {
      this.portalPicker.value = this.value;
    }
  }

  private renderToBody() {
    if (!this.portalContainer) {
      this.portalContainer = document.createElement("div");
      this.portalContainer.style.cssText = `
        position: fixed;
        top: ${this.pickerPosition.top}px;
        left: ${this.pickerPosition.left}px;
        z-index: 999999;
      `;
      document.body.appendChild(this.portalContainer);
    }

    // Create Shoelace color picker element
    if (!this.portalPicker) {
      this.portalPicker = document.createElement(
        "sl-color-picker"
      ) as SlColorPicker;
      this.portalPicker.setAttribute("inline", "");
      this.portalPicker.format = "hex";
      this.portalPicker.value = this.value;

      // Listen to change events
      this.portalPicker.addEventListener("sl-change", (e) => {
        this.handleColorChange(e);
      });

      this.portalContainer.appendChild(this.portalPicker);
    }
  }

  private cleanupPortal() {
    if (this.portalPicker) {
      this.portalPicker.remove();
      this.portalPicker = undefined;
    }
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

        <!-- Color picker rendered to document.body via portal -->
      </div>
    `;
  }
}
