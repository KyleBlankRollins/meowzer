import { css } from "lit";

export const mbCatCardStyles = css`
  :host {
    display: block;
  }

  .cat-card .cat-info {
    display: grid;
    gap: 0.75rem;
  }

  .cat-card h4 {
    margin: 0;
    color: var(--quiet-text-heading);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .cat-card p {
    margin: 0;
    color: var(--quiet-text-body);
    font-size: 0.875rem;
  }

  .cat-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .cat-id {
    font-size: 0.75rem;
    color: var(--quiet-text-muted);
    font-family: monospace;
  }

  .cat-actions {
    display: flex;
    gap: 0.5rem;
  }
`;
