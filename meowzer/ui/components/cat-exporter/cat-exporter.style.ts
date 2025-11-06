import { css } from "lit";

export const catExporterStyles = css`
    :host {
      display: block;
    }

    .exporter-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .mode-selector {
      display: flex;
      gap: 0.5rem;
    }

    .export-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cat-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 0.75rem;
    }

    .cat-list-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cat-name {
      flex: 1;
      font-size: 0.875rem;
    }

    .export-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .export-preview {
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 1rem;
      font-family: monospace;
      font-size: 0.75rem;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .export-options-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .export-options-actions {
      display: flex;
      gap: 0.5rem;
    }
  `;
