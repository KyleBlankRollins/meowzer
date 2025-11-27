import { css } from "lit";

export const mbCheckboxStyles = css`
  :host {
    display: inline-block;
  }

  .mb-checkbox {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--mb-space-sm);
    cursor: pointer;
    user-select: none;
  }

  .mb-checkbox--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .mb-checkbox__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .mb-checkbox__input {
    position: absolute;
    opacity: 0;
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
  }

  .mb-checkbox__input:disabled {
    cursor: not-allowed;
  }

  .mb-checkbox__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: 2px solid var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-small);
    background: var(--mb-color-surface-default);
    transition: all 0.15s ease;
  }

  /* Hover state */
  .mb-checkbox:hover .mb-checkbox__box {
    border-color: var(--mb-color-interactive-primary);
  }

  /* Focus state */
  .mb-checkbox__input:focus-visible + .mb-checkbox__box {
    outline: 2px solid var(--mb-color-interactive-primary);
    outline-offset: 2px;
  }

  /* Checked state */
  .mb-checkbox__input:checked + .mb-checkbox__box {
    background: var(--mb-color-interactive-primary);
    border-color: var(--mb-color-interactive-primary);
  }

  /* Checkmark */
  .mb-checkbox__checkmark {
    display: none;
    width: 12px;
    height: 12px;
    color: var(--mb-color-surface-default);
  }

  .mb-checkbox__input:checked ~ .mb-checkbox__checkmark {
    display: block;
  }

  /* Indeterminate state */
  .mb-checkbox__input:indeterminate + .mb-checkbox__box {
    background: var(--mb-color-interactive-primary);
    border-color: var(--mb-color-interactive-primary);
  }

  .mb-checkbox__dash {
    display: none;
    width: 10px;
    height: 2px;
    background: var(--mb-color-surface-default);
    border-radius: 1px;
  }

  .mb-checkbox__input:indeterminate ~ .mb-checkbox__dash {
    display: block;
  }

  /* Disabled state */
  .mb-checkbox--disabled .mb-checkbox__box {
    background: var(--mb-color-surface-disabled);
    border-color: var(--mb-color-border-subtle);
  }

  .mb-checkbox--disabled:hover .mb-checkbox__box {
    border-color: var(--mb-color-border-subtle);
  }

  .mb-checkbox--disabled
    .mb-checkbox__input:checked
    + .mb-checkbox__box {
    background: var(--mb-color-surface-disabled);
    border-color: var(--mb-color-border-subtle);
  }

  .mb-checkbox--disabled .mb-checkbox__checkmark {
    color: var(--mb-color-text-disabled);
  }

  /* Label */
  .mb-checkbox__label {
    font-size: var(--mb-font-size-base);
    color: var(--mb-color-text-primary);
    line-height: 1.5;
  }

  .mb-checkbox--disabled .mb-checkbox__label {
    color: var(--mb-color-text-disabled);
  }

  /* Helper text */
  .mb-checkbox__helper {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
    margin-top: var(--mb-space-xs);
    margin-left: 26px; /* Align with label */
  }

  .mb-checkbox--disabled .mb-checkbox__helper {
    color: var(--mb-color-text-disabled);
  }

  /* Error state */
  :host([error]) .mb-checkbox__box {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-checkbox:hover .mb-checkbox__box {
    border-color: var(--mb-color-feedback-error);
  }

  :host([error]) .mb-checkbox__input:checked + .mb-checkbox__box {
    background: var(--mb-color-feedback-error);
    border-color: var(--mb-color-feedback-error);
  }

  .mb-checkbox__error {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-feedback-error);
    margin-top: var(--mb-space-xs);
    margin-left: 26px; /* Align with label */
  }
`;
