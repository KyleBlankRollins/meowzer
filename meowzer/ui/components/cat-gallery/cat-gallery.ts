/**
 * CatGallery - Gallery view for browsing saved cats
 *
 * Displays cats from selected collection in a grid layout.
 * Integrates collection-picker and cat-thumbnail components.
 *
 * @fires cat-loaded - Emitted when a cat is successfully loaded
 * @fires collection-created - Emitted when a new collection is created
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { StorageController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";
import type { SavedCatInfo } from "../cat-thumbnail/cat-thumbnail.js";

@customElement("cat-gallery")
export class CatGallery extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .gallery-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .gallery-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .gallery-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .loading-state,
    .error-state,
    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .error-state {
      color: var(--quiet-destructive-foreground, #dc2626);
    }

    .empty-state {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .empty-state quiet-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .create-collection-dialog {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    @media (max-width: 640px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `;

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state() private selectedCollectionId?: string;
  @state() private collectionCats: SavedCatInfo[] = [];
  @state() private loading = false;
  @state() private error?: string;
  @state() private showCreateDialog = false;
  @state() private newCollectionName = "";

  private storageController = new StorageController(this);

  private async handleCollectionSelect(e: CustomEvent) {
    const { collectionId } = e.detail;
    this.selectedCollectionId = collectionId;
    await this.loadCollectionCats(collectionId);
  }

  private async loadCollectionCats(collectionId: string) {
    if (!this.meowzer?.storage) {
      return;
    }

    this.loading = true;
    this.error = undefined;

    try {
      // Load collection cats (this creates active instances)
      const cats = await this.storageController.loadCollection(
        collectionId
      );

      // Map to SavedCatInfo for thumbnail display
      this.collectionCats = cats.map((cat) => ({
        id: cat.id,
        name: cat.name || "Unnamed Cat",
        image: cat.seed,
        description: cat.description,
      }));

      // Immediately pause all loaded cats so they don't animate
      cats.forEach((cat) => cat.pause());
    } catch (err) {
      this.error = (err as Error).message;
      this.collectionCats = [];
    } finally {
      this.loading = false;
    }
  }

  private async handleCatLoad(e: CustomEvent) {
    const { cat } = e.detail;

    if (!this.meowzer?.storage || !this.selectedCollectionId) {
      return;
    }

    try {
      // Load just this cat from the collection
      const cats = await this.meowzer.storage.loadCollection(
        this.selectedCollectionId,
        {
          filter: (c) => c.id === cat.id,
          limit: 1,
        }
      );

      if (cats.length > 0) {
        this.dispatchEvent(
          new CustomEvent("cat-loaded", {
            detail: { cat: cats[0] },
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (err) {
      this.error = (err as Error).message;
    }
  }

  private async handleCatDelete(e: CustomEvent) {
    const { cat } = e.detail;

    if (!this.meowzer?.storage) {
      return;
    }

    try {
      await this.meowzer.storage.deleteCat(cat.id);

      // Refresh the collection view
      if (this.selectedCollectionId) {
        await this.loadCollectionCats(this.selectedCollectionId);
      }
    } catch (err) {
      this.error = (err as Error).message;
    }
  }

  private handleCollectionCreate() {
    this.showCreateDialog = true;
  }

  private async handleCreateDialogConfirm() {
    if (!this.newCollectionName.trim() || !this.meowzer?.storage) {
      return;
    }

    try {
      await this.storageController.createCollection(
        this.newCollectionName
      );

      this.dispatchEvent(
        new CustomEvent("collection-created", {
          detail: { name: this.newCollectionName },
          bubbles: true,
          composed: true,
        })
      );

      this.showCreateDialog = false;
      this.newCollectionName = "";
    } catch (err) {
      this.error = (err as Error).message;
    }
  }

  private handleCreateDialogCancel() {
    this.showCreateDialog = false;
    this.newCollectionName = "";
  }

  private renderCreateDialog() {
    return html`
      <quiet-dialog
        ?open=${this.showCreateDialog}
        @quiet-close=${this.handleCreateDialogCancel}
      >
        <div slot="header">Create New Collection</div>

        <div class="create-collection-dialog">
          <quiet-text-field
            label="Collection Name"
            .value=${this.newCollectionName}
            @quiet-input=${(e: CustomEvent) =>
              (this.newCollectionName = e.detail.value)}
            placeholder="Enter collection name"
          ></quiet-text-field>
        </div>

        <div slot="footer">
          <quiet-button
            variant="text"
            @click=${this.handleCreateDialogCancel}
          >
            Cancel
          </quiet-button>
          <quiet-button
            variant="filled"
            @click=${this.handleCreateDialogConfirm}
            ?disabled=${!this.newCollectionName.trim()}
          >
            Create
          </quiet-button>
        </div>
      </quiet-dialog>
    `;
  }

  render() {
    if (!this.meowzer) {
      return html`
        <div class="error-state">Meowzer not initialized</div>
      `;
    }

    return html`
      <div class="gallery-container">
        <div class="gallery-header">
          <h2 class="gallery-title">Cat Gallery</h2>

          <collection-picker
            .selectedCollection=${this.selectedCollectionId}
            @collection-select=${this.handleCollectionSelect}
            @collection-create=${this.handleCollectionCreate}
          ></collection-picker>
        </div>

        ${this.error
          ? html`
              <quiet-callout variant="error">
                <strong>Error:</strong> ${this.error}
              </quiet-callout>
            `
          : ""}
        ${this.loading
          ? html`
              <div class="loading-state">
                <quiet-spinner></quiet-spinner>
                <span>Loading cats...</span>
              </div>
            `
          : !this.selectedCollectionId
          ? html`
              <div class="empty-state">
                <quiet-icon name="folder"></quiet-icon>
                <p>Select a collection to view saved cats</p>
              </div>
            `
          : this.collectionCats.length === 0
          ? html`
              <div class="empty-state">
                <quiet-icon name="cat"></quiet-icon>
                <p>This collection is empty</p>
              </div>
            `
          : html`
              <div class="gallery-grid">
                ${this.collectionCats.map(
                  (cat) => html`
                    <cat-thumbnail
                      .cat=${cat}
                      @cat-load=${this.handleCatLoad}
                      @cat-delete=${this.handleCatDelete}
                    ></cat-thumbnail>
                  `
                )}
              </div>
            `}
        ${this.renderCreateDialog()}
      </div>
    `;
  }
}
