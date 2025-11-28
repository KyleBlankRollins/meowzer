import { css } from "lit";

export const popoverStyles = css`
  :host {
    position: relative;
    display: inline-block;
  }

  .mb-popover__trigger {
    cursor: pointer;
  }

  .mb-popover__content {
    position: fixed;
    z-index: 9999;
    background: var(--mb-color-layer-01, #ffffff);
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-md, 0.5rem);
    box-shadow: var(--mb-shadow-lg, 0 10px 20px rgba(0, 0, 0, 0.2));
    padding: var(--mb-space-sm);
    min-width: 200px;
    max-width: 400px;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95);
    transition: opacity 0.15s ease, transform 0.15s ease,
      visibility 0.15s;
    pointer-events: none;
  }

  .mb-popover__content[data-show="true"] {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    pointer-events: auto;
  }

  /* Position variants */
  .mb-popover__content[data-position="top"] {
    transform-origin: bottom center;
  }

  .mb-popover__content[data-position="bottom"] {
    transform-origin: top center;
  }

  .mb-popover__content[data-position="left"] {
    transform-origin: right center;
  }

  .mb-popover__content[data-position="right"] {
    transform-origin: left center;
  }

  /* Arrow */
  .mb-popover__arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  .mb-popover__arrow[data-position="top"] {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px 6px 0 6px;
    border-color: var(--mb-color-layer-01, #ffffff) transparent
      transparent transparent;
  }

  .mb-popover__arrow[data-position="bottom"] {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 6px 6px 6px;
    border-color: transparent transparent
      var(--mb-color-layer-01, #ffffff) transparent;
  }

  .mb-popover__arrow[data-position="left"] {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px 0 6px 6px;
    border-color: transparent transparent transparent
      var(--mb-color-layer-01, #ffffff);
  }

  .mb-popover__arrow[data-position="right"] {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px 6px 6px 0;
    border-color: transparent var(--mb-color-layer-01, #ffffff)
      transparent transparent;
  }

  /* Disabled state */
  :host([disabled]) .mb-popover__trigger {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
