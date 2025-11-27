import { css } from "lit";

export const iconStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    display: block;
  }

  /* Size variants */
  :host([size="16"]) {
    width: 16px;
    height: 16px;
  }

  :host([size="20"]) {
    width: 20px;
    height: 20px;
  }

  :host([size="24"]) {
    width: 24px;
    height: 24px;
  }

  :host([size="32"]) {
    width: 32px;
    height: 32px;
  }

  :host([size="48"]) {
    width: 48px;
    height: 48px;
  }

  /* Custom size */
  :host {
    width: var(--mb-icon-size, 24px);
    height: var(--mb-icon-size, 24px);
  }
`;
