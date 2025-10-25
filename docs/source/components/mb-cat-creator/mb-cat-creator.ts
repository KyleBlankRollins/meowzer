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
  injectBaseStyles,
  setDefaultBoundaries,
  getPersonalityPresets,
} from "meowzer";
import { meowbaseContext } from "../../contexts/meowbase-context.js";

// Import extracted modules
import { validateCatForm } from "./logic/validation.js";
import {
  ensureCollectionExists,
  createCatObject,
  saveCatToCollection,
  spawnRoamingCat,
} from "./logic/cat-creation.js";
import { renderPreview } from "./templates/preview.js";
import {
  renderBasicInfoSection,
  renderAppearanceSection,
  renderSizeSection,
  renderBehaviorSection,
} from "./templates/form-fields.js";

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

  private readonly COLLECTION_NAME = "roaming-cats"; // Changed to match mb-meowzer-controls

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

    const result = await ensureCollectionExists(
      this.db,
      this.COLLECTION_NAME
    );

    if (result.success) {
      this.isInitialized = true;
    } else {
      this.message =
        result.message || "Failed to initialize collection";
      this.isInitialized = false;
    }
  }

  private updatePreview() {
    console.log(
      "[Cat Creator] updatePreview called with settings:",
      this.settings
    );
    const validation = validateCatSettings(this.settings);

    if (validation.valid) {
      console.log("[Cat Creator] Settings valid, building cat...");
      this.validationErrors = [];
      try {
        this.preview = buildCat(this.settings);
        console.log(
          "[Cat Creator] Preview built successfully:",
          this.preview?.id
        );
      } catch (error) {
        console.error("[Cat Creator] Error building cat:", error);
        this.validationErrors = [`Error building cat: ${error}`];
        this.preview = null;
      }
    } else {
      console.log(
        "[Cat Creator] Settings invalid:",
        validation.errors
      );
      this.validationErrors = validation.errors;
      this.preview = null;
    }
  }

  private handleColorChange(e: CustomEvent) {
    console.log(
      "[Cat Creator] Fur color change event received:",
      e.detail.value
    );
    console.log("[Cat Creator] Current settings:", this.settings);
    this.settings = { ...this.settings, color: e.detail.value };
    console.log("[Cat Creator] New settings:", this.settings);
    this.updatePreview();
  }

  private handleEyeColorChange(e: CustomEvent) {
    console.log(
      "[Cat Creator] Eye color change event received:",
      e.detail.value
    );
    console.log("[Cat Creator] Current settings:", this.settings);
    this.settings = { ...this.settings, eyeColor: e.detail.value };
    console.log("[Cat Creator] New settings:", this.settings);
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
    console.log(
      "[Cat Creator] Size change event received:",
      (e.target as any).value
    );
    console.log("[Cat Creator] Current settings:", this.settings);
    this.settings = {
      ...this.settings,
      size: (e.target as any).value as CatSettings["size"],
    };
    console.log("[Cat Creator] New settings:", this.settings);
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

    // Validate form
    const validation = validateCatForm({
      name: this.catName,
      description: this.catDescription,
    });

    if (!validation.valid) {
      this.message = validation.errors.join(", ");
      return;
    }

    try {
      // Spawn roaming cat first to get its ID
      let spawnedCat = null;
      if (this.makeRoaming) {
        spawnedCat = spawnRoamingCat(this.settings, {
          name: this.catName,
          personality: this.selectedPersonality,
        });
      }

      // Create cat object with the spawned cat's ID if available
      const newCat = createCatObject({
        protoCat: this.preview,
        name: this.catName,
        description: this.catDescription,
        settings: this.settings,
      });

      // Use spawned cat's ID instead of protoCat's ID for consistency
      if (spawnedCat) {
        newCat.id = spawnedCat.id;
      }

      // Save to database
      const result = await saveCatToCollection(
        this.db,
        this.COLLECTION_NAME,
        newCat
      );

      if (result.success) {
        this.message = result.message;

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
        this.message = result.message;
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
              ${renderPreview(this.preview, this.validationErrors)}
            </quiet-card>
          </div>

          <!-- Settings Panel -->
          <div class="settings-panel">
            <quiet-card>
              <h3 slot="header">Cat Creator</h3>

              <div class="creator-form">
                <!-- Basic Info -->
                ${renderBasicInfoSection(
                  {
                    catName: this.catName,
                    catDescription: this.catDescription,
                  },
                  {
                    onNameChange: (e: CustomEvent) =>
                      (this.catName = (e.target as any).value),
                    onDescriptionChange: (e: CustomEvent) =>
                      (this.catDescription = (e.target as any).value),
                  }
                )}

                <quiet-divider></quiet-divider>

                <!-- Appearance -->
                ${renderAppearanceSection(this.settings, {
                  onColorChange: this.handleColorChange,
                  onEyeColorChange: this.handleEyeColorChange,
                  onPatternChange: this.handlePatternChange,
                  onFurLengthChange: this.handleFurLengthChange,
                })}

                <quiet-divider></quiet-divider>

                <!-- Size -->
                ${renderSizeSection(
                  this.settings.size,
                  this.handleSizeChange
                )}

                <quiet-divider></quiet-divider>

                <!-- Behavior -->
                ${renderBehaviorSection(
                  {
                    selectedPersonality: this.selectedPersonality,
                    availablePersonalities:
                      this.availablePersonalities,
                    makeRoaming: this.makeRoaming,
                  },
                  {
                    onPersonalityChange: (e: CustomEvent) =>
                      (this.selectedPersonality = (e.target as any)
                        .value as PersonalityPreset),
                    onRoamingChange: (e: CustomEvent) =>
                      (this.makeRoaming = (e.target as any).checked),
                  }
                )}

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
