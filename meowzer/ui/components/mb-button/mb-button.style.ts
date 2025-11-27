import { css } from "lit";

export const mbButtonStyles = css`
  :host {
    display: inline-block;
  }

  .mb-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--mb-space-2);
    padding: var(--mb-space-2) var(--mb-space-4);
    font-family: var(--mb-font-family);
    font-size: var(--mb-font-size);
    font-weight: var(--mb-font-weight-medium);
    line-height: var(--mb-line-height-tight);
    border: none;
    border-radius: var(--mb-radius-medium);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    user-select: none;
  }

  .mb-button:focus-visible {
    outline: 2px solid var(--mb-color-interactive-focus);
    outline-offset: 2px;
  }

  /* Variants */
  .mb-button--primary {
    background: var(--mb-color-brand-primary);
    color: var(--mb-color-text-on-brand);
  }

  .mb-button--primary:hover:not(:disabled) {
    background: var(--mb-color-interactive-primary);
    box-shadow: var(--mb-shadow-small);
  }

  .mb-button--primary:active:not(:disabled) {
    background: var(--mb-color-interactive-primary);
    box-shadow: none;
    transform: translateY(1px);
  }

  .mb-button--secondary {
    background: var(--mb-color-surface-subtle);
    color: var(--mb-color-text-primary);
    border: 1px solid var(--mb-color-border-default);
  }

  .mb-button--secondary:hover:not(:disabled) {
    background: var(--mb-color-surface-hover);
    border-color: var(--mb-color-border-strong);
  }

  .mb-button--secondary:active:not(:disabled) {
    background: var(--mb-color-surface-hover);
    transform: translateY(1px);
  }

  .mb-button--tertiary {
    background: transparent;
    color: var(--mb-color-text-primary);
  }

  .mb-button--tertiary:hover:not(:disabled) {
    background: var(--mb-color-surface-hover);
  }

  .mb-button--tertiary:active:not(:disabled) {
    background: var(--mb-color-surface-hover);
    transform: translateY(1px);
  }

  /* Sizes */
  .mb-button--sm {
    padding: var(--mb-space-1) var(--mb-space-3);
    font-size: var(--mb-font-size-small);
  }

  .mb-button--md {
    padding: var(--mb-space-2) var(--mb-space-4);
    font-size: var(--mb-font-size);
  }

  .mb-button--lg {
    padding: var(--mb-space-3) var(--mb-space-5);
    font-size: var(--mb-font-size-medium);
  }

  /* States */
  .mb-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mb-button--loading {
    position: relative;
    color: transparent;
    pointer-events: none;
  }

  .mb-button--loading::after {
    content: "";
    position: absolute;
    width: 1em;
    height: 1em;
    top: 50%;
    left: 50%;
    margin-left: -0.5em;
    margin-top: -0.5em;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.6s linear infinite;
    color: var(--mb-color-text-primary);
  }

  .mb-button--primary.mb-button--loading::after {
    color: var(--mb-color-text-on-brand);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Icon slot */
  ::slotted([slot="icon"]) {
    display: inline-flex;
    width: 1em;
    height: 1em;
  }
`;
