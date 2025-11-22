import { css } from "lit";
import { carbonTokens } from "../../shared/carbon-tokens.js";

export const catContextMenuStyles = [
  carbonTokens,
  css`
    :host {
      position: fixed;
      z-index: 9999;
      display: block;
    }

    :host([open="false"]) {
      display: none;
    }

    .context-menu-content {
      background: var(--cds-layer);
      border: 1px solid var(--cds-border-subtle);
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      min-width: 160px;
      padding: 4px 0;
    }

    .menu-item {
      width: 100%;
      padding: 8px 16px;
      border: none;
      background: none;
      color: var(--cds-text-primary);
      font-family: inherit;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .menu-item:hover {
      background: var(--cds-layer-hover);
    }

    .menu-item:active {
      background: var(--cds-layer-active);
    }

    .menu-item.destructive {
      color: var(--cds-support-error);
    }

    .menu-item.destructive:hover {
      background: var(--cds-support-error);
      color: var(--cds-text-on-color);
    }

    hr {
      margin: 4px 0;
      border: none;
      border-top: 1px solid var(--cds-border-subtle);
    }
  `,
];
