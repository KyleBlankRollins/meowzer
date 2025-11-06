/**
 * CatThumbnail - Compact thumbnail for gallery view
 *
 * Shows a visual representation of a saved cat with quick actions.
 *
 * @fires cat-load - Emitted when load button is clicked
 * @fires cat-delete - Emitted when delete button is clicked
 */

import { LitElement, html }  from "lit";
import { customElement, property } from "lit/decorators.js";
import { catThumbnailStyles } from "./cat-thumbnail.style.js";

export interface SavedCatInfo {
  id: string;
  name: string;
  image: string;
  birthday?: Date;
  description?: string;
}

@customElement("cat-thumbnail")
export class CatThumbnail extends LitElement {
  static styles = [catThumbnailStyles];

  @property({ type: Object }) cat!: SavedCatInfo;
  @property({ type: Boolean }) showDelete = true;

  private handleLoad(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("cat-load", {
        detail: { cat: this.cat },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async handleDelete(e: Event) {
    e.stopPropagation();
    const confirmed = confirm(
      `Delete ${this.cat.name || "this cat"}?`
    );
    if (confirmed) {
      this.dispatchEvent(
        new CustomEvent("cat-delete", {
          detail: { cat: this.cat },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const { cat } = this;

    return html`
      <div class="thumbnail" @click=${this.handleLoad}>
        <div class="thumbnail-image">
          ${cat.image
            ? html`<img src=${cat.image} alt=${cat.name || "Cat"} />`
            : html`<quiet-icon
                class="placeholder-icon"
                name="cat"
              ></quiet-icon>`}
        </div>

        <h3 class="thumbnail-name">${cat.name || "Unnamed Cat"}</h3>

        ${cat.description
          ? html`<p class="thumbnail-description">
              ${cat.description}
            </p>`
          : ""}

        <div class="thumbnail-actions">
          <quiet-button variant="primary" @click=${this.handleLoad}>
            Load
          </quiet-button>

          ${this.showDelete
            ? html`
                <quiet-button
                  appearance="outline"
                  variant="destructive"
                  @click=${this.handleDelete}
                >
                  Delete
                </quiet-button>
              `
            : ""}
        </div>
      </div>
    `;
  }
}
