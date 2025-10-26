import type { Preview } from "@storybook/web-components";
import { setLibraryPath } from "@quietui/quiet";

// Set Quiet UI library path to stories folder where we copied the assets
setLibraryPath("/stories");

// Import Quiet UI styles (needed for components)
import "@quietui/quiet/themes/quiet.css";
import "@quietui/quiet/themes/restyle.css";

// Import Quiet UI web components (needed for rendering)
import "@quietui/quiet/components/card/card.js";
import "@quietui/quiet/components/button/button.js";
import "@quietui/quiet/components/text-field/text-field.js";
import "@quietui/quiet/components/badge/badge.js";
import "@quietui/quiet/components/callout/callout.js";
import "@quietui/quiet/components/empty-state/empty-state.js";
import "@quietui/quiet/components/icon/icon.js";
import "@quietui/quiet/components/color-picker/color-picker.js";
import "@quietui/quiet/components/popover/popover.js";
import "@quietui/quiet/components/select/select.js";
import "@quietui/quiet/components/checkbox/checkbox.js";
import "@quietui/quiet/components/text-area/text-area.js";
import "@quietui/quiet/components/spinner/spinner.js";
import "@quietui/quiet/components/button-group/button-group.js";
import "@quietui/quiet/components/divider/divider.js";
import "@quietui/quiet/components/dialog/dialog.js";

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
