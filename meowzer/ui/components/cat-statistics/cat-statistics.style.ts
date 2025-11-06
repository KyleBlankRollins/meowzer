import { css } from "lit";

export const catStatisticsStyles = css`
  :host {
    display: block;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--quiet-neutral-background-softest, #f9fafb);
    border-radius: var(--quiet-border-radius-md, 0.375rem);
    border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-soft, #6b7280);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--quiet-neutral-text-loud, #111827);
    line-height: 1;
  }

  .stat-unit {
    font-size: 0.875rem;
    color: var(--quiet-neutral-text-mid, #4b5563);
    font-weight: 400;
    margin-left: 0.25rem;
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
`;
