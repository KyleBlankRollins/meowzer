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
import { CursorController } from "../../controllers/cursor-controller.js";
import type { Meowzer, LaserPointer } from "meowzer";

@customElement("mb-interactions-panel")
export class MbInteractionsPanel extends LitElement {
  static styles = [interactionsPanelStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state()
  private laserPointer?: LaserPointer;

  private mouseMoveListener?: (e: MouseEvent) => void;

  /**
   * Cursor controller for managing placement cursors
   */
  private cursor = new CursorController(this);

  connectedCallback() {
    super.connectedCallback();
    // Preload cursor assets
    this.cursor.preloadAssets();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private cleanup() {
    // Cursor controller handles its own cleanup
    // Just clean up laser-specific listeners
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
  }

  private async handlePlacement(
    mode: "food:basic" | "food:fancy" | "water" | "yarn"
  ) {
    if (!this.meowzer) return;

    await this.cursor.activate({
      mode,
      excludeSelector: "mb-interactions-panel, quiet-dialog",
      onPlace: async (position) => {
        switch (mode) {
          case "food:basic":
          case "food:fancy":
          case "water":
            await this.meowzer!.interactions.placeNeed(
              mode,
              position
            );
            break;
          case "yarn":
            await this.meowzer!.interactions.placeYarn(position);
            break;
        }
      },
    });
  }

  private startLaserMode() {
    if (!this.meowzer) return;

    // Create laser pointer if it doesn't exist
    if (!this.laserPointer) {
      this.laserPointer = this.meowzer.createLaserPointer();
    }

    // Cancel any placement mode
    this.cursor.cancel();

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

  private renderNeedsSection() {
    return html`
      <div class="section">
        <h3 class="section-title">🍽️ Needs</h3>
        <div class="items-grid">
          <button
            class="interaction-button ${this.cursor.isActive(
              "food:basic"
            )
              ? "active"
              : ""}"
            @click=${() => this.handlePlacement("food:basic")}
          >
            <div class="button-icon">🥫</div>
            <div class="button-label">Basic Food</div>
          </button>

          <button
            class="interaction-button ${this.cursor.isActive(
              "food:fancy"
            )
              ? "active"
              : ""}"
            @click=${() => this.handlePlacement("food:fancy")}
          >
            <div class="button-icon">🍖</div>
            <div class="button-label">Fancy Food</div>
          </button>

          <button
            class="interaction-button ${this.cursor.isActive("water")
              ? "active"
              : ""}"
            @click=${() => this.handlePlacement("water")}
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
            class="interaction-button ${this.cursor.isActive("yarn")
              ? "active"
              : ""}"
            @click=${() => this.handlePlacement("yarn")}
          >
            <div class="button-icon">🧶</div>
            <div class="button-label">Yarn Ball</div>
          </button>
        </div>
      </div>
    `;
  }

  private renderModeNotice() {
    const currentMode = this.cursor.getMode();
    if (currentMode && currentMode !== "laser") {
      const labels: Record<string, string> = {
        "food:basic": "basic food",
        "food:fancy": "fancy food",
        water: "water",
        yarn: "yarn",
      };

      return html`
        <div class="mode-notice">
          <div class="mode-notice-icon">📍</div>
          <div class="mode-notice-content">
            <div class="mode-notice-title">
              Placement Mode: ${labels[currentMode]}
            </div>
            <div>Click anywhere on the playground to place.</div>
          </div>
        </div>
        <div class="mode-actions">
          <quiet-button
            variant="neutral"
            @click=${() => this.cursor.cancel()}
          >
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
          <p class="uninitialized-message">Meowzer not initialized</p>
        </div>
      `;
    }

    return html`
      <div class="panel-content">
        ${this.renderModeNotice()} ${this.renderNeedsSection()}
        ${this.renderToysSection()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-interactions-panel": MbInteractionsPanel;
  }
}
