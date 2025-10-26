/**
 * CatImporter - UI for importing cats from JSON files
 *
 * Allows users to upload JSON files and import cats into active or storage.
 *
 * @fires import-complete - Emitted when import is successfully completed
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { ref, createRef } from "lit/directives/ref.js";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { StorageController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";

interface ImportData {
  type: string;
  version: string;
  exportedAt?: string;
  cats?: any[];
  collection?: any;
}

@customElement("cat-importer")
export class CatImporter extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .importer-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .upload-area {
      border: 2px dashed var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .upload-area:hover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      background: var(--quiet-primary-background-softest, #dbeafe);
    }

    .upload-area.dragover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      background: var(--quiet-primary-background-softest, #dbeafe);
    }

    .upload-icon {
      font-size: 3rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin-bottom: 1rem;
    }

    .upload-text {
      color: var(--quiet-neutral-foreground, #111827);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .upload-hint {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }

    input[type="file"] {
      display: none;
    }

    .preview-container {
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 1rem;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .preview-title {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .preview-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .preview-row {
      display: flex;
      justify-content: space-between;
    }

    .preview-label {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .import-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .import-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `;

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state() private importData?: ImportData;
  @state() private importing = false;
  @state() private targetCollection?: string;
  @state() private createActive = true;

  private storageController = new StorageController(this);
  private fileInputRef = createRef<HTMLInputElement>();

  private handleUploadClick() {
    this.fileInputRef.value?.click();
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget as HTMLElement;
    uploadArea.classList.add("dragover");
  }

  private handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget as HTMLElement;
    uploadArea.classList.remove("dragover");
  }

  private async handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const uploadArea = e.currentTarget as HTMLElement;
    uploadArea.classList.remove("dragover");

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.processFile(files[0]);
    }
  }

  private async handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      await this.processFile(files[0]);
    }
  }

  private async processFile(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ImportData;

      // Validate format
      if (!data.type || !data.version) {
        throw new Error("Invalid import file format");
      }

      if (
        data.type !== "meowzer-cats" &&
        data.type !== "meowzer-collection"
      ) {
        throw new Error("Unsupported import type");
      }

      this.importData = data;
    } catch (err) {
      alert(`Error reading file: ${(err as Error).message}`);
      this.importData = undefined;
    }
  }

  private handleCollectionSelect(e: CustomEvent) {
    this.targetCollection = e.detail.collectionId;
  }

  private async handleImport() {
    if (!this.meowzer || !this.importData) return;

    this.importing = true;

    try {
      if (
        this.importData.type === "meowzer-cats" &&
        this.importData.cats
      ) {
        let importedCount = 0;

        for (const catData of this.importData.cats) {
          // Create cat from imported data
          const cat = await this.meowzer.cats.create({
            seed: catData.seed,
            name: catData.name,
            description: catData.description,
          });

          // Set personality if provided
          if (catData.personality) {
            cat.setPersonality(catData.personality);
          }

          // Save to collection if specified
          if (this.targetCollection) {
            await this.storageController.saveCat(
              cat,
              this.targetCollection
            );
          }

          // Start if createActive is true
          if (this.createActive) {
            cat.resume();
          }

          importedCount++;
        }

        this.dispatchEvent(
          new CustomEvent("import-complete", {
            detail: {
              type: this.importData.type,
              count: importedCount,
            },
            bubbles: true,
            composed: true,
          })
        );

        // Reset
        this.importData = undefined;
        this.targetCollection = undefined;
      }
    } catch (err) {
      alert(`Import failed: ${(err as Error).message}`);
    } finally {
      this.importing = false;
    }
  }

  private handleCancel() {
    this.importData = undefined;
    this.targetCollection = undefined;
    if (this.fileInputRef.value) {
      this.fileInputRef.value.value = "";
    }
  }

  render() {
    if (!this.meowzer) {
      return html`
        <quiet-callout variant="error">
          Meowzer not initialized
        </quiet-callout>
      `;
    }

    return html`
      <div class="importer-container">
        <h3>Import Cats</h3>

        ${!this.importData
          ? html`
              <div
                class="upload-area"
                @click=${this.handleUploadClick}
                @dragover=${this.handleDragOver}
                @dragleave=${this.handleDragLeave}
                @drop=${this.handleDrop}
              >
                <quiet-icon
                  class="upload-icon"
                  name="upload"
                ></quiet-icon>
                <div class="upload-text">
                  Click to upload or drag and drop
                </div>
                <div class="upload-hint">JSON files only</div>
                <input
                  type="file"
                  accept=".json,application/json"
                  @change=${this.handleFileChange}
                  ${ref(this.fileInputRef)}
                />
              </div>
            `
          : html`
              <div class="preview-container">
                <div class="preview-header">
                  <span class="preview-title">Import Preview</span>
                  <quiet-button
                    variant="text"
                    size="small"
                    @click=${this.handleCancel}
                  >
                    Cancel
                  </quiet-button>
                </div>

                <div class="preview-details">
                  <div class="preview-row">
                    <span class="preview-label">Type:</span>
                    <span>${this.importData.type}</span>
                  </div>
                  <div class="preview-row">
                    <span class="preview-label">Version:</span>
                    <span>${this.importData.version}</span>
                  </div>
                  ${this.importData.cats
                    ? html`
                        <div class="preview-row">
                          <span class="preview-label">Cats:</span>
                          <span>${this.importData.cats.length}</span>
                        </div>
                      `
                    : ""}
                  ${this.importData.exportedAt
                    ? html`
                        <div class="preview-row">
                          <span class="preview-label">Exported:</span>
                          <span>
                            ${new Date(
                              this.importData.exportedAt
                            ).toLocaleString()}
                          </span>
                        </div>
                      `
                    : ""}
                </div>
              </div>

              <div class="import-options">
                <quiet-checkbox
                  ?checked=${this.createActive}
                  @quiet-change=${(e: CustomEvent) =>
                    (this.createActive = e.detail.checked)}
                >
                  Create as active cats
                </quiet-checkbox>

                <div>
                  <quiet-checkbox
                    ?checked=${!!this.targetCollection}
                    @quiet-change=${(e: CustomEvent) => {
                      if (!e.detail.checked) {
                        this.targetCollection = undefined;
                      }
                    }}
                  >
                    Save to collection
                  </quiet-checkbox>

                  ${this.targetCollection !== undefined
                    ? html`
                        <collection-picker
                          .selectedCollection=${this.targetCollection}
                          @collection-select=${this
                            .handleCollectionSelect}
                          ?showCreateButton=${true}
                          ?showLabel=${false}
                        ></collection-picker>
                      `
                    : ""}
                </div>
              </div>

              <div class="import-actions">
                <quiet-button
                  variant="filled"
                  @click=${this.handleImport}
                  ?disabled=${this.importing}
                >
                  ${this.importing
                    ? "Importing..."
                    : `Import ${
                        this.importData.cats?.length || 0
                      } Cat${
                        this.importData.cats?.length !== 1 ? "s" : ""
                      }`}
                </quiet-button>
              </div>
            `}
      </div>
    `;
  }
}
