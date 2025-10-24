import { css } from "lit";

export const mbNavStyles = css`
  :host {
    display: block;
    border-bottom: 1px solid var(--quiet-neutral-stroke-soft);
    background: var(--quiet-paper-color);
  }

  nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .top-nav {
    display: flex;
    justify-content: space-between;
  }

  .site-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--quiet-text-body);
  }

  .site-title:hover {
    color: var(--quiet-primary-fill-mid);
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-link {
    text-decoration: none;
    color: var(--quiet-text-body);
    padding: 0.5rem 0.75rem;
    border-radius: var(--quiet-border-radius-md);
    transition: background-color 0.2s, color 0.2s;
    font-weight: 500;
  }

  .nav-link:hover {
    background-color: var(--quiet-neutral-fill-soft);
    color: var(--quiet-primary-fill-mid);
  }

  .nav-link.active {
    background-color: var(--quiet-primary-fill-softer);
    color: var(--quiet-primary-text-colorful);
  }
`;
