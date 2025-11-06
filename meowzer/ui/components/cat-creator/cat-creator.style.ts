import { css } from "lit";

export const catCreatorStyles = css`
  :host {
    display: block;
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
      grid-template-rows: auto 1fr;
    }

    .preview-panel {
      order: -1; /* Ensure preview appears first on mobile */
    }
  }

  /* Preview Panel */
  .preview-panel {
    align-self: start;
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

  /* Form Actions */
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
  }

  /* Step Indicator */
  .step-indicator {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  .step-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--quiet-neutral-stroke-soft);
    transition: all 0.2s ease;
  }

  .step-dot.active {
    background: var(--quiet-primary-fill-loud);
    transform: scale(1.2);
  }

  .step-dot.completed {
    background: var(--quiet-primary-fill-mid);
  }

  /* Wizard navigation */
  .wizard-navigation {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
    margin-top: 1.5rem;
  }

  .wizard-navigation .nav-group {
    display: flex;
    gap: 0.5rem;
  }

  /* Step errors */
  .step-errors {
    margin-bottom: 1rem;
  }

  .step-errors ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
  }

  /* Reset button under preview */
  .preview-actions {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
`;
