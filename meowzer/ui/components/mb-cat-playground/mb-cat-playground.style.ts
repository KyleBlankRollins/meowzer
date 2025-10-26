import { css } from "lit";

export const catPlaygroundStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .playground-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface);
  }

  .preview-area {
    position: relative;
    background: var(--surface-secondary);
    border: 2px dashed var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .preview-empty {
    text-align: center;
    color: var(--text-secondary);
  }

  .preview-empty quiet-icon {
    font-size: 4rem;
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  .controls-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  .controls-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .controls-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-item {
    padding: 0.75rem;
    background: var(--surface-secondary);
    border-radius: 0.375rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .playground-container {
      grid-template-columns: 1fr;
      grid-template-rows: 400px 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
