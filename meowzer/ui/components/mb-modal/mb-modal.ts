import { LitElement, html, svg } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { baseStyles } from "../../shared/base-styles.js";
import { mbModalStyles } from "./mb-modal.style.js";

/**
 * Modal dialog component for displaying content in an overlay.
 *
 * @element mb-modal
 *
 * @slot header - Modal header content (typically a heading)
 * @slot - Modal body content
 * @slot footer - Modal footer content (typically action buttons)
 *
 * @fires mb-close - Fired when the modal is closed via any method
 *
 * @cssprop --mb-color-surface-default - Modal background color
 * @cssprop --mb-color-border-subtle - Border color for header/footer
 * @cssprop --mb-shadow-large - Modal shadow
 *
 * @csspart backdrop - The backdrop overlay
 * @csspart modal - The modal container
 * @csspart header - The header section
 * @csspart heading - The heading element
 * @csspart close - The close button
 * @csspart body - The body section
 * @csspart footer - The footer section
 */
@customElement("mb-modal")
export class MbModal extends LitElement {
  static styles = [baseStyles, mbModalStyles];

  /**
   * Whether the modal is open
   */
  @property({ type: Boolean, reflect: true })
  declare open: boolean;

  /**
   * Size variant
   */
  @property({ type: String, reflect: true })
  declare size: "sm" | "md" | "lg";

  /**
   * Modal heading text
   */
  @property({ type: String })
  declare heading: string;

  /**
   * Whether to show close button
   */
  @property({ type: Boolean, attribute: "show-close" })
  declare showClose: boolean;

  /**
   * Whether to close on backdrop click
   */
  @property({ type: Boolean, attribute: "close-on-backdrop" })
  declare closeOnBackdrop: boolean;

  /**
   * Whether to close on escape key
   */
  @property({ type: Boolean, attribute: "close-on-escape" })
  declare closeOnEscape: boolean;

  @query(".mb-modal")
  private modalElement!: HTMLElement;

  @query(".mb-modal__close")
  private closeButton?: HTMLButtonElement;

  private previouslyFocused: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor() {
    super();
    this.open = false;
    this.size = "md";
    this.heading = "";
    this.showClose = true;
    this.closeOnBackdrop = true;
    this.closeOnEscape = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.handleKeyDown);
    this.restoreBodyScroll();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("open")) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  private handleOpen() {
    // Store previously focused element
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Prevent body scroll
    this.preventBodyScroll();

    // Wait for render, then focus first element
    this.updateComplete.then(() => {
      this.setupFocusTrap();
      this.focusFirstElement();
    });
  }

  private handleClose() {
    this.restoreBodyScroll();

    // Restore focus to previously focused element
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  private preventBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  private restoreBodyScroll() {
    document.body.style.overflow = "";
  }

  private setupFocusTrap() {
    if (!this.modalElement) return;

    // Get all focusable elements
    const focusableSelectors = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    this.focusableElements = Array.from(
      this.modalElement.querySelectorAll(focusableSelectors)
    );

    // Also check slotted content
    const slots = this.shadowRoot?.querySelectorAll("slot");
    slots?.forEach((slot) => {
      const assigned = slot.assignedElements({ flatten: true });
      assigned.forEach((el) => {
        const focusable = el.querySelectorAll(focusableSelectors);
        this.focusableElements.push(
          ...Array.from(focusable as NodeListOf<HTMLElement>)
        );
      });
    });
  }

  private focusFirstElement() {
    // Focus close button if available, otherwise first focusable element
    const firstElement =
      this.closeButton || this.focusableElements[0];
    firstElement?.focus();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.open) return;

    // Handle Escape key
    if (e.key === "Escape" && this.closeOnEscape) {
      e.preventDefault();
      this.close();
      return;
    }

    // Handle Tab key for focus trap
    if (e.key === "Tab") {
      this.handleTabKey(e);
    }
  };

  private handleTabKey(e: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement =
      this.focusableElements[this.focusableElements.length - 1];
    const activeElement =
      this.shadowRoot?.activeElement || document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  private handleBackdropClick(e: MouseEvent) {
    if (!this.closeOnBackdrop) return;

    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  /**
   * Close the modal and emit close event
   */
  close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("mb-close", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.open) return null;

    const closeIcon = svg`
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 5L5 15M5 5L15 15"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;

    return html`
      <div
        class="mb-modal__backdrop"
        part="backdrop"
        @click=${this.handleBackdropClick}
      >
        <div
          class="mb-modal"
          part="modal"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div class="mb-modal__header" part="header">
            ${this.heading
              ? html`<h2 class="mb-modal__heading" part="heading">
                  ${this.heading}
                </h2>`
              : html`<slot name="header"></slot>`}
            ${this.showClose
              ? html`
                  <button
                    class="mb-modal__close"
                    part="close"
                    @click=${this.close}
                    aria-label="Close modal"
                  >
                    ${closeIcon}
                  </button>
                `
              : ""}
          </div>

          <!-- Body -->
          <div class="mb-modal__body" part="body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="mb-modal__footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-modal": MbModal;
  }
}
