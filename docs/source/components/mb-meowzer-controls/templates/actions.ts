/**
 * Control button templates
 */

import { html, type TemplateResult } from "lit";

export interface ControlButtonHandlers {
  onCreateCat: () => void;
  onOpenCreator: () => void;
  onDestroyAll: () => void;
}

/**
 * Render control buttons grid
 */
export function renderControlButtons(
  catCount: number,
  handlers: ControlButtonHandlers
): TemplateResult {
  return html`
    <div class="controls-grid">
      <button class="control-button" @click=${handlers.onCreateCat}>
        <span class="button-icon">➕</span>
        <span>Random Cat</span>
      </button>

      <button class="control-button" @click=${handlers.onOpenCreator}>
        <span class="button-icon">🎨</span>
        <span>Cat Creator</span>
      </button>

      <button
        class="control-button danger"
        @click=${handlers.onDestroyAll}
        ?disabled=${catCount === 0}
      >
        <span class="button-icon">🗑️</span>
        <span>Remove All</span>
      </button>
    </div>
  `;
}
