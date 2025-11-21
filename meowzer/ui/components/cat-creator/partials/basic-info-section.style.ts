import { css } from "lit";

export const basicInfoSectionStyles = css`
  :host {
    display: block;
  }

  .form-section {
    display: grid;
    gap: 1rem;
  }

  .form-section h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--cds-text-primary);
    border-bottom: 1px solid var(--cds-border-subtle-01);
    padding-bottom: 0.5rem;
  }
`;
