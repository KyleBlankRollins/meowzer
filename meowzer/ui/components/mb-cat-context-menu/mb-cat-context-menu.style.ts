import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const catContextMenuStyles = [
  designTokens,
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
      background: var(--mb-color-surface-default);
      border: 1px solid var(--mb-color-border-subtle);
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
      color: var(--mb-color-text-primary);
      font-family: inherit;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .menu-item:hover {
      background: var(--mb-color-surface-subtle);
    }

    .menu-item:active {
      background: var(--mb-color-surface-hover);
    }

    .menu-item.destructive {
      color: var(--mb-color-status-error);
    }

    .menu-item.destructive:hover {
      background: var(--mb-color-status-error);
      color: var(--mb-color-surface-default);
    }

    hr {
      margin: 4px 0;
      border: none;
      border-top: 1px solid var(--mb-color-border-subtle);
    }
  `,
];
