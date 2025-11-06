import { css } from "lit";

export const catAvatarStyles = css`
  :host {
    display: block;
  }

  .avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--quiet-neutral-background-soft, #f9fafb);
    border-radius: var(--quiet-border-radius-md, 0.375rem);
    border: 1px solid var(--quiet-neutral-stroke-softest, #f3f4f6);
    overflow: hidden;
  }

  .avatar-container.small {
    width: 60px;
    height: 60px;
  }

  .avatar-container.medium {
    width: 100px;
    height: 100px;
  }

  .avatar-container.large {
    width: 150px;
    height: 150px;
  }

  .avatar-container.no-border {
    border: none;
  }

  .avatar-container svg {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }

  .avatar-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--quiet-neutral-text-soft, #6b7280);
    font-size: 1.5rem;
  }
`;
