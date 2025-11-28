import { css } from "lit";
import { designTokens } from "../../../shared/design-tokens.js";

export const basicInfoSectionStyles = [
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
  `,
];
