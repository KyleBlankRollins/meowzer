/**
 * CatManager - Display and manage all active cats
 *
 * Shows a grid or list of all cats with filtering, sorting, and bulk actions.
 * Uses CatsController for reactive updates.
 *
 * @example
 * ```html
 * <meowzer-provider>
 *   <cat-manager view="grid"></cat-manager>
 * </meowzer-provider>
 * ```
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import type { Meowzer, MeowzerCat } from "meowzer";

type ViewMode = "grid" | "list";
type SortBy = "name" | "created" | "state";

@customElement("cat-manager")
export class CatManager extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .manager-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .manager-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .manager-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0;
    }

    .manager-stats {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .manager-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .cats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .cats-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
    }

    .bulk-actions {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--quiet-neutral-background-softest, #f9fafb);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      align-items: center;
    }

    .bulk-actions-label {
      font-size: 0.875rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin-right: auto;
    }

    .empty-state-icon {
      font-size: 3rem;
    }

    @media (max-width: 640px) {
      .cats-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  @consume({ context: meowzerContext })
  meowzer?: Meowzer;

  private catsController = new CatsController(this);

  @property({ type: String }) view: ViewMode = "grid";
  @property({ type: String }) sortBy: SortBy = "created";
  @property({ type: Boolean }) showBulkActions = false;

  @state() private searchQuery = "";
  @state() private selectedCatIds = new Set<string>();

  private handleViewChange(view: ViewMode) {
    this.view = view;
  }

  private handleSortChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.sortBy = select.value as SortBy;
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
  }

  private handleCatSelect(catId: string, selected: boolean) {
    if (selected) {
      this.selectedCatIds.add(catId);
    } else {
      this.selectedCatIds.delete(catId);
    }
    this.requestUpdate();
  }

  private handleDeselectAll() {
    this.selectedCatIds.clear();
    this.requestUpdate();
  }

  private async handlePauseSelected() {
    for (const catId of this.selectedCatIds) {
      const cat = this.catsController.cats.find(
        (c) => c.id === catId
      );
      if (cat?.isActive) {
        cat.pause();
      }
    }
    this.selectedCatIds.clear();
    this.requestUpdate();
  }

  private async handleResumeSelected() {
    for (const catId of this.selectedCatIds) {
      const cat = this.catsController.cats.find(
        (c) => c.id === catId
      );
      if (cat && !cat.isActive) {
        cat.resume();
      }
    }
    this.selectedCatIds.clear();
    this.requestUpdate();
  }

  private async handleDestroySelected() {
    if (!this.meowzer) return;

    const confirmed = confirm(
      `Are you sure you want to remove ${this.selectedCatIds.size} cat(s)?`
    );

    if (confirmed) {
      for (const catId of this.selectedCatIds) {
        await this.meowzer.cats.destroy(catId);
      }
      this.selectedCatIds.clear();
      this.requestUpdate();
    }
  }

  private getFilteredAndSortedCats(): MeowzerCat[] {
    let cats = [...this.catsController.cats];

    // Filter by search query
    if (this.searchQuery) {
      cats = cats.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(this.searchQuery) ||
          cat.description?.toLowerCase().includes(this.searchQuery) ||
          cat.id.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort
    cats.sort((a, b) => {
      switch (this.sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "created":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "state":
          return a.state.localeCompare(b.state);
        default:
          return 0;
      }
    });

    return cats;
  }

  render() {
    if (!this.meowzer) {
      return html`
        <quiet-callout variant="destructive">
          <strong>No Meowzer SDK</strong>
          <p>
            Please wrap this component in a
            <code>&lt;meowzer-provider&gt;</code>.
          </p>
        </quiet-callout>
      `;
    }

    const cats = this.getFilteredAndSortedCats();
    const totalCats = this.catsController.cats.length;
    const activeCats = this.catsController.cats.filter(
      (c) => c.isActive
    ).length;
    const hasSelection = this.selectedCatIds.size > 0;

    return html`
      <div class="manager-container">
        <div class="manager-header">
          <div>
            <h2 class="manager-title">Cats</h2>
            <div class="manager-stats">
              ${totalCats} total • ${activeCats} active
              ${this.searchQuery ? ` • ${cats.length} filtered` : ""}
            </div>
          </div>

          <div class="manager-controls">
            <quiet-text-field
              placeholder="Search cats..."
              size="sm"
              @quiet-input=${this.handleSearchInput}
            >
              <quiet-icon
                slot="start"
                family="outline"
                name="search"
              ></quiet-icon>
            </quiet-text-field>

            <quiet-select
              size="sm"
              .value=${this.sortBy}
              @quiet-change=${this.handleSortChange}
            >
              <option value="created">Sort by Created</option>
              <option value="name">Sort by Name</option>
              <option value="state">Sort by State</option>
            </quiet-select>

            <quiet-button
              appearance=${this.view === "grid"
                ? "normal"
                : "outline"}
              size="sm"
              @click=${() => this.handleViewChange("grid")}
            >
              <quiet-icon
                family="outline"
                name="grid-dots"
              ></quiet-icon>
            </quiet-button>

            <quiet-button
              appearance=${this.view === "list"
                ? "normal"
                : "outline"}
              size="sm"
              @click=${() => this.handleViewChange("list")}
            >
              <quiet-icon family="outline" name="list"></quiet-icon>
            </quiet-button>
          </div>
        </div>

        ${hasSelection
          ? html`
              <div class="bulk-actions">
                <span class="bulk-actions-label">
                  ${this.selectedCatIds.size} selected
                </span>
                <quiet-button
                  size="sm"
                  @click=${this.handleDeselectAll}
                >
                  Deselect All
                </quiet-button>
                <quiet-button
                  size="sm"
                  @click=${this.handlePauseSelected}
                >
                  Pause
                </quiet-button>
                <quiet-button
                  size="sm"
                  @click=${this.handleResumeSelected}
                >
                  Resume
                </quiet-button>
                <quiet-button
                  size="sm"
                  variant="destructive"
                  @click=${this.handleDestroySelected}
                >
                  Remove
                </quiet-button>
              </div>
            `
          : ""}
        ${cats.length === 0
          ? html`
              <quiet-empty-state>
                <quiet-icon
                  slot="icon"
                  family="outline"
                  name="cat"
                  class="empty-state-icon"
                ></quiet-icon>
                <span slot="header">
                  ${totalCats === 0 ? "No cats yet" : "No cats found"}
                </span>
                <span slot="description">
                  ${totalCats === 0
                    ? "Create your first cat to get started!"
                    : "Try adjusting your search query."}
                </span>
              </quiet-empty-state>
            `
          : html`
              <div
                class=${this.view === "grid"
                  ? "cats-grid"
                  : "cats-list"}
              >
                ${cats.map((cat) =>
                  this.view === "grid"
                    ? html`
                        <cat-card
                          .cat=${cat}
                          .selected=${this.selectedCatIds.has(cat.id)}
                          ?selectable=${this.showBulkActions}
                          @cat-select=${(e: CustomEvent) =>
                            this.handleCatSelect(
                              cat.id,
                              e.detail.selected
                            )}
                        ></cat-card>
                      `
                    : html`
                        <cat-list-item
                          .cat=${cat}
                          .selected=${this.selectedCatIds.has(cat.id)}
                          ?selectable=${this.showBulkActions}
                          @cat-select=${(e: CustomEvent) =>
                            this.handleCatSelect(
                              cat.id,
                              e.detail.selected
                            )}
                        ></cat-list-item>
                      `
                )}
              </div>
            `}
      </div>
    `;
  }
}
