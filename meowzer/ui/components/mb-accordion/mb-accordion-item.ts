import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { accordionItemStyles } from "./mb-accordion.style.js";

/**
 * Accordion item component representing a single collapsible section.
 *
 * @element mb-accordion-item
 *
 * @slot - Content to display when expanded
 * @slot title - Title content for the accordion header
 *
 * @fires mb-toggle - Fired when the item is toggled
 *
 * @cssprop --mb-color-background - Background color
 * @cssprop --mb-color-background-hover - Hover background color
 * @cssprop --mb-color-border - Border color
 * @cssprop --mb-color-text-primary - Primary text color
 * @cssprop --mb-color-text-secondary - Secondary text color
 * @cssprop --mb-color-focus - Focus outline color
 */
@customElement("mb-accordion-item")
export class MbAccordionItem extends LitElement {
  static styles = accordionItemStyles;

  /**
   * Title text for the accordion header
   */
  @property({ type: String })
  declare title: string;

  /**
   * Whether the accordion item is open
   */
  @property({ type: Boolean, reflect: true })
  declare open: boolean;

  /**
   * Disable the accordion item
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  constructor() {
    super();
    this.title = "";
    this.open = false;
    this.disabled = false;
  }

  private handleToggle = (): void => {
    if (this.disabled) return;

    this.open = !this.open;

    this.dispatchEvent(
      new CustomEvent("mb-toggle", {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleToggle();
    }
  };

  render() {
    const chevronIcon = html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z" />
      </svg>
    `;

    return html`
      <div class="mb-accordion-item" part="base">
        <button
          class="mb-accordion-item__header"
          part="header"
          @click=${this.handleToggle}
          @keydown=${this.handleKeyDown}
          ?disabled=${this.disabled}
          aria-expanded=${this.open}
          aria-controls="content"
        >
          <span class="mb-accordion-item__title" part="title">
            <slot name="title">${this.title}</slot>
          </span>
          <span class="mb-accordion-item__icon" part="icon">
            ${chevronIcon}
          </span>
        </button>

        <div
          id="content"
          class="mb-accordion-item__content"
          part="content"
          role="region"
          aria-hidden=${!this.open}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-accordion-item": MbAccordionItem;
  }
}
