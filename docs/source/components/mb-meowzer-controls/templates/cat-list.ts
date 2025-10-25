/**
 * Cat list templates
 */

import { html, type TemplateResult } from "lit";
import type { Cat } from "meowzer";
import { renderCatCard, type CatCardHandlers } from "./cat-card.js";

export interface CatListData {
  savedCats: Cat[];
  loadingSavedCats: boolean;
}

/**
 * Render the saved cats list
 */
export function renderCatList(
  data: CatListData,
  getCatStatus: (cat: Cat) => {
    isLoaded: boolean;
    isPaused: boolean;
  },
  generatePreview: (cat: Cat) => string,
  handlers: CatCardHandlers
): TemplateResult {
  if (data.loadingSavedCats) {
    return html`<div class="loading">Loading...</div>`;
  }

  if (data.savedCats.length === 0) {
    return html`<div class="empty-state">No saved cats yet</div>`;
  }

  return html`
    <quiet-search-list match="fuzzy" id="search-list__overview">
      <quiet-text-field
        slot="controller"
        label="Search"
        description="Filter by cat name"
        with-clear
      >
        <quiet-icon slot="start" name="search"></quiet-icon>
      </quiet-text-field>

      ${data.savedCats.map((cat) => {
        const { isLoaded, isPaused } = getCatStatus(cat);
        const preview = generatePreview(cat);

        return renderCatCard(
          cat,
          preview,
          isLoaded,
          isPaused,
          handlers
        );
      })}
    </quiet-search-list>
  `;
}
