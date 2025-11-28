import { css } from "lit";

export const mbSliderStyles = css`
  :host {
    display: block;
  }

  .mb-slider {
    display: flex;
    flex-direction: column;
    gap: var(--mb-space-sm);
  }

  .mb-slider__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--mb-space-sm);
  }

  .mb-slider__label {
    font-size: var(--mb-font-size-base);
    font-weight: var(--mb-font-weight-medium);
    color: var(--mb-color-text-primary);
  }

  .mb-slider__value {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
    font-variant-numeric: tabular-nums;
  }

  .mb-slider__track-container {
    position: relative;
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
  }

  .mb-slider__input {
    position: absolute;
    width: 100%;
    height: 4px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    outline: none;
    z-index: 2;
  }

  /* Track */
  .mb-slider__input::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: transparent;
    border-radius: var(--mb-radius-full);
  }

  .mb-slider__input::-moz-range-track {
    width: 100%;
    height: 4px;
    background: transparent;
    border-radius: var(--mb-radius-full);
  }

  /* Background track */
  .mb-slider__track-container::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 4px;
    background: var(--mb-color-border-subtle);
    border-radius: var(--mb-radius-full);
    z-index: 0;
  }

  /* Progress fill */
  .mb-slider__progress {
    position: absolute;
    height: 4px;
    background: var(--mb-color-interactive-primary);
    border-radius: var(--mb-radius-full);
    pointer-events: none;
    transition: width 0.1s ease;
    z-index: 2;
  }

  /* Thumb */
  .mb-slider__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--mb-color-interactive-primary);
    cursor: pointer;
    position: relative;
    z-index: 2;
    border: 2px solid var(--mb-color-surface-default);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease;
  }

  .mb-slider__input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--mb-color-interactive-primary);
    cursor: pointer;
    position: relative;
    z-index: 2;
    border: 2px solid var(--mb-color-surface-default);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.15s ease;
  }

  /* Hover state */
  .mb-slider__input:hover::-webkit-slider-thumb {
    transform: scale(1.1);
  }

  .mb-slider__input:hover::-moz-range-thumb {
    transform: scale(1.1);
  }

  /* Focus state */
  .mb-slider__input:focus-visible {
    outline: none;
  }

  .mb-slider__input:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--mb-color-interactive-primary);
    outline-offset: 2px;
    transform: scale(1.15);
  }

  .mb-slider__input:focus-visible::-moz-range-thumb {
    outline: 2px solid var(--mb-color-interactive-primary);
    outline-offset: 2px;
    transform: scale(1.15);
  }

  /* Active state */
  .mb-slider__input:active::-webkit-slider-thumb {
    transform: scale(1.2);
  }

  .mb-slider__input:active::-moz-range-thumb {
    transform: scale(1.2);
  }

  /* Disabled state */
  :host([disabled]) .mb-slider__label {
    color: var(--mb-color-text-disabled);
  }

  :host([disabled]) .mb-slider__value {
    color: var(--mb-color-text-disabled);
  }

  :host([disabled]) .mb-slider__input {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :host([disabled]) .mb-slider__input::-webkit-slider-thumb {
    cursor: not-allowed;
    background: var(--mb-color-text-disabled);
  }

  :host([disabled]) .mb-slider__input::-moz-range-thumb {
    cursor: not-allowed;
    background: var(--mb-color-text-disabled);
  }

  :host([disabled]) .mb-slider__progress {
    background: var(--mb-color-text-disabled);
  }

  /* Helper text */
  .mb-slider__helper {
    font-size: var(--mb-font-size-small);
    color: var(--mb-color-text-secondary);
    margin-top: calc(var(--mb-space-xs) * -1);
  }
`;
