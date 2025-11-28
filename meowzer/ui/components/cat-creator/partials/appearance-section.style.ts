import { css } from "lit";
import { designTokens } from "../../../shared/design-tokens.js";

export const appearanceSectionStyles = [
  designTokens,
  css`
    :host {
      display: block;
    }

    .form-section h4 {
      margin: 0;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--mb-color-text-primary);
      border-bottom: 1px solid var(--mb-color-border-subtle);
      padding-bottom: 0.5rem;
    }

    .appearance-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .select-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .select-field label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--mb-color-text-secondary);
    }

    .select-field select {
      padding: 0.5rem;
      background: var(--mb-color-surface-default);
      border: 1px solid var(--mb-color-border-subtle);
      border-radius: 4px;
      color: var(--mb-color-text-primary);
      font-size: 0.875rem;
      cursor: pointer;
    }

    .select-field select:hover {
      background: var(--mb-color-surface-hover);
    }

    .select-field select:focus {
      outline: 2px solid var(--mb-color-interactive-focus);
      outline-offset: 2px;
    }

    @media (max-width: 600px) {
      .appearance-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
];
