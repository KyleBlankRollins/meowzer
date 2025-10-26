#!/usr/bin/env node

/**
 * Copy Quiet UI assets to dist folder
 *
 * This script copies necessary Quiet UI theme files to the dist folder
 * so users can optionally bundle them with @meowzer/ui if desired.
 *
 * Note: Users can also load these directly from @quietui/quiet in their projects.
 */

import { copyFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define assets to copy
const assets = [
  {
    src: "node_modules/@quietui/quiet/dist/themes/quiet.css",
    dest: "dist/assets/themes/quiet.css",
  },
  {
    src: "node_modules/@quietui/quiet/dist/themes/restyle.css",
    dest: "dist/assets/themes/restyle.css",
  },
];

// Only copy the search icon we actually use
const icons = [
  {
    src: "node_modules/@quietui/quiet/dist/assets/icons/outline/search.svg",
    dest: "dist/assets/icons/outline/search.svg",
  },
];

console.log("📦 Copying Quiet UI assets...\n");

let copiedCount = 0;
let errorCount = 0;

// Copy theme files
[...assets, ...icons].forEach(({ src, dest }) => {
  try {
    const srcPath = join(__dirname, "..", src);
    const destPath = join(__dirname, "..", dest);

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
    console.error(`✗ Error copying ${src}:`, error.message);
    errorCount++;
  }
});

console.log(`\n📦 Asset copy complete!`);
console.log(`   Copied: ${copiedCount} files`);
if (errorCount > 0) {
  console.log(`   Errors: ${errorCount} files`);
  process.exit(1);
}

console.log(
  "\n💡 Note: Users can also load Quiet UI assets directly:"
);
console.log('   import "@quietui/quiet/themes/quiet.css"');
