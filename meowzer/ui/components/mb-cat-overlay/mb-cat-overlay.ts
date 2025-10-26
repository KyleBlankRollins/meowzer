import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { catOverlayStyles } from "./mb-cat-overlay.style.js";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { Meowzer } from "meowzer";

/**
 * Complete drop-in overlay component for Meowzer cats.
 *
 * This is the killer feature - a single component that includes:
 * - Built-in MeowzerProvider
 * - Built-in cat boundary (fullscreen)
 * - Tabbed UI (Create/Manage/Gallery)
 * - Minimize/maximize functionality
 * - Positioning options
 *
 * Usage:
 * ```html
 * <mb-cat-overlay></mb-cat-overlay>
 * ```
 *
 * That's it! Cats now work on your site.
 *
 * @fires meowzer-ready - Dispatched when Meowzer SDK is initialized
 * @fires meowzer-error - Dispatched when initialization fails
 * @fires overlay-minimized - Dispatched when overlay is minimized
 * @fires overlay-maximized - Dispatched when overlay is maximized
 * @fires overlay-closed - Dispatched when overlay is closed
 */
@customElement("mb-cat-overlay")
export class MbCatOverlay extends LitElement {
  static styles = [catOverlayStyles];

  /**
   * Position of the overlay panel
   */
  @property({ type: String })
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left" = "bottom-right";

  /**
   * Whether the overlay starts minimized
   */
  @property({ type: Boolean })
  initiallyMinimized = false;

  /**
   * Custom Meowzer configuration
   */
  @property({ type: Object })
  config?: Record<string, any>;

  /**
   * Storage configuration
   */
  @property({ type: Object })
  storage?: Record<string, any>;

  /**
   * Whether to auto-initialize Meowzer on connect
   */
  @property({ type: Boolean })
  autoInit = true;

  /**
   * Initial tab to show
   */
  @property({ type: String })
  initialTab: "create" | "manage" | "gallery" = "create";

  /**
   * Current minimized state
   */
  @state()
  private minimized = false;

  /**
   * Current active tab
   */
  @state()
  private activeTab: "create" | "manage" | "gallery" = "create";

  /**
   * Meowzer instance provided to children
   */
  @provide({ context: meowzerContext })
  @state()
  private meowzer?: Meowzer;

  /**
   * Initialization state
   */
  @state()
  private initialized = false;

  /**
   * Error state
   */
  @state()
  private error?: Error;

  /**
   * Whether the overlay is visible
   */
  @state()
  private visible = true;

  async connectedCallback() {
    super.connectedCallback();
    this.minimized = this.initiallyMinimized;
    this.activeTab = this.initialTab;

    if (this.autoInit) {
      await this.initialize();
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup: destroy all cats
    if (this.meowzer) {
      const cats = this.meowzer.cats.getAll();
      await Promise.all(cats.map((cat: any) => cat.destroy()));
    }
  }

  /**
   * Initialize Meowzer SDK
   */
  private async initialize() {
    try {
      this.meowzer = new Meowzer({
        ...this.config,
      });

      // Initialize storage if needed
      await this.meowzer.init();
      this.initialized = true;

      this.dispatchEvent(
        new CustomEvent("meowzer-ready", {
          detail: { meowzer: this.meowzer },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err as Error;
      this.dispatchEvent(
        new CustomEvent("meowzer-error", {
          detail: { error: err },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Toggle minimized state
   */
  private toggleMinimized() {
    this.minimized = !this.minimized;

    this.dispatchEvent(
      new CustomEvent(
        this.minimized ? "overlay-minimized" : "overlay-maximized",
        {
          bubbles: true,
          composed: true,
        }
      )
    );
  }

  /**
   * Close the overlay
   */
  private handleClose() {
    this.visible = false;

    this.dispatchEvent(
      new CustomEvent("overlay-closed", {
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Switch to a different tab
   */
  private switchTab(tab: "create" | "manage" | "gallery") {
    this.activeTab = tab;
  }

  render() {
    if (!this.visible) {
      return html``;
    }

    // Show error state
    if (this.error) {
      return html`
        <div class="overlay-panel ${this.position}">
          <q-callout variant="error">
            <strong>Meowzer Error:</strong> ${this.error.message}
          </q-callout>
        </div>
      `;
    }

    // Show loading state
    if (!this.initialized) {
      return html`
        <div class="overlay-panel ${this.position}">
          <div style="padding: 1rem; text-align: center;">
            <q-spinner size="large"></q-spinner>
            <p
              style="margin-top: 1rem; color: var(--text-secondary);"
            >
              Initializing Meowzer...
            </p>
          </div>
        </div>
      `;
    }

    return html`
      <div
        class="overlay-panel ${this.position} ${this.minimized
          ? "minimized"
          : ""}"
      >
        ${this.minimized
          ? this.renderMinimized()
          : this.renderExpanded()}
      </div>
    `;
  }

  /**
   * Render minimized state
   */
  private renderMinimized() {
    return html`
      <button class="minimized-button" @click=${this.toggleMinimized}>
        🐱 Show Cats
      </button>
    `;
  }

  /**
   * Render expanded state
   */
  private renderExpanded() {
    return html`
      <div class="overlay-container">
        <!-- Header -->
        <div class="overlay-header">
          <h2>Meowzer Cats</h2>
          <div class="header-controls">
            <q-button
              variant="ghost"
              size="small"
              @click=${this.toggleMinimized}
              aria-label="Minimize overlay"
            >
              <q-icon name="minus"></q-icon>
            </q-button>
            <q-button
              variant="ghost"
              size="small"
              @click=${this.handleClose}
              aria-label="Close overlay"
            >
              <q-icon name="x"></q-icon>
            </q-button>
          </div>
        </div>

        <!-- Tab navigation -->
        <div class="tab-nav">
          <button
            class="tab-button ${this.activeTab === "create"
              ? "active"
              : ""}"
            @click=${() => this.switchTab("create")}
          >
            Create
          </button>
          <button
            class="tab-button ${this.activeTab === "manage"
              ? "active"
              : ""}"
            @click=${() => this.switchTab("manage")}
          >
            Manage
          </button>
          <button
            class="tab-button ${this.activeTab === "gallery"
              ? "active"
              : ""}"
            @click=${() => this.switchTab("gallery")}
          >
            Gallery
          </button>
        </div>

        <!-- Tab content -->
        <div class="overlay-tabs">
          <div
            class="tab-panel ${this.activeTab === "create"
              ? "active"
              : ""}"
          >
            <cat-creator></cat-creator>
          </div>

          <div
            class="tab-panel ${this.activeTab === "manage"
              ? "active"
              : ""}"
          >
            <cat-manager></cat-manager>
          </div>

          <div
            class="tab-panel ${this.activeTab === "gallery"
              ? "active"
              : ""}"
          >
            <cat-gallery></cat-gallery>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-cat-overlay": MbCatOverlay;
  }
}
