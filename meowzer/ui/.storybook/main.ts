import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},
  async viteFinal(config) {
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Point to root node_modules (../../.. from .storybook goes: .storybook -> ui -> meowzer -> root)
    const rootNodeModules = path.resolve(
      __dirname,
      "../../../node_modules"
    );

    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = config.optimizeDeps.include || [];
    config.optimizeDeps.include.push("gsap", "gsap/MotionPathPlugin");

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      gsap: path.join(rootNodeModules, "gsap"),
    };

    return config;
  },
};

export default config;
