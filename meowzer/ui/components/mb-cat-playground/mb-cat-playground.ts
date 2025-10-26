import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { catPlaygroundStyles } from "./mb-cat-playground.style.js";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import { Meowzer } from "meowzer";

/**
 * Playground component for experimenting with Meowzer cats.
 *
 * Provides a complete sandbox environment with:
 * - Built-in MeowzerProvider
 * - Visual preview area showing cat count
 * - Quick action controls
 * - Live statistics
 * - Cat creation and management UI
 *
 * Perfect for demos, testing, and experimentation.
 *
 * @example
 * ```html
 * <mb-cat-playground></mb-cat-playground>
 * ```
 *
 * @fires playground-ready - Dispatched when playground is initialized
 */
@customElement("mb-cat-playground")
export class MbCatPlayground extends LitElement {
  static styles = [catPlaygroundStyles];

  /**
   * Custom Meowzer configuration
   */
  @property({ type: Object })
  config?: Record<string, any>;

  /**
   * Whether to show the preview area
   */
  @property({ type: Boolean })
  showPreview = true;

  /**
   * Whether to show statistics
   */
  @property({ type: Boolean })
  showStats = true;

  /**
   * Whether to auto-initialize Meowzer
   */
  @property({ type: Boolean })
  autoInit = true;

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
   * Reactive controller for cats
   */
  private catsController = new CatsController(this);

  get cats() {
    return this.catsController.cats;
  }

  async connectedCallback() {
    super.connectedCallback();

    if (this.autoInit) {
      await this.initialize();
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup: destroy all cats
    if (this.meowzer) {
      await this.meowzer.cats.destroyAll();
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

      await this.meowzer.init();
      this.initialized = true;

      this.dispatchEvent(
        new CustomEvent("playground-ready", {
          detail: { meowzer: this.meowzer },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err as Error;
    }
  }

  /**
   * Create a random cat
   */
  private async createRandomCat() {
    if (!this.meowzer) return;

    try {
      const cat = await this.meowzer.cats.create();
      // Cat is automatically started by SDK
      cat.resume();
    } catch (err) {
      console.error("Failed to create cat:", err);
    }
  }

  /**
   * Pause all cats
   */
  private pauseAll() {
    this.cats.forEach((cat) => cat.pause());
    this.requestUpdate();
  }

  /**
   * Resume all cats
   */
  private resumeAll() {
    this.cats.forEach((cat) => cat.resume());
    this.requestUpdate();
  }

  /**
   * Destroy all cats
   */
  private async destroyAll() {
    if (!this.meowzer) return;

    try {
      await this.meowzer.cats.destroyAll();
    } catch (err) {
      console.error("Failed to destroy cats:", err);
    }
  }

  /**
   * Get count of paused cats
   */
  private get pausedCount(): number {
    return this.cats.filter((cat) => !cat.isActive).length;
  }

  /**
   * Get count of active cats
   */
  private get activeCount(): number {
    return this.cats.filter((cat) => cat.isActive).length;
  }

  render() {
    if (this.error) {
      return html`
        <div class="playground-container">
          <quiet-card>
            <div
              style="padding: 1rem; color: var(--quiet-destructive-text);"
            >
              <strong>Playground Error:</strong> ${this.error.message}
            </div>
          </quiet-card>
        </div>
      `;
    }

    if (!this.initialized) {
      return html`
        <div class="playground-container">
          <div style="text-align: center; padding: 2rem;">
            <quiet-spinner></quiet-spinner>
            <p
              style="margin-top: 1rem; color: var(--quiet-neutral-text-mid);"
            >
              Initializing playground...
            </p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="playground-container">
        ${this.showPreview ? this.renderPreview() : null}
        ${this.renderControls()}
      </div>
    `;
  }

  /**
   * Render preview area
   */
  private renderPreview() {
    return html`
      <div class="preview-area">
        ${this.cats.length === 0
          ? html`
              <div class="preview-empty">
                <quiet-icon name="cat"></quiet-icon>
                <p>No cats yet!</p>
                <p style="font-size: 0.875rem;">
                  Click "Create Random Cat" to get started
                </p>
              </div>
            `
          : html`
              <div style="text-align: center;">
                <p style="font-size: 3rem; margin: 0;">🐱</p>
                <p
                  style="font-size: 1.5rem; font-weight: 600; margin: 0.5rem 0 0 0;"
                >
                  ${this.cats.length}
                  ${this.cats.length === 1 ? "Cat" : "Cats"}
                </p>
                <p
                  style="font-size: 0.875rem; color: var(--quiet-neutral-text-mid);"
                >
                  ${this.activeCount} active, ${this.pausedCount}
                  paused
                </p>
              </div>
            `}
      </div>
    `;
  }

  /**
   * Render controls area
   */
  private renderControls() {
    return html`
      <div class="controls-area">
        <!-- Quick Actions -->
        <div class="controls-section">
          <h3>Quick Actions</h3>
          <div class="quick-actions">
            <quiet-button @click=${this.createRandomCat}>
              <quiet-icon name="plus-circle"></quiet-icon>
              Create Random Cat
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.pauseAll}
              ?disabled=${this.cats.length === 0}
            >
              <quiet-icon name="pause"></quiet-icon>
              Pause All
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.resumeAll}
              ?disabled=${this.cats.length === 0}
            >
              <quiet-icon name="play"></quiet-icon>
              Resume All
            </quiet-button>

            <quiet-button
              variant="destructive"
              @click=${this.destroyAll}
              ?disabled=${this.cats.length === 0}
            >
              <quiet-icon name="trash-2"></quiet-icon>
              Destroy All
            </quiet-button>
          </div>
        </div>

        <!-- Statistics -->
        ${this.showStats
          ? html`
              <div class="controls-section">
                <h3>Statistics</h3>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">Total Cats</div>
                    <div class="stat-value">${this.cats.length}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Active</div>
                    <div class="stat-value">${this.activeCount}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Paused</div>
                    <div class="stat-value">${this.pausedCount}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Frame Rate</div>
                    <div class="stat-value">60 fps</div>
                  </div>
                </div>
              </div>
            `
          : null}

        <!-- Cat Creator -->
        <div class="controls-section">
          <h3>Create Cat</h3>
          <cat-creator></cat-creator>
        </div>

        <!-- Cat Manager -->
        <div class="controls-section">
          <h3>Manage Cats</h3>
          <cat-manager></cat-manager>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-cat-playground": MbCatPlayground;
  }
}
