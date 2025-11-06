import { css } from "lit";

export const laserVisualStyles = css`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    display: none;
    will-change: transform;
  }

  :host([active]) {
    display: block;
  }

  .laser-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 0, 0, 1) 0%,
      rgba(255, 0, 0, 0.8) 30%,
      rgba(255, 0, 0, 0.4) 60%,
      rgba(255, 0, 0, 0) 100%
    );
    filter: blur(1px);
    animation: pulse 0.8s ease-in-out infinite;
  }

  .laser-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 0, 0, 0.3) 0%,
      rgba(255, 0, 0, 0.1) 50%,
      rgba(255, 0, 0, 0) 100%
    );
    animation: glow 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  @keyframes glow {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0.3;
    }
  }
`;
