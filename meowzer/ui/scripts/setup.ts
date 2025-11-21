/**
 * Automatic setup for Meowzer UI
 *
 * This module handles:
 * - Loading Carbon Web Components stylesheets
 * - Registering all Carbon components
 *
 * Simply import this module to automatically configure everything:
 *
 * @example
 * ```typescript
 * import '@meowzer/ui/setup';
 * ```
 */

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

// Import Meowzer UI components
import "../components/cat-color-picker/cat-color-picker.js";

/**
 * Load Carbon Web Components stylesheets dynamically
 *
 * @param useCDN - Whether to use CDN or local assets. Defaults to true.
 */
export function loadCarbonStyles(useCDN = true) {
  if (typeof document === "undefined") {
    // SSR environment, skip
    return;
  }

  const baseUrl = useCDN
    ? "https://cdn.jsdelivr.net/npm/@carbon/styles@1.0.0"
    : "/node_modules/@carbon/styles";

  // Load Carbon styles
  const carbonLink = document.createElement("link");
  carbonLink.rel = "stylesheet";
  carbonLink.href = `${baseUrl}/css/styles.css`;

  // Only add if not already present
  if (!document.querySelector(`link[href*="@carbon/styles"]`)) {
    document.head.appendChild(carbonLink);
  }

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

// Auto-initialize on import
if (typeof window !== "undefined") {
  // Load styles automatically
  loadCarbonStyles();
}
