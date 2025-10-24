/**
 * MeowotionContainer - Web component that provides a styled container for cats
 * Now that we use GSAP, this container is mainly for scoping
 */

import { LitElement, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { meowtionContainerStyles } from "./meowtion-container.styles.js";

@customElement("meowtion-container")
export class MeowtionContainer extends LitElement {
  @query(".meowtion-container")
  private containerElement!: HTMLDivElement;

  static styles = meowtionContainerStyles;

  render() {
    return html`
      <div class="meowtion-container">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Get the container element for appending cats
   */
  get container(): HTMLElement {
    return this.containerElement || this;
  }

  /**
   * Get the boundaries of the container
   */
  getBoundaries() {
    const rect =
      this.containerElement?.getBoundingClientRect() ||
      this.getBoundingClientRect();
    return {
      minX: 0,
      maxX: rect.width,
      minY: 0,
      maxY: rect.height,
    };
  }
}
