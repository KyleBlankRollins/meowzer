import { LitElement, html, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbSelectStyles } from "./mb-select.style.js";

/**
 * Select dropdown component for choosing from a list of options.
 *
 * @element mb-select
 *
 * @slot - Select options (use native <option> elements)
 *
 * @fires mb-change - Fired when the selected value changes
 *
 * @cssprop --mb-color-interactive-primary - Focus and hover color
 * @cssprop --mb-color-border-subtle - Default border color
 * @cssprop --mb-color-text-primary - Label and selected text color
 *
 * @csspart select - The select container
 * @csspart label - The label element
 * @csspart native - The native select element
 * @csspart chevron - The chevron icon
 * @csspart helper - The helper text element
 * @csspart error - The error message element
 */
@customElement("mb-select")
export class MbSelect extends LitElement {
  static styles = [baseStyles, mbSelectStyles];

  /**
   * Label text for the select
   */
  @property({ type: String })
  declare label: string;

  /**
   * Selected value
   */
  @property({ type: String })
  declare value: string;

  /**
   * Helper text displayed below select
   */
  @property({ type: String })
  declare helper: string;

  /**
   * Error message displayed when error is true
   */
  @property({ type: String, attribute: "error-message" })
  declare errorMessage: string;

  /**
   * Whether the select is in error state
   */
  @property({ type: Boolean, reflect: true })
  declare error: boolean;

  /**
   * Whether the select is disabled
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  /**
   * Whether the select is required
   */
  @property({ type: Boolean })
  declare required: boolean;

  /**
   * Name attribute for form submission
   */
  @property({ type: String })
  declare name: string;

  /**
   * Size variant
   */
  @property({ type: String, reflect: true })
  declare size: "sm" | "md" | "lg";

  /**
   * Placeholder text when no option is selected
   */
  @property({ type: String })
  declare placeholder: string;

  @query(".mb-select__native")
  private selectElement!: HTMLSelectElement;

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.helper = "";
    this.errorMessage = "";
    this.error = false;
    this.disabled = false;
    this.required = false;
    this.name = "";
    this.size = "md";
    this.placeholder = "";
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("value")) {
      if (this.selectElement) {
        this.selectElement.value = this.value;
      }
    }
  }

  private handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;

    this.dispatchEvent(
      new CustomEvent("mb-change", {
        detail: {
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Focus the select element
   */
  focus() {
    this.selectElement?.focus();
  }

  /**
   * Blur the select element
   */
  blur() {
    this.selectElement?.blur();
  }

  render() {
    const showError = this.error && this.errorMessage;
    const showHelper = !showError && this.helper;

    const chevronIcon = svg`
      <svg
        class="mb-select__chevron"
        part="chevron"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;

    return html`
      <div class="mb-select" part="select">
        ${this.label
          ? html`
              <label
                class="mb-select__label"
                part="label"
                for="select"
              >
                ${this.label}
                ${this.required
                  ? html`<span class="mb-select__required">*</span>`
                  : ""}
              </label>
            `
          : ""}

        <div class="mb-select__wrapper">
          <select
            id="select"
            class="mb-select__native"
            part="native"
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            @change=${this.handleChange}
            aria-invalid=${this.error ? "true" : "false"}
            aria-describedby=${showHelper
              ? "helper"
              : showError
              ? "error"
              : ""}
          >
            ${this.placeholder
              ? html`<option
                  value=""
                  disabled
                  ?selected=${!this.value}
                >
                  ${this.placeholder}
                </option>`
              : ""}
            <slot></slot>
          </select>
          ${chevronIcon}
        </div>

        ${showHelper
          ? html`
              <div
                id="helper"
                class="mb-select__helper"
                part="helper"
              >
                ${this.helper}
              </div>
            `
          : ""}
        ${showError
          ? html`
              <div id="error" class="mb-select__error" part="error">
                ${this.errorMessage}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-select": MbSelect;
  }
}
