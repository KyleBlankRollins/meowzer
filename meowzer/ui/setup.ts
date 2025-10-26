/**
 * Automatic setup for Meowzer UI
 *
 * This module handles:
 * - Loading Quiet UI stylesheets
 * - Setting the Quiet UI library path
 * - Registering all Quiet UI components
 *
 * Simply import this module to automatically configure everything:
 *
 * @example
 * ```typescript
 * import '@meowzer/ui/setup';
 * ```
 */

// Import and register Quiet UI components
import "@quietui/quiet/components/button/button.js";
import "@quietui/quiet/components/card/card.js";
import "@quietui/quiet/components/icon/icon.js";
import "@quietui/quiet/components/select/select.js";
import "@quietui/quiet/components/spinner/spinner.js";
import "@quietui/quiet/components/badge/badge.js";

// Set Quiet UI library path
import { setLibraryPath } from "@quietui/quiet";

/**
 * Initialize Quiet UI with the correct library path
 *
 * @param customPath - Optional custom path to Quiet UI assets.
 *                     Defaults to CDN if not provided.
 */
export function initializeQuietUI(customPath?: string) {
  const libraryPath =
    customPath ||
    "https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist";
  setLibraryPath(libraryPath);
}

/**
 * Load Quiet UI stylesheets dynamically
 *
 * @param useCDN - Whether to use CDN or local assets. Defaults to true.
 */
export function loadQuietUIStyles(useCDN = true) {
  if (typeof document === "undefined") {
    // SSR environment, skip
    return;
  }

  const baseUrl = useCDN
    ? "https://cdn.jsdelivr.net/npm/@quietui/quiet@1.3.0/dist"
    : "/node_modules/@quietui/quiet/dist";

  // Load Restyle (CSS reset)
  const restyleLink = document.createElement("link");
  restyleLink.rel = "stylesheet";
  restyleLink.href = `${baseUrl}/themes/restyle.css`;

  // Load Quiet UI theme
  const quietLink = document.createElement("link");
  quietLink.rel = "stylesheet";
  quietLink.href = `${baseUrl}/themes/quiet.css`;

  // Only add if not already present
  if (!document.querySelector(`link[href*="restyle.css"]`)) {
    document.head.appendChild(restyleLink);
  }

  if (!document.querySelector(`link[href*="quiet.css"]`)) {
    document.head.appendChild(quietLink);
  }
}

// Auto-initialize on import
if (typeof window !== "undefined") {
  // Load styles automatically
  loadQuietUIStyles();

  // Set library path when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeQuietUI();
    });
  } else {
    initializeQuietUI();
  }
}
