import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/mb-cat-overlay/mb-cat-overlay.js";

const meta: Meta = {
  title: "Drop-in Solutions/Cat Overlay",
  component: "mb-cat-overlay",
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left",
      ],
      description: "Position of the overlay panel",
      table: {
        defaultValue: { summary: "bottom-right" },
      },
    },
    initiallyMinimized: {
      control: "boolean",
      description: "Whether the overlay starts minimized",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    initialTab: {
      control: "select",
      options: ["create", "manage", "gallery"],
      description: "Initial tab to show",
      table: {
        defaultValue: { summary: "create" },
      },
    },
    autoInit: {
      control: "boolean",
      description: "Whether to auto-initialize Meowzer on connect",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Complete drop-in overlay component for Meowzer cats.

This is the killer feature - a single component that includes:
- Built-in Meowzer Provider
- Built-in cat boundary (fullscreen)
- Tabbed UI (Create/Manage/Gallery)
- Minimize/maximize functionality
- Positioning options

## Usage

\`\`\`html
<mb-cat-overlay></mb-cat-overlay>
\`\`\`

That's it! Cats now work on your site.

## Custom Configuration

\`\`\`html
<mb-cat-overlay
  position="top-left"
  initially-minimized
  initial-tab="gallery"
></mb-cat-overlay>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<mb-cat-overlay></mb-cat-overlay>`,
};

export const TopLeft: Story = {
  args: {
    position: "top-left",
  },
  render: (args: any) => html`
    <mb-cat-overlay position=${args.position}></mb-cat-overlay>
  `,
};

export const InitiallyMinimized: Story = {
  args: {
    initiallyMinimized: true,
  },
  render: (args: any) => html`
    <mb-cat-overlay
      .initiallyMinimized=${args.initiallyMinimized}
    ></mb-cat-overlay>
  `,
};

export const GalleryTab: Story = {
  args: {
    initialTab: "gallery",
  },
  render: (args: any) => html`
    <mb-cat-overlay initial-tab=${args.initialTab}></mb-cat-overlay>
  `,
};
