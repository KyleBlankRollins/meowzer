/**
 * Base CSS styles for cat elements (non-animated styles only)
 */

import { css } from "lit";

export const baseStyles = css`
  .meowtion-cat {
    position: absolute;
    pointer-events: auto;
    user-select: none;
    will-change: transform;
  }

  .meowtion-cat svg {
    display: block;
  }

  .meowtion-cat-name {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

/**
 * Injects base styles into the document
 */
export function injectBaseStyles(): void {
  if (typeof document === "undefined") return;

  const styleId = "meowtion-base-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = baseStyles.cssText;
  document.head.appendChild(style);
}
