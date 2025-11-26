#!/usr/bin/env node

/**
 * Copy Carbon Web Components assets to dist folder
 *
 * This script copies necessary Carbon theme files to the dist folder
 * so users can optionally bundle them with @meowzer/ui if desired.
 *
 * Note: Users can also load these directly from @carbon/styles in their projects.
 */

import { copyFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the package root (go up from dist/scripts/ to package root)
const packageRoot = join(__dirname, "..", "..");

// Interaction SVGs for cat interactions feature
const interactions = [
  // Food
  {
    src: "assets/interactions/food/basic-default.svg",
    dest: "dist/assets/interactions/food/basic-default.svg",
  },
  {
    src: "assets/interactions/food/basic-active.svg",
    dest: "dist/assets/interactions/food/basic-active.svg",
  },
  {
    src: "assets/interactions/food/fancy-default.svg",
    dest: "dist/assets/interactions/food/fancy-default.svg",
  },
  {
    src: "assets/interactions/food/fancy-active.svg",
    dest: "dist/assets/interactions/food/fancy-active.svg",
  },
  // Water
  {
    src: "assets/interactions/water/default.svg",
    dest: "dist/assets/interactions/water/default.svg",
  },
  {
    src: "assets/interactions/water/active.svg",
    dest: "dist/assets/interactions/water/active.svg",
  },
  // Toys
  {
    src: "assets/interactions/toys/laser-pointer-default.svg",
    dest: "dist/assets/interactions/toys/laser-pointer-default.svg",
  },
  {
    src: "assets/interactions/toys/laser-pointer-active.svg",
    dest: "dist/assets/interactions/toys/laser-pointer-active.svg",
  },
  {
    src: "assets/interactions/toys/rc-car-default.svg",
    dest: "dist/assets/interactions/toys/rc-car-default.svg",
  },
  {
    src: "assets/interactions/toys/rc-car-active.svg",
    dest: "dist/assets/interactions/toys/rc-car-active.svg",
  },
  {
    src: "assets/interactions/toys/yarn-default.svg",
    dest: "dist/assets/interactions/toys/yarn-default.svg",
  },
  {
    src: "assets/interactions/toys/yarn-active.svg",
    dest: "dist/assets/interactions/toys/yarn-active.svg",
  },
];

console.log("📦 Copying interaction assets...\n");

let copiedCount = 0;
let errorCount = 0;

// Copy interaction SVGs
interactions.forEach(({ src, dest }) => {
  try {
    const srcPath = join(packageRoot, src);
    const destPath = join(packageRoot, dest);

    // Check if source exists
    if (!existsSync(srcPath)) {
      console.warn(`⚠️  Warning: Source file not found: ${src}`);
      errorCount++;
      return;
    }

    // Create destination directory if it doesn't exist
    mkdirSync(dirname(destPath), { recursive: true });

    // Copy file
    copyFileSync(srcPath, destPath);
    console.log(`✓ Copied: ${dest}`);
    copiedCount++;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(`✗ Error copying ${src}:`, errorMessage);
    errorCount++;
  }
});

console.log(`\n📦 Asset copy complete!`);
console.log(`   Copied: ${copiedCount} files`);
if (errorCount > 0) {
  console.log(`   Errors: ${errorCount} files`);
  process.exit(1);
}
