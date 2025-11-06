import { css } from "lit";

export const playgroundToolbarStyles = css`
  :host {
    display: block;
    position: fixed;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
  }

  quiet-toolbar {
    background: var(--quiet-neutral-background-loud, #ffffff);
    border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
    border-radius: var(--quiet-border-radius-lg, 0.75rem);
    padding: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  quiet-button {
    width: 48px;
    height: 48px;
  }

  quiet-button[data-active] {
    background: var(--quiet-primary-background-soft, #dbeafe);
    border-color: var(--quiet-primary-stroke-loud, #3b82f6);
  }

  quiet-divider {
    margin: 0.5rem 0;
  }

  /* Tooltip styling for button titles */
  quiet-button::part(base) {
    position: relative;
  }
`;
