import { css } from "lit";

export const notificationStyles = css`
  :host {
    display: block;
    font-family: var(
      --mb-font-family,
      "IBM Plex Sans",
      system-ui,
      sans-serif
    );
  }

  .mb-notification {
    position: relative;
    display: flex;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-left: 3px solid;
    background: var(--mb-color-background);
    border-radius: var(--mb-radius-small, 4px);
    box-shadow: var(--mb-shadow-small, 0 1px 3px rgba(0, 0, 0, 0.12));
    min-height: 2.5rem;
  }

  .mb-notification--info {
    border-left-color: var(--mb-color-info, #0f62fe);
    background: var(--mb-color-info-background, #edf5ff);
  }

  .mb-notification--success {
    border-left-color: var(--mb-color-success, #24a148);
    background: var(--mb-color-success-background, #defbe6);
  }

  .mb-notification--warning {
    border-left-color: var(--mb-color-warning, #f1c21b);
    background: var(--mb-color-warning-background, #fcf4d6);
  }

  .mb-notification--error {
    border-left-color: var(--mb-color-danger, #da1e28);
    background: var(--mb-color-danger-background, #fff1f1);
  }

  .mb-notification__icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.125rem;
  }

  .mb-notification__icon svg {
    width: 100%;
    height: 100%;
  }

  .mb-notification--info .mb-notification__icon {
    color: var(--mb-color-info, #0f62fe);
  }

  .mb-notification--success .mb-notification__icon {
    color: var(--mb-color-success, #24a148);
  }

  .mb-notification--warning .mb-notification__icon {
    color: var(--mb-color-warning, #f1c21b);
  }

  .mb-notification--error .mb-notification__icon {
    color: var(--mb-color-danger, #da1e28);
  }

  .mb-notification__content {
    flex: 1;
    min-width: 0;
  }

  .mb-notification__title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    margin: 0 0 0.25rem 0;
    color: var(--mb-color-text-primary, #161616);
  }

  .mb-notification__subtitle {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin: 0;
    color: var(--mb-color-text-secondary, #525252);
  }

  .mb-notification__close {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    padding: 0;
    margin: -0.25rem -0.25rem -0.25rem 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mb-color-text-secondary, #525252);
    border-radius: var(--mb-radius-small, 4px);
    transition: background-color 0.15s ease;
  }

  .mb-notification__close:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .mb-notification__close:focus {
    outline: 2px solid var(--mb-color-focus, #0f62fe);
    outline-offset: -2px;
  }

  .mb-notification__close svg {
    width: 1rem;
    height: 1rem;
  }

  /* Low contrast variant */
  :host([low-contrast]) .mb-notification--info {
    background: var(--mb-color-layer-01, #f4f4f4);
    border-left-color: var(--mb-color-info, #0f62fe);
  }

  :host([low-contrast]) .mb-notification--success {
    background: var(--mb-color-layer-01, #f4f4f4);
    border-left-color: var(--mb-color-success, #24a148);
  }

  :host([low-contrast]) .mb-notification--warning {
    background: var(--mb-color-layer-01, #f4f4f4);
    border-left-color: var(--mb-color-warning, #f1c21b);
  }

  :host([low-contrast]) .mb-notification--error {
    background: var(--mb-color-layer-01, #f4f4f4);
    border-left-color: var(--mb-color-danger, #da1e28);
  }

  /* Toast positioning */
  :host([toast]) {
    position: fixed;
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  }

  :host([toast][position="top-right"]) {
    top: 1rem;
    right: 1rem;
  }

  :host([toast][position="top-left"]) {
    top: 1rem;
    left: 1rem;
  }

  :host([toast][position="bottom-right"]) {
    bottom: 1rem;
    right: 1rem;
  }

  :host([toast][position="bottom-left"]) {
    bottom: 1rem;
    left: 1rem;
  }

  :host([toast][position="top-center"]) {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  :host([toast][position="bottom-center"]) {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :host([toast][position="bottom-right"]) .mb-notification,
  :host([toast][position="bottom-left"]) .mb-notification,
  :host([toast][position="bottom-center"]) .mb-notification {
    animation: slideInBottom 0.3s ease;
  }

  @keyframes slideInBottom {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
