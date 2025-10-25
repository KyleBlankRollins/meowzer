/**
 * Cat card templates
 */

import { html, type TemplateResult } from "lit";
import type { Cat } from "meowzer";

export interface CatCardHandlers {
  onLoad: (cat: Cat) => void;
  onPause: (cat: Cat) => void;
  onResume: (cat: Cat) => void;
  onDelete: (cat: Cat) => void;
}

/**
 * Render a single cat card
 */
export function renderCatCard(
  cat: Cat,
  preview: string,
  isLoaded: boolean,
  isPaused: boolean,
  handlers: CatCardHandlers
): TemplateResult {
  return html`
    <quiet-card orientation="horizontal">
      <div
        slot="media"
        class="cat-preview"
        .innerHTML=${preview}
      ></div>

      <div class="cat-details">
        <div class="cat-name">${cat.name}</div>
        <div class="cat-meta">
          ${isLoaded
            ? html`<span class="status-badge active">Active</span>`
            : html`<span class="status-badge">Saved</span>`}
        </div>
      </div>

      <div slot="footer" class="cat-actions">
        ${isLoaded
          ? html`
              ${isPaused
                ? html`
                    <button
                      class="action-btn"
                      @click=${() => handlers.onResume(cat)}
                      title="Resume"
                    >
                      ▶️
                    </button>
                  `
                : html`
                    <button
                      class="action-btn"
                      @click=${() => handlers.onPause(cat)}
                      title="Pause"
                    >
                      ⏸️
                    </button>
                  `}
            `
          : html`
              <button
                class="action-btn"
                @click=${() => handlers.onLoad(cat)}
                title="Load Cat"
              >
                📥
              </button>
            `}
        <button
          class="action-btn danger"
          @click=${() => handlers.onDelete(cat)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </quiet-card>
  `;
}
