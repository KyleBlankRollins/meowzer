import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbTextInputStyles } from "./mb-text-input.style.js";

/**
 * Text input component for single-line text entry.
 *
 * @element mb-text-input
 *
 * @fires mb-input - Fired when the input value changes
 * @fires mb-change - Fired when the input loses focus after value change
 * @fires mb-blur - Fired when the input loses focus
 * @fires mb-focus - Fired when the input gains focus
 *
 * @cssprop --mb-color-interactive-primary - Focus border color
 * @cssprop --mb-color-border-subtle - Default border color
 * @cssprop --mb-color-text-primary - Input text color
 * @cssprop --mb-color-surface-default - Input background color
 *
 * @csspart input-container - The input container element
 * @csspart label - The label element
 * @csspart input - The input element
 * @csspart helper - The helper text element
 * @csspart error - The error message element
 */
@customElement("mb-text-input")
export class MbTextInput extends LitElement {
  static styles = [baseStyles, mbTextInputStyles];

  /**
   * Label text for the input
   */
  @property({ type: String })
  declare label: string;

  /**
   * Current value of the input
   */
  @property({ type: String })
  declare value: string;

  /**
   * Placeholder text
   */
  @property({ type: String })
  declare placeholder: string;

  /**
   * Helper text displayed below input
   */
  @property({ type: String })
  declare helper: string;

  /**
   * Error message displayed when error is true
   */
  @property({ type: String, attribute: "error-message" })
  declare errorMessage: string;

  /**
   * Whether the input is in error state
   */
  @property({ type: Boolean, reflect: true })
  declare error: boolean;

  /**
   * Whether the input is required
   */
  @property({ type: Boolean })
  declare required: boolean;

  /**
   * Whether the input is disabled
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  /**
   * Input type (text, email, password, etc.)
   */
  @property({ type: String })
  declare type: string;

  /**
   * Maximum length of input value
   */
  @property({ type: Number })
  declare maxlength: number | undefined;

  /**
   * Name attribute for form submission
   */
  @property({ type: String })
  declare name: string;

  /**
   * Autocomplete attribute
   */
  @property({ type: String })
  declare autocomplete: string;

  @query(".mb-text-input__input")
  private inputElement!: HTMLInputElement;

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.placeholder = "";
    this.helper = "";
    this.errorMessage = "";
    this.error = false;
    this.required = false;
    this.disabled = false;
    this.type = "text";
    this.name = "";
    this.autocomplete = "";
  }

  /**
   * Focus the input element
   */
  focus() {
    this.inputElement?.focus();
  }

  /**
   * Blur the input element
   */
  blur() {
    this.inputElement?.blur();
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;

    this.dispatchEvent(
      new CustomEvent("mb-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange() {
    this.dispatchEvent(
      new CustomEvent("mb-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleFocus(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent("mb-focus", {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(e: FocusEvent) {
    this.dispatchEvent(
      new CustomEvent("mb-blur", {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const showError = this.error && this.errorMessage;
    const showHelper = !showError && this.helper;

    return html`
      <div class="mb-text-input" part="input-container">
        ${this.label
          ? html`
              <label
                class="mb-text-input__label ${this.required
                  ? "mb-text-input__label--required"
                  : ""}"
                part="label"
              >
                ${this.label}
              </label>
            `
          : ""}

        <div class="mb-text-input__input-wrapper">
          <input
            type="${this.type as any}"
            class="mb-text-input__input"
            part="input"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            maxlength=${this.maxlength ?? ""}
            name=${this.name}
            autocomplete=${this.autocomplete as any}
            @input=${this.handleInput}
            @change=${this.handleChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
            aria-label=${this.label || this.placeholder}
            aria-invalid=${this.error ? "true" : "false"}
            aria-describedby=${showError
              ? "error-message"
              : showHelper
              ? "helper-text"
              : ""}
          />
        </div>

        ${showError
          ? html`
              <div
                id="error-message"
                class="mb-text-input__error"
                part="error"
              >
                ${this.errorMessage}
              </div>
            `
          : ""}
        ${showHelper
          ? html`
              <div
                id="helper-text"
                class="mb-text-input__helper"
                part="helper"
              >
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
    "mb-text-input": MbTextInput;
  }
}
