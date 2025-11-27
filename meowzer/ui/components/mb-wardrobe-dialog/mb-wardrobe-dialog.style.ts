import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const wardrobeDialogStyles = [
  designTokens,
  css`
    .wardrobe-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem 0;
      min-width: 350px;
    }

    .section-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--mb-color-text-primary);
      margin-bottom: 0.5rem;
    }

    /* Hat Selection */
    .hat-selection {
      display: flex;
      flex-direction: column;
    }

    .hat-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .hat-button {
      min-height: 70px;
      width: 100%;
    }

    .hat-button-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .hat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hat-icon svg {
      width: 48px;
      height: 32px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    .hat-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Color Customization */
    .color-customization {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .color-pickers {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    /* Preview */
    .preview-section {
      display: flex;
      flex-direction: column;
    }

    .preview-area {
      background-color: var(--mb-color-surface-default);
      border: 1px solid var(--mb-color-border-subtle);
      border-radius: 8px;
      padding: 1.5rem;
      min-height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .preview-placeholder .hat-preview-svg {
      width: 96px;
      height: 64px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .preview-colors {
      display: flex;
      gap: 0.5rem;
    }

    .preview-color-swatch {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 2px solid var(--mb-color-border-subtle);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `,
];
