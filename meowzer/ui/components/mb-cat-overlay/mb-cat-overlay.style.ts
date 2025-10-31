import { css } from "lit";

export const catOverlayStyles = css`
  :host {
    display: contents;
  }

  .overlay-panel {
    position: fixed;
    z-index: 10000;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Position variants */
  .overlay-panel.top-right {
    top: 1rem;
    right: 1rem;
  }

  .overlay-panel.top-left {
    top: 1rem;
    left: 1rem;
  }

  .overlay-panel.bottom-right {
    bottom: 1rem;
    right: 1rem;
  }

  .overlay-panel.bottom-left {
    bottom: 1rem;
    left: 1rem;
  }

  /* Minimized state */
  .overlay-panel.minimized {
    width: auto;
    height: auto;
  }

  .overlay-panel:not(.minimized) {
    width: 400px;
    height: 600px;
  }

  /* Overlay header */
  .overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface-secondary);
  }

  .overlay-header h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .header-controls {
    display: flex;
    gap: 0.5rem;
  }

  .header-controls quiet-button {
    min-width: 2rem;
    padding: 0.25rem 0.5rem;
  }

  /* Overlay container */
  .overlay-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* Tabs area */
  .overlay-tabs {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  /* Tab panels */
  .tab-panel {
    display: none;
  }

  .tab-panel.active {
    display: block;
  }

  /* Tab navigation */
  .tab-nav {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: var(--surface-secondary);
  }

  .tab-button {
    flex: 1;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-button:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
  }

  .tab-button.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }

  /* Minimized button */
  .minimized-button {
    padding: 0.75rem 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  }

  .minimized-button:hover {
    background: var(--surface-hover);
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.15);
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .overlay-panel:not(.minimized) {
      width: calc(100vw - 2rem);
      height: calc(100vh - 2rem);
      top: 1rem !important;
      left: 1rem !important;
      right: 1rem !important;
      bottom: 1rem !important;
    }

    .overlay-panel.top-right,
    .overlay-panel.top-left,
    .overlay-panel.bottom-right,
    .overlay-panel.bottom-left {
      position: fixed;
    }
  }

  /* Animation for show/hide */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .overlay-panel {
    animation: slideIn 0.3s ease-out;
  }

  .error-message {
    padding: 1rem;
    color: var(--quiet-destructive-text);
  }

  .loading-container {
    padding: 1rem;
    text-align: center;
  }

  .loading-text {
    margin-top: 1rem;
    color: var(--quiet-neutral-text-mid);
  }
`;
