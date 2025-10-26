/**
 * CatCard - Individual card for displaying a cat
 *
 * Shows cat info, status, and provides quick action controls.
 *
 * @fires cat-select - Emitted when card is selected/deselected (if selectable)
 * @fires cat-action - Emitted when an action button is clicked
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MeowzerCat } from "meowzer";

@customElement("cat-card")
export class CatCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 1rem;
      background: var(--quiet-neutral-background, #ffffff);
      transition: all 0.2s ease;
      position: relative;
    }

    .card:hover {
      border-color: var(--quiet-neutral-stroke, #d1d5db);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .card.selected {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      background: var(--quiet-primary-background-softest, #dbeafe);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0;
      word-break: break-word;
    }

    .card-description {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0.75rem 0;
      font-size: 0.875rem;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-label {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .meta-value {
      font-weight: 500;
      color: var(--quiet-neutral-foreground, #111827);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .status-indicator {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }

    .status-indicator.active {
      background: var(--quiet-constructive-stroke, #10b981);
    }

    .status-indicator.paused {
      background: var(--quiet-warning-stroke, #f59e0b);
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid
        var(--quiet-neutral-stroke-softest, #f3f4f6);
    }

    .checkbox-container {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
    }

    :host([selectable]) .card {
      padding-left: 2.5rem;
    }
  `;

  @property({ type: Object }) cat!: MeowzerCat;
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean, reflect: true }) selectable = false;

  private handleCheckboxChange(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("cat-select", {
        detail: { selected: checkbox.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handlePause() {
    this.cat.pause();
  }

  private handleResume() {
    this.cat.resume();
  }

  private async handleDestroy() {
    const confirmed = confirm(
      `Destroy ${this.cat.name || "this cat"}?`
    );
    if (confirmed) {
      await this.cat.delete();
    }
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  render() {
    const { cat } = this;

    return html`
      <div class="card ${this.selected ? "selected" : ""}">
        ${this.selectable
          ? html`
              <div class="checkbox-container">
                <quiet-checkbox
                  ?checked=${this.selected}
                  @quiet-change=${this.handleCheckboxChange}
                ></quiet-checkbox>
              </div>
            `
          : ""}

        <div class="card-header">
          <h3 class="card-title">${cat.name || "Unnamed Cat"}</h3>
        </div>

        ${cat.description
          ? html` <p class="card-description">${cat.description}</p> `
          : ""}

        <div class="card-meta">
          <div class="meta-row">
            <span class="meta-label">Status</span>
            <span class="status-badge">
              <span
                class="status-indicator ${cat.isActive
                  ? "active"
                  : "paused"}"
              ></span>
              <span class="meta-value"
                >${cat.isActive ? "Active" : "Paused"}</span
              >
            </span>
          </div>

          <div class="meta-row">
            <span class="meta-label">State</span>
            <span class="meta-value">
              ${cat.state.charAt(0).toUpperCase() +
              cat.state.slice(1)}
            </span>
          </div>

          <div class="meta-row">
            <span class="meta-label">Created</span>
            <span class="meta-value"
              >${this.formatDate(cat.createdAt)}</span
            >
          </div>
        </div>

        <cat-controls
          .cat=${cat}
          @pause=${this.handlePause}
          @resume=${this.handleResume}
          @destroy=${this.handleDestroy}
        ></cat-controls>
      </div>
    `;
  }
}
