import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { mbMeowzerControlsStyles } from "./mb-meowzer-controls.styles.js";
import {
  getAllCats,
  createRandomCat,
  destroyAllCats,
} from "../../../../meowzer/meowzer/meowzer.js";

/**
 * Meowzer Controls - Fixed bottom panel for managing cats
 * Provides a toggleable interface for creating, removing, and managing cats
 */
@customElement("mb-meowzer-controls")
export class MbMeowzerControls extends LitElement {
  static styles = mbMeowzerControlsStyles;

  @state()
  private isExpanded = false;

  @state()
  private catCount = 0;

  private updateInterval?: number;

  connectedCallback() {
    super.connectedCallback();
    this.updateCatCount();

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
  }

  private handleCreateCat() {
    const playground = document.getElementById("cat-playground");
    if (playground) {
      createRandomCat({ container: playground as HTMLElement });
      this.updateCatCount();
    }
  }

  private handleDestroyAll() {
    if (this.catCount === 0) return;

    if (confirm(`Remove all ${this.catCount} cats?`)) {
      destroyAllCats();
      this.updateCatCount();
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
              <span>Create Cat</span>
            </button>

            <button
              class="control-button danger"
              @click=${this.handleDestroyAll}
              ?disabled=${this.catCount === 0}
            >
              <span class="button-icon">🗑️</span>
              <span>Remove All Cats</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-meowzer-controls": MbMeowzerControls;
  }
}
