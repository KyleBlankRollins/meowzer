import { LitElement, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { catPlaygroundStyles } from "./mb-cat-playground.style.js";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import { Meowzer } from "meowzer";

/**
 * Playground component for experimenting with Meowzer cats.
 *
 * Provides a complete sandbox environment with:
 * - Visual preview area showing cat count
 * - Quick action controls
 * - Live statistics
 * - Cat creation and management UI
 *
 * Must be wrapped in a <meowzer-provider> component.
 *
 * @example
 * ```html
 * <meowzer-provider auto-init>
 *   <mb-cat-playground></mb-cat-playground>
 * </meowzer-provider>
 * ```
 */
@customElement("mb-cat-playground")
export class MbCatPlayground extends LitElement {
  static styles = [catPlaygroundStyles];

  /**
   * Meowzer instance consumed from provider
   */
  @consume({ context: meowzerContext, subscribe: true })
  @state()
  private meowzer?: Meowzer;

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
   * Context menu open state
   */
  @state()
  private contextMenuOpen = false;

  /**
   * Rename dialog state
   */
  @state()
  private showRenameDialog = false;

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

    // Wait for meowzer to be available from provider
    if (this.meowzer) {
      await this.setupMeowzer();
    }
  }

  async updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    // Setup when meowzer becomes available
    if (changedProperties.has("meowzer") && this.meowzer) {
      await this.setupMeowzer();
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
   * Track if setup has been called to prevent duplicate setup
   */
  private setupComplete = false;

  /**
   * Setup playground with meowzer instance from provider
   */
  private async setupMeowzer() {
    if (!this.meowzer || this.setupComplete) return;

    this.setupComplete = true;

    // Wait for meowzer to be initialized if it isn't already
    if (!(this.meowzer as any)._initialized) {
      // Poll until initialized (provider initializes asynchronously)
      await new Promise<void>((resolve) => {
        const checkInit = () => {
          if ((this.meowzer as any)._initialized) {
            resolve();
          } else {
            setTimeout(checkInit, 50);
          }
        };
        checkInit();
      });
    }

    // Reinitialize the cats controller now that meowzer is available
    this.catsController.hostConnected();

    // Setup yarn event listeners
    this.setupYarnListeners();

    // Setup need event listeners
    this.setupNeedListeners();

    // Load existing cats from storage
    await this.loadExistingCats();
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
    // Add click listener to cat element
    cat.element.addEventListener("click", () => {
      // Auto-pause cat when menu opens
      if (cat.isActive) {
        cat.lifecycle.pause();
      }

      // Add menu-open class to cat element
      cat.element.classList.add("menu-open");

      // Update state to show menu
      this.selectedCat = cat;
      this.contextMenuOpen = true;
    });
  }

  /**
   * Handle menu action selection
   */
  private handleMenuAction(action: string) {
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
  private closeCreatorDialog(e?: CustomEvent) {
    // If a cat was created, set up event listeners for it
    if (e?.detail?.cat) {
      this.setupCatEventListeners(e.detail.cat);
    }

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
      // Remove menu-open class
      this.selectedCat.element.classList.remove("menu-open");

      // Check if we should keep selectedCat (transitioning to another dialog)
      if (this.keepSelectedCat) {
        // Don't reset keepSelectedCat here - it will be reset when the dialog closes
        this.contextMenuOpen = false;
        return; // Don't resume or clear selectedCat
      }

      // Auto-resume cat if it was paused by the menu
      if (!this.selectedCat.isActive) {
        this.selectedCat.lifecycle.resume();
      }
    }

    this.contextMenuOpen = false;
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

      // Use delete() instead of persistence.delete() to properly clean up
      await this.selectedCat.delete();
      this.contextMenuOpen = false;
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
    this.contextMenuOpen = false;
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
   * Handle "Change Hat" menu option
   */
  private handleChangeHat() {
    if (!this.selectedCat) return;

    // Keep selectedCat alive when transitioning to wardrobe dialog
    this.keepSelectedCat = true;

    // Close menu
    this.contextMenuOpen = false;
  }

  /**
   * Handle wardrobe dialog close
   */
  private handleWardrobeDialogClose() {
    // Reset the keepSelectedCat flag
    this.keepSelectedCat = false;

    // Clear selectedCat after wardrobe dialog closes
    if (this.selectedCat) {
      if (!this.selectedCat.isActive) {
        this.selectedCat.lifecycle.resume();
      }
      this.selectedCat = null;
    }
  }

  /**
   * Handle placeholder actions
   */
  render() {
    if (!this.meowzer) {
      return html`
        <div class="playground-container">
          <div class="loading-container">
            <mb-loading></mb-loading>
            <p class="loading-text">
              Waiting for Meowzer provider...
            </p>
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
                <mb-modal
                  heading="Rename Cat"
                  ?open=${this.showRenameDialog}
                  @mb-close=${this.handleRenameCancel}
                >
                  <mb-text-input
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
                  ></mb-text-input>

                  <div slot="footer">
                    <mb-button
                      variant="secondary"
                      @click=${this.handleRenameCancel}
                    >
                      Cancel
                    </mb-button>
                    <mb-button
                      variant="primary"
                      @click=${this.handleRenameSubmit}
                      ?disabled=${!this.newName.trim()}
                    >
                      Rename
                    </mb-button>
                  </div>
                </mb-modal>
              `
            : ""}}

          <!-- Wardrobe Dialog -->
          <mb-wardrobe-dialog
            .cat=${this.selectedCat}
            ?open=${this.selectedCat && this.keepSelectedCat}
            @dialog-close=${this.handleWardrobeDialogClose}
          ></mb-wardrobe-dialog>

          <!-- Cat Creator Dialog -->
          <mb-modal
            id="creator-dialog"
            heading="Create Cat"
            size="lg"
            @mb-close=${this.closeCreatorDialog}
          >
            <cat-creator
              @cat-created=${this.closeCreatorDialog}
            ></cat-creator>
          </mb-modal>

          <!-- Statistics Dialog -->
          <mb-modal
            id="stats-dialog"
            heading="Statistics"
            @mb-close=${this.closeStatsDialog}
          >
            <cat-statistics></cat-statistics>
          </mb-modal>

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

          <!-- Cat Context Menu -->
          ${this.selectedCat
            ? (() => {
                const rect =
                  this.selectedCat.element.getBoundingClientRect();
                return html`
                  <mb-cat-context-menu
                    .cat=${this.selectedCat}
                    ?open=${this.contextMenuOpen}
                    .left=${rect.left}
                    .top=${rect.bottom}
                    @cat-remove=${() =>
                      this.handleMenuAction("remove")}
                    @cat-rename=${() =>
                      this.handleMenuAction("rename")}
                    @cat-change-hat=${() =>
                      this.handleMenuAction("change-hat")}
                    @menu-close=${this.closeContextMenu}
                  ></mb-cat-context-menu>
                `;
              })()
            : ""}
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
