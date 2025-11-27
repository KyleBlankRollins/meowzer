import { LitElement, html } from "lit";
import {
  customElement,
  property,
  query,
  state,
} from "lit/decorators.js";
import { popoverStyles } from "./mb-popover.style.js";

/**
 * A popover component that displays content in a floating panel.
 *
 * @slot - The trigger element that opens the popover
 * @slot content - The content to display in the popover
 *
 * @fires mb-show - Fired when the popover is shown
 * @fires mb-hide - Fired when the popover is hidden
 *
 * @csspart trigger - The trigger element wrapper
 * @csspart content - The popover content container
 * @csspart arrow - The popover arrow
 */
@customElement("mb-popover")
export class MbPopover extends LitElement {
  static styles = popoverStyles;

  /**
   * The position of the popover relative to the trigger
   */
  @property({ type: String })
  position: "top" | "bottom" | "left" | "right" = "bottom";

  /**
   * The trigger event type
   */
  @property({ type: String })
  trigger: "click" | "hover" = "click";

  /**
   * Whether the popover is disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether to show an arrow
   */
  @property({ type: Boolean, attribute: "show-arrow" })
  showArrow = true;

  /**
   * Delay before showing popover on hover (ms)
   */
  @property({ type: Number })
  delay = 200;

  /**
   * Whether the popover is currently open
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private contentPosition = { top: 0, left: 0 };

  @query(".mb-popover__trigger")
  private triggerEl?: HTMLElement;

  @query(".mb-popover__content")
  private contentEl?: HTMLElement;

  private hoverTimeout?: number;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleDocumentClick);
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  private handleDocumentClick = (e: MouseEvent) => {
    if (this.trigger !== "click" || this.disabled) return;

    const target = e.target as Node;
    if (!this.contains(target) && this.open) {
      this.hide();
    }
  };

  private handleTriggerClick = () => {
    if (this.disabled || this.trigger !== "click") return;
    this.toggle();
  };

  private handleTriggerMouseEnter = () => {
    if (this.disabled || this.trigger !== "hover") return;

    this.hoverTimeout = window.setTimeout(() => {
      this.show();
    }, this.delay);
  };

  private handleTriggerMouseLeave = () => {
    if (this.disabled || this.trigger !== "hover") return;

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hide();
  };

  private toggle() {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  private async show() {
    if (this.disabled) return;

    this.open = true;
    await this.updateComplete;
    this.updatePosition();

    this.dispatchEvent(
      new CustomEvent("mb-show", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private hide() {
    this.open = false;

    this.dispatchEvent(
      new CustomEvent("mb-hide", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private updatePosition() {
    if (!this.triggerEl || !this.contentEl) return;

    const triggerRect = this.triggerEl.getBoundingClientRect();
    const contentRect = this.contentEl.getBoundingClientRect();
    const spacing = 8; // Gap between trigger and popover

    let top = 0;
    let left = 0;

    switch (this.position) {
      case "top":
        top = triggerRect.top - contentRect.height - spacing;
        left =
          triggerRect.left +
          triggerRect.width / 2 -
          contentRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + spacing;
        left =
          triggerRect.left +
          triggerRect.width / 2 -
          contentRect.width / 2;
        break;
      case "left":
        top =
          triggerRect.top +
          triggerRect.height / 2 -
          contentRect.height / 2;
        left = triggerRect.left - contentRect.width - spacing;
        break;
      case "right":
        top =
          triggerRect.top +
          triggerRect.height / 2 -
          contentRect.height / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Keep within viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 8;
    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - 8;
    }
    if (top < 0) top = 8;
    if (top + contentRect.height > viewportHeight) {
      top = viewportHeight - contentRect.height - 8;
    }

    this.contentPosition = { top, left };
  }

  render() {
    return html`
      <div
        class="mb-popover__trigger"
        part="trigger"
        @click=${this.handleTriggerClick}
        @mouseenter=${this.handleTriggerMouseEnter}
        @mouseleave=${this.handleTriggerMouseLeave}
      >
        <slot></slot>
      </div>

      <div
        class="mb-popover__content"
        part="content"
        data-show=${this.open}
        data-position=${this.position}
        style="top: ${this.contentPosition.top}px; left: ${this
          .contentPosition.left}px;"
        role="dialog"
        aria-hidden=${!this.open}
      >
        ${this.showArrow
          ? html`<div
              class="mb-popover__arrow"
              part="arrow"
              data-position=${this.position}
            ></div>`
          : null}
        <slot name="content"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-popover": MbPopover;
  }
}
