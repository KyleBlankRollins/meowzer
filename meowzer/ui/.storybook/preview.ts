import type { Preview } from "@storybook/web-components";

// Import Quiet UI styles (needed for components)
import "@quietui/quiet/themes/quiet.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
        {
          name: "gray",
          value: "#f5f5f5",
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Getting Started",
          "Providers",
          "Creation Components",
          "Management Components",
          "Gallery Components",
          "Drop-in Solutions",
          "Examples",
        ],
      },
    },
  },
};

export default preview;
