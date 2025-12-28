import { css } from "lit";

export const mbShareCatModalStyles = css`
  :host {
    display: contents;
  }

  .share-content {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-lg);
    padding: var(--mb-space-md);
  }

  .cat-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--mb-space-lg);
    background: var(--mb-color-surface-default);
    border: 1px solid var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-medium);
    min-height: 200px;
  }

  .cat-preview svg {
    max-width: 200px;
    max-height: 200px;
  }

  .cat-info {
    text-align: center;
  }

  .cat-name {
    margin: 0;
    font-size: var(--mb-font-size-xl);
    font-weight: var(--mb-font-weight-semibold);
    color: var(--mb-color-text-primary);
  }

  .cat-description {
    margin: var(--mb-space-sm) 0 0;
    font-size: var(--mb-font-size);
    color: var(--mb-color-text-secondary);
    line-height: var(--mb-line-height-relaxed);
  }

  .seed-section {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-sm);
  }

  .seed-label {
    font-size: var(--mb-font-size-sm);
    font-weight: var(--mb-font-weight-medium);
    color: var(--mb-color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .seed-display {
    padding: var(--mb-space-md);
    background: var(--mb-color-surface-subtle);
    border: 1px solid var(--mb-color-border-default);
    border-radius: var(--mb-radius-small);
  }

  .seed-value {
    display: block;
    font-family: var(--mb-font-family-mono, monospace);
    font-size: var(--mb-font-size);
    color: var(--mb-color-text-primary);
    word-break: break-all;
    user-select: all;
  }

  .seed-help {
    margin: 0;
    font-size: var(--mb-font-size-sm);
    color: var(--mb-color-text-tertiary);
    line-height: var(--mb-line-height-relaxed);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--mb-space-sm);
    padding: var(--mb-space-md);
    border-top: 1px solid var(--mb-color-border-subtle);
  }
`;
