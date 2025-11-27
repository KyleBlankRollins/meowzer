import { css } from "lit";

export const mbTextInputStyles = css`
  :host {
    display: block;
  }

  .mb-text-input {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-xs);
  }

  .mb-text-input__label {
    font-size: var(--mb-font-size-small);
    font-weight: var(--mb-font-weight-medium);
    color: var(--mb-color-text-primary);
  }

  .mb-text-input__label--required::after {
    content: " *";
    color: var(--mb-color-feedback-error);
  }

  .mb-text-input__input-wrapper {
    position: relative;
  }

  .mb-text-input__input {
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
  }

  .mb-text-input__input::placeholder {
    color: var(--mb-color-text-placeholder);
  }

  /* Focus state */
  .mb-text-input__input:focus {
    border-color: var(--mb-color-interactive-primary);
    box-shadow: 0 0 0 1px var(--mb-color-interactive-primary);
  }

  /* Error state */
  :host([error]) .mb-text-input__input {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-text-input__input:focus {
    border-color: var(--mb-color-feedback-error);
    box-shadow: 0 0 0 1px var(--mb-color-feedback-error);
  }

  /* Disabled state */
  .mb-text-input__input:disabled {
    background: var(--mb-color-surface-disabled);
    color: var(--mb-color-text-disabled);
    border-color: var(--mb-color-border-subtle);
    cursor: not-allowed;
  }

  /* Helper text */
  .mb-text-input__helper {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
  }

  /* Error message */
  .mb-text-input__error {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-feedback-error);
  }
`;
