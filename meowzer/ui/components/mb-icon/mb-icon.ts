import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { iconStyles } from "./mb-icon.style.js";

/**
 * Icon component for displaying SVG icons.
 *
 * @element mb-icon
 *
 * @slot - Default slot for SVG content
 *
 * @cssprop --mb-icon-size - Custom icon size
 */
@customElement("mb-icon")
export class MbIcon extends LitElement {
  static styles = iconStyles;

  /**
   * Predefined size variant
   */
  @property({ type: String, reflect: true })
  declare size: "16" | "20" | "24" | "32" | "48";

  /**
   * SVG content as string (for inline usage)
   */
  @property({ type: String })
  declare svg: string;

  /**
   * Icon name (for future icon library integration)
   */
  @property({ type: String })
  declare name: string;

  /**
   * Accessible label for the icon
   */
  @property({ type: String })
  declare label: string;

  constructor() {
    super();
    this.size = "24";
    this.svg = "";
    this.name = "";
    this.label = "";
  }

  render() {
    const hasLabel = this.label !== "";
    const role = hasLabel ? "img" : "presentation";
    const ariaLabel = hasLabel ? this.label : undefined;

    // If SVG string is provided, render it
    if (this.svg) {
      return html`
        <div
          role=${role}
          aria-label=${ariaLabel || nothing}
          part="icon"
        >
          ${unsafeHTML(this.svg)}
        </div>
      `;
    }

    // Otherwise use slotted content
    return html`
      <div
        role=${role}
        aria-label=${ariaLabel || nothing}
        part="icon"
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-icon": MbIcon;
  }
}
