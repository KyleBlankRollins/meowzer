import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbSliderStyles } from "./mb-slider.style.js";

/**
 * Slider component for numeric value selection.
 *
 * @element mb-slider
 *
 * @fires mb-input - Fired when the slider value changes during drag
 * @fires mb-change - Fired when the slider value changes and user releases
 *
 * @cssprop --mb-color-interactive-primary - Slider track and thumb color
 * @cssprop --mb-color-border-subtle - Track background color
 * @cssprop --mb-color-text-primary - Label color
 * @cssprop --mb-color-text-secondary - Value and helper text color
 *
 * @csspart slider - The slider container
 * @csspart label - The label element
 * @csspart value - The value display element
 * @csspart input - The range input element
 * @csspart helper - The helper text element
 */
@customElement("mb-slider")
export class MbSlider extends LitElement {
  static styles = [baseStyles, mbSliderStyles];

  /**
   * Label text for the slider
   */
  @property({ type: String })
  declare label: string;

  /**
   * Minimum value
   */
  @property({ type: Number })
  declare min: number;

  /**
   * Maximum value
   */
  @property({ type: Number })
  declare max: number;

  /**
   * Step increment
   */
  @property({ type: Number })
  declare step: number;

  /**
   * Current value
   */
  @property({ type: Number })
  declare value: number;

  /**
   * Whether to show the current value
   */
  @property({ type: Boolean, attribute: "show-value" })
  declare showValue: boolean;

  /**
   * Number of decimal places to display
   */
  @property({ type: Number, attribute: "decimal-places" })
  declare decimalPlaces: number;

  /**
   * Helper text
   */
  @property({ type: String })
  declare helper: string;

  /**
   * Whether the slider is disabled
   */
  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @state()
  private progressWidth = "0%";

  constructor() {
    super();
    this.label = "";
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 0;
    this.showValue = true;
    this.decimalPlaces = 0;
    this.helper = "";
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateProgress();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("value") ||
      changedProperties.has("min") ||
      changedProperties.has("max")
    ) {
      this.updateProgress();
    }
  }

  private updateProgress() {
    const range = this.max - this.min;
    const percent =
      range > 0 ? ((this.value - this.min) / range) * 100 : 0;
    this.progressWidth = `${Math.max(0, Math.min(100, percent))}%`;
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const newValue = parseFloat(input.value);

    this.value = newValue;
    this.updateProgress();

    this.dispatchEvent(
      new CustomEvent("mb-input", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const newValue = parseFloat(input.value);

    this.dispatchEvent(
      new CustomEvent("mb-change", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private formatValue(value: number): string {
    return value.toFixed(this.decimalPlaces);
  }

  render() {
    return html`
      <div class="mb-slider" part="slider">
        ${this.label || this.showValue
          ? html`
              <div class="mb-slider__header">
                ${this.label
                  ? html`
                      <label class="mb-slider__label" part="label">
                        ${this.label}
                      </label>
                    `
                  : ""}
                ${this.showValue
                  ? html`
                      <span class="mb-slider__value" part="value">
                        ${this.formatValue(this.value)}
                      </span>
                    `
                  : ""}
              </div>
            `
          : ""}

        <div class="mb-slider__track-container">
          <div
            class="mb-slider__progress"
            style="width: ${this.progressWidth}"
          ></div>
          <input
            type="range"
            class="mb-slider__input"
            part="input"
            min="${this.min}"
            max="${this.max}"
            step="${this.step}"
            .value="${String(this.value)}"
            ?disabled=${this.disabled}
            @input=${this.handleInput}
            @change=${this.handleChange}
            aria-label=${this.label || "Slider"}
            aria-valuemin="${this.min}"
            aria-valuemax="${this.max}"
            aria-valuenow="${this.value}"
          />
        </div>

        ${this.helper
          ? html`
              <div class="mb-slider__helper" part="helper">
                ${this.helper}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-slider": MbSlider;
  }
}
