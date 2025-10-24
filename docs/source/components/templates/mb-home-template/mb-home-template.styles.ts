import { css } from "lit";

export const mbHomeTemplateStyles = css`
  :host {
    display: block;
  }

  .home-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .home-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .home-header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--quiet-text-body);
  }

  .home-description {
    font-size: 1.25rem;
    color: var(--quiet-text-muted);
  }

  .home-content {
    max-width: 800px;
    margin: 0 auto;
  }
`;
