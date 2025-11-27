import { css } from "lit";
import { designTokens } from "./design-tokens.js";

export const baseStyles = css`
  ${designTokens}

  :host {
    font-family: var(--mb-font-family);
    font-size: var(--mb-font-size);
    line-height: var(--mb-line-height);
    color: var(--mb-color-text-primary);
  }
`;

export const buttonBaseStyles = css`
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    transition: background-color 0.15s ease;
  }

  button:focus-visible {
    outline: 2px solid var(--mb-color-interactive-focus);
    outline-offset: 2px;
  }
`;

export const inputBaseStyles = css`
  input,
  textarea {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid var(--mb-color-border-subtle);
    background: var(--mb-color-surface-default);
    color: var(--mb-color-text-primary);
    transition: border-color 0.15s ease;
  }

  input:hover,
  textarea:hover {
    background: var(--mb-color-surface-hover);
  }

  input:focus,
  textarea:focus {
    outline: 2px solid var(--mb-color-interactive-focus);
    outline-offset: -2px;
  }
`;
