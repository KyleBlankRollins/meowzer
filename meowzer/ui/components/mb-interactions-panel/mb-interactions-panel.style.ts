import { css } from "lit";

export const interactionsPanelStyles = css`
  :host {
    display: block;
  }

  .panel-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--quiet-neutral-text-loud, #111827);
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .interaction-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--quiet-neutral-background-softest, #f9fafb);
    border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
    border-radius: var(--quiet-border-radius-md, 0.5rem);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .interaction-button:hover {
    background: var(--quiet-neutral-background-soft, #f3f4f6);
    border-color: var(--quiet-primary-stroke-soft, #93c5fd);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .interaction-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .interaction-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .interaction-button.active {
    background: var(--quiet-primary-background-soft, #dbeafe);
    border-color: var(--quiet-primary-stroke-loud, #3b82f6);
  }

  .button-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .button-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--quiet-neutral-text-mid, #4b5563);
    text-align: center;
  }

  .button-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--quiet-warning-background-loud, #fbbf24);
    color: var(--quiet-warning-text-loud, #78350f);
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: var(--quiet-border-radius-sm, 0.25rem);
    text-transform: uppercase;
  }

  .mode-notice {
    padding: 0.75rem 1rem;
    background: var(--quiet-primary-background-softest, #eff6ff);
    border-left: 4px solid var(--quiet-primary-stroke-loud, #3b82f6);
    border-radius: var(--quiet-border-radius-sm, 0.25rem);
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-mid, #4b5563);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mode-notice-icon {
    font-size: 1.25rem;
  }

  .mode-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .mode-actions quiet-button {
    flex: 1;
  }

  .mode-notice-content {
    flex: 1;
  }

  .mode-notice-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .uninitialized-message {
    color: var(--quiet-neutral-text-soft);
  }

  @media (max-width: 480px) {
    .items-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
