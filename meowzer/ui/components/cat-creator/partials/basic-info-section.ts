/**
 * BasicInfoSection - Internal partial for cat basic information
 *
 * Not exported from package - internal to cat-creator only.
 * Handles name and description input.
 *
 * @fires basic-info-change - Emitted when name or description changes
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface BasicInfo {
  name: string;
  description: string;
}

@customElement("basic-info-section")
export class BasicInfoSection extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-section {
      display: grid;
      gap: 1rem;
    }

    .form-section h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--quiet-neutral-text-loud);
      border-bottom: 1px solid var(--quiet-neutral-stroke-soft);
      padding-bottom: 0.5rem;
    }
  `;

  @property({ type: String }) name: string = "";
  @property({ type: String }) description: string = "";

  private handleNameChange(e: CustomEvent) {
    this.emitChange({ name: (e.target as any).value });
  }

  private handleDescriptionChange(e: CustomEvent) {
    this.emitChange({ description: (e.target as any).value });
  }

  private emitChange(changes: Partial<BasicInfo>) {
    this.dispatchEvent(
      new CustomEvent("basic-info-change", {
        detail: {
          name: this.name,
          description: this.description,
          ...changes,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="form-section">
        <h4>Basic Info</h4>
        <quiet-text-field
          label="Name"
          .value=${this.name}
          @quiet-input=${this.handleNameChange}
          required
        ></quiet-text-field>

        <quiet-text-area
          label="Description"
          .value=${this.description}
          @quiet-input=${this.handleDescriptionChange}
          rows="3"
        ></quiet-text-area>
      </div>
    `;
  }
}
