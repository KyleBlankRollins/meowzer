/**
 * Interactions Panel - Control center for cat interactions
 *
 * Provides UI controls for:
 * - Placing needs (basic food, fancy food, water)
 * - Placing and controlling toys (yarn, laser pointer)
 * - Phase 3 preview (RC car - coming soon)
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { interactionsPanelStyles } from "./mb-interactions-panel.style.js";
import type { Meowzer, LaserPointer } from "meowzer";

type PlacementMode =
  | "food:basic"
  | "food:fancy"
  | "water"
  | "yarn"
  | null;

@customElement("mb-interactions-panel")
export class MbInteractionsPanel extends LitElement {
  static styles = [interactionsPanelStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state()
  private placementMode: PlacementMode = null;

  @state()
  private laserPointer?: LaserPointer;

  @state()
  private clickListener?: (e: MouseEvent) => void;
  private mouseMoveListener?: (e: MouseEvent) => void;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup() {
    // Remove event listeners
    if (this.clickListener) {
      document.removeEventListener("click", this.clickListener);
      this.clickListener = undefined;
    }
    if (this.mouseMoveListener) {
      document.removeEventListener(
        "mousemove",
        this.mouseMoveListener
      );
      this.mouseMoveListener = undefined;
    }

    // Clean up laser pointer
    if (this.laserPointer) {
      this.laserPointer.destroy();
      this.laserPointer = undefined;
    }

    // Reset cursor
    document.body.style.cursor = "";
  }

  private startPlacementMode(mode: PlacementMode) {
    // Cancel any existing mode
    this.cancelMode();

    this.placementMode = mode;
    document.body.style.cursor = "crosshair";

    // Setup click listener for placement
    this.clickListener = (e: MouseEvent) => {
      // Ignore clicks on the dialog/panel itself
      const target = e.target as HTMLElement;
      if (
        target.closest("mb-interactions-panel") ||
        target.closest("quiet-dialog")
      ) {
        return;
      }

      this.placeInteraction(e.clientX, e.clientY);
    };

    document.addEventListener("click", this.clickListener);
  }

  private async placeInteraction(x: number, y: number) {
    if (!this.meowzer || !this.placementMode) return;

    const position = { x, y };

    try {
      switch (this.placementMode) {
        case "food:basic":
          await this.meowzer.interactions.placeNeed(
            "food:basic",
            position
          );
          break;
        case "food:fancy":
          await this.meowzer.interactions.placeNeed(
            "food:fancy",
            position
          );
          break;
        case "water":
          await this.meowzer.interactions.placeNeed(
            "water",
            position
          );
          break;
        case "yarn":
          await this.meowzer.interactions.placeYarn(position);
          break;
      }

      // Exit placement mode after placing
      this.cancelMode();
    } catch (error) {
      console.error("Failed to place interaction:", error);
    }
  }

  private startLaserMode() {
    if (!this.meowzer) return;

    // Create laser pointer if it doesn't exist
    if (!this.laserPointer) {
      this.laserPointer = this.meowzer.createLaserPointer();
    }

    // Cancel any placement mode
    this.cancelMode();

    // Setup mouse tracking for laser
    this.mouseMoveListener = (e: MouseEvent) => {
      if (this.laserPointer) {
        if (!this.laserPointer.isActive) {
          this.laserPointer.turnOn({ x: e.clientX, y: e.clientY });
        } else {
          this.laserPointer.moveTo({ x: e.clientX, y: e.clientY });
        }
      }
    };

    document.addEventListener("mousemove", this.mouseMoveListener);
    this.requestUpdate();
  }

  private stopLaserMode() {
    if (this.mouseMoveListener) {
      document.removeEventListener(
        "mousemove",
        this.mouseMoveListener
      );
      this.mouseMoveListener = undefined;
    }

    if (this.laserPointer) {
      this.laserPointer.turnOff();
    }

    this.requestUpdate();
  }

  private cancelMode() {
    if (this.clickListener) {
      document.removeEventListener("click", this.clickListener);
      this.clickListener = undefined;
    }

    this.placementMode = null;
    document.body.style.cursor = "";
  }

  private renderNeedsSection() {
    return html`
      <div class="section">
        <h3 class="section-title">🍽️ Needs</h3>
        <div class="items-grid">
          <button
            class="interaction-button ${this.placementMode ===
            "food:basic"
              ? "active"
              : ""}"
            @click=${() => this.startPlacementMode("food:basic")}
          >
            <div class="button-icon">🥫</div>
            <div class="button-label">Basic Food</div>
          </button>

          <button
            class="interaction-button ${this.placementMode ===
            "food:fancy"
              ? "active"
              : ""}"
            @click=${() => this.startPlacementMode("food:fancy")}
          >
            <div class="button-icon">🍖</div>
            <div class="button-label">Fancy Food</div>
          </button>

          <button
            class="interaction-button ${this.placementMode === "water"
              ? "active"
              : ""}"
            @click=${() => this.startPlacementMode("water")}
          >
            <div class="button-icon">💧</div>
            <div class="button-label">Water</div>
          </button>
        </div>
      </div>
    `;
  }

  private renderToysSection() {
    const laserActive =
      this.laserPointer && this.laserPointer.isActive;
    return html`
      <div class="section">
        <h3 class="section-title">🎾 Toys</h3>
        <div class="items-grid">
          <button
            class="interaction-button ${laserActive ? "active" : ""}"
            @click=${() =>
              laserActive
                ? this.stopLaserMode()
                : this.startLaserMode()}
          >
            <div class="button-icon">🔴</div>
            <div class="button-label">
              ${laserActive ? "Stop Laser" : "Laser Pointer"}
            </div>
          </button>

          <button
            class="interaction-button ${this.placementMode === "yarn"
              ? "active"
              : ""}"
            @click=${() => this.startPlacementMode("yarn")}
          >
            <div class="button-icon">🧶</div>
            <div class="button-label">Yarn Ball</div>
          </button>
        </div>
      </div>
    `;
  }

  private renderPhase3Preview() {
    return html`
      <div class="section">
        <h3 class="section-title">🚗 Phase 3 (Coming Soon)</h3>
        <div class="items-grid">
          <button class="interaction-button disabled">
            <div class="button-icon">🏎️</div>
            <div class="button-label">RC Car</div>
            <div class="button-badge">Soon</div>
          </button>
        </div>
      </div>
    `;
  }

  private renderModeNotice() {
    if (this.placementMode) {
      const labels = {
        "food:basic": "basic food",
        "food:fancy": "fancy food",
        water: "water",
        yarn: "yarn",
      };

      return html`
        <div class="mode-notice">
          <div class="mode-notice-icon">📍</div>
          <div style="flex: 1">
            <div style="font-weight: 600; margin-bottom: 0.25rem">
              Placement Mode: ${labels[this.placementMode]}
            </div>
            <div>Click anywhere on the playground to place.</div>
          </div>
        </div>
        <div class="mode-actions">
          <quiet-button variant="neutral" @click=${this.cancelMode}>
            Cancel
          </quiet-button>
        </div>
      `;
    }

    // No active control mode
    return null;
  }

  render() {
    if (!this.meowzer) {
      return html`
        <div class="panel-content">
          <p style="color: var(--quiet-neutral-text-soft)">
            Meowzer not initialized
          </p>
        </div>
      `;
    }

    return html`
      <div class="panel-content">
        ${this.renderModeNotice()} ${this.renderNeedsSection()}
        ${this.renderToysSection()} ${this.renderPhase3Preview()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-interactions-panel": MbInteractionsPanel;
  }
}
