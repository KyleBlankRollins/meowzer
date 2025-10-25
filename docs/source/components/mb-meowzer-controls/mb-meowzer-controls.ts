import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { mbMeowzerControlsStyles } from "./mb-meowzer-controls.styles.js";
import {
  getAllCats,
  createRandomCat,
  createCatFromSeed,
  destroyAllCats,
  getCatById,
  buildCatFromSeed,
} from "../../../../meowzer/meowzer/meowzer.js";
import type { Meowbase, Cat } from "meowzer";
import { meowbaseContext } from "../../contexts/meowbase-context.js";

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
    this.loadSavedCats();

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
    const cats = getAllCats();
    this.catCount = cats.length;
  }

  private togglePanel() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.loadSavedCats();
    }
  }

  private async loadSavedCats() {
    if (!this.db) return;

    this.loadingSavedCats = true;
    try {
      const loadResult = await this.db.loadCollection(
        this.COLLECTION_NAME
      );
      if (loadResult.success) {
        const collectionResult = await this.db.getCollection(
          this.COLLECTION_NAME
        );
        if (collectionResult.success && collectionResult.data) {
          this.savedCats = collectionResult.data.children;
        }
      } else {
        this.savedCats = [];
      }
    } catch (error) {
      console.error("Failed to load saved cats:", error);
      this.savedCats = [];
    } finally {
      this.loadingSavedCats = false;
    }
  }

  private async handleCreateCat() {
    const playground = document.getElementById("cat-playground");
    if (!playground) return;

    // Create the roaming cat
    const meowzerCat = createRandomCat({
      container: playground as HTMLElement,
    });
    this.updateCatCount();

    // Save to database if available
    if (this.db) {
      try {
        // Ensure collection exists
        const loadResult = await this.db.loadCollection(
          this.COLLECTION_NAME
        );

        if (!loadResult.success) {
          await this.db.createCollection(this.COLLECTION_NAME, []);
          await this.db.loadCollection(this.COLLECTION_NAME);
        }

        // Create cat record for database
        const catRecord = {
          id: meowzerCat.id,
          name: meowzerCat.name || "Unknown Cat",
          image: meowzerCat.seed, // Store seed as image for now (we'll parse it later)
          birthday: new Date(),
          favoriteToy: {
            id: crypto.randomUUID(),
            name: "Random Toy",
            image: "🎾",
            type: "toy",
            description: "A randomly selected toy",
          },
          description: "A randomly generated roaming cat",
          currentEmotion: {
            id: crypto.randomUUID(),
            name: "Curious",
          },
          importantHumans: [],
        };

        this.db.addCatToCollection(this.COLLECTION_NAME, catRecord);
        await this.db.saveCollection(this.COLLECTION_NAME);
        await this.loadSavedCats();
      } catch (error) {
        console.error("Failed to save cat to database:", error);
      }
    }
  }

  private async handleLoadCat(cat: Cat) {
    const playground = document.getElementById("cat-playground");
    if (!playground) return;

    // Check if cat is already loaded
    const existingCat = getCatById(cat.id);
    if (existingCat) {
      // Focus on the cat (could add visual feedback here)
      existingCat.element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // Create cat from stored seed
    const seed = cat.image; // We stored the seed in the image field
    if (!seed) {
      console.error("Cannot load cat: no seed found for", cat.name);
      alert(`Cannot load ${cat.name}: missing appearance data`);
      return;
    }

    try {
      createCatFromSeed(seed, {
        container: playground as HTMLElement,
        name: cat.name,
      });

      this.updateCatCount();
      this.requestUpdate(); // Force UI update to reflect new status
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
    const meowzerCat = getCatById(cat.id);
    if (meowzerCat) {
      meowzerCat.pause();
      this.requestUpdate(); // Force UI update to show pause icon
    }
  }

  private handleResumeCat(cat: Cat) {
    const meowzerCat = getCatById(cat.id);
    if (meowzerCat) {
      meowzerCat.resume();
      this.requestUpdate(); // Force UI update to show resume icon
    }
  }

  private async handleDeleteCat(cat: Cat) {
    if (!this.db) return;

    if (confirm(`Delete ${cat.name}?`)) {
      try {
        // Remove from database
        this.db.removeCatFromCollection(this.COLLECTION_NAME, cat.id);
        await this.db.saveCollection(this.COLLECTION_NAME);

        // Remove from DOM if loaded
        const meowzerCat = getCatById(cat.id);
        if (meowzerCat) {
          meowzerCat.destroy();
          this.updateCatCount();
        }

        await this.loadSavedCats();
      } catch (error) {
        console.error("Failed to delete cat:", error);
      }
    }
  }

  private handleDestroyAll() {
    if (this.catCount === 0) return;

    if (confirm(`Remove all ${this.catCount} cats?`)) {
      destroyAllCats();
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

  private isCatLoaded(catId: string): boolean {
    return getCatById(catId) !== null;
  }

  private isCatPaused(catId: string): boolean {
    const cat = getCatById(catId);
    return cat ? !cat.isActive : false;
  }

  private generatePreview(cat: Cat): string {
    // Generate a small SVG preview from the cat's seed
    try {
      const seed = cat.image;
      if (!seed) {
        return "🐱"; // Fallback emoji if no seed
      }

      // Build the ProtoCat from seed to get the SVG
      const protoCat = buildCatFromSeed(seed);

      // Extract and return the SVG markup
      // Scale it down and make it fit in a small preview box
      const svg = protoCat.spriteData.svg
        .replace(/width="100"/, 'width="40"')
        .replace(/height="100"/, 'height="40"')
        .replace(/viewBox="[^"]*"/, 'viewBox="0 0 100 100"');

      return svg;
    } catch (e) {
      // If parsing/generation fails, return emoji fallback
      console.error("Failed to generate preview:", e);
      return "🐱";
    }
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
          <div class="panel-header">
            <span class="panel-title">Meowzer Controls</span>
            <span class="cat-count"
              >${this.catCount}
              cat${this.catCount !== 1 ? "s" : ""}</span
            >
          </div>

          <div class="controls-grid">
            <button
              class="control-button"
              @click=${this.handleCreateCat}
            >
              <span class="button-icon">➕</span>
              <span>Random Cat</span>
            </button>

            <button
              class="control-button"
              @click=${this.handleOpenCreator}
            >
              <span class="button-icon">🎨</span>
              <span>Cat Creator</span>
            </button>

            <button
              class="control-button danger"
              @click=${this.handleDestroyAll}
              ?disabled=${this.catCount === 0}
            >
              <span class="button-icon">🗑️</span>
              <span>Remove All</span>
            </button>
          </div>

          <!-- Saved Cats Section -->
          <div class="saved-cats-section">
            <div class="section-header">
              <span class="section-title">Saved Cats</span>
              <span class="saved-count"
                >${this.savedCats.length}</span
              >
            </div>

            ${this.loadingSavedCats
              ? html`<div class="loading">Loading...</div>`
              : this.savedCats.length === 0
              ? html`<div class="empty-state">No saved cats yet</div>`
              : html`
                  <div class="saved-cats-list">
                    ${this.savedCats.map(
                      (cat) => html`
                        <div class="cat-card">
                          <div class="cat-info">
                            <div
                              class="cat-preview"
                              .innerHTML=${this.generatePreview(cat)}
                            ></div>
                            <div class="cat-details">
                              <div class="cat-name">${cat.name}</div>
                              <div class="cat-meta">
                                ${this.isCatLoaded(cat.id)
                                  ? html`<span
                                      class="status-badge active"
                                      >Active</span
                                    >`
                                  : html`<span class="status-badge"
                                      >Saved</span
                                    >`}
                              </div>
                            </div>
                          </div>
                          <div class="cat-actions">
                            ${this.isCatLoaded(cat.id)
                              ? html`
                                  ${this.isCatPaused(cat.id)
                                    ? html`
                                        <button
                                          class="action-btn"
                                          @click=${() =>
                                            this.handleResumeCat(cat)}
                                          title="Resume"
                                        >
                                          ▶️
                                        </button>
                                      `
                                    : html`
                                        <button
                                          class="action-btn"
                                          @click=${() =>
                                            this.handlePauseCat(cat)}
                                          title="Pause"
                                        >
                                          ⏸️
                                        </button>
                                      `}
                                `
                              : html`
                                  <button
                                    class="action-btn"
                                    @click=${() =>
                                      this.handleLoadCat(cat)}
                                    title="Load Cat"
                                  >
                                    📥
                                  </button>
                                `}
                            <button
                              class="action-btn danger"
                              @click=${() =>
                                this.handleDeleteCat(cat)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      `
                    )}
                  </div>
                `}
          </div>
        </div>

        ${this.showCreator
          ? html`
              <div
                class="creator-modal"
                @click=${this.handleCloseCreator}
              >
                <div
                  class="creator-content"
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <div class="creator-header">
                    <h2>Create a Cat</h2>
                    <button
                      class="close-button"
                      @click=${this.handleCloseCreator}
                      aria-label="Close cat creator"
                    >
                      ✕
                    </button>
                  </div>
                  <mb-cat-creator
                    @cat-created=${this.handleCatCreated}
                  ></mb-cat-creator>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-meowzer-controls": MbMeowzerControls;
  }
}
