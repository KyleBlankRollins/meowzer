import { css } from "lit";

export const mbTabsStyles = css`
  :host {
    display: block;
  }

  .mb-tabs {
    display: flex;
    gap: var(--mb-space-xs);
    border-bottom: 1px solid var(--mb-color-border-subtle);
  }

  .mb-tabs__tab {
    position: relative;
    padding: var(--mb-space-sm) var(--mb-space-md);
    font-family: var(--mb-font-family);
    font-size: var(--mb-font-size);
    font-weight: var(--mb-font-weight-medium);
    line-height: var(--mb-line-height-tight);
    color: var(--mb-color-text-secondary);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    user-select: none;
  }

  .mb-tabs__tab:hover:not(:disabled):not(.mb-tabs__tab--active) {
    color: var(--mb-color-text-primary);
    background: var(--mb-color-surface-hover);
  }

  .mb-tabs__tab:focus-visible {
    outline: 2px solid var(--mb-color-interactive-focus);
    outline-offset: -2px;
  }

  .mb-tabs__tab--active {
    color: var(--mb-color-text-primary);
    border-bottom-color: var(--mb-color-brand-primary);
    background-color: var(--mb-color-surface-elevated);
  }

  .mb-tabs__tab:disabled {
    color: var(--mb-color-text-disabled);
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Size variants */
  .mb-tabs__tab--sm {
    padding: var(--mb-space-xs) var(--mb-space-sm);
    font-size: var(--mb-font-size-sm);
  }

  .mb-tabs__tab--md {
    padding: var(--mb-space-sm) var(--mb-space-md);
    font-size: var(--mb-font-size);
  }

  .mb-tabs__tab--lg {
    padding: var(--mb-space-md) var(--mb-space-lg);
    font-size: var(--mb-font-size-lg);
  }
`;
