import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbTextareaStyles } from "./mb-textarea.style.js";

/**
 * Textarea component for multi-line text entry.
 *
 * @element mb-textarea
 *
 * @fires mb-input - Fired when the textarea value changes
 * @fires mb-change - Fired when the textarea loses focus after value change
 * @fires mb-blur - Fired when the textarea loses focus
 * @fires mb-focus - Fired when the textarea gains focus
 *
 * @cssprop --mb-color-interactive-primary - Focus border color
 * @cssprop --mb-color-border-subtle - Default border color
 * @cssprop --mb-color-text-primary - Textarea text color
 * @cssprop --mb-color-surface-default - Textarea background color
 *
 * @csspart textarea-container - The textarea container element
 * @csspart label - The label element
 * @csspart textarea - The textarea element
 * @csspart helper - The helper text element
 * @csspart error - The error message element
 * @csspart counter - The character counter element
 */
@customElement("mb-textarea")
export class MbTextarea extends LitElement {
  static styles = [baseStyles, mbTextareaStyles];

  /**
   * Label text for the textarea
   */
  @property({ type: String })
  declare label: string;

  /**
   * Current value of the textarea
   */
  @property({ type: String })
  declare value: string;

  /**
   * Placeholder text
   */
  @property({ type: String })
  declare placeholder: string;

  /**
   * Helper text displayed below textarea
   */
  @property({ type: String })
  declare helper: string;

  /**
   * Error message displayed when error is true
   */
  @property({ type: String, attribute: "error-message" })
  declare errorMessage: string;

  /**
   * Whether the textarea is in error state
   */
  @property({ type: Boolean, reflect: true })
  declare error: boolean;

  /**
   * Whether the textarea is required
   */
  @property({ type: Boolean })
  declare required: boolean;

  /**
   * Whether the textarea is disabled
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  /**
   * Number of visible text rows
   */
  @property({ type: Number })
  declare rows: number;

  /**
   * Maximum length of textarea value
   */
  @property({ type: Number })
  declare maxlength: number | undefined;

  /**
   * Whether to show character counter
   */
  @property({ type: Boolean, attribute: "show-counter" })
  declare showCounter: boolean;

  /**
   * Whether the textarea is resizable
   */
  @property({ type: String, reflect: true })
  declare resizable: "true" | "false";

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

  @query(".mb-textarea__textarea")
  private textareaElement!: HTMLTextAreaElement;

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
    this.rows = 3;
    this.showCounter = false;
    this.resizable = "true";
    this.name = "";
    this.autocomplete = "";
  }

  /**
   * Focus the textarea element
   */
  focus() {
    this.textareaElement?.focus();
  }

  /**
   * Blur the textarea element
   */
  blur() {
    this.textareaElement?.blur();
  }

  private handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;

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

  private getCounterClass(): string {
    if (!this.maxlength) return "mb-textarea__counter";

    const remaining = this.maxlength - this.value.length;
    const warningThreshold = Math.max(10, this.maxlength * 0.1);

    if (remaining <= 0) {
      return "mb-textarea__counter mb-textarea__counter--error";
    } else if (remaining <= warningThreshold) {
      return "mb-textarea__counter mb-textarea__counter--warning";
    }
    return "mb-textarea__counter";
  }

  render() {
    const showError = this.error && this.errorMessage;
    const showHelper = !showError && this.helper;
    const showCounterElement =
      this.showCounter && this.maxlength !== undefined;

    return html`
      <div class="mb-textarea" part="textarea-container">
        ${this.label
          ? html`
              <label
                class="mb-textarea__label ${this.required
                  ? "mb-textarea__label--required"
                  : ""}"
                part="label"
              >
                ${this.label}
              </label>
            `
          : ""}

        <div class="mb-textarea__textarea-wrapper">
          <textarea
            class="mb-textarea__textarea"
            part="textarea"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?required=${this.required}
            ?disabled=${this.disabled}
            rows=${this.rows}
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
          ></textarea>
        </div>

        ${showCounterElement
          ? html`
              <div class="${this.getCounterClass()}" part="counter">
                ${this.value.length}/${this.maxlength}
              </div>
            `
          : ""}
        ${showError
          ? html`
              <div
                id="error-message"
                class="mb-textarea__error"
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
                class="mb-textarea__helper"
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
    "mb-textarea": MbTextarea;
  }
}
