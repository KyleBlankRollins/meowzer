import { css } from "lit";

export const mbCrudDemoStyles = css`
  :host {
    display: block;
    margin: 2rem 0;
  }

  .crud-demo {
    display: grid;
    gap: 2rem;
  }

  .message {
    margin-bottom: 1rem;
  }

  .form-card form {
    display: grid;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .cats-list {
    display: grid;
    gap: 1rem;
  }

  .cats-list h3 {
    margin: 0 0 1rem 0;
    color: var(--quiet-text-heading);
    font-size: 1.25rem;
    font-weight: 600;
  }

  .cats-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .empty-state-container {
    padding: 3rem 1.5rem;
  }

  .empty-icon {
    font-size: 4rem;
    opacity: 0.3;
  }

  .loading-message {
    padding: 2rem;
    text-align: center;
    color: var(--quiet-neutral-text-soft);
  }
`;
