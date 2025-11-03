import { LitElement, html } from "lit";
import {
  customElement,
  property,
  query,
  state,
} from "lit/decorators.js";
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
   * Reference to the creator dialog element
   */
  @query("#creator-dialog")
  private creatorDialog?: HTMLElement & { open: boolean };

  /**
   * Reference to the stats dialog element
   */
  @query("#stats-dialog")
  private statsDialog?: HTMLElement & { open: boolean };

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

      // Reinitialize the cats controller now that meowzer is available
      this.catsController.hostConnected();

      // Load existing cats from storage
      await this.loadExistingCats();

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
   * Load existing cats from IndexedDB and spawn them
   */
  private async loadExistingCats() {
    if (!this.meowzer || !this.meowzer.storage.isInitialized()) {
      console.log("Storage not initialized, skipping cat loading");
      return;
    }

    try {
      console.log("Loading existing cats from storage...");

      // Get the default collection name from config
      const defaultCollection =
        this.meowzer.getConfig().storage.defaultCollection;

      // Load all cats from the default collection
      const savedCats = await this.meowzer.storage.loadCollection(
        defaultCollection
      );

      console.log(`Found ${savedCats.length} saved cats`);

      // Spawn each cat and make them roam
      for (const cat of savedCats) {
        cat.element.style.position = "fixed";
        document.body.appendChild(cat.element);
        cat.resume();
        console.log(`Spawned cat: ${cat.name} (${cat.id})`);
      }

      if (savedCats.length > 0) {
        this.requestUpdate();
      }
    } catch (err) {
      // Collection might not exist yet, which is fine
      if (err instanceof Error && err.message.includes("not found")) {
        console.log("No saved cats collection found yet");
      } else {
        console.error("Failed to load existing cats:", err);
      }
    }
  }

  /**
   * Create a random cat
   */
  private async createRandomCat() {
    if (!this.meowzer) return;

    try {
      // Generate a random name
      const name = this.meowzer.utils.randomName();

      // Create cat with random name
      const cat = await this.meowzer.cats.create({ name });

      // Save to storage
      if (this.meowzer.storage.isInitialized()) {
        await this.meowzer.storage.saveCat(cat);
        console.log(`Random cat "${name}" created and saved`);
      }

      // Spawn the cat to roam
      cat.element.style.position = "fixed";
      document.body.appendChild(cat.element);
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
      console.error("Failed to remove cats:", err);
    }
  }

  /**
   * Open the creator dialog
   */
  private openCreatorDialog() {
    if (this.creatorDialog) {
      this.creatorDialog.open = true;
    }
  }

  /**
   * Close the creator dialog
   */
  private closeCreatorDialog() {
    if (this.creatorDialog) {
      this.creatorDialog.open = false;
    }
  }

  /**
   * Open the stats dialog
   */
  private openStatsDialog() {
    if (this.statsDialog) {
      this.statsDialog.open = true;
    }
  }

  /**
   * Close the stats dialog
   */
  private closeStatsDialog() {
    if (this.statsDialog) {
      this.statsDialog.open = false;
    }
  }

  render() {
    if (this.error) {
      return html`
        <div class="playground-container">
          <quiet-card>
            <div class="error-message">
              <strong>Playground Error:</strong> ${this.error.message}
            </div>
          </quiet-card>
        </div>
      `;
    }

    if (!this.initialized) {
      return html`
        <div class="playground-container">
          <div class="loading-container">
            <quiet-spinner></quiet-spinner>
            <p class="loading-text">Initializing playground...</p>
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
                <p class="help-text">
                  Click "Create Random Cat" to get started
                </p>
              </div>
            `
          : html``}
      </div>
    `;
  }

  /**
   * Render controls area
   */
  private renderControls() {
    return html`
      <div class="controls-area">
        <!-- Toolbar with Quick Actions -->
        <div class="controls-section">
          <quiet-toolbar>
            <quiet-button
              @click=${this.createRandomCat}
              title="Create Random Cat"
            >
              <quiet-icon name="plus"></quiet-icon>
            </quiet-button>

            <quiet-button
              @click=${this.openCreatorDialog}
              title="Open Cat Creator"
            >
              <quiet-icon name="edit"></quiet-icon>
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.pauseAll}
              ?disabled=${this.cats.length === 0}
              title="Pause All Cats"
            >
              <quiet-icon name="player-pause"></quiet-icon>
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.resumeAll}
              ?disabled=${this.cats.length === 0}
              title="Resume All Cats"
            >
              <quiet-icon name="player-play"></quiet-icon>
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.openStatsDialog}
              title="View Statistics"
            >
              <quiet-icon name="chart-bar"></quiet-icon>
            </quiet-button>

            <quiet-button
              variant="destructive"
              @click=${this.destroyAll}
              ?disabled=${this.cats.length === 0}
              title="Remove All Cats"
            >
              <quiet-icon name="trash"></quiet-icon>
            </quiet-button>
          </quiet-toolbar>
        </div>

        <!-- Cat Manager (always visible) -->
        <div class="controls-section">
          <h3>Manage Cats</h3>
          <cat-manager></cat-manager>
        </div>
      </div>

      <!-- Cat Creator Dialog -->
      <quiet-dialog
        id="creator-dialog"
        @quiet-request-close=${this.closeCreatorDialog}
        light-dismiss
      >
        <div slot="header">Create Cat</div>
        <cat-creator
          @cat-created=${this.closeCreatorDialog}
        ></cat-creator>
      </quiet-dialog>

      <!-- Statistics Dialog -->
      <quiet-dialog
        id="stats-dialog"
        @quiet-request-close=${this.closeStatsDialog}
        light-dismiss
      >
        <div slot="header">Statistics</div>
        <cat-statistics></cat-statistics>
      </quiet-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-cat-playground": MbCatPlayground;
  }
}
