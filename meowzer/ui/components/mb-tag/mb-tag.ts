import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbTagStyles } from "./mb-tag.style.js";

/**
 * Tag component for labels, categories, and badges.
 *
 * @element mb-tag
 *
 * @slot - Tag text content
 *
 * @fires mb-remove - Fired when remove button is clicked
 *
 * @cssprop --mb-color-surface-subtle - Gray variant background
 * @cssprop --mb-color-text-primary - Gray variant text
 * @cssprop --mb-color-border-subtle - Gray variant border
 *
 * @csspart tag - The tag container
 * @csspart remove - The remove button
 */
@customElement("mb-tag")
export class MbTag extends LitElement {
  static styles = [baseStyles, mbTagStyles];

  /**
   * Color variant of the tag
   * @type {"gray" | "blue" | "green" | "red" | "yellow" | "purple"}
   */
  @property({ type: String })
  declare variant:
    | "gray"
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "purple";

  /**
   * Size of the tag
   * @type {"sm" | "md" | "lg"}
   */
  @property({ type: String })
  declare size: "sm" | "md" | "lg";

  /**
   * Whether the tag can be removed
   */
  @property({ type: Boolean })
  declare removable: boolean;

  constructor() {
    super();
    this.variant = "gray";
    this.size = "md";
    this.removable = false;
  }

  private handleRemove(e: Event) {
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("mb-remove", {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [
      "mb-tag",
      `mb-tag--${this.variant}`,
      `mb-tag--${this.size}`,
    ].join(" ");

    return html`
      <span class="${classes}" part="tag">
        <slot></slot>
        ${this.removable
          ? html`
              <button
                class="mb-tag__remove"
                part="remove"
                @click=${this.handleRemove}
                aria-label="Remove tag"
              ></button>
            `
          : ""}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-tag": MbTag;
  }
}
