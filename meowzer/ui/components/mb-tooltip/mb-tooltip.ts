import { LitElement, html } from "lit";
import {
  customElement,
  property,
  state,
  query,
} from "lit/decorators.js";
import { tooltipStyles } from "./mb-tooltip.style.js";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

/**
 * Tooltip component that displays helpful hints on hover.
 *
 * @element mb-tooltip
 *
 * @slot - The element that triggers the tooltip (typically a button or icon)
 *
 * @cssprop --mb-color-background-inverse - Tooltip background color
 * @cssprop --mb-color-text-inverse - Tooltip text color
 */
@customElement("mb-tooltip")
export class MbTooltip extends LitElement {
  static styles = tooltipStyles;

  /**
   * The tooltip text content
   */
  @property({ type: String })
  declare text: string;

  /**
   * Position of the tooltip relative to the trigger element
   */
  @property({ type: String })
  declare position: TooltipPosition;

  /**
   * Delay in milliseconds before showing the tooltip
   */
  @property({ type: Number })
  declare delay: number;

  /**
   * Disable the tooltip
   */
  @property({ type: Boolean })
  declare disabled: boolean;

  @state()
  private isVisible = false;

  @state()
  private tooltipPosition = { top: 0, left: 0 };

  @query(".mb-tooltip")
  private trigger?: HTMLElement;

  @query(".mb-tooltip__content")
  private tooltipElement?: HTMLElement;

  private showTimeout?: number;
  private hideTimeout?: number;

  constructor() {
    super();
    this.text = "";
    this.position = "top";
    this.delay = 200;
    this.disabled = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("scroll", this.handleScroll, true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearTimeouts();
    document.removeEventListener("scroll", this.handleScroll, true);
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  private handleMouseEnter = (): void => {
    if (this.disabled || !this.text) return;

    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      this.showTooltip();
    }, this.delay);
  };

  private handleMouseLeave = (): void => {
    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      this.hideTooltip();
    }, 0);
  };

  private handleFocus = (): void => {
    if (this.disabled || !this.text) return;
    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      this.showTooltip();
    }, this.delay);
  };

  private handleBlur = (): void => {
    this.clearTimeouts();
    this.hideTooltip();
  };

  private handleScroll = (): void => {
    if (this.isVisible) {
      this.updateTooltipPosition();
    }
  };

  private showTooltip(): void {
    this.isVisible = true;
    this.updateComplete.then(() => {
      this.updateTooltipPosition();
    });
  }

  private hideTooltip(): void {
    this.isVisible = false;
  }

  private updateTooltipPosition(): void {
    if (!this.trigger || !this.tooltipElement) return;

    const triggerRect = this.trigger.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const gap = 8; // Space between trigger and tooltip

    let top = 0;
    let left = 0;

    switch (this.position) {
      case "top":
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2;
        break;

      case "bottom":
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2;
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2;
        left = triggerRect.right + gap;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (this.position === "top" || this.position === "bottom") {
      const halfWidth = tooltipRect.width / 2;
      if (left - halfWidth < padding) {
        left = halfWidth + padding;
      } else if (left + halfWidth > viewportWidth - padding) {
        left = viewportWidth - halfWidth - padding;
      }
    } else {
      if (left < padding) {
        left = padding;
      } else if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - tooltipRect.width - padding;
      }
    }

    // Adjust vertical position
    if (this.position === "left" || this.position === "right") {
      const halfHeight = tooltipRect.height / 2;
      if (top - halfHeight < padding) {
        top = halfHeight + padding;
      } else if (top + halfHeight > viewportHeight - padding) {
        top = viewportHeight - halfHeight - padding;
      }
    } else {
      if (top < padding) {
        top = padding;
      } else if (
        top + tooltipRect.height >
        viewportHeight - padding
      ) {
        top = viewportHeight - tooltipRect.height - padding;
      }
    }

    this.tooltipPosition = { top, left };
    this.tooltipElement.style.top = `${top}px`;
    this.tooltipElement.style.left = `${left}px`;
  }

  render() {
    return html`
      <div
        class="mb-tooltip"
        part="trigger"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      >
        <slot></slot>
      </div>

      <div
        class="mb-tooltip__content"
        part="content"
        role="tooltip"
        aria-hidden=${!this.isVisible}
        data-position=${this.position}
        ?hidden=${!this.isVisible}
        style="top: ${this.tooltipPosition.top}px; left: ${this
          .tooltipPosition.left}px;"
      >
        <div class="mb-tooltip__arrow" part="arrow"></div>
        ${this.text}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-tooltip": MbTooltip;
  }
}
