import { css } from "lit";

export const mbMeowzerControlsStyles = css`
  :host {
    --control-bg: var(--quiet-background-color);
    --control-border: var(--quiet-border-color);
    --control-text: var(--quiet-text-color);
    --control-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }

  .controls-container {
    position: fixed;
    bottom: 0;
    right: 20px;
    z-index: 9999;
    transition: transform 0.3s ease;
  }

  .toggle-button {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 56px;
    height: 56px;
    border-radius: 28px 28px 0 0;
    background: var(--control-bg);
    border: 1px solid var(--control-border);
    border-bottom: none;
    box-shadow: var(--control-shadow);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: transform 0.2s ease;
  }

  .toggle-button:hover {
    transform: translateY(-2px);
  }

  .controls-panel {
    position: absolute;
    bottom: 56px;
    right: 0;
    width: 300px;
    background: var(--control-bg);
    border: 1px solid var(--control-border);
    border-radius: 8px 8px 0 0;
    box-shadow: var(--control-shadow);
    padding: 16px;
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .controls-panel.expanded {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--control-text);
  }

  .cat-count {
    font-size: 12px;
    color: var(--quiet-text-color-secondary);
    padding: 4px 8px;
    background: var(--quiet-background-color-secondary);
    border-radius: 12px;
  }

  .controls-grid {
    display: grid;
    gap: 8px;
  }

  .control-button {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid var(--control-border);
    border-radius: 6px;
    background: var(--control-bg);
    color: var(--control-text);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .control-button:hover {
    background: var(--quiet-background-color-hover);
    transform: translateY(-1px);
  }

  .control-button:active {
    transform: translateY(0);
  }

  .control-button.danger {
    color: var(--quiet-color-error);
  }

  .control-button.danger:hover {
    background: var(--quiet-color-error-subtle);
  }

  .button-icon {
    font-size: 16px;
  }
`;
