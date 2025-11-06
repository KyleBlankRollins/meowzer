import { LitElement, html, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { needVisualStyles } from "./mb-need-visual.style.js";
import type { Meowzer, Need } from "meowzer";

/**
 * Visual representation of a need (food/water) in the playground
 *
 * Renders SVG icons that respond to need state changes.
 * Shows different visuals based on type and active state.
 */
@customElement("mb-need-visual")
export class MbNeedVisual extends LitElement {
  static styles = [needVisualStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  /** ID of the need instance to render */
  @property({ type: String })
  needId!: string;

  /** Type of need (food:basic, food:fancy, water) */
  @property({ type: String })
  type!: "food:basic" | "food:fancy" | "water";

  /** Whether the need can be interacted with */
  @property({ type: Boolean })
  interactive = false;

  /** Size of the icon in pixels */
  @property({ type: Number })
  size = 60;

  @state()
  private need?: Need;

  @state()
  private isActive = false;

  @state()
  private consumingCats: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this._setupNeedListener();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupListeners();
  }

  private _setupNeedListener() {
    if (!this.meowzer || !this.needId) return;

    // Get need instance
    this.need = this.meowzer.interactions.getNeed(this.needId);

    if (!this.need) {
      console.warn(`Need with ID ${this.needId} not found`);
      return;
    }

    // Update position and state
    this._updatePosition();
    this._updateState();

    // Listen to need events
    this.need.on("consumed", this._handleNeedConsumed);
    this.need.on("removed", this._handleNeedRemoved);
  }

  private _cleanupListeners() {
    if (this.need) {
      this.need.off("consumed", this._handleNeedConsumed);
      this.need.off("removed", this._handleNeedRemoved);
    }
  }

  private _handleNeedConsumed = () => {
    this._updateState();
  };

  private _handleNeedRemoved = () => {
    // Remove this element when need is removed
    this.remove();
  };

  private _updatePosition() {
    if (!this.need) return;

    const { x, y } = this.need.position;
    this.style.transform = `translate(${x}px, ${y}px)`;
    this.style.left = `-${this.size / 2}px`;
    this.style.top = `-${this.size / 2}px`;
  }

  private _updateState() {
    if (!this.need) return;

    this.consumingCats = this.need.getConsumingCats();
    this.isActive = this.consumingCats.length > 0;
    this.setAttribute(
      "data-active",
      this.isActive ? "true" : "false"
    );
  }

  private renderBasicFoodIcon() {
    const fill = this.isActive ? "#FF6B6B" : "#8B4513";
    const strokeColor = this.isActive ? "#FF4444" : "#654321";

    return svg`
      <!-- Can/bowl base -->
      <ellipse cx="50" cy="80" rx="35" ry="12" fill="${strokeColor}" opacity="0.3"/>
      
      <!-- Can body -->
      <rect x="20" y="30" width="60" height="50" rx="5" fill="${fill}" stroke="${strokeColor}" stroke-width="2"/>
      
      <!-- Can top rim -->
      <ellipse cx="50" cy="30" rx="30" ry="8" fill="${fill}" stroke="${strokeColor}" stroke-width="2"/>
      <ellipse cx="50" cy="30" rx="25" ry="6" fill="${
        this.isActive ? "#FFAAAA" : "#A0522D"
      }" opacity="0.8"/>
      
      <!-- Label area -->
      <rect x="25" y="45" width="50" height="20" rx="3" fill="white" opacity="0.6"/>
      <text x="50" y="58" text-anchor="middle" font-size="12" fill="${strokeColor}" font-weight="bold">FOOD</text>
      
      <!-- Shine effect -->
      <ellipse cx="35" cy="40" rx="8" ry="15" fill="white" opacity="0.3"/>
    `;
  }

  private renderFancyFoodIcon() {
    const fill = this.isActive ? "#FF69B4" : "#8B4513";
    const meatColor = this.isActive ? "#FF4444" : "#A0522D";
    const boneColor = this.isActive ? "#FFFFFF" : "#F5DEB3";

    return svg`
      <!-- Shadow -->
      <ellipse cx="52" cy="85" rx="30" ry="8" fill="black" opacity="0.2"/>
      
      <!-- Plate -->
      <ellipse cx="50" cy="75" rx="40" ry="15" fill="${fill}" stroke="#654321" stroke-width="2"/>
      <ellipse cx="50" cy="73" rx="35" ry="12" fill="${
        this.isActive ? "#FFB6C1" : "#A0522D"
      }" opacity="0.6"/>
      
      <!-- Meat/steak -->
      <ellipse cx="45" cy="55" rx="20" ry="15" fill="${meatColor}" stroke="#8B0000" stroke-width="2"/>
      <ellipse cx="48" cy="52" rx="8" ry="6" fill="white" opacity="0.3"/>
      
      <!-- Bone decoration -->
      <g transform="rotate(-15 60 55)">
        <rect x="55" y="50" width="15" height="4" rx="2" fill="${boneColor}" stroke="#D2B48C" stroke-width="1"/>
        <circle cx="55" cy="52" r="3" fill="${boneColor}" stroke="#D2B48C" stroke-width="1"/>
        <circle cx="70" cy="52" r="3" fill="${boneColor}" stroke="#D2B48C" stroke-width="1"/>
      </g>
      
      <!-- Steam effect when active -->
      ${
        this.isActive
          ? svg`
        <path d="M 35 30 Q 32 20, 35 15" stroke="#CCCCCC" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M 45 25 Q 42 15, 45 10" stroke="#CCCCCC" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M 55 30 Q 52 20, 55 15" stroke="#CCCCCC" stroke-width="2" fill="none" opacity="0.5"/>
      `
          : ""
      }
    `;
  }

  private renderWaterIcon() {
    const waterColor = this.isActive ? "#4DB8FF" : "#6495ED";
    const bowlColor = this.isActive ? "#87CEEB" : "#4682B4";

    return svg`
      <!-- Shadow -->
      <ellipse cx="52" cy="85" rx="32" ry="8" fill="black" opacity="0.2"/>
      
      <!-- Bowl base -->
      <path 
        d="M 15 65 Q 15 80, 25 85 L 75 85 Q 85 80, 85 65 Z" 
        fill="${bowlColor}" 
        stroke="#4169E1" 
        stroke-width="2"
      />
      
      <!-- Bowl rim -->
      <ellipse cx="50" cy="65" rx="35" ry="10" fill="${bowlColor}" stroke="#4169E1" stroke-width="2"/>
      
      <!-- Water surface -->
      <ellipse cx="50" cy="65" rx="32" ry="8" fill="${waterColor}" opacity="0.8"/>
      
      <!-- Water waves -->
      <path 
        d="M 20 65 Q 30 62, 40 65 Q 50 68, 60 65 Q 70 62, 80 65" 
        stroke="white" 
        stroke-width="1.5" 
        fill="none" 
        opacity="0.6"
      />
      
      <!-- Highlights -->
      <ellipse cx="38" cy="63" rx="10" ry="4" fill="white" opacity="0.5"/>
      <ellipse cx="62" cy="67" rx="6" ry="3" fill="white" opacity="0.4"/>
      
      <!-- Ripples when active -->
      ${
        this.isActive
          ? svg`
        <ellipse cx="50" cy="65" rx="25" ry="6" fill="none" stroke="white" stroke-width="1" opacity="0.3"/>
        <ellipse cx="50" cy="65" rx="20" ry="5" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>
      `
          : ""
      }
    `;
  }

  private renderNeedIcon() {
    switch (this.type) {
      case "food:basic":
        return this.renderBasicFoodIcon();
      case "food:fancy":
        return this.renderFancyFoodIcon();
      case "water":
        return this.renderWaterIcon();
      default:
        return svg``;
    }
  }

  render() {
    return html`
      <div class="need-container" data-type="${this.type}">
        <svg
          width="${this.size}"
          height="${this.size}"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          ${this.renderNeedIcon()}
        </svg>

        ${this.consumingCats.length > 0
          ? html`
              <div class="consuming-indicator">
                ${this.consumingCats.length}
                cat${this.consumingCats.length > 1 ? "s" : ""}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-need-visual": MbNeedVisual;
  }
}
