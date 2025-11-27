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

    .preset-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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
