import { css } from "lit";

export const accordionStyles = css`
  :host {
    display: block;
  }

  .mb-accordion {
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-md, 4px);
  }
`;

export const accordionItemStyles = css`
  :host {
    display: block;
  }

  .mb-accordion-item {
    border-bottom: 1px solid var(--mb-color-border, #e0e0e0);
  }

  .mb-accordion-item:last-child {
    border-bottom: none;
  }

  .mb-accordion-item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
    background: var(--mb-color-background, #ffffff);
    border: none;
    cursor: pointer;
    font-size: var(--mb-font-size-md, 1rem);
    font-weight: 500;
    color: var(--mb-color-text-primary, #161616);
    text-align: left;
    transition: background 150ms ease;
  }

  .mb-accordion-item__header:hover {
    background: var(--mb-color-background-hover, #f4f4f4);
  }

  .mb-accordion-item__header:focus {
    outline: 2px solid var(--mb-color-focus, #0f62fe);
    outline-offset: -2px;
  }

  .mb-accordion-item__header[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .mb-accordion-item__title {
    flex: 1;
  }

  .mb-accordion-item__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
    transition: transform 150ms ease;
  }

  .mb-accordion-item__icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .mb-accordion-item[open] .mb-accordion-item__icon {
    transform: rotate(180deg);
  }

  .mb-accordion-item__content {
    padding: 0 1rem 1rem 1rem;
    color: var(--mb-color-text-secondary, #525252);
  }

  /* Animation */
  .mb-accordion-item__content {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 200ms ease, opacity 200ms ease,
      padding 200ms ease;
  }

  .mb-accordion-item[open] .mb-accordion-item__content {
    max-height: 2000px;
    opacity: 1;
  }

  .mb-accordion-item:not([open]) .mb-accordion-item__content {
    padding-top: 0;
    padding-bottom: 0;
  }
`;
