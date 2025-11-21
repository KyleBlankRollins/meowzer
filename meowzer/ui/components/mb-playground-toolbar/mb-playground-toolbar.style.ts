import { css } from "lit";

export const playgroundToolbarStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  .toolbar {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  cds-button {
    min-width: 48px;
    max-width: 48px;
    min-height: 48px;
    max-height: 48px;
  }

  /* Override Carbon's internal button styles to center SVGs */
  cds-button::part(button) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    min-height: 48px;
    width: 100%;
  }

  cds-button svg {
    display: block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin: 0 auto;
  }

  cds-button[data-active] {
    background: var(--cds-layer-accent-01);
    border-color: var(--cds-border-interactive);
  }

  .divider {
    height: 1px;
    background: var(--cds-border-subtle-01);
    margin: 0.5rem 0;
  }
`;
