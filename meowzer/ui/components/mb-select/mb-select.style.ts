import { css } from "lit";

export const mbSelectStyles = css`
  :host {
    display: inline-block;
    width: 100%;
  }

  .mb-select {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-xs);
  }

  .mb-select__label {
    font-size: var(--mb-font-size-small);
    font-weight: 500;
    color: var(--mb-color-text-primary);
    display: flex;
    align-items: center;
    gap: var(--mb-space-xs);
  }

  .mb-select__required {
    color: var(--mb-color-feedback-error);
  }

  .mb-select__wrapper {
    position: relative;
    display: flex;
  }

  .mb-select__native {
    width: 100%;
    padding: var(--mb-space-sm) var(--mb-space-md);
    padding-right: var(--mb-space-xxl);
    font-family: var(--mb-font-family-base);
    font-size: var(--mb-font-size-base);
    color: var(--mb-color-text-primary);
    background: var(--mb-color-surface-default);
    border: 1px solid var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-medium);
    appearance: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mb-select__native:hover {
    border-color: var(--mb-color-interactive-primary);
  }

  .mb-select__native:focus {
    outline: 2px solid var(--mb-color-interactive-primary);
    outline-offset: 2px;
    border-color: var(--mb-color-interactive-primary);
  }

  .mb-select__native:disabled {
    background: var(--mb-color-surface-disabled);
    color: var(--mb-color-text-disabled);
    border-color: var(--mb-color-border-subtle);
    cursor: not-allowed;
  }

  /* Error state */
  :host([error]) .mb-select__native {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-select__native:hover {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-select__native:focus {
    outline-color: var(--mb-color-feedback-error);
    border-color: var(--mb-color-feedback-error);
  }

  /* Chevron icon */
  .mb-select__chevron {
    position: absolute;
    right: var(--mb-space-sm);
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--mb-color-text-secondary);
    pointer-events: none;
  }

  .mb-select__native:disabled ~ .mb-select__chevron {
    color: var(--mb-color-text-disabled);
  }

  /* Helper text */
  .mb-select__helper {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
  }

  .mb-select__native:disabled ~ .mb-select__helper {
    color: var(--mb-color-text-disabled);
  }

  /* Error message */
  .mb-select__error {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-feedback-error);
  }

  /* Size variants */
  :host([size="sm"]) .mb-select__native {
    padding: var(--mb-space-xs) var(--mb-space-sm);
    padding-right: var(--mb-space-xl);
    font-size: var(--mb-font-size-small);
  }

  :host([size="sm"]) .mb-select__chevron {
    right: var(--mb-space-xs);
    width: 14px;
    height: 14px;
  }

  :host([size="lg"]) .mb-select__native {
    padding: var(--mb-space-md) var(--mb-space-lg);
    padding-right: calc(var(--mb-space-xxl) + var(--mb-space-sm));
    font-size: var(--mb-font-size-large);
  }

  :host([size="lg"]) .mb-select__chevron {
    right: var(--mb-space-md);
    width: 20px;
    height: 20px;
  }
`;
