/**
 * Automatic setup for Meowzer UI
 *
 * This module handles:
 * - Loading Carbon Web Components stylesheets
 * - Registering all Carbon components
 * - Configuring Shoelace components
 *
 * Simply import this module to automatically configure everything:
 *
 * @example
 * ```typescript
 * import '@meowzer/ui/setup';
 * ```
 */

// Configure Shoelace base path for icons and assets
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

// Import and register Shoelace components
import "@shoelace-style/shoelace/dist/components/color-picker/color-picker.js";

// Set base path to Shoelace CDN (you can also use a local path if you copy the assets)
setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/"
);

// Import and register Carbon Web Components
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/icon/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/tooltip/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/popover/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/slider/index.js";

// Import Meowzer UI components
import "../components/cat-color-picker/cat-color-picker.js";

/**
 * Load Carbon Web Components stylesheets dynamically
 *
 * Note: It's recommended to import '@meowzer/ui/styles' directly in your HTML/layout
 * instead of relying on this dynamic loader for better SSR and build tool support.
 */
export function loadCarbonStyles() {
  if (typeof document === "undefined") {
    // SSR environment, skip
    return;
  }

  // Check if styles are already loaded
  if (
    document.querySelector(`link[href*="carbon"]`) ||
    document.querySelector(`style[data-carbon]`)
  ) {
    return;
  }

  console.warn(
    "[Meowzer UI] Carbon styles not detected. " +
      'Please import "@meowzer/ui/styles" in your HTML <head> or layout component.'
  );

  // Set default theme
  if (
    !document.documentElement.classList.contains("cds-theme-g10") &&
    !document.documentElement.classList.contains("cds-theme-g90")
  ) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.add(
      prefersDark ? "cds-theme-g90" : "cds-theme-g10"
    );
  }
}

/**
 * Load Shoelace stylesheets dynamically
 *
 * Note: It's recommended to import '@meowzer/ui/styles/shoelace-light' directly
 * instead of relying on this dynamic loader for better SSR and build tool support.
 */
export function loadShoelaceStyles() {
  if (typeof document === "undefined") {
    // SSR environment, skip
    return;
  }

  // Check if Shoelace styles are already loaded
  if (document.querySelector(`link[href*="shoelace"]`)) {
    return;
  }

  console.warn(
    "[Meowzer UI] Shoelace styles not detected. " +
      'Please import "@meowzer/ui/styles/shoelace-light" in your HTML <head> or layout component.'
  );
}

// Auto-initialize on import
if (typeof window !== "undefined") {
  // Load styles automatically
  loadCarbonStyles();
  loadShoelaceStyles();
}
