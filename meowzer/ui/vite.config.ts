import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      // Resolve gsap from UI's node_modules for SDK imports
      gsap: resolve(__dirname, "./node_modules/gsap"),
    },
    preserveSymlinks: false,
  },
  optimizeDeps: {
    // Include gsap in pre-bundling
    include: ["gsap"],
  },
});
