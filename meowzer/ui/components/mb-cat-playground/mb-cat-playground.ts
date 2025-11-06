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
   * Context menu state
   */
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

      // Setup yarn event listeners
      this.setupYarnListeners();

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
        cat.resume();
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
   * Setup event listeners for a cat
   */
  private setupCatEventListeners(cat: any) {
    cat.on("menuClick", () => {
      // Auto-pause cat when menu opens
      if (cat.isActive) {
        cat.pause();
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

    // Create menu container (no positioning - just a child element)
    const menuContainer = document.createElement("div");
    menuContainer.className = "cat-context-menu";

    // Create and configure the dropdown
    const dropdown = document.createElement("quiet-dropdown") as any;
    dropdown.open = true;

    // Create hidden trigger
    const trigger = document.createElement("button");
    // trigger.style.display = "none";
    trigger.setAttribute("slot", "trigger");
    dropdown.appendChild(trigger);

    // Add menu items
    this.addMenuItem(
      dropdown,
      "remove",
      "Remove",
      "trash",
      "destructive"
    );
    this.addMenuItem(dropdown, "rename", "Rename", "edit");

    // Add divider
    const divider = document.createElement("quiet-divider");
    dropdown.appendChild(divider);

    // Add disabled items with "Soon" badge
    this.addMenuItem(
      dropdown,
      "pickup",
      "Pick Up",
      "hand",
      undefined,
      true
    );
    this.addMenuItem(
      dropdown,
      "pet",
      "Pet",
      "heart",
      undefined,
      true
    );
    this.addMenuItem(
      dropdown,
      "outfit",
      "Change Outfit",
      "shirt",
      undefined,
      true
    );

    // Handle menu selection
    dropdown.addEventListener("quiet-select", (e: CustomEvent) => {
      this.handleMenuAction(e.detail.value, cat);
    });

    // Handle menu close
    dropdown.addEventListener("quiet-close", () => {
      this.closeContextMenu();
    });

    menuContainer.appendChild(dropdown);

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
   * Helper to add a menu item
   */
  private addMenuItem(
    dropdown: HTMLElement,
    value: string,
    label: string,
    icon: string,
    variant?: string,
    disabled: boolean = false
  ) {
    const item = document.createElement("quiet-dropdown-item") as any;
    item.value = value;
    if (variant) item.variant = variant;
    if (disabled) item.disabled = true;

    // Add icon
    const iconEl = document.createElement("quiet-icon") as any;
    iconEl.family = "outline";
    iconEl.name = icon;
    iconEl.setAttribute("slot", "icon");
    item.appendChild(iconEl);

    // Add label text
    item.appendChild(document.createTextNode(label));

    // Add "Soon" badge for disabled items
    if (disabled) {
      const badge = document.createElement("quiet-badge") as any;
      badge.variant = "primary";
      badge.appearance = "outline";
      badge.setAttribute("slot", "details");
      badge.textContent = "Soon";
      item.appendChild(badge);
    }

    dropdown.appendChild(item);
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

      // Auto-resume cat if it was paused by the menu
      if (!this.selectedCat.isActive) {
        this.selectedCat.resume();
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

      await this.selectedCat.delete();
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
    this.closeContextMenu();
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
        <!-- Main playground area for cats and interactions -->
        <div class="playground-main">
          <!-- Context Menu is now injected directly into cat DOM -->

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
                      if (e.key === "Enter")
                        this.handleRenameSubmit();
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

          <!-- Yarn Visuals -->
          ${Array.from(this.activeYarns.values()).map(
            (yarn) => html`
              <mb-yarn-visual
                .yarnId=${yarn.id}
                .interactive=${true}
              ></mb-yarn-visual>
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
