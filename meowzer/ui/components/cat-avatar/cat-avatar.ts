/**
 * CatAvatar - Reusable static SVG avatar of a cat
 *
 * Generates and displays a cat's SVG sprite from its seed.
 * Optimized for avatars, thumbnails, and previews without animation.
 *
 * @example
 * ```html
 * <cat-avatar seed="tabby-FF9500-00FF00-m-short-v1" size="small"></cat-avatar>
 * <cat-avatar seed="calico-FFAA00-0000FF-l-long-v1" size="medium"></cat-avatar>
 * ```
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MeowzerUtils } from "meowzer";

type AvatarSize = "small" | "medium" | "large";

@customElement("cat-avatar")
export class CatAvatar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .avatar-container {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--quiet-neutral-background-soft, #f9fafb);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      border: 1px solid var(--quiet-neutral-stroke-softest, #f3f4f6);
      overflow: hidden;
    }

    .avatar-container.small {
      width: 60px;
      height: 60px;
    }

    .avatar-container.medium {
      width: 100px;
      height: 100px;
    }

    .avatar-container.large {
      width: 150px;
      height: 150px;
    }

    .avatar-container svg {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }

    .avatar-error {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: var(--quiet-neutral-text-soft, #6b7280);
      font-size: 1.5rem;
    }
  `;

  /**
   * Cat seed string to generate SVG from
   */
  @property({ type: String }) seed!: string;

  /**
   * Avatar size preset
   */
  @property({ type: String }) size: AvatarSize = "medium";

  /**
   * Whether to show border
   */
  @property({ type: Boolean }) noBorder = false;

  private getCatSVG(): string {
    try {
      if (!this.seed) {
        return "";
      }
      const protoCat = MeowzerUtils.buildPreviewFromSeed(this.seed);
      return protoCat.spriteData.svg;
    } catch (error) {
      console.error("Failed to generate cat avatar:", error);
      return "";
    }
  }

  render() {
    const svg = this.getCatSVG();

    return html`
      <div
        class="avatar-container ${this.size}"
        style="${this.noBorder ? "border: none;" : ""}"
      >
        ${svg
          ? html`<div .innerHTML=${svg}></div>`
          : html`<div class="avatar-error">🐱</div>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cat-avatar": CatAvatar;
  }
}
