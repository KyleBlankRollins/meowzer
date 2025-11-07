import { css } from "lit";

export const wardrobeDialogStyles = css`
  .wardrobe-content {
    display: flex;
    flex-direction: column;
    gap: var(--quiet-spacing-6);
    padding: var(--quiet-spacing-4) 0;
    min-width: 400px;
  }

  .section-label {
    display: block;
    font-size: var(--quiet-font-size-sm);
    font-weight: var(--quiet-font-weight-semibold);
    color: var(--quiet-color-foreground-primary);
    margin-bottom: var(--quiet-spacing-3);
  }

  /* Hat Selection */
  .hat-selection {
    display: flex;
    flex-direction: column;
  }

  .hat-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--quiet-spacing-3);
  }

  .hat-button {
    padding: var(--quiet-spacing-4);
    min-height: 80px;
  }

  .hat-button-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quiet-spacing-2);
  }

  .hat-emoji {
    font-size: 2rem;
    line-height: 1;
  }

  .hat-label {
    font-size: var(--quiet-font-size-sm);
    font-weight: var(--quiet-font-weight-medium);
  }

  /* Color Customization */
  .color-customization {
    display: flex;
    flex-direction: column;
    gap: var(--quiet-spacing-3);
  }

  /* Preview */
  .preview-section {
    display: flex;
    flex-direction: column;
  }

  .preview-area {
    background-color: var(--quiet-color-background-secondary);
    border: 1px solid var(--quiet-color-border-primary);
    border-radius: var(--quiet-radius-md);
    padding: var(--quiet-spacing-6);
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quiet-spacing-4);
  }

  .preview-emoji {
    font-size: 4rem;
    line-height: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .preview-colors {
    display: flex;
    gap: var(--quiet-spacing-2);
  }

  .preview-color-swatch {
    width: 32px;
    height: 32px;
    border-radius: var(--quiet-radius-sm);
    border: 2px solid var(--quiet-color-border-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;
