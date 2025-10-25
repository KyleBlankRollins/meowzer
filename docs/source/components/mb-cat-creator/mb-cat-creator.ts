import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { mbCatCreatorStyles } from "./mb-cat-creator.styles.js";

// Import from Meowzer SDK
import type { Meowbase, CatSettings, ProtoCat } from "meowzer";
import { buildCat, validateCatSettings } from "meowzer";
import { meowbaseContext } from "../../contexts/meowbase-context.js";

/**
 * Cat Creator Component
 * Character-creator style form for building cats with Meowkit
 * Saves created cats to Meowbase
 */
@customElement("mb-cat-creator")
export class CatCreator extends LitElement {
  static styles = mbCatCreatorStyles;

  @consume({ context: meowbaseContext, subscribe: true })
  @state()
  private db: Meowbase | null = null;

  private readonly COLLECTION_NAME = "my-cats";

  @state()
  private settings: CatSettings = {
    color: "#FF9500",
    eyeColor: "#00FF00",
    pattern: "tabby",
    size: "medium",
    furLength: "short",
  };

  @state()
  private preview: ProtoCat | null = null;

  @state()
  private catName = "";

  @state()
  private catDescription = "";

  @state()
  private message = "";

  @state()
  private isInitialized = false;

  @state()
  private validationErrors: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.updatePreview();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("db") &&
      this.db &&
      !this.isInitialized
    ) {
      this.initializeCollection();
    }
  }

  private async initializeCollection() {
    if (!this.db) return;

    this.isInitialized = true;

    try {
      const loadResult = await this.db.loadCollection(
        this.COLLECTION_NAME
      );

      if (!loadResult.success) {
        await this.db.createCollection(this.COLLECTION_NAME, []);
        await this.db.loadCollection(this.COLLECTION_NAME);
      }
    } catch (error) {
      this.message = `Error initializing collection: ${error}`;
    }
  }

  private updatePreview() {
    const validation = validateCatSettings(this.settings);

    if (validation.valid) {
      this.validationErrors = [];
      try {
        this.preview = buildCat(this.settings);
      } catch (error) {
        this.validationErrors = [`Error building cat: ${error}`];
        this.preview = null;
      }
    } else {
      this.validationErrors = validation.errors;
      this.preview = null;
    }
  }

  private handleColorChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.settings = { ...this.settings, color: input.value };
    this.updatePreview();
  }

  private handleEyeColorChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.settings = { ...this.settings, eyeColor: input.value };
    this.updatePreview();
  }

  private handlePatternChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.settings = {
      ...this.settings,
      pattern: select.value as CatSettings["pattern"],
    };
    this.updatePreview();
  }

  private handleSizeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.settings = {
      ...this.settings,
      size: select.value as CatSettings["size"],
    };
    this.updatePreview();
  }

  private handleFurLengthChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.settings = {
      ...this.settings,
      furLength: select.value as CatSettings["furLength"],
    };
    this.updatePreview();
  }

  private async handleCreate() {
    if (!this.db || !this.preview) {
      this.message =
        "Cannot create cat - database or preview not available";
      return;
    }

    if (!this.catName.trim()) {
      this.message = "Please enter a name for your cat";
      return;
    }

    try {
      const newCat = {
        id: this.preview.id,
        name: this.catName,
        image: this.preview.spriteData.svg, // Use SVG as image
        birthday: new Date(),
        favoriteToy: {
          id: crypto.randomUUID(),
          name: "Yarn Ball",
          image: "🧶",
          type: "toy",
          description: "A colorful ball of yarn",
        },
        description:
          this.catDescription || `A ${this.settings.pattern} cat`,
        currentEmotion: {
          id: crypto.randomUUID(),
          name: "Happy",
        },
        importantHumans: [],
      };

      const result = this.db.addCatToCollection(
        this.COLLECTION_NAME,
        newCat
      );

      if (result.success) {
        await this.db.saveCollection(this.COLLECTION_NAME);
        this.message = `Created ${this.catName}! 🎉`;

        // Reset form
        this.catName = "";
        this.catDescription = "";
        this.settings = {
          color: "#FF9500",
          eyeColor: "#00FF00",
          pattern: "tabby",
          size: "medium",
          furLength: "short",
        };
        this.updatePreview();

        // Dispatch event for parent components
        this.dispatchEvent(
          new CustomEvent("cat-created", {
            detail: { cat: newCat },
            bubbles: true,
            composed: true,
          })
        );
      } else {
        this.message = `Error: ${result.message}`;
      }
    } catch (error) {
      this.message = `Error creating cat: ${error}`;
    }
  }

  render() {
    if (!this.db || !this.isInitialized) {
      return html`
        <div class="creator-loading">
          <p>Initializing cat creator...</p>
        </div>
      `;
    }

    return html`
      <div class="cat-creator">
        ${this.message
          ? html`<quiet-callout variant="primary" class="message">
              ${this.message}
            </quiet-callout>`
          : ""}

        <div class="creator-layout">
          <!-- Preview Panel -->
          <div class="preview-panel">
            <quiet-card>
              <h3 slot="header">Preview</h3>
              ${this.preview
                ? html`
                    <div class="preview-container">
                      <div
                        class="cat-preview"
                        .innerHTML=${this.preview.spriteData.svg}
                      ></div>
                      <div class="preview-details">
                        <p>
                          <strong>Seed:</strong> ${this.preview.seed}
                        </p>
                        <p>
                          <strong>Size:</strong> ${this.preview
                            .dimensions.size}
                        </p>
                      </div>
                    </div>
                  `
                : html`
                    <div class="preview-error">
                      <p>Invalid settings</p>
                      ${this.validationErrors.map(
                        (err) =>
                          html`<p class="error-text">${err}</p>`
                      )}
                    </div>
                  `}
            </quiet-card>
          </div>

          <!-- Settings Panel -->
          <div class="settings-panel">
            <quiet-card>
              <h3 slot="header">Cat Creator</h3>

              <div class="creator-form">
                <!-- Basic Info -->
                <div class="form-section">
                  <h4>Basic Info</h4>
                  <quiet-text-field
                    label="Name"
                    .value=${this.catName}
                    @quiet-input=${(e: CustomEvent) =>
                      (this.catName = (e.target as any).value)}
                    required
                  ></quiet-text-field>

                  <quiet-text-field
                    label="Description"
                    .value=${this.catDescription}
                    @quiet-input=${(e: CustomEvent) =>
                      (this.catDescription = (e.target as any).value)}
                  ></quiet-text-field>
                </div>

                <!-- Appearance -->
                <div class="form-section">
                  <h4>Appearance</h4>

                  <div class="color-picker">
                    <label>
                      <span>Fur Color</span>
                      <input
                        type="color"
                        .value=${this.settings.color}
                        @input=${this.handleColorChange}
                      />
                      <span class="color-value"
                        >${this.settings.color}</span
                      >
                    </label>
                  </div>

                  <div class="color-picker">
                    <label>
                      <span>Eye Color</span>
                      <input
                        type="color"
                        .value=${this.settings.eyeColor}
                        @input=${this.handleEyeColorChange}
                      />
                      <span class="color-value"
                        >${this.settings.eyeColor}</span
                      >
                    </label>
                  </div>

                  <label>
                    <span>Pattern</span>
                    <select
                      @change=${this.handlePatternChange}
                      .value=${this.settings.pattern}
                    >
                      <option value="solid">Solid</option>
                      <option value="tabby">Tabby</option>
                      <option value="calico">Calico</option>
                      <option value="tuxedo">Tuxedo</option>
                      <option value="spotted">Spotted</option>
                    </select>
                  </label>

                  <label>
                    <span>Fur Length</span>
                    <select
                      @change=${this.handleFurLengthChange}
                      .value=${this.settings.furLength}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </label>
                </div>

                <!-- Size -->
                <div class="form-section">
                  <h4>Size</h4>
                  <label>
                    <span>Body Size</span>
                    <select
                      @change=${this.handleSizeChange}
                      .value=${this.settings.size}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </div>

                <!-- Actions -->
                <div class="form-actions">
                  <quiet-button
                    variant="primary"
                    @click=${this.handleCreate}
                    ?disabled=${!this.preview || !this.catName.trim()}
                  >
                    Create Cat
                  </quiet-button>
                </div>
              </div>
            </quiet-card>
          </div>
        </div>
      </div>
    `;
  }
}
