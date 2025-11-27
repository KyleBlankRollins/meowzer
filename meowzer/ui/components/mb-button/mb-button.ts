import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbButtonStyles } from "./mb-button.style.js";
import { baseStyles } from "../../shared/base-styles.js";

/**
 * A customizable button component with multiple variants, sizes, and states.
 *
 * @element mb-button
 *
 * @slot - Default slot for button text
 * @slot icon - Optional icon slot
 *
 * @fires mb-click - Fired when the button is clicked (if not disabled or loading)
 *
 * @csspart button - The button element
 */
@customElement("mb-button")
export class MbButton extends LitElement {
  static styles = [baseStyles, mbButtonStyles];

  /**
   * Button variant style
   */
  @property({ type: String })
  variant: "primary" | "secondary" | "tertiary" = "primary";

  /**
   * Button size
   */
  @property({ type: String })
  size: "sm" | "md" | "lg" = "md";

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean })
  disabled = false;

  /**
   * Whether the button is in a loading state
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * Button type attribute (for form submissions)
   */
  @property({ type: String })
  type: "button" | "submit" | "reset" = "button";

  private handleClick(e: Event) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("mb-click", {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [
      "mb-button",
      `mb-button--${this.variant}`,
      `mb-button--${this.size}`,
      this.loading ? "mb-button--loading" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <button
        part="button"
        class=${classes}
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
        aria-busy=${this.loading}
      >
        <slot name="icon"></slot>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-button": MbButton;
  }
}
