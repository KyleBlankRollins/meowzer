import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const colorPickerStyles = [
  designTokens,
  css`
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
      color: var(--mb-color-text-secondary);
    }

    .color-button {
      width: 100%;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--mb-color-surface-subtle);
      border: 1px solid var(--mb-color-border-subtle;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .color-button:hover {
      background: var(--mb-color-surface-hover);
    }

    .color-preview {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid var(--mb-color-border-subtle;
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
  `,
];
