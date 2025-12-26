import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { yarnVisualStyles } from "./mb-yarn-visual.style.js";
import { INTERACTION_SVGS } from "../../shared/interaction-svgs.js";
import type { Meowzer, Yarn } from "meowzer";

/**
 * Visual representation of a yarn toy in the playground
 *
 * Renders an SVG yarn ball that responds to yarn state changes.
 * Supports interactive mode for dragging.
 */
@customElement("mb-yarn-visual")
export class MbYarnVisual extends LitElement {
  static styles = [yarnVisualStyles];

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  /** ID of the yarn instance to render */
  @property({ type: String })
  yarnId!: string;

  /** Whether the yarn can be interacted with (dragged) */
  @property({ type: Boolean })
  interactive = true;

  /** Size of the yarn ball in pixels */
  @property({ type: Number })
  size = 40;

  /** Color of the yarn ball */
  @property({ type: String })
  color = "#FF6B6B";

  @state()
  private yarn?: Yarn;

  @state()
  private yarnState: "idle" | "dragging" | "rolling" = "idle";

  connectedCallback() {
    super.connectedCallback();
    this._setupYarnListener();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupListeners();
  }

  private _setupYarnListener() {
    if (!this.meowzer || !this.yarnId) return;

    // Get yarn instance
    this.yarn = this.meowzer.interactions.getYarn(this.yarnId);

    if (!this.yarn) {
      console.warn(`Yarn with ID ${this.yarnId} not found`);
      return;
    }

    // Update position initially
    this._updatePosition();

    // Listen to yarn events
    this.yarn.on("moved", this._handleYarnMoved);
    this.yarn.on("stopped", this._handleYarnStopped);
  }

  private _cleanupListeners() {
    if (this.yarn) {
      this.yarn.off("moved", this._handleYarnMoved);
      this.yarn.off("stopped", this._handleYarnStopped);
    }
  }

  private _handleYarnMoved = () => {
    this._updatePosition();

    // Update state based on yarn velocity
    if (this.yarn) {
      const speed = Math.sqrt(
        this.yarn.velocity.x ** 2 + this.yarn.velocity.y ** 2
      );

      this.yarnState = speed > 50 ? "rolling" : "dragging";
      this.setAttribute("data-state", this.yarnState);
    }
  };

  private _handleYarnStopped = () => {
    this.yarnState = "idle";
    this.setAttribute("data-state", this.yarnState);
  };

  private _updatePosition() {
    if (!this.yarn) return;

    const { x, y } = this.yarn.position;
    this.style.transform = `translate(${x}px, ${y}px)`;
    this.style.left = `-${this.size / 2}px`;
    this.style.top = `-${this.size / 2}px`;
  }

  private _handleMouseDown = (e: MouseEvent) => {
    if (!this.interactive || !this.yarn) return;

    e.preventDefault();
    e.stopPropagation();

    // Start dragging
    this.yarn.startDragging({ x: e.clientX, y: e.clientY });
    this.yarnState = "dragging";
    this.setAttribute("data-state", this.yarnState);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!this.yarn) return;
      this.yarn.updateDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (!this.yarn) return;
      this.yarn.stopDragging();

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  render() {
    return html`
      <div class="yarn-container" @mousedown=${this._handleMouseDown}>
        <div
          class="yarn-icon"
          style="width: ${this.size}px; height: ${this.size}px;"
        >
          ${unsafeSVG(INTERACTION_SVGS.yarn)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mb-yarn-visual": MbYarnVisual;
  }
}
