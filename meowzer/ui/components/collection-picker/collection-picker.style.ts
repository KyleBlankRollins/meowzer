import { css } from "lit";

export const collectionPickerStyles = css`
    :host {
      display: block;
    }

    .picker-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .picker-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--quiet-neutral-foreground, #111827);
      white-space: nowrap;
    }

    quiet-select {
      flex: 1;
      min-width: 200px;
    }

    quiet-button {
      flex-shrink: 0;
    }

    .loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }

    .error {
      padding: 0.5rem;
      color: var(--quiet-destructive-foreground, #dc2626);
      font-size: 0.875rem;
    }

    .empty {
      padding: 0.5rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      font-size: 0.875rem;
    }
  `;
