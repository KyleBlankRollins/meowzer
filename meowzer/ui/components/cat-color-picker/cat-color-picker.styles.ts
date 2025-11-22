import { css } from "lit";

export const colorPickerStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  .color-picker {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--cds-text-secondary);
  }

  .color-button {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--cds-layer-01);
    border: 1px solid var(--cds-border-subtle-01);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .color-button:hover {
    background: var(--cds-layer-hover-01);
  }

  .color-button input[type="color"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .color-preview {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid var(--cds-border-subtle-01);
    flex-shrink: 0;
    background-color: var(--color-value);
  }

  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
