import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { mbMeowzerControlsStyles } from "./mb-meowzer-controls.styles.js";
import type { Meowbase, Cat } from "meowzer";
import { meowbaseContext } from "../../contexts/meowbase-context.js";

// Import extracted modules
import {
  getActiveCatCount,
  createRandomRoamingCat,
  createCatRecord,
  saveCatToDatabase,
  loadSavedCats,
  isCatLoaded,
  isCatPaused,
  loadCatFromSeed,
  focusOnCat,
  pauseCat,
  resumeCat,
  deleteCat,
  destroyAll,
  generateCatPreview,
} from "./logic/cat-management.js";
import {
  renderPanelHeader,
  renderSavedCatsHeader,
} from "./templates/header.js";
import { renderControlButtons } from "./templates/actions.js";
import { renderCatList } from "./templates/cat-list.js";
import { renderCreatorModal } from "./templates/creator-modal.js";

/**
 * Meowzer Controls - Fixed bottom panel for managing cats
 * Provides a toggleable interface for creating, removing, and managing cats
 */
@customElement("mb-meowzer-controls")
export class MbMeowzerControls extends LitElement {
  static styles = mbMeowzerControlsStyles;

  @consume({ context: meowbaseContext, subscribe: true })
  @state()
  private db: Meowbase | null = null;

  private readonly COLLECTION_NAME = "roaming-cats";

  @state()
  private isExpanded = false;

  @state()
  private showCreator = false;

  @state()
  private catCount = 0;

  @state()
  private savedCats: Cat[] = [];

  @state()
  private loadingSavedCats = false;

  private updateInterval?: number;

  connectedCallback() {
    super.connectedCallback();
    this.updateCatCount();
    this.loadSavedCatsData();

    // Update cat count periodically
    this.updateInterval = window.setInterval(() => {
      this.updateCatCount();
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
    }
  }

  private updateCatCount() {
    this.catCount = getActiveCatCount();
  }

  private togglePanel() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.loadSavedCatsData();
    }
  }

  private async loadSavedCatsData() {
    if (!this.db) return;

    this.loadingSavedCats = true;
    this.savedCats = await loadSavedCats(
      this.db,
      this.COLLECTION_NAME
    );
    this.loadingSavedCats = false;
  }

  private async handleCreateCat() {
    const playground = document.getElementById("cat-playground");
    if (!playground) return;

    // Create the roaming cat
    const meowzerCat = createRandomRoamingCat({
      container: playground as HTMLElement,
    });
    this.updateCatCount();

    // Save to database if available
    if (this.db) {
      try {
        const catRecord = createCatRecord(meowzerCat);
        await saveCatToDatabase(
          this.db,
          this.COLLECTION_NAME,
          catRecord
        );
        await this.loadSavedCatsData();
      } catch (error) {
        console.error("Failed to save cat to database:", error);
      }
    }
  }

  private async handleLoadCat(cat: Cat) {
    const playground = document.getElementById("cat-playground");
    if (!playground) return;

    // Check if cat is already loaded
    if (isCatLoaded(cat.id)) {
      focusOnCat(cat.id);
      return;
    }

    // Create cat from stored seed
    const seed = cat.image;
    if (!seed) {
      console.error("Cannot load cat: no seed found for", cat.name);
      alert(`Cannot load ${cat.name}: missing appearance data`);
      return;
    }

    try {
      loadCatFromSeed(seed, {
        container: playground as HTMLElement,
        name: cat.name,
      });

      this.updateCatCount();
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to load cat:", error);
      alert(
        `Failed to load ${cat.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private handlePauseCat(cat: Cat) {
    pauseCat(cat.id);
    this.requestUpdate();
  }

  private handleResumeCat(cat: Cat) {
    resumeCat(cat.id);
    this.requestUpdate();
  }

  private async handleDeleteCat(cat: Cat) {
    if (!this.db) return;

    if (confirm(`Delete ${cat.name}?`)) {
      try {
        await deleteCat(this.db, this.COLLECTION_NAME, cat.id);
        this.updateCatCount();
        await this.loadSavedCatsData();
      } catch (error) {
        console.error("Failed to delete cat:", error);
      }
    }
  }

  private handleDestroyAll() {
    if (this.catCount === 0) return;

    if (confirm(`Remove all ${this.catCount} cats?`)) {
      destroyAll();
      this.updateCatCount();
    }
  }

  private handleOpenCreator() {
    this.showCreator = true;
  }

  private handleCloseCreator() {
    this.showCreator = false;
  }

  private handleCatCreated() {
    this.updateCatCount();
  }

  private getCatStatus(cat: Cat): {
    isLoaded: boolean;
    isPaused: boolean;
  } {
    return {
      isLoaded: isCatLoaded(cat.id),
      isPaused: isCatPaused(cat.id),
    };
  }

  render() {
    return html`
      <div class="controls-container">
        <button
          class="toggle-button"
          @click=${this.togglePanel}
          aria-label=${this.isExpanded
            ? "Close cat controls"
            : "Open cat controls"}
          title=${this.isExpanded
            ? "Close controls"
            : "Open controls"}
        >
          ${this.isExpanded ? "✕" : "🐱"}
        </button>

        <div
          class="controls-panel ${this.isExpanded ? "expanded" : ""}"
        >
          ${renderPanelHeader(this.catCount)}
          ${renderControlButtons(this.catCount, {
            onCreateCat: () => this.handleCreateCat(),
            onOpenCreator: () => this.handleOpenCreator(),
            onDestroyAll: () => this.handleDestroyAll(),
          })}

          <!-- Saved Cats Section -->
          <div class="saved-cats-section">
            ${renderSavedCatsHeader(this.savedCats.length)}
            ${renderCatList(
              {
                savedCats: this.savedCats,
                loadingSavedCats: this.loadingSavedCats,
              },
              (cat) => this.getCatStatus(cat),
              (cat) => generateCatPreview(cat),
              {
                onLoad: (cat) => this.handleLoadCat(cat),
                onPause: (cat) => this.handlePauseCat(cat),
                onResume: (cat) => this.handleResumeCat(cat),
                onDelete: (cat) => this.handleDeleteCat(cat),
              }
            )}
          </div>
        </div>

        ${renderCreatorModal(this.showCreator, {
          onClose: () => this.handleCloseCreator(),
          onCatCreated: () => this.handleCatCreated(),
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-meowzer-controls": MbMeowzerControls;
  }
}
