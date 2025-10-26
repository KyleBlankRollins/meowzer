/**
 * CatExporter - UI for exporting cats to JSON files
 *
 * Supports exporting single cats or entire collections to JSON format.
 *
 * @fires export-complete - Emitted when export is successfully completed
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { StorageController } from "../../controllers/reactive-controllers.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";

type ExportMode = "active" | "collection";

@customElement("cat-exporter")
export class CatExporter extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .exporter-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .mode-selector {
      display: flex;
      gap: 0.5rem;
    }

    .export-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cat-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 0.75rem;
    }

    .cat-list-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cat-name {
      flex: 1;
      font-size: 0.875rem;
    }

    .export-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .export-preview {
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 1rem;
      font-family: monospace;
      font-size: 0.75rem;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `;

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state() private mode: ExportMode = "active";
  @state() private selectedCats: Set<string> = new Set();
  @state() private selectedCollectionId?: string;
  @state() private exportPreview?: string;
  @state() private exporting = false;

  private catsController = new CatsController(this);
  private storageController = new StorageController(this);

  private handleModeChange(mode: ExportMode) {
    this.mode = mode;
    this.selectedCats.clear();
    this.selectedCollectionId = undefined;
    this.exportPreview = undefined;
  }

  private handleCatToggle(catId: string, checked: boolean) {
    if (checked) {
      this.selectedCats.add(catId);
    } else {
      this.selectedCats.delete(catId);
    }
    this.requestUpdate();
  }

  private handleSelectAll() {
    const cats =
      this.mode === "active" ? this.catsController.cats : [];

    cats.forEach((cat) => this.selectedCats.add(cat.id));
    this.requestUpdate();
  }

  private handleDeselectAll() {
    this.selectedCats.clear();
    this.requestUpdate();
  }

  private handleCollectionSelect(e: CustomEvent) {
    this.selectedCollectionId = e.detail.collectionId;
  }

  private async handleExport() {
    if (!this.meowzer) return;

    this.exporting = true;

    try {
      let dataToExport: any;

      if (this.mode === "active") {
        // Export selected active cats
        const selectedCatsArray = this.catsController.cats.filter(
          (cat) => this.selectedCats.has(cat.id)
        );

        dataToExport = {
          type: "meowzer-cats",
          version: "1.0",
          exportedAt: new Date().toISOString(),
          cats: selectedCatsArray.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            seed: cat.seed,
            personality: cat.personality,
            createdAt: cat.createdAt.toISOString(),
            metadata: cat.metadata,
          })),
        };
      } else if (this.selectedCollectionId) {
        // Export collection
        const collectionInfo =
          await this.storageController.getCollectionInfo(
            this.selectedCollectionId
          );

        dataToExport = {
          type: "meowzer-collection",
          version: "1.0",
          exportedAt: new Date().toISOString(),
          collection: {
            name: collectionInfo.name,
            catCount: collectionInfo.catCount,
          },
        };
      }

      if (dataToExport) {
        // Convert to JSON
        const json = JSON.stringify(dataToExport, null, 2);
        this.exportPreview = json;

        // Download file
        const blob = new Blob([json], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meowzer-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.dispatchEvent(
          new CustomEvent("export-complete", {
            detail: {
              mode: this.mode,
              count: this.selectedCats.size,
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      this.exporting = false;
    }
  }

  render() {
    if (!this.meowzer) {
      return html`
        <quiet-callout variant="destructive">
          Meowzer not initialized
        </quiet-callout>
      `;
    }

    const canExport =
      (this.mode === "active" && this.selectedCats.size > 0) ||
      (this.mode === "collection" && this.selectedCollectionId);

    return html`
      <div class="exporter-container">
        <h3>Export Cats</h3>

        <div class="mode-selector">
          <quiet-button
            appearance=${this.mode === "active"
              ? "normal"
              : "outline"}
            variant="primary"
            @click=${() => this.handleModeChange("active")}
          >
            Active Cats
          </quiet-button>
          <quiet-button
            appearance=${this.mode === "collection"
              ? "normal"
              : "outline"}
            variant="primary"
            @click=${() => this.handleModeChange("collection")}
          >
            Collection
          </quiet-button>
        </div>

        ${this.mode === "active"
          ? html`
              <div class="export-options">
                <div
                  style="display: flex; justify-content: space-between; align-items: center;"
                >
                  <span>Select cats to export:</span>
                  <div style="display: flex; gap: 0.5rem;">
                    <quiet-button
                      size="sm"
                      @click=${this.handleSelectAll}
                    >
                      Select All
                    </quiet-button>
                    <quiet-button
                      size="sm"
                      @click=${this.handleDeselectAll}
                    >
                      Deselect All
                    </quiet-button>
                  </div>
                </div>

                ${this.catsController.cats.length === 0
                  ? html`
                      <quiet-empty-state>
                        <span slot="title">No active cats</span>
                        <span slot="description"
                          >Create some cats first to export them</span
                        >
                      </quiet-empty-state>
                    `
                  : html`
                      <div class="cat-list">
                        ${this.catsController.cats.map(
                          (cat) => html`
                            <div class="cat-list-item">
                              <quiet-checkbox
                                ?checked=${this.selectedCats.has(
                                  cat.id
                                )}
                                @quiet-change=${(e: CustomEvent) =>
                                  this.handleCatToggle(
                                    cat.id,
                                    e.detail.checked
                                  )}
                              ></quiet-checkbox>
                              <span class="cat-name">
                                ${cat.name || "Unnamed Cat"}
                              </span>
                            </div>
                          `
                        )}
                      </div>
                    `}
              </div>
            `
          : html`
              <div class="export-options">
                <collection-picker
                  .selectedCollection=${this.selectedCollectionId}
                  @collection-select=${this.handleCollectionSelect}
                  ?showCreateButton=${false}
                ></collection-picker>
              </div>
            `}
        ${this.exportPreview
          ? html`
              <div>
                <h4>Export Preview:</h4>
                <div class="export-preview">
                  ${this.exportPreview}
                </div>
              </div>
            `
          : ""}

        <div class="export-actions">
          <quiet-button
            variant="primary"
            @click=${this.handleExport}
            ?disabled=${!canExport || this.exporting}
          >
            ${this.exporting
              ? "Exporting..."
              : `Export ${
                  this.mode === "active"
                    ? `${this.selectedCats.size} Cat${
                        this.selectedCats.size !== 1 ? "s" : ""
                      }`
                    : "Collection"
                }`}
          </quiet-button>
        </div>
      </div>
    `;
  }
}
