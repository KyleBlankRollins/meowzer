import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbLoadingStyles } from "./mb-loading.style.js";

/**
 * Loading spinner component with multiple sizes and overlay mode.
 *
 * @element mb-loading
 *
 * @slot - Optional text content to display next to spinner
 *
 * @cssprop --mb-color-interactive-default - Spinner color
 * @cssprop --mb-color-text-secondary - Text color (inline mode)
 * @cssprop --mb-color-text-primary - Text color (overlay mode)
 * @cssprop --mb-color-surface-default - Overlay background
 *
 * @csspart spinner - The spinner element
 * @csspart text - The text element
 */
@customElement("mb-loading")
export class MbLoading extends LitElement {
  static styles = [baseStyles, mbLoadingStyles];

  /**
   * Size of the loading spinner
   * @type {"sm" | "md" | "lg"}
   */
  @property({ type: String })
  declare size: "sm" | "md" | "lg";

  /**
   * Whether to display as fullscreen overlay
   */
  @property({ type: Boolean })
  declare overlay: boolean;

  /**
   * Optional loading text
   */
  @property({ type: String })
  declare text: string;

  constructor() {
    super();
    this.size = "md";
    this.overlay = false;
    this.text = "";
  }

  render() {
    const classes = [
      "mb-loading",
      `mb-loading--${this.size}`,
      this.overlay ? "mb-loading--overlay" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const content = html`
      <div class="${classes}">
        <div class="mb-loading__spinner" part="spinner"></div>
        <div class="mb-loading__text" part="text">
          ${this.text ? this.text : html`<slot></slot>`}
        </div>
      </div>
    `;

    // If overlay mode, wrap in overlay container
    if (this.overlay) {
      return html`<div class="mb-loading--overlay">${content}</div>`;
    }

    return content;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-loading": MbLoading;
  }
}
