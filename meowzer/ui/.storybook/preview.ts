import type { Preview } from "@storybook/web-components";

// Import Carbon Web Components styles
import "@carbon/styles/css/styles.css";

// Import Carbon Web Components (needed for rendering)
import "@carbon/web-components/es/components/tile/index.js";
import "@carbon/web-components/es/components/button/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/tag/index.js";
import "@carbon/web-components/es/components/notification/index.js";
import "@carbon/web-components/es/components/icon/index.js";
import "@carbon/web-components/es/components/popover/index.js";
import "@carbon/web-components/es/components/select/index.js";
import "@carbon/web-components/es/components/checkbox/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/loading/index.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/slider/index.js";

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
