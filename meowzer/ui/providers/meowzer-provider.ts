/**
 * MeowzerProvider - Main context provider for Meowzer SDK
 *
 * Initializes and manages Meowzer SDK instance, providing it to all child
 * components via Lit Context. Handles lifecycle, error states, and provides
 * fallback UI during initialization.
 *
 * @example
 * ```html
 * <meowzer-provider>
 *   <cat-creator></cat-creator>
 *   <cat-manager></cat-manager>
 * </meowzer-provider>
 * ```
 *
 * @example Custom configuration
 * ```html
 * <meowzer-provider
 *   .config=${{ debug: true }}
 *   .storage=${{ enabled: true, defaultCollection: 'my-cats' }}
 *   @meowzer-ready=${this.handleReady}
 * >
 *   <cat-creator></cat-creator>
 * </meowzer-provider>
 * ```
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { Meowzer } from "meowzer";
import type { MeowzerConfig, Boundaries } from "meowzer";
import { meowzerContext } from "../contexts/meowzer-context.js";

@customElement("meowzer-provider")
export class MeowzerProvider extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  // Configuration properties
  @property({ type: Object }) config?: Partial<MeowzerConfig>;
  @property({ type: Object }) boundaries?: Boundaries;
  @property({ type: String }) container?: string; // CSS selector
  @property({ type: Boolean }) autoInit = true;

  // Provider state
  @provide({ context: meowzerContext })
  @state()
  protected meowzer?: Meowzer;

  @state() private initialized = false;
  @state() private error?: Error;

  async connectedCallback() {
    super.connectedCallback();
    if (this.autoInit) {
      await this.initialize();
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup: destroy all cats
    await this.meowzer?.cats.destroyAll();
  }

  /**
   * Initialize Meowzer SDK
   */
  private async initialize() {
    try {
      // Resolve container element
      const containerElement = this.container
        ? document.querySelector(this.container)
        : document.body;

      if (!containerElement) {
        throw new Error(
          `Container not found: ${this.container || "document.body"}`
        );
      }

      // Create Meowzer instance
      this.meowzer = new Meowzer({
        ...this.config,
        boundaries: this.boundaries,
      });

      // Initialize storage if needed
      await this.meowzer.init();
      this.initialized = true;

      // Dispatch ready event
      this.dispatchEvent(
        new CustomEvent("meowzer-ready", {
          detail: { meowzer: this.meowzer },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err as Error;
      this.dispatchEvent(
        new CustomEvent("meowzer-error", {
          detail: { error: err },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Manually trigger initialization (if autoInit is false)
   */
  public async init() {
    if (!this.initialized && !this.error) {
      await this.initialize();
    }
  }

  render() {
    // Show error state
    if (this.error) {
      return html`
        <div class="meowzer-error">
          <strong>Meowzer Error:</strong> ${this.error.message}
        </div>
      `;
    }

    // Render children (slot will receive context when ready)
    return html`<slot></slot>`;
  }
}
