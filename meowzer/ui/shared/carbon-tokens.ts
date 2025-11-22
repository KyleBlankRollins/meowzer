/**
 * Carbon Design System CSS Custom Properties
 *
 * This file re-declares Carbon's CSS custom properties so they can be
 * inherited into shadow DOM components.
 *
 * Import this in any component that needs access to Carbon tokens.
 */

import { css } from "lit";

/**
 * Carbon CSS custom properties that need to be inherited into shadow DOM
 *
 * Note: Using :host, * to ensure properties are available on host and all descendants
 */
export const carbonTokens = css`
  :host,
  * {
    /* Text colors */
    --cds-text-primary: var(--cds-text-primary, #161616);
    --cds-text-secondary: var(--cds-text-secondary, #525252);
    --cds-text-placeholder: var(--cds-text-placeholder, #a8a8a8);
    --cds-text-on-color: var(--cds-text-on-color, #ffffff);
    --cds-text-helper: var(--cds-text-helper, #6f6f6f);
    --cds-text-error: var(--cds-text-error, #da1e28);
    --cds-text-inverse: var(--cds-text-inverse, #ffffff);

    /* Background/Layer colors */
    --cds-background: var(--cds-background, #ffffff);
    --cds-background-brand: var(--cds-background-brand, #0f62fe);
    --cds-layer-01: var(--cds-layer-01, #f4f4f4);
    --cds-layer-02: var(--cds-layer-02, #ffffff);
    --cds-layer-03: var(--cds-layer-03, #f4f4f4);
    --cds-layer-accent-01: var(--cds-layer-accent-01, #e0e0e0);
    --cds-layer-hover-01: var(--cds-layer-hover-01, #e8e8e8);
    --cds-field-01: var(--cds-field-01, #f4f4f4);
    --cds-field-02: var(--cds-field-02, #ffffff);
    --cds-field-hover-01: var(--cds-field-hover-01, #e8e8e8);

    /* Border colors */
    --cds-border-subtle-01: var(--cds-border-subtle-01, #e0e0e0);
    --cds-border-strong-01: var(--cds-border-strong-01, #8d8d8d);
    --cds-border-inverse: var(--cds-border-inverse, #161616);
    --cds-border-interactive: var(--cds-border-interactive, #0f62fe);

    /* Interactive colors */
    --cds-interactive: var(--cds-interactive, #0f62fe);
    --cds-focus: var(--cds-focus, #0f62fe);
    --cds-hover-primary: var(--cds-hover-primary, #0353e9);
    --cds-active-primary: var(--cds-active-primary, #002d9c);
  }
`;
