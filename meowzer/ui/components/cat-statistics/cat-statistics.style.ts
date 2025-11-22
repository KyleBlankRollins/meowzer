import { css } from "lit";
import { carbonTokens } from "../../shared/carbon-tokens.js";

export const catStatisticsStyles = [
  carbonTokens,
  css`
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
      background: var(--cds-layer-01);
      border-radius: 8px;
      border: 1px solid var(--cds-border-subtle-01);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--cds-text-helper);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--cds-text-primary);
      line-height: 1;
    }

    .stat-unit {
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
      font-weight: 400;
      margin-left: 0.25rem;
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `,
];
