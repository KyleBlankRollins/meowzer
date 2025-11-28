import { css } from "lit";

export const colorPickerStyles = css`
  :host {
    display: inline-block;
    position: relative;
    font-family: var(
      --mb-font-family,
      "IBM Plex Sans",
      system-ui,
      sans-serif
    );
  }

  .mb-color-picker {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--mb-color-background, #ffffff);
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-medium, 8px);
    padding: 1rem;
    box-shadow: var(
      --mb-shadow-medium,
      0 4px 6px rgba(0, 0, 0, 0.15)
    );
  }

  /* Inline variant (no border/shadow) */
  :host([inline]) .mb-color-picker {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  /* Color preview area */
  .mb-color-picker__preview {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .mb-color-picker__swatch {
    height: 48px;
    border-radius: var(--mb-radius-small, 4px);
    border: 2px solid var(--mb-color-border, #e0e0e0);
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;
    overflow: hidden;
  }

  .mb-color-picker__swatch:hover {
    transform: scale(1.05);
  }

  /* Checkerboard pattern for transparency */
  .mb-color-picker__swatch::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        45deg,
        #ccc 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    z-index: 0;
  }

  .mb-color-picker__swatch-color {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Picker controls container - absolutely positioned */
  .mb-color-picker__controls {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--mb-color-background, #ffffff);
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-medium, 8px);
    padding: 1rem;
    box-shadow: var(
      --mb-shadow-medium,
      0 4px 6px rgba(0, 0, 0, 0.15)
    );
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .mb-color-picker__input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .mb-color-picker__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mb-color-text-secondary, #525252);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mb-color-picker__text-input {
    padding: 0.5rem;
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-small, 4px);
    font-family: monospace;
    font-size: 0.875rem;
  }

  .mb-color-picker__text-input:focus {
    outline: 2px solid var(--mb-color-focus, #0f62fe);
    outline-offset: -2px;
  }

  /* Native color input (hidden but functional) */
  .mb-color-picker__native {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Saturation/Lightness grid */
  .mb-color-picker__grid {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: var(--mb-radius-small, 4px);
    cursor: crosshair;
    user-select: none;
    touch-action: none;
  }

  .mb-color-picker__grid-gradient {
    position: absolute;
    inset: 0;
    border-radius: var(--mb-radius-small, 4px);
    background: linear-gradient(to right, #ffffff, transparent),
      linear-gradient(to top, #000000, transparent);
  }

  .mb-color-picker__grid-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* Hue slider */
  .mb-color-picker__hue-slider {
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(
      to right,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
    cursor: pointer;
    user-select: none;
    touch-action: none;
  }

  .mb-color-picker__hue-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* Format toggle buttons */
  .mb-color-picker__format-buttons {
    display: flex;
    gap: 0.25rem;
    border: 1px solid var(--mb-color-border, #e0e0e0);
    border-radius: var(--mb-radius-small, 4px);
    padding: 0.25rem;
  }

  .mb-color-picker__format-button {
    flex: 1;
    padding: 0.25rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mb-color-text-secondary, #525252);
    border-radius: var(--mb-radius-small, 4px);
    transition: background-color 0.2s, color 0.2s;
  }

  .mb-color-picker__format-button:hover {
    background: var(--mb-color-layer-01, #f4f4f4);
  }

  .mb-color-picker__format-button--active {
    background: var(--mb-color-focus, #0f62fe);
    color: #ffffff;
  }
`;
