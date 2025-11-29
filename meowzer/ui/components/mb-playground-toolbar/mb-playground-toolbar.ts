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
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { playgroundToolbarStyles } from "./mb-playground-toolbar.style.js";
import { CursorController } from "../../controllers/cursor-controller.js";
import { INTERACTION_SVGS } from "../../shared/interaction-svgs.js";
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
      <div
        class="toolbar"
        role="toolbar"
        aria-label="Playground Controls"
      >
        <!-- Create Cat -->
        <mb-button
          variant="primary"
          size="lg"
          @click=${this.handleCreateCat}
          title="Create New Cat"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M8 1C8.28125 1 8.5 1.21875 8.5 1.5V7.5H14.5C14.7812 7.5 15 7.71875 15 8C15 8.28125 14.7812 8.5 14.5 8.5H8.5V14.5C8.5 14.7812 8.28125 15 8 15C7.71875 15 7.5 14.7812 7.5 14.5V8.5H1.5C1.21875 8.5 1 8.28125 1 8C1 7.71875 1.21875 7.5 1.5 7.5H7.5V1.5C7.5 1.21875 7.71875 1 8 1Z"
            />
          </svg>
        </mb-button>

        <!-- Statistics -->
        <mb-button
          variant="tertiary"
          size="lg"
          @click=${this.handleViewStats}
          title="View Statistics"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M8 2C8.28125 2 8.5 2.21875 8.5 2.5V13.5C8.5 13.7812 8.28125 14 8 14C7.71875 14 7.5 13.7812 7.5 13.5V2.5C7.5 2.21875 7.71875 2 8 2ZM4 6C4.28125 6 4.5 6.21875 4.5 6.5V13.5C4.5 13.7812 4.28125 14 4 14C3.71875 14 3.5 13.7812 3.5 13.5V6.5C3.5 6.21875 3.71875 6 4 6ZM12 10C12.2812 10 12.5 10.2188 12.5 10.5V13.5C12.5 13.7812 12.2812 14 12 14C11.7188 14 11.5 13.7812 11.5 13.5V10.5C11.5 10.2188 11.7188 10 12 10Z"
            />
          </svg>
        </mb-button>

        <div class="divider"></div>

        <!-- Basic Food -->
        <mb-button
          variant="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("food:basic")}
          @click=${() => this.handlePlacement("food:basic")}
          title="Place Basic Food"
        >
          <div class="icon">
            ${unsafeSVG(INTERACTION_SVGS.foodBasic)}
          </div>
        </mb-button>

        <!-- Fancy Food -->
        <mb-button
          variant="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("food:fancy")}
          @click=${() => this.handlePlacement("food:fancy")}
          title="Place Fancy Food"
        >
          <div class="icon">
            ${unsafeSVG(INTERACTION_SVGS.foodFancy)}
          </div>
        </mb-button>

        <!-- Water -->
        <mb-button
          variant="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("water")}
          @click=${() => this.handlePlacement("water")}
          title="Place Water"
        >
          <div class="icon">${unsafeSVG(INTERACTION_SVGS.water)}</div>
        </mb-button>

        <div class="divider"></div>

        <!-- Laser Pointer -->
        <mb-button
          variant="tertiary"
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
          <div class="icon">${unsafeSVG(INTERACTION_SVGS.laser)}</div>
        </mb-button>

        <!-- Yarn -->
        <mb-button
          variant="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("yarn")}
          @click=${() => this.handlePlacement("yarn")}
          title="Place Yarn Ball"
        >
          <div class="icon">${unsafeSVG(INTERACTION_SVGS.yarn)}</div>
        </mb-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-playground-toolbar": MbPlaygroundToolbar;
  }
}
