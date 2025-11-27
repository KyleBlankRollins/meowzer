import { LitElement, html, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbCheckboxStyles } from "./mb-checkbox.style.js";

/**
 * Checkbox component for boolean selection.
 *
 * @element mb-checkbox
 *
 * @slot - Checkbox label content
 *
 * @fires mb-change - Fired when the checkbox state changes
 *
 * @cssprop --mb-color-interactive-primary - Checked state background
 * @cssprop --mb-color-border-subtle - Default border color
 * @cssprop --mb-color-text-primary - Label text color
 *
 * @csspart checkbox - The checkbox container
 * @csspart input - The input element
 * @csspart box - The visual checkbox box
 * @csspart label - The label element
 * @csspart helper - The helper text element
 * @csspart error - The error message element
 */
@customElement("mb-checkbox")
export class MbCheckbox extends LitElement {
  static styles = [baseStyles, mbCheckboxStyles];

  /**
   * Whether the checkbox is checked
   */
  @property({ type: Boolean })
  declare checked: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   */
  @property({ type: Boolean })
  declare indeterminate: boolean;

  /**
   * Whether the checkbox is disabled
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  /**
   * Helper text displayed below checkbox
   */
  @property({ type: String })
  declare helper: string;

  /**
   * Error message displayed when error is true
   */
  @property({ type: String, attribute: "error-message" })
  declare errorMessage: string;

  /**
   * Whether the checkbox is in error state
   */
  @property({ type: Boolean, reflect: true })
  declare error: boolean;

  /**
   * Name attribute for form submission
   */
  @property({ type: String })
  declare name: string;

  /**
   * Value attribute for form submission
   */
  @property({ type: String })
  declare value: string;

  /**
   * Whether the checkbox is required
   */
  @property({ type: Boolean })
  declare required: boolean;

  @query(".mb-checkbox__input")
  private inputElement!: HTMLInputElement;

  constructor() {
    super();
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.helper = "";
    this.errorMessage = "";
    this.error = false;
    this.name = "";
    this.value = "";
    this.required = false;
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("indeterminate")) {
      if (this.inputElement) {
        this.inputElement.indeterminate = this.indeterminate;
      }
    }
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false; // Clear indeterminate on user interaction

    this.dispatchEvent(
      new CustomEvent("mb-change", {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClick(e: Event) {
    // Prevent double-firing when clicking label
    if ((e.target as HTMLElement).tagName === "LABEL") {
      e.preventDefault();
    }
  }

  render() {
    const showError = this.error && this.errorMessage;
    const showHelper = !showError && this.helper;

    const checkmark = svg`
      <svg
        class="mb-checkbox__checkmark"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        part="checkmark"
      >
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;

    return html`
      <div>
        <label
          class="mb-checkbox ${this.disabled
            ? "mb-checkbox--disabled"
            : ""}"
          part="checkbox"
          @click=${this.handleClick}
        >
          <div class="mb-checkbox__input-wrapper">
            <input
              type="checkbox"
              class="mb-checkbox__input"
              part="input"
              .checked=${this.checked}
              .indeterminate=${this.indeterminate}
              ?disabled=${this.disabled}
              ?required=${this.required}
              name=${this.name}
              value=${this.value}
              @change=${this.handleChange}
              aria-checked=${this.indeterminate
                ? "mixed"
                : this.checked
                ? "true"
                : "false"}
              aria-invalid=${this.error ? "true" : "false"}
            />
            <div class="mb-checkbox__box" part="box">
              ${checkmark}
              <div class="mb-checkbox__dash" part="dash"></div>
            </div>
          </div>
          <div class="mb-checkbox__label" part="label">
            <slot></slot>
          </div>
        </label>

        ${showHelper
          ? html`
              <div class="mb-checkbox__helper" part="helper">
                ${this.helper}
              </div>
            `
          : ""}
        ${showError
          ? html`
              <div class="mb-checkbox__error" part="error">
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
    "mb-checkbox": MbCheckbox;
  }
}
