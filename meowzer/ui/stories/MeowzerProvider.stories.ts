import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../providers/meowzer-provider.js";
import "../components/cat-creator/cat-creator.js";

const meta = {
  title: "Providers/Meowzer Provider",
  component: "meowzer-provider",
  tags: ["autodocs"],
  argTypes: {
    autoInit: {
      control: "boolean",
      description: "Automatically initialize Meowzer on mount",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    config: {
      control: "object",
      description: "Custom Meowzer configuration",
      table: {
        type: { summary: "Record<string, any>" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Meowzer Provider

Context provider component that makes Meowzer functionality available to child components.

### Usage

\`\`\`html
<meowzer-provider autoInit>
  <cat-creator></cat-creator>
  <cat-manager></cat-manager>
</meowzer-provider>
\`\`\`

### Features

- **Context Provider** - Provides Meowzer instance to all children
- **IndexedDB Storage** - Browser IndexedDB for persistence (50MB+ limit)
- **Auto-Initialize** - Optionally auto-initialize on mount
- **Custom Config** - Pass custom configuration options
- **Required Wrapper** - All Meowzer UI components need this parent

### Events

- **meowzer-ready** - Emitted when Meowzer is initialized
- **meowzer-error** - Emitted if initialization fails
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    autoInit: true,
  },
  render: (args) => html`
    <meowzer-provider
      ?autoInit=${args.autoInit}
      .config=${args.config}
    >
      <div style="padding: 2rem;">
        <h3>Meowzer Provider</h3>
        <p>Cats will be saved to browser IndexedDB.</p>
        <cat-creator></cat-creator>
      </div>
    </meowzer-provider>
  `,
};

export const MultipleChildren: Story = {
  args: {
    autoInit: true,
  },
  render: (args) => html`
    <meowzer-provider
      ?autoInit=${args.autoInit}
      .config=${args.config}
    >
      <div
        style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;"
      >
        <div>
          <h3>Create Cats</h3>
          <cat-creator></cat-creator>
        </div>
        <div>
          <h3>Manage Cats</h3>
          <cat-manager></cat-manager>
        </div>
      </div>
    </meowzer-provider>
  `,
};

export const ManualInit: Story = {
  args: {
    autoInit: false,
  },
  render: (args) => html`
    <meowzer-provider
      ?autoInit=${args.autoInit}
      .config=${args.config}
    >
      <div style="padding: 2rem;">
        <h3>Manual Initialization</h3>
        <p>
          Provider won't auto-initialize. Components can call init()
          manually.
        </p>
        <cat-manager></cat-manager>
      </div>
    </meowzer-provider>
  `,
};
