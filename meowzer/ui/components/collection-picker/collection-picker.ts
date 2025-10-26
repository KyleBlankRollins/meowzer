/**
 * CollectionPicker - Dropdown selector for choosing a collection
 *
 * Displays all available collections and allows selection.
 * Integrates with StorageController for reactive collection list.
 *
 * @fires collection-select - Emitted when a collection is selected
 * @fires collection-create - Emitted when create new collection is triggered
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { StorageController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";

@customElement("collection-picker")
export class CollectionPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .picker-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .picker-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--quiet-neutral-foreground, #111827);
      white-space: nowrap;
    }

    quiet-select {
      flex: 1;
      min-width: 200px;
    }

    quiet-button {
      flex-shrink: 0;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }

    .error {
      padding: 0.5rem;
      color: var(--quiet-destructive-foreground, #dc2626);
      font-size: 0.875rem;
    }

    .empty {
      padding: 0.5rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }
  `;

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @property({ type: String }) selectedCollection?: string;
  @property({ type: Boolean }) showCreateButton = true;
  @property({ type: Boolean }) showLabel = true;
  @property({ type: String }) label = "Collection:";
  @property({ type: String }) placeholder = "Select a collection";

  private storageController = new StorageController(this);

  private handleSelectionChange(e: CustomEvent) {
    const select = e.target as any;
    const value = select.value;

    if (value) {
      this.selectedCollection = value;
      this.dispatchEvent(
        new CustomEvent("collection-select", {
          detail: { collectionId: value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleCreateClick() {
    this.dispatchEvent(
      new CustomEvent("collection-create", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.meowzer) {
      return html`<div class="error">Meowzer not initialized</div>`;
    }

    if (this.storageController.loading) {
      return html`
        <div class="loading">
          <quiet-spinner size="small"></quiet-spinner>
          <span>Loading collections...</span>
        </div>
      `;
    }

    if (this.storageController.error) {
      return html`
        <div class="error">
          Error loading collections:
          ${this.storageController.error.message}
        </div>
      `;
    }

    const collections = this.storageController.collections;

    if (collections.length === 0) {
      return html`
        <div class="empty">
          No collections found.
          ${this.showCreateButton
            ? html`
                <quiet-button @click=${this.handleCreateClick}>
                  Create your first collection
                </quiet-button>
              `
            : ""}
        </div>
      `;
    }

    return html`
      <div class="picker-container">
        ${this.showLabel
          ? html`<span class="picker-label">${this.label}</span>`
          : ""}

        <quiet-select
          .value=${this.selectedCollection || ""}
          placeholder=${this.placeholder}
          @quiet-change=${this.handleSelectionChange}
        >
          ${collections.map(
            (collection) => html`
              <quiet-option value=${collection.id}>
                ${collection.name} (${collection.catCount} cats)
              </quiet-option>
            `
          )}
        </quiet-select>

        ${this.showCreateButton
          ? html`
              <quiet-button @click=${this.handleCreateClick}>
                <quiet-icon name="plus"></quiet-icon>
                New
              </quiet-button>
            `
          : ""}
      </div>
    `;
  }
}
