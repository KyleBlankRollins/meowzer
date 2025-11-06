import { css } from "lit";

export const catImporterStyles = css`
    :host {
      display: block;
    }

    .importer-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .upload-area {
      border: 2px dashed var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .upload-area:hover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      background: var(--quiet-primary-background-softest, #dbeafe);
    }

    .upload-area.dragover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      background: var(--quiet-primary-background-softest, #dbeafe);
    }

    .upload-icon {
      font-size: 3rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin-bottom: 1rem;
    }

    .upload-text {
      color: var(--quiet-neutral-foreground, #111827);
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .upload-hint {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }

    input[type="file"] {
      display: none;
    }

    .preview-container {
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      padding: 1rem;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .preview-title {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .preview-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .preview-row {
      display: flex;
      justify-content: space-between;
    }

    .preview-label {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .import-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .import-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `;
