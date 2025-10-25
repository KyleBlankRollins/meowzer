import { css } from "lit";

export const colorPickerStyles = css`
  :host {
    display: block;
  }

  .color-picker {
    position: relative;
  }

  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--quiet-neutral-text-mid);
    margin-bottom: 0.5rem;
  }

  quiet-button {
    width: 100%;
    display: flex;
    gap: 0.75rem;
  }

  .color-preview {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: var(--quiet-radius-sm);
    border: 1px solid var(--quiet-neutral-stroke-soft);
    flex-shrink: 0;
  }

  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
    flex: 1;
    text-align: left;
  }

  .popover-content {
    padding: 1rem;
  }

  .popup-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
  }
`;
