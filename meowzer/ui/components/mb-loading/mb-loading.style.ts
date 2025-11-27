import { css } from "lit";

export const mbLoadingStyles = css`
  :host {
    display: inline-block;
  }

  .mb-loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--mb-space-sm);
  }

  /* Spinner */
  .mb-loading__spinner {
    display: inline-block;
    border-radius: 50%;
    border-style: solid;
    border-color: var(--mb-color-interactive-default);
    border-right-color: transparent;
    animation: mb-spin 0.8s linear infinite;
  }

  /* Size variants */
  .mb-loading--sm .mb-loading__spinner {
    width: 16px;
    height: 16px;
    border-width: 2px;
  }

  .mb-loading--md .mb-loading__spinner {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  .mb-loading--lg .mb-loading__spinner {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }

  /* Text */
  .mb-loading__text {
    color: var(--mb-color-text-secondary);
    font-size: var(--mb-font-size-small);
  }

  .mb-loading__text:empty {
    display: none;
  }

  .mb-loading--md .mb-loading__text {
    font-size: var(--mb-font-size-base);
  }

  .mb-loading--lg .mb-loading__text {
    font-size: var(--mb-font-size-large);
  }

  /* Overlay mode */
  .mb-loading--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
  }

  .mb-loading--overlay .mb-loading {
    flex-direction: column;
    padding: var(--mb-space-xl);
    background: var(--mb-color-surface-default);
    border-radius: var(--mb-radius-large);
    box-shadow: var(--mb-shadow-large);
  }

  .mb-loading--overlay .mb-loading__text {
    color: var(--mb-color-text-primary);
    margin-top: var(--mb-space-md);
  }

  /* Animation */
  @keyframes mb-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
