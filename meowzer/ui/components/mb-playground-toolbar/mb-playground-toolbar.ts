/**
 * Playground Toolbar - Vertical toolbar for cat playground controls
 *
 * Provides quick access to:
 * - Create new cat
 * - View statistics
 * - Place food (basic/fancy)
 * - Place water
 * - Control laser pointer
 * - Place yarn
 */

import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { playgroundToolbarStyles } from "./mb-playground-toolbar.style.js";
import { CursorController } from "../../controllers/cursor-controller.js";
import type { Meowzer } from "meowzer";
import { LaserPointer } from "meowzer";

@customElement("mb-playground-toolbar")
export class MbPlaygroundToolbar extends LitElement {
  static styles = [playgroundToolbarStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @property({ type: Object })
  laserPointer?: LaserPointer;

  private mouseMoveListener?: (e: MouseEvent) => void;

  /**
   * Cursor controller for managing placement cursors
   */
  private cursor = new CursorController(this);

  connectedCallback() {
    super.connectedCallback();
    // Preload cursor assets for smoother UX
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
      excludeSelector: "mb-playground-toolbar",
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
    if (!this.meowzer || !this.meowzer.isInitialized()) {
      console.warn(
        "[Toolbar] Meowzer not initialized yet, cannot start laser"
      );
      return;
    }

    // Create laser pointer instance
    this.laserPointer = new LaserPointer("playground-laser");

    // Hide default cursor
    document.body.style.cursor = "none";

    // Get initial cursor position
    const getCursorPosition = (e: MouseEvent) => ({
      x: e.clientX,
      y: e.clientY,
    });

    // Listen to mouse movement
    this.mouseMoveListener = (e: MouseEvent) => {
      const position = getCursorPosition(e);
      this.laserPointer?.moveTo(position);

      // Emit global laser moved event for cats to detect
      this._emitGlobalLaserEvent("laser:moved", { position });
    };

    document.addEventListener("mousemove", this.mouseMoveListener);

    // Activate laser at current cursor position
    const initialPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    this.laserPointer.turnOn(initialPosition);

    // Store active laser in global interactions for Brain queries
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];
      if (interactions) {
        interactions._activeLaser = this.laserPointer;
        interactions.getActiveLaser = () => interactions._activeLaser;
      }
    } catch {
      // Ignore
    }

    // Emit laser-activated event to playground
    this.dispatchEvent(
      new CustomEvent("laser-activated", {
        detail: { laserPointer: this.laserPointer },
        bubbles: true,
        composed: true,
      })
    );

    // Emit global laser activated event
    this._emitGlobalLaserEvent("laser:activated", {
      position: initialPosition,
    });

    this.requestUpdate();
  }

  private _emitGlobalLaserEvent(eventType: string, event: any) {
    try {
      const globalKey = Symbol.for("meowzer.interactions");
      const interactions = (globalThis as any)[globalKey];
      if (interactions && interactions.emit) {
        console.log(
          `[Toolbar] Emitting global event: ${eventType}`,
          event
        );
        interactions.emit(eventType, event);
      } else {
        console.warn(
          `[Toolbar] Global interactions emitter not found!`
        );
      }
    } catch (error) {
      console.error(`[Toolbar] Error emitting laser event:`, error);
    }
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
      // Emit global deactivation event before turning off
      this._emitGlobalLaserEvent("laser:deactivated", {
        position: this.laserPointer.position,
      });

      // Clear active laser from global interactions
      try {
        const globalKey = Symbol.for("meowzer.interactions");
        const interactions = (globalThis as any)[globalKey];
        if (interactions) {
          interactions._activeLaser = null;
        }
      } catch {
        // Ignore
      }

      this.laserPointer.turnOff();
      this.laserPointer = undefined;
    }

    // Remove cursor hiding
    document.body.style.cursor = "";

    this.requestUpdate();
  }

  private handleCreateCat() {
    this.dispatchEvent(
      new CustomEvent("create-cat", { bubbles: true, composed: true })
    );
  }

  private handleViewStats() {
    this.dispatchEvent(
      new CustomEvent("view-stats", { bubbles: true, composed: true })
    );
  }

  render() {
    const laserActive =
      this.laserPointer && this.laserPointer.isActive;

    return html`
      <quiet-toolbar
        orientation="vertical"
        label="Playground Controls"
      >
        <!-- Create Cat -->
        <quiet-button
          variant="primary"
          size="lg"
          @click=${this.handleCreateCat}
          title="Create New Cat"
        >
          <quiet-icon family="outline" name="plus"></quiet-icon>
        </quiet-button>

        <!-- Statistics -->
        <quiet-button
          variant="neutral"
          size="lg"
          @click=${this.handleViewStats}
          title="View Statistics"
        >
          <quiet-icon family="outline" name="chart-bar"></quiet-icon>
        </quiet-button>

        <quiet-divider></quiet-divider>

        <!-- Basic Food -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.cursor.isActive("food:basic")}
          @click=${() => this.handlePlacement("food:basic")}
          title="Place Basic Food"
        >
          🥫
        </quiet-button>

        <!-- Fancy Food -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.cursor.isActive("food:fancy")}
          @click=${() => this.handlePlacement("food:fancy")}
          title="Place Fancy Food"
        >
          🍖
        </quiet-button>

        <!-- Water -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.cursor.isActive("water")}
          @click=${() => this.handlePlacement("water")}
          title="Place Water"
        >
          💧
        </quiet-button>

        <quiet-divider></quiet-divider>

        <!-- Laser Pointer -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${laserActive}
          @click=${() =>
            laserActive
              ? this.stopLaserMode()
              : this.startLaserMode()}
          title="${laserActive
            ? "Stop Laser"
            : "Activate Laser Pointer"}"
        >
          🔴
        </quiet-button>

        <!-- Yarn -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.cursor.isActive("yarn")}
          @click=${() => this.handlePlacement("yarn")}
          title="Place Yarn Ball"
        >
          🧶
        </quiet-button>
      </quiet-toolbar>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-playground-toolbar": MbPlaygroundToolbar;
  }
}
