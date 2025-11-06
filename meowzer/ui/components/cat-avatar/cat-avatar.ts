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

import { LitElement, html }  from "lit";
import { customElement, property } from "lit/decorators.js";
import { MeowzerUtils } from "meowzer";
import { catAvatarStyles } from "./cat-avatar.style.js";

type AvatarSize = "small" | "medium" | "large";

@customElement("cat-avatar")
export class CatAvatar extends LitElement {
  static styles = [catAvatarStyles];

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
