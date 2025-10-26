// @ts-check
import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [lit(), tailwind()],
  vite: {
    ssr: {
      noExternal: [
        "@meowzer/ui",
        "meowzer",
        "@quietui/quiet",
        "gsap",
      ],
    },
    optimizeDeps: {
      include: ["gsap"],
    },
  },
});
