import { css } from "lit";

export const catGalleryStyles = css`
    :host {
      display: block;
    }

    .gallery-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .gallery-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .gallery-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .loading-state,
    .error-state,
    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .error-state {
      color: var(--quiet-destructive-foreground, #dc2626);
    }

    .empty-state {
      color: var(--quiet-neutral-foreground-soft, #6b7280);
    }

    .empty-state quiet-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .create-collection-dialog {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    @media (max-width: 640px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `;
