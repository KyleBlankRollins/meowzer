import { css } from "lit";

export const mbLandingTemplateStyles = css`
  :host {
    display: block;
  }

  .landing-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
  }

  .landing-main {
    padding: 2rem;
  }

  .landing-header {
    margin-bottom: 2rem;
  }

  .landing-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--quiet-text-body);
  }

  .landing-description {
    font-size: 1.125rem;
    color: var(--quiet-text-muted);
  }

  .landing-content {
    max-width: 800px;
  }
`;
