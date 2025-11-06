import { css } from "lit";

export const playgroundToolbarStyles = css`
  :host {
    display: block;
    height: 100%;
  }

  quiet-toolbar {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  quiet-button {
    width: 48px;
    height: 48px;
  }

  quiet-button[data-active] {
    background: var(--quiet-primary-background-soft);
    border-color: var(--quiet-primary-stroke-loudmb-cat-playground);
  }

  quiet-divider {
    margin: 0.5rem 0;
  }

  /* Tooltip styling for button titles */
  quiet-button::part(base) {
    position: relative;
  }
`;
