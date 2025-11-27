import { css } from "lit";

export const tooltipStyles = css`
  :host {
    display: inline-block;
    position: relative;
  }

  .mb-tooltip {
    display: inline-block;
  }

  .mb-tooltip__content {
    position: fixed;
    z-index: 9999;
    padding: 0.5rem 0.75rem;
    background: var(--mb-color-background-inverse, #161616);
    color: var(--mb-color-text-inverse, #ffffff);
    border-radius: var(--mb-radius-sm, 4px);
    font-size: var(--mb-font-size-sm, 0.875rem);
    line-height: 1.25rem;
    max-width: 18rem;
    word-wrap: break-word;
    pointer-events: none;
    white-space: normal;
    box-shadow: var(--mb-shadow-md, 0 2px 6px rgba(0, 0, 0, 0.3));
  }

  .mb-tooltip__content[hidden] {
    display: none;
  }

  /* Arrow */
  .mb-tooltip__arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
  }

  /* Top position */
  .mb-tooltip__content[data-position="top"] {
    transform: translateX(-50%);
  }

  .mb-tooltip__content[data-position="top"] .mb-tooltip__arrow {
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--mb-color-background-inverse, #161616);
    border-bottom-width: 0;
  }

  /* Bottom position */
  .mb-tooltip__content[data-position="bottom"] {
    transform: translateX(-50%);
  }

  .mb-tooltip__content[data-position="bottom"] .mb-tooltip__arrow {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: var(--mb-color-background-inverse, #161616);
    border-top-width: 0;
  }

  /* Left position */
  .mb-tooltip__content[data-position="left"] {
    transform: translateY(-50%);
  }

  .mb-tooltip__content[data-position="left"] .mb-tooltip__arrow {
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: var(--mb-color-background-inverse, #161616);
    border-right-width: 0;
  }

  /* Right position */
  .mb-tooltip__content[data-position="right"] {
    transform: translateY(-50%);
  }

  .mb-tooltip__content[data-position="right"] .mb-tooltip__arrow {
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: var(--mb-color-background-inverse, #161616);
    border-left-width: 0;
  }

  /* Animation */
  @keyframes tooltip-fade-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes tooltip-fade-in-bottom {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes tooltip-fade-in-left {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }

  @keyframes tooltip-fade-in-right {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(4px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }

  .mb-tooltip__content[data-position="top"]:not([hidden]) {
    animation: tooltip-fade-in 150ms ease-out;
  }

  .mb-tooltip__content[data-position="bottom"]:not([hidden]) {
    animation: tooltip-fade-in-bottom 150ms ease-out;
  }

  .mb-tooltip__content[data-position="left"]:not([hidden]) {
    animation: tooltip-fade-in-left 150ms ease-out;
  }

  .mb-tooltip__content[data-position="right"]:not([hidden]) {
    animation: tooltip-fade-in-right 150ms ease-out;
  }
`;
