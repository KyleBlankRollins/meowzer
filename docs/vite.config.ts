import { defineConfig } from "vite";
import { meowbaseDocsPlugin } from "./vite-plugin-meowbase-docs";

export default defineConfig({
  plugins: [meowbaseDocsPlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
