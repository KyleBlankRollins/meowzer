import { css } from "lit";

export const catThumbnailStyles = css`
    :host {
      display: block;
    }

    .thumbnail {
      border: 2px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
      border-radius: var(--quiet-border-radius-lg, 0.5rem);
      padding: 1rem;
      background: var(--quiet-neutral-background, #ffffff);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .thumbnail:hover {
      border-color: var(--quiet-primary-stroke, #3b82f6);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .thumbnail-image {
      width: 100%;
      aspect-ratio: 1;
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      overflow: hidden;
    }

    .thumbnail-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-icon {
      font-size: 3rem;
      color: var(--quiet-neutral-foreground-softer, #9ca3af);
    }

    .thumbnail-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--quiet-neutral-foreground, #111827);
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .thumbnail-description {
      font-size: 0.75rem;
      color: var(--quiet-neutral-foreground-soft, #6b7280);
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .thumbnail-actions {
      display: flex;
      gap: 0.5rem;
    }

    quiet-button {
      flex: 1;
    }
  `;
