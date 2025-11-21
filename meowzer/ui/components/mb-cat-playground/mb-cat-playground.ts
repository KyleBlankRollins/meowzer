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
   * Current active laser pointer
   */
  @state()
  private activeLaser?: any;

  /**
   * Active yarn balls in the playground
   */
  @state()
  private activeYarns: Map<string, any> = new Map();

  /**
   * Active needs (food/water) in the playground
   */
  @state()
  private activeNeeds: Map<string, any> = new Map();

  /**
   * Context menu state
   */
  @state()
  private selectedCat: any = null; // MeowzerCat type

  /**
   * Rename dialog state
   */
  @state()
  private showRenameDialog = false;

  /**
   * Wardrobe dialog state
   */
  @state()
  private showWardrobeDialog = false;

  /**
   * Flag to prevent clearing selectedCat when transitioning to another dialog
   */
  private keepSelectedCat = false;

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

      // Setup yarn event listeners
      this.setupYarnListeners();

      // Setup need event listeners
      this.setupNeedListeners();

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
      return;
    }

    try {
      // Get the default collection name from config
      const defaultCollection =
        this.meowzer.getConfig().storage.defaultCollection;

      // Load all cats from the default collection
      const savedCats = await this.meowzer.storage.loadCollection(
        defaultCollection
      );

      // Spawn each cat with randomized positions to avoid overlap
      for (const cat of savedCats) {
        // Randomize starting position within viewport
        const randomX = Math.random() * (window.innerWidth - 150); // Leave room for cat width
        const randomY = Math.random() * (window.innerHeight - 200); // Leave room for cat height

        // Set position on the internal Meowtion Cat instance
        // This ensures the AI behavior uses the correct starting position
        (cat as any)._cat.setPosition(randomX, randomY);

        // Set element positioning
        cat.element.style.position = "fixed";

        document.body.appendChild(cat.element);
        this.setupCatEventListeners(cat);
        cat.lifecycle.resume();
      }

      if (savedCats.length > 0) {
        this.requestUpdate();
      }
    } catch (err) {
      // Collection might not exist yet, which is fine
      if (
        err instanceof Error &&
        !err.message.includes("not found")
      ) {
        console.error("Failed to load existing cats:", err);
      }
    }
  }

  /**
   * Setup yarn event listeners
   */
  private setupYarnListeners() {
    if (!this.meowzer) return;

    // Listen for yarn placement
    this.meowzer.interactions.on("yarnPlaced", (event: any) => {
      const yarn = this.meowzer!.interactions.getYarn(event.id);
      if (yarn) {
        this.activeYarns.set(event.id, yarn);
        this.requestUpdate();
      }
    });

    // Listen for yarn removal
    this.meowzer.interactions.on("yarnRemoved", (event: any) => {
      this.activeYarns.delete(event.id);
      this.requestUpdate();
    });
  }

  /**
   * Setup need event listeners
   */
  private setupNeedListeners() {
    if (!this.meowzer) return;

    // Listen for need placement
    this.meowzer.interactions.on("needPlaced", (event: any) => {
      const need = this.meowzer!.interactions.getNeed(event.id);
      if (need) {
        this.activeNeeds.set(event.id, need);
        this.requestUpdate();
      }
    });

    // Listen for need removal
    this.meowzer.interactions.on("needRemoved", (event: any) => {
      this.activeNeeds.delete(event.id);
      this.requestUpdate();
    });
  }

  /**
   * Setup event listeners for a cat
   */
  private setupCatEventListeners(cat: any) {
    cat.on("menuClick", () => {
      // Auto-pause cat when menu opens
      if (cat.isActive) {
        cat.lifecycle.pause();
      }

      // Add menu-open class to cat element
      cat.element.classList.add("menu-open");

      this.selectedCat = cat;

      // Inject menu into cat element
      this.injectMenuIntoCat(cat);
    });
  }

  /**
   * Inject the context menu directly into the cat's DOM element
   */
  private injectMenuIntoCat(cat: any) {
    // Remove any existing menu
    const existingMenu = cat.element.querySelector(
      ".cat-context-menu"
    );
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create menu container
    const menuContainer = document.createElement("div");
    menuContainer.className = "cat-context-menu";

    // Create native context menu
    const menu = document.createElement("div");
    menu.className = "context-menu-content";

    // Add menu items as buttons
    const removeBtn = this.createMenuButton(
      "Remove",
      "destructive",
      () => this.handleMenuAction("remove", cat)
    );
    const renameBtn = this.createMenuButton("Rename", "normal", () =>
      this.handleMenuAction("rename", cat)
    );
    const hatBtn = this.createMenuButton("Change Hat", "normal", () =>
      this.handleMenuAction("change-hat", cat)
    );

    menu.appendChild(removeBtn);
    menu.appendChild(renameBtn);
    menu.appendChild(document.createElement("hr"));
    menu.appendChild(hatBtn);

    menuContainer.appendChild(menu);

    // Close menu on click outside
    const closeOnClickOutside = (e: MouseEvent) => {
      if (!menuContainer.contains(e.target as Node)) {
        this.closeContextMenu();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    setTimeout(
      () => document.addEventListener("click", closeOnClickOutside),
      0
    );

    // Append to the info container instead of the cat element
    const infoContainer = cat.element.querySelector(
      ".meowtion-cat-info"
    );
    if (infoContainer) {
      infoContainer.appendChild(menuContainer);
    } else {
      // Fallback if info container doesn't exist
      cat.element.appendChild(menuContainer);
    }
  }

  /**
   * Helper to create a menu button
   */
  private createMenuButton(
    label: string,
    variant: string,
    onClick: () => void
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = `menu-item ${variant}`;
    button.textContent = label;
    button.addEventListener("click", () => {
      onClick();
      this.closeContextMenu();
    });
    return button;
  }

  /**
   * Handle menu action selection
   */
  private handleMenuAction(action: string, cat: any) {
    this.selectedCat = cat;

    switch (action) {
      case "remove":
        this.handleRemove();
        break;
      case "rename":
        this.handleRename();
        break;
      case "change-hat":
        this.handleChangeHat();
        break;
    }
  }

  /**
   * Calculate menu position that stays within viewport
   */
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
   * Handle laser activation from toolbar
   */
  private handleLaserActivated = (e: CustomEvent) => {
    this.activeLaser = e.detail.laserPointer;
  };

  /**
   * Close context menu and resume cat
   */
  private closeContextMenu = () => {
    if (this.selectedCat) {
      // Remove menu from DOM
      const existingMenu = this.selectedCat.element.querySelector(
        ".cat-context-menu"
      );
      if (existingMenu) {
        existingMenu.remove();
      }

      // Remove menu-open class
      this.selectedCat.element.classList.remove("menu-open");

      // Check if we should keep selectedCat (transitioning to another dialog)
      if (this.keepSelectedCat) {
        this.keepSelectedCat = false;
        return; // Don't resume or clear selectedCat
      }

      // Auto-resume cat if it was paused by the menu
      if (!this.selectedCat.isActive) {
        this.selectedCat.lifecycle.resume();
      }
    }

    this.selectedCat = null;
  };

  /**
   * Handle context menu selections
   */
  /**
   * Handle remove action
   */
  private async handleRemove() {
    if (!this.selectedCat) return;

    const confirmed = confirm(
      `Remove ${this.selectedCat.name || "this cat"}?`
    );
    if (confirmed) {
      // Don't resume if we're deleting
      this.selectedCat.element.classList.remove("menu-open");

      // Remove menu from DOM
      const existingMenu = this.selectedCat.element.querySelector(
        ".cat-context-menu"
      );
      if (existingMenu) {
        existingMenu.remove();
      }

      await this.selectedCat.persistence.delete();
      this.selectedCat = null;
    } else {
      // If cancelled, close menu normally (which will resume)
      this.closeContextMenu();
    }
  }

  /**
   * Handle rename action
   */
  private handleRename() {
    if (!this.selectedCat) return;

    this.newName = this.selectedCat.name || "";
    this.showRenameDialog = true;
  }

  /**
   * Submit rename
   */
  private async handleRenameSubmit() {
    if (!this.selectedCat) return;

    if (this.newName.trim()) {
      const cat = this.selectedCat;
      cat.setName(this.newName.trim());

      // Save the cat to persist the name change
      await cat.persistence.save();

      // Resume the cat if it was paused
      if (!cat.isActive) {
        cat.lifecycle.resume();
      }

      this.showRenameDialog = false;
      this.newName = "";
      this.selectedCat = null;
      this.requestUpdate();
    }
  }

  /**
   * Cancel rename
   */
  private handleRenameCancel() {
    // Resume the cat if it was paused
    if (this.selectedCat && !this.selectedCat.isActive) {
      this.selectedCat.lifecycle.resume();
    }

    this.showRenameDialog = false;
    this.newName = "";
    this.selectedCat = null;
  }

  /**
   * Handle change hat action
   */
  private handleChangeHat() {
    if (!this.selectedCat) return;

    // Open wardrobe dialog (selectedCat will be cleared when dialog closes)
    this.showWardrobeDialog = true;
  }

  /**
   * Handle wardrobe dialog close
   */
  private handleWardrobeDialogClose() {
    this.showWardrobeDialog = false;

    // Resume cat if paused
    if (this.selectedCat && !this.selectedCat.isActive) {
      this.selectedCat.lifecycle.resume();
    }

    this.selectedCat = null;
  }

  /**
   * Handle placeholder actions
   */
  render() {
    if (this.error) {
      return html`
        <div class="playground-container">
          <cds-tile class="error-card">
            <div class="error-message">
              <strong>Playground Error:</strong> ${this.error.message}
            </div>
          </cds-tile>
        </div>
      `;
    }

    if (!this.initialized) {
      return html`
        <div class="playground-container">
          <div class="loading-container">
            <cds-loading></cds-loading>
            <p class="loading-text">Initializing playground...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="playground-container">
        <!-- Main playground area for cats and interactions -->
        <div class="playground-main">
          <!-- Rename Dialog -->
          ${this.showRenameDialog
            ? html`
                <cds-modal
                  ?open=${this.showRenameDialog}
                  @cds-modal-closed=${this.handleRenameCancel}
                >
                  <cds-modal-header>
                    <cds-modal-heading>Rename Cat</cds-modal-heading>
                  </cds-modal-header>

                  <cds-modal-body>
                    <cds-text-input
                      label="Cat Name"
                      .value=${this.newName}
                      @input=${(e: Event) =>
                        (this.newName = (
                          e.target as HTMLInputElement
                        ).value)}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === "Enter")
                          this.handleRenameSubmit();
                      }}
                    ></cds-text-input>
                  </cds-modal-body>

                  <cds-modal-footer>
                    <cds-button
                      kind="secondary"
                      @click=${this.handleRenameCancel}
                    >
                      Cancel
                    </cds-button>
                    <cds-button
                      kind="primary"
                      @click=${this.handleRenameSubmit}
                      ?disabled=${!this.newName.trim()}
                    >
                      Rename
                    </cds-button>
                  </cds-modal-footer>
                </cds-modal>
              `
            : ""}

          <!-- Wardrobe Dialog -->
          <mb-wardrobe-dialog
            .cat=${this.selectedCat}
            ?open=${this.showWardrobeDialog}
            @dialog-close=${this.handleWardrobeDialogClose}
          ></mb-wardrobe-dialog>

          <!-- Cat Creator Dialog -->
          <cds-modal
            id="creator-dialog"
            @cds-modal-closed=${this.closeCreatorDialog}
            size="lg"
          >
            <cds-modal-header>
              <cds-modal-heading>Create Cat</cds-modal-heading>
            </cds-modal-header>
            <cds-modal-body>
              <cat-creator
                @cat-created=${this.closeCreatorDialog}
              ></cat-creator>
            </cds-modal-body>
          </cds-modal>

          <!-- Statistics Dialog -->
          <cds-modal
            id="stats-dialog"
            @cds-modal-closed=${this.closeStatsDialog}
          >
            <cds-modal-header>
              <cds-modal-heading>Statistics</cds-modal-heading>
            </cds-modal-header>
            <cds-modal-body>
              <cat-statistics></cat-statistics>
            </cds-modal-body>
          </cds-modal>

          <!-- Yarn Visuals -->
          ${Array.from(this.activeYarns.values()).map(
            (yarn) => html`
              <mb-yarn-visual
                .yarnId=${yarn.id}
                .interactive=${true}
              ></mb-yarn-visual>
            `
          )}

          <!-- Need Visuals (Food & Water) -->
          ${Array.from(this.activeNeeds.values()).map(
            (need) => html`
              <mb-need-visual
                .needId=${need.id}
                .type=${need.type}
                .interactive=${false}
              ></mb-need-visual>
            `
          )}

          <!-- Laser Visual -->
          <mb-laser-visual
            .laser=${this.activeLaser}
          ></mb-laser-visual>
        </div>

        <!-- Sidebar for toolbar -->
        <div class="playground-sidebar">
          <mb-playground-toolbar
            @create-cat=${this.openCreatorDialog}
            @view-stats=${this.openStatsDialog}
            @laser-activated=${this.handleLaserActivated}
          ></mb-playground-toolbar>
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
