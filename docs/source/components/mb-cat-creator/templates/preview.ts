/**
 * Preview panel templates
 */

import { html, type TemplateResult } from "lit";
import type { ProtoCat } from "meowzer";

/**
 * Render the cat preview panel
 */
export function renderPreview(
  preview: ProtoCat | null,
  validationErrors: string[]
): TemplateResult {
  if (preview) {
    return html`
      <div class="preview-container">
        <div
          class="cat-preview"
          style="--cat-scale: ${preview.dimensions.scale}"
          .innerHTML=${preview.spriteData.svg}
        ></div>
        <div class="preview-details">
          <p>
            <strong>Seed:</strong>
            <code>${preview.seed}</code>
          </p>
          <p><strong>Size:</strong> ${preview.dimensions.size}</p>
        </div>
      </div>
    `;
  }

  return html`
    <div class="preview-error">
      <p>Invalid settings</p>
      ${validationErrors.map(
        (err) => html`<p class="error-text">${err}</p>`
      )}
    </div>
  `;
}
