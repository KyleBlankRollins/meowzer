import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { mbCatCreatorStyles } from "./mb-cat-creator.styles.js";

// Import from Meowzer SDK
import type {
  Meowbase,
  CatSettings,
  ProtoCat,
  PersonalityPreset,
} from "meowzer";
import {
  buildCat,
  validateCatSettings,
  createCat,
  injectBaseStyles,
  setDefaultBoundaries,
  getPersonalityPresets,
} from "meowzer";
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

  @state()
  private selectedPersonality: PersonalityPreset = "balanced";

  @state()
  private availablePersonalities: PersonalityPreset[] = [];

  @state()
  private makeRoaming = true;

  connectedCallback() {
    super.connectedCallback();
    console.log("[Cat Creator] Connected, db:", this.db);
    this.updatePreview();

    // Initialize Meowzer for roaming cats
    injectBaseStyles();
    this.updateBoundaries();
    this.availablePersonalities = getPersonalityPresets();
  }

  private updateBoundaries() {
    setDefaultBoundaries({
      minX: 0,
      minY: 0,
      maxX: window.innerWidth,
      maxY: window.innerHeight,
    });
  }

  updated(changedProperties: Map<string, any>) {
    console.log(
      "[Cat Creator] Updated, db changed:",
      changedProperties.has("db"),
      "db:",
      this.db,
      "isInitialized:",
      this.isInitialized
    );
    if (
      changedProperties.has("db") &&
      this.db &&
      !this.isInitialized
    ) {
      console.log("[Cat Creator] Initializing collection...");
      this.initializeCollection();
    }
  }

  private async initializeCollection() {
    if (!this.db) return;

    try {
      const loadResult = await this.db.loadCollection(
        this.COLLECTION_NAME
      );

      if (!loadResult.success) {
        // Collection doesn't exist, create it
        const createResult = await this.db.createCollection(
          this.COLLECTION_NAME,
          []
        );

        if (!createResult.success) {
          this.message = `Error creating collection: ${createResult.message}`;
          this.isInitialized = false;
          return;
        }

        // Load the newly created collection
        const secondLoadResult = await this.db.loadCollection(
          this.COLLECTION_NAME
        );

        if (!secondLoadResult.success) {
          this.message = `Error loading collection: ${secondLoadResult.message}`;
          this.isInitialized = false;
          return;
        }
      }

      this.isInitialized = true;
    } catch (error) {
      this.message = `Error initializing collection: ${error}`;
      this.isInitialized = false;
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

  private handleColorChange(e: CustomEvent) {
    this.settings = { ...this.settings, color: e.detail.value };
    this.updatePreview();
  }

  private handleEyeColorChange(e: CustomEvent) {
    this.settings = { ...this.settings, eyeColor: e.detail.value };
    this.updatePreview();
  }

  private handlePatternChange(e: CustomEvent) {
    this.settings = {
      ...this.settings,
      pattern: (e.target as any).value as CatSettings["pattern"],
    };
    this.updatePreview();
  }

  private handleSizeChange(e: CustomEvent) {
    this.settings = {
      ...this.settings,
      size: (e.target as any).value as CatSettings["size"],
    };
    this.updatePreview();
  }

  private handleFurLengthChange(e: CustomEvent) {
    this.settings = {
      ...this.settings,
      furLength: (e.target as any).value as CatSettings["furLength"],
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

        // Make cat roam the viewport if enabled
        if (this.makeRoaming) {
          const playground =
            document.getElementById("cat-playground");
          const container = playground || document.body;
          createCat(this.settings, {
            container,
            personality: this.selectedPersonality,
            autoStart: true,
          });
        }

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
          <quiet-spinner size="lg"></quiet-spinner>
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

                  <quiet-text-area
                    label="Description"
                    .value=${this.catDescription}
                    @quiet-input=${(e: CustomEvent) =>
                      (this.catDescription = (e.target as any).value)}
                    rows="3"
                  ></quiet-text-area>
                </div>

                <quiet-divider></quiet-divider>

                <!-- Appearance -->
                <div class="form-section">
                  <h4>Appearance</h4>

                  <div class="appearance-grid">
                    <mb-color-picker
                      label="Fur Color"
                      .value=${this.settings.color}
                      @color-change=${this.handleColorChange}
                    ></mb-color-picker>

                    <mb-color-picker
                      label="Eye Color"
                      .value=${this.settings.eyeColor}
                      @color-change=${this.handleEyeColorChange}
                    ></mb-color-picker>

                    <quiet-select
                      label="Pattern"
                      .value=${this.settings.pattern}
                      @quiet-change=${this.handlePatternChange}
                    >
                      <option value="solid">Solid</option>
                      <option value="tabby">Tabby</option>
                      <option value="calico">Calico</option>
                      <option value="tuxedo">Tuxedo</option>
                      <option value="spotted">Spotted</option>
                    </quiet-select>

                    <quiet-select
                      label="Fur Length"
                      .value=${this.settings.furLength}
                      @quiet-change=${this.handleFurLengthChange}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </quiet-select>
                  </div>
                </div>

                <quiet-divider></quiet-divider>

                <!-- Size -->
                <div class="form-section">
                  <h4>Size</h4>
                  <quiet-select
                    label="Body Size"
                    .value=${this.settings.size}
                    @quiet-change=${this.handleSizeChange}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </quiet-select>
                </div>

                <quiet-divider></quiet-divider>

                <!-- Behavior -->
                <div class="form-section">
                  <h4>Behavior</h4>
                  <quiet-select
                    label="Personality"
                    .value=${this.selectedPersonality}
                    @quiet-change=${(e: CustomEvent) =>
                      (this.selectedPersonality = (e.target as any)
                        .value as PersonalityPreset)}
                  >
                    ${this.availablePersonalities.map(
                      (p) => html`
                        <option value=${p}>
                          ${p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      `
                    )}
                  </quiet-select>

                  <quiet-checkbox
                    .checked=${this.makeRoaming}
                    @quiet-change=${(e: CustomEvent) =>
                      (this.makeRoaming = (e.target as any).checked)}
                  >
                    Make cat roam the viewport
                  </quiet-checkbox>
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
