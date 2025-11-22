import { css } from "lit";
import { carbonTokens } from "../../../shared/carbon-tokens.js";

export const appearanceSectionStyles = [
  carbonTokens,
  css`
    :host {
      display: block;
    }

    .form-section h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--cds-text-primary);
      border-bottom: 1px solid var(--cds-border-subtle-01);
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
      color: var(--cds-text-secondary);
    }

    .select-field select {
      padding: 0.5rem;
      background: var(--cds-field-01);
      border: 1px solid var(--cds-border-subtle-01);
      border-radius: 4px;
      color: var(--cds-text-primary);
      font-size: 0.875rem;
      cursor: pointer;
    }

    .select-field select:hover {
      background: var(--cds-field-hover-01);
    }

    .select-field select:focus {
      outline: 2px solid var(--cds-focus);
      outline-offset: 2px;
    }

    @media (max-width: 600px) {
      .appearance-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
];
