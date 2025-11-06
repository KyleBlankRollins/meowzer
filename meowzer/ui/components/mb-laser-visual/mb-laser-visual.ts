import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { laserVisualStyles } from "./mb-laser-visual.style.js";
import type { LaserPointer } from "meowzer";

/**
 * Visual representation of a laser pointer dot
 *
 * Renders a red dot with glow effect that follows the LaserPointer position.
 * Automatically shows/hides based on laser active state.
 */
@customElement("mb-laser-visual")
export class MbLaserVisual extends LitElement {
  static styles = [laserVisualStyles];

  /** LaserPointer instance to track */
  @property({ type: Object })
  laser?: LaserPointer;

  @state()
  private position = { x: 0, y: 0 };

  connectedCallback() {
    super.connectedCallback();
    this._setupListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupListeners();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("laser")) {
      this._cleanupListeners();
      this._setupListeners();
    }
  }

  private _setupListeners() {
    if (!this.laser) return;

    // Listen to laser events
    this.laser.on("activated", this._handleActivated);
    this.laser.on("moved", this._handleMoved);
    this.laser.on("deactivated", this._handleDeactivated);

    // Initialize state if laser is already active
    if (this.laser.isActive) {
      this.position = this.laser.position;
      this.setAttribute("active", "");
      this._updatePosition();
    }
  }

  private _cleanupListeners() {
    if (this.laser) {
      this.laser.off("activated", this._handleActivated);
      this.laser.off("moved", this._handleMoved);
      this.laser.off("deactivated", this._handleDeactivated);
    }
  }

  private _handleActivated = (event: any) => {
    this.position = event.position;
    this.setAttribute("active", "");
    this._updatePosition();
  };

  private _handleMoved = (event: any) => {
    this.position = event.position;
    this._updatePosition();
  };

  private _handleDeactivated = () => {
    this.removeAttribute("active");
  };

  private _updatePosition() {
    // Center the 64x64 laser SVG on the cursor position
    this.style.transform = `translate(${this.position.x - 32}px, ${
      this.position.y - 32
    }px)`;
  }

  render() {
    return html`
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Laser dot with glow effect -->
        <defs>
          <radialGradient
            id="laserGlow-${this.position.x}-${this.position.y}"
          >
            <stop
              offset="0%"
              style="stop-color:#FF0000;stop-opacity:1"
            />
            <stop
              offset="30%"
              style="stop-color:#FF0000;stop-opacity:0.9"
            />
            <stop
              offset="60%"
              style="stop-color:#FF4444;stop-opacity:0.4"
            />
            <stop
              offset="100%"
              style="stop-color:#FF0000;stop-opacity:0"
            />
          </radialGradient>
        </defs>

        <!-- Outer glow -->
        <circle
          cx="32"
          cy="32"
          r="12"
          fill="url(#laserGlow-${this.position.x}-${this.position.y})"
        />

        <!-- Middle glow -->
        <circle cx="32" cy="32" r="6" fill="#FF0000" opacity="0.6" />

        <!-- Bright center dot -->
        <circle cx="32" cy="32" r="3" fill="#FF0000" />
        <circle cx="32" cy="32" r="2" fill="#FF4444" />

        <!-- Bright highlight -->
        <circle cx="31" cy="31" r="1" fill="#FFFFFF" opacity="0.8" />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-laser-visual": MbLaserVisual;
  }
}
