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

  .preview-empty p {
    margin: 0.5rem 0;
  }

  .preview-empty .help-text {
    font-size: 0.875rem;
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

  /* Toolbar styling */
  quiet-toolbar {
    width: 100%;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  quiet-toolbar quiet-button {
    flex-shrink: 0;
  }

  /* Dialog content styling */
  quiet-dialog {
    --width: 800px;
  }

  quiet-dialog::part(panel) {
    max-width: 90vw;
  }

  quiet-dialog::part(body) {
    padding: 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 1rem;
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

  /* Error and loading states */
  .error-message {
    padding: 1rem;
    color: var(--quiet-destructive-text);
  }

  .loading-container {
    text-align: center;
    padding: 2rem;
  }

  .loading-text {
    margin-top: 1rem;
    color: var(--quiet-neutral-text-mid);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .playground-container {
      grid-template-columns: 1fr;
      grid-template-rows: 400px 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
