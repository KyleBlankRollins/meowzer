import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./cat-preview.js";

const meta = {
  title: "Creation Components/Cat Preview",
  component: "cat-preview",
  tags: ["autodocs"],
  argTypes: {
    settings: {
      control: "object",
      description: "Cat appearance and personality settings",
      table: {
        type: { summary: "Partial<CatSettings>" },
        defaultValue: { summary: "{}" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Preview

A live preview component that displays a visual representation of a cat based on the current settings.
Updates in real-time as settings change during the creation process.

### Usage

\`\`\`html
<cat-preview .settings="\${catSettings}"></cat-preview>
\`\`\`

### Features

- Real-time preview of cat appearance
- Shows primary and secondary colors
- Displays selected pattern
- Visual personality indicators
- Smooth transitions between settings
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    settings: {},
  },
  render: (args) =>
    html`<cat-preview .settings=${args.settings}></cat-preview>`,
};

export const OrangeTabby: Story = {
  args: {
    settings: {
      primaryColor: "#ff8c42",
      secondaryColor: "#ffffff",
      pattern: "tabby",
    },
  },
  render: (args) =>
    html`<cat-preview .settings=${args.settings}></cat-preview>`,
};

export const BlackCat: Story = {
  args: {
    settings: {
      primaryColor: "#2c2c2c",
      secondaryColor: "#2c2c2c",
      pattern: "solid",
    },
  },
  render: (args) =>
    html`<cat-preview .settings=${args.settings}></cat-preview>`,
};

export const Calico: Story = {
  args: {
    settings: {
      primaryColor: "#ff8c42",
      secondaryColor: "#2c2c2c",
      pattern: "calico",
    },
  },
  render: (args) =>
    html`<cat-preview .settings=${args.settings}></cat-preview>`,
};

export const WithPersonality: Story = {
  args: {
    settings: {
      primaryColor: "#6b8cae",
      secondaryColor: "#ffffff",
      pattern: "tuxedo",
      personality: {
        playfulness: 80,
        independence: 40,
        affection: 70,
      },
    },
  },
  render: (args) =>
    html`<cat-preview .settings=${args.settings}></cat-preview>`,
};
