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
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  cds-button svg {
    display: block;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
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

  /* Tooltip styling for button titles */
  cds-button::part(button) {
    position: relative;
  }
`;
