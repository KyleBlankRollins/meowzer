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
  `;
