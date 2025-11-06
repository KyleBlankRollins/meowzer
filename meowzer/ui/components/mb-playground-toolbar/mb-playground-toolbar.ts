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
import type { Meowzer } from "meowzer";
import { LaserPointer } from "meowzer";

type PlacementMode =
  | "food:basic"
  | "food:fancy"
  | "water"
  | "yarn"
  | null;

@customElement("mb-playground-toolbar")
export class MbPlaygroundToolbar extends LitElement {
  static styles = [playgroundToolbarStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state()
  private placementMode: PlacementMode = null;

  @property({ type: Object })
  laserPointer?: LaserPointer;

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

  private getYarnCursorDataURL(): string {
    // Create a simplified yarn SVG for cursor (32x32 for better cursor size)
    const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="yarnGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" /><stop offset="50%" style="stop-color:#FF1493;stop-opacity:1" /><stop offset="100%" style="stop-color:#C71585;stop-opacity:1" /></linearGradient></defs><circle cx="16" cy="16" r="9" fill="url(#yarnGrad)"/><path d="M 10 13 Q 13 12 16 13 Q 19 14 22 13" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.8"/><path d="M 9 16 Q 12 15 16 16 Q 20 17 23 16" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.8"/><path d="M 10 19 Q 13 18 16 19 Q 19 20 22 19" fill="none" stroke="#FF1493" stroke-width="1" opacity="0.8"/><circle cx="16" cy="16" r="7" fill="none" stroke="#FF69B4" stroke-width="0.8" opacity="0.5"/><circle cx="13" cy="13" r="2" fill="#FFFFFF" opacity="0.3"/></svg>`;

    // Encode SVG to data URL (use base64 for better browser compatibility)
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  }

  private startPlacementMode(mode: PlacementMode) {
    // Cancel any existing mode
    this.cancelMode();

    this.placementMode = mode;

    // Set cursor based on placement mode
    if (mode === "yarn") {
      // Use yarn SVG as cursor
      const yarnCursor = this.getYarnCursorDataURL();
      const cursorStyle = `url('${yarnCursor}') 16 16, pointer`;
      document.body.style.cursor = cursorStyle;
      console.log(
        "[Toolbar] Set yarn cursor:",
        cursorStyle.substring(0, 100) + "..."
      );
    } else {
      document.body.style.cursor = "crosshair";
    }

    // Setup click listener for placement (on next tick to avoid capturing the button click)
    this.clickListener = async (e: MouseEvent) => {
      // Ignore clicks on the toolbar itself
      const target = e.target as HTMLElement;
      if (target.closest("mb-playground-toolbar")) {
        return;
      }

      await this.placeInteraction(e.clientX, e.clientY);
    };

    // Add listener on next tick to avoid capturing the button click
    setTimeout(() => {
      document.addEventListener("click", this.clickListener!);
    }, 0);
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
  private cancelMode() {
    if (this.clickListener) {
      document.removeEventListener("click", this.clickListener);
      this.clickListener = undefined;
    }

    this.placementMode = null;
    document.body.style.cursor = "";
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
          ?data-active=${this.placementMode === "food:basic"}
          @click=${() => this.startPlacementMode("food:basic")}
          title="Place Basic Food"
        >
          🥫
        </quiet-button>

        <!-- Fancy Food -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.placementMode === "food:fancy"}
          @click=${() => this.startPlacementMode("food:fancy")}
          title="Place Fancy Food"
        >
          🍖
        </quiet-button>

        <!-- Water -->
        <quiet-button
          variant="neutral"
          size="lg"
          ?data-active=${this.placementMode === "water"}
          @click=${() => this.startPlacementMode("water")}
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
          ?data-active=${this.placementMode === "yarn"}
          @click=${() => this.startPlacementMode("yarn")}
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
