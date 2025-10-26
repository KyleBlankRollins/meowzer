/**
 * CatThumbnail - Compact thumbnail for gallery view
 *
 * Shows a visual representation of a saved cat with quick actions.
 *
 * @fires cat-load - Emitted when load button is clicked
 * @fires cat-delete - Emitted when delete button is clicked
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface SavedCatInfo {
  id: string;
  name: string;
  image: string;
  birthday?: Date;
  description?: string;
}

@customElement("cat-thumbnail")
export class CatThumbnail extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .thumbnail {
      border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 1rem;
      background: var(--quiet-neutral-background, #ffffff);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .thumbnail:hover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .thumbnail-image {
      width: 100%;
      aspect-ratio: 1;
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      overflow: hidden;
    }

    .thumbnail-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-icon {
      font-size: 3rem;
      color: var(--quiet-neutral-foreground-softer, #9ca3af);
    }

    .thumbnail-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .thumbnail-description {
      font-size: 0.75rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .thumbnail-actions {
      display: flex;
      gap: 0.5rem;
    }

    quiet-button {
      flex: 1;
    }
  `;

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
