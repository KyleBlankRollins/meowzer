import { css } from "lit";

export const mbModalStyles = css`
  :host {
    display: contents;
  }

  /* Backdrop */
  .mb-modal__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 9998;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Dialog Container */
  .mb-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background: var(--mb-color-surface-default);
    border-radius: var(--mb-radius-large);
    box-shadow: var(--mb-shadow-large);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  /* Size variants */
  :host([size="sm"]) .mb-modal {
    width: 90%;
    max-width: 400px;
  }

  :host([size="md"]) .mb-modal,
  .mb-modal {
    width: 90%;
    max-width: 600px;
  }

  :host([size="lg"]) .mb-modal {
    width: 90%;
    max-width: 900px;
  }

  /* Header */
  .mb-modal__header {
    padding: var(--mb-space-lg) var(--mb-space-lg) var(--mb-space-md);
    border-bottom: 1px solid var(--mb-color-border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--mb-space-md);
  }

  .mb-modal__heading {
    margin: 0;
    font-size: var(--mb-font-size-xl);
    font-weight: 600;
    color: var(--mb-color-text-primary);
    flex: 1;
  }

  .mb-modal__close {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--mb-radius-small);
    color: var(--mb-color-text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .mb-modal__close:hover {
    background: var(--mb-color-surface-hover);
    color: var(--mb-color-text-primary);
  }

  .mb-modal__close:focus-visible {
    outline: 2px solid var(--mb-color-interactive-primary);
    outline-offset: 2px;
  }

  .mb-modal__close svg {
    width: 20px;
    height: 20px;
  }

  /* Body */
  .mb-modal__body {
    padding: var(--mb-space-lg);
    overflow-y: auto;
    flex: 1;
    color: var(--mb-color-text-primary);
  }

  /* Custom scrollbar for body */
  .mb-modal__body::-webkit-scrollbar {
    width: 8px;
  }

  .mb-modal__body::-webkit-scrollbar-track {
    background: var(--mb-color-surface-secondary);
    border-radius: var(--mb-radius-small);
  }

  .mb-modal__body::-webkit-scrollbar-thumb {
    background: var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-small);
  }

  .mb-modal__body::-webkit-scrollbar-thumb:hover {
    background: var(--mb-color-text-secondary);
  }

  /* Footer */
  .mb-modal__footer {
    padding: var(--mb-space-md) var(--mb-space-lg) var(--mb-space-lg);
    border-top: 1px solid var(--mb-color-border-subtle);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--mb-space-sm);
  }

  /* Prevent body scroll when modal is open */
  :host([open]) {
    position: fixed;
  }
`;
