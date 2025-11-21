import { css } from "lit";

export const wardrobeDialogStyles = css`
  .wardrobe-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
    min-width: 400px;
  }

  .section-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--cds-text-primary);
    margin-bottom: 0.75rem;
  }

  /* Hat Selection */
  .hat-selection {
    display: flex;
    flex-direction: column;
  }

  .hat-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .hat-button {
    padding: 1rem;
    min-height: 80px;
  }

  .hat-button-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .hat-preview-svg {
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
    gap: 0.75rem;
  }

  /* Preview */
  .preview-section {
    display: flex;
    flex-direction: column;
  }

  .preview-area {
    background-color: var(--cds-layer-02);
    border: 1px solid var(--cds-border-subtle-01);
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
    border: 2px solid var(--cds-border-subtle-01);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;
