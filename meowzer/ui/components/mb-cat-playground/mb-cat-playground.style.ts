import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const catPlaygroundStyles = [
  designTokens,
  css`
    :host {
      flex: 1;
    }

    .playground-container {
      display: flex;
      width: 100%;
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
      background: var(--mb-color-surface-subtle);
      border-left: 1px solid var(--mb-color-border-subtle);
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
      color: var(--mb-color-status-error);
    }

    .loading-container {
      text-align: center;
      padding: 2rem;
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--mb-color-text-secondary);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .playground-container {
        grid-template-columns: 1fr;
        grid-template-rows: 400px 1fr;
      }
    }
  `,
];
