import { css } from "lit";

export const catPlaygroundStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .playground-container {
    display: flex;
    height: 100%;
    background: var(--surface);
  }

  .playground-main {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .playground-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--cds-layer-01);
    border-left: 1px solid var(--cds-border-subtle-01);
    min-width: 80px;
    max-width: 80px;
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

  .preview-empty svg {
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

  /* Error and loading states */
  .error-message {
    padding: 1rem;
    color: var(--cds-text-error);
  }

  .loading-container {
    text-align: center;
    padding: 2rem;
  }

  .loading-text {
    margin-top: 1rem;
    color: var(--cds-text-secondary);
  }

  /* Context menu styles */
  .context-menu-content {
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    padding: 0.5rem 0;
    min-width: 150px;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: var(--cds-text-primary);
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .menu-item:hover {
    background: var(--cds-layer-hover-01);
  }

  .menu-item.destructive {
    color: var(--cds-text-error);
  }

  .context-menu-content hr {
    margin: 0.5rem 0;
    border: none;
    border-top: 1px solid var(--cds-border-subtle-01);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .playground-container {
      grid-template-columns: 1fr;
      grid-template-rows: 400px 1fr;
    }
  }
`;
