import { css } from "lit";

export const mbMeowzerDemoStyles = css`
  :host {
    display: block;
    padding: var(--quiet-spacing-lg);
  }

  .demo-container {
    display: flex;
    flex-direction: column;
    gap: var(--quiet-spacing-lg);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--quiet-spacing-md);
    align-items: center;
  }

  .personality-label {
    display: flex;
    align-items: center;
    gap: var(--quiet-spacing-sm);
  }

  .personality-select {
    padding: var(--quiet-spacing-sm);
    border-radius: var(--quiet-radius-sm);
  }

  .playground {
    min-height: 400px;
    border: 2px dashed var(--quiet-color-border);
    border-radius: var(--quiet-radius-md);
    background: var(--quiet-color-surface-variant);
  }

  .empty-icon {
    font-size: 4rem;
    opacity: 0.3;
  }

  .stats {
    display: flex;
    gap: var(--quiet-spacing-md);
    flex-wrap: wrap;
  }

  .stat-card {
    flex: 1;
    min-width: 150px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--quiet-spacing-md);
  }
`;
