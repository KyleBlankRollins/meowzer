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
   * Context menu state
   */
  @state()
  private contextMenuVisible = false;

  @state()
  private contextMenuPosition = { x: 0, y: 0 };

  @state()
  private selectedCat: any = null; // MeowzerCat type

  /**
   * Rename dialog state
   */
  @state()
  private showRenameDialog = false;

  @state()
  private newName = "";

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
        this.setupCatEventListeners(cat);
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
   * Setup event listeners for a cat
   */
  private setupCatEventListeners(cat: any) {
    cat.on("menuClick", (event: any) => {
      this.selectedCat = cat;
      this.contextMenuPosition = event.position;
      this.contextMenuVisible = true;
    });
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

  /**
   * Handle context menu selections
   */
  private handleMenuSelect(e: CustomEvent) {
    const item = e.detail.item as HTMLElement;
    const action = item.getAttribute("value");

    if (!this.selectedCat) return;

    switch (action) {
      case "pause":
        this.selectedCat.pause();
        this.contextMenuVisible = false;
        break;
      case "resume":
        this.selectedCat.resume();
        this.contextMenuVisible = false;
        break;
      case "remove":
        this.handleRemove();
        break;
      case "rename":
        this.handleRename();
        break;
      case "pickup":
      case "pet":
      case "outfit":
        this.handlePlaceholder(action);
        this.contextMenuVisible = false;
        break;
    }
  }

  /**
   * Handle remove action
   */
  private async handleRemove() {
    if (!this.selectedCat) return;

    const confirmed = confirm(
      `Remove ${this.selectedCat.name || "this cat"}?`
    );
    if (confirmed) {
      await this.selectedCat.delete();
      this.contextMenuVisible = false;
      this.selectedCat = null;
    }
  }

  /**
   * Handle rename action
   */
  private handleRename() {
    if (!this.selectedCat) return;

    this.newName = this.selectedCat.name || "";
    this.showRenameDialog = true;
    this.contextMenuVisible = false;
  }

  /**
   * Submit rename
   */
  private handleRenameSubmit() {
    if (!this.selectedCat) return;

    if (this.newName.trim()) {
      this.selectedCat.setName(this.newName.trim());
      this.showRenameDialog = false;
      this.selectedCat = null;
    }
  }

  /**
   * Cancel rename
   */
  private handleRenameCancel() {
    this.showRenameDialog = false;
    this.newName = "";
    this.selectedCat = null;
  }

  /**
   * Handle placeholder actions
   */
  private handlePlaceholder(feature: string) {
    const messages: Record<string, string> = {
      pickup:
        "Pick-up feature coming soon!\n\nThis will let you drag cats around the screen.",
      pet: "Pet feature coming soon!\n\nThis will show an affectionate animation.",
      outfit:
        "Outfit feature coming soon!\n\nThis will let you dress up your cat.",
    };
    alert(messages[feature]);
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
        <!-- Global Action Buttons (lower-right corner) -->
        <div class="global-actions">
          <quiet-button
            variant="primary"
            size="lg"
            @click=${this.openCreatorDialog}
            title="Create New Cat"
          >
            <quiet-icon family="outline" name="plus"></quiet-icon>
          </quiet-button>

          <quiet-button
            variant="neutral"
            size="lg"
            @click=${this.openStatsDialog}
            title="View Statistics"
          >
            <quiet-icon
              family="outline"
              name="chart-bar"
            ></quiet-icon>
          </quiet-button>
        </div>

        <!-- Context Menu (positioned absolutely at click location) -->
        ${this.contextMenuVisible && this.selectedCat
          ? html`
              <quiet-dropdown
                ?open=${this.contextMenuVisible}
                @quiet-select=${this.handleMenuSelect}
                @quiet-request-close=${() => {
                  this.contextMenuVisible = false;
                }}
                style="position: fixed; left: ${this
                  .contextMenuPosition.x}px; top: ${this
                  .contextMenuPosition.y}px;"
              >
                <!-- Implemented actions -->
                <quiet-dropdown-item
                  value=${this.selectedCat.isActive
                    ? "pause"
                    : "resume"}
                >
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name=${this.selectedCat.isActive
                      ? "player-pause"
                      : "player-play"}
                  ></quiet-icon>
                  ${this.selectedCat.isActive ? "Pause" : "Resume"}
                </quiet-dropdown-item>

                <quiet-dropdown-item
                  value="remove"
                  variant="destructive"
                >
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name="trash"
                  ></quiet-icon>
                  Remove
                </quiet-dropdown-item>

                <quiet-dropdown-item value="rename">
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name="edit"
                  ></quiet-icon>
                  Rename
                </quiet-dropdown-item>

                <quiet-divider></quiet-divider>

                <!-- Placeholder actions (disabled with "Soon" badge) -->
                <quiet-dropdown-item value="pickup" disabled>
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name="hand"
                  ></quiet-icon>
                  Pick Up
                  <quiet-badge
                    slot="details"
                    variant="primary"
                    appearance="outline"
                    >Soon</quiet-badge
                  >
                </quiet-dropdown-item>

                <quiet-dropdown-item value="pet" disabled>
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name="heart"
                  ></quiet-icon>
                  Pet
                  <quiet-badge
                    slot="details"
                    variant="primary"
                    appearance="outline"
                    >Soon</quiet-badge
                  >
                </quiet-dropdown-item>

                <quiet-dropdown-item value="outfit" disabled>
                  <quiet-icon
                    slot="icon"
                    family="outline"
                    name="shirt"
                  ></quiet-icon>
                  Change Outfit
                  <quiet-badge
                    slot="details"
                    variant="primary"
                    appearance="outline"
                    >Soon</quiet-badge
                  >
                </quiet-dropdown-item>
              </quiet-dropdown>
            `
          : ""}

        <!-- Rename Dialog -->
        ${this.showRenameDialog
          ? html`
              <quiet-dialog
                ?open=${this.showRenameDialog}
                @quiet-request-close=${this.handleRenameCancel}
              >
                <div slot="header">Rename Cat</div>

                <quiet-text-field
                  label="Cat Name"
                  .value=${this.newName}
                  @quiet-input=${(e: CustomEvent) =>
                    (this.newName = e.detail.value)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") this.handleRenameSubmit();
                  }}
                ></quiet-text-field>

                <div slot="footer">
                  <quiet-button
                    appearance="outline"
                    @click=${this.handleRenameCancel}
                  >
                    Cancel
                  </quiet-button>
                  <quiet-button
                    variant="primary"
                    @click=${this.handleRenameSubmit}
                    ?disabled=${!this.newName.trim()}
                  >
                    Rename
                  </quiet-button>
                </div>
              </quiet-dialog>
            `
          : ""}

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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-cat-playground": MbCatPlayground;
  }
}
