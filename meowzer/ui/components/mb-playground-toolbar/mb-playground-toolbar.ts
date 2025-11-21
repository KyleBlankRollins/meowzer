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

import { LitElement, html, svg } from "lit";
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

  // SVG icon helpers matching mb-need-visual and other visual components
  private renderBasicFoodIcon() {
    return svg`
      <ellipse cx="50" cy="80" rx="35" ry="12" fill="#654321" opacity="0.3"/>
      <rect x="20" y="30" width="60" height="50" rx="5" fill="#8B4513" stroke="#654321" stroke-width="2"/>
      <ellipse cx="50" cy="30" rx="30" ry="8" fill="#8B4513" stroke="#654321" stroke-width="2"/>
      <ellipse cx="50" cy="30" rx="25" ry="6" fill="#A0522D" opacity="0.8"/>
      <rect x="25" y="45" width="50" height="20" rx="3" fill="white" opacity="0.6"/>
      <text x="50" y="58" text-anchor="middle" font-size="12" fill="#654321" font-weight="bold">FOOD</text>
      <ellipse cx="35" cy="40" rx="8" ry="15" fill="white" opacity="0.3"/>
    `;
  }

  private renderFancyFoodIcon() {
    return svg`
      <ellipse cx="52" cy="85" rx="30" ry="8" fill="black" opacity="0.2"/>
      <ellipse cx="50" cy="75" rx="40" ry="15" fill="#8B4513" stroke="#654321" stroke-width="2"/>
      <ellipse cx="50" cy="73" rx="35" ry="12" fill="#A0522D" opacity="0.6"/>
      <ellipse cx="45" cy="55" rx="20" ry="15" fill="#A0522D" stroke="#8B0000" stroke-width="2"/>
      <ellipse cx="48" cy="52" rx="8" ry="6" fill="white" opacity="0.3"/>
      <g transform="rotate(-15 60 55)">
        <rect x="55" y="50" width="15" height="4" rx="2" fill="#F5DEB3" stroke="#D2B48C" stroke-width="1"/>
        <circle cx="55" cy="52" r="3" fill="#F5DEB3" stroke="#D2B48C" stroke-width="1"/>
        <circle cx="70" cy="52" r="3" fill="#F5DEB3" stroke="#D2B48C" stroke-width="1"/>
      </g>
    `;
  }

  private renderWaterIcon() {
    return svg`
      <ellipse cx="52" cy="85" rx="32" ry="8" fill="black" opacity="0.2"/>
      <path d="M 15 65 Q 15 80, 25 85 L 75 85 Q 85 80, 85 65 Z" fill="#4682B4" stroke="#4169E1" stroke-width="2"/>
      <ellipse cx="50" cy="65" rx="35" ry="10" fill="#4682B4" stroke="#4169E1" stroke-width="2"/>
      <ellipse cx="50" cy="65" rx="32" ry="8" fill="#6495ED" opacity="0.8"/>
      <path d="M 20 65 Q 30 62, 40 65 Q 50 68, 60 65 Q 70 62, 80 65" stroke="white" stroke-width="1.5" fill="none" opacity="0.6"/>
      <ellipse cx="38" cy="63" rx="10" ry="4" fill="white" opacity="0.5"/>
      <ellipse cx="62" cy="67" rx="6" ry="3" fill="white" opacity="0.4"/>
    `;
  }

  private renderLaserIcon() {
    return svg`
      <defs>
        <radialGradient id="laserGlow">
          <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1"/>
          <stop offset="30%" style="stop-color:#FF0000;stop-opacity:0.9"/>
          <stop offset="60%" style="stop-color:#FF4444;stop-opacity:0.4"/>
          <stop offset="100%" style="stop-color:#FF0000;stop-opacity:0"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="12" fill="url(#laserGlow)"/>
      <circle cx="32" cy="32" r="6" fill="#FF0000" opacity="0.6"/>
      <circle cx="32" cy="32" r="3" fill="#FF0000"/>
      <circle cx="32" cy="32" r="2" fill="#FF4444"/>
      <circle cx="31" cy="31" r="1" fill="#FFFFFF" opacity="0.8"/>
    `;
  }

  private renderYarnIcon() {
    return svg`
      <circle cx="50" cy="50" r="45" fill="#FF6B6B"/>
      <path d="M 30 20 Q 50 30, 70 25" stroke="#FF6B6B" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 25 35 Q 50 45, 75 40" stroke="#FF6B6B" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 20 50 Q 50 60, 80 55" stroke="#FF6B6B" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 25 65 Q 50 75, 75 70" stroke="#FF6B6B" stroke-width="3" fill="none" opacity="0.6"/>
      <ellipse cx="40" cy="35" rx="15" ry="12" fill="white" opacity="0.3"/>
      <ellipse cx="55" cy="65" rx="20" ry="15" fill="black" opacity="0.1"/>
    `;
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
        <cds-button
          kind="primary"
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
        </cds-button>

        <!-- Statistics -->
        <cds-button
          kind="tertiary"
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
        </cds-button>

        <div class="divider"></div>

        <!-- Basic Food -->
        <cds-button
          kind="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("food:basic")}
          @click=${() => this.handlePlacement("food:basic")}
          title="Place Basic Food"
        >
          ${html`<svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderBasicFoodIcon()}
          </svg>`}
        </cds-button>

        <!-- Fancy Food -->
        <cds-button
          kind="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("food:fancy")}
          @click=${() => this.handlePlacement("food:fancy")}
          title="Place Fancy Food"
        >
          ${html`<svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderFancyFoodIcon()}
          </svg>`}
        </cds-button>

        <!-- Water -->
        <cds-button
          kind="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("water")}
          @click=${() => this.handlePlacement("water")}
          title="Place Water"
        >
          ${html`<svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderWaterIcon()}
          </svg>`}
        </cds-button>

        <div class="divider"></div>

        <!-- Laser Pointer -->
        <cds-button
          kind="tertiary"
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
          ${html`<svg
            width="24"
            height="24"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderLaserIcon()}
          </svg>`}
        </cds-button>

        <!-- Yarn -->
        <cds-button
          kind="tertiary"
          size="lg"
          ?data-active=${this.cursor.isActive("yarn")}
          @click=${() => this.handlePlacement("yarn")}
          title="Place Yarn Ball"
        >
          ${html`<svg
            width="24"
            height="24"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            ${this.renderYarnIcon()}
          </svg>`}
        </cds-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-playground-toolbar": MbPlaygroundToolbar;
  }
}
