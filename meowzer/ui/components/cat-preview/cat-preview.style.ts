import { css } from "lit";

export const catPreviewStyles = css`
  :host {
    display: block;
  }

  .preview-container {
    border: 2px solid var(--cds-border-subtle-01);
    border-radius: 12px;
    padding: 2rem;
    background: var(--cds-layer-01);
    min-height: 300px;
  }

  /* ProtoCat rendering styles */
  .protocat-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--cds-layer-02);
    border-radius: 8px;
    min-height: 200px;
  }

  .protocat-preview svg {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 300px;
    transform: scale(var(--cat-scale));
    transform-origin: center center;
  }

  .preview-details {
    font-size: 0.875rem;
    color: var(--cds-text-helper);
    width: 100%;
  }

  .preview-details p {
    margin: 0.5rem 0;
  }

  .preview-details strong {
    display: inline-block;
    min-width: 60px;
  }

  .preview-details code {
    font-family: monospace;
    background: var(--cds-layer-02);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.8125rem;
  }

  .preview-error {
    padding: 2rem;
    text-align: center;
    color: var(--cds-text-error);
  }

  .error-text {
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .preview-loading {
    padding: 2rem;
    text-align: center;
    color: var(--cds-text-helper);
  }

  /* Simplified preview styles (fallback) */

  .preview-cat {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
  }

  .cat-body {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    background-color: var(--preview-fur-color);
  }

  .cat-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: var(--preview-pattern);
  }

  .cat-eyes {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 1.5rem;
    color: var(--preview-eye-color);
  }

  .eye {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: currentColor;
  }

  .cat-ears {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 3rem;
    color: var(--preview-fur-color);
  }

  .ear {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 25px solid currentColor;
  }

  .preview-label {
    font-size: 0.875rem;
    color: var(--cds-text-helper);
    text-align: center;
  }

  .settings-summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    background: var(--cds-layer-02);
    border-radius: 8px;
    font-size: 0.875rem;
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
  }

  .setting-label {
    color: var(--cds-text-helper);
  }

  .setting-value {
    font-weight: 500;
    color: var(--cds-text-primary);
  }
`;
