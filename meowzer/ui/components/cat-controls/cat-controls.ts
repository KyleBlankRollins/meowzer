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
          variant="outlined"
          @click=${this.handlePauseResume}
        >
          ${cat.isActive ? "Pause" : "Resume"}
        </quiet-button>

        <quiet-button
          variant="outlined"
          color="destructive"
          @click=${this.handleDestroy}
        >
          Destroy
        </quiet-button>
      </div>
    `;
  }
}
