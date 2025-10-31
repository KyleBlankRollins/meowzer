/**
 * CatControls - Reusable control buttons for a cat
 *
 * Provides pause/resume and destroy actions.
 *
 * @fires pause - Emitted when pause button is clicked
 * @fires resume - Emitted when resume button is clicked
 * @fires destroy - Emitted when destroy button is clicked
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MeowzerCat } from "meowzer";

type ControlSize = "small" | "medium";

@customElement("cat-controls")
export class CatControls extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
    }

    .controls.small {
      gap: 0.25rem;
    }

    quiet-button {
      flex: 1;
    }

    .controls.small quiet-button {
      font-size: 0.875rem;
    }
  `;

  @property({ type: Object }) cat!: MeowzerCat;
  @property({ type: String }) size: ControlSize = "medium";

  private _currentCat?: MeowzerCat;

  connectedCallback() {
    super.connectedCallback();
    this.setupCatListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupCatListeners();
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);

    if (changedProperties.has("cat")) {
      this.cleanupCatListeners();
      this.setupCatListeners();
    }
  }

  private setupCatListeners() {
    if (this.cat) {
      this._currentCat = this.cat;
      this.cat.on("stateChange", this.handleCatUpdate);
      this.cat.on("pause", this.handleCatUpdate);
      this.cat.on("resume", this.handleCatUpdate);
    }
  }

  private cleanupCatListeners() {
    if (this._currentCat) {
      this._currentCat.off("stateChange", this.handleCatUpdate);
      this._currentCat.off("pause", this.handleCatUpdate);
      this._currentCat.off("resume", this.handleCatUpdate);
      this._currentCat = undefined;
    }
  }

  private handleCatUpdate = () => {
    this.requestUpdate();
  };

  private handlePauseResume() {
    if (this.cat.isActive) {
      this.dispatchEvent(
        new CustomEvent("pause", {
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent("resume", {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleDestroy() {
    this.dispatchEvent(
      new CustomEvent("destroy", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const { cat, size } = this;

    return html`
      <div class="controls ${size}">
        <quiet-button
          appearance="outline"
          variant="neutral"
          @click=${this.handlePauseResume}
        >
          ${cat.isActive ? "Pause" : "Resume"}
        </quiet-button>

        <quiet-button
          appearance="outline"
          variant="destructive"
          @click=${this.handleDestroy}
        >
          Destroy
        </quiet-button>
      </div>
    `;
  }
}
