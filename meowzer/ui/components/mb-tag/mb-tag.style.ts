import { css } from "lit";

export const mbTagStyles = css`
  :host {
    display: inline-block;
  }

  .mb-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--mb-space-xs);
    padding: var(--mb-space-xs) var(--mb-space-sm);
    border-radius: var(--mb-radius-full);
    font-size: var(--mb-font-size-small);
    font-weight: var(--mb-font-weight-medium);
    line-height: 1;
    white-space: nowrap;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  /* Size variants */
  .mb-tag--sm {
    padding: 2px var(--mb-space-xs);
    font-size: 0.75rem;
  }

  .mb-tag--md {
    padding: var(--mb-space-xs) var(--mb-space-sm);
    font-size: var(--mb-font-size-small);
  }

  .mb-tag--lg {
    padding: var(--mb-space-sm) var(--mb-space-md);
    font-size: var(--mb-font-size-base);
  }

  /* Color variants */
  .mb-tag--gray {
    background: var(--mb-color-surface-subtle);
    color: var(--mb-color-text-primary);
    border: 1px solid var(--mb-color-border-subtle);
  }

  .mb-tag--blue {
    background: hsl(220, 90%, 95%);
    color: hsl(220, 90%, 35%);
    border: 1px solid hsl(220, 90%, 85%);
  }

  .mb-tag--green {
    background: hsl(140, 80%, 95%);
    color: hsl(140, 80%, 30%);
    border: 1px solid hsl(140, 80%, 85%);
  }

  .mb-tag--red {
    background: hsl(0, 85%, 95%);
    color: hsl(0, 85%, 35%);
    border: 1px solid hsl(0, 85%, 85%);
  }

  .mb-tag--yellow {
    background: hsl(45, 90%, 95%);
    color: hsl(45, 90%, 30%);
    border: 1px solid hsl(45, 90%, 85%);
  }

  .mb-tag--purple {
    background: hsl(280, 80%, 95%);
    color: hsl(280, 80%, 35%);
    border: 1px solid hsl(280, 80%, 85%);
  }

  /* Remove button */
  .mb-tag__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    margin-left: var(--mb-space-xs);
    background: none;
    border: none;
    cursor: pointer;
    color: currentColor;
    opacity: 0.6;
    transition: opacity 0.15s ease;
    width: 16px;
    height: 16px;
    border-radius: var(--mb-radius-small);
  }

  .mb-tag__remove:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }

  .mb-tag__remove:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    opacity: 1;
  }

  .mb-tag__remove:active {
    transform: scale(0.95);
  }

  /* Remove icon (X) */
  .mb-tag__remove::before {
    content: "×";
    font-size: 18px;
    line-height: 1;
    font-weight: bold;
  }
`;
