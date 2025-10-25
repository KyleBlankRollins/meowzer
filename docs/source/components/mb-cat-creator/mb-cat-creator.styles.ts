import { css } from "lit";

export const mbCatCreatorStyles = css`
  :host {
    display: block;
  }

  .creator-loading {
    padding: 2rem;
    text-align: center;
    color: var(--quiet-neutral-text-soft);
  }

  .cat-creator {
    display: grid;
    gap: 1rem;
  }

  .message {
    margin-bottom: 1rem;
  }

  .creator-layout {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 2fr;
  }

  @media (max-width: 768px) {
    .creator-layout {
      grid-template-columns: 1fr;
    }
  }

  /* Preview Panel */
  .preview-panel {
    position: sticky;
    top: 1rem;
    align-self: start;
  }

  .preview-container {
    display: grid;
    gap: 1rem;
  }

  .cat-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: var(--quiet-neutral-fill-softer);
    border-radius: var(--quiet-radius-md);
    min-height: 200px;
  }

  .cat-preview svg {
    max-width: 100%;
    height: auto;
  }

  .preview-details {
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-soft);
  }

  .preview-details p {
    margin: 0.5rem 0;
  }

  .preview-error {
    padding: 2rem;
    text-align: center;
    color: var(--quiet-destructive-text-loud);
  }

  .error-text {
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  /* Settings Panel */
  .creator-form {
    display: grid;
    gap: 1.5rem;
  }

  .form-section {
    display: grid;
    gap: 1rem;
  }

  .form-section h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--quiet-neutral-text-loud);
    border-bottom: 1px solid var(--quiet-neutral-stroke-soft);
    padding-bottom: 0.5rem;
  }

  /* Color Pickers */
  .color-picker {
    display: grid;
    gap: 0.5rem;
  }

  .color-picker label {
    display: grid;
    gap: 0.5rem;
  }

  .color-picker input[type="color"] {
    width: 100%;
    height: 3rem;
    border: 2px solid var(--quiet-neutral-stroke-soft);
    border-radius: var(--quiet-radius-sm);
    cursor: pointer;
  }

  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-soft);
  }

  /* Select Fields */
  label {
    display: grid;
    gap: 0.5rem;
    font-weight: 500;
  }

  label > span:first-child {
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-mid);
  }

  select {
    padding: 0.75rem;
    border: 1px solid var(--quiet-neutral-stroke-soft);
    border-radius: var(--quiet-radius-sm);
    background: var(--quiet-neutral-fill-softer);
    color: var(--quiet-neutral-text-loud);
    font-size: 1rem;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  select:hover {
    border-color: var(--quiet-neutral-stroke-mid);
  }

  select:focus {
    outline: none;
    border-color: var(--quiet-primary-stroke-mid);
  }

  /* Form Actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
  }
`;
