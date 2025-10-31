/**
 * CatStatistics - Reactive statistics display for Meowzer cats
 *
 * Displays real-time statistics including:
 * - Total cats count
 * - Active/paused counts
 * - Live FPS monitoring
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";

@customElement("cat-statistics")
export class CatStatistics extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      padding: 1rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--quiet-neutral-background-softest, #f9fafb);
      border-radius: var(--quiet-border-radius-md, 0.375rem);
      border: 1px solid var(--quiet-neutral-stroke-soft, #e0e0e0);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--quiet-neutral-text-soft, #6b7280);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--quiet-neutral-text-loud, #111827);
      line-height: 1;
    }

    .stat-unit {
      font-size: 0.875rem;
      color: var(--quiet-neutral-text-mid, #4b5563);
      font-weight: 400;
      margin-left: 0.25rem;
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `;

  @consume({ context: meowzerContext, subscribe: true })
  @state()
  meowzer?: Meowzer;

  @state()
  private fps = 0;

  private catsController = new CatsController(this);
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsInterval?: number;

  get cats() {
    return this.catsController.cats;
  }

  get activeCount(): number {
    return this.cats.filter((cat) => cat.isActive).length;
  }

  get pausedCount(): number {
    return this.cats.filter((cat) => !cat.isActive).length;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startFPSMonitoring();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopFPSMonitoring();
  }

  /**
   * Start monitoring FPS
   */
  private startFPSMonitoring() {
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;

      // Update FPS every second
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    // Also update display every 100ms
    this.fpsInterval = window.setInterval(() => {
      this.requestUpdate();
    }, 100);

    measureFPS();
  }

  /**
   * Stop monitoring FPS
   */
  private stopFPSMonitoring() {
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = undefined;
    }
  }

  render() {
    return html`
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Total Cats</div>
          <div class="stat-value">${this.cats.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Active</div>
          <div class="stat-value">${this.activeCount}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Paused</div>
          <div class="stat-value">${this.pausedCount}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Frame Rate</div>
          <div class="stat-value">
            ${this.fps}<span class="stat-unit">fps</span>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cat-statistics": CatStatistics;
  }
}
