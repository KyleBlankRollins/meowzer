import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { needVisualStyles } from "./mb-need-visual.style.js";
import { INTERACTION_SVGS } from "../../shared/interaction-svgs.js";
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

  private getNeedSvg(): string {
    // Placed items always use the active (bowl) version
    // The default (bag/can/droplet) versions are for toolbar/cursor only
    switch (this.type) {
      case "food:basic":
        return INTERACTION_SVGS.foodBasicActive;
      case "food:fancy":
        return INTERACTION_SVGS.foodFancyActive;
      case "water":
        return INTERACTION_SVGS.waterActive;
      default:
        return "";
    }
  }

  render() {
    const svgContent = this.getNeedSvg();

    return html`
      <div class="need-container" data-type="${this.type}">
        <div
          class="need-icon"
          style="width: ${this.size}px; height: ${this.size}px;"
        >
          ${unsafeSVG(svgContent)}
        </div>

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
