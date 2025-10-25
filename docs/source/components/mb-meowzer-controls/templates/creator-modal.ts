/**
 * Creator modal template
 */

import { html, type TemplateResult } from "lit";

export interface CreatorModalHandlers {
  onClose: () => void;
  onCatCreated: () => void;
}

/**
 * Render the cat creator modal
 */
export function renderCreatorModal(
  showCreator: boolean,
  handlers: CreatorModalHandlers
): TemplateResult {
  if (!showCreator) {
    return html``;
  }

  return html`
    <div class="creator-modal" @click=${handlers.onClose}>
      <div
        class="creator-content"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="creator-header">
          <h2>Create a Cat</h2>
          <button
            class="close-button"
            @click=${handlers.onClose}
            aria-label="Close cat creator"
          >
            ✕
          </button>
        </div>
        <mb-cat-creator
          @cat-created=${handlers.onCatCreated}
        ></mb-cat-creator>
      </div>
    </div>
  `;
}
