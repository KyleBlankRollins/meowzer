import { css } from "lit";

export const needVisualStyles = css`
  :host {
    display: block;
    position: absolute;
    pointer-events: none;
    will-change: transform;
    transition: transform 0.3s ease;
  }

  .need-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
    transition: filter 0.2s ease, transform 0.2s ease;
  }

  :host([data-active="true"]) svg {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .consuming-indicator {
    background: var(--cds-layer-accent-01);
    color: var(--cds-text-on-color);
    border: 1px solid var(--cds-border-interactive);
    border-radius: 4px;
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Interactive needs can be clicked */
  :host([interactive]) {
    pointer-events: auto;
    cursor: pointer;
  }

  :host([interactive]:hover) svg {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
    transform: scale(1.05);
  }

  /* Water gets subtle shimmer when active */
  :host([data-active="true"]) .need-container[data-type="water"] svg {
    animation: pulse 1.5s ease-in-out infinite,
      shimmer 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25)) brightness(1);
    }
    50% {
      filter: drop-shadow(0 4px 8px rgba(100, 149, 237, 0.4))
        brightness(1.1);
    }
  }
`;
