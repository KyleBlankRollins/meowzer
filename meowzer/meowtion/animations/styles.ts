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
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 8px;
    padding: 4px;
  }

  .meowtion-cat:hover,
  .meowtion-cat.menu-open {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .meowtion-cat svg {
    display: block;
  }

  /* Info container */
  .meowtion-cat-info {
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    pointer-events: none;
  }

  /* Name label */
  .meowtion-cat-name {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* State label */
  .meowtion-cat-state {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #666;
    background: rgba(255, 255, 255, 0.85);
    padding: 1px 6px;
    border-radius: 8px;
    white-space: nowrap;
  }

  /* Held state visual feedback (placeholder for future) */
  .meowtion-cat.held {
    opacity: 0.8;
    filter: brightness(1.1);
    z-index: 1000;
  }

  /* Paused state */
  .meowtion-cat[data-paused="true"] {
    opacity: 0.6;
  }

  .meowtion-cat[data-paused="true"] .meowtion-cat-state {
    color: #f59e0b;
  }

  /* Context menu - no positioning, just a child element */
  .cat-context-menu {
    z-index: 1000;
    pointer-events: auto;
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
