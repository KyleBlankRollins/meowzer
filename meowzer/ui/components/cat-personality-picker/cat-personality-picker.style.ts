import { css } from "lit";

export const catPersonalityPickerStyles = css`
  :host {
    display: block;
  }

  .personality-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preset-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .trait-sliders {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .slider-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-field label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--cds-text-secondary);
  }

  .slider-field input[type="range"] {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--cds-border-subtle-01);
    border-radius: 2px;
    outline: none;
  }

  .slider-field input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cds-background-brand);
    cursor: pointer;
  }

  .slider-field input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cds-background-brand);
    cursor: pointer;
    border: none;
  }

  .slider-value {
    font-size: 0.875rem;
    color: var(--cds-text-primary);
    font-weight: 500;
  }
`;
