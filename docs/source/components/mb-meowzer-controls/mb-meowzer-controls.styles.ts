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
    left: 20px;
    z-index: 9999;
    transition: transform 0.3s ease;
  }

  .toggle-button {
    position: absolute;
    bottom: 0;
    left: 0;
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
    left: 0;
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

  /* Creator Modal */
  .creator-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .creator-content {
    background: var(--control-bg);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .creator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--control-border);
    position: sticky;
    top: 0;
    background: var(--control-bg);
    z-index: 1;
  }

  .creator-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--control-text);
  }

  .close-button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--control-text);
    font-size: 20px;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  .close-button:hover {
    background: var(--quiet-background-color-hover);
  }

  /* Saved Cats Section */
  .saved-cats-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--control-border);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--control-text);
  }

  .saved-count {
    font-size: 11px;
    color: var(--quiet-text-color-secondary);
    padding: 2px 6px;
    background: var(--quiet-background-color-secondary);
    border-radius: 10px;
  }

  .loading,
  .empty-state {
    text-align: center;
    padding: 24px 16px;
    font-size: 13px;
    color: var(--quiet-text-color-secondary);
  }

  quiet-search-list {
    display: block;
  }

  quiet-search-list quiet-text-field {
    margin-bottom: 12px;
  }

  quiet-search-list::part(items) {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  quiet-search-list::part(items)::-webkit-scrollbar {
    width: 6px;
  }

  quiet-search-list::part(items)::-webkit-scrollbar-track {
    background: var(--quiet-background-color-secondary);
    border-radius: 3px;
  }

  quiet-search-list::part(items)::-webkit-scrollbar-thumb {
    background: var(--control-border);
    border-radius: 3px;
  }

  quiet-search-list::part(items)::-webkit-scrollbar-thumb:hover {
    background: var(--quiet-text-color-secondary);
  }

  /* Quiet Card Customization */
  quiet-card {
    --spacing: 0.75rem;
  }

  quiet-card::part(media) {
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  quiet-card::part(footer) {
    justify-content: flex-end;
    padding: 0.5rem 0.75rem;
  }

  .cat-preview {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cat-preview svg {
    width: 100%;
    height: 100%;
  }

  .cat-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }

  .cat-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--control-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cat-meta {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .status-badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
    background: var(--quiet-background-color);
    color: var(--quiet-text-color-secondary);
    border: 1px solid var(--control-border);
  }

  .status-badge.active {
    background: var(--quiet-color-success-subtle);
    color: var(--quiet-color-success);
    border-color: var(--quiet-color-success);
  }

  .cat-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border: 1px solid var(--control-border);
    border-radius: 4px;
    background: var(--control-bg);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: var(--quiet-background-color-hover);
    transform: scale(1.05);
  }

  .action-btn:active {
    transform: scale(0.95);
  }

  .action-btn.danger:hover {
    background: var(--quiet-color-error-subtle);
    border-color: var(--quiet-color-error);
  }
`;
