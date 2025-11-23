import { defineConfig } from "vite";

/**
 * Vite Configuration
 *
 * Most Vite options are configured in eleventy.config.js via the
 * @11ty/eleventy-plugin-vite plugin. This file is kept minimal and
 * only contains Vite-specific overrides if needed.
 *
 * The plugin automatically:
 * - Scans HTML for asset references (CSS, JS)
 * - Bundles assets during build
 * - Provides HMR during development
 * - Handles TypeScript/JSX/CSS preprocessing
 *
 * @see eleventy.config.js for Vite plugin configuration
 */
export default defineConfig({
  // Minimal config - let eleventy-plugin-vite handle everything
});
