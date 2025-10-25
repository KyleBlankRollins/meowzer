import { css } from "lit";

export const mbMeowbaseProviderStyles = css`
  :host {
    display: contents;
  }

  .provider-loading,
  .provider-error {
    padding: 2rem;
    text-align: center;
  }

  .provider-error {
    color: var(--quiet-destructive-text-loud);
    background: var(--quiet-destructive-fill-softer);
    border-radius: var(--quiet-radius-md);
  }

  .provider-loading {
    color: var(--quiet-neutral-text-soft);
  }
`;
