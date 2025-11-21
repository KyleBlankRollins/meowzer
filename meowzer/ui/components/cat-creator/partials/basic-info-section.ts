/**
 * BasicInfoSection - Internal partial for cat basic information
 *
 * Not exported from package - internal to cat-creator only.
 * Handles name and description input.
 *
 * @fires basic-info-change - Emitted when name or description changes
 */

import { LitElement, html } from "lit";
import { basicInfoSectionStyles } from "./basic-info-section.style.js";
import { customElement, property } from "lit/decorators.js";

export interface BasicInfo {
  name: string;
  description: string;
}

@customElement("basic-info-section")
export class BasicInfoSection extends LitElement {
  static styles = [basicInfoSectionStyles];

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
        <cds-text-input
          label="Name"
          .value=${this.name}
          @input=${this.handleNameChange}
          required
        ></cds-text-input>

        <cds-textarea
          label="Description"
          .value=${this.description}
          @input=${this.handleDescriptionChange}
          rows="3"
        ></cds-textarea>
      </div>
    `;
  }
}
