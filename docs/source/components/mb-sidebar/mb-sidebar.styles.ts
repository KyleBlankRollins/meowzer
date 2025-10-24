import { css } from "lit";

export const mbSidebarStyles = css`
  :host {
    display: block;
    background: var(--quiet-paper-color);
    border-right: 1px solid var(--quiet-neutral-stroke-soft);
    padding: 2rem 1rem;
    overflow-y: auto;
    height: 100%;
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-list li {
    margin-bottom: 0.5rem;
  }

  .nav-list a {
    display: block;
    padding: 0.5rem 0.75rem;
    text-decoration: none;
    color: var(--quiet-text-body);
    border-radius: var(--quiet-border-radius-md);
    transition: background-color 0.2s;
  }

  .nav-list a:hover {
    background-color: var(--quiet-neutral-fill-soft);
  }

  .nav-list li.active > a {
    background-color: var(--quiet-primary-fill-softer);
    color: var(--quiet-primary-text-colorful);
    font-weight: 600;
  }

  .nav-children {
    list-style: none;
    padding-left: 1rem;
    margin-top: 0.25rem;
  }

  .nav-divider {
    border: none;
    border-top: 1px solid var(--quiet-neutral-stroke-soft);
    margin: 1.5rem 0;
  }

  .nav-meta {
    opacity: 0.8;
  }

  .nav-meta a {
    font-size: 0.9rem;
    font-style: italic;
  }
`;
