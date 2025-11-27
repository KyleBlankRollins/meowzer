import { css } from "lit";

export const mbTextareaStyles = css`
  :host {
    display: block;
  }

  .mb-textarea {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-xs);
  }

  .mb-textarea__label {
    font-size: var(--mb-font-size-small);
    font-weight: var(--mb-font-weight-medium);
    color: var(--mb-color-text-primary);
  }

  .mb-textarea__label--required::after {
    content: " *";
    color: var(--mb-color-feedback-error);
  }

  .mb-textarea__textarea-wrapper {
    position: relative;
  }

  .mb-textarea__textarea {
    width: 100%;
    padding: var(--mb-space-sm);
    font-size: var(--mb-font-size-base);
    font-family: inherit;
    color: var(--mb-color-text-primary);
    background: var(--mb-color-surface-default);
    border: 1px solid var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-small);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;
    resize: vertical;
  }

  .mb-textarea__textarea::placeholder {
    color: var(--mb-color-text-placeholder);
  }

  /* Non-resizable */
  :host([resizable="false"]) .mb-textarea__textarea {
    resize: none;
  }

  /* Focus state */
  .mb-textarea__textarea:focus {
    border-color: var(--mb-color-interactive-primary);
    box-shadow: 0 0 0 1px var(--mb-color-interactive-primary);
  }

  /* Error state */
  :host([error]) .mb-textarea__textarea {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-textarea__textarea:focus {
    border-color: var(--mb-color-feedback-error);
    box-shadow: 0 0 0 1px var(--mb-color-feedback-error);
  }

  /* Disabled state */
  .mb-textarea__textarea:disabled {
    background: var(--mb-color-surface-disabled);
    color: var(--mb-color-text-disabled);
    border-color: var(--mb-color-border-subtle);
    cursor: not-allowed;
    resize: none;
  }

  /* Helper text */
  .mb-textarea__helper {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
  }

  /* Error message */
  .mb-textarea__error {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-feedback-error);
  }

  /* Character counter */
  .mb-textarea__counter {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
    text-align: right;
  }

  .mb-textarea__counter--warning {
    color: var(--mb-color-feedback-warning);
  }

  .mb-textarea__counter--error {
    color: var(--mb-color-feedback-error);
  }
`;
