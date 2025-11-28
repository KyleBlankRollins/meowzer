import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./mb-cat-playground.js";

const meta = {
  title: "Drop-in Solutions/Cat Playground",
  component: "mb-cat-playground",
  tags: ["autodocs"],
  argTypes: {
    config: {
      control: "object",
      description: "Custom Meowzer configuration",
      table: {
        type: { summary: "Record<string, any>" },
      },
    },
    showPreview: {
      control: "boolean",
      description: "Whether to show the preview area",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showStats: {
      control: "boolean",
      description: "Whether to show statistics",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    autoInit: {
      control: "boolean",
      description: "Whether to auto-initialize Meowzer",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Cat Playground

A complete sandbox environment for experimenting with Meowzer cats. Perfect for demos, testing, and experimentation.

### Usage

\`\`\`html
<mb-cat-playground></mb-cat-playground>
\`\`\`

### Features

- Built-in MeowzerProvider (no setup required)
- Visual preview area showing cat count
- Quick action controls
- Live statistics
- Cat creation and management UI
- Fully self-contained

### Example with Configuration

\`\`\`html
<mb-cat-playground
  showPreview
  showStats
  autoInit>
</mb-cat-playground>
\`\`\`

### Events

- **playground-ready** - Dispatched when playground is initialized
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    showPreview: true,
    showStats: true,
    autoInit: true,
  },
  render: (args) => html`
    <mb-cat-playground
      .config=${args.config}
      ?showPreview=${args.showPreview}
      ?showStats=${args.showStats}
      ?autoInit=${args.autoInit}
    >
    </mb-cat-playground>
  `,
};

export const MinimalUI: Story = {
  args: {
    showPreview: false,
    showStats: false,
    autoInit: true,
  },
  render: (args) => html`
    <mb-cat-playground
      ?showPreview=${args.showPreview}
      ?showStats=${args.showStats}
      ?autoInit=${args.autoInit}
    >
    </mb-cat-playground>
  `,
};

export const PreviewOnly: Story = {
  args: {
    showPreview: true,
    showStats: false,
    autoInit: true,
  },
  render: (args) => html`
    <mb-cat-playground
      ?showPreview=${args.showPreview}
      ?showStats=${args.showStats}
      ?autoInit=${args.autoInit}
    >
    </mb-cat-playground>
  `,
};
