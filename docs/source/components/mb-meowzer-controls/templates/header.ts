/**
 * Panel header templates
 */

import { html, type TemplateResult } from "lit";

/**
 * Render panel header with cat count
 */
export function renderPanelHeader(catCount: number): TemplateResult {
  return html`
    <div class="panel-header">
      <span class="panel-title">Meowzer Controls</span>
      <span class="cat-count"
        >${catCount} cat${catCount !== 1 ? "s" : ""}</span
      >
    </div>
  `;
}

/**
 * Render saved cats section header
 */
export function renderSavedCatsHeader(
  savedCount: number
): TemplateResult {
  return html`
    <div class="section-header">
      <span class="section-title">Saved Cats</span>
      <span class="saved-count">${savedCount}</span>
    </div>
  `;
}
