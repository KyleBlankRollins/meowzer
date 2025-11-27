import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { notificationStyles } from "./mb-notification.style.js";

/**
 * Notification component for displaying informational messages, alerts, and feedback.
 *
 * @element mb-notification
 *
 * @fires mb-close - Fired when the notification is closed
 *
 * @slot - Default slot for notification content
 *
 * @cssprop --mb-color-info - Info variant color
 * @cssprop --mb-color-success - Success variant color
 * @cssprop --mb-color-warning - Warning variant color
 * @cssprop --mb-color-danger - Error variant color
 */
@customElement("mb-notification")
export class MbNotification extends LitElement {
  static styles = notificationStyles;

  /**
   * The variant of the notification
   */
  @property({ type: String, reflect: true })
  declare variant: "info" | "success" | "warning" | "error";

  /**
   * The title of the notification
   */
  @property({ type: String })
  declare title: string;

  /**
   * The subtitle/message of the notification
   */
  @property({ type: String })
  declare subtitle: string;

  /**
   * Whether to hide the close button
   */
  @property({ type: Boolean, attribute: "hide-close-button" })
  declare hideCloseButton: boolean;

  /**
   * Low contrast variant (uses neutral background instead of colored)
   */
  @property({
    type: Boolean,
    reflect: true,
    attribute: "low-contrast",
  })
  declare lowContrast: boolean;

  /**
   * Display as toast notification with fixed positioning
   */
  @property({ type: Boolean, reflect: true })
  declare toast: boolean;

  /**
   * Toast position (only applicable when toast=true)
   */
  @property({ type: String, reflect: true })
  declare position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";

  /**
   * Auto-dismiss timeout in milliseconds (0 = no auto-dismiss)
   */
  @property({ type: Number })
  declare timeout: number;

  private timeoutId?: number;

  constructor() {
    super();
    this.variant = "info";
    this.title = "";
    this.subtitle = "";
    this.hideCloseButton = false;
    this.lowContrast = false;
    this.toast = false;
    this.position = "top-right";
    this.timeout = 0;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.timeout > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.close();
      }, this.timeout);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  /**
   * Close the notification and emit the mb-close event
   */
  close(): void {
    this.dispatchEvent(
      new CustomEvent("mb-close", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleCloseClick = (): void => {
    this.close();
  };

  private getIcon() {
    switch (this.variant) {
      case "info":
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            />
          </svg>
        `;
      case "success":
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        `;
      case "warning":
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
            />
          </svg>
        `;
      case "error":
        return html`
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
            />
          </svg>
        `;
    }
  }

  render() {
    return html`
      <div
        class="mb-notification mb-notification--${this.variant}"
        role="alert"
        part="notification"
      >
        <div class="mb-notification__icon" part="icon">
          ${this.getIcon()}
        </div>

        <div class="mb-notification__content" part="content">
          ${this.title
            ? html`<div class="mb-notification__title" part="title">
                ${this.title}
              </div>`
            : ""}
          ${this.subtitle
            ? html`<div
                class="mb-notification__subtitle"
                part="subtitle"
              >
                ${this.subtitle}
              </div>`
            : ""}
          <slot></slot>
        </div>

        ${!this.hideCloseButton
          ? html`
              <button
                class="mb-notification__close"
                part="close"
                @click=${this.handleCloseClick}
                aria-label="Close notification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-notification": MbNotification;
  }
}
