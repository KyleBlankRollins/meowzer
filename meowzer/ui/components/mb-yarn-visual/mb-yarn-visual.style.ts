import { css } from "lit";
import { designTokens } from "../../shared/design-tokens.js";

export const yarnVisualStyles = [
  designTokens,
  css`
    :host {
      display: block;
      position: absolute;
      pointer-events: none;
      will-change: transform;
    }

    .yarn-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      transition: filter 0.2s ease;
    }

    :host([data-state="dragging"]) svg {
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    :host([data-state="rolling"]) svg {
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
      animation: rolling 0.5s linear infinite;
    }

    @keyframes rolling {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* Interactive yarn can be clicked/dragged */
    :host([interactive]) {
      pointer-events: auto;
      cursor: grab;
    }

    :host([interactive][data-state="dragging"]) {
      cursor: grabbing;
    }
  `,
];
