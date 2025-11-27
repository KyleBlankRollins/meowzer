import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { accordionStyles } from "./mb-accordion.style.js";

/**
 * Accordion container component for organizing collapsible content sections.
 *
 * @element mb-accordion
 *
 * @slot - Accordion items (mb-accordion-item elements)
 *
 * @fires mb-change - Fired when any accordion item opens or closes
 */
@customElement("mb-accordion")
export class MbAccordion extends LitElement {
  static styles = accordionStyles;

  render() {
    return html`
      <div class="mb-accordion" part="base" role="group">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-accordion": MbAccordion;
  }
}
