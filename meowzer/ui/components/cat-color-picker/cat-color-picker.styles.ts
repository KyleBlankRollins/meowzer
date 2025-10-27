import { css } from "lit";

export const colorPickerStyles = css`
  :host {
    display: block;
  }

  .color-picker {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--quiet-neutral-text-mid);
  }

  quiet-button {
    width: 100%;
  }

  quiet-button span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .color-preview {
    width: 20px;
    height: 20px;
    border-radius: var(--quiet-radius-sm);
    border: 1px solid var(--quiet-neutral-stroke-mid);
    flex-shrink: 0;
  }

  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
  }
`;
