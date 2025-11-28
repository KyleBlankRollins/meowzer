import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const catPersonalityPickerStyles = [
  designTokens,
  css`
    :host {
      display: block;
    }

    .personality-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .personality-section h4 {
      margin: 0;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      color: var(--mb-color-text-primary);
      border-bottom: 1px solid var(--mb-color-border-subtle);
      padding-bottom: 0.5rem;
    }

    .preset-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      background: var(--mb-color-brand-secondary);
      border: 1px solid var(--mb-color-border-subtle);
      border-radius: var(--mb-radius-md);
      padding: var(--mb-space-md);
    }

    .trait-sliders {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    @media (max-width: 900px) {
      .trait-sliders {
        grid-template-columns: 1fr;
      }
    }

    /* Slider customization */
    mb-slider {
      width: 100%;
    }

    mb-slider::part(slider-container) {
      margin-top: 0.5rem;
    }
  `,
];
