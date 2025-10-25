import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { mbMeowzerDemoStyles } from "./mb-meowzer-demo.styles.js";

// Import Meowzer
import {
  createCat,
  createRandomCat,
  getAllCats,
  destroyAllCats,
  pauseAllCats,
  resumeAllCats,
  getPersonalityPresets,
  setDefaultBoundaries,
  injectBaseStyles,
} from "meowzer";
import type { CatSettings, PersonalityPreset } from "meowzer";

/**
 * Interactive Meowzer demo component
 * Shows autonomous cats moving around on screen
 */
@customElement("mb-meowzer-demo")
export class MeowzerDemo extends LitElement {
  static styles = mbMeowzerDemoStyles;

  @state()
  private catCount = 0;

  @state()
  private isPaused = false;

  @state()
  private selectedPersonality: PersonalityPreset = "balanced";

  @state()
  private availablePersonalities: PersonalityPreset[] = [];

  private resizeObserver?: ResizeObserver;
  private componentCatIds: Set<string> = new Set(); // Track cats created by this component

  connectedCallback() {
    super.connectedCallback();

    // Inject base styles globally
    injectBaseStyles();

    // Set boundaries to the viewport (automatically accounts for cat size)
    this.updateBoundaries();

    // Update boundaries on window resize to prevent scrolling
    this.resizeObserver = new ResizeObserver(() => {
      this.updateBoundaries();
    });
    this.resizeObserver.observe(document.body);

    this.availablePersonalities = getPersonalityPresets();
    this.updateCatCount();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Clean up only the cats created by this component
    const allCats = getAllCats();
    allCats.forEach((cat) => {
      if (this.componentCatIds.has(cat.id)) {
        cat.destroy();
      }
    });
  }

  private updateBoundaries() {
    setDefaultBoundaries({
      minX: 0,
      minY: 0,
      maxX: window.innerWidth,
      maxY: window.innerHeight,
    });
  }

  private updateCatCount() {
    this.catCount = getAllCats().length;
  }

  private handleAddRandomCat() {
    const cat = createRandomCat({
      container: document.body,
      personality: this.selectedPersonality,
      autoStart: !this.isPaused,
    });

    this.componentCatIds.add(cat.id);
    this.updateCatCount();
  }

  private handleAddCustomCat() {
    const settings: CatSettings = {
      color: "#FF9500",
      eyeColor: "#00FF00",
      pattern: "tabby",
      size: "medium",
      furLength: "short",
    };

    const cat = createCat(settings, {
      container: document.body,
      personality: this.selectedPersonality,
      autoStart: !this.isPaused,
    });

    this.componentCatIds.add(cat.id);
    this.updateCatCount();
  }

  private handlePauseAll() {
    pauseAllCats();
    this.isPaused = true;
  }

  private handleResumeAll() {
    resumeAllCats();
    this.isPaused = false;
  }

  private handleDestroyAll() {
    destroyAllCats();
    this.updateCatCount();
  }

  private handlePersonalityChange(e: CustomEvent) {
    this.selectedPersonality = (e.target as any)
      .value as PersonalityPreset;
  }

  render() {
    return html`
      <div class="demo-container">
        <quiet-card>
          <h3 slot="header">Meowzer Playground</h3>

          <div class="controls">
            <quiet-button
              variant="primary"
              @click=${this.handleAddRandomCat}
            >
              Add Random Cat
            </quiet-button>

            <quiet-button
              variant="neutral"
              @click=${this.handleAddCustomCat}
            >
              Add Orange Tabby
            </quiet-button>

            ${this.isPaused
              ? html`
                  <quiet-button
                    variant="neutral"
                    @click=${this.handleResumeAll}
                  >
                    Resume All
                  </quiet-button>
                `
              : html`
                  <quiet-button
                    variant="neutral"
                    @click=${this.handlePauseAll}
                  >
                    Pause All
                  </quiet-button>
                `}

            <quiet-button
              variant="destructive"
              @click=${this.handleDestroyAll}
            >
              Clear All
            </quiet-button>

            <quiet-select
              label="Personality"
              .value=${this.selectedPersonality}
              @quiet-change=${this.handlePersonalityChange}
            >
              ${this.availablePersonalities.map(
                (p) => html`
                  <option value=${p}>
                    ${p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                `
              )}
            </quiet-select>
          </div>

          <div class="stats">
            <quiet-card class="stat-card">
              <strong>Active Cats:</strong> ${this.catCount}
            </quiet-card>
            <quiet-card class="stat-card">
              <strong>Status:</strong>
              ${this.isPaused ? "Paused" : "Running"}
            </quiet-card>
            <quiet-card class="stat-card">
              <strong>Selected Personality:</strong>
              ${this.selectedPersonality}
            </quiet-card>
          </div>
        </quiet-card>

        <meowtion-provider class="playground">
          ${this.catCount === 0
            ? html`
                <quiet-empty-state>
                  <quiet-icon
                    class="empty-icon"
                    slot="illustration"
                    name="mood-empty"
                  ></quiet-icon>
                  <h4>No cats yet</h4>
                  <p>Click "Add Random Cat" to get started!</p>
                </quiet-empty-state>
              `
            : ""}
        </meowtion-provider>

        <quiet-callout variant="constructive">
          <strong>Try it out:</strong> Add cats with different
          personalities and watch them move autonomously! Each cat has
          its own behavior based on its personality traits. Lazy cats
          rest more, playful cats are energetic, and curious cats
          explore.
        </quiet-callout>
      </div>
    `;
  }
}
