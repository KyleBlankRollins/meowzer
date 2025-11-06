/**
 * CatStatistics - Reactive statistics display for Meowzer cats
 *
 * Displays real-time statistics including:
 * - Total cats count
 * - Active/paused counts
 * - Live FPS monitoring
 */

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { meowzerContext } from "../../contexts/meowzer-context.js";
import { catStatisticsStyles } from "./cat-statistics.style.js";
import { CatsController } from "../../controllers/reactive-controllers.js";
import type { Meowzer } from "meowzer";

@customElement("cat-statistics")
export class CatStatistics extends LitElement {
  static styles = [catStatisticsStyles];

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
