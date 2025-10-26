/**
 * CatListItem - Compact list row for displaying a cat
 *
 * Shows cat info in a horizontal layout optimized for list view.
 *
 * @fires cat-select - Emitted when checkbox is toggled (if selectable)
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MeowzerCat } from "meowzer";

@customElement("cat-list-item")
export class CatListItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--quiet-neutral-stroke-softest, #f3f4f6);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      background: var(--quiet-neutral-background, #ffffff);
      transition: all 0.2s ease;
    }

    .list-item:hover {
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border-color: var(--quiet-neutral-stroke-soft, #e0e0e0);
    }

    .list-item.selected {
      background: var(--quiet-primary-background-softest, #dbeafe);
      border-color: var(--quiet-primary-stroke, #3b82f6);
    }

    .checkbox {
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 1rem;
      align-items: center;
      min-width: 0;
    }

    .name-description {
      min-width: 0;
    }

    .name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0 0 0.125rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .description {
      font-size: 0.75rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
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

    .state {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .created {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .controls {
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .info {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .state,
      .created {
        display: none;
      }
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
      <div class="list-item ${this.selected ? "selected" : ""}">
        ${this.selectable
          ? html`
              <div class="checkbox">
                <quiet-checkbox
                  ?checked=${this.selected}
                  @quiet-change=${this.handleCheckboxChange}
                ></quiet-checkbox>
              </div>
            `
          : ""}

        <div class="info">
          <div class="name-description">
            <p class="name">${cat.name || "Unnamed Cat"}</p>
            ${cat.description
              ? html` <p class="description">${cat.description}</p> `
              : ""}
          </div>

          <div class="status">
            <span
              class="status-indicator ${cat.isActive
                ? "active"
                : "paused"}"
            ></span>
            <span>${cat.isActive ? "Active" : "Paused"}</span>
          </div>

          <div class="state">
            ${cat.state.charAt(0).toUpperCase() + cat.state.slice(1)}
          </div>

          <div class="created">${this.formatDate(cat.createdAt)}</div>
        </div>

        <div class="controls">
          <cat-controls
            .cat=${cat}
            size="small"
            @pause=${this.handlePause}
            @resume=${this.handleResume}
            @destroy=${this.handleDestroy}
          ></cat-controls>
        </div>
      </div>
    `;
  }
}
