import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mbCatCardStyles } from "./mb-cat-card.styles";
import type { Cat } from "meowbase/types";

/**
 * Cat card component for displaying a single cat
 */
@customElement("mb-cat-card")
export class MbCatCard extends LitElement {
  static styles = mbCatCardStyles;

  @property({ type: Object })
  declare cat: Cat;

  private handleEdit() {
    this.dispatchEvent(
      new CustomEvent("cat-edit", {
        detail: { cat: this.cat },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleDelete() {
    this.dispatchEvent(
      new CustomEvent("cat-delete", {
        detail: { id: this.cat.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <quiet-card class="cat-card">
        <div class="cat-info">
          <h4>${this.cat.name}</h4>
          <img src=${this.cat.image} />
          <p>${this.cat.description}</p>
          <p class="cat-meta">
            <quiet-badge
              >😊 ${this.cat.currentEmotion.name}</quiet-badge
            >
            <quiet-badge variant="primary"
              >🎾 ${this.cat.favoriteToy.name}</quiet-badge
            >
          </p>
          <p class="cat-id">ID: ${this.cat.id.substring(0, 8)}...</p>
        </div>
        <div class="cat-actions" slot="footer">
          <quiet-button size="sm" @click=${this.handleEdit}>
            Edit
          </quiet-button>
          <quiet-button
            size="sm"
            variant="destructive"
            @click=${this.handleDelete}
          >
            Delete
          </quiet-button>
        </div>
      </quiet-card>
    `;
  }
}
