import { css } from "lit";

export const mbDocTemplateStyles = css`
  :host {
    display: block;
  }

  .doc-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
  }

  .doc-main {
    padding: 2rem;
    max-width: 900px;
  }

  .doc-banner {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: var(--quiet-primary-fill-softer);
    border-left: 4px solid var(--quiet-primary-fill-mid);
    border-radius: var(--quiet-border-radius-md);
    color: var(--quiet-text-body);
  }

  .doc-header {
    margin-bottom: 2rem;
  }

  .doc-header h1 {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
    color: var(--quiet-text-body);
  }

  .doc-description {
    font-size: 1.125rem;
    color: var(--quiet-text-muted);
  }

  .doc-content {
    margin-bottom: 3rem;
  }

  .doc-navigation {
    display: flex;
    justify-content: space-between;
    padding-top: 2rem;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
  }

  .doc-nav-prev,
  .doc-nav-next {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--quiet-primary-fill-mid);
    border: 1px solid var(--quiet-neutral-stroke-soft);
    border-radius: var(--quiet-border-radius-md);
    transition: background-color 0.2s;
  }

  .doc-nav-prev:hover,
  .doc-nav-next:hover {
    background-color: var(--quiet-neutral-fill-soft);
  }
`;
