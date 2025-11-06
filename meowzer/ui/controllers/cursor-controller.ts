/**
 * CursorController - Reactive controller for managing interaction cursors
 *
 * Handles:
 * - Loading inlined SVG content and converting to cursor data URLs
 * - Switching cursor based on placement mode
 * - Managing click listeners for placement
 * - Auto-cleanup on component disconnect
 *
 * @example
 * ```ts
 * class MyComponent extends LitElement {
 *   private cursor = new CursorController(this);
 *
 *   handlePlaceFood() {
 *     this.cursor.activate({
 *       mode: 'food:basic',
 *       onPlace: (pos) => this.meowzer.interactions.placeNeed('food:basic', pos)
 *     });
 *   }
 * }
 * ```
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  getCursorDataUrl,
  type CursorMode,
} from "../shared/cursor-assets.js";

export type PlacementMode = CursorMode | "laser" | null;

export interface PlacementOptions {
  mode: PlacementMode;
  onPlace: (position: {
    x: number;
    y: number;
  }) => void | Promise<void>;
  excludeSelector?: string; // CSS selector for elements to ignore clicks on
}

/**
 * Reactive controller for managing interaction cursors
 */
export class CursorController implements ReactiveController {
  private host: ReactiveControllerHost;
  private currentMode: PlacementMode = null;
  private clickListener?: (e: MouseEvent) => void;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected(): void {
    // Controller connected, ready to use
  }

  hostDisconnected(): void {
    // Cleanup on disconnect
    this.cancel();
  }

  /**
   * Get current active mode
   */
  getMode(): PlacementMode {
    return this.currentMode;
  }

  /**
   * Check if a mode is currently active
   */
  isActive(mode?: PlacementMode): boolean {
    if (mode) {
      return this.currentMode === mode;
    }
    return this.currentMode !== null;
  }

  /**
   * Activate placement mode with cursor
   */
  async activate(options: PlacementOptions): Promise<void> {
    // Cancel any existing mode first
    this.cancel();

    const { mode, onPlace, excludeSelector } = options;

    if (!mode || mode === "laser") {
      // Laser uses special handling (no cursor, controlled by mouse move)
      this.currentMode = mode;
      this.host.requestUpdate();
      return;
    }

    this.currentMode = mode;

    // Set cursor from inlined SVG content
    this._setCursorFromMode(mode);

    // Setup click listener for placement
    this.clickListener = async (e: MouseEvent) => {
      // Check if click is on excluded element
      if (excludeSelector) {
        const target = e.target as HTMLElement;
        if (target.closest(excludeSelector)) {
          return;
        }
      }

      // Execute placement
      await onPlace({ x: e.clientX, y: e.clientY });

      // Exit placement mode after placing
      this.cancel();
    };

    // Add listener on next tick to avoid capturing the activation button click
    setTimeout(() => {
      if (this.clickListener) {
        document.addEventListener("click", this.clickListener);
      }
    }, 0);

    this.host.requestUpdate();
  }

  /**
   * Cancel current placement mode and restore cursor
   */
  cancel(): void {
    // Remove click listener
    if (this.clickListener) {
      document.removeEventListener("click", this.clickListener);
      this.clickListener = undefined;
    }

    // Reset cursor
    document.body.style.cursor = "";

    // Clear mode
    this.currentMode = null;

    this.host.requestUpdate();
  }

  /**
   * Set cursor from inlined SVG content
   */
  private _setCursorFromMode(
    mode: Exclude<PlacementMode, "laser" | null>
  ): void {
    try {
      const dataUrl = getCursorDataUrl(mode);
      // Set cursor with hotspot at center (32x32 for 64x64 SVG)
      document.body.style.cursor = `url('${dataUrl}') 32 32, pointer`;
    } catch (error) {
      console.error("Failed to set cursor:", error);
      // Fallback to crosshair
      document.body.style.cursor = "crosshair";
    }
  }

  /**
   * Preload cursor assets (no-op since SVGs are inlined)
   * Kept for API compatibility
   */
  async preloadAssets(): Promise<void> {
    // SVGs are already inlined, no need to preload
    return Promise.resolve();
  }
}
