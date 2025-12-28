import { css } from "lit";

export const adoptSectionStyles = css`
  :host {
    display: block;
  }

  .adopt-section {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-lg);
  }

  .adopt-header {
    text-align: center;
  }

  .adopt-header h3 {
    margin: 0 0 var(--mb-space-sm);
    font-size: var(--mb-font-size-xl);
    font-weight: var(--mb-font-weight-semibold);
    color: var(--mb-color-text-primary);
  }

  .adopt-description {
    margin: 0;
    font-size: var(--mb-font-size);
    color: var(--mb-color-text-secondary);
    line-height: var(--mb-line-height-relaxed);
  }

  .adopt-form {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-md);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-xs);
  }

  .error-message {
    margin-top: var(--mb-space-xs);
  }

  .preview-container {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-sm);
    padding: var(--mb-space-md);
    background: var(--mb-color-surface-subtle);
    border: 1px solid var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-medium);
  }

  .preview-container h4 {
    margin: 0;
    font-size: var(--mb-font-size);
    font-weight: var(--mb-font-weight-medium);
    color: var(--mb-color-text-secondary);
  }

  .cat-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--mb-space-lg);
    background: var(--mb-color-surface-default);
    border-radius: var(--mb-radius-small);
    min-height: 150px;
  }

  .cat-preview svg {
    max-width: 150px;
    max-height: 150px;
  }

  .adopt-actions {
    display: flex;
    justify-content: center;
    padding-top: var(--mb-space-md);
    border-top: 1px solid var(--mb-color-border-subtle);
  }
`;
